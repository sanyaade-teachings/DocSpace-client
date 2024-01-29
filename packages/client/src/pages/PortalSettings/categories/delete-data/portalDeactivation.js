import React, { useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { inject } from "mobx-react";
import { Text } from "@docspace/shared/components/text";
import { Button } from "@docspace/shared/components/button";
import { toastr } from "@docspace/shared/components/toast";
import { Link } from "@docspace/shared/components/link";
import { MainContainer, ButtonWrapper } from "./StyledDeleteData";
import { setDocumentTitle } from "../../../../helpers/utils";
import { sendSuspendPortalEmail } from "@docspace/shared/api/portal";
import { isDesktop } from "@docspace/shared/utils";
import { EmployeeActivationStatus } from "@docspace/shared/enums";
import { showEmailActivationToast } from "SRC_DIR/helpers/people-helpers";

const PortalDeactivation = (props) => {
  const { t, getPortalOwner, owner, currentColorScheme, sendActivationLink } =
    props;
  const [isDesktopView, setIsDesktopView] = useState(false);

  const fetchData = async () => {
    await getPortalOwner();
  };

  useEffect(() => {
    setDocumentTitle(t("PortalDeactivation"));
    fetchData();
    onCheckView();
    window.addEventListener("resize", onCheckView);
    return () => window.removeEventListener("resize", onCheckView);
  }, []);

  const onCheckView = () => {
    if (isDesktop()) setIsDesktopView(true);
    else setIsDesktopView(false);
  };

  const onDeactivateClick = async () => {
    try {
      await sendSuspendPortalEmail();
      toastr.success(
        t("PortalDeletionEmailSended", { ownerEmail: owner.email })
      );
    } catch (error) {
      toastr.error(error);
    }
  };

  const requestAgain = () => {
    sendActivationLink && sendActivationLink().then(showEmailActivationToast);
  };

  const notActivatedEmail =
    owner.activationStatus === EmployeeActivationStatus.NotActivated;

  return (
    <MainContainer>
      <Text fontSize="13px" className="description">
        {t("PortalDeactivationDescription")}
      </Text>
      <Text className="helper">{t("PortalDeactivationHelper")}</Text>
      <ButtonWrapper>
        <Button
          className="deactivate-button button"
          label={t("Deactivate")}
          primary
          size={isDesktopView ? "small" : "normal"}
          onClick={onDeactivateClick}
          isDisabled={notActivatedEmail}
        />
        {notActivatedEmail && (
          <Text fontSize="12px" fontWeight="600">
            {t("MainBar:ConfirmEmailHeader", { email: owner.email })}
            <Link
              className="request-again-link"
              color={currentColorScheme?.main?.accent}
              fontSize="12px"
              fontWeight="400"
              onClick={requestAgain}
            >
              {t("MainBar:RequestActivation")}
            </Link>
          </Text>
        )}
      </ButtonWrapper>
    </MainContainer>
  );
};

export default inject(({ auth }) => {
  const { getPortalOwner, owner, currentColorScheme } = auth.settingsStore;
  const { sendActivationLink } = auth.userStore;

  return {
    getPortalOwner,
    owner,
    currentColorScheme,
    sendActivationLink,
  };
})(withTranslation("Settings", "MainBar", "People")(PortalDeactivation));
