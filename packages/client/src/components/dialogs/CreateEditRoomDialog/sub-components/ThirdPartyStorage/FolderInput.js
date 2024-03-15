﻿import FolderReactSvgUrl from "PUBLIC_DIR/images/folder.react.svg?url";
import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { IconButton } from "@docspace/shared/components/icon-button";
import { Base } from "@docspace/shared/themes";

import FilesSelector from "SRC_DIR/components/FilesSelector";

const StyledFolderInput = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 0px;
  width: 100%;
  height: 32px;

  border-radius: 3px;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;

  &,
  .icon-wrapper {
    border: 1px solid
      ${(props) =>
        props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
          .borderColor};
  }

  &:hover,
  &:hover > .icon-wrapper {
    border: 1px solid
      ${(props) =>
        props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
          .hoverBorderColor};
  }

  .root_label,
  .path,
  .room_title {
    padding: 5px 0px 5px 0px;
    font-weight: 400;
    font-size: ${(props) => props.theme.getCorrectFontSize("13px")};
    line-height: 20px;
  }

  .root_label {
    ${({ theme }) =>
      theme.interfaceDirection === "rtl"
        ? `padding-right: 8px;`
        : `padding-left: 8px;`}
    background-color: ${(props) =>
      props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
        .background};
    color: ${(props) =>
      props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
        .rootLabelColor};
  }

  .path {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .room_title {
    ${({ theme }) =>
      theme.interfaceDirection === "rtl"
        ? `padding-left: 8px;`
        : `padding-right: 8px;`}
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-wrapper {
    ${({ theme }) =>
      theme.interfaceDirection === "rtl"
        ? `margin-right: auto;`
        : `margin-left: auto;`}
    background-color: ${(props) =>
      props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
        .background};
    height: 100%;
    box-sizing: border-box;
    width: 31px;
    min-width: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border-top: none !important;
    border-bottom: none !important;
    ${({ theme }) =>
      theme.interfaceDirection === "rtl"
        ? `border-left: none !important;`
        : `border-right: none !important;`}

    &:hover {
      path {
        fill: ${(props) =>
          props.theme.createEditRoomDialog.thirdpartyStorage.folderInput
            .iconFill};
      }
    }
  }
`;
StyledFolderInput.defaultProps = { theme: Base };

const FolderInput = ({
  t,
  roomTitle,
  thirdpartyAccount,
  onChangeStorageFolderId,
  isDisabled,
}) => {
  const [treeNode, setTreeNode] = useState(null);
  const [path, setPath] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpen = () => {
    if (isDisabled) return;
    setIsDialogOpen(true);
  };
  const onClose = () => {
    console.log("call close");
    setIsDialogOpen(false);
  };

  const getPathValue = () => {
    if (!treeNode) return;

    let path = treeNode.path;
    path = path.slice(1);
    path = [...path, treeNode];

    let result = "";
    path.map(
      (node, i) => (result += node.title + (i !== path.length - 1 ? "/" : "")),
    );

    setPath(result);
  };

  useEffect(() => {
    if (!treeNode) return;
    onChangeStorageFolderId(treeNode.id);
    getPathValue();
  }, [treeNode]);

  console.log(thirdpartyAccount);

  if (!thirdpartyAccount.id) return null;
  return (
    <>
      <StyledFolderInput noRoomTitle={!roomTitle} onClick={onOpen}>
        <span className="root_label">{t("RootLabel")}/</span>
        <span className="path">{path}</span>
        <span className="room_title">
          {(path ? "/" : "") + (roomTitle || t("Files:NewRoom"))}
        </span>
        <div className="icon-wrapper">
          <IconButton size={16} iconName={FolderReactSvgUrl} isClickable />
        </div>
      </StyledFolderInput>

      {isDialogOpen && (
        <FilesSelector
          isPanelVisible={isDialogOpen}
          onClose={onClose}
          isThirdParty
          onSelectTreeNode={setTreeNode}
          passedFoldersTree={[thirdpartyAccount]}
          currentFolderId={thirdpartyAccount.id}
        />
      )}
    </>
  );
};

export default FolderInput;
