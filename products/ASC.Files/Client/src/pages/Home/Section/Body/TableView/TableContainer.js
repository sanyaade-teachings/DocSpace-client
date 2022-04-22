import React, { useEffect, useRef } from "react";
import TableContainer from "@appserver/components/table-container";
import { inject, observer } from "mobx-react";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";
import TableBody from "@appserver/components/table-container/TableBody";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { Base } from "@appserver/components/themes";

const StyledTableContainer = styled(TableContainer)`
  .table-row-selected + .table-row-selected {
    .table-row {
      .table-container_file-name-cell,
      .table-container_row-context-menu-wrapper {
        margin-top: -1px;
        border-image-slice: 1;
        border-top: 1px solid;
      }
      .table-container_file-name-cell {
        border-image-source: ${(props) => `linear-gradient(to right, 
          ${props.theme.filesSection.tableView.row.borderColorTransition} 17px, ${props.theme.filesSection.tableView.row.borderColor} 31px)`};
      }
      .table-container_row-context-menu-wrapper {
        border-image-source: ${(props) => `linear-gradient(to left,
          ${props.theme.filesSection.tableView.row.borderColorTransition} 17px, ${props.theme.filesSection.tableView.row.borderColor} 31px)`};
      }
    }
  }

  .files-item:not(.table-row-selected) + .table-row-selected {
    .table-row {
      .table-container_file-name-cell,
      .table-container_row-context-menu-wrapper {
        margin-top: -1px;
        border-top: ${(props) =>
          `1px ${props.theme.filesSection.tableView.row.borderColor} solid`};

        border-bottom: ${(props) =>
          `1px solid ${props.theme.filesSection.tableView.row.borderColor}`};
      }
    }
  }
`;

StyledTableContainer.defaultProps = { theme: Base };

const Table = ({
  filesList,
  sectionWidth,
  viewAs,
  setViewAs,
  setFirsElemChecked,
  setHeaderBorder,
  theme,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if ((viewAs !== "table" && viewAs !== "row") || !setViewAs) return;

    if (sectionWidth < 1025 || isMobile) {
      viewAs !== "row" && setViewAs("row");
    } else {
      viewAs !== "table" && setViewAs("table");
    }
  }, [sectionWidth]);

  return (
    <StyledTableContainer forwardedRef={ref}>
      <TableHeader sectionWidth={sectionWidth} containerRef={ref} />
      <TableBody>
        {filesList.map((item, index) => (
          <TableRow
            key={`${item.id}_${index}`}
            item={item}
            index={index}
            setFirsElemChecked={setFirsElemChecked}
            setHeaderBorder={setHeaderBorder}
            theme={theme}
          />
        ))}
      </TableBody>
    </StyledTableContainer>
  );
};

export default inject(({ filesStore, auth }) => {
  const {
    filesList,
    viewAs,
    setViewAs,
    setFirsElemChecked,
    setHeaderBorder,
  } = filesStore;

  return {
    filesList,
    viewAs,
    setViewAs,
    setFirsElemChecked,
    setHeaderBorder,
    theme: auth.settingsStore.theme,
  };
})(observer(Table));
