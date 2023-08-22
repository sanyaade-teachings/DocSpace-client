import HelpReactSvgUrl from "PUBLIC_DIR/images/help.react.svg?url";
import React from "react";

import Text from "@docspace/components/text";
import { useTranslation, Trans } from "react-i18next";
import { inject, observer } from "mobx-react";
import { HelpButton, Link } from "@docspace/components";
import Avatar from "@docspace/components/avatar";
import { ColorTheme, ThemeType } from "@docspace/components/ColorTheme";
import DefaultUserPhoto from "PUBLIC_DIR/images/default_user_photo_size_82-82.png";
import { StyledPayerInformation } from "./StyledComponent";

const PayerInformationContainer = ({
  style,
  theme,
  user,
  accountLink,
  payerInfo,
  email,
  isNotPaidPeriod,
  isFreeAfterPaidPeriod,
  isStripePortalAvailable,
}) => {
  const { t } = useTranslation("Payments");

  const renderTooltip = (
    <HelpButton
      className="payer-tooltip"
      iconName={HelpReactSvgUrl}
      tooltipContent={
        <>
          <Text isBold>{t("Payer")}</Text>
          <Text>{t("PayerDescription")}</Text>
        </>
      }
    />
  );

  const unknownPayerDescription = () => {
    const userNotFound = t("UserNotFoundMatchingEmail") + " ";

    let invalidEmailDescription = user.isOwner
      ? t("InvalidEmailWithActiveSubscription")
      : t("InvalidEmailWithActiveSubscriptionForAdmin");

    if (isNotPaidPeriod || isFreeAfterPaidPeriod) {
      invalidEmailDescription = user.isOwner
        ? t("InvalidEmailWithoutActiveSubscription")
        : t("InvalidEmailWithoutActiveSubscriptionByAdmin");

      return userNotFound + invalidEmailDescription;
    }

    return userNotFound + invalidEmailDescription;
  };

  const unknownPayerInformation = (
    <div>
      <Text as="span" fontSize="13px" noSelect>
        {unknownPayerDescription()}
      </Text>
      <div>
        {isStripePortalAvailable && (
          <ColorTheme
            noSelect
            fontWeight={600}
            href={accountLink}
            tag="a"
            themeId={ThemeType.Link}
            target="_blank"
            className="payer-info_account-link"
          >
            {t("ChooseNewPayer")}
          </ColorTheme>
        )}
      </div>
    </div>
  );

  const payerInformation = (
    <>
      {isStripePortalAvailable ? (
        <ColorTheme
          noSelect
          fontWeight={600}
          href={accountLink}
          className="payer-info_account-link"
          tag="a"
          themeId={ThemeType.Link}
          target="_blank"
        >
          {t("StripeCustomerPortal")}
        </ColorTheme>
      ) : (
        <ColorTheme
          fontWeight={600}
          href={`mailto:${email}`}
          tag="a"
          themeId={ThemeType.Link}
        >
          {email}
        </ColorTheme>
      )}
    </>
  );

  const payerName = () => {
    let emailUnfoundedUser;

    if (email) emailUnfoundedUser = "«" + email + "»";

    return (
      <Text as="span" fontWeight={600} noSelect fontSize={"14px"}>
        {payerInfo ? (
          payerInfo.displayName
        ) : (
          <Trans t={t} i18nKey="UserNotFound" ns="Payments">
            User
            <Text
              as="span"
              color={theme.client.settings.payment.warningColor}
              fontWeight={600}
              fontSize={"14px"}
            >
              {{ email: emailUnfoundedUser }}
            </Text>
            is not found
          </Trans>
        )}
      </Text>
    );
  };

  const avatarUrl = payerInfo
    ? { source: payerInfo.hasAvatar ? payerInfo.avatar : DefaultUserPhoto }
    : {};

  return (
    <StyledPayerInformation style={style}>
      <div className="payer-info_avatar">
        <Avatar
          size={"base"}
          {...avatarUrl}
          isDefaultSource
          userName={payerInfo?.displayName}
        />
      </div>

      <div className="payer-info_wrapper">
        <div className="payer-info_description">
          {payerName()}

          <Text as="span" className="payer-info">
            {" (" + t("Payer") + ") "}
          </Text>

          {renderTooltip}
        </div>

        {!payerInfo ? unknownPayerInformation : payerInformation}
      </div>
    </StyledPayerInformation>
  );
};

export default inject(({ auth, payments }) => {
  const { userStore, settingsStore, currentTariffStatusStore } = auth;
  const { accountLink, isStripePortalAvailable } = payments;
  const { theme } = settingsStore;
  const { customerId, isGracePeriod, isNotPaidPeriod, payerInfo } =
    currentTariffStatusStore;
  const { user } = userStore;

  return {
    isStripePortalAvailable,
    theme,
    user,
    accountLink,
    payerInfo,
    email: customerId,
    isGracePeriod,
    isNotPaidPeriod,
  };
})(observer(PayerInformationContainer));
