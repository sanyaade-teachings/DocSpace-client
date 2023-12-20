import React from "react";
import equal from "fast-deep-equal/react";

import { StyledTextInput } from "./TextInput.styled";
import { TextInputProps } from "./TextInput.types";

const compare = (
  prevProps: Readonly<TextInputProps>,
  nextProps: Readonly<TextInputProps>,
) => {
  return equal(prevProps, nextProps);
};

export const TextInputPure = (props: TextInputProps) => {
  const { withBorder = true } = props;
  return (
    <StyledTextInput
      {...props}
      withBorder={withBorder}
      data-testid="text-input"
    />
  );
};

const TextInput = React.memo(TextInputPure, compare);

TextInput.displayName = "TextInput";

export { TextInput };
