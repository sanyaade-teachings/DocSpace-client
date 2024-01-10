import React, { useEffect } from "react";
import { observer, inject } from "mobx-react";
import { withTranslation } from "react-i18next";
import { Loader } from "@docspace/shared/components/loader";
import { flagsIcons } from "../utils/image-flags";
import { isBetaLanguage } from "../utils";

export default function withCultureNames(WrappedComponent) {
  const withCultureNames = (props) => {
    const { tReady, cultures, i18n, getPortalCultures } = props;

    useEffect(() => {
      if (cultures.length > 0) return;

      getPortalCultures();
    }, []);

    const mapCulturesToArray = (cultures, i18n) => {
      const t = i18n.getFixedT(null, "Common");
      return cultures.map((culture) => {
        return {
          key: culture,
          label: t(`Culture_${culture}`),
          icon: flagsIcons?.get(`${culture}.react.svg`),
          isBeta: isBetaLanguage(culture),
        };
      });
    };

    return cultures.length > 0 && tReady ? (
      <WrappedComponent
        {...props}
        cultureNames={mapCulturesToArray(cultures, i18n)}
      />
    ) : (
      <Loader className="pageLoader" type="rombs" size="40px" />
    );
  };

  return inject(({ auth }) => {
    const { settingsStore } = auth;
    const { cultures, getPortalCultures } = settingsStore;
    return {
      cultures,
      getPortalCultures,
    };
  })(observer(withTranslation("Common")(withCultureNames)));
}
