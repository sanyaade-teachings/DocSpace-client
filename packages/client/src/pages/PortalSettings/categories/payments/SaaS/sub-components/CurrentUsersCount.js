import Text from "@docspace/components/text";
import React from "react";
import { inject, observer } from "mobx-react";
import SelectTotalSizeContainer from "./SelectTotalSizeContainer";
import { StyledCurrentUsersContainer } from "../StyledComponent";

const CurrentUsersCountContainer = (props) => {
  const {
    isNeedPlusSign,
    maxCountManagersByQuota,
    isDisabled,
    addedManagersCountTitle,
  } = props;
  return (
    <StyledCurrentUsersContainer isDisabled={isDisabled}>
      <Text
        fontSize="16px"
        fontWeight={600}
        textAlign="center"
        className="current-admins-number"
      >
        {addedManagersCountTitle}
      </Text>
      <Text
        fontSize="44px"
        fontWeight={700}
        textAlign="center"
        noSelect
        className="current-admins-number"
      >
        {maxCountManagersByQuota}
      </Text>
      <SelectTotalSizeContainer isNeedPlusSign={isNeedPlusSign} />
    </StyledCurrentUsersContainer>
  );
};

export default inject(({ auth }) => {
  const { currentQuotaStore, paymentQuotasStore } = auth;
  const { maxCountManagersByQuota } = currentQuotaStore;
  const { addedManagersCountTitle } = paymentQuotasStore;

  return {
    maxCountManagersByQuota,
    addedManagersCountTitle,
  };
})(observer(CurrentUsersCountContainer));
