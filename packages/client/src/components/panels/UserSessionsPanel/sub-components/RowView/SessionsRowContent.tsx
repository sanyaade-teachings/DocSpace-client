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

import { Text } from "@docspace/shared/components/text";
import { convertTime } from "@docspace/shared/utils/convertTime";
import { RowContent } from "@docspace/shared/components/row-content";

import styled, { useTheme } from "styled-components";
import { IConnections } from "SRC_DIR/pages/PortalSettings/categories/security/sessions/SecuritySessions.types";
import { SessionsRowProps } from "../../UserSessionsPanel.types";

const StyledRowContent = styled(RowContent)`
  .row-main-container-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .date {
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.theme.profile.activeSessions.tableCellColor};
    margin-left: 4px;
  }
`;

const SessionsRowContent = ({ item, sectionWidth }: SessionsRowProps) => {
  const { id, platform, browser, country, city, date } = item as IConnections;
  const theme = useTheme();

  return (
    <StyledRowContent
      key={id}
      sectionWidth={sectionWidth}
      sideColor={theme.profile.activeSessions.tableCellColor}
    >
      <Text fontSize="14px" fontWeight="600" truncate>
        {platform}, {browser?.split(".")[0] ?? ""}
        <span className="date">{convertTime(new Date(date))}</span>
      </Text>
      <span />
      {(country || city) && (
        <Text fontSize="12px" fontWeight="600">
          {country}
          {country && city && ` ${city}`}
        </Text>
      )}
    </StyledRowContent>
  );
};

export default SessionsRowContent;
