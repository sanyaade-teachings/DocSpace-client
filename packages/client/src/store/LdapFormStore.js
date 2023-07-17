import {
  getLdapSettings,
  saveLdapSettings,
  getLdapStatus,
} from "@docspace/common/api/settings";
import { makeAutoObservable } from "mobx";

const constants = {
  NULL_PERCENT: 0,
  SSL_LDAP_PORT: 636,
  DEFAULT_LDAP_PORT: 389,
  GET_STATUS_TIMEOUT: 1000,
};

const ldapCertificateProblem = {
  CertExpired: -2146762495,
  CertValidityPeriodNesting: -2146762494,
  CertRole: -2146762493,
  CertPathLenConst: -2146762492,
  CertCritical: -2146762491,
  CertPurpose: -2146762490,
  CertIssuerChaining: -2146762489,
  CertMalformed: -2146762488,
  CertUntrustedRoot: -2146762487,
  CertChainnig: -2146762486,
  CertRevoked: -2146762484,
  CertUntrustedTestRoot: -2146762483,
  CertRevocationFailure: -2146762482,
  CertCnNoMatch: -2146762481,
  CertWrongUsage: -2146762480,
  CertUntrustedCa: -2146762478,
  CertUnrecognizedError: -2146762477,
};

class LdapFormStore {
  isLdapEnabled = false;
  enableLdap = false;
  isSettingsShown = false;
  isTlsEnabled = false;
  isSslEnabled = false;

  requiredSettings = {
    server: "",
    userDN: "",
    loginAttribute: "uid",
    portNumber: "389",
    userFilter: "(objectclass=*)",
    firstName: "givenName",
    secondName: "sn",
    mail: "mail",
  };

  login = "";
  password = "";
  authentication = true;
  acceptCertificate = false;
  isSendWelcomeEmail = false;
  errors = {};

  progressBarIntervalId = null;
  alreadyChecking = false;

  constructor() {
    makeAutoObservable(this);
  }

  load = async () => {
    const response = await getLdapSettings();

    console.log("LDAP settings", response);

    const {
      enableLdapAuthentication,
      startTls,
      ssl,
      sendWelcomeEmail,
      server,
      userDN,
      portNumber,
      userFilter,
      loginAttribute,
      ldapMapping,
      authentication,
      acceptCertificate,
    } = response;

    const {
      FirstNameAttribute,
      SecondNameAttribute,
      MailAttribute,
    } = ldapMapping;

    this.isLdapEnabled = enableLdapAuthentication;
    this.isTlsEnabled = startTls;
    this.isSslEnabled = ssl;

    this.requiredSettings = {
      server,
      userDN,
      loginAttribute,
      portNumber,
      userFilter,
      firstName: FirstNameAttribute,
      secondName: SecondNameAttribute,
      mail: MailAttribute,
    };

    this.authentication = authentication;
    this.acceptCertificate = acceptCertificate;
    this.isSendWelcomeEmail = sendWelcomeEmail;

    /*
    "response": {
      "enableLdapAuthentication": false,
      "startTls": false,
      "ssl": false,
      "sendWelcomeEmail": false,
      "server": "",
      "userDN": "",
      "portNumber": 389,
      "userFilter": "(uid=*)",
      "loginAttribute": "uid",
      "ldapMapping": {
        "FirstNameAttribute": "givenName",
        "SecondNameAttribute": "sn",
        "MailAttribute": "mail",
        "TitleAttribute": "title",
        "MobilePhoneAttribute": "mobile",
        "LocationAttribute": "street"
      },
      "accessRights": {},
      "groupMembership": false,
      "groupDN": "",
      "userAttribute": "uid",
      "groupFilter": "(objectClass=posixGroup)",
      "groupAttribute": "memberUid",
      "groupNameAttribute": "cn",
      "authentication": true,
      "acceptCertificate": false
    }
      */
  };

  setServer = (server) => {
    this.requiredSettings.server = server;
  };

  setUserDN = (userDN) => {
    this.requiredSettings.userDN = userDN;
  };

  setLoginAttribute = (loginAttribute) => {
    this.requiredSettings.loginAttribute = loginAttribute;
  };

  setPortNumber = (portNumber) => {
    this.requiredSettings.portNumber = portNumber;
  };

