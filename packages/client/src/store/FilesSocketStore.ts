/* eslint-disable no-console */
import { makeAutoObservable, runInAction } from "mobx";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import debounce from "lodash/debounce";

import api from "@docspace/shared/api";
import { TFile } from "@docspace/shared/api/files/types";
import { TOptSocket } from "@docspace/shared/utils/socket";
import { SettingsStore } from "@docspace/shared/store/SettingsStore";
import { UserStore } from "@docspace/shared/store/UserStore";
import { Events, FileStatus } from "@docspace/shared/enums";
import { PDF_FORM_DIALOG_KEY } from "@docspace/shared/constants";

import FilesStore from "./FilesStore";
import ClientLoadingStore from "./ClientLoadingStore";
import SelectedFolderStore from "./SelectedFolderStore";
import TreeFoldersStore from "./TreeFoldersStore";
import InfoPanelStore from "./InfoPanelStore";
import FilesListStore from "./FilesListStore";

class FilesSocketStore {
  constructor(
    private settingsStore: Readonly<SettingsStore>,
    private clientLoadingStore: Readonly<ClientLoadingStore>,
    private selectedFolderStore: Readonly<SelectedFolderStore>,
    private treeFoldersStore: Readonly<TreeFoldersStore>,
    private infoPanelStore: Readonly<InfoPanelStore>,
    private userStore: Readonly<UserStore>,

    private filesListStore: Readonly<FilesListStore>,

    private filesStore: Readonly<FilesStore>,
  ) {
    makeAutoObservable(this);

    const { socketHelper } = settingsStore;

    socketHelper.on("s:modify-folder", async (opt) => {
      const { socketSubscribers } = socketHelper;

      if (opt && typeof opt !== "string" && opt.data) {
        const data = JSON.parse(opt.data);

        const pathParts = data.folderId
          ? `DIR-${data.folderId}`
          : `DIR-${data.parentId}`;

        if (
          !socketSubscribers.has(pathParts) &&
          !socketSubscribers.has(`DIR-${data.id}`)
        ) {
          console.log("[WS] s:modify-folder: SKIP UNSUBSCRIBED", { data });
          return;
        }
      }

      console.log("[WS] s:modify-folder", opt);

      if (
        !(this.clientLoadingStore.isLoading || this.filesStore.operationAction)
      ) {
        switch (typeof opt !== "string" && opt?.cmd) {
          case "create":
            this.wsModifyFolderCreate(opt);
            break;
          case "update":
            this.wsModifyFolderUpdate(opt);
            break;
          case "delete":
            this.wsModifyFolderDelete(opt);
            break;
          default:
            break;
        }
      }

      if (
        typeof opt !== "string" &&
        opt?.cmd &&
        opt.id &&
        (opt.type === "file" || opt.type === "folder") &&
        (opt.cmd === "create" || opt.cmd === "delete")
      ) {
        if (opt.type === "file") {
          if (opt.cmd === "create") {
            this.selectedFolderStore.increaseFilesCount();
          } else {
            this.selectedFolderStore.decreaseFilesCount();
          }
        } else if (opt.type === "folder")
          if (opt.cmd === "create") {
            this.selectedFolderStore.increaseFoldersCount();
          } else {
            this.selectedFolderStore.decreaseFoldersCount();
          }
      }

      this.treeFoldersStore.updateTreeFoldersItem(opt);
    });

    socketHelper.on("s:update-history", (opt) => {
      if (typeof opt === "string") return;

      const { infoPanelSelection, fetchHistory } = this.infoPanelStore;

      const { id, type } = opt;

      let infoPanelSelectionType = "file";
      if (infoPanelSelection?.isRoom || infoPanelSelection?.isFolder)
        infoPanelSelectionType = "folder";

      if (id === infoPanelSelection?.id && type === infoPanelSelectionType) {
        console.log("[WS] s:update-history", id);
        fetchHistory();
      }
    });

    socketHelper.on("refresh-folder", (id) => {
      const { socketSubscribers } = socketHelper;
      const pathParts = `DIR-${id}`;

      if (!socketSubscribers.has(pathParts)) return;

      if (!id || this.clientLoadingStore.isLoading) return;

      if (
        this.selectedFolderStore.id?.toString() === id.toString() &&
        this.settingsStore.withPaging // TODO: no longer deletes the folder in other tabs
      ) {
        console.log("[WS] refresh-folder", id);
        this.filesStore.fetchFiles(id, this.filesStore.filter);
      }
    });

    socketHelper.on("s:markasnew-folder", (opt) => {
      if (typeof opt === "string") return;

      const { socketSubscribers } = socketHelper;

      const { folderId, count } = opt;
      const pathParts = `DIR-${folderId}`;

      if (!socketSubscribers.has(pathParts)) return;

      console.log(`[WS] markasnew-folder ${folderId}:${count}`);

      const foundIndex =
        folderId && this.filesStore.folders.findIndex((x) => x.id === folderId);
      if (foundIndex === -1 || !foundIndex) return;

      runInAction(() => {
        this.filesStore.folders[foundIndex].new =
          typeof count !== "undefined" && Number(count) >= 0 ? count : 0;
        this.treeFoldersStore.fetchTreeFolders();
      });
    });

    socketHelper.on("s:markasnew-file", (opt) => {
      if (typeof opt === "string") return;
      const { fileId, count } = opt;

      if (!fileId) return;

      const { socketSubscribers } = socketHelper;
      const pathParts = `FILE-${fileId}`;

      if (!socketSubscribers.has(pathParts)) return;

      console.log(`[WS] markasnew-file ${fileId}:${count}`);

      this.treeFoldersStore.fetchTreeFolders();

      const fileStatus = this.filesListStore.files.get(fileId)?.fileStatus;

      const status =
        typeof count !== "undefined" && Number(count) > 0 && !fileStatus
          ? FileStatus.IsNew
          : fileStatus === FileStatus.IsNew
            ? FileStatus.None
            : fileStatus || FileStatus.None;

      if (status !== fileStatus)
        this.filesListStore.updateFileStatus(fileId, status);
    });

    // WAIT FOR RESPONSES OF EDITING FILE
    socketHelper.on("s:start-edit-file", (id) => {
      if (typeof id !== "string") return;

      const { socketSubscribers } = socketHelper;

      const pathParts = `FILE-${id}`;

      if (!socketSubscribers.has(pathParts)) return;

      console.log(`[WS] s:start-edit-file`, id);

      const fileStatus = this.filesListStore.files.get(id)?.fileStatus;

      this.filesStore.updateSelectionStatus(
        id,
        fileStatus || FileStatus.IsEditing,
        true,
      );

      this.filesListStore.updateFileStatus(
        id,
        fileStatus || FileStatus.IsEditing,
      );
    });

    socketHelper.on("s:modify-room", (option) => {
      if (typeof option === "string") return;
      switch (option.cmd) {
        case "create-form":
          this.wsCreatedPDFForm(option);
          break;

        default:
          break;
      }
    });

    socketHelper.on("s:stop-edit-file", (id) => {
      if (typeof id !== "string") return;

      const { socketSubscribers } = socketHelper;
      const pathParts = `FILE-${id}`;

      const { isVisible, infoPanelSelection, setInfoPanelSelection } =
        this.infoPanelStore;

      if (!socketSubscribers.has(pathParts)) return;

      console.log(`[WS] s:stop-edit-file`, id);

      const currFile = this.filesListStore.files.get(id);
      const fileStatus = currFile?.fileStatus;
      const status =
        fileStatus === FileStatus.IsEditing
          ? FileStatus.None
          : fileStatus || FileStatus.None;

      this.filesStore.updateSelectionStatus(id, status, false);

      this.filesListStore.updateFileStatus(id, status);

      this.filesStore.getFileInfo(id).then((file) => {
        if (
          isVisible &&
          file.id === infoPanelSelection?.id &&
          infoPanelSelection?.fileExst === file.fileExst
        ) {
          setInfoPanelSelection(merge(cloneDeep(infoPanelSelection), file));
        }
      });

      this.filesStore.createThumbnail(currFile);
    });

    this.filesStore.createNewFilesQueue.on("resolve", this.onResolveNewFile);
  }

