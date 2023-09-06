import styled, { css } from "styled-components";
import { isMobile, isMobileOnly } from "react-device-detect";
import { tablet, mobile } from "@docspace/components/utils/device";
import Headline from "@docspace/common/components/Headline";
import ComboBox from "@docspace/components/combobox";
import { Base } from "@docspace/components/themes";

const StyledContainer = styled.div`
  width: 100%;
  height: 32px;
  display: grid;

  grid-template-columns: ${(props) =>
    props.isRootFolder
      ? "min-content 12px auto"
      : "29px min-content 12px auto"};

  align-items: center;

  .arrow-button {
    width: 17px;
    min-width: 17px;
  }

  @media ${tablet} {
    width: 100%;
    padding: 16px 0 0px;
  }

  ${isMobile &&
  css`
    width: 100% !important;
    padding: 16px 0 0px;
  `}

  @media ${mobile} {
    width: 100%;
    padding: 12px 0 0;
  }

  ${isMobileOnly &&
  css`
    width: 100% !important;
    padding: 12px 0 0;
  `}
`;

const StyledHeadline = styled(Headline)`
  width: fit-content;
  font-weight: 700;
  font-size: ${isMobile ? "21px !important" : "18px"};
  line-height: ${isMobile ? "28px !important" : "24px"};
  @media ${tablet} {
    font-size: 21px;
    line-height: 28px;
  }
`;

const StyledNavigationDrodown = styled(ComboBox)`
  width: 12px;
  margin-left: 4px;
  box-sizing: border-box;
  background: transparent;
`;

const StyledInfoPanelToggleWrapper = styled.div`
  margin-left: auto;

  display: ${(props) => (props.isInfoPanelVisible ? "none" : "flex")};
  align-items: center;
  justify-content: center;

  @media ${tablet} {
    display: none;
  }

  .info-panel-toggle-bg {
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-bottom: 1px;

    background-color: ${(props) =>
      props.isInfoPanelVisible
        ? props.theme.infoPanel.sectionHeaderToggleBgActive
        : props.theme.infoPanel.sectionHeaderToggleBg};

    path {
      fill: ${(props) =>
        props.isInfoPanelVisible
          ? props.theme.infoPanel.sectionHeaderToggleIconActive
          : props.theme.infoPanel.sectionHeaderToggleIcon};
    }
  }
`;
StyledInfoPanelToggleWrapper.defaultProps = { theme: Base };

export {
  StyledHeadline,
  StyledContainer,
  StyledNavigationDrodown,
  StyledInfoPanelToggleWrapper,
};
