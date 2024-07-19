import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

import api from "@docspace/shared/api";

import { TFile, TFolder } from "@docspace/shared/api/files/types";
import FilesFilter, {
  TSortBy,
  TSortOrder,
} from "@docspace/shared/api/files/filter";

import { TRoom } from "@docspace/shared/api/rooms/types";
import RoomsFilter from "@docspace/shared/api/rooms/filter";

import { toastr } from "@docspace/shared/components/toast";

import { ROOMS_PROVIDER_TYPE_NAME } from "@docspace/shared/constants";

import { isDesktop } from "@docspace/shared/utils";
import { getDaysRemaining, isPublicRoom } from "@docspace/shared/utils/common";

import { SettingsStore } from "@docspace/shared/store/SettingsStore";
import { UserStore } from "@docspace/shared/store/UserStore";

import {
  FileStatus,
  FilterKeys,
  FilterType,
  FolderType,
  RoomSearchArea,
  RoomsProviderType,
  RoomsType,
  ShareAccessRights,
} from "@docspace/shared/enums";

import {
  getCategoryTypeByFolderType,
  getCategoryUrl,
} from "SRC_DIR/helpers/utils";
import { CategoryType } from "SRC_DIR/helpers/constants";

import FilesStore from "./FilesStore";
import SelectedFolderStore from "./SelectedFolderStore";
import TreeFoldersStore from "./TreeFoldersStore";
import ClientLoadingStore from "./ClientLoadingStore";
import PublicRoomStore from "./PublicRoomStore";
import InfoPanelStore from "./InfoPanelStore";
import PluginStore from "./PluginStore";
import FilesSettingsStore from "./FilesSettingsStore";
import ThirdPartyStore from "./ThirdPartyStore";

let requestCounter = 0;

const NotFoundHttpCode = 404;
const ForbiddenHttpCode = 403;
const PaymentRequiredHttpCode = 402;
const UnauthorizedHttpCode = 401;

class FilesListStore {
  files: Map<string | number, TFile> = new Map();

  folders: Map<string | number, TFolder | TRoom> = new Map();

  isEmptyPage: boolean = false;

  roomsController = new AbortController();

  filesController = new AbortController();

  constructor(
    private settingsStore: SettingsStore,
    private selectedFolderStore: SelectedFolderStore,
    private treeFoldersStore: TreeFoldersStore,
    private clientLoadingStore: ClientLoadingStore,
    private userStore: UserStore,
    private publicRoomStore: PublicRoomStore,
    private infoPanelStore: InfoPanelStore,
    private pluginStore: PluginStore,
    private filesSettingsStore: FilesSettingsStore,
    private thirdPartyStore: ThirdPartyStore,

    private filesStore: FilesStore,
  ) {
    makeAutoObservable(this);
  }

  setIsEmptyPage = (isEmptyPage: boolean) => {
    this.isEmptyPage = isEmptyPage;
  };

  setFile = (file: TFile) => {
    if (!this.files.has(file.id)) return;

    this.files.set(file.id, file);
    this.filesStore.createThumbnail(file);
  };

  setFiles = (files: TFile[]) => {
    const { socketHelper } = this.settingsStore;

    if (this.files.size > 0) {
      const roomParts = Array.from(this.files.keys()).map((k) => `FILE-${k}`);

      socketHelper.emit({
        command: "unsubscribe",
        data: {
          roomParts,
          individual: true,
        },
      });
    }

    const newFiles: Map<string | number, TFile> = new Map();
    const newRoomParts: string[] = [];

    files.forEach((value) => {
      const key = value.id;
      newFiles.set(key, value);
      newRoomParts.push(`FILE-${key}`);
    });

    this.files = newFiles;

    if (newRoomParts.length) {
      socketHelper.emit({
        command: "subscribe",
        data: {
          roomParts: newRoomParts,
          individual: true,
        },
      });
    }

    this.filesStore.createThumbnails(files);
  };

  updateFileStatus = (id: string | number | undefined, status: FileStatus) => {
    if (!id) return;

    const item = this.files.get(id);

    if (item) this.files.set(id, { ...item, fileStatus: status });
  };

