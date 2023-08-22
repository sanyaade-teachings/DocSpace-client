import React, { useEffect, useRef } from "react";
import Text from "@docspace/components/text";
import { inject, observer } from "mobx-react";
import SelectUsersCountContainer from "./sub-components/SelectUsersCountContainer";
import TotalTariffContainer from "./sub-components/TotalTariffContainer";
import ButtonContainer from "./sub-components/ButtonContainer";

import CurrentUsersCountContainer from "./sub-components/CurrentUsersCount";
import PricePerUser from "./sub-components/PricePerUser";
import { StyledPriceCalculation } from "./StyledComponent";

let timeout = null,
  controller;
const PriceCalculation = ({
  t,

  setIsLoading,
  maxAvailableManagersCount,
  canUpdateTariff,
  isGracePeriod,
  isNotPaidPeriod,

  isAlreadyPaid,
  isFreeAfterPaidPeriod,
  managersCount,
  getPaymentLink,
}) => {
  const didMountRef = useRef(false);

  useEffect(() => {
    didMountRef.current && !isAlreadyPaid && setShoppingLink();
  }, [managersCount]);

  useEffect(() => {
    didMountRef.current = true;
    return () => {
      timeout && clearTimeout(timeout);
      timeout = null;
    };
  }, []);

  const setShoppingLink = () => {
    if (managersCount > maxAvailableManagersCount) {
      timeout && clearTimeout(timeout);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (controller) controller.abort();

      controller = new AbortController();

      getPaymentLink(controller.signal).finally(() => {
        setIsLoading(false);
      });
    }, 1000);
  };

  const isDisabled = !canUpdateTariff;

  return (
    <StyledPriceCalculation
      className="price-calculation-container"
      isDisabled={isDisabled}
    >
      <Text
        fontSize="16px"
        fontWeight={600}
        noSelect
        className="payment_main-title"
      >
        {isGracePeriod || isNotPaidPeriod || isFreeAfterPaidPeriod
          ? t("YourPrice")
          : t("PriceCalculation")}
      </Text>
      {isGracePeriod || isNotPaidPeriod || isFreeAfterPaidPeriod ? (
        <CurrentUsersCountContainer t={t} isDisabled={isDisabled} />
      ) : (
        <SelectUsersCountContainer isDisabled={isDisabled} />
      )}

      <PricePerUser t={t} isDisabled={isDisabled} />

      <TotalTariffContainer t={t} isDisabled={isDisabled} />
      <ButtonContainer
        isDisabled={isDisabled}
        t={t}
        isFreeAfterPaidPeriod={isFreeAfterPaidPeriod}
      />
    </StyledPriceCalculation>
  );
};

export default inject(({ auth, payments }) => {
  const {
    tariffsInfo,
    setIsLoading,
    setManagersCount,
    maxAvailableManagersCount,

    managersCount,
    isAlreadyPaid,
    getPaymentLink,
    canUpdateTariff,
  } = payments;
  const { currentTariffStatusStore } = auth;

  const { isNotPaidPeriod, isGracePeriod } = currentTariffStatusStore;

  return {
    canUpdateTariff,
    isAlreadyPaid,
    managersCount,

    setManagersCount,
    tariffsInfo,

    setIsLoading,
    maxAvailableManagersCount,

    isGracePeriod,
    isNotPaidPeriod,

    getPaymentLink,
  };
})(observer(PriceCalculation));
