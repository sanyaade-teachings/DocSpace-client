import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { inject, observer } from "mobx-react";

import ArrowPathReactSvgUrl from "PUBLIC_DIR/images/arrow.path.react.svg?url";
import RetryIcon from "PUBLIC_DIR/images/refresh.react.svg?url";

import Headline from "@docspace/common/components/Headline";
import IconButton from "@docspace/components/icon-button";
import { Hint } from "../../styled-components";

import { tablet } from "@docspace/components/utils/device";

import TableGroupMenu from "@docspace/components/table-container/TableGroupMenu";
import { isMobile, isMobileOnly } from "react-device-detect";
import DropDownItem from "@docspace/components/drop-down-item";

import toastr from "@docspace/components/toast/toastr";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.backgroundColor};
  z-index: 201;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 70px;
  flex-wrap: wrap;

  ${() =>
    isMobile &&
    css`
      margin-bottom: 11px;
    `}

  ${() =>
    isMobileOnly &&
    css`
      margin-top: 7px;
      margin-left: -14px;
      padding-left: 14px;
      margin-right: -14px;
      padding-right: 14px;
    `}

  .arrow-button {
    margin-right: 15px;

    @media ${tablet} {
      padding: 8px 0 8px 8px;
      margin-left: -8px;
    }

    ${() =>
      isMobileOnly &&
      css`
        margin-right: 13px;
      `}
  }

  .headline {
    font-size: 18px;
    margin-right: 16px;
  }

  .table-container_group-menu {
    margin: 0 0 0 -20px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    flex: 0 0 auto;

    width: calc(100% + 40px);
    height: 69px;

    ${() =>
      isMobile &&
      css`
        height: 60px;
        margin: 0 0 0 -16px;
        width: calc(100% + 32px);
      `}
    ${() =>
      isMobileOnly &&
      css`
        position: absolute;
        height: 48px;
        margin: -35px 0 0 -17px;
        width: calc(100% + 32px);
      `}
  }
`;

const HistoryHeader = (props) => {
  const {
    isHeaderVisible,
    checkedEventIds,
    checkAllIds,
    emptyCheckedIds,
    retryWebhookEvents,
    isIndeterminate,
    areAllIdsChecked,
    fetchHistoryItems,
    theme,
  } = props;
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };
  const { t } = useTranslation(["Webhooks", "Common", "InfoPanel"]);
  const { id } = useParams();

  const handleGroupSelection = (isChecked) => {
    isChecked ? checkAllIds() : emptyCheckedIds();
  };
  const SelectAll = () => {
    () => checkAllIds();
  };

  const handleRetryAll = async () => {
    await retryWebhookEvents(checkedEventIds);
    fetchHistoryItems({
      configId: id,
      count: 30,
    });
    toastr.success(
      `${t("WebhookRedilivered")}: ${checkedEventIds.length}`,
      <b>{t("Common:Done")}</b>,
    );
    emptyCheckedIds();
  };

  const headerMenu = [
    {
      id: "retry-event-option",
      label: t("Retry"),
      onClick: handleRetryAll,
      iconUrl: RetryIcon,
    },
  ];

  const onKeyPress = (e) => (e.key === "Esc" || e.key === "Escape") && emptyCheckedIds();

  useEffect(() => {
    window.addEventListener("keyup", onKeyPress);
    return () => window.removeEventListener("keyup", onKeyPress);
  }, []);

  const menuItems = (
    <>
      <DropDownItem
        key="select-all-event-ids"
        label={t("Common:SelectAll")}
        data-index={0}
        onClick={SelectAll}
      />
      <DropDownItem
        key="unselect-all-event-ids"
        label={t("UnselectAll")}
        data-index={1}
        onClick={emptyCheckedIds}
      />
    </>
  );

  const NavigationHeader = () => (
    <>
      <IconButton
        iconName={ArrowPathReactSvgUrl}
        size="17"
        isFill={true}
        onClick={onBack}
        className="arrow-button"
      />
      <Headline type="content" truncate={true} className="headline">
        {t("InfoPanel:SubmenuHistory")}
      </Headline>
      <Hint
        backgroundColor={theme.isBase ? "#F8F9F9" : "#3D3D3D"}
        color={theme.isBase ? "#555F65" : "#FFFFFF"}>
        {t("EventHint")}
      </Hint>
    </>
  );

  const GroupMenu = () => (
    <TableGroupMenu
      checkboxOptions={menuItems}
      onChange={handleGroupSelection}
      headerMenu={headerMenu}
      isChecked={areAllIdsChecked}
      isIndeterminate={isIndeterminate}
      withoutInfoPanelToggler
    />
  );

  useEffect(() => {
    return emptyCheckedIds;
  }, []);

  return (
    <HeaderContainer isHeaderVisible={isHeaderVisible}>
      {isMobileOnly ? (
        <>
          {isHeaderVisible && <GroupMenu />}
          <NavigationHeader />
        </>
      ) : isHeaderVisible ? (
        <GroupMenu />
      ) : (
        <NavigationHeader />
      )}
    </HeaderContainer>
  );
};

export default inject(({ webhooksStore, auth }) => {
  const {
    isHeaderVisible,
    checkAllIds,
    emptyCheckedIds,
    checkedEventIds,
    retryWebhookEvents,
    isIndeterminate,
    areAllIdsChecked,
    fetchHistoryItems,
  } = webhooksStore;

  const { settingsStore } = auth;

  const { theme } = settingsStore;

  return {
    isHeaderVisible,
    checkAllIds,
    emptyCheckedIds,
    checkedEventIds,
    retryWebhookEvents,
    isIndeterminate,
    areAllIdsChecked,
    fetchHistoryItems,
    theme,
  };
})(observer(HistoryHeader));
