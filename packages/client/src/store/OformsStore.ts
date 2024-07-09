// (c) Copyright Ascensio System SIA 2009-2024
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { makeAutoObservable, runInAction } from "mobx";
import OformsFilter from "@docspace/shared/api/oforms/filter";
import {
  getCategoriesOfCategoryType,
  getCategoryById,
  getCategoryTypes,
  getGuideLinkByLocale,
  getOformsLocales,
  getOforms,
  submitToGallery,
} from "@docspace/shared/api/oforms";
import { toastr } from "@docspace/shared/components/toast";
import { convertToLanguage } from "@docspace/shared/utils/common";
import { LANGUAGE } from "@docspace/shared/constants";
import { getCookie } from "@docspace/shared/utils/cookie";
import { combineUrl } from "@docspace/shared/utils/combineUrl";
import { SettingsStore } from "@docspace/shared/store/SettingsStore";
import { UserStore } from "@docspace/shared/store/UserStore";
import { TFormGallery } from "@docspace/shared/api/settings/types";
import {
  TOformFile,
  TOformCategoryType,
} from "@docspace/shared/api/oforms/types";

import InfoPanelStore from "./InfoPanelStore";

class OformsStore {
  settingsStore: SettingsStore | null = null;

  infoPanelStore: InfoPanelStore | null = null;

  userStore: UserStore | null = null;

  oformFiles: TOformFile[] = [];

  gallerySelected = null;

  oformsIsLoading = false;

  oformsLoadError = false;

  oformsFilter = OformsFilter.getDefault();

  oformFromFolderId: string | null = null;

  currentCategory = null;

  categoryTitles: string[] | undefined = [];

  oformLocales: string[] | undefined = [];

  filterOformsByLocaleIsLoading = false;

  categoryFilterLoaded = false;

  languageFilterLoaded = false;

  oformFilesLoaded = false;

  submitToGalleryTileIsVisible = !localStorage.getItem(
    "submitToGalleryTileIsHidden",
  );

  constructor(
    settingsStore: SettingsStore,
    infoPanelStore: InfoPanelStore,
    userStore: UserStore,
  ) {
    this.settingsStore = settingsStore;
    this.infoPanelStore = infoPanelStore;
    this.userStore = userStore;
    makeAutoObservable(this);
  }

  get defaultOformLocale() {
    const userLocale =
      getCookie(LANGUAGE) || this.userStore?.user?.cultureName || "en";
    const convertedLocale = convertToLanguage(userLocale);

    return this.oformLocales?.includes(convertedLocale as string)
      ? convertedLocale
      : "en";
  }

  setOformFiles = (oformFiles: TOformFile[]) => (this.oformFiles = oformFiles);

  setOformsFilter = (oformsFilter: OformsFilter) =>
    (this.oformsFilter = oformsFilter);

  setOformsCurrentCategory = (currentCategory: null) =>
    (this.currentCategory = currentCategory);

  setOformFromFolderId = (oformFromFolderId: string) => {
    this.oformFromFolderId = oformFromFolderId;
  };

  setOformsIsLoading = (oformsIsLoading: boolean) =>
    (this.oformsIsLoading = oformsIsLoading);

  setGallerySelected = (gallerySelected: null) => {
    this.gallerySelected = gallerySelected;
    this.infoPanelStore?.setInfoPanelSelection(gallerySelected);
  };

  setOformsLocales = (oformLocales: string[]) =>
    (this.oformLocales = oformLocales);

  setFilterOformsByLocaleIsLoading = (
    filterOformsByLocaleIsLoading: boolean,
  ) => {
    this.filterOformsByLocaleIsLoading = filterOformsByLocaleIsLoading;
  };

  setCategoryFilterLoaded = (categoryFilterLoaded: boolean) => {
    this.categoryFilterLoaded = categoryFilterLoaded;
  };

  setLanguageFilterLoaded = (languageFilterLoaded: boolean) => {
    this.languageFilterLoaded = languageFilterLoaded;
  };

  setOformFilesLoaded = (oformFilesLoaded: boolean) => {
    this.oformFilesLoaded = oformFilesLoaded;
  };

