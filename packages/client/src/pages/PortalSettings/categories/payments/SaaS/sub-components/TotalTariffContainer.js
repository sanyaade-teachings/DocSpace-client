import React from "react";

import { Trans } from "react-i18next";
import Text from "@docspace/components/text";
import { inject, observer } from "mobx-react";

import TotalPrice from "./TotalPrice";
import { StyledTotalTariff } from "../StyledComponent";

const TotalTariffContainer = ({
  t,
  maxAvailableManagersCount,
  isDisabled,
  isNeedRequest,
}) => {
  return (
    <StyledTotalTariff isDisabled={isDisabled}>
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
    </StyledTotalTariff>
  );
};

export default inject(({ payments }) => {
  const { isNeedRequest, maxAvailableManagersCount } = payments;

  return {
    isNeedRequest,
    maxAvailableManagersCount,
  };
})(observer(TotalTariffContainer));
