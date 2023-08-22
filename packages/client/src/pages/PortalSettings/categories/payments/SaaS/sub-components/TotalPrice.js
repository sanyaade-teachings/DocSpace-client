import React from "react";
import { Trans } from "react-i18next";
import { inject, observer } from "mobx-react";

import Text from "@docspace/components/text";
import { ColorTheme, ThemeType } from "@docspace/components/ColorTheme";

const textProp = {
  fontSize: "48px",
  fontWeight: "600",
  target: "_blank",
  as: "span",
  className: "payment_price_price-text",
};
const TotalPrice = ({ t, totalPrice, currencySymbol }) => {
  const price = `${currencySymbol}${totalPrice}`;
  const isNewPrice = true;

  return (
    <>
      {isNewPrice && (
        <Text
          fontSize="16px"
          as="span"
          textAlign={"center"}
          fontWeight={600}
          className="payment_discount-price"
          noSelect
        >
          {price}
        </Text>
      )}

      <Trans t={t} i18nKey="TotalPricePerMonth" ns="Payments">
        ""
        {isNewPrice ? (
          <ColorTheme {...textProp} themeId={ThemeType.Text}>
            {{ price }}
          </ColorTheme>
        ) : (
          <Text {...textProp}> {{ price }}</Text>
        )}
        <Text
          as="span"
          fontWeight={600}
          fontSize="16px"
          className="payment_price_month-text"
          noSelect
        >
          /month
        </Text>
      </Trans>
    </>
  );
};

export default inject(({ auth, payments }) => {
  const { paymentQuotasStore } = auth;

  const { totalPrice } = payments;

  const { planCost } = paymentQuotasStore;
  return {
    totalPrice,
    currencySymbol: planCost.currencySymbol,
  };
})(observer(TotalPrice));
