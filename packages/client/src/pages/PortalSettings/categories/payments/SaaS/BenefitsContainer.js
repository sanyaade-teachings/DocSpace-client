import React from "react";

import Text from "@docspace/components/text";
import { inject, observer } from "mobx-react";

import { StyledBenefits } from "./StyledComponent";

const BenefitsContainer = ({ t, features }) => {
  return (
    <StyledBenefits className="benefits-container">
      <Text
        fontSize={"16px"}
        fontWeight={"600"}
        className="payment-benefits_text"
        noSelect
      >
        {t("Benefits")}
      </Text>
      {features.map((item, index) => {
        if (!item.title || !item.image) return;
        return (
          <div className="payment-benefits" key={index}>
            <div dangerouslySetInnerHTML={{ __html: item.image }} />
            <Text noSelect>{item.title}</Text>
          </div>
        );
      })}
    </StyledBenefits>
  );
};

export default inject(({ auth }) => {
  const { paymentQuotasStore } = auth;

  const { portalPaymentQuotasFeatures } = paymentQuotasStore;

  return {
    features: portalPaymentQuotasFeatures,
  };
})(observer(BenefitsContainer));
