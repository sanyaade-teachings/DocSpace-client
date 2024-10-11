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

import { inject, observer } from "mobx-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SectionSubmenuSkeleton } from "@docspace/shared/skeletons/sections";
import { Tabs } from "@docspace/shared/components/tabs";
import { Box } from "@docspace/shared/components/box";
import { UserStore } from "@docspace/shared/store/UserStore";
import { TUser } from "@docspace/shared/api/people/types";

import ClientLoadingStore from "SRC_DIR/store/ClientLoadingStore";
import PeopleStore from "SRC_DIR/store/contacts/PeopleStore";
import UsersStore from "SRC_DIR/store/contacts/UsersStore";
import GroupsStore from "SRC_DIR/store/contacts/GroupsStore";
import {
  getContactsView,
  GROUPS_ROUTE_WITH_FILTER,
  GUESTS_ROUTE_WITH_FILTER,
  PEOPLE_ROUTE_WITH_FILTER,
} from "SRC_DIR/helpers/contacts";
import { Badge } from "@docspace/shared/components/badge";
import { globalColors } from "@docspace/shared/themes";
import Filter from "@docspace/shared/api/people/filter";

type ContactsTabsProps = {
  showBodyLoader: ClientLoadingStore["showBodyLoader"];

  setUsersSelection: UsersStore["setSelection"];
  setUsersBufferSelection: UsersStore["setBufferSelection"];

  setGroupsSelection: GroupsStore["setSelection"];
  setGroupsBufferSelection: GroupsStore["setBufferSelection"];

  setIsSectionFilterLoading: ClientLoadingStore["setIsSectionFilterLoading"];

  userId: TUser["id"];
  isVisitor: TUser["isVisitor"];
  isCollaborator: TUser["isCollaborator"];
  isRoomAdmin: TUser["isRoomAdmin"];
};

const ContactsTabs = ({
  showBodyLoader,
  setUsersSelection,
  setGroupsSelection,
  setUsersBufferSelection,
  setGroupsBufferSelection,
  setIsSectionFilterLoading,
  userId,
  isVisitor,
  isCollaborator,
  isRoomAdmin,
}: ContactsTabsProps) => {
  const { t } = useTranslation(["Common"]);
  const location = useLocation();
  const navigate = useNavigate();

  const contactsView = getContactsView(location);

  const onPeople = () => {
    setUsersSelection([]);
    setUsersBufferSelection(null);
    setGroupsSelection([]);
    setGroupsBufferSelection(null);
    setIsSectionFilterLoading(true, true);
    navigate(PEOPLE_ROUTE_WITH_FILTER);
  };

  const onGroups = () => {
    setUsersSelection([]);
    setUsersBufferSelection(null);
    setIsSectionFilterLoading(true, true);

    navigate(GROUPS_ROUTE_WITH_FILTER);
  };

  const onGuests = () => {
    if (isVisitor || isCollaborator) return;
    setUsersSelection([]);
    setUsersBufferSelection(null);
    setGroupsSelection([]);
    setGroupsBufferSelection(null);
    setIsSectionFilterLoading(true, true);

    const filter = Filter.getDefault();

    if (!isRoomAdmin) {
      filter.area = "guests";
      filter.inviterId = userId;
    }

    navigate(`${GUESTS_ROUTE_WITH_FILTER}?${filter.toUrlParams()}`);
  };

  if (contactsView === "inside_group") return null;

  if (showBodyLoader) return <SectionSubmenuSkeleton />;

  const items = [
    {
      id: "people",
      name: t("Common:People"),
      onClick: onPeople,
      content: null,
    },
    {
      id: "groups",
      name: t("Common:Groups"),
      onClick: onGroups,
      content: null,
    },
  ];

  if (!isVisitor && !isCollaborator) {
    items.splice(2, 0, {
      id: "guests",
      name: (
        <Box displayProp="flex" gapProp="8px">
          {t("Common:Guests")}
          <Badge
            label={t("Files:New")}
            backgroundColor={globalColors.redRomb}
          />
        </Box>
      ),
      onClick: onGuests,
      content: null,
    });
  }

  return (
    <Tabs
      className="accounts-tabs"
      selectedItemId={contactsView as string}
      items={items}
    />
  );
};

export default inject(
  ({
    peopleStore,
    clientLoadingStore,
    userStore,
  }: {
    peopleStore: PeopleStore;
    clientLoadingStore: ClientLoadingStore;
    userStore: UserStore;
  }) => {
    const { showBodyLoader, setIsSectionFilterLoading } = clientLoadingStore;
    const { usersStore, groupsStore } = peopleStore;

    const {
      isVisitor,
      isCollaborator,
      isRoomAdmin,
      id: userId,
    } = userStore.user!;

    const {
      setSelection: setUsersSelection,
      setBufferSelection: setUsersBufferSelection,
    } = usersStore!;
    const {
      setSelection: setGroupsSelection,
      setBufferSelection: setGroupsBufferSelection,
    } = groupsStore!;

    return {
      showBodyLoader,
      setUsersSelection,
      setUsersBufferSelection,
      setGroupsSelection,
      setGroupsBufferSelection,

      setIsSectionFilterLoading,

      userId,
      isVisitor,
      isCollaborator,
      isRoomAdmin,
    };
  },
)(observer(ContactsTabs));
