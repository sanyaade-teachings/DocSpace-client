export const getBannerAttribute = () => {
  const bar = document.getElementById("bar-banner");
  const mainBar = document.getElementById("main-bar");
  const rects = mainBar ? mainBar.getBoundingClientRect() : null;

  const headerHeight = bar ? 108 + 50 : mainBar ? rects.height + 40 : 48 + 50;
  const sectionHeaderTop = bar
    ? "108px"
    : rects
    ? rects.height + 40 + "px"
    : "48px";
  const sectionHeaderMarginTop = bar
    ? "106px"
    : rects
    ? rects.height + 36 + "px"
    : "46px";

  return { headerHeight, sectionHeaderTop, sectionHeaderMarginTop };
};
