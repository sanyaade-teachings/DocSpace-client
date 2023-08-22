import React from "react";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";
import Text from "@docspace/components/text";
import { inject, observer } from "mobx-react";
import { smallTablet } from "@docspace/components/utils/device";

import TotalPrice from "./TotalPrice";

const StyledBody = styled.div`
  max-width: 272px;
  margin: 0 auto;

  @media ${smallTablet} {
    max-width: 520px;
  }

  .payment_price_total-price {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    min-height: 65px;
    margin-top: 16px;
    margin-bottom: 16px;

    .payment_price_price-text {
      line-height: 1;
      margin: auto 0;
      padding-top: 6px;
    }
    .payment_price_description,
    .payment_price_price-text,
    .total-tariff_description {
      margin-bottom: 0px;
    }
    .payment_price_description {
      margin-top: 16px;
    }
    .total-tariff_description {
      margin: auto;
    }
    .payment_price_month-text {
      margin: auto 0;
      margin-bottom: 0px;
      margin-left: 8px;
      padding-bottom: 2px;
    }
    .payment_price_month-text,
    .payment_price_price-text {
      ${(props) =>
        props.isDisabled &&
        css`
          color: ${props.theme.client.settings.payment.priceContainer
            .disableColor};
        `};
    }

    .payment_discount-price {
      text-decoration: line-through;
      margin: auto 8px 0 0;
      padding-bottom: 4px;
      color: ${(props) =>
        props.theme.client.settings.payment.contactContainer.textColor};
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
  isNeedRequest,
}) => {
  return (
    <StyledBody isDisabled={isDisabled}>
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
          <TotalPrice t={t} />
        )}
      </div>
    </StyledBody>
  );
};

export default inject(({ payments }) => {
  const { isNeedRequest, maxAvailableManagersCount } = payments;

  return {
    isNeedRequest,
    maxAvailableManagersCount,
  };
})(observer(TotalTariffContainer));
