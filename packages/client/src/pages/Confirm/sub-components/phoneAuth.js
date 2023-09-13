import React, { useState } from "react";

import { withTranslation } from "react-i18next";
import Text from "@docspace/components/text";
import TextInput from "@docspace/components/text-input";
import Button from "@docspace/components/button";
import { inject, observer } from "mobx-react";
import { StyledPage, StyledBody, StyledContent } from "./StyledConfirm";
import withLoader from "../withLoader";
import FormWrapper from "@docspace/components/form-wrapper";
import DocspaceLogo from "../../../DocspaceLogo";

const PhoneAuth = (props) => {
  const { t } = props;
  const [currentNumber, setCurrentNumber] = useState("");

  return (
    <StyledPage>
      <StyledContent>
        <StyledBody>
          <DocspaceLogo className="docspace-logo" />

          <FormWrapper>
            <div className="subtitle">
              <Text fontSize="16px" fontWeight="600" className="phone-title">
                {t("EnterSmsCodeTitle")}
              </Text>

              <Text>
                <Trans
                  t={t}
                  i18nKey="EnterSmsCodeDescription"
                  ns="Confirm"
                  key={currentNumber}
                >
                  An SMS with portal access code has been sent to your
                  <strong>{{ currentNumber }}</strong> mobile number. Please
                  enter the code and click the «Continue» button. If no message
                  is received for more than three minutes, click the «Send code
                  again» link.
                </Trans>
              </Text>
            </div>

            <TextInput className="phone-input" scaled />

            <Button
              primary
              scale
              size="medium"
              label={t("Common:ContinueButton")}
              tabIndex={2}
              isDisabled={false}
            />
          </FormWrapper>
        </StyledBody>
      </StyledContent>
    </StyledPage>
  );
};

export default inject(({ auth }) => ({
  greetingTitle: auth.settingsStore.greetingSettings,
}))(withTranslation(["Confirm", "Common"])(withLoader(observer(PhoneAuth))));
