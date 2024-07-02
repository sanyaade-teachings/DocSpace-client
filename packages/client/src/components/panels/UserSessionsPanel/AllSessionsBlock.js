import { observer, inject } from "mobx-react";
import { mobile } from "@docspace/shared/utils";
import { Text } from "@docspace/shared/components/text";
import { Button } from "@docspace/shared/components/button";
import { EmptyScreenContainer } from "@docspace/shared/components/empty-screen-container";
import styled from "styled-components";
import RowWrapper from "./sub-components";

import EmptyScreenSessionsReactSvgUrl from "PUBLIC_DIR/images/empty_screen_from_sessions.svg?url";

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

const AllSessionsBlock = (props) => {
  const { t, isLoading, items, onClickLogoutAllExceptThis } = props;

  const exceptId = items.connections[0]?.id;
  const sessions = items.sessions || items.connections;

  const filteredSessions = sessions.filter(
    (session) => session.status === "offline",
  );

  return (
    <>
      <Wrapper>
        <Text className="subtitle">{t("Profile:AllSessions")}</Text>
        <Text className="desciption">{t("Profile:PanelDescription")}</Text>
        {filteredSessions.length > 0 ? (
          <Button
            label={t("Profile:LogoutFromAllSessions")}
            size="small"
            onClick={() => onClickLogoutAllExceptThis(t, exceptId)}
            scale={true}
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

      <RowWrapper t={t} sessions={filteredSessions} />
    </>
  );
};

export default inject(({ peopleStore }) => {
  const { items, isLoading, fetchData, onClickLogoutAllExceptThis } =
    peopleStore.selectionStore;

  return {
    items,
    isLoading,
    fetchData,
    onClickLogoutAllExceptThis,
  };
})(observer(AllSessionsBlock));