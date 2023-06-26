import React from "react";
import DynamicComponent from "./DynamicComponent";
import { CLIENT_REMOTE_ENTRY_URL, CLIENT_SCOPE } from "../helpers/constants";

const StatusFillingPanel = ({
  isVisible,
  mfReady,
  fileId,
  successAuth,
  onClose,
  ...rest
}) => {
  return (
    (mfReady && isVisible && successAuth && (
      <DynamicComponent
        {...rest}
        system={{
          scope: CLIENT_SCOPE,
          url: CLIENT_REMOTE_ENTRY_URL,
          module: "./StatusFillingPanel",
        }}
        isVisible={isVisible}
        onClose={onClose}
        fileId={fileId}
      />
    )) ||
    null
  );
};

export default StatusFillingPanel;
