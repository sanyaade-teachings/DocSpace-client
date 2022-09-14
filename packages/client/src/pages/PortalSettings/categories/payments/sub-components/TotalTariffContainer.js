import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Text from "@docspace/components/text";
import { inject, observer } from "mobx-react";
import { smallTablet } from "@docspace/components/utils/device";

const StyledBody = styled.div`
  max-width: 272px;
  margin: 0 auto;

  @media ${smallTablet} {
    max-width: 520px;
  }

  .payment_price_total-price {
    display: flex;
    justify-content: center;
    min-height: 65px;
    margin-top: 16px;
    margin-bottom: 16px;

    .payment_price_description,
    .payment_price_price-text,
    .total-tariff_description {
      margin-bottom: 0px;
    }
    .payment_price_description {
      margin-top: 16px;
    }

    .payment_price_month-text {
      margin: auto 0;
      margin-bottom: 13px;
    }
  }

  button {
    width: 100%;
  }
`;

const TotalTariffContainer = ({
  t,
  maxAvailableManagersCount,
  isDisabled,
  theme,
  totalPrice,
  isNeedRequest,
  currencySymbol,
}) => {
  const color = isDisabled ? { color: theme.text.disableColor } : {};

  return (
    <StyledBody>
      <div className="payment_price_total-price">
        {isNeedRequest ? (
          <Text
            noSelect
            fontSize={"14"}
            textAlign="center"
            fontWeight={600}
            className="total-tariff_description"
          >
            <Trans t={t} i18nKey="BusinessRequestDescription" ns="Payments">
              {{ peopleNumber: maxAvailableManagersCount }}
            </Trans>
          </Text>
        ) : (
          <>
            <Text
              fontSize="48px"
              isBold
              textAlign={"center"}
              className="payment_price_price-text"
              noSelect
              {...color}
            >
              {`${currencySymbol}${totalPrice}`}
            </Text>
            <Text
              fontSize="16px"
              isBold
              textAlign={"center"}
              className="payment_price_month-text"
              noSelect
              {...color}
            >
              {"/month"}
            </Text>
          </>
        )}
      </div>
    </StyledBody>
  );
};

export default inject(({ auth, payments }) => {
  const { paymentQuotasStore } = auth;
  const { theme } = auth.settingsStore;
  const {
    isLoading,
    totalPrice,
    isNeedRequest,
    maxAvailableManagersCount,
  } = payments;

  const { planCost } = paymentQuotasStore;
  return {
    theme,
    totalPrice,
    isLoading,
    isNeedRequest,
    maxAvailableManagersCount,
    currencySymbol: planCost.currencySymbol,
  };
})(observer(TotalTariffContainer));