  wsModifyFolderCreate = async (opt: TOptSocket | string) => {
    if (typeof opt === "string") return;

    if (opt?.type === "file" && opt?.id && opt.data) {
      const curFile = this.filesListStore.files.get(opt.id);

      const file = JSON.parse(opt?.data);

      if (this.selectedFolderStore.id !== file.folderId) {
        const folder = this.filesListStore.folders.get(file.folderId);
        if (folder)
          this.filesListStore.folders.set(folder.id, {
            ...folder,
            filesCount: folder.filesCount + 1,
          });

        return;
      }

      // To update a file version
      if (curFile && !this.settingsStore.withPaging) {
        if (
          curFile.version !== file.version ||
          curFile.versionGroup !== file.versionGroup
        ) {
          curFile.version = file.version;
          curFile.versionGroup = file.versionGroup;
        }
        this.filesStore.checkSelection(file);
      }

      if (curFile) return;

      setTimeout(() => {
        const foundFile = this.filesListStore.files.get(file.id);

        if (foundFile) {
          // console.log("Skip in timeout");
          return null;
        }

        this.filesStore.createNewFilesQueue.enqueue(() => {
          const foundedFile = this.filesListStore.files.get(file.id);

          if (foundedFile) {
            // console.log("Skip in queue");
            return null;
          }

          return api.files.getFileInfo(file.id);
        });
      }, 300);
    } else if (opt?.type === "folder" && opt?.id && opt?.data) {
      const curFolder = this.filesListStore.folders.get(opt.id);

      if (curFolder) return;

      const folder = JSON.parse(opt?.data);

      if (
        this.selectedFolderStore.id?.toString() !== folder.parentId.toString()
      ) {
        const parentFolder = this.filesListStore.folders.get(folder?.parentId);

        if (parentFolder)
          this.filesListStore.folders.set(parentFolder.id, {
            ...parentFolder,
            filesCount: folder.filesCount + 1,
          });
      }

      if (
        this.selectedFolderStore.id !== folder.parentId ||
        (folder.roomType &&
          folder.createdBy.id === this.userStore?.user?.id &&
          this.filesStore.roomCreated)
      ) {
        return this.filesStore.setRoomCreated(false);
      }

      const folderInfo = await api.files.getFolderInfo(folder.id);

      console.log("[WS] create new folder", folderInfo.id, folderInfo.title);

      const newFolders = new Map([
        [folder.id, folderInfo],
        ...this.filesListStore.folders.entries(),
      ]);

      if (
        this.filesListStore.folders.size > this.filesStore.filter.pageCount &&
        this.settingsStore.withPaging
      ) {
        this.filesListStore.removeFolder(Array.from(newFolders.keys()).pop()); // Remove last
      }

      const newFilter = this.filesStore.filter;
      newFilter.total += 1;

      runInAction(() => {
        this.filesStore.setFilter(newFilter);
        this.filesListStore.addFolder(folderInfo);
      });
    }
  };