  getFileInfo = async (id: string | number) => {
    const fileInfo = await api.files.getFileInfo(id);

    this.setFile(fileInfo);

    return fileInfo;
  };

  setFolder = (folder: TRoom | TFolder) => {
    if (!this.folders.has(folder.id)) return;

    this.folders.set(folder.id, folder);
  };

  setFolders = (folders: TRoom[] | TFolder[]) => {
    const { socketHelper } = this.settingsStore;

    if (folders.length === 0) return;

    if (this.folders.size > 0) {
      const roomParts = Array.from(this.folders.keys()).map((k) => `DIR-${k}`);

      socketHelper.emit({
        command: "unsubscribe",
        data: {
          roomParts,
          individual: true,
        },
      });
    }

    const newFolders: Map<string | number, TRoom | TFolder> = new Map();
    const newRoomParts: string[] = [];

    folders.forEach((value) => {
      const key = value.id;
      newFolders.set(key, value);
      newRoomParts.push(`DIR-${key}`);
    });

    this.folders = newFolders;

    socketHelper.emit({
      command: "subscribe",
      data: {
        roomParts: newRoomParts,
        individual: true,
      },
    });
  };

  addFolder = (folder: TRoom | TFolder) => {
    const { socketHelper } = this.settingsStore;

    const newFolders = new Map([
      [folder.id, folder],
      ...this.folders.entries(),
    ]);

    socketHelper.emit({
      command: "subscribe",
      data: {
        roomParts: `DIR-${folder.id}`,
        individual: true,
      },
    });

    this.folders = newFolders;
  };

  removeFolder = (key: string | number) => {
    this.folders.delete(key);
  };

  updateRoomMute = (id: string | number, mute: boolean) => {
    const room = this.folders.get(id);

    if (!room) return;

    this.folders.set(id, { ...room, mute });
  };

  getFolderInfo = async (id: string | number) => {
    const folderInfo = await api.files.getFolderInfo(id);

    this.setFolder(folderInfo);

    return folderInfo;
  };

  clearFiles = () => {
    this.files = new Map();
    this.folders = new Map();

    this.selectedFolderStore.setSelectedFolder(null);
  };

  abortAllFetch = () => {
    this.filesController.abort();
    this.roomsController.abort();
    this.filesController = new AbortController();
    this.roomsController = new AbortController();
  };