  setUserFilter = (userFilter) => {
    this.requiredSettings.userFilter = userFilter;
  };

  setFirstName = (firstName) => {
    this.requiredSettings.firstName = firstName;
  };
  setSecondName = (secondName) => {
    this.requiredSettings.secondName = secondName;
  };

  setMail = (mail) => {
    this.requiredSettings.mail = mail;
  };

  setLogin = (login) => {
    this.login = login;
  };
  setPassword = (password) => {
    this.password = password;
  };

  setIsAuthentication = () => {
    this.authentication = !this.authentication;
  };

  setIsSendWelcomeEmail = (sendWelcomeEmail) => {
    this.isSendWelcomeEmail = sendWelcomeEmail;
  };

  saveLdapSettings = async () => {
    let isErrorExist = false;
    this.errors = {};

    if (this.authentication) {
      this.errors.login = this.login.trim() === "";
      this.errors.password = this.password.trim() === "";

      isErrorExist = this.errors.login || this.errors.password;
    }

    for (var key in this.requiredSettings) {
      console.log({ key });
      if (
        this.requiredSettings[key] &&
        typeof this.requiredSettings[key] == "string" &&
        this.requiredSettings[key].trim() === ""
      ) {
        isErrorExist = true;
        this.errors[key] = true;
      }
    }

    if (isErrorExist) return;

    console.log("saveing settings");

    const settings = {
      EnableLdapAuthentication: this.isLdapEnabled,
      StartTls: this.isTlsEnabled,
      Ssl: this.isSslEnabled,
      SendWelcomeEmail: this.isSendWelcomeEmail,
      Server: this.requiredSettings.server,
      UserDN: this.requiredSettings.userDN,
      PortNumber: this.requiredSettings.portNumber,
      UserFilter: this.requiredSettings.userFilter,
      LoginAttribute: this.requiredSettings.loginAttribute,
      LdapMapping: {
        FirstNameAttribute: this.requiredSettings.firstName,
        SecondNameAttribute: this.requiredSettings.secondName,
        MailAttribute: this.requiredSettings.mail,
      },
      AccessRights: {},
      GroupMembership: false,
      GroupDN: "",
      UserAttribute: "",
      GroupFilter: "",
      GroupAttribute: "",
      GroupNameAttribute: "",
      Authentication: this.authentication,
      Login: this.login,
      Password: this.password,
    };

    console.log({ settings });

    const { id } = await saveLdapSettings(
      JSON.stringify(settings),
      this.acceptCertificate
    );

    console.log(respose);

    if (id) {
      this.progressBarIntervalId = setInterval(
        this.checkStatus,
        constants.GET_STATUS_TIMEOUT
      );
    }
  };

  checkStatus = () => {
    if (this.alreadyChecking) {
      return;
    }
    this.alreadyChecking = true;
    getLdapStatus()
      .then(this.onGetStatus)
      .catch((e) => {
        this.alreadyChecking = false;
      });
  };

  onGetStatus = (data) => {
    this.alreadyChecking = false;
    try {
      if (data?.error) {
        if (
          data.certificateConfirmRequest &&
          data.certificateConfirmRequest.certificateErrors
        ) {
          var errors = data.certificateConfirmRequest.certificateErrors.map(
            (item) => this.mapError(item)
          );
          data.certificateConfirmRequest.certificateErrors = errors;
        }
      }

      var status = data;
      if (
        !data ||
        (typeof data == "object" && Object.keys(data).length === 0)
      ) {
        status = {
          completed: true,
          percents: 100,
          certificateConfirmRequest: null,
          error: "",
        };
      }

      this.setProgress(status);

      if (status.warning && lastWarning !== status.warning) {
        lastWarning = status.warning;
        toastr.warning(status.warning, "", { timeOut: 0, extendedTimeOut: 0 });
      }

      if (this.isCompleted(status)) {
        lastWarning = "";

        if (status.error) throw status.error;

        this.endProcess();
      }
    } catch (error) {
      //showError(error);
      console.error(error);
      this.endProcess();
    }
  };

  setProgress = (status) => {
    console.log(status);
  };

