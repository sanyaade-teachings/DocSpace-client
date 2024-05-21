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

import { isMobile } from "@docspace/shared/utils";
import styled from "styled-components";

import { convertTime } from "@docspace/shared/utils/convertTime";
import { Text } from "@docspace/shared/components/text";
import { RowContent } from "@docspace/shared/components/row-content";
import { IconButton } from "@docspace/shared/components/icon-button";
import TickSvgUrl from "PUBLIC_DIR/images/tick.svg?url";

const StyledRowContent = styled(RowContent)`
  .rowMainContainer {
    height: 100%;
  }

  .session-browser {
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.theme.profile.activeSessions.tableCellColor};
  }
`;

const SessionsRowContent = ({
  id,
  platform,
  browser,
  date,
  country,
  city,
  ip,
  sectionWidth,
  showTickIcon,
}) => {
  return (
    <StyledRowContent
      key={id}
      sectionWidth={sectionWidth}
      sideColor={theme.profile.activeSessions.tableCellColor}
    >
      <Text fontSize="14px" fontWeight="600">
        {platform} <span className="session-browser">{`(${browser})`}</span>
      </Text>
      {isMobile() && showTickIcon && (
        <IconButton size={12} iconName={TickSvgUrl} color="#20D21F" />
      )}
      <Text truncate>{convertTime(date)}</Text>
      {(country || city) && (
        <Text truncate>
          {country}
          {country && city && ", "}
          {city}
        </Text>
      )}
      <Text truncate containerWidth="160px">
        {ip}
      </Text>
    </StyledRowContent>
  );
};

export default SessionsRowContent;