import React from "react";
import PropTypes from "prop-types";

import { isMobile } from "@docspace/components/utils/device";
import { classNames } from "../utils/classNames";
import StyledScrollbar from "./styled-scrollbar";
import { useTheme } from "styled-components";

const Scrollbar = React.forwardRef(({ id, ...props }, ref) => {
  const { interfaceDirection } = useTheme();
  const isRtl = interfaceDirection === "rtl";
  const viewPaddingKey = isRtl ? "paddingLeft" : "paddingRight";
  const scrollbarType = {
    smallWhite: {
      thumbV: {
        width: "2px",
        marginLeft: "2px",
        borderRadius: "inherit",
      },
      thumbH: {
        height: "2px",
        marginTop: "2px",
        borderRadius: "inherit",
      },
      view: { outline: "none", WebkitOverflowScrolling: "auto" },
    },
    smallBlack: {
      thumbV: {
        width: "3px",
        marginLeft: "2px",
        borderRadius: "inherit",
      },
      thumbH: {
        height: "3px",
        marginTop: "2px",
        borderRadius: "inherit",
      },
      view: { outline: "none", WebkitOverflowScrolling: "auto" },
    },
    mediumBlack: {
      thumbV: {
        width: "8px",
        borderRadius: "inherit",
      },
      thumbH: {
        height: "8px",
        borderRadius: "inherit",
      },
      view: {
        [viewPaddingKey]: isMobile() ? "8px" : "17px",
        outline: "none",
        WebkitOverflowScrolling: "auto",
      },
    },
    preMediumBlack: {
      thumbV: {
        width: "5px",
        borderRadius: "inherit",
        cursor: "default",
      },
      thumbH: {
        height: "5px",
        borderRadius: "inherit",
        cursor: "default",
      },
      view: { outline: "none", WebkitOverflowScrolling: "auto" },
    },
  };

  const stype = scrollbarType[props.stype];

  const thumbV = stype ? stype.thumbV : {};
  const thumbH = stype ? stype.thumbH : {};
  const view = stype ? stype.view : {};

  return (
    <Scroll1
      isRtl={isRtl}
      ref={ref}
      id={id}
      view={view}
      thumbH={thumbH}
      thumbV={thumbV}
      {...props}
    />
  );
});

Scrollbar.propTypes = {
  /** Scrollbar style type */
  stype: PropTypes.string,
  /** Accepts class */
  className: PropTypes.string,
  /** Accepts id  */
  id: PropTypes.string,
  /** Accepts css style  */
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Scrollbar.defaultProps = {
  stype: "mediumBlack",
};

export default Scrollbar;

const Scroll1 = ({ isRtl, ref, id, thumbV, thumbH, view, ...props }) => {
  return (
    <StyledScrollbar
      disableTracksWidthCompensation
      rtl={isRtl}
      ref={ref}
      {...props}
      scrollerProps={{ id }}
      contentProps={{
        style: view,
        tabIndex: -1,
        className: classNames("scroll-body", props.scrollclass),
      }}
      thumbYProps={{
        className: "nav-thumb-vertical",
        style: thumbV,
      }}
      thumbXProps={{
        className: "nav-thumb-horizontal",
        style: thumbH,
      }}
      trackYProps={{
        style: { width: thumbV.width, background: "transparent" },
      }}
      trackXProps={{
        style: {
          height: thumbH.height,
          background: "transparent",
          direction: "ltr",
        },
      }}
    />
  );
};

const Scroll2 = ({
  isRtl,
  ref,
  id,
  thumbV,
  thumbH,
  view,
  children,
  ...props
}) => {
  return (
    <StyledScrollbar
      disableTracksWidthCompensation
      rtl={isRtl}
      {...props}
      // scrollerProps={{ id }}
      contentProps={{
        id,
      }}
      thumbYProps={{
        className: "nav-thumb-vertical",
        style: thumbV,
      }}
      thumbXProps={{
        className: "nav-thumb-horizontal",
        style: thumbH,
      }}
      trackYProps={{
        style: { width: thumbV.width, background: "transparent" },
      }}
      trackXProps={{
        style: {
          height: thumbH.height,
          background: "transparent",
          direction: "ltr",
        },
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        style={view}
        className={classNames("scroll-body", props.scrollclass)}
      >
        {children}
      </div>
    </StyledScrollbar>
  );
};
