import styled, { css } from "styled-components";
import StyledText from "@docspace/components/text/styled-text";
import Text from "@docspace/components/text";

const PureText = (props) => <Text {...props} />;

const getDefaultStyles = ({ $currentColorScheme }) =>
  $currentColorScheme &&
  css`
    color: ${$currentColorScheme.main.accent};
  `;

export default styled(StyledText)(getDefaultStyles);
