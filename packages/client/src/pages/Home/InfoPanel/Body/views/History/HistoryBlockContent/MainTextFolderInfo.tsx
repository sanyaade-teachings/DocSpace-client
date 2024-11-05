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
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import { TTranslation } from "@docspace/shared/types";
import { FolderType } from "@docspace/shared/enums";
import { StyledHistoryBlockMessage } from "../../../styles/history";
import { Feed } from "./HistoryBlockContent.types";
import { FeedAction } from "../FeedInfo";

type HistoryMainTextFolderInfoProps = {
  t: TTranslation;
  feed: Feed;
  selectedFolderId?: number;
  actionType: string;
};

const HistoryMainTextFolderInfo = ({
  t,
  feed,
  actionType,
  selectedFolderId,
}: HistoryMainTextFolderInfoProps) => {
  const {
    parentId,
    toFolderId,
    parentTitle,
    parentType,
    fromParentType,
    fromParentTitle,
    id,
    title,
  } = feed.data;

  const isStartedFilling = actionType === FeedAction.StartedFilling;
  const isSubmitted = actionType === FeedAction.Submitted;
  const isReorderFolder = actionType === FeedAction.Reorder && +id !== parentId;

  if (
    (parentId === selectedFolderId && !isReorderFolder) ||
    toFolderId === selectedFolderId ||
    (selectedFolderId === +id && isReorderFolder)
  )
    return null;

  if (!parentTitle) return null;

  const isSection = parentType === FolderType.USER;
  const isFolder =
    parentType === FolderType.DEFAULT ||
    isSubmitted ||
    isStartedFilling ||
    isReorderFolder;

  const isFromFolder = fromParentType === FolderType.DEFAULT;

  const destination = isFolder
    ? t("FeedLocationLabel", {
        folderTitle: isReorderFolder ? title : parentTitle,
      })
    : isSection
      ? t("FeedLocationSectionLabel", { folderTitle: parentTitle })
      : t("FeedLocationRoomLabel", { folderTitle: parentTitle });

  const sourceDestination = isFromFolder
    ? t("FeedLocationLabelFrom", { folderTitle: fromParentTitle })
    : t("FeedLocationRoomLabel", { folderTitle: parentTitle });

  const className = isFromFolder ? "source-folder-label" : "folder-label";

  return (
    <StyledHistoryBlockMessage className="message">
      <span
        className={className}
        title={isFromFolder ? fromParentTitle : parentTitle}
      >
        {` ${isFromFolder ? sourceDestination : destination}`}
      </span>
    </StyledHistoryBlockMessage>
  );
};

export default inject<TStore>(({ selectedFolderStore }) => ({
  selectedFolderId: selectedFolderStore.id,
}))(
  withTranslation(["InfoPanel", "Common", "Translations"])(
    observer(HistoryMainTextFolderInfo),
  ),
);
