/* eslint-disable react/display-name */
import React, { memo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FixedSizeList as List, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Heading from "@appserver/components/heading";
import ContextMenu from "@appserver/components/context-menu";
import CustomScrollbarsVirtualList from "@appserver/components/scrollbar";

const StyledGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 245px));
  //width: 100%;
  grid-gap: 22px 16px;
  padding-bottom: 24px;
  padding-right: 2px;
  box-sizing: border-box;
`;

const StyledTileContainer = styled.div`
  position: relative;

  .tile-item-wrapper {
    border: 1px solid #eceef1;
    border-radius: 3px;
    border-top-left-radius: 0;
    position: relative;
    min-width: 220px;
    box-sizing: border-box;
    max-width: 245px;

    &.file {
      padding: 0;

      .drag-and-drop {
        margin: -1px;
      }
    }
  }

  .tile-items-heading {
    margin: 0;
    padding-bottom: 11px;
    pointer-events: none;

    &.files {
      padding-top: 8px;
    }
  }
`;

class TileContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      contextOptions: [],
    };
  }

  onRowContextClick = (options) => {
    if (Array.isArray(options)) {
      this.setState({
        contextOptions: options,
      });
    }
  };

  componentDidMount() {
    window.addEventListener("contextmenu", this.onRowContextClick);
  }

  componentWillUnmount() {
    window.removeEventListener("contextmenu", this.onRowContextClick);
  }

  renderFolders = () => {
    return <div></div>;
  };

  renderFiles = () => {
    return <div></div>;
  };

  // eslint-disable-next-line react/prop-types
  renderTile = memo(({ data, index, style }) => {
    // eslint-disable-next-line react/prop-types
    const options = data[index].props.contextOptions;

    return (
      <div
        onContextMenu={this.onRowContextClick.bind(this, options)}
        style={style}
      >
        {data[index]}
      </div>
    );
  }, areEqual);

  render() {
    const {
      itemHeight,
      children,
      useReactWindow,
      id,
      className,
      style,
      headingFolders,
      headingFiles,
    } = this.props;

    const Folders = [];
    const Files = [];

    children.forEach((item, index) => {
      if (item.props.item.isFolder) {
        Folders.push(
          <div
            className="tile-item-wrapper folder"
            key={index}
            onContextMenu={this.onRowContextClick.bind(
              this,
              item.props.contextOptions
            )}
          >
            {item}
          </div>
        );
      } else {
        Files.push(
          <div
            className="tile-item-wrapper file"
            key={index}
            onContextMenu={this.onRowContextClick.bind(
              this,
              item.props.contextOptions
            )}
          >
            {item}
          </div>
        );
      }
    });

    const renderList = ({ height, width }) => (
      <List
        className="list"
        height={height}
        width={width}
        itemSize={itemHeight}
        itemCount={children.length}
        itemData={children}
        outerElementType={CustomScrollbarsVirtualList}
      >
        {this.renderTile}
      </List>
    );

    return (
      <StyledTileContainer
        id={id}
        className={className}
        style={style}
        useReactWindow={useReactWindow}
      >
        {Folders.length > 0 && (
          <>
            <Heading size="xsmall" className="tile-items-heading">
              {headingFolders}
            </Heading>
            {useReactWindow ? (
              <AutoSizer>{renderList}</AutoSizer>
            ) : (
              <StyledGridWrapper>{Folders}</StyledGridWrapper>
            )}
          </>
        )}

        {Files.length > 0 && (
          <>
            <Heading size="xsmall" className="tile-items-heading">
              {headingFiles}
            </Heading>
            {useReactWindow ? (
              <AutoSizer>{renderList}</AutoSizer>
            ) : (
              <StyledGridWrapper>{Files}</StyledGridWrapper>
            )}
          </>
        )}

        <ContextMenu targetAreaId={id} options={this.state.contextOptions} />
      </StyledTileContainer>
    );
  }
}

TileContainer.propTypes = {
  itemHeight: PropTypes.number,
  manualHeight: PropTypes.string,
  children: PropTypes.any.isRequired,
  useReactWindow: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

TileContainer.defaultProps = {
  itemHeight: 50,
  useReactWindow: true,
  id: "rowContainer",
};

export default TileContainer;
