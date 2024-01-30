import React from "react";

import { inject, observer } from "mobx-react";
import { Trans } from "react-i18next";

import { Text } from "@docspace/shared/components/text";
import { ColorTheme, ThemeId } from "@docspace/shared/components/color-theme";

import { StyledEnterpriseComponent } from "./StyledComponent";
import BenefitsContainer from "SRC_DIR/components/StandaloneComponents/BenefitsContainer";
import ButtonContainer from "./sub-components/ButtonContainer";
import TariffTitleContainer from "./sub-components/TariffTitleContainer";

const EnterpriseContainer = (props) => {
  const { salesEmail, t, isLicenseDateExpired } = props;

  return (
    <StyledEnterpriseComponent>
      <Text fontWeight={700} fontSize={"16px"}>
        {t("ActivateRenewSubscriptionHeader")}
      </Text>

      <TariffTitleContainer />

      {isLicenseDateExpired && <BenefitsContainer t={t} />}
      <Text fontSize="14px" className="payments_renew-subscription">
        {isLicenseDateExpired
          ? t("ActivatePurchaseBuyLicense")
          : t("ActivatePurchaseRenewLicense")}
      </Text>
      <ButtonContainer t={t} />

      <div className="payments_support">
        <Text>
          <Trans i18nKey="ActivateRenewDescr" ns="PaymentsEnterprise" t={t}>
            To get your personal renewal terms, contact your dedicated manager
            or write us at
            <ColorTheme
              fontWeight="600"
              target="_blank"
              tag="a"
              href={`mailto:${salesEmail}`}
              themeId={ThemeId.Link}
            >
              {{ email: salesEmail }}
            </ColorTheme>
          </Trans>
        </Text>
      </div>
    </StyledEnterpriseComponent>
  );
};

export default inject(({ paymentStore, currentTariffStatusStore }) => {
  const { buyUrl, salesEmail } = paymentStore;

  const { isLicenseDateExpired } = currentTariffStatusStore;
  return { buyUrl, salesEmail, isLicenseDateExpired };
})(observer(EnterpriseContainer));
