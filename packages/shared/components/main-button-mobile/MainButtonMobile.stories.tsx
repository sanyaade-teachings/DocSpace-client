import React, { useEffect, useReducer, useState } from "react";
import styled, { css, useTheme } from "styled-components";
import { Meta, StoryObj } from "@storybook/react";

import MobileActionsFolderReactSvgUrl from "PUBLIC_DIR/images/mobile.actions.folder.react.svg?url";
import MobileActionsRemoveReactSvgUrl from "PUBLIC_DIR/images/mobile.actions.remove.react.svg?url";
import MobileStartReactSvgUrl from "PUBLIC_DIR/images/mobile.star.react.svg?url";

import { MainButtonMobile } from "./MainButtonMobile";

import MobileMainButtonDocs from "./MainButtonMobile.docs.mdx";

const meta = {
  title: "Components/MainButtonMobile",
  component: MainButtonMobile,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: MobileMainButtonDocs,
    },
  },
} satisfies Meta<typeof MainButtonMobile>;
type Story = StoryObj<typeof meta>;

export default meta;

const StyledWrapper = styled.div<{ isAutoDocs: boolean; isMobile?: boolean }>`
  width: 500px;
  height: 600px;

  ${(props) =>
    props.isAutoDocs &&
    css`
      width: calc(100% + 40px);
      height: 500px;
      position: relative;
      margin: 0 0 -20px -20px;
    `}
`;

const Template = ({ ...args }) => {
  const maxUploads = 10;
  const maxOperations = 7;

  const [isOpenUploads, setIsOpenUploads] = useState(false);
  const [isOpenOperations, setIsOpenOperations] = useState(false);

  const [isOpenButton, setIsOpenButton] = useState(false);
  const [opened, setOpened] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const [initialState, setInitialState] = useState({
    uploads: 0,
    operations: 0,
  });
  const onUploadClick = () => {
    setInitialState({ uploads: 0, operations: 0 });
    setIsUploading(true);
    setIsOpenUploads(true);
    setIsOpenOperations(true);
    setIsOpenButton(true);
  };

  function reducer(
    state: { uploads: number; operations: number },
    action: { type: string },
  ) {
    switch (action.type) {
      case "start":
        if (
          state.uploads === maxUploads &&
          state.operations === maxOperations
        ) {
          setIsUploading(false);
          return {
            ...state,
            uploads: state.uploads,
            operations: state.operations,
          };
        }
        return {
          ...state,
          uploads:
            state.uploads !== maxUploads ? state.uploads + 1 : state.uploads,
          operations:
            state.operations !== maxOperations
              ? state.operations + 1
              : state.operations,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setOpened(null);
    if (isUploading) {
      const id = setInterval(() => {
        dispatch({ type: "start" });
      }, 1000);

      return () => clearInterval(id);
    }
  }, [dispatch, isUploading]);

  const uploadPercent = (state.uploads / maxUploads) * 100;
  const operationPercent = (state.operations / maxOperations) * 100;

  const progressOptions = [
    {
      key: "1",
      label: "Uploads",
      icon: MobileActionsRemoveReactSvgUrl,
      percent: uploadPercent,
      status: `${state.uploads}/${maxUploads}`,
      open: isOpenUploads,
      onCancel: () => setIsOpenUploads(false),
    },
    {
      key: "2",
      label: "Other operations",
      icon: MobileActionsRemoveReactSvgUrl,
      percent: operationPercent,
      status: `3 files not loaded`,
      open: isOpenOperations,
      onCancel: () => setIsOpenOperations(false),
      error: true,
    },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1245);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isAutoDocs =
    typeof window !== "undefined" && window?.location?.href.includes("docs");

  const { interfaceDirection } = useTheme();

  const actionOptions = [
    {
      key: "1",
      label: "New document",
      icon: MobileActionsFolderReactSvgUrl,
    },
    {
      key: "2",
      label: "New presentation",
      icon: MobileActionsFolderReactSvgUrl,
    },
    {
      key: "3",
      label: "New spreadsheet",
      icon: MobileActionsFolderReactSvgUrl,
    },
    {
      key: "4",
      label: "New folder",
      icon: MobileActionsFolderReactSvgUrl,
    },
  ];

  const buttonOptions = [
    {
      key: "1",
      label: "Import point",
      icon: MobileStartReactSvgUrl,
      onClick: () => setIsOpenButton(false),
    },
    {
      key: "2",
      label: "Import point",
      icon: MobileStartReactSvgUrl,
      onClick: () => setIsOpenButton(false),
    },
    {
      key: "3",
      label: "Import point",
      isSeparator: true,
    },
    {
      key: "4",
      label: "Import point",
      icon: MobileStartReactSvgUrl,
      onClick: () => setIsOpenButton(false),
    },
  ];
  return (
    <StyledWrapper isAutoDocs={isAutoDocs} isMobile={isMobile}>
      <MainButtonMobile
        {...args}
        style={{
          position: "absolute",
          bottom: "26px",
          left: interfaceDirection === "rtl" ? "44px" : "unset",
          right: interfaceDirection !== "rtl" ? "44px" : "unset",
        }}
        actionOptions={actionOptions}
        dropdownStyle={{
          position: "absolute",
          bottom: "25px",
          left: interfaceDirection === "rtl" ? "60px" : "unset",
          right: interfaceDirection !== "rtl" ? "60px" : "unset",
        }}
        progressOptions={progressOptions}
        buttonOptions={buttonOptions}
        onUploadClick={onUploadClick}
        withButton
        isOpenButton={isOpenButton}
        title="Upload"
        percent={uploadPercent}
        opened={opened || false}
      />
    </StyledWrapper>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
  args: {
    title: "Upload",
    percent: 0,
    opened: false,
  },
};