  fetchFiles = async (
    folderId: string | number,
    filter: FilesFilter,
    clearFilter: boolean = true,
    withSubfolders: boolean = false,
    clearSelection: boolean = true,
  ) => {
    const { setSelectedNode } = this.treeFoldersStore;

    if (this.clientLoadingStore.isLoading) {
      this.abortAllFetch();
    }

    const filterData = filter ? filter.clone() : FilesFilter.getDefault();
    filterData.folder = folderId;

    if (folderId === "@my" && this.userStore.user?.isVisitor) {
      const url = getCategoryUrl(CategoryType.Shared);

      window.DocSpace.navigate(
        `${url}?${RoomsFilter.getDefault().toUrlParams()}`,
      );

      return;
    }

    this.filesStore.setIsErrorRoomNotAvailable(false);

    const filterStorageItem =
      this.userStore.user?.id &&
      localStorage.getItem(`UserFilter=${this.userStore.user.id}`);

    if (filterStorageItem && !filter) {
      const splitFilter = filterStorageItem.split(",");

      filterData.sortBy = splitFilter[0] as TSortBy;
      filterData.pageCount = +splitFilter[1];
      filterData.sortOrder = splitFilter[2] as TSortOrder;
    }

    if (!this.settingsStore.withPaging) {
      filterData.page = 0;
      filterData.pageCount = 100;
    }

    const defaultFilter = FilesFilter.getDefault();

    const { filterType, searchInContent } = filterData;

    if (typeof filterData.withSubfolders !== "boolean")
      filterData.withSubfolders = defaultFilter.withSubfolders;

    if (typeof searchInContent !== "boolean")
      filterData.searchInContent = defaultFilter.searchInContent;

    if (!Object.keys(FilterType).find((key) => FilterType[key] === filterType))
      filterData.filterType = defaultFilter.filterType;

    setSelectedNode([`${folderId}`]);

    try {
      const folder = await api.files.getFolder(
        folderId,
        filterData,
        this.filesController.signal,
      );

      let newTotal = folder.total;

      // fixed row loader if total and items length is different
      const itemsLength = folder.folders.length + folder.files.length;
      if (itemsLength < filterData.pageCount) {
        newTotal =
          filterData.page > 0
            ? itemsLength + this.files.size + this.folders.size
            : itemsLength;
      }

      filterData.total = newTotal;

      if (
        (folder.current.roomType === RoomsType.PublicRoom ||
          folder.current.roomType === RoomsType.FormRoom ||
          folder.current.roomType === RoomsType.CustomRoom) &&
        !this.publicRoomStore.isPublicRoom
      ) {
        await this.publicRoomStore.getExternalLinks(folder.current.id);
      }

      if (newTotal > 0) {
        const lastPage = filterData.getLastPage();

        if (filterData.page > lastPage) {
          filterData.page = lastPage;

          return this.fetchFiles(
            folderId,
            filterData,
            clearFilter,
            withSubfolders,
          );
        }
      }

      runInAction(() => {
        if (!this.publicRoomStore.isPublicRoom) {
          this.filesStore.categoryType = getCategoryTypeByFolderType(
            folder.current.rootFolderType,
            folder.current.parentId,
          );
        }
      });

      if (this.filesStore.isPreview) {
        // save filter for after closing preview change url
        this.filesStore.setTempFilter(filterData);
      } else {
        this.filesStore.setFilesFilter(filterData); // TODO: FILTER
      }

      const isPrivacyFolder =
        folder.current.rootFolderType === FolderType.Privacy;

      let inRoom = false;

      const navigationPath = await Promise.all(
        folder.pathParts.map(async (f, idx) => {
          const { Rooms, Archive } = FolderType;

          const isCurrentFolder = folder.current.id === f.id;

          const folderInfo = isCurrentFolder
            ? folder.current
            : { ...f, id: f.id };

          const { title, roomType } = folderInfo;

          inRoom = inRoom || (!!roomType && !isCurrentFolder);

          const isRootRoom =
            idx === 0 &&
            (folder.current.rootFolderType === Rooms ||
              folder.current.rootFolderType === Archive);

          let shared;
          let canCopyPublicLink;

          if (idx === 1) {
            let room = folder.current;

            if (!isCurrentFolder) {
              room = await api.files.getFolderInfo(folderId);
              shared = room.shared;
              canCopyPublicLink =
                room.access === ShareAccessRights.RoomManager ||
                room.access === ShareAccessRights.None;

              if ("canCopyPublicLink" in room)
                room.canCopyPublicLink = canCopyPublicLink;
              this.infoPanelStore.setInfoPanelRoom(room);
            }

            const { mute } = room;

            runInAction(() => {
              this.filesStore.isMuteCurrentRoomNotifications = mute;
            });
          }

          return {
            id: folderId,
            title,
            isRoom: !!roomType,
            roomType,
            isRootRoom,
            shared,
            canCopyPublicLink,
          };
        }),
      ).then((res) => {
        return res
          .filter((item, index) => {
            return index !== res.length - 1;
          })
          .reverse();
      });
      this.selectedFolderStore.setSelectedFolder({
        folders: folder.folders,
        ...folder.current,
        inRoom,
        isRoom: !!folder.current.roomType,
        pathParts: folder.pathParts,
        navigationPath,
        ...{ new: folder.new },
        // type,
      });

      runInAction(() => {
        const isEmptyList = [...folder.folders, ...folder.files].length === 0;

        if (filter && isEmptyList) {
          const {
            authorType,
            roomId,
            search,
            withSubfolders: curWithSubFolders,
            filterType: curFilterType,
            searchInContent: curSearchInContent,
          } = filter;

          const isFiltered =
            authorType ||
            roomId ||
            search ||
            curWithSubFolders ||
            curFilterType ||
            curSearchInContent;

          if (isFiltered) {
            this.setIsEmptyPage(false);
          } else {
            this.setIsEmptyPage(isEmptyList);
          }
        } else {
          this.setIsEmptyPage(isEmptyList);
        }
        this.setFolders(isPrivacyFolder && !isDesktop() ? [] : folder.folders);
        this.setFiles(isPrivacyFolder && !isDesktop() ? [] : folder.files);
      });

      if (clearFilter) {
        if (clearSelection) {
          // Find not processed
          const tempSelection = this.filesStore.selection.filter(
            (f) =>
              !this.filesStore.activeFiles.find((elem) => elem.id === f.id),
          );
          const tempBuffer =
            this.filesStore.bufferSelection &&
            this.filesStore.activeFiles.find(
              (elem) => elem.id === this.filesStore.bufferSelection?.id,
            ) == null
              ? this.filesStore.bufferSelection
              : null;

          // console.log({ tempSelection, tempBuffer });

          // Clear all selections
          this.filesStore.setSelected("close");

          // TODO: see bug 63479
          if (this.selectedFolderStore?.id === folderId) {
            // Restore not processed
            if (tempSelection.length)
              this.filesStore.setSelection(tempSelection);
            if (tempBuffer) this.filesStore.setBufferSelection(tempBuffer);
          }
        }
      }

      this.clientLoadingStore.setIsSectionHeaderLoading(false);

      const selectedFolder = {
        selectedFolder: { ...this.selectedFolderStore },
      };

      if (this.filesStore.createdItem) {
        const newItem = this.filesList.find(
          (item) => item.id === this.filesStore.createdItem?.id,
        );

        if (newItem) {
          this.filesStore.setBufferSelection(newItem);
          this.filesStore.setScrollToItem({
            id: newItem.id,
            type: this.filesStore.createdItem?.type,
          });
        }

        this.filesStore.setCreatedItem(null);
      }

      if (isPublicRoom()) {
        return folder;
      }

      return selectedFolder;
    } catch (err) {
      if (err?.response?.status === 402)
        this.filesStore.currentTariffStatusStore.setPortalTariff();

      const isThirdPartyError = Number.isNaN(+folderId);

      if (requestCounter > 0 && !isThirdPartyError) return;

      requestCounter = +1;

      const isUserError = [
        NotFoundHttpCode,
        ForbiddenHttpCode,
        PaymentRequiredHttpCode,
        UnauthorizedHttpCode,
      ].includes(err?.response?.status);

      if (isUserError && !isThirdPartyError) {
        this.filesStore.setIsErrorRoomNotAvailable(true);
      } else if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else {
        toastr.error(err);
        if (isThirdPartyError) {
          const userId = this.userStore?.user?.id;
          const searchArea = window.DocSpace.location.pathname.includes(
            "shared",
          )
            ? RoomSearchArea.Active
            : RoomSearchArea.Archive;

          window.DocSpace.navigate(
            `${window.DocSpace.location.pathname}?${RoomsFilter.getDefault(userId, searchArea).toUrlParams(userId, true)}`,
          );
        }
        return;
      }
    } finally {
      if (window?.DocSpace?.location?.state?.highlightFileId) {
        this.filesStore.setHighlightFile({
          highlightFileId: window.DocSpace.location.state.highlightFileId,
          isFileHasExst: window.DocSpace.location.state.isFileHasExst,
        });
      }
    }
  };

