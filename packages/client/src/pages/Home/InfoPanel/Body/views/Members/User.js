import React, { useState } from "react";
import AtReactSvgUrl from "PUBLIC_DIR/images/@.react.svg?url";
import { StyledUser } from "../../styles/members";
import Avatar from "@docspace/components/avatar";
import ComboBox from "@docspace/components/combobox";
import DefaultUserPhotoUrl from "PUBLIC_DIR/images/default_user_photo_size_82-82.png";
import toastr from "@docspace/components/toast/toastr";
import { isMobileOnly } from "react-device-detect";
import { decode } from "he";
import { filterUserRoleOptions } from "SRC_DIR/helpers/utils";
import { getUserRole } from "@docspace/common/utils";
import Text from "@docspace/components/text";
import EmailPlusReactSvgUrl from "PUBLIC_DIR/images/e-mail+.react.svg?url";
import { StyledUserTypeHeader } from "../../styles/members";
import IconButton from "@docspace/components/icon-button";
import { Box } from "@docspace/components";
import moment from "moment";
import { useTranslation } from "react-i18next";

const getLastSeenStatus = (date, t, i18n) => {
  if (!date) return "-";

  const momentDate = moment(date).locale(i18n.language);
  let dateFormat = "DD MMMM";

  if (momentDate.year() !== moment().year()) {
    dateFormat = "DD.MM.YYYY";
  }

  const formattedDate = momentDate.calendar({
    sameDay: `[${t("Today")}]`,
    lastDay: dateFormat,
    lastWeek: dateFormat,
    sameElse: dateFormat,
  });

  const formattedTime = momentDate.format("LT");

  return t("LastSeenAt", { date: formattedDate, time: formattedTime });
};

