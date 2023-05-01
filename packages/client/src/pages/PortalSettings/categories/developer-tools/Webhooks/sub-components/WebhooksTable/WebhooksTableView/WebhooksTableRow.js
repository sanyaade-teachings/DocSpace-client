import React, { useState } from "react";
import TableRow from "@docspace/components/table-container/TableRow";
import TableCell from "@docspace/components/table-container/TableCell";
import Text from "@docspace/components/text";

import Toast from "@docspace/components/toast";
import toastr from "@docspace/components/toast/toastr";

import { ToggleButton } from "@docspace/components";
import SettingsIcon from "PUBLIC_DIR/images/settings.webhooks.react.svg?url";
import HistoryIcon from "PUBLIC_DIR/images/history.react.svg?url";
import DeleteIcon from "PUBLIC_DIR/images/delete.react.svg?url";
import WebhookDialog from "../../WebhookDialog";
import { DeleteWebhookDialog } from "../../DeleteWebhookDialog";
import { StatusBadge } from "../../StatusBadge";

import { useNavigate } from "react-router-dom";

export const WebhooksTableRow = ({ webhook, toggleEnabled, deleteWebhook, editWebhook }) => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(webhook.enabled);
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);
  const [isDeleteOpened, setIsDeleteOpened] = useState(false);

  const closeSettings = () => setIsSettingsOpened(false);
  const openSettings = () => setIsSettingsOpened(true);
  const onDeleteOpen = () => setIsDeleteOpened(true);
  const onDeleteClose = () => setIsDeleteOpened(false);
  const redirectToHistory = () => navigate(window.location.pathname + `/${webhook.id}`);

  const handleWebhookUpdate = async (webhookInfo) => {
    await editWebhook(webhook, webhookInfo);
    toastr.success("Key reset successfully", <b>Done</b>);
  };
  const handleWebhookDelete = () => deleteWebhook(webhook);
  const handleToggleEnabled = () => {
    toggleEnabled(webhook);
    setIsChecked((prevIsChecked) => !prevIsChecked);
  };

  const contextOptions = [
    {
      key: "Settings dropdownItem",
      label: "Settings",
      icon: SettingsIcon,
      onClick: openSettings,
    },
    {
      key: "Webhook history dropdownItem",
      label: "Webhook history",
      icon: HistoryIcon,
      onClick: redirectToHistory,
    },
    {
      key: "Separator dropdownItem",
      isSeparator: true,
    },
    {
      key: "Delete webhook dropdownItem",
      label: "Delete webhook",
      icon: DeleteIcon,
      onClick: onDeleteOpen,
    },
  ];

  return (
    <>
      <TableRow contextOptions={contextOptions}>
        <TableCell>
          <Text as="span" fontWeight={600}>
            {webhook.name}{" "}
          </Text>
          <StatusBadge status={webhook.status} />
        </TableCell>
        <TableCell>
          <Text as="span" fontSize="11px" color="#A3A9AE" fontWeight={600}>
            {webhook.uri}
          </Text>
        </TableCell>
        <TableCell>
          <ToggleButton
            className="toggle toggleButton"
            id="toggle id"
            isChecked={isChecked}
            onChange={handleToggleEnabled}
          />
        </TableCell>
      </TableRow>
      <WebhookDialog
        visible={isSettingsOpened}
        onClose={closeSettings}
        header="Setting webhook"
        isSettingsModal={true}
        webhook={webhook}
        onSubmit={handleWebhookUpdate}
      />
      <DeleteWebhookDialog
        visible={isDeleteOpened}
        onClose={onDeleteClose}
        header="Delete Webhook forever?"
        handleSubmit={handleWebhookDelete}
      />
      <Toast />
    </>
  );
};
