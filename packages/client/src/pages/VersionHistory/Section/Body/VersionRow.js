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

import AccessCommentReactSvgUrl from "PUBLIC_DIR/images/access.comment.react.svg?url";
import RestoreAuthReactSvgUrl from "PUBLIC_DIR/images/restore.auth.react.svg?url";
import { useNavigate } from "react-router-dom";
import DownloadReactSvgUrl from "PUBLIC_DIR/images/download.react.svg?url";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "@docspace/shared/components/link";
import { Text } from "@docspace/shared/components/text";
import { Box } from "@docspace/shared/components/box";
import { Textarea } from "@docspace/shared/components/textarea";
import { Button } from "@docspace/shared/components/button";
import { withTranslation } from "react-i18next";
import VersionBadge from "./VersionBadge";
import { StyledVersionRow } from "./StyledVersionHistory";
import ExternalLinkIcon from "PUBLIC_DIR/images/external.link.react.svg?url";
import { commonIconsStyles, getCorrectDate } from "@docspace/shared/utils";
import { inject, observer } from "mobx-react";
import { toastr } from "@docspace/shared/components/toast";
import { Encoder } from "@docspace/shared/utils/encoder";
import { Base } from "@docspace/shared/themes";
import { UrlActionType } from "@docspace/shared/enums";
import {
  MAX_FILE_COMMENT_LENGTH,
  MEDIA_VIEW_URL,
} from "@docspace/shared/constants";
import moment from "moment-timezone";
import { combineUrl } from "@docspace/shared/utils/combineUrl";

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
  ${commonIconsStyles}
  path {
    fill: ${(props) => props.theme.filesVersionHistory.fill};
  }
