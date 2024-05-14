// (c) Copyright Ascensio System SIA 2009-2024
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import styled, { css } from "styled-components";
import { Heading } from "@docspace/shared/components/heading";
import { Box } from "@docspace/shared/components/box";
import { DropDown } from "@docspace/shared/components/drop-down";
import { Text } from "@docspace/shared/components/text";
import { Link } from "@docspace/shared/components/link";
import { ToggleButton } from "@docspace/shared/components/toggle-button";
import { mobile, commonIconsStyles } from "@docspace/shared/utils";
import CrossIcon from "PUBLIC_DIR/images/cross.edit.react.svg";
import CrossIconMobile from "PUBLIC_DIR/images/cross.react.svg";
import { isMobile, desktop, commonInputStyles } from "@docspace/shared/utils";
import Base from "@docspace/shared/themes/base";

const fillAvailableWidth = css`
  width: 100%;
  width: -moz-available;
  width: -webkit-fill-available;
  width: fill-available;
`;

const StyledInvitePanel = styled.div`
  @media ${mobile} {
    user-select: none;
    height: auto;
    width: auto;
    background: ${(props) => props.theme.infoPanel.blurColor};
    backdrop-filter: blur(3px);
    z-index: 309;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    .invite_panel {
      background-color: ${(props) => props.theme.infoPanel.backgroundColor};
      border-left: ${(props) =>
        `1px solid ${props.theme.infoPanel.borderColor}`};
      position: absolute;
      border: none;
      right: 0;
      bottom: 0;
      height: calc(100% - 64px);
      width: 100vw;
      max-width: 100vw;
    }
  }

  .invite-panel-body {
    height: calc(100% - 55px - 73px);

    .scroll-body {
      ${(props) =>
        props.theme.interfaceDirection === "rtl"
          ? css`
              padding-left: 0px !important;
            `
          : css`
              padding-right: 0px !important;
            `}

      @media ${desktop} {
        width: 480px;
        min-width: auto !important;
      }
    }

    ${(props) =>
      !props.addUsersPanelVisible &&
      isMobile() &&
      props.theme.interfaceDirection !== "rtl" &&
      css`
        .trackYVisible {
          .scroller {
            margin-right: -20px !important;
          }
        }
      `}
  }
`;

const ScrollList = styled.div`
  width: 100%;
  height: ${(props) =>
    props.scrollAllPanelContent && props.isTotalListHeight
      ? "auto"
      : props.offsetTop && `calc(100% - ${props.offsetTop}px)`};

  ${!isMobile() &&
  css`
    .row-item {
      width: 448px !important;
    }
  `}
`;

const StyledBlock = styled.div`
  padding: ${(props) => (props.noPadding ? "0px" : "0 16px")};
  border-bottom: ${(props) => props.theme.filesPanels.sharing.borderBottom};
`;

StyledBlock.defaultProps = { theme: Base };

const StyledInviteUserBody = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const StyledHeading = styled(Heading)`
  font-weight: 700;
  font-size: 21px;
`;

const StyledSubHeader = styled(Heading)`
  font-weight: 700;
  font-size: 16px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 16px 0 8px 0;

  ${(props) =>
    props.inline &&
    css`
      display: inline-flex;
      align-items: center;
      gap: 16px;
    `};
`;

const StyledDescription = styled(Text)`
  padding-left: 16px;
  padding-right: 16px;
  color: ${(props) =>
    props.theme.createEditRoomDialog.commonParam.descriptionColor};
  margin-bottom: 16px;

  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

StyledDescription.defaultProps = { theme: Base };

const StyledRow = styled.div`
  width: calc(100% - 32px) !important;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  min-height: 41px;

  margin-inline-start: 16px;
  box-sizing: border-box;
  border-bottom: none;

  a {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
  }

  .invite-panel_access-selector {
    margin-inline-start: auto;
    margin-inline-end: 0;

    ${({ hasWarning }) => hasWarning && `margin-inline-start: 0;`}
  }

  .warning {
    margin-inline-start: auto;
  }

  .combo-button-label {
    color: ${(props) => props.theme.text.disableColor};
  }
  .combo-buttons_expander-icon path {
    fill: ${(props) => props.theme.text.disableColor};
  }

  .remove-icon {
    cursor: pointer;
    margin-inline-start: auto;

    svg {
      path {
        fill: ${(props) => props.theme.text.disableColor};
      }
    }
  }
