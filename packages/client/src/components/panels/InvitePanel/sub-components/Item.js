﻿import InfoEditReactSvgUrl from "PUBLIC_DIR/images/info.edit.react.svg?url";
import AtReactSvgUrl from "PUBLIC_DIR/images/@.react.svg?url";
import React, { useState, useEffect } from "react";
import { Avatar } from "@docspace/shared/components/avatar";
import { Text } from "@docspace/shared/components/text";
import { capitalize } from "lodash";

import { parseAddresses } from "@docspace/shared/utils";
import { getAccessOptions } from "../utils";
import { getUserRole } from "@docspace/shared/utils/common";

import {
  StyledEditInput,
  StyledEditButton,
  StyledCheckIcon,
  StyledCrossIcon,
  StyledHelpButton,
  StyledDeleteIcon,
  StyledInviteUserBody,
} from "../StyledInvitePanel";
import { filterUserRoleOptions } from "SRC_DIR/helpers";
import AccessSelector from "./AccessSelector";

const Item = ({
  t,
  item,
  setInviteItems,
  inviteItems,
  changeInviteItem,
  setHasErrors,
  roomType,
  isOwner,
  inputsRef,
  setIsOpenItemAccess,
  isMobileView,
  standalone,
}) => {
  const { avatar, displayName, email, id, errors, access } = item;

  const name = !!avatar ? (displayName !== "" ? displayName : email) : email;
  const source = !!avatar ? avatar : AtReactSvgUrl;
  const role = getUserRole(item);

  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const [parseErrors, setParseErrors] = useState(errors);

  const accesses = getAccessOptions(
    t,
    roomType,
    true,
    true,
    isOwner,
    standalone,
  );

  const filteredAccesses = filterUserRoleOptions(accesses, item, true);

  const defaultAccess = filteredAccesses.find(
    (option) => option.access === +access,
  );

  const errorsInList = () => {
    const hasErrors = inviteItems.some((item) => !!item.errors?.length);
    setHasErrors(hasErrors);
  };

  const onEdit = (e) => {
    if (e.detail === 2) {
      setEdit(true);
    }
  };

  const cancelEdit = (e) => {
    setInputValue(name);
    setEdit(false);
  };

  const saveEdit = (e) => {
    const value = inputValue === "" ? name : inputValue;

    setEdit(false);
    validateValue(value);
  };

  const onKeyPress = (e) => {
    if (edit) {
      if (e.key === "Enter") {
        saveEdit();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", onKeyPress);
    return () => document.removeEventListener("keyup", onKeyPress);
  });

  const validateValue = (value) => {
    const email = parseAddresses(value);
    const parseErrors = email[0].parseErrors;
    const errors = !!parseErrors.length ? parseErrors : [];

    setParseErrors(errors);
    changeInviteItem({ id, email: value, errors }).then(() => errorsInList());
  };

  const changeValue = (e) => {
    const value = e.target.value.trim();

    setInputValue(value);
  };

  const hasError = parseErrors && !!parseErrors.length;

  const removeItem = () => {
    const newItems = inviteItems.filter((item) => item.id !== id);

    setInviteItems(newItems);
  };

  const selectItemAccess = (selected) => {
    if (selected.key === "remove") return removeItem();

    changeInviteItem({ id, access: selected.access });
  };

  const textProps = !!avatar ? {} : { onClick: onEdit };

  const displayBody = (
    <>
      <StyledInviteUserBody>
        <Text {...textProps} truncate noSelect>
          {inputValue}
        </Text>
        <Text
          className="label"
          fontWeight={400}
          fontSize="12px"
          noSelect
          color="#A3A9AE"
          truncate
        >
          {item.userName
            ? `${capitalize(role)} | ${email}`
            : `${capitalize(role)}`}
        </Text>
      </StyledInviteUserBody>

      {hasError ? (
        <>
          <StyledHelpButton
            iconName={InfoEditReactSvgUrl}
            displayType="auto"
            offsetRight={0}
            tooltipContent={t("EmailErrorMessage")}
            size={16}
            color="#F21C0E"
          />
          <StyledDeleteIcon
            className="delete-icon"
            size="medium"
            onClick={removeItem}
          />
        </>
      ) : (
        <AccessSelector
          className="user-access"
          t={t}
          roomType={roomType}
          defaultAccess={defaultAccess?.access}
          onSelectAccess={selectItemAccess}
          containerRef={inputsRef}
          isOwner={isOwner}
          withRemove={true}
          filteredAccesses={filteredAccesses}
          setIsOpenItemAccess={setIsOpenItemAccess}
          isMobileView={isMobileView}
          noBorder
        />
      )}
    </>
  );

  const okIcon = <StyledCheckIcon size="scale" />;
  const cancelIcon = <StyledCrossIcon size="scale" />;

  const editBody = (
    <>
      <StyledEditInput value={inputValue} onChange={changeValue} />
      <StyledEditButton icon={okIcon} onClick={saveEdit} />
      <StyledEditButton icon={cancelIcon} onClick={cancelEdit} />
    </>
  );

  return (
    <>
      <Avatar size="min" role={role} source={source} />
      {edit ? editBody : displayBody}
    </>
  );
};

export default Item;
