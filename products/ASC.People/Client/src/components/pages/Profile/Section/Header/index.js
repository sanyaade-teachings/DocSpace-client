import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { Text, IconButton, ContextMenuButton, toastr, utils, TextInput, Button, ModalDialog } from "asc-web-components";
import { withRouter } from "react-router";
import { isAdmin, isMe } from "../../../../../store/auth/selectors";
import { getUserStatus } from "../../../../../store/people/selectors";
import { useTranslation } from 'react-i18next';
import { resendUserInvites } from "../../../../../store/services/api";
import { EmployeeStatus } from "../../../../../helpers/constants";
import { updateUserStatus } from "../../../../../store/people/actions";
import { fetchProfile } from '../../../../../store/profile/actions';
import { sendInstructionsToChangePassword, sendInstructionsToChangeEmail } from "../../../../../store/services/api";
import styled from 'styled-components';

const wrapperStyle = {
  display: "flex",
  alignItems: "center"
};

const Header = styled(Text.ContentHeader)`
  margin-left: 16px;
  margin-right: 16px;
  max-width: calc(100vw - 430px);
  @media ${utils.device.tablet} {
    max-width: calc(100vw - 96px);
  }
`;

const SectionHeaderContent = props => {
  const { profile, history, settings, isAdmin, viewer, updateUserStatus, fetchProfile } = props;

  const [newEmailState, setNewEmail] = useState(profile.email);
  const [dialogState, setDialog] = useState(
    {
      visible: false,
      header: "",
      body: "",
      buttons: [],
      newEmail: profile.email,
    });

  const onEmailChange = event => {
    const emailRegex = /.+@.+\..+/;
    const newEmail = (event && event.target.value) || newEmailState;
    const hasError = !emailRegex.test(newEmail);

    const dialog = {
      visible: true,
      header: "Change email",
      body: (
        <Text.Body>
          <span style={{ display: "block", marginBottom: "8px" }}>The activation instructions will be sent to the entered email</span>
          <TextInput
            id="new-email"
            scale={true}
            isAutoFocussed={true}
            value={newEmail}
            onChange={onEmailChange}
            hasError={hasError}
          />
        </Text.Body>
      ),
      buttons: [
        <Button
          key="SendBtn"
          label="Send"
          size="medium"
          primary={true}
          onClick={onSendEmailChangeInstructions}
          isDisabled={hasError}
        />
      ],
      newEmail: newEmail
    };

    setDialog(dialog);
  }

  const onSendEmailChangeInstructions = () => {
    sendInstructionsToChangeEmail(profile.id, newEmailState)
      .then((res) => {
        toastr.success(res);
      })
      .catch((error) => toastr.error(error))
      .finally(onDialogClose);
  }

  const onPasswordChange = () => {
    const dialog = {
      visible: true,
      header: "Change password",
      body: (
        <Text.Body>
          Send the password change instructions to the <a href={`mailto:${profile.email}`}>{profile.email}</a> email address
        </Text.Body>
      ),
      buttons: [
        <Button
          key="SendBtn"
          label="Send"
          size="medium"
          primary={true}
          onClick={onSendPasswordChangeInstructions}
        />
      ]
    };

    setDialog(dialog);
  }

  const onSendPasswordChangeInstructions = () => {
    sendInstructionsToChangePassword(profile.email)
      .then((res) => {
        toastr.success(res);
      })
      .catch((error) => toastr.error(error))
      .finally(onDialogClose);
  }

  const onDialogClose = () => {
    const dialog = { visible: false, newEmailState: profile.email };
    setDialog(dialog);
  }

  const selectedUserIds = new Array(profile.id);

  const onEditClick = () => {
    history.push(`${settings.homepage}/edit/${profile.userName}`);
  };

  const onDisableClick = () => {
    updateUserStatus(EmployeeStatus.Disabled, selectedUserIds)
      .then(() => toastr.success(t("SuccessChangeUserStatus")))
      .then(() => fetchProfile(profile.id));
  };

  const onEditPhoto = () => {
    toastr.success("Context action: Edit Photo");
  };

  const onEnableClick = () => {
    updateUserStatus(EmployeeStatus.Active, selectedUserIds)
      .then(() => toastr.success(t("SuccessChangeUserStatus")))
      .then(() => fetchProfile(profile.id));
  };

  const onReassignDataClick = user => {
    const { history, settings } = props;
    history.push(`${settings.homepage}/reassign/${user.userName}`);
  };

  const onDeletePersonalDataClick = () => {
    toastr.success("Context action: Delete personal data");
  };

  const onDeleteProfileClick = () => {
    toastr.success("Context action: Delete profile");
  };

  const onInviteAgainClick = () => {
    resendUserInvites(selectedUserIds)
      .then(() => toastr.success("The invitation was successfully sent"))
      .catch(error => toastr.error(error));
  };
  const getUserContextOptions = (user, viewer, t) => {

    let status = "";

    if (isAdmin || (!isAdmin && isMe(user, viewer.userName))) {
      status = getUserStatus(user);
    }

    switch (status) {
      case "normal":
      case "unknown":
        return [
          {
            key: "edit",
            label: t('EditUserDialogTitle'),
            onClick: onEditClick
          },
          {
            key: "change-password",
            label: t('PasswordChangeButton'),
            onClick: onPasswordChange
          },
          {
            key: "change-email",
            label: t('EmailChangeButton'),
            onClick: onEmailChange
          },
          {
            key: "edit-photo",
            label: t('EditPhoto'),
            onClick: onEditPhoto
          },
          {
            key: "disable",
            label: t('DisableUserButton'),
            onClick: onDisableClick
          }
        ];
      case "disabled":
        return [
          {
            key: "enable",
            label: t('EnableUserButton'),
            onClick: onEnableClick
          },
          {
            key: "edit-photo",
            label: t('EditPhoto'),
            onClick: onEditPhoto
          },
          {
            key: "reassign-data",
            label: t('ReassignData'),
            onClick: onReassignDataClick.bind(this, user)
          },
          {
            key: "delete-personal-data",
            label: t('RemoveData'),
            onClick: onDeletePersonalDataClick
          },
          {
            key: "delete-profile",
            label: t('DeleteSelfProfile'),
            onClick: onDeleteProfileClick
          }
        ];
      case "pending":
        return [
          {
            key: "edit",
            label: t('EditButton'),
            onClick: onEditClick
          },
          {
            key: "invite-again",
            label: t('InviteAgainLbl'),
            onClick: onInviteAgainClick
          },
          {
            key: "edit-photo",
            label: t('EditPhoto'),
            onClick: onEditPhoto
          },
          {
            key: "disable",
            label: t('DisableUserButton'),
            onClick: onDisableClick
          }
        ];
      default:
        return [];
    }
  };

  const { t } = useTranslation();
  const contextOptions = () => getUserContextOptions(profile, viewer, t);

  const onClick = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div style={wrapperStyle}>
      <div style={{ width: "16px" }}>
        <IconButton
          iconName={"ArrowPathIcon"}
          color="#A3A9AE"
          size="16"
          onClick={onClick}
        />
      </div>
      <Header truncate={true}>
        {profile.displayName}
        {profile.isLDAP && ` (${t('LDAPLbl')})`}
      </Header>
      {((isAdmin && !profile.isOwner) || isMe(viewer, profile.userName)) && (
        <ContextMenuButton
          directionX="right"
          title={t('Actions')}
          iconName="VerticalDotsIcon"
          size={16}
          color="#A3A9AE"
          getData={contextOptions}
          isDisabled={false}
        />
      )}
      <ModalDialog
          visible={dialogState.visible}
          headerContent={dialogState.header}
          bodyContent={dialogState.body}
          footerContent={dialogState.buttons}
          onClose={onDialogClose}
        />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    settings: state.auth.settings,
    viewer: state.auth.user,
    isAdmin: isAdmin(state.auth.user)
  };
}

export default connect(mapStateToProps, { updateUserStatus, fetchProfile })(withRouter(SectionHeaderContent));
