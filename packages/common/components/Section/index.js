import React from "react";
import PropTypes from "prop-types";

import {
  isMobile as isMobileUtils,
  isTablet as isTabletUtils,
} from "@docspace/components/utils/device";
import { Provider } from "@docspace/components/utils/context";
import { isMobile } from "react-device-detect";

import SectionContainer from "./sub-components/section-container";
import SubSectionHeader from "./sub-components/section-header";
import SubSectionFilter from "./sub-components/section-filter";
import SubSectionBody from "./sub-components/section-body";
import SubSectionBodyContent from "./sub-components/section-body-content";

import SubSectionPaging from "./sub-components/section-paging";
//import SectionToggler from "./sub-components/section-toggler";
import InfoPanel from "./sub-components/info-panel";
import SubInfoPanelBody from "./sub-components/info-panel-body";
import SubInfoPanelHeader from "./sub-components/info-panel-header";

import SubSectionFooter from "./sub-components/section-footer";

import ReactResizeDetector from "react-resize-detector";
import FloatingButton from "../FloatingButton";
import { inject, observer } from "mobx-react";

const Section = (props) => {
  const {
    onDrop,
    showPrimaryProgressBar,
    primaryProgressBarIcon,
    primaryProgressBarValue,
    showPrimaryButtonAlert,
    showSecondaryProgressBar,
    secondaryProgressBarValue,
    secondaryProgressBarIcon,
    showSecondaryButtonAlert,
    uploadFiles,
    viewAs,
    withBodyScroll,
    children,
    isHeaderVisible,
    onOpenUploadPanel,
    isTabletView,
    maintenanceExist,
    snackbarExist,
    showText,
    isInfoPanelAvailable,
    settingsStudio,
    clearUploadedFilesHistory,
    isInfoPanelVisible,
    isInfoPanelScrollLocked,
    isEmptyPage,
  } = props;

  const containerRef = React.useRef(null);

  let sectionHeaderContent = null;
  let sectionFilterContent = null;
  let sectionPagingContent = null;
  let sectionBodyContent = null;
  let sectionFooterContent = null;
  let infoPanelBodyContent = null;
  let infoPanelHeaderContent = null;

  React.Children.forEach(children, (child) => {
    const childType =
      child && child.type && (child.type.displayName || child.type.name);

    switch (childType) {
      case Section.SectionHeader.displayName:
        sectionHeaderContent = child;
        break;
      case Section.SectionFilter.displayName:
        sectionFilterContent = child;
        break;
      case Section.SectionPaging.displayName:
        sectionPagingContent = child;
        break;
      case Section.SectionBody.displayName:
        sectionBodyContent = child;
        break;
      case Section.SectionFooter.displayName:
        sectionFooterContent = child;
        break;
      case Section.InfoPanelBody.displayName:
        infoPanelBodyContent = child;
        break;
      case Section.InfoPanelHeader.displayName:
        infoPanelHeaderContent = child;
        break;
      default:
        break;
    }
  });

  const isSectionHeaderAvailable = !!sectionHeaderContent,
    isSectionFilterAvailable = !!sectionFilterContent,
    isSectionPagingAvailable = !!sectionPagingContent,
    isSectionBodyAvailable =
      !!sectionBodyContent ||
      isSectionFilterAvailable ||
      isSectionPagingAvailable,
    isSectionAvailable =
      isSectionHeaderAvailable ||
      isSectionFilterAvailable ||
      isSectionBodyAvailable ||
      isSectionPagingAvailable;

  return (
    <>
      {isSectionAvailable && (
        <ReactResizeDetector
          refreshRate={100}
          refreshMode="debounce"
          refreshOptions={{ trailing: true }}
        >
          {({ width, height }) => (
            <Provider
              value={{
                sectionWidth: width,
                sectionHeight: height,
              }}
            >
              <SectionContainer
                widthProp={width}
                showText={showText}
                viewAs={viewAs}
                maintenanceExist={maintenanceExist}
                isSectionHeaderAvailable={isSectionHeaderAvailable}
                settingsStudio={settingsStudio}
                isInfoPanelVisible={isInfoPanelVisible}
              >
                {isSectionHeaderAvailable && !isMobile && (
                  <SubSectionHeader
                    maintenanceExist={maintenanceExist}
                    snackbarExist={snackbarExist}
                    className="section-header_header"
                    isHeaderVisible={isHeaderVisible}
                    viewAs={viewAs}
                    showText={showText}
                    isEmptyPage={isEmptyPage}
                  >
                    {sectionHeaderContent
                      ? sectionHeaderContent.props.children
                      : null}
                  </SubSectionHeader>
                )}
                {isSectionFilterAvailable && !isMobile && (
                  <>
                    <SubSectionFilter
                      className="section-header_filter"
                      viewAs={viewAs}
                    >
                      {sectionFilterContent
                        ? sectionFilterContent.props.children
                        : null}
                    </SubSectionFilter>
                  </>
                )}

                {isSectionBodyAvailable && (
                  <>
                    <SubSectionBody
                      onDrop={onDrop}
                      uploadFiles={uploadFiles}
                      withScroll={withBodyScroll}
                      autoFocus={isMobile || isTabletView ? false : true}
                      viewAs={viewAs}
                      settingsStudio={settingsStudio}
                    >
                      {isSectionHeaderAvailable && isMobile && (
                        <SubSectionHeader
                          className="section-body_header"
                          isHeaderVisible={isHeaderVisible}
                          viewAs={viewAs}
                          showText={showText}
                          settingsStudio={settingsStudio}
                          isEmptyPage={isEmptyPage}
                        >
                          {sectionHeaderContent
                            ? sectionHeaderContent.props.children
                            : null}
                        </SubSectionHeader>
                      )}
                      {isSectionFilterAvailable && isMobile && (
                        <SubSectionFilter className="section-body_filter">
                          {sectionFilterContent
                            ? sectionFilterContent.props.children
                            : null}
                        </SubSectionFilter>
                      )}
                      <SubSectionBodyContent>
                        {sectionBodyContent
                          ? sectionBodyContent.props.children
                          : null}
                      </SubSectionBodyContent>
                      <SubSectionFooter>
                        {sectionFooterContent
                          ? sectionFooterContent.props.children
                          : null}
                      </SubSectionFooter>
                      {isSectionPagingAvailable && (
                        <SubSectionPaging>
                          {sectionPagingContent
                            ? sectionPagingContent.props.children
                            : null}
                        </SubSectionPaging>
                      )}
                    </SubSectionBody>
                  </>
                )}

                {!(isMobile || isMobileUtils() || isTabletUtils()) ? (
                  showPrimaryProgressBar && showSecondaryProgressBar ? (
                    <>
                      <FloatingButton
                        className="layout-progress-bar"
                        icon={primaryProgressBarIcon}
                        percent={primaryProgressBarValue}
                        alert={showPrimaryButtonAlert}
                        onClick={onOpenUploadPanel}
                        clearUploadedFilesHistory={clearUploadedFilesHistory}
                      />
                      <FloatingButton
                        className="layout-progress-second-bar"
                        icon={secondaryProgressBarIcon}
                        percent={secondaryProgressBarValue}
                        alert={showSecondaryButtonAlert}
                      />
                    </>
                  ) : showPrimaryProgressBar && !showSecondaryProgressBar ? (
                    <FloatingButton
                      className="layout-progress-bar"
                      icon={primaryProgressBarIcon}
                      percent={primaryProgressBarValue}
                      alert={showPrimaryButtonAlert}
                      onClick={onOpenUploadPanel}
                      clearUploadedFilesHistory={clearUploadedFilesHistory}
                    />
                  ) : !showPrimaryProgressBar && showSecondaryProgressBar ? (
                    <FloatingButton
                      className="layout-progress-bar"
                      icon={secondaryProgressBarIcon}
                      percent={secondaryProgressBarValue}
                      alert={showSecondaryButtonAlert}
                    />
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </SectionContainer>

              {isInfoPanelAvailable && (
                <InfoPanel viewAs={viewAs}>
                  <SubInfoPanelHeader>
                    {infoPanelHeaderContent}
                  </SubInfoPanelHeader>
                  <SubInfoPanelBody
                    isInfoPanelScrollLocked={isInfoPanelScrollLocked}
                  >
                    {infoPanelBodyContent}
                  </SubInfoPanelBody>
                </InfoPanel>
              )}
            </Provider>
          )}
        </ReactResizeDetector>
      )}
    </>
  );
};

Section.SectionHeader = () => {
  return null;
};
Section.SectionHeader.displayName = "SectionHeader";

Section.SectionFilter = () => {
  return null;
};
Section.SectionFilter.displayName = "SectionFilter";

Section.SectionBody = () => {
  return null;
};
Section.SectionBody.displayName = "SectionBody";

Section.SectionFooter = () => {
  return null;
};
Section.SectionFooter.displayName = "SectionFooter";

Section.SectionPaging = () => {
  return null;
};
Section.SectionPaging.displayName = "SectionPaging";

Section.InfoPanelBody = () => {
  return null;
};
Section.InfoPanelBody.displayName = "InfoPanelBody";

Section.InfoPanelHeader = () => {
  return null;
};
Section.InfoPanelHeader.displayName = "InfoPanelHeader";

Section.propTypes = {
  children: PropTypes.any,
  withBodyScroll: PropTypes.bool,
  showPrimaryProgressBar: PropTypes.bool,
  primaryProgressBarValue: PropTypes.number,
  showPrimaryButtonAlert: PropTypes.bool,
  progressBarDropDownContent: PropTypes.any,
  primaryProgressBarIcon: PropTypes.string,
  showSecondaryProgressBar: PropTypes.bool,
  secondaryProgressBarValue: PropTypes.number,
  secondaryProgressBarIcon: PropTypes.string,
  showSecondaryButtonAlert: PropTypes.bool,
  onDrop: PropTypes.func,
  uploadFiles: PropTypes.bool,
  viewAs: PropTypes.string,
  onOpenUploadPanel: PropTypes.func,
  isTabletView: PropTypes.bool,
  isHeaderVisible: PropTypes.bool,
  isInfoPanelAvailable: PropTypes.bool,
  settingsStudio: PropTypes.bool,
  isEmptyPage: PropTypes.bool,
};

Section.defaultProps = {
  withBodyScroll: true,
  isInfoPanelAvailable: true,
  settingsStudio: false,
};

export default inject(({ auth }) => {
  const { settingsStore } = auth;
  const {
    isHeaderVisible,
    isTabletView,
    maintenanceExist,
    snackbarExist,
    showText,
  } = settingsStore;

  const {
    isVisible: isInfoPanelVisible,
    isScrollLocked: isInfoPanelScrollLocked,
  } = auth.infoPanelStore;

  return {
    isTabletView,
    isHeaderVisible,

    maintenanceExist,
    snackbarExist,

    showText,

    isInfoPanelVisible,
    isInfoPanelScrollLocked,
  };
})(observer(Section));