  endProcess = () => {
    if (this.progressBarIntervalId) {
      clearInterval(this.progressBarIntervalId);
    }
    //already = false;
    //enableInterface(false);
    // if (isRestoreDefault) {
    //     enableRestoreDefault(false);
    // }
  };

  isCompleted = (status) => {
    if (!status) return true;

    if (!status.completed) return false;

    if (
      status.certificateConfirmRequest &&
      status.certificateConfirmRequest.requested
    ) {
      setCertificateDetails(status.certificateConfirmRequest);
      currentSettings = previousSettings;
      /* popupId, width, height, marginLeft, marginTop */
      //StudioBlockUIManager.blockUI("#ldapSettingsCertificateValidationDialog", 500);
      console.log("SHOW Certificate dialog");
      return true;
    }

    if (status.error) {
      return true;
    }

    console.log("SUCCESS");
    //toastr.success(ASC.Resources.Master.ResourceJS.LdapSettingsSuccess);
    return true;
  };

  mapError = (error) => {
    switch (error) {
      case ldapCertificateProblem.CertExpired:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertExpired";
      case ldapCertificateProblem.CertCnNoMatch:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertCnNoMatch";
      case ldapCertificateProblem.CertIssuerChaining:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertIssuerChaining";
      case ldapCertificateProblem.CertUntrustedCa:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertUntrustedCa";
      case ldapCertificateProblem.CertUntrustedRoot:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertUntrustedRoot";
      case ldapCertificateProblem.CertMalformed:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertMalformed";
      case ldapCertificateProblem.CertUnrecognizedError:
        return "ASC.Resources.Master.ResourceJS.LdapSettingsCertUnrecognizedError";
      case ldapCertificateProblem.CertValidityPeriodNesting:
      case ldapCertificateProblem.CertRole:
      case ldapCertificateProblem.CertPathLenConst:
      case ldapCertificateProblem.CertCritical:
      case ldapCertificateProblem.CertPurpose:
      case ldapCertificateProblem.CertChainnig:
      case ldapCertificateProblem.CertRevoked:
      case ldapCertificateProblem.CertUntrustedTestRoot:
      case ldapCertificateProblem.CertRevocationFailure:
      case ldapCertificateProblem.CertWrongUsage:
        return "";
    }

    return "";
  };

  showError = (error) => {
    var errorMessage;

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.responseText) {
      try {
        var json = JSON.parse(error.responseText);

        if (typeof json === "object") {
          if (json.ExceptionMessage) {
            errorMessage = json.ExceptionMessage;
          } else if (json.Message) {
            errorMessage = json.Message;
          }
        } else if (typeof json === "string") {
          errorMessage = error.responseText.replace(/(^")|("$)/g, "");

          if (!errorMessage.length && error.statusText) {
            errorMessage = error.statusText;
          }
        }
      } catch (e) {
        errorMessage = error.responseText;
      }
    } else if (error.statusText) {
      errorMessage = error.statusText;
    } else if (error.error) {
      errorMessage = error.error;
    }

    errorMessage =
      !errorMessage || typeof errorMessage !== "string" || !errorMessage.length
        ? "ASC.Resources.Master.ResourceJS.OperationFailedError"
        : errorMessage.replace(/(^")|("$)/g, "");

    if (!errorMessage.length) {
      console.error("showError failed with ", error);
      return;
    }

    // if (syncInProgress) {
    //     $ldapSettingsSyncError.text(errorMessage);
    //     $ldapSettingsSyncError.show();
    // } else {
    //     $ldapSettingsError.text(errorMessage);
    //     $ldapSettingsError.show();
    // }
    //setStatus("");
    //setSource("");
    //setPercents(constants.NULL_PERCENT);
    //toastr.error(errorMessage);
    console.error(errorMessage);
  };

  ldapToggle = () => {
    this.enableLdap = !this.enableLdap;

    if (this.enableLdap) {
      this.setIsSettingsShown(true);
    }
  };

  setIsSettingsShown = (shown) => {
    this.isSettingsShown = shown;
  };

  setIsTlsEnabled = (enabled) => {
    this.isTlsEnabled = enabled;
  };

  setIsSslEnabled = (enabled) => {
    this.isSslEnabled = enabled;
  };
}

export default LdapFormStore;
