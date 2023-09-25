import { useState, useRef } from "react";
import { inject, observer } from "mobx-react";
import ContextMenuButton from "@docspace/components/context-menu-button";
import PropTypes from "prop-types";
import ContextMenu from "@docspace/components/context-menu";
import Link from "@docspace/components/link";
import { withTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";
import { combineUrl } from "@docspace/common/utils";
import config from "PACKAGE_FILE";
import FilesFilter from "@docspace/common/api/files/filter";
import { useParams, useNavigate } from "react-router-dom";

import {
  StyledTile,
  StyledFileTileTop,
  StyledFileTileBottom,
  StyledContent,
  StyledOptionButton,
} from "../StyledTileView";
import { getCategoryUrl } from "SRC_DIR/helpers/utils";

const Tile = ({
  t,
  thumbnailClick,
  item,

  onCreateOform,
  getFormGalleryContextOptions,

  setIsInfoPanelVisible,
  categoryType,
  isInfoPanelVisible,
  setGallerySelected,
  children,
  contextButtonSpacerWidth,
  tileContextClick,
  isActive,
  isSelected,
  title,
  showHotkeyBorder,
  getIcon,
}) => {
  const cm = useRef();
  const tile = useRef();

  const navigate = useNavigate();

  const previewSrc = item?.attributes.card_prewiew.data?.attributes.url;
  const previewLoader = () => <div style={{ width: "96px" }} />;

  const onSelectForm = () => setGallerySelected(item);

  const onCreateForm = () => onCreateOform(navigate);

  const getContextModel = () => getFormGalleryContextOptions(item, t, navigate);

  const getOptions = () =>
    getFormGalleryContextOptions(item, t, navigate).map((item) => item.key);

  const onContextMenu = (e) => {
    tileContextClick && tileContextClick();
    if (!cm.current.menuRef.current) tile.current.click(e); //TODO: need fix context menu to global
    cm.current.show(e);
  };

  //TODO: OFORM isActive

  return (
    <StyledTile
      ref={tile}
      isSelected={isSelected}
      onContextMenu={onContextMenu}
      isActive={isActive}
      showHotkeyBorder={showHotkeyBorder}
      onDoubleClick={onCreateForm}
      onClick={onSelectForm}
      className="files-item"
    >
      <StyledFileTileTop isActive={isActive}>
        {previewSrc ? (
          <Link
            className="thumbnail-image-link"
            type="page"
            onClick={thumbnailClick}
          >
            <img
              src={previewSrc}
              className="thumbnail-image"
              alt="Thumbnail-img"
            />
          </Link>
        ) : (
          <ReactSVG
            className="temporary-icon"
            src={previewSrc}
            loading={previewLoader}
          />
        )}
      </StyledFileTileTop>

      <StyledFileTileBottom isSelected={isSelected} isActive={isActive}>
        <div className="file-icon_container">
          <div className="file-icon">
            <img className="react-svg-icon" src={getIcon(32, ".docxf")} />
          </div>
        </div>

        <StyledContent>{children}</StyledContent>
        <StyledOptionButton spacerWidth={contextButtonSpacerWidth}>
          <ContextMenuButton
            className="expandButton"
            directionX="right"
            getData={getOptions}
            displayType="toggle"
            onClick={onContextMenu}
            title={title}
          />
          <ContextMenu
            getContextModel={getContextModel}
            ref={cm}
            withBackdrop={true}
          />
        </StyledOptionButton>
      </StyledFileTileBottom>
    </StyledTile>
  );
};

Tile.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  className: PropTypes.string,
  contextButtonSpacerWidth: PropTypes.string,
  contextOptions: PropTypes.array,
  data: PropTypes.object,
  id: PropTypes.string,
  tileContextClick: PropTypes.func,
};

Tile.defaultProps = {
  contextButtonSpacerWidth: "32px",
  item: {},
};

export default inject(
  (
    { filesStore, settingsStore, auth, oformsStore, contextOptionsStore },
    { item }
  ) => {
    const { categoryType } = filesStore;
    const { gallerySelected, setGallerySelected, getFormContextOptions } =
      oformsStore;
    const { getIcon } = settingsStore;
    const { isVisible, setIsVisible } = auth.infoPanelStore;

    const isSelected = item.id === gallerySelected?.id;

    const { getFormGalleryContextOptions, onCreateOform } = contextOptionsStore;

    return {
      isSelected,
      setGallerySelected,
      getFormContextOptions,
      onCreateOform,
      getFormGalleryContextOptions,
      getIcon,
      setIsInfoPanelVisible: setIsVisible,
      isInfoPanelVisible: isVisible,
      categoryType,
    };
  }
)(withTranslation(["FormGallery", "Common"])(observer(Tile)));
