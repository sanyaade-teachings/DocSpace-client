import { useState } from "react";
import { useTranslation } from "react-i18next";

import TextInput from "@docspace/components/text-input";
import ComboBox from "@docspace/components/combobox";
import Text from "@docspace/components/text";
import Checkbox from "@docspace/components/checkbox";
import WMReactSvgUrl from "PUBLIC_DIR/images/WM.react.svg?url";
import Watermark from "@docspace/common/components/Watermarks";
import { StyledWatermark } from "./StyledComponent";

const options = (t) => [
  { key: "diagonal", label: t("Diagonal") },
  { key: "horizontal", label: t("Horizontal") },
];
const TextWatermark = () => {
  const { t } = useTranslation(["CreateEditRoomDialog", "Common"]);

  const typesOptions = options(t);

  const [value, setValue] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [selectedOption, setSelectedOption] = useState(typesOptions[0]);

  const onChange = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const onTypeChange = (item) => {
    setSelectedOption(item);
  };
  const onCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const isHorizontal = selectedOption.key === "horizontal";
  return (
    <StyledWatermark>
      <div>
        <TextInput
          scale
          value={value}
          tabIndex={1}
          isAutoFocussed
          onChange={onChange}
        />
        <Text className="watermark-title" fontWeight={600} lineHeight="20px">
          {t("Position")}
        </Text>
        <ComboBox
          selectedOption={selectedOption}
          options={typesOptions}
          onSelect={onTypeChange}
          scaled
        />
        <Checkbox
          className="watermark-checkbox"
          label={t("Semitransparent")}
          onChange={onCheckboxChange}
          isChecked={isChecked}
        />
      </div>
      <Watermark
        text={value}
        image={WMReactSvgUrl}
        rotate={isHorizontal ? 0 : -45}
        isSemitransparent={isChecked}
      />
    </StyledWatermark>
  );
};
export default TextWatermark;
