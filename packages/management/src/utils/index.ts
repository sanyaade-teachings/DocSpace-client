import { settingsTree } from "./settingsTree"
import { translations } from "../autoGeneratedTranslations";
import { parseAddress } from "@docspace/components/utils/email";
import { errorKeys } from "@docspace/components/utils/constants";
import { TranslationType } from "SRC_DIR/types/spaces";

export const getItemByLink = (path: string) => {
    const resultPath = path.split("/")[1];
    const item = settingsTree.filter((item) => item.link === resultPath);
    return item[0];
}

export const getMinifyTitle = (title: string) => {
    const titleArr = title.split(" ");

    if (titleArr.length === 1) {
        return titleArr[0][0].toUpperCase();
    }
    const firstChar = titleArr[0][0].toUpperCase();
    const secondChar = titleArr[1][0].toUpperCase();
    return `${firstChar}${secondChar}`
}

export function getLanguage(lng: string) {
    try {
        let language = lng == "en-US" || lng == "en-GB" ? "en" : lng;

        const splitted = lng.split("-");

        if (splitted.length == 2 && splitted[0] == splitted[1].toLowerCase()) {
            language = splitted[0];
        }

        return language;
    } catch (error) {
        console.error(error);
    }

    return lng;
}

export function loadLanguagePath(homepage: string, fixedNS = null) {
    return (lng: string | [string], ns: string) => {
        const language = getLanguage(lng instanceof Array ? lng[0] : lng);

        const lngCollection = translations.get(language);

        const path = lngCollection?.get(`${fixedNS || ns}`);

        if (!path) return `/management/locales/${language}/${fixedNS || ns}.json`;

        const isCommonPath = path?.indexOf("Common") > -1;
        const isClientPath = !isCommonPath && path?.indexOf("Management") === -1;

        if (ns.length > 0 && ns[0] === "Common" && isCommonPath) {
            return path.replace("/management/", "/static/");
        }

        if (ns.length > 0 && ns[0] != "Management" && isClientPath) {
            return path.replace("/management/", "/");
        }

        return path;
    };
}

export const parseDomain = (domain: string, setError: Function, t: TranslationType) => {
    let parsedDomain = parseAddress("test@" + domain);

    if (parsedDomain?.parseErrors.length > 0) {
        const translatedErrors =  parsedDomain.parseErrors.map((error) => {
            switch (error.errorKey) {
                case errorKeys.LocalDomain:
                  return t("Common:LocalDomain");
                case errorKeys.IncorrectDomain:
                case errorKeys.IncorrectEmail:
                  return t("Common:IncorrectDomain");
                case errorKeys.DomainIpAddress:
                  return t("Common:DomainIpAddress");
                case errorKeys.PunycodeDomain:
                  return t("Common:PunycodeDomain");
                case errorKeys.PunycodeLocalPart:
                  return t("Common:PunycodeLocalPart");
                case errorKeys.IncorrectLocalPart:
                  return t("Common:IncorrectLocalPart");
                case errorKeys.SpacesInLocalPart:
                  return t("Common:SpacesInLocalPart");
                case errorKeys.MaxLengthExceeded:
                  return t("Common:MaxLengthExceeded");
                default:
                  throw new Error("Unknown translation key");
              }
        })

        setError(translatedErrors);
    }
    
    return parsedDomain.isValid();
}

export const validatePortalName = ( value: string, nameValidator, setError: Function, t: TranslationType) => {
    const validName = new RegExp(nameValidator.regex);
    switch(true) {
        case value === "":
            return setError(t("Settings:PortalNameEmpty"));
        case value.length < nameValidator.minLength ||
        value.length > nameValidator.maxLength:
            return setError(t("Settings:PortalNameLength", {
                minLength: nameValidator.minLength,
                maxLength: nameValidator.maxLength,
              }));
        case !validName.test(value):
            return setError(t("Settings:PortalNameIncorrect"));
            
        default:
            setError(null);
    }
    return validName.test(value);
}