  fetchRooms = async (
    folderId,
    filter,
    clearFilter = true,
    withSubfolders = false,
    clearSelection = true,
    withFilterLocalStorage = false,
  ) => {
    const { setSelectedNode } = this.treeFoldersStore;

    if (this.clientLoadingStore.isLoading) {
      this.abortAllFetch();
    }

    const filterData = filter
      ? filter.clone()
      : RoomsFilter.getDefault(this.userStore.user?.id);

    if (!this.settingsStore.withPaging) {
      const isCustomCountPage =
        filter && filter.pageCount !== 100 && filter.pageCount !== 25;

      if (!isCustomCountPage) {
        filterData.page = 0;
        filterData.pageCount = 100;
      }
    }

    if (folderId) setSelectedNode([`${folderId}`]);

    const defaultFilter = RoomsFilter.getDefault();

    const { provider, quotaFilter, type } = filterData;

    if (!ROOMS_PROVIDER_TYPE_NAME[provider])
      filterData.provider = defaultFilter.provider;

    if (
      quotaFilter &&
      quotaFilter !== FilterKeys.customQuota &&
      quotaFilter !== FilterKeys.defaultQuota
    )
      filterData.quotaFilter = defaultFilter.quotaFilter;

    if (type && !RoomsType[type]) filterData.type = defaultFilter.type;

    try {
      const rooms = await api.rooms.getRooms(
        filterData,
        this.roomsController.signal,
      );

      if (!folderId) setSelectedNode([`${rooms.current.id}`]);

      filterData.total = rooms.total;

      if (rooms.total > 0) {
        const lastPage = filterData.getLastPage();

        if (filterData.page > lastPage) {
          filterData.page = lastPage;

          return this.fetchRooms(
            folderId,
            filterData,
            undefined,
            undefined,
            undefined,
            true,
          );
        }

        runInAction(() => {
          this.filesStore.categoryType = getCategoryTypeByFolderType(
            rooms.current.rootFolderType,
            rooms.current.parentId,
          );
        });

        this.filesStore.setRoomsFilter(filterData);

        runInAction(() => {
          const isEmptyList = rooms.folders.length === 0;
          if (filter && isEmptyList) {
            const {
              subjectId,
              filterValue,
              type: curType,
              withSubfolders: withRoomsSubfolders,
              searchInContent: searchInContentRooms,
              tags,
              withoutTags,
              quotaFilter: curQuotaFilter,
              provider: curProvider,
            } = filter;

            const isFiltered =
              subjectId ||
              filterValue ||
              curType ||
              curProvider ||
              withRoomsSubfolders ||
              searchInContentRooms ||
              tags ||
              withoutTags ||
              curQuotaFilter;

            if (isFiltered) {
              this.setIsEmptyPage(false);
            } else {
              this.setIsEmptyPage(isEmptyList);
            }
          } else {
            this.setIsEmptyPage(isEmptyList);
          }

          this.setFolders(rooms.folders);
          this.setFiles([]);

          if (clearFilter) {
            if (clearSelection) {
              this.filesStore.setSelected("close");
            }
          }

          this.infoPanelStore.setInfoPanelRoom(null);
          this.selectedFolderStore.setSelectedFolder({
            folders: rooms.folders,
            ...rooms.current,
            pathParts: rooms.pathParts,
            navigationPath: [],
            ...{ new: rooms.new },
          });

          this.clientLoadingStore.setIsSectionHeaderLoading(false);

          const selectedFolder = {
            selectedFolder: { ...this.selectedFolderStore },
          };

          if (this.filesStore.createdItem) {
            const newItem = this.filesStore.filesList.find(
              (item) => item.id === this.filesStore.createdItem?.id,
            );

            if (newItem) {
              this.filesStore.setBufferSelection(newItem);
              this.filesStore.setScrollToItem({
                id: newItem.id,
                type: this.filesStore.createdItem?.type,
              });
            }

            this.filesStore.setCreatedItem(null);
          }
          this.filesStore.setIsErrorRoomNotAvailable(false);

          return selectedFolder;
        });
      }
    } catch (err) {
      if (err?.response?.status === 402)
        this.filesStore.currentTariffStatusStore.setPortalTariff();

      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else {
        toastr.error(err);
      }
    }
  };

