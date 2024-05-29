import React from "react";
import { inject, observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@docspace/shared/components/checkbox";
import { Box } from "@docspace/shared/components/box";
import { HelpButton } from "@docspace/shared/components/help-button";

const Checkboxes = ({
  isLdapAvailable,
  isTlsEnabled,
  isSslEnabled,
  setIsTlsEnabled,
  setIsSslEnabled,
}) => {
  const { t } = useTranslation("Ldap");

  const onChangeTls = (e) => {
    const checked = e.target.checked;
    isSslEnabled && checked && setIsSslEnabled(false);
    setIsTlsEnabled(checked);
  };

  const onChangeSsl = (e) => {
    const checked = e.target.checked;
    isTlsEnabled && checked && setIsTlsEnabled(false);
    setIsSslEnabled(checked);
  };

  return (
    <Box className="ldap_checkbox-container">
      <div className="ldap_checkbox-header">
        <Checkbox
          tabIndex={1}
          className="ldap_checkbox-starttls"
          isDisabled={!isLdapAvailable}
          label={t("LdapEnableStartTls")}
          isChecked={isTlsEnabled}
          onChange={onChangeTls}
        />
        <HelpButton tooltipContent={t("LdapEnableStartTlsTooltip")} />
      </div>
      <div className="ldap_checkbox-header">
        <Checkbox
          tabIndex={2}
          className="ldap_checkbox-ssl"
          isDisabled={!isLdapAvailable}
          label={t("LdapEnableSSL")}
          isChecked={isSslEnabled}
          onChange={onChangeSsl}
        />
        <HelpButton tooltipContent={t("LdapEnableSSLTooltip")} />
      </div>
    </Box>
  );
};

export default inject(({ currentQuotaStore, ldapStore }) => {
  const { isLdapAvailable } = currentQuotaStore;
  const { isTlsEnabled, isSslEnabled, setIsTlsEnabled, setIsSslEnabled } =
    ldapStore;
  return {
    isLdapAvailable,
    isTlsEnabled,
    isSslEnabled,
    setIsTlsEnabled,
    setIsSslEnabled,
  };
})(observer(Checkboxes));
