import React, { useState } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Text from "@docspace/components/text";
import ToggleButton from "@docspace/components/toggle-button";
import FileLifetime from "./FileLifetime";
import { mobile } from "@docspace/components/utils/device";

const StyledVirtualDataRoomBlock = styled.div`
  .virtual-data-room-block {
    margin-bottom: 18px;
    :last-child {
      margin-bottom: -26px;
    }

    .virtual-data-room-block_header {
      display: flex;

      .virtual-data-room-block_toggle {
        margin-left: auto;
        margin-right: 28px;
      }
    }
    .virtual-data-room-block_description {
      max-width: 420px;

      @media ${mobile} {
        max-width: 315px;
      }

      color: ${({ theme }) => theme.editLink.text.color};
    }
  }
`;

const Block = ({
  headerText,
  bodyText,
  onChange,
  isDisabled,
  isChecked,
  children,
}) => {
  return (
    <div className="virtual-data-room-block">
      <div className="virtual-data-room-block_header">
        <Text fontWeight={600} fontSize="13px">
          {headerText}
        </Text>
        <ToggleButton
          isDisabled={isDisabled}
          isChecked={isChecked}
          onChange={onChange}
          className="virtual-data-room-block_toggle"
        />
      </div>
      <Text
        fontWeight={400}
        fontSize="12px"
        className="virtual-data-room-block_description"
      >
        {bodyText}
      </Text>
      {isChecked && (
        <div className="virtual-data-room-block_content">{children}</div>
      )}
    </div>
  );
};

const VirtualDataRoomBlock = ({ t }) => {
  const role = t("Translations:RoleViewer");

  const [automaticIndexingChecked, setAutomaticIndexingChecked] =
    useState(false);
  const [fileLifetimeChecked, setFileLifetimeChecked] = useState(false);
  const [copyAndDownloadChecked, setCopyAndDownloadChecked] = useState(false);
  const [watermarksChecked, setWatermarksChecked] = useState(false);

  const onChangeAutomaticIndexing = () => {
    setAutomaticIndexingChecked(!automaticIndexingChecked);
  };

  const onChangeFileLifetime = () => {
    setFileLifetimeChecked(!fileLifetimeChecked);
  };

  const onChangeRestrictCopyAndDownload = () => {
    setCopyAndDownloadChecked(!copyAndDownloadChecked);
  };

  const onChangeAddWatermarksToDocuments = () => {
    setWatermarksChecked(!watermarksChecked);
  };

  return (
    <StyledVirtualDataRoomBlock>
      <Block
        headerText={t("AutomaticIndexing")}
        bodyText={t("AutomaticIndexingDescription")}
        onChange={onChangeAutomaticIndexing}
        isDisabled={false}
        isChecked={automaticIndexingChecked}
      ></Block>
      <Block
        headerText={t("FileLifetime")}
        bodyText={t("FileLifetimeDescription")}
        onChange={onChangeFileLifetime}
        isDisabled={false}
        isChecked={fileLifetimeChecked}
      >
        <FileLifetime t={t} />
      </Block>
      <Block
        headerText={t("RestrictCopyAndDownload")}
        bodyText={
          <Trans t={t} i18nKey="RestrictCopyAndDownloadDescription">
            Enable this setting to disable downloads and content copying for
            users with the {{ role }} role.
          </Trans>
        }
        onChange={onChangeRestrictCopyAndDownload}
        isDisabled={false}
        isChecked={copyAndDownloadChecked}
      ></Block>
      <Block
        headerText={t("AddWatermarksToDocuments")}
        bodyText={t("AddWatermarksToDocumentsDescription")}
        onChange={onChangeAddWatermarksToDocuments}
        isDisabled={false}
        isChecked={watermarksChecked}
      ></Block>
    </StyledVirtualDataRoomBlock>
  );
};

export default VirtualDataRoomBlock;
