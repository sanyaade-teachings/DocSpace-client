import React from "react";
import { withTranslation, Trans } from "react-i18next";
import styled, { css } from "styled-components";

import { SnackBar } from "@docspace/shared/components/snackbar";

import { Link } from "@docspace/shared/components/link";
import { QuotaBarTypes } from "SRC_DIR/helpers/constants";

const QuotasBar = ({
  t,
  tReady,
  type,
  currentValue,
  maxValue,
  onClick,
  onClose,
  onLoad,
  currentColorScheme,
  isAdmin,
}) => {
  const onClickAction = () => {
    onClick && onClick(type);
  };

  const onCloseAction = () => {
    onClose && onClose(type);
  };

  const getQuotaInfo = () => {
    switch (type) {
      case QuotaBarTypes.RoomQuota:
        return {
          header: t("RoomQuotaHeader", { currentValue, maxValue }),
          description: (
            <Trans i18nKey="RoomQuotaDescription" t={t}>
              You can archived the unnecessary rooms or
              <Link
                fontSize="12px"
                fontWeight="400"
                color={currentColorScheme?.main?.accent}
                onClick={onClickAction}
              >
                {{ clickHere: t("ClickHere").toLowerCase() }}
              </Link>{" "}
              to find a better pricing plan for your portal.
            </Trans>
          ),
        };
      case QuotaBarTypes.StorageQuota:
        return {
          header: t("StorageQuotaHeader", { currentValue, maxValue }),
          description: (
            <Trans i18nKey="StorageQuotaDescription" t={t}>
              You can remove the unnecessary files or
              <Link
                fontSize="12px"
                fontWeight="400"
                color={currentColorScheme?.main?.accent}
                onClick={onClickAction}
              >
                {{ clickHere: t("ClickHere").toLowerCase() }}
              </Link>{" "}
              to find a better pricing plan for your portal.
            </Trans>
          ),
        };
      case QuotaBarTypes.TenantCustomQuota:
        return {
          header: t("StorageQuotaHeader", { currentValue, maxValue }),
          description: (
            <Trans i18nKey="TenantCustomQuotaDescription" t={t}>
              You can remove the unnecessary files or change quota in the
              <Link
                fontSize="12px"
                fontWeight="400"
                color={currentColorScheme?.main?.accent}
                onClick={onClickAction}
              >
                Storage management settings.
              </Link>
            </Trans>
          ),
        };
      case QuotaBarTypes.UserQuota:
        return {
          header: t("UserQuotaHeader", { currentValue, maxValue }),
          description: (
            <Trans i18nKey="UserQuotaDescription" t={t}>
              {""}
              <Link
                fontSize="12px"
                fontWeight="400"
                color={currentColorScheme?.main?.accent}
                onClick={onClickAction}
              >
                {{ clickHere: t("ClickHere") }}
              </Link>{" "}
              to find a better pricing plan for your portal.
            </Trans>
          ),
        };

      case QuotaBarTypes.UserAndStorageQuota:
        return {
          header: t("StorageAndUserHeader", { currentValue, maxValue }),
          description: (
            <Trans i18nKey="UserQuotaDescription" t={t}>
              {""}
              <Link
                fontSize="12px"
                fontWeight="400"
                color={currentColorScheme?.main?.accent}
                onClick={onClickAction}
              >
                {{ clickHere: t("ClickHere") }}
              </Link>{" "}
              to find a better pricing plan for your portal.
            </Trans>
          ),
        };
      case QuotaBarTypes.RoomAndStorageQuota:
        return {
          header: t("StorageAndRoomHeader", { currentValue, maxValue }),
          description: (
            <Trans i18nKey="UserQuotaDescription" t={t}>
              {""}
              <Link
                fontSize="12px"
                fontWeight="400"
                color={currentColorScheme?.main?.accent}
                onClick={onClickAction}
              >
                {{ clickHere: t("ClickHere") }}
              </Link>{" "}
              to find a better pricing plan for your portal.
            </Trans>
          ),
        };
      case QuotaBarTypes.PersonalUserQuota:
        const description = !isAdmin ? (
          t("PersonalUserQuotaDescription")
        ) : (
          <Trans i18nKey="PersonalUserQuotaAdminsDescription" t={t}>
            To upload and create new files and folders, please free up disk
            space, or manage quota per user in the
            <Link
              fontSize="12px"
              fontWeight="400"
              color={currentColorScheme?.main?.accent}
              onClick={onClickAction}
            >
              Storage management settings.
            </Link>
          </Trans>
        );
        return {
          header: t("StorageQuotaExceeded"),
          description,
        };

      default:
        return null;
    }
  };

  const quotaInfo = getQuotaInfo();

  return tReady && quotaInfo ? (
    <SnackBar
      headerText={quotaInfo.header}
      text={quotaInfo.description}
      isCampaigns={false}
      opacity={1}
      onLoad={onLoad}
      onAction={onCloseAction}
    />
  ) : (
    <></>
  );
};

export default withTranslation(["MainBar"])(QuotasBar);
