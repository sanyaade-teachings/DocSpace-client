import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { tablet } from "../../../utils/device";
import NavItem from "./nav-item";
import { Text } from "../../text";

const backgroundColor = "#0F4071";

const StyledHeader = styled.header`
  align-items: center;
  background-color: ${backgroundColor};
  display: none;
  z-index: 200;
  position: absolute;
  width: 100vw;

  @media ${tablet} {
    display: flex;
  }
`;

const Header = React.memo(props => {
  //console.log("Header render");
  return (
    <StyledHeader>
      <NavItem
        iconName="MenuIcon"
        badgeNumber={props.badgeNumber}
        onClick={props.onClick}
      />
      <Text.MenuHeader color="#FFFFFF">
        {props.currentModule && props.currentModule.title}
      </Text.MenuHeader>
    </StyledHeader>
  );
});

Header.displayName = "Header";

Header.propTypes = {
  badgeNumber: PropTypes.number,
  onClick: PropTypes.func,
  currentModule: PropTypes.object
};

export default Header;
