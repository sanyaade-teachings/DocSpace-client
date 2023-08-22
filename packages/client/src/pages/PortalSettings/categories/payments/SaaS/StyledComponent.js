import styled, { css } from "styled-components";
import {
  mobile,
  smallTablet,
  size,
  desktop,
} from "@docspace/components/utils/device";

const StyledPriceCalculation = styled.div`
  border-radius: 12px;
  border: ${(props) =>
    props.theme.client.settings.payment.priceContainer.border};
  background: ${(props) =>
    props.theme.client.settings.payment.priceContainer.background};
  max-width: 320px;

  padding: 23px;
  box-sizing: border-box;

  .payment_main-title {
    margin-bottom: 24px;
    ${(props) =>
      props.isDisabled &&
      css`
        color: ${props.theme.client.settings.payment.priceContainer
          .disableColor};
      `}
  }
  .payment_price_user {
    display: flex;
    align-items: baseline;
    justify-content: center;
    background: ${(props) =>
      props.theme.client.settings.payment.priceContainer.backgroundText};
    margin-top: 24px;
    min-height: 38px;
    border-radius: 6px;

    margin-bottom: 5px;
    margin-top: 5px;
    /* padding-left: 16px;
    padding-right: 16px; */

    p {
      text-align: center;
      margin: auto;
    }

    .payment_user-price {
      margin-right: 8px;
    }
    .payment_discount-price {
      text-decoration: line-through;
      margin-right: 5px;
      color: ${(props) =>
        props.theme.client.settings.payment.contactContainer.textColor};
    }

    .payment_per-user {
      color: ${(props) =>
        props.isDisabled
          ? props.theme.client.settings.payment.priceContainer.disablePriceColor
          : props.theme.client.settings.payment.priceColor};
    }
  }
`;
const StyledPayerInformation = styled.div`
  display: flex;
  background: ${(props) => props.theme.client.settings.payment.backgroundColor};
  min-height: 72px;
  padding: 16px;
  box-sizing: border-box;
  margin-top: 16px;
  border-radius: 6px;

  .payer-info {
    margin-left: 3px;
  }

  .payer-info_avatar {
    margin-right: 16px;
  }
  .payer-info {
    margin-right: 3px;
  }
  .payer-info_wrapper {
    height: max-content;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content max-content;
    grid-gap: 4px;

    .payer-info_description {
      p {
        margin-right: 3px;
      }
      div {
        display: inline-block;
        margin: auto 0;
        height: 14px;
      }
    }
    .payer-info_account-link {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

const StyledCurrentTariffContainer = styled.div`
  display: flex;
  min-height: 40px;
  background: ${(props) => props.theme.client.settings.payment.backgroundColor};
  margin-bottom: 24px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding: 12px 16px;
  box-sizing: border-box;
  padding-bottom: 0;
  border-radius: 6px;

  @media ${mobile} {
    flex-direction: column;
    margin-bottom: 27px;
  }

  div {
    padding-bottom: 8px;
    margin-right: 24px;
  }

  p {
    margin-bottom: 0;
    color: ${(props) => props.theme.client.settings.payment.tariffText};
    .current-tariff_count {
      color: ${(props) => props.theme.client.settings.payment.tariffText};
      margin-left: 4px;
    }
  }
`;

const StyledContactContainer = styled.div`
  display: flex;
  width: 100%;
  a {
    margin-left: 4px;
  }
`;

const StyledBenefits = styled.div`
  border-radius: 12px;
  border: ${(props) => props.theme.client.settings.payment.border};
  max-width: 320px;

  padding: 24px;
  box-sizing: border-box;
  background: ${(props) =>
    props.theme.client.settings.payment.backgroundBenefitsColor};

  p {
    margin-bottom: 24px;
  }
  .payment-benefits_text {
    margin-bottom: 20px;
  }
  .payment-benefits {
    margin-bottom: 14px;
    align-items: flex-start;
    display: grid;
    grid-template-columns: 24px 1fr;
    grid-gap: 10px;
    p {
      margin-bottom: 0;
    }
    svg {
      path {
        fill: ${(props) =>
          props.theme.client.settings.payment.benefitsContainer
            .iconsColor} !important;
      }
    }
  }
`;

const StyledTotalTariff = styled.div`
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