`;

StyledExternalLinkIcon.defaultProps = { theme: Base };
const VersionRow = (props) => {
  const {
    info,
    index,
    culture,
    isVersion,
    t,
    // markAsVersion,
    restoreVersion,
    updateCommentVersion,
    onSetRestoreProcess,
    isTabletView,
    onUpdateHeight,
    versionsListLength,
    isEditing,
    theme,
    canChangeVersionFileHistory,
    openUser,
    onClose,
    setIsVisible,
    fileItemsList,
    enablePlugins,
    currentDeviceType,
    openUrl,
    setIsVerHistoryPanel,
    openOnNewPage,
  } = props;

  const navigate = useNavigate();

  const [showEditPanel, setShowEditPanel] = useState(false);
  const [commentValue, setCommentValue] = useState(info.comment);
  const [isSavingComment, setIsSavingComment] = useState(false);

  useEffect(() => {
    if (commentValue !== info.comment) {
      setCommentValue(info.comment);
    }
  }, [info.comment]);

  const versionDate = getCorrectDate(culture, info.updated, "L", "LTS");

  const title = info.updatedBy?.isAnonim
    ? t("Common:Anonymous")
    : `${Encoder.htmlDecode(info.updatedBy?.displayName)}`;

  const onDownloadAction = () =>
    openUrl(`${info.viewUrl}&version=${info.version}`, UrlActionType.Download);

  const onEditComment = () => !isEditing && setShowEditPanel(!showEditPanel);

  const onChange = (e) => {
    const value = e.target.value;

    if (value.length > MAX_FILE_COMMENT_LENGTH) {
      return setCommentValue(value.slice(0, MAX_FILE_COMMENT_LENGTH));
    }

    setCommentValue(value);
  };

  const onUserClick = () => {
    onClose(true);
    setIsVisible(true);
    openUser(info?.updatedBy, navigate);
  };

  const onSaveClick = () => {
    setIsSavingComment(true);
    updateCommentVersion(info.id, commentValue, info.version)
      .catch((err) => toastr.error(err))
      .finally(() => {
        onEditComment();
        setIsSavingComment(false);
      });
  };

  const onCancelClick = () => {
    setCommentValue(info.comment);
    setShowEditPanel(!showEditPanel);
  };
  const onOpenFile = () => {
    const { MediaView, ImageView } = info?.viewAccessibility;

    if (MediaView || ImageView) {
      return window.open(
        combineUrl(MEDIA_VIEW_URL, info.id),
        openOnNewPage ? "_blank" : "_self",
      );
    }

    if (fileItemsList && enablePlugins) {
      let currPluginItem = null;

      fileItemsList.forEach((i) => {
        if (i.key === info.fileExst) currPluginItem = i.value;
      });

      if (currPluginItem) {
        const correctDevice = currPluginItem.devices
          ? currPluginItem.devices.includes(currentDeviceType)
          : true;
        if (correctDevice) {
          setIsVerHistoryPanel(false);
          return currPluginItem.onClick({
            ...info,
            viewUrl: `${info.viewUrl}&version=${info.version}`,
          });
        }
      }
    }

    window.open(info.webUrl, openOnNewPage ? "_blank" : "_self");
  };

  const onRestoreClick = () => {
    onSetRestoreProcess(true);
    restoreVersion(info.id, info.version)
      .catch((err) => toastr.error(err))
      .finally(() => {
        onSetRestoreProcess(false);
      });
  };

  // const onVersionClick = () => {
  //   markAsVersion(info.id, isVersion, info.version).catch((err) =>
  //     toastr.error(err)
  //   );
  // };

  const onContextMenu = (event) => {
    if (showEditPanel) event.stopPropagation();
  };

  const contextOptions = [
    {
      key: "open",
      icon: ExternalLinkIcon,
      label: t("Files:Open"),
      onClick: onOpenFile,
    },
    canChangeVersionFileHistory && {
      key: "edit",
      icon: AccessCommentReactSvgUrl,
      label: t("EditComment"),
      onClick: onEditComment,
    },
    index !== 0 &&
      canChangeVersionFileHistory && {
        key: "restore",
        icon: RestoreAuthReactSvgUrl,
        label: t("Common:Restore"),
        onClick: onRestoreClick,
      },
    {
      key: "download",
      icon: DownloadReactSvgUrl,
      label: `${t("Common:Download")} (${info.contentLength})`,
      onClick: onDownloadAction,
    },
  ];

  // uncomment if we want to change versions again
  // const onClickProp = canChangeVersionFileHistory
  //   ? { onClick: onVersionClick }
  //   : {};

  useEffect(() => {
    const newRowHeight = document.getElementsByClassName(
      `version-row_${index}`,
    )[0]?.clientHeight;

    newRowHeight && onUpdateHeight(index, newRowHeight);
  }, [showEditPanel, versionsListLength]);

  return (
    <StyledVersionRow
      showEditPanel={showEditPanel}
      contextOptions={contextOptions}
      canEdit={canChangeVersionFileHistory}
      isTabletView={isTabletView}
      isSavingComment={isSavingComment}
      isEditing={isEditing}
      contextTitle={t("Common:Actions")}
    >
      <div className={`version-row_${index}`} onContextMenu={onContextMenu}>
        <Box displayProp="flex" className="row-header">
          <VersionBadge
            theme={theme}
            className={`version_badge ${
              isVersion ? "versioned" : "not-versioned"
            }`}
            isVersion={isVersion}
            index={index}
            versionGroup={info.versionGroup}
            //  {...onClickProp}
            t={t}
            title={
              index > 0
                ? isVersion
                  ? t("Files:MarkAsRevision")
                  : t("Files:MarkAsVersion")
                : ""
            }
          />
          <Box
            displayProp="flex"
            flexDirection="column"
            marginProp="-2px 0 0 0"
          >
            <Link
              onClick={onOpenFile}
              fontWeight={600}
              fontSize="14px"
              title={versionDate}
              isTextOverflow={true}
              className="version-link-file"
            >
              {versionDate}
            </Link>
            {info.updatedBy?.isAnonim ? (
              <Text
                fontWeight={600}
                color={theme.filesVersionHistory.color}
                fontSize="14px"
                title={title}
              >
                {title}
              </Text>
            ) : (
              <Link
                onClick={onUserClick}
                fontWeight={600}
                fontSize="14px"
                title={title}
                isTextOverflow={true}
                className="version-link-file"
              >
                {title}
              </Link>
            )}
          </Box>

          {/*<Text
            className="version_content-length"
            fontWeight={600}
            color={theme.filesVersionHistory.color}
            fontSize="14px"
          >
            {info.contentLength}
          </Text>*/}
        </Box>
        <Box className="version-comment-wrapper" displayProp="flex">
          <>
            {showEditPanel && (
              <>
                <Textarea
                  className="version_edit-comment"
                  onChange={onChange}
                  fontSize={12}
                  heightTextArea="54px"
                  value={commentValue}
                  isDisabled={isSavingComment}
                  autoFocus={true}
                  areaSelect={true}
                />
              </>
            )}

            <Text className="version_text" truncate={true}>
              {info.comment}
            </Text>
          </>
        </Box>
        {showEditPanel && (
          <Box className="version_edit-comment" marginProp="8px 0 2px 70px">
            <Box
              className="version_edit-comment-button-primary"
              displayProp="inline-block"
            >
              <Button
                isDisabled={isSavingComment}
                size="extraSmall"
                scale={true}
                primary
                onClick={onSaveClick}
                label={t("Common:SaveButton")}
              />
            </Box>
            <Box
              className="version_edit-comment-button-second"
              displayProp="inline-block"
            >
              <Button
                isDisabled={isSavingComment}
                size="extraSmall"
                scale={true}
                onClick={onCancelClick}
                label={t("Common:CancelButton")}
              />
            </Box>
          </Box>
        )}
      </div>
    </StyledVersionRow>
  );
};

export default inject(
  ({
    settingsStore,
    versionHistoryStore,
    pluginStore,
    infoPanelStore,
    userStore,
    filesSettingsStore,
  }) => {
    const { user } = userStore;
    const { openUser, setIsVisible } = infoPanelStore;
    const { culture, isTabletView, enablePlugins, currentDeviceType, openUrl } =
      settingsStore;
    const language = (user && user.cultureName) || culture || "en";

    const { fileItemsList } = pluginStore;

    const {
      // markAsVersion,
      restoreVersion,
      updateCommentVersion,
      isEditing,
      isEditingVersion,
      fileSecurity,
      setIsVerHistoryPanel,
    } = versionHistoryStore;

    const isEdit = isEditingVersion || isEditing;
    const canChangeVersionFileHistory = !isEdit && fileSecurity?.EditHistory;

    const { openOnNewPage } = filesSettingsStore;

    return {
      currentDeviceType,
      fileItemsList,
      enablePlugins,
      theme: settingsStore.theme,
      culture: language,
      isTabletView,
      // markAsVersion,
      restoreVersion,
      updateCommentVersion,
      isEditing: isEdit,
      canChangeVersionFileHistory,
      openUser,
      setIsVisible,
      openUrl,
      setIsVerHistoryPanel,
      openOnNewPage,
    };
  },
)(
  withTranslation(["VersionHistory", "Common", "Translations"])(
    observer(VersionRow),
  ),
);
