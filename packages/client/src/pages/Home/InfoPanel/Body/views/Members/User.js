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
import { Box } from "@docspace/components";
import moment from "moment";

const User = ({
  t,
  user,
  isExpect,
  membersHelper,
  currentMember,
  updateRoomMemberRole,
  selectionParentRoom,
  setSelectionParentRoom,
  changeUserType,
  setIsScrollLocked,
}) => {
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
        const inRoomMembers = selectionParentRoom.members.inRoom;
        const expectedMembers = selectionParentRoom.members.expected;
        if (option.key === "remove") {
          setSelectionParentRoom({
            ...selectionParentRoom,
            members: {
              inRoom: inRoomMembers?.filter((m) => m.id !== user.id),
              expected: expectedMembers?.filter((m) => m.id !== user.id),
            },
          });
          //setUserIsRemoved(true);
        } else {
          setSelectionParentRoom({
            ...selectionParentRoom,
            members: {
              inRoom: inRoomMembers?.map((m) =>
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

  const isOnline = user.isOwner;

  const statusText = "In room";

  const dateStr = moment("2023-09-15T16:24:51.0000000+02:00");
  const date = dateStr.calendar({
    sameDay: "[Today]",
    nextDay: "D MMMM",
    nextWeek: "D MMMM",
    lastDay: "D MMMM",
    lastWeek: "D MMMM",
    sameElse: "D MMMM",
  });

  const time = dateStr.format("LT");

  const lastSeen = `last seen ${date} at ${time}`;

  return (
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
