import React from "react";
import Text from "./";

const textTags = ["p", "span", "div"];

export default {
  title: "Components/Text",
  component: Text,
  parameters: {
    docs: {
      description: {
        component: "Component that displays plain text",
      },
    },
  },
  argTypes: {
    color: { control: "color" },
    backgroundColor: { control: "color" },
    exampleText: {
      table: {
        disable: true,
      },
    },
  },
};

const Template = ({
  exampleText,
  ...args
}: any) => {
  return (
    <div style={{ width: "100%" }}>
      <Text {...args}>{exampleText}</Text>
    </div>
  );
};

export const Default = Template.bind({});
// @ts-expect-error TS(2339): Property 'args' does not exist on type '({ example... Remove this comment to see the full error message
Default.args = {
  title: "",
  as: "p",
  fontSize: "13px",
  fontWeight: "400",
  truncate: false,
  backgroundColor: "",
  isBold: false,
  isItalic: false,
  isInline: false,
  exampleText: "Sample text",
};
