import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@docspace/shared/components/loader";
import axios from "axios";
import { combineUrl } from "@docspace/shared/utils/combineUrl";
import ConfirmWrapper from "./ConfirmWrapper";
import { getUserByEmail } from "@docspace/shared/api/people";

let loadTimeout = null;
export default function withLoader(WrappedComponent) {
  const withLoader = (props) => {
    const {
      tReady,
      isLoading,
      linkData,
      passwordSettings,
      getSettings,
      getPortalPasswordSettings,

      getAuthProviders,
      getCapabilities,
    } = props;
    const [inLoad, setInLoad] = useState(false);

    const type = linkData ? linkData.type : null;
    const confirmHeader = linkData ? linkData.confirmHeader : null;
    const email = linkData ? linkData.email : null;

    const navigate = useNavigate();

    const fetch = async () => {
      if (type === "EmpInvite" && email) {
        try {
          await getUserByEmail(email, confirmHeader);

          const loginData = window.btoa(
            JSON.stringify({
              type: "invitation",
              email: email,
            }),
          );

          window.location.href = combineUrl(
            window.DocSpaceConfig?.proxy?.url,
            "/login",
            `?loginData=${loginData}`,
          );

          return;
        } catch (e) {}
      }

      try {
        await getPortalPasswordSettings(confirmHeader);
      } catch (error) {
        let errorMessage = "";
        if (typeof error === "object") {
          errorMessage =
            error?.response?.data?.error?.message ||
            error?.statusText ||
            error?.message ||
            "";
        } else {
          errorMessage = error;
        }

        console.error(errorMessage);
        navigate(
          combineUrl(
            window.DocSpaceConfig?.proxy?.url,
            `/login/error?message=${errorMessage}`,
          ),
        );
      }
    };

    useEffect(() => {
      if (
        (type === "PasswordChange" ||
          type === "LinkInvite" ||
          type === "Activation" ||
          type === "EmpInvite") &&
        !passwordSettings
      ) {
        fetch();
      }
    }, [passwordSettings]);

    useEffect(() => {
      if (type === "LinkInvite" || type === "EmpInvite") {
        axios.all([getAuthProviders(), getCapabilities()]).catch((error) => {
          let errorMessage = "";
          if (typeof error === "object") {
            errorMessage =
              error?.response?.data?.error?.message ||
              error?.statusText ||
              error?.message ||
              "";
          } else {
            errorMessage = error;
          }
          console.error(errorMessage);
          navigate(
            combineUrl(
              window.DocSpaceConfig?.proxy?.url,
              `/login/error?message=${errorMessage}`,
            ),
          );
        });
      }
    }, []);

    const isLoaded =
      type === "TfaActivation" || type === "TfaAuth"
        ? props.isLoaded
        : type === "PasswordChange" ||
            type === "LinkInvite" ||
            type === "Activation" ||
            type === "EmpInvite"
          ? !!passwordSettings
          : true;

    const cleanTimer = () => {
      loadTimeout && clearTimeout(loadTimeout);
      loadTimeout = null;
    };

    useEffect(() => {
      if (isLoading) {
        cleanTimer();
        loadTimeout = setTimeout(() => {
          setInLoad(true);
        }, 500);
      } else {
        cleanTimer();
        setInLoad(false);
      }

      return () => {
        cleanTimer();
      };
    }, [isLoading]);

    return !isLoaded || !tReady ? (
      <Loader className="pageLoader" type="rombs" size="40px" />
    ) : (
      <ConfirmWrapper>
        <WrappedComponent {...props} />
      </ConfirmWrapper>
    );
  };

  return inject(({ authStore, settingsStore, confirm }) => {
    const { isLoaded, isLoading } = confirm;
    const { passwordSettings, getSettings, getPortalPasswordSettings } =
      settingsStore;
    const { getAuthProviders, getCapabilities } = authStore;

    return {
      isLoaded,
      isLoading,
      getSettings,
      passwordSettings,
      getPortalPasswordSettings,
      getAuthProviders,
      getCapabilities,
    };
  })(observer(withLoader));
}
