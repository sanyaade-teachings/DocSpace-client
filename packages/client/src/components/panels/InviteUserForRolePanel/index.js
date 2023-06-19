import React from "react";
import styled from "styled-components";

import Aside from "@docspace/components/aside";
import Backdrop from "@docspace/components/backdrop";
import Selector from "@docspace/components/selector";
import PeopleSelector from "@docspace/client/src/components/PeopleSelector";
import Link from "@docspace/components/link";
import { AddUserToRoomPanel } from "../index";
import Portal from "@docspace/components/portal";
import { withTranslation } from "react-i18next";

const StyledAside = styled(Aside)`
  .scroll-body {
    padding-right: 0 !important;
  }
`;

const StyledBlock = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding: 4px 16px 16px 16px;

  .role {
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    color: #657077;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .add-user-to-room {
    white-space: nowrap;
  }
`;

const InviteUserForRolePanel = ({
  visible,
  members,
  currentRole,
  onClose,
  onSelectUserForRole,
  onCloseInviteUserForRolePanel,
  addUserToRoomVisible,
  onOpenAddUserToRoom,
  onCloseAddUserToRoom,
  fetchMembers,
  t,
}) => {
  const blockNode = (
    <StyledBlock>
      <div className="role">({currentRole.title})</div>
      <Link
        className="add-user-to-room"
        fontWeight="600"
        type="action"
        isHovered
        onClick={onOpenAddUserToRoom}
      >
        {t("StartFillingPanel:AddUserToRoom")}
      </Link>
    </StyledBlock>
  );

  return (
    <Portal
      element={
        <>
          <Backdrop
            style={{ backdropFilter: "blur(8px)" }}
            visible={visible}
            zIndex={310}
            isAside={true}
          />
          <StyledAside
            visible={visible}
            onClose={onClose}
            zIndex={310}
            isCloseable={false}
          >
            {!addUserToRoomVisible && (
              // <PeopleSelector
              //   headerLabel="Invite user for role"
              //   onBackClickAction={onBackClickAction}
              //   items={members}
              //   placeholder="Search users"
              //   zIndex={410}
              //   selectByClick={true}
              //   onSelectUserForRole={onSelectUserForRole}
              //   blockNode={blockNode}
              // />

              <Selector
                headerLabel={t("StartFillingPanel:InviteUserForRole")}
                onBackClick={onCloseInviteUserForRolePanel}
                items={members}
                placeholder={t(
                  "StartFillingPanel:PlaceholderInviteUserForRole"
                )}
                selectByClick={true}
                onSelectUserForRole={onSelectUserForRole}
                blockNode={blockNode}
              />
            )}
          </StyledAside>

          {addUserToRoomVisible && (
            <AddUserToRoomPanel
              visible={addUserToRoomVisible}
              onClose={onCloseAddUserToRoom}
              existUsers={members}
              fetchMembers={fetchMembers}
            />
          )}
        </>
      }
    />
  );
};

export default withTranslation(["StartFillingPanel"])(InviteUserForRolePanel);