const StyledSelectUsers = styled.div`
  max-width: 272px;
  margin: 0 auto;

  .payment-slider {
    margin-top: 20px;
  }

  .slider-track {
    display: flex;
    position: relative;
    margin-top: -8px;
    margin-left: -3px;
    height: 16px;

    .slider-track-value_min,
    .slider-track-value_max {
      color: ${(props) =>
        props.theme.client.settings.payment.priceContainer.trackNumberColor};
    }

    .slider-track-value_max {
      position: absolute;
      right: 0;
    }
    .slider-track-value_min {
      position: absolute;
      left: 0;
    }
  }

  .payment-operations_input {
    width: 101px;
    height: 60px;
    font-size: 44px;
    text-align: center;
    margin-left: 20px;
    margin-right: 20px;
    padding: 0;
    font-weight: 700;
    ${(props) =>
      props.isDisabled &&
      css`
        color: ${props.theme.client.settings.payment.priceContainer
          .disableColor};
      `};
  }

  .payment-users {
    display: flex;
    align-items: center;
    margin: 0 auto;
    width: max-content;
    .payment-score {
      path {
        ${(props) =>
          props.isDisabled &&
          css`
            fill: ${props.theme.text.disableColor};
          `}
      }
    }

    .payment-score,
    .circle {
      cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
    }
    .circle {
      position: relative;
      background: ${(props) =>
        props.theme.client.settings.payment.rectangleColor};
      border: 1px solid
        ${(props) => props.theme.client.settings.payment.rectangleColor};
      border-radius: 50%;
      width: 38px;
      height: 38px;

      svg {
        position: absolute;
        path {
          fill: ${(props) =>
            props.isDisabled
              ? props.theme.client.settings.payment.priceContainer.disableColor
              : props.theme.text.color};
        }
      }
    }

    .minus-icon {
      svg {
        top: 44%;
        left: 28%;
      }
    }
    .plus-icon {
      svg {
        top: 30%;
        left: 27%;
      }
    }
  }
  .payment-users_count {
    margin-left: 20px;
    margin-right: 20px;
    text-align: center;
    width: 102px;
  }

  .payment-users_text {
    margin-bottom: 4px;
    text-align: center;

    ${(props) =>
      props.isDisabled &&
      css`
        color: ${props.theme.client.settings.payment.priceContainer
          .disableColor};
      `}
  }
`;

const StyledCurrentUsersContainer = styled.div`
  height: fit-content;
  .current-admins-number {
    ${(props) =>
      props.isDisabled &&
      css`
        color: ${props.theme.client.settings.payment.priceContainer
          .disableColor};
      `}
  }
`;

const StyledPaymentContainer = styled.div`
  max-width: 660px;

  .payment-info_suggestion,
  .payment-info_grace-period {
    margin-bottom: 12px;
  }

  .payment-info {
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(2, minmax(100px, 320px));
    grid-gap: 20px;
    margin-bottom: 20px;

    @media (max-width: ${size.smallTablet + 40}px) {
      grid-template-columns: 1fr;

      grid-template-rows: ${(props) => "1fr max-content"};

      .price-calculation-container,
      .benefits-container {
        max-width: 600px;
      }
      .select-users-count-container {
        max-width: 520px;
      }
    }

    ${(props) =>
      props.isChangeView &&
      css`
        grid-template-columns: 1fr;
        grid-template-rows: ${(props) => "1fr max-content"};

        .price-calculation-container,
        .benefits-container {
          -webkit-transition: all 0.8s ease;
          transition: all 0.4s ease;
          max-width: 600px;
        }
        .select-users-count-container {
          -webkit-transition: all 0.8s ease;
          transition: all 0.4s ease;
          max-width: 520px;
        }

        @media ${desktop} {
          grid-template-columns: repeat(2, minmax(100px, 320px));
        }
      `}
  }
  .payment-info_wrapper {
    display: flex;

    margin-top: 11px;
    div {
      margin: auto 0;
    }
    .payment-info_managers-price {
      margin-right: 6px;
    }
  }
`;

export {
  StyledPriceCalculation,
  StyledPayerInformation,
  StyledCurrentTariffContainer,
  StyledContactContainer,
  StyledBenefits,
  StyledTotalTariff,
  StyledSelectUsers,
  StyledCurrentUsersContainer,
  StyledPaymentContainer,
};
