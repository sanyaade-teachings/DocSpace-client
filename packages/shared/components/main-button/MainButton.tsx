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

import React, { useRef, useState } from "react";
import { ReactSVG } from "react-svg";

import TriangleNavigationDownReactSvgUrl from "PUBLIC_DIR/images/triangle.navigation.down.react.svg?url";

import { Text } from "../text";
import { ContextMenu } from "../context-menu";

import { GroupMainButton } from "./MainButton.styled";
import { MainButtonProps } from "./MainButton.types";
import MainButtonTheme from "./MainButton.theme";

const MainButton = (props: MainButtonProps) => {
  const { text, model, isDropdown, isDisabled, onAction, opened } = props;
  const { id, ...rest } = props;

  const ref = useRef(null);
  const menuRef = useRef<null | {
    show: (e: React.MouseEvent) => void;
    hide: (e: React.MouseEvent) => void;
  }>(null);

  const [isOpen, setIsOpen] = useState(opened);

  const stopAction = (e: React.MouseEvent) => e.preventDefault();

  const toggle = (e: React.MouseEvent, isOpenProp: boolean) => {
    if (!menuRef.current) return;

    const menu = menuRef.current;

    if (isOpenProp) {
      menu.show(e);
    } else {
      menu.hide(e);
    }

    setIsOpen(isOpenProp);
  };

  const onHide = () => {
    setIsOpen(false);
  };

  const onMainButtonClick = (e: React.MouseEvent) => {
    if (!isDisabled) {
      if (!isDropdown) {
        onAction?.(e);
      } else {
        toggle(e, !isOpen);
      }
    } else {
      stopAction(e);
    }
  };

  return (
    <GroupMainButton {...rest} ref={ref} data-testid="main-button">
      <MainButtonTheme {...rest} id={id} onClick={onMainButtonClick}>
        <Text className="main-button_text">{text}</Text>
        {isDropdown && (
          <>
            <ReactSVG
              className="main-button_img"
              src={TriangleNavigationDownReactSvgUrl}
            />

            <ContextMenu
              model={model}
              containerRef={ref}
              ref={menuRef}
              onHide={onHide}
            />
          </>
        )}
      </MainButtonTheme>
    </GroupMainButton>
  );
};

MainButton.defaultProps = {
  text: "Button",
  isDisabled: false,
  isDropdown: true,
};

export { MainButton };
