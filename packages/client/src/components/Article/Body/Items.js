// (c) Copyright Ascensio System SIA 2009-2024
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import PropTypes from "prop-types";
import styled from "styled-components";
import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";

import {
  FolderType,
  ShareAccessRights,
  DeviceType,
} from "@docspace/shared/enums";
import { FOLDER_NAMES } from "@docspace/shared/constants";
import { getCatalogIconUrlByType } from "@docspace/shared/utils/catalogIconHelper";

import { ArticleItem } from "@docspace/shared/components/article-item";
import DragAndDrop from "@docspace/shared/components/drag-and-drop/DragAndDrop";

import BonusItem from "./BonusItem";
import AccountsItem from "./AccountsItem";

import ClearTrashReactSvgUrl from "PUBLIC_DIR/images/clear.trash.react.svg?url";

const StyledDragAndDrop = styled(DragAndDrop)`
  display: contents;
`;

const CatalogDivider = styled.div`
  height: 16px;
`;

const Item = ({
  t,
  item,
  dragging,
  getFolderIcon,
  setBufferSelection,
  isActive,
  getEndOfBlock,
  showText,
  onClick,
  onMoveTo,
  onBadgeClick,
  showDragItems,
  startUpload,
  uploadEmptyFolders,
  setDragging,
  showBadge,
  labelBadge,
  iconBadge,
  folderId,
  currentColorScheme,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const isDragging = dragging ? showDragItems(item) : false;

  let value = "";
  if (isDragging) value = `${item.id} dragging`;

  const onDropZoneUpload = React.useCallback(
    (files, uploadToFolder) => {
      dragging && setDragging(false);
      const emptyFolders = files.filter((f) => f.isEmptyDirectory);

      if (emptyFolders.length > 0) {
        uploadEmptyFolders(emptyFolders, uploadToFolder).then(() => {
          const onlyFiles = files.filter((f) => !f.isEmptyDirectory);
          if (onlyFiles.length > 0) startUpload(onlyFiles, uploadToFolder, t);
        });
      } else {
        startUpload(files, uploadToFolder, t);
      }
    },
    [t, dragging, setDragging, startUpload, uploadEmptyFolders],
  );

  const onDrop = React.useCallback(
    (items) => {
      if (!isDragging) return dragging && setDragging(false);

      const { fileExst, id } = item;

      if (!fileExst) {
        onDropZoneUpload(items, id);
      } else {
        onDropZoneUpload(items);
      }
    },
    [item, startUpload, dragging, setDragging],
  );

  const onDragOver = React.useCallback(
    (dragActive) => {
      if (dragActive !== isDragActive) {
        setIsDragActive(dragActive);
      }
    },
    [isDragActive],
  );

  const onDragLeave = React.useCallback(() => {
    setIsDragActive(false);
  }, []);

  const onClickAction = React.useCallback(
    (e, folderId) => {
      setBufferSelection(null);

      onClick &&
        onClick(
          e,
          folderId,
          item.title,
          item.rootFolderType,
          item.security.Create,
        );
    },
    [onClick, item.title, item.rootFolderType],
  );

  return (
    <StyledDragAndDrop
      key={item.id}
      data-title={item.title}
      value={value}
      onDrop={onDrop}
      dragging={dragging && isDragging}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={"document-catalog"}
    >
      <ArticleItem
        key={item.id}
        id={item.id}
        folderId={folderId}
        className={`tree-drag ${item.folderClassName} document-catalog`}
        icon={getFolderIcon(item)}
        showText={showText}
        text={item.title}
        isActive={isActive}
        onClick={onClickAction}
        onDrop={onMoveTo}
        isEndOfBlock={getEndOfBlock(item)}
        isDragging={isDragging}
        isDragActive={isDragActive && isDragging}
        value={value}
        showBadge={showBadge}
        labelBadge={labelBadge}
        onClickBadge={onBadgeClick}
        iconBadge={iconBadge}
        badgeTitle={labelBadge ? "" : t("EmptyRecycleBin")}
        $currentColorScheme={currentColorScheme}
      />
    </StyledDragAndDrop>
  );
};

const Items = ({
  t,
  data,
  showText,

  onClick,
  onBadgeClick,

  dragging,
  setDragging,
  startUpload,
  uploadEmptyFolders,
  isVisitor,
  isCollaborator,
  isAdmin,
  myId,
  commonId,
  currentId,
  draggableItems,
  setBufferSelection,

  moveDragItems,

  setEmptyTrashDialogVisible,
  trashIsEmpty,

  onHide,
  firstLoad,
  deleteAction,
  startDrag,

  activeItemId,
  emptyTrashInProgress,

  isCommunity,
  isPaymentPageAvailable,
  currentDeviceType,
  folderAccess,
  currentColorScheme,
}) => {
  const getEndOfBlock = React.useCallback((item) => {
    switch (item.key) {
      case "0-3":
      case "0-5":
      case "0-6":
        return true;
      default:
        return false;
    }
  }, []);

  const getFolderIcon = React.useCallback((item) => {
    return getCatalogIconUrlByType(item.rootFolderType);
  }, []);

  const showDragItems = React.useCallback(
    (item) => {
      if (item.id === currentId) {
        return false;
      }

      if (
        !draggableItems ||
        draggableItems.find(
          (x) => x.id === item.id && x.isFolder === item.isFolder,
        )
      )
        return false;

      const isArchive = draggableItems.find(
        (f) => f.rootFolderType === FolderType.Archive,
      );

      if (
        item.rootFolderType === FolderType.SHARE &&
        item.access === ShareAccessRights.FullAccess
      ) {
        return true;
      }

      if (item.rootFolderType === FolderType.TRASH && startDrag && !isArchive) {
        return draggableItems.some(
          (draggableItem) => draggableItem.security.Delete,
        );
      }

      if (item.rootFolderType === FolderType.USER) {
        return (
          folderAccess === ShareAccessRights.None ||
          folderAccess === ShareAccessRights.FullAccess ||
          folderAccess === ShareAccessRights.RoomManager
        );
      }

      return false;
    },
    [currentId, draggableItems, isAdmin],
  );

  const onMoveTo = React.useCallback(
    (destFolderId, title) => {
      moveDragItems(destFolderId, title, {
        copy: t("Common:CopyOperation"),
        move: t("Common:MoveToOperation"),
      });
    },
    [moveDragItems, t],
  );

  const onRemove = React.useCallback(() => {
    const translations = {
      deleteOperation: t("Translations:DeleteOperation"),
      deleteFromTrash: t("Translations:DeleteFromTrash"),
      deleteSelectedElem: t("Translations:DeleteSelectedElem"),
      FileRemoved: t("Files:FileRemoved"),
      FolderRemoved: t("Files:FolderRemoved"),
    };

    deleteAction(translations);
  }, [deleteAction]);

  const onEmptyTrashAction = () => {
    currentDeviceType === DeviceType.mobile && onHide();
    setEmptyTrashDialogVisible(true);
  };

  const getItems = React.useCallback(
    (data) => {
      const items = data.map((item, index) => {
        const isTrash = item.rootFolderType === FolderType.TRASH;
        const showBadge = emptyTrashInProgress
          ? false
          : item.newItems
            ? item.newItems > 0 && true
            : isTrash && !trashIsEmpty;
        const labelBadge = showBadge ? item.newItems : null;
        const iconBadge = isTrash ? ClearTrashReactSvgUrl : null;

        return (
          <Item
            key={`${item.id}_${index}`}
            t={t}
            setDragging={setDragging}
            startUpload={startUpload}
            uploadEmptyFolders={uploadEmptyFolders}
            item={item}
            setBufferSelection={setBufferSelection}
            dragging={dragging}
            getFolderIcon={getFolderIcon}
            isActive={item.id === activeItemId}
            getEndOfBlock={getEndOfBlock}
            showText={showText}
            onClick={onClick}
            onMoveTo={isTrash ? onRemove : onMoveTo}
            onBadgeClick={isTrash ? onEmptyTrashAction : onBadgeClick}
            showDragItems={showDragItems}
            showBadge={showBadge}
            labelBadge={labelBadge}
            iconBadge={iconBadge}
            folderId={`document_catalog-${FOLDER_NAMES[item.rootFolderType]}`}
            currentColorScheme={currentColorScheme}
          />
        );
      });

      /*if (!firstLoad && !isVisitor)
        items.splice(
          3,
          0,
          <SettingsItem
            key="settings-item"
            onClick={onClick}
            isActive={activeItemId === "settings"}
          />
        );*/
      if (!isVisitor && !isCollaborator)
        items.splice(
          3,
          0,
          <AccountsItem
            key="accounts-item"
            onClick={onClick}
            isActive={activeItemId === "accounts"}
          />,
        );

      if (!isVisitor) items.splice(3, 0, <CatalogDivider key="other-header" />);
      else items.splice(2, 0, <CatalogDivider key="other-header" />);

      if (isCommunity && isPaymentPageAvailable)
        items.push(<BonusItem key="bonus-item" />);

      return items;
    },
    [
      t,
      dragging,
      getFolderIcon,
      onClick,
      onMoveTo,
      getEndOfBlock,
      onBadgeClick,
      showDragItems,
      showText,
      setDragging,
      startUpload,
      uploadEmptyFolders,
      trashIsEmpty,
      isAdmin,
      isVisitor,
      firstLoad,
      activeItemId,
      emptyTrashInProgress,
    ],
  );

  return <>{getItems(data)}</>;
};

Items.propTypes = {
  data: PropTypes.array,
  showText: PropTypes.bool,
  onClick: PropTypes.func,
  onClickBadge: PropTypes.func,
  onHide: PropTypes.func,
};

export default inject(
  ({
    authStore,
    treeFoldersStore,
    selectedFolderStore,
    filesStore,
    filesActionsStore,
    uploadDataStore,
    dialogsStore,
    clientLoadingStore,
    userStore,
    settingsStore,
  }) => {
    const { isCommunity, isPaymentPageAvailable, currentDeviceType } =
      authStore;
    const { showText, currentColorScheme } = settingsStore;

    const {
      selection,
      bufferSelection,
      setBufferSelection,
      dragging,
      setDragging,
      trashIsEmpty,

      startDrag,
    } = filesStore;

    const { firstLoad } = clientLoadingStore;

    const { startUpload } = uploadDataStore;

    const { treeFolders, myFolderId, commonFolderId, isPrivacyFolder } =
      treeFoldersStore;

    const { id, access: folderAccess } = selectedFolderStore;
    const {
      moveDragItems,
      uploadEmptyFolders,
      deleteAction,
      emptyTrashInProgress,
    } = filesActionsStore;
    const { setEmptyTrashDialogVisible } = dialogsStore;

    return {
      isAdmin: authStore.isAdmin,
      isVisitor: userStore.user.isVisitor,
      isCollaborator: userStore.user.isCollaborator,
      myId: myFolderId,
      commonId: commonFolderId,
      isPrivacy: isPrivacyFolder,
      currentId: id,
      showText,

      data: treeFolders,

      draggableItems: dragging
        ? bufferSelection
          ? [bufferSelection]
          : selection
        : null,
      dragging,
      setDragging,
      moveDragItems,
      setBufferSelection,
      deleteAction,
      startUpload,
      uploadEmptyFolders,
      setEmptyTrashDialogVisible,
      trashIsEmpty,

      firstLoad,
      startDrag,
      emptyTrashInProgress,
      isCommunity,
      isPaymentPageAvailable,
      currentDeviceType,
      folderAccess,
      currentColorScheme,
    };
  },
)(withTranslation(["Files", "Common", "Translations"])(observer(Items)));
