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

import React from "react";
import moment from "moment-timezone";
import styled from "styled-components";

import { Text } from "@docspace/shared/components/text";
import { RowContent } from "@docspace/shared/components/row-content";

import StatusBadge from "../../../../sub-components/StatusBadge";
import { useTranslation } from "react-i18next";

const StyledRowContent = styled(RowContent)`
  display: flex;
  padding-bottom: 10px;

  .rowMainContainer {
    height: 100%;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
`;

const StatusHeader = styled.div`
  display: flex;
`;

export const HistoryRowContent = ({ sectionWidth, historyItem }) => {
  const { t, i18n } = useTranslation("Webhooks");

  const formattedDelivery =
    moment(historyItem.delivery)
      .tz(window.timezone)
      .locale(i18n.language)
      .format("MMM D, YYYY, h:mm:ss A") +
    " " +
    t("Common:UTC");
  return (
    <StyledRowContent sectionWidth={sectionWidth}>
      <ContentWrapper>
        <StatusHeader>
          <Text
            fontWeight={600}
            fontSize="14px"
            style={{ marginInlineEnd: "8px" }}
          >
            {historyItem.id}
          </Text>
          <StatusBadge status={historyItem.status} />
        </StatusHeader>
        <Text fontWeight={600} fontSize="12px" color="#A3A9AE">
          {formattedDelivery}
        </Text>
      </ContentWrapper>
      <span></span>
    </StyledRowContent>
  );
};
