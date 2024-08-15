import React from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";

import { SettingsStore } from "@docspace/shared/store/SettingsStore";

import useViewEffect from "SRC_DIR/Hooks/useViewEffect";
import { OAuthStoreProps } from "SRC_DIR/store/OAuthStore";
import { setDocumentTitle } from "SRC_DIR/helpers/utils";

import { OAuthContainer } from "./StyledOAuth";
import { OAuthProps } from "./OAuth.types";

import InfoDialog from "./sub-components/InfoDialog";
import PreviewDialog from "./sub-components/PreviewDialog";
import OAuthLoader from "./sub-components/List/Loader";
import DisableDialog from "./sub-components/DisableDialog";
import DeleteDialog from "./sub-components/DeleteDialog";
import OAuthEmptyScreen from "./sub-components/EmptyScreen";
import List from "./sub-components/List";
import GenerateDeveloperTokenDialog from "./sub-components/GenerateDeveloperTokenDialog";
import RevokeDeveloperTokenDialog from "./sub-components/RevokeDeveloperTokenDialog";

const MIN_LOADER_TIME = 500;

const OAuth = ({
  clientList,
  viewAs,
  isEmptyClientList,
  setViewAs,
  fetchClients,
  fetchScopes,
  currentDeviceType,
  infoDialogVisible,
  previewDialogVisible,
  isInit,
  setIsInit,
  disableDialogVisible,
  deleteDialogVisible,
  generateDeveloperTokenDialogVisible,
  revokeDeveloperTokenDialogVisible,
}: OAuthProps) => {
  const { t } = useTranslation(["OAuth"]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const startLoadingRef = React.useRef<null | Date>(null);

  const getData = React.useCallback(async () => {
    if (isInit) return;
    const actions = [];

    actions.push(fetchScopes(), fetchClients());

    await Promise.all(actions);

    if (startLoadingRef.current) {
      const currentDate = new Date();

      const ms = Math.abs(
        startLoadingRef.current.getTime() - currentDate.getTime(),
      );

      if (ms < MIN_LOADER_TIME)
        return setTimeout(() => {
          setIsLoading(false);
          setIsInit(true);
        }, MIN_LOADER_TIME - ms);
    }

    setIsLoading(false);
    setIsInit(true);
  }, [fetchClients, fetchScopes, isInit, setIsInit]);

  useViewEffect({
    view: viewAs,
    setView: setViewAs,
    currentDeviceType,
  });

  React.useEffect(() => {
    if (isInit) return setIsLoading(false);
    startLoadingRef.current = new Date();
    getData();
  }, [getData, setIsInit, isInit]);

  React.useEffect(() => {
    setDocumentTitle(t("OAuth"));
  }, [t]);

  return (
    <OAuthContainer>
      {isLoading ? (
        <OAuthLoader viewAs={viewAs} currentDeviceType={currentDeviceType} />
      ) : isEmptyClientList ? (
        <OAuthEmptyScreen />
      ) : (
        <List
          clients={clientList}
          viewAs={viewAs}
          currentDeviceType={currentDeviceType}
        />
      )}

      {infoDialogVisible && <InfoDialog visible={infoDialogVisible} />}
      {disableDialogVisible && <DisableDialog />}
      {previewDialogVisible && <PreviewDialog visible={previewDialogVisible} />}
      {deleteDialogVisible && <DeleteDialog />}
      {generateDeveloperTokenDialogVisible && <GenerateDeveloperTokenDialog />}
      {revokeDeveloperTokenDialogVisible && <RevokeDeveloperTokenDialog />}
    </OAuthContainer>
  );
};

export default inject(
  ({
    oauthStore,
    settingsStore,
  }: {
    oauthStore: OAuthStoreProps;
    settingsStore: SettingsStore;
  }) => {
    const { currentDeviceType } = settingsStore;
    const {
      viewAs,
      setViewAs,
      clientList,
      isEmptyClientList,
      fetchClients,
      fetchScopes,
      infoDialogVisible,
      previewDialogVisible,
      isInit,
      setIsInit,
      disableDialogVisible,
      deleteDialogVisible,
      generateDeveloperTokenDialogVisible,
      revokeDeveloperTokenDialogVisible,
    } = oauthStore;
    return {
      viewAs,
      setViewAs,
      clientList,
      isEmptyClientList,
      fetchClients,
      currentDeviceType,
      infoDialogVisible,
      previewDialogVisible,
      fetchScopes,
      isInit,
      setIsInit,
      disableDialogVisible,
      deleteDialogVisible,
      generateDeveloperTokenDialogVisible,
      revokeDeveloperTokenDialogVisible,
    };
  },
)(observer(OAuth));