`;

const StyledInviteInput = styled.div`
  ${fillAvailableWidth}

  margin: 0px 16px;

  .input-link {
    height: 32px;
    border: 0px;

    > input {
      height: 30px;
    }
  }

  display: flex;
  border: 1px solid rgb(208, 213, 218);
  border-radius: 3px;

  .copy-link-icon {
    padding: 0;

    &:hover {
      svg path {
        fill: ${(props) => props.theme.inputBlock.hoverIconColor} !important;
      }
    }

    svg path {
      fill: ${(props) => props.theme.inputBlock.iconColor} !important;
    }
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  .append {
    display: ${(props) => (props.isShowCross ? "flex" : "none")};
    align-items: center;
    padding-right: 8px;
    cursor: default;
  }

  ${commonInputStyles}

  :focus-within {
    border-color: ${(props) => props.theme.inputBlock.borderColor};
  }
`;

const StyledInviteInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  .header_aside-panel {
    max-width: 100% !important;
  }
`;

const StyledDropDown = styled(DropDown)`
  ${(props) => props.width && `width: ${props.width}px`};

  .list-item {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;

    .list-item_content {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .email-list_avatar {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }

    .email-list_add-button {
      display: flex;
      margin-left: auto;
      align-items: center;
      gap: 4px;

      p {
        color: #4781d1;
      }

      svg path {
        fill: #4781d1;
      }
    }
  }
`;

const SearchItemText = styled(Text)`
  line-height: ${({ theme }) =>
    theme.interfaceDirection === "rtl" ? `20px` : `16px`};

  text-overflow: ellipsis;
  overflow: hidden;
  font-size: ${(props) =>
    props.primary ? "14px" : props.info ? "11px" : "12px"};
  font-weight: ${(props) => (props.primary || props.info ? "600" : "400")};

  color: ${(props) =>
    (props.primary && !props.disabled) || props.info
      ? props.theme.text.color
      : props.theme.text.emailColor};
  ${(props) => props.info && `margin-inline-start: auto`}
`;

SearchItemText.defaultProps = { theme: Base };

const iconStyles = css`
  ${commonIconsStyles}
  path {
    fill: ${(props) => props.theme.filesEditingWrapper.fill} !important;
  }
  :hover {
    fill: ${(props) => props.theme.filesEditingWrapper.hoverFill} !important;
  }
`;

const StyledCrossIcon = styled(CrossIcon)`
  ${iconStyles}
`;

StyledCrossIcon.defaultProps = { theme: Base };

const StyledButtons = styled(Box)`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  position: absolute;
  bottom: 0px;
  width: 100%;
  background: ${(props) => props.theme.filesPanels.sharing.backgroundButtons};
  border-top: ${(props) => props.theme.filesPanels.sharing.borderTop};
`;

const StyledLink = styled(Link)`
  float: ${({ theme }) =>
    theme.interfaceDirection === "rtl" ? `left` : `right`};
`;

StyledButtons.defaultProps = { theme: Base };

const StyledToggleButton = styled(ToggleButton)`
  ${(props) =>
    props.theme.interfaceDirection === "rtl"
      ? css`
          left: 8px;
        `
      : css`
          right: 8px;
        `}
  margin-top: -4px;
`;

const StyledControlContainer = styled.div`
  width: 17px;
  height: 17px;
  position: absolute;

  cursor: pointer;

  align-items: center;
  justify-content: center;
  z-index: 450;

  @media ${mobile} {
    display: flex;

    top: -27px;
    right: 10px;
    left: unset;
  }
`;

const StyledCrossIconMobile = styled(CrossIconMobile)`
  width: 17px;
  height: 17px;
  z-index: 455;
  path {
    fill: ${(props) => props.theme.catalog.control.fill};
  }
`;

const StyledBody = styled.div`
  display: contents;

  ${({ isDisabled, theme }) =>
    isDisabled
      ? css`
          .invite-input-text {
            pointer-events: none;
            cursor: default;
            color: ${theme.text.disableColor};
          }
          .invite-input-avatar {
            opacity: 0.5;
          }

          .invite-input {
            box-shadow: unset !important;
          }
        `
      : css`
          .invite-input-text {
            color: ${theme.text.color};
          }
        `};
`;

StyledCrossIcon.defaultProps = { theme: Base };
export {
  StyledBlock,
  StyledHeading,
  StyledInvitePanel,
  StyledRow,
  StyledSubHeader,
  StyledInviteInput,
  StyledInviteInputContainer,
  StyledDropDown,
  SearchItemText,
  StyledCrossIcon,
  StyledButtons,
  StyledLink,
  ScrollList,
  StyledToggleButton,
  StyledDescription,
  StyledControlContainer,
  StyledCrossIconMobile,
  StyledInviteUserBody,
  StyledBody,
};
