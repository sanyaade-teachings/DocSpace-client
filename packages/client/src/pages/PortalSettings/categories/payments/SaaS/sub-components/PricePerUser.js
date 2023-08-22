import React, { Fragment } from "react";
import { inject, observer } from "mobx-react";
import { Trans } from "react-i18next";

import Text from "@docspace/components/text";
import { ColorTheme, ThemeType } from "@docspace/components/ColorTheme";

const textProp = {
  fontSize: "16px",
  isBold: true,
  as: "span",
  fontWeight: 600,
  className: "payment_per-user",
};
const PricePerUser = ({ t, priceManagerPerMonth, currencySymbol }) => {
  const price = `${currencySymbol}${priceManagerPerMonth}`;
  const oldPrice = `${currencySymbol}${priceManagerPerMonth}`;

  const isNewPrice = false;

  const newPriceComponent = isNewPrice ? (
    <ColorTheme {...textProp} themeId={ThemeType.Text}>
      {{ price }}
    </ColorTheme>
  ) : (
    <Text {...textProp}>{{ price }}</Text>
  );

  return (
    <div className="payment_price_user">
      <Text noSelect fontSize={"13px"} className="payment_per-user">
        <Trans t={t} i18nKey="PerUserMonth" ns="Common">
          ""
          {isNewPrice && (
            <Text
              fontSize="12px"
              as="span"
              textAlign={"center"}
              fontWeight={600}
              className="payment_discount-price"
              noSelect
            >
              {{ oldPrice }}
            </Text>
          )}
          {newPriceComponent}
        </Trans>
      </Text>
    </div>
  );
};

export default inject(({ auth }) => {
  const { theme } = auth.settingsStore;
  const { paymentQuotasStore } = auth;

  const { planCost } = paymentQuotasStore;

  return {
    theme,

    priceManagerPerMonth: planCost.value,
    currencySymbol: planCost.currencySymbol,
  };
})(observer(PricePerUser));
