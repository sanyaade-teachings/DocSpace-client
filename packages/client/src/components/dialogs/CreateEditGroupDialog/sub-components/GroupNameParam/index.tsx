import { ChangeEvent } from "react";
import { useState } from "react";
import { Label } from "@docspace/shared/components/label";
import { InputType, TextInput } from "@docspace/shared/components/text-input";
import { FieldContainer } from "@docspace/shared/components/field-container";
import * as Styled from "./index.styled";
import { useTranslation } from "react-i18next";
interface GroupNameParamProps {
  groupName: string;
  onChangeGroupName: (e: ChangeEvent<HTMLInputElement>) => void;
}

const GroupNameParam = ({
  groupName,
  onChangeGroupName,
}: GroupNameParamProps) => {

      const { t } = useTranslation(["Common"]);

  return (
    <Styled.GroupNameParam>
      <Label
        title={t("Common:Name")}
        className="input-label"
        display="display"
        htmlFor={"create-group-name"}
        text={t("Common:Name")}
      />

      <FieldContainer
        isVertical={true}
        labelVisible={false}
        // hasError={!isValidTitle || isWrongTitle}
        // errorMessage={errorMessage}
        errorMessageWidth={"100%"}
      >
        <TextInput
          id={"create-group-name"}
          type={InputType.text}
          value={groupName}
          onChange={onChangeGroupName}
          // onFocus={onFocus}
          // onBlur={onBlur}
          scale
          placeholder={t("Common:EnterName")}
          tabIndex={2}
          // isDisabled={isDisabled}
          // hasError={!isValidTitle}
          isAutoFocussed={true}
          // onKeyUp={onKeyUp}
          // onKeyDown={onKeyDown}
          maxLength={170}
        />
      </FieldContainer>
    </Styled.GroupNameParam>
  );
};

export default GroupNameParam;