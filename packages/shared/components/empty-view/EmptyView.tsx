import React from "react";

import { Text } from "../text";

import {
  EmptyViewBody,
  EmptyViewHeader,
  EmptyViewWrapper,
} from "./EmptyView.styled";
import { EmptyViewItem } from "./EmptyView.item";
import type { EmptyViewProps } from "./EmptyView.types";

export const EmptyView = ({
  descriptions,
  icon,
  options,
  title,
}: EmptyViewProps) => {
  return (
    <EmptyViewWrapper>
      <EmptyViewHeader>
        {icon}
        <Text
          as="h3"
          fontWeight="700"
          lineHeight="22px"
          className="ev-header"
          noSelect
        >
          {title}
        </Text>
        <Text as="p" fontSize="12px" className="ev-subheading" noSelect>
          {descriptions}
        </Text>
      </EmptyViewHeader>
      <EmptyViewBody>
        {options.map((option) => (
          <EmptyViewItem {...option} key={option.key} />
        ))}
      </EmptyViewBody>
    </EmptyViewWrapper>
  );
};
