import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import SaveCancelButtons from "@docspace/components/save-cancel-buttons";
import { inject, observer } from "mobx-react";
import withLoading from "SRC_DIR/HOCs/withLoading";
import styled from "styled-components";
import Checkbox from "@docspace/components/checkbox";
import toastr from "@docspace/components/toast/toastr";
import ModalDialog from "@docspace/components/modal-dialog";
import Link from "@docspace/components/link";
import LoaderAdditionalResources from "../sub-components/loaderAdditionalResources";

const StyledComponent = styled.div`
  margin-top: 40px;

  .branding-checkbox {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 24px;
  }

  .additional-header {
    padding-bottom: 2px;
  }

  .additional-description {
    padding-bottom: 1px;
  }

  .link {
    font-weight: 600;
    border-bottom: 1px dashed #333333;
    border-color: ${(props) => !props.isPortalPaid && "#A3A9AE"};
  }

  .description,
  .link {
    color: ${(props) => !props.isPortalPaid && "#A3A9AE"};
  }

  .save-cancel-buttons {
    margin-top: 24px;
  }

  .checkbox {
    margin-right: 9px;
  }
`;

const StyledModalDialog = styled(ModalDialog)`
  #modal-dialog {
    width: auto;
  }

  .modal-body {
    padding: 0;
  }
  .modal-footer {
    display: none;
  }
`;

const AdditionalResources = (props) => {
  const {
    t,
    tReady,
    isPortalPaid,
    getAdditionalResources,
    setAdditionalResources,
    restoreAdditionalResources,
    additionalResourcesData,
    setIsLoadedAdditionalResources,
    isLoadedAdditionalResources,
  } = props;

  const [feedbackAndSupportEnabled, setShowFeedback] = useState(
    additionalResourcesData.feedbackAndSupportEnabled
  );

  const [videoGuidesEnabled, setShowVideoGuides] = useState(
    additionalResourcesData.videoGuidesEnabled
  );

  const [helpCenterEnabled, setShowHelpCenter] = useState(
    additionalResourcesData.helpCenterEnabled
  );

  const [hasChange, setHasChange] = useState(false);

  const [isFirstAdditionalResources, setIsFirstAdditionalResources] = useState(
    localStorage.getItem("isFirstAdditionalResources")
  );

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowFeedback(additionalResourcesData.feedbackAndSupportEnabled);
    setShowVideoGuides(additionalResourcesData.videoGuidesEnabled);
    setShowHelpCenter(additionalResourcesData.helpCenterEnabled);
  }, [additionalResourcesData]);

  useEffect(() => {
    if (
      feedbackAndSupportEnabled !==
        additionalResourcesData.feedbackAndSupportEnabled ||
      videoGuidesEnabled !== additionalResourcesData.videoGuidesEnabled ||
      helpCenterEnabled !== additionalResourcesData.helpCenterEnabled
    ) {
      setHasChange(true);
    } else {
      setHasChange(false);
    }
  }, [
    feedbackAndSupportEnabled,
    videoGuidesEnabled,
    helpCenterEnabled,
    additionalResourcesData,
  ]);

  useEffect(() => {
    if (!(additionalResourcesData && tReady)) return;

    setIsLoadedAdditionalResources(true);
  }, [additionalResourcesData, tReady]);

  const onSave = () => {
    setAdditionalResources(
      feedbackAndSupportEnabled,
      videoGuidesEnabled,
      helpCenterEnabled
    )
      .then(() => {
        toastr.success(t("Settings:SuccessfullySaveSettingsMessage"));
        getAdditionalResources();

        if (!localStorage.getItem("isFirstAdditionalResources")) {
          localStorage.setItem("isFirstAdditionalResources", true);
          setIsFirstAdditionalResources("true");
        }
      })
      .catch((error) => {
        toastr.error(error);
      });
  };

  const onRestore = () => {
    restoreAdditionalResources()
      .then(() => {
        toastr.success(t("Settings:SuccessfullySaveSettingsMessage"));
        getAdditionalResources();
      })
      .catch((error) => {
        toastr.error(error);
      });
  };

  const onShowExample = () => {
    if (!isPortalPaid) return;
    setShowModal(true);
  };

  const onCloseModal = () => {
    setShowModal(false);
  };

  if (!isLoadedAdditionalResources) return <LoaderAdditionalResources />;

  return (
    <>
      {showModal && (
        <StyledModalDialog visible={showModal} onClose={onCloseModal}>
          <ModalDialog.Body>
            <img className="img" src="/static/images/docspace.menu.svg" />
          </ModalDialog.Body>
          <ModalDialog.Footer className="modal-footer" />
        </StyledModalDialog>
      )}

      <StyledComponent isPortalPaid={isPortalPaid}>
        <div className="header">
          <div className="additional-header">
            {t("Settings:AdditionalResources")}
          </div>
        </div>
        <div className="description additional-description">
          <div className="additional-description">
            {t("Settings:AdditionalResourcesDescription")}
            <Link className="link" onClick={onShowExample} noHover={true}>
              &nbsp;{t("Settings:DocSpaceMenu")}
            </Link>
            .
          </div>
        </div>
        <div className="branding-checkbox">
          <Checkbox
            isDisabled={!isPortalPaid}
            label={t("ShowFeedbackAndSupport")}
            isChecked={feedbackAndSupportEnabled}
            onChange={() => setShowFeedback(!feedbackAndSupportEnabled)}
          />

          <Checkbox
            isDisabled={!isPortalPaid}
            label={t("ShowVideoGuides")}
            isChecked={videoGuidesEnabled}
            onChange={() => setShowVideoGuides(!videoGuidesEnabled)}
          />
          <Checkbox
            isDisabled={!isPortalPaid}
            label={t("ShowHelpCenter")}
            isChecked={helpCenterEnabled}
            onChange={() => setShowHelpCenter(!helpCenterEnabled)}
          />
        </div>
        <SaveCancelButtons
          onSaveClick={onSave}
          onCancelClick={onRestore}
          saveButtonLabel={t("Common:SaveButton")}
          cancelButtonLabel={t("Settings:RestoreDefaultButton")}
          displaySettings={true}
          showReminder={isPortalPaid && hasChange}
          isFirstRestoreToDefault={isFirstAdditionalResources}
        />
      </StyledComponent>
    </>
  );
};

export default inject(({ auth, setup, common }) => {
  const { settingsStore } = auth;

  const {
    setIsLoadedAdditionalResources,
    isLoadedAdditionalResources,
  } = common;

  const {
    getAdditionalResources,
    setAdditionalResources,
    restoreAdditionalResources,
    additionalResourcesData,
  } = settingsStore;

  return {
    getAdditionalResources,
    setAdditionalResources,
    restoreAdditionalResources,
    additionalResourcesData,
    setIsLoadedAdditionalResources,
    isLoadedAdditionalResources,
  };
})(
  withLoading(
    withTranslation(["Settings", "Common"])(observer(AdditionalResources))
  )
);
