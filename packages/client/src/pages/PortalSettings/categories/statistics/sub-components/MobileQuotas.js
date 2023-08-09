import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { StyledBaseQuotaComponent } from "../StyledComponent";
import MobileCategoryWrapper from "../../../components/mobile-category";

const MobileQuotasComponent = () => {
  const { t } = useTranslation("Settings");
  const navigate = useNavigate();

  const onClickLink = (e) => {
    e.preventDefault();
    navigate(e.target.pathname);
  };

  return (
    <StyledBaseQuotaComponent>
      <MobileCategoryWrapper
        title={t("QuotaPerRoom")}
        onClickLink={onClickLink}
        url="/portal-settings/statistics/portal-statistics/quota-per-room"
        subtitle={t("SetDefaultRoomQuota")}
      />
      <MobileCategoryWrapper
        title={t("QuotaPerUser")}
        onClickLink={onClickLink}
        url="/portal-settings/statistics/portal-statistics/quota-per-user"
        subtitle={t("SetDefaultUserQuota")}
      />
    </StyledBaseQuotaComponent>
  );
};

export default MobileQuotasComponent;