  wsModifyFolderUpdate = (opt: TOptSocket | string) => {
    if (typeof opt === "string") return;

    if (opt?.type === "file" && opt?.data) {
      const file = JSON.parse(opt?.data);
      if (!file || !file.id) return;

      this.filesStore.getFileInfo(file.id); // this.setFile(file);
      console.log("[WS] update file", file.id, file.title);

      this.filesStore.checkSelection(file);
    } else if (opt?.type === "folder" && opt?.data) {
      const folder = JSON.parse(opt?.data);
      if (!folder || !folder.id) return;

      api.files
        .getFolderInfo(folder.id)
        .then(this.filesListStore.setFolder)
        .catch(() => {
          // console.log("Folder deleted")
        });

      console.log("[WS] update folder", folder.id, folder.title);

      if (this.filesStore.selection?.length) {
        const foundIndex = this.filesStore.selection?.findIndex(
          (x) => x.id === folder.id,
        );
        if (foundIndex > -1) {
          runInAction(() => {
            this.filesStore.selection[foundIndex] = folder;
          });
        }
      }

      if (this.filesStore.bufferSelection) {
        const foundIndex = [this.filesStore.bufferSelection].findIndex(
          (x) => x.id === folder.id,
        );
        if (foundIndex > -1) {
          runInAction(() => {
            this.filesStore.bufferSelection[foundIndex] = folder;
          });
        }
      }

      if (folder.id === this.selectedFolderStore.id) {
        this.selectedFolderStore.setSelectedFolder({ ...folder });
      }
    }
  };

