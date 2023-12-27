import React from "react";
import styled, { css } from "styled-components";
import { isIOS, isFirefox, isMobileOnly } from "react-device-detect";
import { inject, observer } from "mobx-react";
import { getBgPattern } from "@docspace/common/utils";
import { mobile } from "@docspace/shared/utils";
import { Scrollbar } from "@docspace/shared/components";

const StyledWrapper = styled.div`
  height: ${(props) =>
    props.height
      ? props.height
      : isIOS && !isFirefox
      ? "calc(var(--vh, 1vh) * 100)"
      : "100vh"};
  width: 100vw;
  z-index: 0;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;

  @media ${mobile} {
    height: auto;
    min-height: 100%;
    width: 100%;
    min-width: 100%;
  }
`;

const BgBlock = styled.div`
  background-image: ${(props) => props.bgPattern};
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: -1;

  @media ${mobile} {
    background-image: none;
  }
`;

const ConfirmWrapper = (props) => {
  const { children, currentColorScheme, height } = props;
  const bgPattern = getBgPattern(currentColorScheme?.id);
  const content = (
    <>
      <BgBlock bgPattern={bgPattern} />
      {children}
    </>
  );

  return (
    <StyledWrapper height={height}>
      {!!height ? content : <Scrollbar>{content}</Scrollbar>}
    </StyledWrapper>
  );
};

export default inject(({ auth }) => {
  const { settingsStore } = auth;
  const { currentColorScheme } = settingsStore;

  return {
    currentColorScheme,
  };
})(observer(ConfirmWrapper));