  setOformsLoadError = (oformsLoadError: boolean) => {
    this.oformsLoadError = oformsLoadError;
  };

  fetchOformsLocales = async () => {
    const { uploadDomain, uploadDashboard } = this.settingsStore
      ?.formGallery as TFormGallery;

    const url = combineUrl(uploadDomain, uploadDashboard, "/i18n/locales");

    try {
      const fetchedLocales = await getOformsLocales(url);
      const localeKeys = fetchedLocales?.map((locale) => locale.code);
      this.setOformsLocales(localeKeys);
    } catch (e) {
      const error = e as { message: string };

      this.setOformsLocales([]);

      if (error.message !== "Network Error") toastr.error(error);
    }
  };

  getOforms = async (filter = OformsFilter.getDefault()) => {
    const { domain, path } = this.settingsStore?.formGallery as TFormGallery;

    const formName = "&fields[0]=name_form";
    const updatedAt = "&fields[1]=updatedAt";
    const defaultDescription = "&fields[4]=description_card";
    const templateDescription = "&fields[5]=template_desc";
    const cardPrewiew = "&populate[card_prewiew][fields][6]=url";
    const templateImage = "&populate[template_image][fields][7]=formats";

    const fields = `${formName}${updatedAt}${defaultDescription}${templateDescription}${cardPrewiew}${templateImage}`;
    const params = `?${fields}&${filter.toApiUrlParams()}`;

    const apiUrl = combineUrl(domain, path, params);

    try {
      const oforms = await getOforms(apiUrl);
      this.setOformsLoadError(true);
      return oforms;
    } catch (e) {
      const err = e as {
        response: { data: { error: { message: string } }; status: number };
      };
      const status = err?.response?.status;
      const isApiError = status === 404 || status === 500;
      if (isApiError) {
        this.setOformsLoadError(false);
      } else {
        toastr.error(err);
      }
    } finally {
      this.setOformsLoadError(false);
    }

    return null;
  };

  fetchOforms = async (filter = OformsFilter.getDefault()) => {
    const oformData = await this.getOforms(filter);
    const paginationData = oformData?.meta?.pagination;
    const forms = oformData?.data ?? [];

    if (paginationData) {
      filter.page = paginationData.page;
      filter.total = paginationData.total;
    }

    runInAction(() => {
      this.setOformsFilter(filter);
      this.setOformFiles(forms);
    });
  };

  fetchMoreOforms = async () => {
    if (!this.hasMoreForms || this.oformsIsLoading) return;
    this.setOformsIsLoading(true);

    const newOformsFilter = this.oformsFilter.clone();
    newOformsFilter.page += 1;

    const oformData = await this.getOforms(newOformsFilter);
    const newForms = oformData?.data ?? [];

    runInAction(() => {
      this.setOformsFilter(newOformsFilter);
      this.setOformFiles([...this.oformFiles, ...newForms]);
      this.setOformsIsLoading(false);
    });
  };

  getTypeOfCategory = (category: string) => {
    if (!category) return;

    const [categoryType] = this.categoryTitles.filter(
      (categoryTitle) => !!category.attributes[categoryTitle],
    );

    return categoryType;
  };

  getCategoryTitle = (
    category: TOformCategoryType,
    locale: string | undefined = this.defaultOformLocale,
  ) => {
    if (!category) return "";

    const categoryType = this.getTypeOfCategory(category);
    const categoryTitle = category.attributes[categoryType];

    const [localizedCategory] = category.attributes.localizations?.data.filter(
      (localization) => localization.attributes.locale === locale,
    );
    return localizedCategory?.attributes[categoryType] || categoryTitle;
  };

  submitToFormGallery = async (
    file,
    formName: string,
    language: string,
    signal = null,
  ) => {
    const { uploadDomain, uploadPath } = this.settingsStore
      ?.formGallery as TFormGallery;

    const res = await submitToGallery(
      combineUrl(uploadDomain, uploadPath),
      file,
      formName,
      language,
      signal,
    );
    return res;
  };

