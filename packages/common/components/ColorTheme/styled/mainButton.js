import styled, { css } from "styled-components";
import { StyledMainButton } from "@docspace/components/main-button/styled-main-button";

const getDefaultStyles = ({ currentColorScheme }) => css`
  background: ${currentColorScheme.accentColor};

  &:hover {
    background: ${currentColorScheme.accentColor};
  }
`;

export default styled(StyledMainButton)(getDefaultStyles);
