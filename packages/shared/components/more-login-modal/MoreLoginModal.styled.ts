import styled, { css } from "styled-components";

import { mobile } from "@docspace/shared/utils";
import { ModalDialog } from "@docspace/shared/components/modal-dialog";

export const ProviderRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  justify-content: flex-start;
  align-items: center;
  align-content: center;
  padding: 8px 0;

  svg {
    height: 24px;
    width: 24px;
    ${(props) =>
      props.theme.interfaceDirection === "rtl"
        ? css`
            padding-right: 4px;
          `
        : css`
            padding-left: 4px;
          `}

    path {
      fill: ${(props) => !props.theme.isBase && "#fff"};
    }
  }

  .provider-name {
    ${(props) =>
      props.theme.interfaceDirection === "rtl"
        ? css`
            padding-right: 12px;
          `
        : css`
            padding-left: 12px;
          `}
    line-height: 16px;
  }

  .signin-button {
    ${(props) =>
      props.theme.interfaceDirection === "rtl"
        ? css`
            margin-right: auto;
          `
        : css`
            margin-left: auto;
          `}
  }
`;

export const Modal = styled(ModalDialog)`
  .modal-dialog-aside {
    transform: translateX(${(props) => (props.visible ? "0" : "480px")});
    width: 480px;

    @media ${mobile} {
      width: 325px;
      transform: translateX(${(props) => (props.visible ? "0" : "480px")});
    }
  }
`;