  fetchCurrentCategory = async () => {
    const { uploadDomain, uploadDashboard } = this.settingsStore
      ?.formGallery as TFormGallery;
    const { categorizeBy, categoryId } = this.oformsFilter;
    const locale = this.defaultOformLocale as string;

    if (!categorizeBy || !categoryId) {
      this.currentCategory = null;
      return;
    }

    const fetchedCategory = await getCategoryById(
      combineUrl(uploadDomain, uploadDashboard),
      categorizeBy,
      categoryId,
      locale,
    );

    this.currentCategory = fetchedCategory;
  };

  fetchCategoryTypes = async () => {
    const { uploadDomain, uploadDashboard } = this.settingsStore
      ?.formGallery as TFormGallery;

    const url = combineUrl(uploadDomain, uploadDashboard, "/menu-translations");
    const locale = this.defaultOformLocale;

    try {
      const menuItems = await getCategoryTypes(url, locale);

      this.categoryTitles = menuItems?.map(
        (item) => item.attributes.categoryTitle,
      );
      return menuItems;
    } catch (e) {
      const error = e as { message: string };

      if (error.message !== "Network Error") toastr.error(error);
    }

    return null;
  };

  fetchCategoriesOfCategoryType = async (categoryTypeId: string) => {
    const { uploadDomain, uploadDashboard } = this.settingsStore
      ?.formGallery as TFormGallery;

    const url = combineUrl(uploadDomain, uploadDashboard, `/${categoryTypeId}`);

    const categories = await getCategoriesOfCategoryType(
      url,
      this.oformsFilter.locale,
    );
    return categories;
  };

  fetchGuideLink = async (locale = this.defaultOformLocale) => {
    const { uploadDomain, uploadDashboard } = this.settingsStore
      ?.formGallery as TFormGallery;
    const url = combineUrl(uploadDomain, uploadDashboard, `/blog-links`);
    const guideLink = await getGuideLinkByLocale(url, locale);
    return guideLink;
  };

  filterOformsByCategory = (categorizeBy: string, categoryId: string) => {
    if (!categorizeBy || !categoryId) this.currentCategory = null;

    this.oformsFilter.page = 1;
    this.oformsFilter.categorizeBy = categorizeBy;
    this.oformsFilter.categoryId = categoryId;
    const newOformsFilter = this.oformsFilter.clone();

    runInAction(() => this.fetchOforms(newOformsFilter));
  };

  filterOformsByLocale = async (locale: string, icon: string) => {
    if (!locale) return;

    if (locale !== this.oformsFilter.locale)
      this.setFilterOformsByLocaleIsLoading(true);

    this.currentCategory = null;

    this.oformsFilter.page = 1;
    this.oformsFilter.locale = locale;
    this.oformsFilter.categorizeBy = "";
    this.oformsFilter.categoryId = "";
    this.oformsFilter.icon = icon;
    const newOformsFilter = this.oformsFilter.clone();

    runInAction(() => this.fetchOforms(newOformsFilter));
  };

  filterOformsBySearch = (search: string) => {
    this.oformsFilter.page = 1;
    this.oformsFilter.search = search;
    const newOformsFilter = this.oformsFilter.clone();

    runInAction(() => this.fetchOforms(newOformsFilter));
  };

  sortOforms = (sortBy: string, sortOrder: string) => {
    if (!sortBy || !sortOrder) return;

    this.oformsFilter.page = 1;
    this.oformsFilter.sortBy = sortBy;
    this.oformsFilter.sortOrder = sortOrder;
    const newOformsFilter = this.oformsFilter.clone();

    runInAction(() => this.fetchOforms(newOformsFilter));
  };

  resetFilters = () => {
    this.currentCategory = null;
    const newOformsFilter = OformsFilter.getDefault();
    newOformsFilter.locale = this.defaultOformLocale as string;

    runInAction(() => this.fetchOforms(newOformsFilter));
  };

  hideSubmitToGalleryTile = () => {
    localStorage.setItem("submitToGalleryTileIsHidden", "true");
    this.submitToGalleryTileIsVisible = false;
  };

  get hasGalleryFiles() {
    return this.oformFiles && !!this.oformFiles.length;
  }

  get oformsFilterTotal() {
    return this.oformsFilter.total;
  }

  get hasMoreForms() {
    return this.oformFiles?.length < this.oformsFilterTotal;
  }
}

export default OformsStore;
