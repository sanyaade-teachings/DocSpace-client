import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";

import { toastr } from "../components/toast";
import { TTranslation } from "../types";
import { TUser } from "../api/people/types";
import { ThemeKeys } from "../enums";

import { getEditorTheme } from "./common";
import { checkIsSSR } from "./device";

const isSSR = checkIsSSR();

export const desktopConstants = Object.freeze({
  domain: !isSSR && window.location.origin,
  provider: "onlyoffice",
  cryptoEngineId: "{FFF0E1EB-13DB-4678-B67D-FF0A41DBBCEF}",
});

export function regDesktop(
  user: TUser,
  isEncryption: boolean,
  keys: string[],
  setEncryptionKeys: (value: string[]) => void,
  isEditor: boolean,
  getEncryptionAccess: (callback?: () => void) => void,
  t: TTranslation,
) {
  if (!isSSR) {
    const data = {
      displayName: user.displayName,
      email: user.email,
      domain: desktopConstants.domain,
      provider: desktopConstants.provider,
      userId: user.id,
      uiTheme: getEditorTheme(user.theme || ThemeKeys.BaseStr),
    };

    let extendedData;

    if (isEncryption) {
      extendedData = {
        ...data,
        encryptionKeys: {
          cryptoEngineId: desktopConstants.cryptoEngineId,
        },
      };

      if (!isEmpty(keys)) {
        const filteredKeys = omit(keys, ["userId"]);
        extendedData = {
          ...extendedData,
          encryptionKeys: { ...extendedData.encryptionKeys, ...filteredKeys },
        };
      }
    } else {
      extendedData = { ...data };
    }

    window.AscDesktopEditor?.execCommand(
      "portal:login",
      JSON.stringify(extendedData),
    );

    if (isEncryption) {
      window.cloudCryptoCommand = (type, params, callback) => {
        switch (type) {
          case "encryptionKeys": {
            setEncryptionKeys(params);
            break;
          }
          case "updateEncryptionKeys": {
            setEncryptionKeys(params);
            break;
          }
          case "relogin": {
            // toastr.info(t("Common:EncryptionKeysReload"));
            // relogin();
            break;
          }
          case "getsharingkeys":
            if (!isEditor || typeof getEncryptionAccess !== "function") {
              callback({});
              return;
            }
            getEncryptionAccess(callback);
            break;
          default:
            break;
        }
      };
    }

    window.onSystemMessage = (e) => {
      let message = e.opMessage;
      switch (e.type) {
        case "operation":
          if (!message) {
            switch (e.opType) {
              case 0:
                message = t("Common:EncryptionFilePreparing");
                break;
              case 1:
                message = t("Common:EncryptingFile");
                break;
              default:
                message = t("Common:LoadingProcessing");
            }
          }
          toastr.info(message);
          break;
        default:
          break;
      }
    };
  }
}

export function relogin() {
  if (!isSSR)
    setTimeout(() => {
      const data = {
        domain: desktopConstants.domain,
        onsuccess: "reload",
      };
      window.AscDesktopEditor.execCommand(
        "portal:logout",
        JSON.stringify(data),
      );
    }, 1000);
}

export function checkPwd() {
  if (!isSSR) {
    const data = {
      domain: desktopConstants.domain,
      emailInput: "login",
      pwdInput: "password",
    };
    window.AscDesktopEditor.execCommand(
      "portal:checkpwd",
      JSON.stringify(data),
    );
  }
}

export function logout() {
  if (!isSSR) {
    const data = {
      domain: desktopConstants.domain,
    };
    window.AscDesktopEditor.execCommand("portal:logout", JSON.stringify(data));
  }
}
