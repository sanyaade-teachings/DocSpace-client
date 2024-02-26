import { useState } from "react";
import { inject, observer } from "mobx-react";

import { SaveCancelButtons } from "@docspace/shared/components/save-cancel-buttons";
import { SearchInput } from "@docspace/shared/components/search-input";

import AccountsTable from "./AccountsTable";
import AccountsPaging from "../../../sub-components/AccountsPaging";
// import UsersInfoBlock from "./../../../sub-components/UsersInfoBlock";

// const LICENSE_LIMIT = 100;

const SelectUsersStep = ({
  t,
  onNextStep,
  onPrevStep,
  showReminder,
  withEmailUsers,
  setResultUsers,
  areCheckedUsersEmpty,
  searchValue,
  setSearchValue,
  cancelMigration,
}) => {
  const [dataPortion, setDataPortion] = useState(withEmailUsers.slice(0, 25));

  const handleDataChange = (leftBoundary, rightBoundary) => {
    setDataPortion(withEmailUsers.slice(leftBoundary, rightBoundary));
  };

  const onChangeInput = (value) => {
    setSearchValue(value);
  };

  const onClearSearchInput = () => {
    setSearchValue("");
  };

  const filteredAccounts = dataPortion.filter(
    (data) =>
      data.displayName.toLowerCase().startsWith(searchValue.toLowerCase()) ||
      data.email.toLowerCase().startsWith(searchValue.toLowerCase()),
  );

  const handleStepIncrement = () => {
    setResultUsers();
    onNextStep();
  };
  
  const goBack = () => {
    cancelMigration();
    onPrevStep();
  };

  return (
    <>
      <SaveCancelButtons
        className="save-cancel-buttons"
        onSaveClick={handleStepIncrement}
        onCancelClick={goBack}
        showReminder
        saveButtonLabel={t("Settings:NextStep")}
        cancelButtonLabel={t("Common:Back")}
        displaySettings
        saveButtonDisabled={areCheckedUsersEmpty}
        // saveButtonDisabled={numberOfCheckedAccounts > LICENSE_LIMIT}
      />

      {/* <UsersInfoBlock
        t={t}
        selectedUsers={numberOfCheckedAccounts}
        totalUsers={users.length}
        totalLicenceLimit={LICENSE_LIMIT}
      /> */}

      <SearchInput
        id="search-users-input"
        placeholder={t("Common:Search")}
        style={{ marginTop: "20px" }}
        value={searchValue}
        onChange={onChangeInput}
        refreshTimeout={100}
        onClearSearch={onClearSearchInput}
      />

      <AccountsTable t={t} accountsData={filteredAccounts} />

      {withEmailUsers.length > 25 && filteredAccounts.length > 0 && (
        <AccountsPaging
          t={t}
          numberOfItems={withEmailUsers.length}
          setDataPortion={handleDataChange}
        />
      )}

      {filteredAccounts.length > 0 && (
        <SaveCancelButtons
          className="save-cancel-buttons"
          onSaveClick={handleStepIncrement}
          onCancelClick={goBack}
          showReminder
          saveButtonLabel={t("Settings:NextStep")}
          cancelButtonLabel={t("Common:Back")}
          displaySettings
          saveButtonDisabled={areCheckedUsersEmpty}
          // saveButtonDisabled={numberOfCheckedAccounts > LICENSE_LIMIT}
        />
      )}
    </>
  );
};

export default inject(({ importAccountsStore }) => {
  const {
    withEmailUsers,
    searchValue,
    setSearchValue,
    setResultUsers,
    areCheckedUsersEmpty,
    cancelMigration,
  } = importAccountsStore;

  return {
    setResultUsers,
    areCheckedUsersEmpty,
    withEmailUsers,
    searchValue,
    setSearchValue,
    cancelMigration,
  };
})(observer(SelectUsersStep));
