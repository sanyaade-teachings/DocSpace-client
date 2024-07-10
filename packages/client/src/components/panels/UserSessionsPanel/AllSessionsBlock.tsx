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

import { observer, inject } from "mobx-react";
import { mobile } from "@docspace/shared/utils";
import { Text } from "@docspace/shared/components/text";
import { Button, ButtonSize } from "@docspace/shared/components/button";
import { EmptyScreenContainer } from "@docspace/shared/components/empty-screen-container";
import styled from "styled-components";
import type SelectionPeopleStore from "SRC_DIR/store/SelectionPeopleStore";

import EmptyScreenSessionsReactSvgUrl from "PUBLIC_DIR/images/empty_screen_from_sessions.svg?url";
import { IAllSessions } from "SRC_DIR/pages/PortalSettings/categories/security/sessions/SecuritySessions.types";
import { AllSessionsBlockProps } from "./UserSessionsPanel.types";

import RowWrapper from "./sub-components";

const Wrapper = styled.div`
  padding: 20px 20px 12px;

  .empty-screen-container {
    width: auto;
    padding-top: 60px;

    @media ${mobile} {
      padding-top: 30px;
    }
  }

  .subtitle {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .desciption {
    color: ${(props) => props.theme.profile.activeSessions.subtitleColor};
    margin-bottom: 20px;
  }
`;

const AllSessionsBlock = (props: AllSessionsBlockProps) => {
  const {
    t,
    isLoading,
    items = {} as IAllSessions,
    onClickLogoutAllExceptThis = () => {},
  } = props;
  const { displayName } = items;

  const exceptId = items.connections[0]?.id;
  const sessions = items.sessions || items.connections;

  const filteredSessions = sessions
    .filter((session) => session.status === "offline")
    .reverse();

  return (
    <>
      <Wrapper>
        <Text className="subtitle">{t("Profile:AllSessions")}</Text>
        <Text className="desciption">{t("Profile:PanelDescription")}</Text>
        {filteredSessions.length > 0 ? (
          <Button
            label={t("Profile:LogoutFromAllSessions")}
            size={ButtonSize.small}
            onClick={() => onClickLogoutAllExceptThis(t, exceptId, displayName)}
            scale
            isLoading={isLoading}
          />
        ) : (
          <EmptyScreenContainer
            imageSrc={EmptyScreenSessionsReactSvgUrl}
            className="empty-screen-container"
            imageAlt="Empty Screen Sessions image"
            headerText={t("Settings:NoSessionsHere")}
          />
        )}
      </Wrapper>

      <RowWrapper t={t} sessions={filteredSessions} sectionWidth={0} />
    </>
  );
};

export default inject<TStore>(({ peopleStore }) => {
  const { getItems, isLoading, onClickLogoutAllExceptThis } =
    peopleStore.selectionStore as unknown as SelectionPeopleStore;

  return {
    items: getItems,
    isLoading,
    onClickLogoutAllExceptThis,
  };
})(observer(AllSessionsBlock));
