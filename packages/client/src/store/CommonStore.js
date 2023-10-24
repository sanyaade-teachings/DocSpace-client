import { makeAutoObservable, runInAction } from "mobx";
import authStore from "@docspace/common/store/AuthStore";
import api from "@docspace/common/api";
import { setDNSSettings } from "@docspace/common/api/settings";
import toastr from "@docspace/components/toast/toastr";

class CommonStore {
  logoUrlsWhiteLabel = [];
  whiteLabelLogoText = null;
  defaultLogoTextWhiteLabel = null;

  dnsSettings = {
    defaultObj: {},
    customObj: {},
  };

  isInit = false;
  isLoaded = false;
  isLoadedArticleBody = false;
  isLoadedSectionHeader = false;
  isLoadedSubmenu = false;
  isLoadedLngTZSettings = false;
  isLoadedDNSSettings = false;
  isLoadedPortalRenaming = false;
  isLoadedCustomization = false;
  isLoadedCustomizationNavbar = false;
  isLoadedWelcomePageSettings = false;
  isLoadedAdditionalResources = false;
  isLoadedCompanyInfoSettingsData = false;

  greetingSettingsIsDefault = true;

  constructor() {
    this.authStore = authStore;
    makeAutoObservable(this);
  }

  initSettings = async () => {
    if (this.isInit) return;
    this.isInit = true;

    const { settingsStore } = authStore;
    const { standalone } = settingsStore;

    const requests = [];
    requests.push(
      settingsStore.getPortalTimezones(),
      settingsStore.getPortalCultures(),
      this.getWhiteLabelLogoUrls(),
      this.getWhiteLabelLogoText()
    );

    if (standalone) {
      requests.push(this.getDNSSettings());
    }
    return Promise.all(requests).finally(() => this.setIsLoaded(true));
  };

  setLogoUrlsWhiteLabel = (urls) => {
    this.logoUrlsWhiteLabel = urls;
  };

  setLogoText = (text) => {
    this.whiteLabelLogoText = text;
  };

  setWhiteLabelSettings = async (data) => {
    const response = await api.settings.setWhiteLabelSettings(data);
    return Promise.resolve(response);
  };

  getWhiteLabelLogoUrls = async () => {
    const { settingsStore } = authStore;
    const { whiteLabelLogoUrls } = settingsStore;
    const logos = JSON.parse(JSON.stringify(whiteLabelLogoUrls));
    this.setLogoUrlsWhiteLabel(Object.values(logos));
  };

  getWhiteLabelLogoText = async () => {
    const res = await api.settings.getLogoText();
    this.setLogoText(res);
    this.defaultLogoTextWhiteLabel = res;
    return res;
  };

  saveWhiteLabelSettings = async (data) => {
    const { settingsStore } = authStore;
    const { getWhiteLabelLogoUrls } = settingsStore;

    await this.setWhiteLabelSettings(data);
    await getWhiteLabelLogoUrls();
    this.getWhiteLabelLogoUrls();
  };

  restoreWhiteLabelSettings = async (isDefault) => {
    const { settingsStore } = authStore;
    const { getWhiteLabelLogoUrls } = settingsStore;

    await api.settings.restoreWhiteLabelSettings(isDefault);
    await getWhiteLabelLogoUrls();
    this.getWhiteLabelLogoUrls();
  };

  getGreetingSettingsIsDefault = async () => {
    const isDefault = await api.settings.getGreetingSettingsIsDefault();
    runInAction(() => {
      this.greetingSettingsIsDefault = isDefault;
    });
  };

  get isDefaultDNS() {
    const { customObj, defaultObj } = this.dnsSettings;
    return (
      defaultObj.dnsName === customObj.dnsName &&
      defaultObj.enable === customObj.enable
    );
  }
  setIsEnableDNS = (value) => {
    this.dnsSettings.customObj.enable = value;
  };

  setDNSName = (value) => {
    this.dnsSettings.customObj.dnsName = value;
  };

  setDNSSettings = (data) => {
    this.dnsSettings = { defaultObj: data, customObj: data };
  };

  getMappedDomain = async () => {
    const { settingsStore } = authStore;
    const { getPortal } = settingsStore;

    const res = await getPortal();
    const { mappedDomain } = res;

    const tempObject = {};

    tempObject.enable = !!mappedDomain;

    if (tempObject.enable) {
      tempObject.dnsName = mappedDomain;
    }

    this.setDNSSettings(tempObject);
  };
  saveDNSSettings = async () => {
    const { customObj } = this.dnsSettings;
    const { dnsName, enable } = customObj;

    await setDNSSettings(dnsName, enable);

    try {
      this.getMappedDomain();
    } catch (e) {
      toastr.error(e);
    }
  };

  getDNSSettings = async () => {
    this.getMappedDomain();
  };

  setIsLoadedArticleBody = (isLoadedArticleBody) => {
    this.isLoadedArticleBody = isLoadedArticleBody;
  };

  setIsLoadedSectionHeader = (isLoadedSectionHeader) => {
    this.isLoadedSectionHeader = isLoadedSectionHeader;
  };

  setIsLoadedSubmenu = (isLoadedSubmenu) => {
    this.isLoadedSubmenu = isLoadedSubmenu;
  };

  setIsLoadedLngTZSettings = (isLoadedLngTZSettings) => {
    this.isLoadedLngTZSettings = isLoadedLngTZSettings;
  };

  setIsLoadedWelcomePageSettings = (isLoadedWelcomePageSettings) => {
    this.isLoadedWelcomePageSettings = isLoadedWelcomePageSettings;
  };

  setIsLoadedPortalRenaming = (isLoadedPortalRenaming) => {
    this.isLoadedPortalRenaming = isLoadedPortalRenaming;
  };

  setIsLoadedDNSSettings = (isLoadedDNSSettings) => {
    this.isLoadedDNSSettings = isLoadedDNSSettings;
  };

  setIsLoadedCustomization = (isLoadedCustomization) => {
    this.isLoadedCustomization = isLoadedCustomization;
  };

  setIsLoadedCustomizationNavbar = (isLoadedCustomizationNavbar) => {
    this.isLoadedCustomizationNavbar = isLoadedCustomizationNavbar;
  };

  setIsLoadedAdditionalResources = (isLoadedAdditionalResources) => {
    this.isLoadedAdditionalResources = isLoadedAdditionalResources;
  };

  setIsLoadedCompanyInfoSettingsData = (isLoadedCompanyInfoSettingsData) => {
    this.isLoadedCompanyInfoSettingsData = isLoadedCompanyInfoSettingsData;
  };

  setIsLoaded = (isLoaded) => {
    this.isLoaded = isLoaded;
  };
}

export default CommonStore;
