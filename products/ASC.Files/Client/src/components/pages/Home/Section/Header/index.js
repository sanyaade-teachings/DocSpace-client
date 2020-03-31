import React from "react";
import styled, { css } from "styled-components";
import { withRouter } from "react-router";
import { constants, Headline, store } from "asc-web-common";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  ContextMenuButton,
  DropDownItem,
  GroupButtonsMenu,
  IconButton,
  toastr,
  ComboBox,
  Icons
} from "asc-web-components";
import { fetchFiles, setAction } from "../../../../../store/files/actions";
import { default as filesStore } from "../../../../../store/store";
import { EmptyTrashDialog, DeleteDialog } from "../../../../dialogs";
import {
  SharingPanel,
  AddGroupsPanel,
  AddUsersPanel
} from "../../../../panels";
import { isCanBeDeleted } from "../../../../../store/files/selectors";

const { isAdmin } = store.auth.selectors;
const { FilterType, FileAction } = constants;

const StyledContainer = styled.div`
  @media (min-width: 1024px) {
    ${props =>
      props.isHeaderVisible &&
      css`
        width: calc(100% + 76px);
      `}
  }

  .header-container {
    position: relative;
    display: flex;
    align-items: center;
    max-width: calc(100vw - 32px);

    .arrow-button {
      margin-right: 16px;

      @media (max-width: 1024px) {
        padding: 8px 0 8px 8px;
        margin-left: -8px;
      }
    }

    .add-button {
      margin-bottom: -1px;
      margin-left: 16px;

      @media (max-width: 1024px) {
        margin-left: auto;

        & > div:first-child {
          padding: 8px 8px 8px 8px;
          margin-right: -8px;
        }
      }
    }

    .option-button {
      margin-bottom: -1px;
      margin-left: 16px;

      @media (max-width: 1024px) {
        & > div:first-child {
          padding: 8px 8px 8px 8px;
          margin-right: -8px;
        }
      }
    }
  }

  .group-button-menu-container {
    margin: 0 -16px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    padding-bottom: 56px;

    @media (max-width: 1024px) {
      & > div:first-child {
        ${props =>
          props.isArticlePinned &&
          css`
            width: calc(100% - 240px);
          `}
        position: absolute;
        top: 56px;
        z-index: 180;
      }
    }

    @media (min-width: 1024px) {
      margin: 0 -24px;
    }
  }
`;

class SectionHeaderContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showSharingPanel: false,
      showDeleteDialog: false,
      showEmptyTrashDialog: false,
      showAddUsersPanel: false,
      showAddGroupsPanel: false,
      selectedUsers: [props.currentUser],
      accessRight: { icon: "EyeIcon", rights: "ReadOnly" }
    };
  }

  onCreate = format => {
    this.props.setAction({
      type: FileAction.Create,
      extension: format,
      id: -1
    });
  };

  createDocument = () => this.onCreate("docx");

  createSpreadsheet = () => this.onCreate("xlsx");

  createPresentation = () => this.onCreate("pptx");

  createFolder = () => this.onCreate();

  uploadToFolder = () => toastr.info("Upload To Folder click");

  getContextOptionsPlus = () => {
    const { t } = this.props;

    return [
      {
        key: "new-document",
        label: t("NewDocument"),
        onClick: this.createDocument
      },
      {
        key: "new-spreadsheet",
        label: t("NewSpreadsheet"),
        onClick: this.createSpreadsheet
      },
      {
        key: "new-presentation",
        label: t("NewPresentation"),
        onClick: this.createPresentation
      },
      {
        key: "new-folder",
        label: t("NewFolder"),
        onClick: this.createFolder
      },
      { key: "separator", isSeparator: true },
      {
        key: "make-invitation-link",
        label: t("UploadToFolder"),
        onClick: this.uploadToFolder,
        disabled: true
      }
    ];
  };

  createLinkForPortalUsers = () =>
    toastr.info("createLinkForPortalUsers click");

  moveAction = () => toastr.info("moveAction click");

  copyAction = () => toastr.info("copyAction click");

  downloadAction = () => toastr.info("downloadAction click");

  downloadAsAction = () => toastr.info("downloadAsAction click");

  renameAction = () => toastr.info("renameAction click");

  onOpenSharingPanel = () =>
    this.setState({ showSharingPanel: !this.state.showSharingPanel });

  onDeleteAction = () =>
    this.setState({ showDeleteDialog: !this.state.showDeleteDialog });

  onEmptyTrashAction = () =>
    this.setState({ showEmptyTrashDialog: !this.state.showEmptyTrashDialog });

  onShowUsersPanel = () =>
    this.setState({ showAddUsersPanel: !this.state.showAddUsersPanel });

  onShowGroupsPanel = () =>
    this.setState({ showAddGroupsPanel: !this.state.showAddGroupsPanel });

  getContextOptionsFolder = () => {
    const { t } = this.props;
    return [
      {
        key: "sharing-settings",
        label: t("SharingSettings"),
        onClick: this.onOpenSharingPanel,
        disabled: true
      },
      {
        key: "link-portal-users",
        label: t("LinkForPortalUsers"),
        onClick: this.createLinkForPortalUsers,
        disabled: true
      },
      { key: "separator-2", isSeparator: true },
      {
        key: "move-to",
        label: t("MoveTo"),
        onClick: this.moveAction,
        disabled: true
      },
      {
        key: "copy",
        label: t("Copy"),
        onClick: this.copyAction,
        disabled: true
      },
      {
        key: "download",
        label: t("Download"),
        onClick: this.downloadAction,
        disabled: true
      },
      {
        key: "rename",
        label: t("Rename"),
        onClick: this.renameAction,
        disabled: true
      },
      {
        key: "delete",
        label: t("Delete"),
        onClick: this.onDeleteAction,
        disabled: true
      }
    ];
  };

  onBackToParentFolder = () => {
    fetchFiles(this.props.parentId, this.props.filter, filesStore.dispatch);
  };

  onSetSelectedUsers = users => {
    const newArray = this.state.selectedUsers;
    for (let item of users) {
      const currentItem = this.state.selectedUsers.find(x => x.id === item.id);

      if (!currentItem) {
        newArray.push(item);
      }
    }

    this.onSetUsers(newArray);
  };

  onSetUsers = users => {
    this.setState({ selectedUsers: users });
  }

  onFullAccessClick = some => {
    console.log("onFullAccessClick", some);
    this.setState({
      accessRight: { icon: "AccessEditIcon", rights: "FullAccess" }
    });
  };
  onReadOnlyClick = () => {
    console.log("onReadOnlyClick");
    this.setState({ accessRight: { icon: "EyeIcon", rights: "ReadOnly" } });
  };
  onReviewClick = () => {
    console.log("onReviewClick");
    this.setState({
      accessRight: { icon: "AccessReviewIcon", rights: "Review" }
    });
  };
  onCommentClick = () => {
    console.log("onCommentClick");
    this.setState({
      accessRight: { icon: "AccessCommentIcon", rights: "Comment" }
    });
  };
  onFormFillingClick = () => {
    console.log("onFormFillingClick");
    this.setState({
      accessRight: { icon: "AccessFormIcon", rights: "FormFilling" }
    });
  };
  onDenyAccessClick = () => {
    console.log("onDenyAccessClick");
    this.setState({
      accessRight: { icon: "AccessNoneIcon", rights: "DenyAccess" }
    });
  };

  onRemoveUserClick = item => {
    let array = this.state.selectedUsers;

    const index = array.findIndex(x => x.id === item.id);
    if (index !== -1) {
      array.splice(index, 1);

      this.setState({ selectedUsers: array });
    }
  };

  render() {
    //console.log("HEADER render");

    const {
      t,
      selection,
      isHeaderVisible,
      onClose,
      isRecycleBinFolder,
      isHeaderChecked,
      isHeaderIndeterminate,
      onSelect,
      deleteDialogVisible,
      folder,
      onCheck,
      title
    } = this.props;
    const {
      accessRight,
      showAddGroupsPanel,
      showAddUsersPanel,
      showDeleteDialog,
      showSharingPanel,
      showEmptyTrashDialog,
      selectedUsers
    } = this.state;
    const isItemsSelected = selection.length;
    const isOnlyFolderSelected = selection.every(
      selected => !selected.fileType
    );

    const menuItems = [
      {
        label: t("LblSelect"),
        isDropdown: true,
        isSeparator: true,
        isSelect: true,
        fontWeight: "bold",
        children: [
          <DropDownItem key="all" label={t("All")} />,
          <DropDownItem key={FilterType.FoldersOnly} label={t("Folders")} />,
          <DropDownItem
            key={FilterType.DocumentsOnly}
            label={t("Documents")}
          />,
          <DropDownItem
            key={FilterType.PresentationsOnly}
            label={t("Presentations")}
          />,
          <DropDownItem
            key={FilterType.SpreadsheetsOnly}
            label={t("Spreadsheets")}
          />,
          <DropDownItem key={FilterType.ImagesOnly} label={t("Images")} />,
          <DropDownItem key={FilterType.MediaOnly} label={t("Media")} />,
          <DropDownItem key={FilterType.ArchiveOnly} label={t("Archives")} />,
          <DropDownItem key={FilterType.FilesOnly} label={t("AllFiles")} />
        ],
        onSelect: item => onSelect(item.key)
      },
      {
        label: t("Share"),
        disabled: !isItemsSelected,
        onClick: this.onOpenSharingPanel
      },
      {
        label: t("Download"),
        disabled: !isItemsSelected,
        onClick: this.downloadAction
      },
      {
        label: t("DownloadAs"),
        disabled: !isItemsSelected || isOnlyFolderSelected,
        onClick: this.downloadAsAction
      },
      {
        label: t("MoveTo"),
        disabled: !isItemsSelected,
        onClick: this.moveAction
      },
      {
        label: t("Copy"),
        disabled: !isItemsSelected,
        onClick: this.copyAction
      },
      {
        label: t("Delete"),
        disabled: !isItemsSelected || !deleteDialogVisible,
        onClick: this.onDeleteAction
      }
    ];

    isRecycleBinFolder &&
      menuItems.push({
        label: t("EmptyRecycleBin"),
        onClick: this.onEmptyTrashAction
      });

    const advancedOptions = (
      <>
        <DropDownItem
          label="Full access"
          icon="AccessEditIcon"
          onClick={this.onFullAccessClick}
        />
        <DropDownItem
          label="Read only"
          icon="EyeIcon"
          onClick={this.onReadOnlyClick}
        />
        <DropDownItem
          label="Review"
          icon="AccessReviewIcon"
          onClick={this.onReviewClick}
        />
        <DropDownItem
          label="Comment"
          icon="AccessCommentIcon"
          onClick={this.onCommentClick}
        />
        <DropDownItem
          label="Form filling"
          icon="AccessFormIcon"
          onClick={this.onFormFillingClick}
        />
        <DropDownItem
          label="Deny access"
          icon="AccessNoneIcon"
          onClick={this.onDenyAccessClick}
        />
      </>
    );

    const accessOptionsComboBox = (
      <ComboBox
        advancedOptions={advancedOptions}
        options={[]}
        selectedOption={{ key: 0 }}
        size="content"
        className="panel_combo-box"
        scaled={false}
        directionX="right"
        //isDisabled={isDisabled}
      >
        {React.createElement(Icons[accessRight.icon], {
          size: "medium"
          //color: this.state.currentIconColor,
          //isfill: isFill
        })}
      </ComboBox>
    );

    return (
      <StyledContainer isHeaderVisible={isHeaderVisible}>
        {isHeaderVisible ? (
          <div className="group-button-menu-container">
            <GroupButtonsMenu
              checked={isHeaderChecked}
              isIndeterminate={isHeaderIndeterminate}
              onChange={onCheck}
              menuItems={menuItems}
              visible={isHeaderVisible}
              moreLabel={t("More")}
              closeTitle={t("CloseButton")}
              onClose={onClose}
              selected={menuItems[0].label}
            />
          </div>
        ) : (
          <div className="header-container">
            {folder && (
              <IconButton
                iconName="ArrowPathIcon"
                size="16"
                color="#A3A9AE"
                hoverColor="#657077"
                isFill={true}
                onClick={this.onBackToParentFolder}
                className="arrow-button"
              />
            )}
            <Headline
              className="headline-header"
              type="content"
              truncate={true}
            >
              {title}
            </Headline>
            {folder ? (
              <>
                <ContextMenuButton
                  className="add-button"
                  directionX="right"
                  iconName="PlusIcon"
                  size={16}
                  color="#657077"
                  getData={this.getContextOptionsPlus}
                  isDisabled={false}
                />
                <ContextMenuButton
                  className="option-button"
                  directionX="right"
                  iconName="VerticalDotsIcon"
                  size={16}
                  color="#A3A9AE"
                  getData={this.getContextOptionsFolder}
                  isDisabled={false}
                />
              </>
            ) : (
              <ContextMenuButton
                className="add-button"
                directionX="right"
                iconName="PlusIcon"
                size={16}
                color="#657077"
                getData={this.getContextOptionsPlus}
                isDisabled={false}
              />
            )}
          </div>
        )}

        {showDeleteDialog && (
          <DeleteDialog
            isRecycleBinFolder={isRecycleBinFolder}
            visible={showDeleteDialog}
            onClose={this.onDeleteAction}
            selection={selection}
          />
        )}

        {showEmptyTrashDialog && (
          <EmptyTrashDialog
            visible={showEmptyTrashDialog}
            onClose={this.onEmptyTrashAction}
          />
        )}

        <SharingPanel
          onClose={this.onOpenSharingPanel}
          visible={showSharingPanel}
          onShowUsersPanel={this.onShowUsersPanel}
          onShowGroupsPanel={this.onShowGroupsPanel}
          advancedOptions={advancedOptions}
          accessRight={accessRight}
          users={selectedUsers}
          onRemoveUserClick={this.onRemoveUserClick}
          onSetUsers={this.onSetUsers}
          t={t}
        />

        <AddUsersPanel
          onSharingPanelClose={this.onOpenSharingPanel}
          onClose={this.onShowUsersPanel}
          visible={showAddUsersPanel}
          embeddedComponent={accessOptionsComboBox}
          onSetSelectedUsers={this.onSetSelectedUsers}
          accessRight={accessRight}
        />

        <AddGroupsPanel
          onSharingPanelClose={this.onOpenSharingPanel}
          onClose={this.onShowGroupsPanel}
          visible={showAddGroupsPanel}
          embeddedComponent={accessOptionsComboBox}
          onSetSelectedUsers={this.onSetSelectedUsers}
          accessRight={accessRight}
        />
      </StyledContainer>
    );
  }
}

const mapStateToProps = state => {
  const { selectedFolder, selection, treeFolders, filter } = state.files;
  const { parentId, title, id } = selectedFolder;
  const { user, settings } = state.auth;

  const indexOfTrash = 3;

  //item.access.icon
  const currentUser = user;
  user.rights = { icon: "AccessEditIcon", rights: "FullAccess" };

  return {
    folder: parentId !== 0,
    isAdmin: isAdmin(user),
    isRecycleBinFolder: treeFolders[indexOfTrash].id === id,
    parentId,
    selection,
    title,
    filter,
    deleteDialogVisible: isCanBeDeleted(selectedFolder, user),
    //groupsCaption: settings.customNames.groupsCaption,
    currentUser
  };
};

export default connect(mapStateToProps, { setAction })(
  withTranslation()(withRouter(SectionHeaderContent))
);
