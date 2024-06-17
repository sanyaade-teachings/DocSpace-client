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

import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import { Box } from "@docspace/shared/components/box";
//import FormStore from "@docspace/studio/src/store/SsoFormStore";
import { Text } from "@docspace/shared/components/text";
import { ToggleButton } from "@docspace/shared/components/toggle-button";
import { Badge } from "@docspace/shared/components/badge";
import { globalColors } from "@docspace/shared/themes";

const borderProp = { radius: "6px" };

const ToggleSSO = (props) => {
  const { theme, enableSso, ssoToggle, isSSOAvailable, t } = props;

  return (
    <>
      <Text className="intro-text settings_unavailable" noSelect>
        {t("SsoIntro")}
      </Text>

      <Box
        backgroundProp={
          theme.client.settings.integration.sso.toggleContentBackground
        }
        borderProp={borderProp}
        displayProp="flex"
        flexDirection="row"
        paddingProp="12px"
      >
        <ToggleButton
          className="enable-sso toggle"
          isChecked={enableSso}
          onChange={() => ssoToggle(t)}
          isDisabled={!isSSOAvailable}
        />

        <div className="toggle-caption">
          <div className="toggle-caption_title">
            <Text
              fontWeight={600}
              lineHeight="20px"
              noSelect
              className="settings_unavailable"
            >
              {t("TurnOnSSO")}
            </Text>
            {!isSSOAvailable && (
              <Badge
                backgroundColor={globalColors.favoritesStatus}
                label={t("Common:Paid")}
                fontWeight="700"
                className="toggle-caption_title_badge"
                isPaidBadge={true}
              />
            )}
          </div>
          <Text
            fontSize="12px"
            fontWeight={400}
            lineHeight="16px"
            className="settings_unavailable"
            noSelect
          >
            {t("TurnOnSSOCaption")}
          </Text>
        </div>
      </Box>
    </>
  );
};

export default inject(({ settingsStore, ssoStore }) => {
  const { theme } = settingsStore;
  const { enableSso, ssoToggle } = ssoStore;

  return {
    theme,
    enableSso,
    ssoToggle,
  };
})(withTranslation(["SingleSignOn"])(observer(ToggleSSO)));