  getFilesListItems = (items: (TFile | TFolder | TRoom)[]) => {
    const { fileItemsList } = this.pluginStore;
    const { enablePlugins } = this.settingsStore;
    const { getIcon } = this.filesSettingsStore;

    return items.map((item) => {
      const { id, rootFolderId, access } = item;

      let thirdPartyIcon = "";
      let providerType = "";

      if ("providerKey" in item) {
        thirdPartyIcon = this.thirdPartyStore.getThirdPartyIcon(
          item.providerKey,
          "small",
        );
      }

      if ("providerKey" in item) {
        providerType =
          RoomsProviderType[
            Object.keys(RoomsProviderType).find(
              (key) => key === item.providerKey,
            )
          ];
      }

      let canOpenPlayer = false;
      let needConvert = false;

      if ("viewAccessibility" in item) {
        canOpenPlayer =
          item.viewAccessibility?.ImageView ||
          item.viewAccessibility?.MediaView;

        needConvert = item.viewAccessibility?.MustConvert;
      }

      const previewUrl = canOpenPlayer
        ? this.filesStore.getItemUrl(id, false, needConvert, canOpenPlayer)
        : null;

      const contextOptions = this.filesStore.getFilesContextOptions(item);
      const isThirdPartyFolder =
        "providerKey" in item && item.providerKey && id === rootFolderId;

      const iconSize = this.filesStore.viewAs === "table" ? 24 : 32;

      let isFolder = false;

      if ("parentId" in item) {
        this.folders.forEach((value) => {
          if (value.id === item.id && value.parentId === item.parentId)
            isFolder = true;
        });
      }

      const { isRecycleBinFolder } = this.treeFoldersStore;

      const folderUrl =
        isFolder && this.filesStore.getItemUrl(id, isFolder, false, false);

      const isEditing =
        "fileStatus" in item && item.fileStatus === FileStatus.IsEditing;

      const docUrl =
        !canOpenPlayer &&
        !isFolder &&
        this.filesStore.getItemUrl(id, false, needConvert);

      const href = isRecycleBinFolder
        ? null
        : previewUrl || (!isFolder ? docUrl : folderUrl);

      const isRoom = "roomType" in item && !!item.roomType;

      const logo = "logo" in item ? item.logo : null;

      const fileExst = "fileExst" in item ? item.fileExst : undefined;
      const providerKey = "providerKey" in item ? item.providerKey : null;
      const contentLength =
        "contentLength" in item ? item.contentLength : undefined;
      const roomType = "roomType" in item ? item.roomType : undefined;
      const isArchive = "isArchive" in item ? item.isArchive : undefined;
      const type = "type" in item ? item.type : undefined;

      const icon =
        isRoom && logo?.medium
          ? logo?.medium
          : getIcon(
              iconSize,
              fileExst,
              providerKey,
              contentLength,
              roomType,
              isArchive,
              type,
            );

      const defaultRoomIcon = isRoom
        ? getIcon(
            iconSize,
            fileExst,
            providerKey,
            contentLength,
            roomType,
            isArchive,
            type,
          )
        : undefined;

      const pluginOptions = {
        fileTypeName: "",
        isPlugin: false,
        fileTileIcon: "",
      };

      if (enablePlugins && fileItemsList) {
        fileItemsList.forEach(({ value }) => {
          if (value.extension === fileExst) {
            if (value.fileTypeName)
              pluginOptions.fileTypeName = value.fileTypeName;
            pluginOptions.isPlugin = true;
            if (value.fileIconTile)
              pluginOptions.fileTileIcon = value.fileIconTile;
          }
        });
      }

      const isForm = fileExst === ".oform";

      const canCopyPublicLink =
        access === ShareAccessRights.RoomManager ||
        access === ShareAccessRights.None;

      return {
        ...item,

        access,
        daysRemaining:
          "autoDelete" in item &&
          item.autoDelete &&
          getDaysRemaining(item.autoDelete),

        contentLength,
        contextOptions,

        fileExst,

        icon,
        defaultRoomIcon,
        id,
        isFolder,
        logo,

        rootFolderId,

        providerKey,
        canOpenPlayer,

        previewUrl,
        folderUrl,
        href,
        isThirdPartyFolder,
        isEditing,
        roomType,
        isRoom,
        isArchive,

        thirdPartyIcon,
        providerType,

        ...pluginOptions,

        type,

        isForm,
        canCopyPublicLink,
      };
    });
  };

  get filesList() {
    const newFolders = Array.from(this.folders.values());

    newFolders.sort((a, b) => {
      const firstValue = a.roomType ? 1 : 0;
      const secondValue = b.roomType ? 1 : 0;

      return secondValue - firstValue;
    });

    const items = [...newFolders, ...Array.from(this.files.values())];

    if (items.length > 0 && this.isEmptyPage) {
      this.setIsEmptyPage(false);
    }

    return this.getFilesListItems(items);
  }
}

export default FilesListStore;
