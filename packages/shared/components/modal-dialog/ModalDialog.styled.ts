import styled, { css } from "styled-components";
import { isMobile } from "react-device-detect";

import { Base } from "../../themes";
import { mobile, tablet } from "../../utils";

import { Box } from "../box";
import { ModalDialogType } from "./ModalDialog.enums";

const StyledModal = styled.div<{ modalSwipeOffset?: number }>`
  #create-text-input::-webkit-search-decoration,
  #create-text-input::-webkit-search-cancel-button,
  #create-text-input::-webkit-search-results-button,
  #create-text-input::-webkit-search-results-decoration {
    appearance: none;
    -webkit-appearance: none;
  }

  pointer-events: none;
  &.modal-active {
    pointer-events: all;
  }
  .loader-wrapper {
    padding: 0 16px 16px;
  }
`;

const Dialog = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  margin: 0 auto;
  min-height: 100%;
`;

const Content = styled.div.attrs((props: { modalSwipeOffset?: number }) => ({
  style: {
    marginBottom:
      props.modalSwipeOffset && props.modalSwipeOffset < 0
        ? `${props.modalSwipeOffset * 1.1}px`
        : "0px",
  },
}))<{
  autoMaxHeight?: boolean;
  autoMaxWidth?: boolean;
  currentDisplayType?: ModalDialogType;
  modalSwipeOffset?: number;
  isLarge?: boolean;
  visible?: boolean;
  embedded?: boolean;
}>`
  box-sizing: border-box;
  position: relative;
  background-color: ${(props) => props.theme.modalDialog.backgroundColor};
  color: ${(props) => props.theme.modalDialog.textColor};
  padding: ${(props) =>
    props.currentDisplayType === "modal" ? "0" : "0 0 -16px"};
  ${(props) =>
    props.currentDisplayType === "modal"
      ? css<{
          autoMaxHeight?: boolean;
          autoMaxWidth?: boolean;
          isLarge?: boolean;
          visible?: boolean;
        }>`
          height: auto;
          max-height: ${props.autoMaxHeight
            ? "auto"
            : props.isLarge
              ? "400px"
              : "280px"};
          width: ${props.autoMaxWidth
            ? "auto"
            : props.isLarge
              ? "520px"
              : "400px"};

          border-radius: 6px;
          @media ${mobile} {
            transform: translateY(${props.visible ? "0" : "100%"});
            transition: transform 0.3s ease-in-out;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: auto;
            border-radius: 6px 6px 0 0;
          }
        `
      : css<{ embedded?: boolean; visible?: boolean }>`
          width: 480px;
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 0;
          bottom: 0;

          ${props.theme.interfaceDirection === "rtl"
            ? css<{ visible?: boolean }>`
                left: 0;
                transform: translateX(${props.visible ? "0" : "-100%"});
              `
            : css<{ visible?: boolean }>`
                right: 0;
                transform: translateX(${props.visible ? "0" : "100%"});
              `}

          transition: transform 0.3s ease-in-out;

          @media ${mobile} {
            transform: translateY(${props.visible ? "0" : "100%"});
            height: calc(100% - 64px);
            width: 100%;
            left: 0;

            top: ${props.embedded ? "0" : "auto"};
            right: 0;
            top: auto;
            bottom: 0;
          }
        `}
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: ${(props) =>
    `1px solid ${props.theme.modalDialog.headerBorderColor}`};
  margin-bottom: 16px;
  height: 52px;
  padding: 0 16px 0;

  .heading {
    font-family: "Open Sans";
    color: ${(props) => props.theme.modalDialog.textColor};
    font-weight: 700;
    font-size: ${(props) => props.theme.getCorrectFontSize("21px")};
  }
`;

const StyledBody = styled(Box)<{
  currentDisplayType?: ModalDialogType;
  hasFooter?: boolean;
  isScrollLocked?: boolean;
  withBodyScroll?: boolean;
}>`
  position: relative;
  padding: 0 16px;
  padding-bottom: ${(props) =>
    props.currentDisplayType === "aside" || props.hasFooter ? "8px" : "16px"};

  white-space: pre-line;

  #modal-scroll > .scroll-wrapper > .scroller > .scroll-body {
    ${(props) =>
      isMobile && props.theme.interfaceDirection === "rtl"
        ? `margin-left: 0 !important;`
        : `margin-right: 0 !important;`}

    ${(props) =>
      props.theme.interfaceDirection === "rtl"
        ? `padding-left: 16px !important;`
        : `padding-right: 16px !important;`}

    ${(props) =>
      props.isScrollLocked &&
      css`
        ${props.theme.interfaceDirection === "rtl"
          ? `margin-left: 0 !important;`
          : `margin-right: 0 !important;`}

        overflow: hidden !important;
      `}
  }

  ${(props) =>
    props.currentDisplayType === "aside" &&
    css<{ withBodyScroll?: boolean }>`
      ${props.theme.interfaceDirection === "rtl"
        ? `margin-left: ${props.withBodyScroll ? "-16px" : "0"};`
        : `margin-right: ${props.withBodyScroll ? "-16px" : "0"};`}

      padding-bottom: 8px;
      height: 100%;
      min-height: auto;
    `}
`;

const StyledFooter = styled.div<{
  withFooterBorder?: boolean;
  isDoubleFooterLine?: boolean;
}>`
  display: flex;
  flex-direction: row;
  ${(props) =>
    props.withFooterBorder &&
    `border-top: 1px solid ${props.theme.modalDialog.headerBorderColor}`};
  padding: 16px;

  gap: 8px;
  @media ${tablet} {
    gap: 10px;
  }

  ${(props) =>
    props.isDoubleFooterLine &&
    css`
      flex-direction: column;
      div {
        display: flex;
        gap: 8px;
      }
    `}
`;

Dialog.defaultProps = { theme: Base };
StyledHeader.defaultProps = { theme: Base };
Content.defaultProps = { theme: Base };

export { StyledModal, StyledHeader, Content, Dialog, StyledBody, StyledFooter };