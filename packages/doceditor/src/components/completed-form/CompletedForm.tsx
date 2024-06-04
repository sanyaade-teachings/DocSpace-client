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
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "styled-components";
import { useTranslation } from "react-i18next";

import { Text } from "@docspace/shared/components/text";
import { getBgPattern, getLogoUrl } from "@docspace/shared/utils/common";

import CompletedFormDarkIcon from "PUBLIC_DIR/images/completedForm/completed.form.icon.dark.svg?url";
import CompletedFormLightIcon from "PUBLIC_DIR/images/completedForm/completed.form.icon.light.svg?url";

import {
  CompletedFormLayout,
  ButtonWrapper,
  TextWrapper,
} from "./CompletedForm.styled";
import type { CompletedFormProps } from "./CompletedForm.types";
import { Button, ButtonSize } from "@docspace/shared/components/button";
import { WhiteLabelLogoType } from "@docspace/shared/enums";
import { mobile, mobileMore } from "@docspace/shared/utils";

export const CompletedForm = ({}: CompletedFormProps) => {
  const theme = useTheme();
  const { t } = useTranslation(["CompletedForm", "Common"]);

  const logoUrl = getLogoUrl(WhiteLabelLogoType.LoginPage, !theme.isBase);
  const smallLogoUrl = getLogoUrl(WhiteLabelLogoType.LightSmall, !theme.isBase);

  const bgPattern = getBgPattern(theme.currentColorScheme?.id);

  const iconUrl = theme.isBase ? CompletedFormLightIcon : CompletedFormDarkIcon;

  const onClose = () => {
    window.close();
  };

  return (
    <CompletedFormLayout bgPattern={bgPattern}>
      <picture className="completed-form__logo">
        <source media={mobile} srcSet={smallLogoUrl} />
        <source media={mobileMore} srcSet={logoUrl} />
        <img src={logoUrl} alt="logo" />
      </picture>
      <Image
        priority
        src={iconUrl}
        className="completed-form__icon"
        alt="icon"
        width={416}
        height={200}
      />
      <TextWrapper>
        <Text as="h1">{t("CompletedForm:Title")}</Text>
        <Text as="p">{t("CompletedForm:Description")}</Text>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          scale
          primary
          size={ButtonSize.medium}
          label={t("Common:Close")}
          onClick={onClose}
        />
        {/* <Button
        scale
        size={ButtonSize.medium}
        label={t("CompletedForm:FillItOutAgain")}
      /> */}
      </ButtonWrapper>
      {/* <Link className="link" href="#">
        {t("CompletedForm:GoToCompleteFolder")}
      </Link> */}
    </CompletedFormLayout>
  );
};