  wsModifyFolderDelete = (opt: TOptSocket | string) => {
    if (typeof opt === "string") return;

    if (opt?.type === "file" && opt?.id) {
      const foundIndex = this.filesStore.files.findIndex(
        (x) => x.id === opt?.id,
      );
      if (foundIndex === -1) return;

      console.log(
        "[WS] delete file",
        this.filesStore.files[foundIndex].id,
        this.filesStore.files[foundIndex].title,
      );

      const tempActionFilesIds = JSON.parse(
        JSON.stringify(this.filesStore.tempActionFilesIds),
      );
      tempActionFilesIds.push(this.filesStore.files[foundIndex].id);

      this.filesStore.setTempActionFilesIds(tempActionFilesIds);

      this.debounceRemoveFiles();

      // Hide pagination when deleting files
      runInAction(() => {
        this.filesStore.isHidePagination = true;
      });

      runInAction(() => {
        if (
          this.filesStore.files.length === 0 &&
          this.filesStore.folders.length === 0 &&
          this.filesStore.pageItemsLength > 1
        ) {
          this.filesStore.isLoadingFilesFind = true;
        }
      });
    } else if (opt?.type === "folder" && opt?.id) {
      const foundIndex = this.filesStore.folders.findIndex(
        (x) => x.id === opt?.id,
      );
      if (foundIndex == -1) return;

      console.log(
        "[WS] delete folder",
        this.filesStore.folders[foundIndex].id,
        this.filesStore.folders[foundIndex].title,
      );

      const tempActionFoldersIds = JSON.parse(
        JSON.stringify(this.filesStore.tempActionFoldersIds),
      );
      tempActionFoldersIds.push(this.filesStore.folders[foundIndex].id);

      this.filesStore.setTempActionFoldersIds(tempActionFoldersIds);
      this.debounceRemoveFolders();

      runInAction(() => {
        this.filesStore.isHidePagination = true;
      });

      runInAction(() => {
        if (
          this.filesStore.files.length === 0 &&
          this.filesStore.folders.length === 0 &&
          this.filesStore.pageItemsLength > 1
        ) {
          this.filesStore.isLoadingFilesFind = true;
        }
      });
    }
  };

  wsCreatedPDFForm = (option: TOptSocket) => {
    if (!option.data) return;

    const file = JSON.parse(option.data);

    if (this.selectedFolderStore.id !== file.folderId) return;

    const localKey = `${PDF_FORM_DIALOG_KEY}-${this.userStore?.user?.id}`;

    const isFirst = JSON.parse(localStorage.getItem(localKey) ?? "true");

    const event = new CustomEvent(Events.CREATE_PDF_FORM_FILE, {
      detail: {
        file,
        isFill: !option.isOneMember,
        isFirst,
      },
    });

    if (isFirst) localStorage.setItem(localKey, "false");

    window?.dispatchEvent(event);
  };

  onResolveNewFile = (fileInfo: TFile) => {
    if (!fileInfo) return;

    if (this.filesStore.files.findIndex((x) => x.id === fileInfo.id) > -1)
      return;

    if (this.selectedFolderStore.id !== fileInfo.folderId) return;

    console.log("[WS] create new file", { fileInfo });

    const newFiles = [fileInfo, ...this.filesStore.files];

    if (
      newFiles.length > this.filesStore.filter.pageCount &&
      this.settingsStore.withPaging
    ) {
      newFiles.pop(); // Remove last
    }

    const newFilter = this.filesStore.filter;
    newFilter.total += 1;

    runInAction(() => {
      this.filesStore.setFilter(newFilter);
      this.filesStore.setFiles(newFiles);
    });

    this.debounceFetchTreeFolders();
  };

  debounceFetchTreeFolders = debounce(() => {
    this.treeFoldersStore.fetchTreeFolders();
  }, 1000);

  debounceRemoveFiles = debounce(() => {
    this.filesStore.removeFiles(this.filesStore.tempActionFilesIds);
  }, 1000);

  debounceRemoveFolders = debounce(() => {
    this.filesStore.removeFiles(null, this.filesStore.tempActionFoldersIds);
  }, 1000);
}

export default FilesSocketStore;
