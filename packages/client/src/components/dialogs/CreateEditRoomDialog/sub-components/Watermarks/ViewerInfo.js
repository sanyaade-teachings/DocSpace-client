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

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

import { TextInput } from "@docspace/shared/components/text-input";
import { Text } from "@docspace/shared/components/text";
import { ComboBox } from "@docspace/shared/components/combobox";
import { WatermarkAdditions } from "@docspace/shared/enums";

import { StyledWatermark } from "./StyledComponent";
import { Tabs, TabsTypes } from "@docspace/shared/components/tabs";

const tabsOptions = (t) => [
  {
    id: "UserName",
    name: t("UserName"),
    index: 0,
  },
  {
    id: "UserEmail",
    name: t("UserEmail"),
    index: 1,
  },
  {
    id: "UserIpAdress",
    name: t("UserIPAddress"),
    index: 2,
  },
  {
    id: "CurrentDate",
    name: t("Common:CurrentDate"),
    index: 3,
  },
  {
    id: "RoomName",
    name: t("Common:RoomName"),
    index: 4,
  },
];

const getInitialState = (initialTab) => {
  const state = {
    UserName: false,
    UserEmail: false,
    UserIpAdress: false,
    CurrentDate: false,
    RoomName: false,
  };

  initialTab.map((item) => {
    state[item.id] = true;
  });

  return state;
};

const getInitialText = (text, isEdit) => {
  return isEdit && text ? text : "";
};

const getInitialTabs = (additions, isEdit, t) => {
  const dataTabs = tabsOptions(t);

  if (!isEdit || !additions) return [dataTabs[0]];

  return dataTabs.filter((item) => additions & WatermarkAdditions[item.id]);
};

const rotateOptions = (t) => [
  { key: -45, label: t("Diagonal") },
  { key: 0, label: t("Horizontal") },
];

const getInitialRotate = (rotate, isEdit, t) => {
  const dataRotate = rotateOptions(t);

  if (!isEdit) return dataRotate[0];

  const item = dataRotate.find((item) => {
    return item.key === rotate;
  });

  return !item ? dataRotate[0] : item;
};

const ViewerInfoWatermark = ({
  isEdit,

  setWatermarks,

  initialWatermarksSettings,
}) => {
  const { t } = useTranslation(["CreateEditRoomDialog", "Common"]);

  const elements = useRef(null);
  const initialInfo = useRef(null);

  if (initialInfo.current === null) {
    initialInfo.current = {
      dataRotate: rotateOptions(t),
      dataTabs: tabsOptions(t),
      tabs: getInitialTabs(initialWatermarksSettings?.additions, isEdit, t),
      rotate: getInitialRotate(initialWatermarksSettings?.rotate, isEdit, t),
      text: getInitialText(initialWatermarksSettings?.text, isEdit),
    };

    elements.current = getInitialState(initialInfo.current.tabs);
  }

  const initialInfoRef = initialInfo.current;

  useEffect(() => {
    const { enabled, isImage } = initialWatermarksSettings;
    if (isEdit && !isImage) {
      setWatermarks({ ...initialWatermarksSettings, enabled: true }, true);

      return;
    }

    setWatermarks({
      rotate: initialInfoRef.rotate.key,
      additions: WatermarkAdditions.UserName,
      isImage: false,
      enabled: true,
      image: "",
      imageWidth: 0,
      imageHeight: 0,
      imageScale: 0,
    });
  }, []);

  const [selectedPosition, setSelectedPosition] = useState(
    initialInfoRef.rotate,
  );
  const [textValue, setTextValue] = useState(initialInfoRef.text);

  const onSelect = (item) => {
    let elementsData = elements.current;
    let flagsCount = 0;

    const key = item.id;

    elementsData[key] = !elementsData[item.id];

    for (const key in elementsData) {
      const value = elementsData[key];

      if (value) {
        flagsCount += WatermarkAdditions[key];
      }
    }

    setWatermarks({ additions: flagsCount });
  };

  const onPositionChange = (item) => {
    setSelectedPosition(item);

    setWatermarks({ rotate: item.key });
  };

  const onTextChange = (e) => {
    const { value } = e.target;
    setTextValue(value);

    setWatermarks({ text: value });
  };

  return (
    <StyledWatermark>
      <Text className="watermark-title" fontWeight={600} lineHeight="20px">
        {t("AddWatermarkElements")}
      </Text>

      <Tabs
        items={initialInfoRef.dataTabs}
        selectedItems={initialInfoRef.tabs.map((item) => item.index)}
        onSelect={onSelect}
        type={TabsTypes.Secondary}
        multiple
      />

      <Text
        className="watermark-title title-without-top"
        fontWeight={600}
        lineHeight="20px"
      >
        {t("AddStaticText")}
      </Text>
      <TextInput scale value={textValue} tabIndex={1} onChange={onTextChange} />

      <Text className="watermark-title" fontWeight={600} lineHeight="20px">
        {t("Position")}
      </Text>
      <ComboBox
        selectedOption={selectedPosition}
        options={initialInfoRef.dataRotate}
        onSelect={onPositionChange}
        scaled
        scaledOptions
      />
    </StyledWatermark>
  );
};

export default inject(({ createEditRoomStore }) => {
  const { setWatermarks, initialWatermarksSettings } = createEditRoomStore;

  return {
    setWatermarks,
    initialWatermarksSettings,
  };
})(observer(ViewerInfoWatermark));