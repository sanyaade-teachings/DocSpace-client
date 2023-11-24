/* eslint-disable react/prop-types */
import React from "react";
import { Scrollbar, ScrollbarType } from "../index";
import { CustomScrollbarsVirtualListProps } from "../Scrollbar.types";

const CustomScrollbars = ({
  onScroll,
  forwardedRef,
  style,
  children,
  className,
  stype,
}: CustomScrollbarsVirtualListProps) => {
  const refSetter = (
    scrollbarsRef: React.RefObject<HTMLDivElement>,
    forwardedRefArg: unknown,
  ) => {
    // @ts-expect-error Don`t know how fix it
    const ref = scrollbarsRef?.contentElement ?? null;

    if (typeof forwardedRefArg === "function") {
      forwardedRefArg(ref);
    } else {
      forwardedRefArg = ref;
    }
  };
  return (
    <Scrollbar
      ref={(scrollbarsRef: React.RefObject<HTMLDivElement>) =>
        refSetter(scrollbarsRef, forwardedRef)
      }
      style={{ ...style, overflow: "hidden" }}
      onScroll={onScroll}
      stype={stype}
      className={className}
    >
      {children}
      <div className="additional-scroll-height" />
    </Scrollbar>
  );
};

CustomScrollbars.defaultProps = {
  stype: ScrollbarType.mediumBlack,
};

const CustomScrollbarsVirtualList = React.forwardRef(
  (props: CustomScrollbarsVirtualListProps, ref) => (
    <CustomScrollbars {...props} forwardedRef={ref} />
  ),
);

export { CustomScrollbarsVirtualList };
