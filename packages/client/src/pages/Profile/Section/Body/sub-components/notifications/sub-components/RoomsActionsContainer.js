import { inject, observer } from "mobx-react";

import { Text } from "@docspace/shared/components";
import { ToggleButton } from "@docspace/shared/components";
import { NotificationsType } from "@docspace/common/constants";
import { toastr } from "@docspace/shared/components";

const RoomsActionsContainer = ({
  t,
  badgesSubscription,
  changeSubscription,
  fetchTreeFolders,
  resetTreeItemCount,
  textProps,
  textDescriptionsProps,
}) => {
  const onChangeBadgeSubscription = async (e) => {
    const checked = e.currentTarget.checked;
    !checked && resetTreeItemCount();

    try {
      await changeSubscription(NotificationsType.Badges, checked);
      await fetchTreeFolders();
    } catch (e) {
      toastr.error(e);
    }
  };

  return (
    <div className="notification-container">
      <div className="row">
        <Text {...textProps} className="subscription-title">
          {t("RoomsActions")}
        </Text>
        <ToggleButton
          className="rooms-actions"
          onChange={onChangeBadgeSubscription}
          isChecked={badgesSubscription}
        />
      </div>
      <Text {...textDescriptionsProps}>{t("ActionsWithFilesDescription")}</Text>
    </div>
  );
};

export default inject(({ peopleStore, treeFoldersStore }) => {
  const { targetUserStore } = peopleStore;
  const { fetchTreeFolders, resetTreeItemCount } = treeFoldersStore;
  const { changeSubscription, badgesSubscription } = targetUserStore;

  return {
    resetTreeItemCount,
    fetchTreeFolders,
    changeSubscription,
    badgesSubscription,
  };
})(observer(RoomsActionsContainer));
