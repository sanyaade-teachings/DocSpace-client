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

export type TBaseCategory = {
  attributes: {
    categoryId: string;
    categoryTitle: string;
    createdAt: string;
    locale: string;
    name: string;
    publishedAt: string;
    updatedAt: string;
  };
  id: number;
};

export type TOformsRequest = {
  data?: TOformFile[];
  meta: TRequestMetadata;
};

export type TLocalesRequest = TOformsLocale[];

export type TOformsLocale = {
  code: string;
  createdAt: string;
  id: number;
  isDefault: boolean;
  name: string;
  updatedAt: string;
};

export type TOformsCategoryRequest = {
  data: {
    data?: TOformCategoryType[];
    meta: TRequestMetadata;
  };
};

export type TOformCategoryType = TBaseCategory & {
  attributes: {
    localizations?: TLocalizations;
  };
};

export type TLocalizations = {
  data: TBaseCategory[];
};

export type TOformFile = {
  attributes: {
    card_prewiew: {
      data: {
        attributes: {
          url: string;
        };
        id: number;
      };
    };
    description_card: string;
    name_form: string;
    template_desc: string;
    template_image: {
      data: {
        attributes: {
          formats: {
            large?: TImageFormatData;
            medium?: TImageFormatData;
            small?: TImageFormatData;
            sthumbnail?: TImageFormatData;
            thumbnail?: TImageFormatData;
            xsmall?: TImageFormatData;
            xxsmall?: TImageFormatData;
          };
        };
        id: number;
      };
    };
    updatedAt: string;
  };
  id: number;
};

export type TImageFormatData = {
  ext: string;
  hash: string;
  height: number;
  mime: string;
  name: string;
  path: null;
  size: number;
  url: string;
  width: number;
};

export type TRequestMetadata = {
  pagination?: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
};