const User = ({
  t,
  user,
  setMembers,
  isExpect,
  membersHelper,
  currentMember,
  updateRoomMemberRole,
  selectionParentRoom,
  setSelectionParentRoom,
  changeUserType,
  setIsScrollLocked,
  isTitle,
  onRepeatInvitation,
  showInviteIcon,
}) => {
  const { i18n } = useTranslation();

  if (!selectionParentRoom) return null;
  if (!user.displayName && !user.email) return null;

  //const [userIsRemoved, setUserIsRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //if (userIsRemoved) return null;

  const canChangeUserRole = user.canEditAccess;

  const fullRoomRoleOptions = membersHelper.getOptionsByRoomType(
    selectionParentRoom.roomType,
    canChangeUserRole
  );

  const userRole = membersHelper.getOptionByUserAccess(user.access, user);

  const userRoleOptions = filterUserRoleOptions(fullRoomRoleOptions, user);

  const updateRole = (option) => {
    return updateRoomMemberRole(selectionParentRoom.id, {
      invitations: [{ id: user.id, access: option.access }],
      notify: false,
      sharingMessage: "",
    })
      .then(() => {
        setIsLoading(false);
        const users = selectionParentRoom.members.users;
        const administrators = selectionParentRoom.members.administrators;
        const expectedMembers = selectionParentRoom.members.expected;
        if (option.key === "remove") {
          setMembers({
            users: users?.filter((m) => m.id !== user.id),
            administrators: administrators?.filter((m) => m.id !== user.id),
            expected: expectedMembers?.filter((m) => m.id !== user.id),
          });

          setSelectionParentRoom({
            ...selectionParentRoom,
            members: {
              users: users?.filter((m) => m.id !== user.id),
              administrators: administrators?.filter((m) => m.id !== user.id),
              expected: expectedMembers?.filter((m) => m.id !== user.id),
            },
          });
          //setUserIsRemoved(true);
        } else {
          setMembers({
            users: users?.map((m) =>
              m.id === user.id ? { ...m, access: option.access } : m
            ),
            administrators: administrators?.map((m) =>
              m.id === user.id ? { ...m, access: option.access } : m
            ),
            expected: expectedMembers?.map((m) =>
              m.id === user.id ? { ...m, access: option.access } : m
            ),
          });

          setSelectionParentRoom({
            ...selectionParentRoom,
            members: {
              users: users?.map((m) =>
                m.id === user.id ? { ...m, access: option.access } : m
              ),
              administrators: administrators?.map((m) =>
                m.id === user.id ? { ...m, access: option.access } : m
              ),
              expected: expectedMembers?.map((m) =>
                m.id === user.id ? { ...m, access: option.access } : m
              ),
            },
          });
        }
      })
      .catch((err) => {
        toastr.error(err);
        setIsLoading(false);
      });
  };

  const abortCallback = () => {
    setIsLoading(false);
  };

  const onOptionClick = (option) => {
    if (option.access === userRole.access) return;

    const userType =
      option.key === "owner"
        ? "admin"
        : option.key === "roomAdmin"
        ? "manager"
        : option.key === "collaborator"
        ? "collaborator"
        : "user";

    const successCallback = () => {
      updateRole(option);
    };

    setIsLoading(true);

    const needChangeUserType =
      ((user.isVisitor || user.isCollaborator) && userType === "manager") ||
      (user.isVisitor && userType === "collaborator");

    if (needChangeUserType) {
      changeUserType(userType, [user], successCallback, abortCallback);
    } else {
      updateRole(option);
    }
  };

  const onToggle = (e, isOpen) => {
    setIsScrollLocked(isOpen);
  };

  const userAvatar = user.hasAvatar ? user.avatar : DefaultUserPhotoUrl;

  const role = getUserRole(user);

  const withTooltip = user.isOwner || user.isAdmin;

  const tooltipContent = `${
    user.isOwner ? t("Common:DocSpaceOwner") : t("Common:DocSpaceAdmin")
  }. ${t("Common:HasFullAccess")}`;

  const withStatus = !isExpect;

  const isOnline = currentMember?.id === user.id;

  const statusText = t("InRoom");

  const dateStr = "2022-09-18T16:24:51.0000000+02:00";

  const lastSeen = getLastSeenStatus(dateStr, t, i18n)

  return isTitle ? (
    <StyledUserTypeHeader isExpect={isExpect}>
      <Text className="title">{user.displayName}</Text>

      {showInviteIcon && (
        <IconButton
          className={"icon"}
          title={t("Common:RepeatInvitation")}
          iconName={EmailPlusReactSvgUrl}
          isFill={true}
          onClick={onRepeatInvitation}
          size={16}
        />
      )}
    </StyledUserTypeHeader>
  ) : (
    <StyledUser isExpect={isExpect} key={user.id}>
      <Avatar
        role={role}
        className="avatar"
        size="min"
        source={isExpect ? AtReactSvgUrl : userAvatar || ""}
        userName={isExpect ? "" : user.displayName}
        withTooltip={withTooltip}
        tooltipContent={tooltipContent}
        hideRoleIcon={!withTooltip}
      />

      <div>
        <Box displayProp="flex">
          <div className="name">
            {isExpect ? user.email : decode(user.displayName) || user.email}
          </div>
          {currentMember?.id === user.id && (
            <div className="me-label">&nbsp;{`(${t("Common:MeLabel")})`}</div>
          )}
        </Box>
        {withStatus && (
          <div className="status-wrapper">
            {isOnline && <div className="status-indicator" />}
            <div className="status-text">
              {isOnline ? statusText : lastSeen}
            </div>
          </div>
        )}
      </div>

      {userRole && userRoleOptions && (
        <div className="role-wrapper">
          {canChangeUserRole ? (
            <ComboBox
              className="role-combobox"
              selectedOption={userRole}
              options={userRoleOptions}
              onSelect={onOptionClick}
              scaled={false}
              withBackdrop={isMobileOnly}
              size="content"
              modernView
              title={t("Common:Role")}
              manualWidth={"fit-content"}
              isLoading={isLoading}
              isMobileView={isMobileOnly}
              directionY="both"
              onToggle={onToggle}
              displaySelectedOption
            />
          ) : (
            <div className="disabled-role-combobox" title={t("Common:Role")}>
              {userRole.label}
            </div>
          )}
        </div>
      )}
    </StyledUser>
  );
};

export default User;
