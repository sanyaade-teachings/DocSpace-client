import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Text from "@docspace/components/text";
import InputPhone from "@docspace/components/input-phone";
import Button from "@docspace/components/button";
import { inject, observer } from "mobx-react";
import { StyledPage, StyledBody, StyledContent } from "./StyledConfirm";
import withLoader from "../withLoader";
import FormWrapper from "@docspace/components/form-wrapper";
import DocspaceLogo from "../../../DocspaceLogo";

const ChangePhoneForm = (props) => {
  const { t, setMobilePhone } = props;
  const [currentNumber, setCurrentNumber] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    console.log(value);
    setPhone(value);
  };

  const onSubmit = async () => {
    const res = await setMobilePhone(phone);
    console.log(res);
  };

  return (
    <StyledPage>
      <StyledContent>
        <StyledBody>
          <DocspaceLogo className="docspace-logo" />

          <FormWrapper>
            <div className="subtitle">
              <Text fontSize="16px" fontWeight="600" className="phone-title">
                {t("EnterPhone")}
              </Text>
              {currentNumber && (
                <Text>
                  {t("CurrentNumber")}: {currentNumber}
                </Text>
              )}
              <Text>{t("PhoneSubtitle")}</Text>
            </div>

            <InputPhone className="phone-input" scaled onChange={onChange} />

            <Button
              primary
              scale
              size="medium"
              label={t("GetCode")}
              tabIndex={2}
              isDisabled={false}
              onClick={onSubmit}
            />
          </FormWrapper>
        </StyledBody>
      </StyledContent>
    </StyledPage>
  );
};

export default inject(({ auth }) => {
  const { tfaStore } = auth;
  const { setMobilePhone } = tfaStore;
  return {
    setMobilePhone,
  };
})(withTranslation("Confirm")(withLoader(observer(ChangePhoneForm))));
