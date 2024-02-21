import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DropDown } from ".";

const baseProps = {
  open: false,
  isOpen: false,
  // directionX: "left",
  // directionY: "bottom",
  manualWidth: "100%",
  showDisabledItems: true,
  withBackdrop: false,
};

// const baseChildren = <div label="1" />;

describe("<DropDown />", () => {
  it("rendered without error", () => {
    render(<DropDown {...baseProps} />);
  });

  // it("opened/isOpen", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} open />);

  //
  //   expect(wrapper.prop("open")).toEqual(true);
  // });

  // it("showDisabledItems", () => {
  //   const wrapper = mount(
  //     // @ts-expect-error TS(2769): No overload matches this call.
  //     <DropDown {...baseProps} open showDisabledItems={false} />,
  //   );

  //
  //   expect(wrapper.prop("showDisabledItems")).toEqual(false);
  // });

  // it("render with backdrop", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} open withBackdrop={true} />);

  //
  //   expect(wrapper.prop("withBackdrop")).toEqual(true);
  // });

  // it("directionX right", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} directionX="right" />);

  //
  //   expect(wrapper.prop("directionX")).toEqual("right");
  // });

  // it("directionX right manualX", () => {
  //   const wrapper = mount(
  //     // @ts-expect-error TS(2769): No overload matches this call.
  //     <DropDown {...baseProps} directionX="right" manualX="100px" />,
  //   );

  //
  //   expect(wrapper.prop("directionX")).toEqual("right");
  // });

  // it("directionY top", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} directionY="top" />);

  //
  //   expect(wrapper.prop("directionY")).toEqual("top");
  // });

  // it("directionY top manualY", () => {
  //   const wrapper = mount(
  //     // @ts-expect-error TS(2769): No overload matches this call.
  //     <DropDown {...baseProps} directionY="top" manualY="100%" />,
  //   );

  //
  //   expect(wrapper.prop("directionY")).toEqual("top");
  // });

  // it("withArrow", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} withArrow />);

  //
  //   expect(wrapper.prop("withArrow")).toEqual(true);
  // });

  // it("manualY", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} manualY="100%" />);

  //
  //   expect(wrapper.prop("manualY")).toEqual("100%");
  // });

  // it("manualX", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} manualX="100%" />);

  //
  //   expect(wrapper.prop("manualX")).toEqual("100%");
  // });

  // it("isUserPreview", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} isUserPreview />);

  //
  //   expect(wrapper.prop("isUserPreview")).toEqual(true);
  // });

  // it("with children", () => {
  //   const wrapper = mount(<DropDown {...baseProps}>{baseChildren}</DropDown>);

  //
  //   expect(wrapper.children()).toHaveLength(1);
  // });

  // it("with maxHeight and children", () => {
  //   const child = <div>1</div>;
  //   const wrapper = shallow(
  //     // @ts-expect-error TS(2769): No overload matches this call.
  //     <DropDown maxHeight={0}>{child}</DropDown>,
  //   ).instance();

  //
  //   expect(wrapper.props.children).toEqual(child);
  // });

  // //TODO: Fix final condition checks
  // /* it('componentDidUpdate() state lifecycle test', () => {
  //   const wrapper = shallow(<DropDown {...baseProps} />);
  //   const instance = wrapper.instance();

  //   wrapper.setState({ opened: true });

  //   instance.componentDidUpdate(wrapper.props(), wrapper.state());

  //   expect(wrapper.state()).toBe(wrapper.state());
  // }); */

  // //TODO: Fix final condition checks
  // /* it('componentDidUpdate() props lifecycle test', () => {
  //   const wrapper = shallow(<DropDown {...baseProps} />);
  //   const instance = wrapper.instance();

  //   instance.componentDidUpdate({ open: true }, wrapper.state());

  //   expect(wrapper.props()).toBe(wrapper.props());
  // }); */

  // it("accepts id", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} id="testId" />);

  //
  //   expect(wrapper.prop("id")).toEqual("testId");
  // });

  // it("accepts className", () => {
  //   // @ts-expect-error TS(2769): No overload matches this call.
  //   const wrapper = mount(<DropDown {...baseProps} className="test" />);

  //
  //   expect(wrapper.prop("className")).toEqual("test");
  // });

  // it("accepts style", () => {
  //   const wrapper = mount(
  //     // @ts-expect-error TS(2769): No overload matches this call.
  //     <DropDown {...baseProps} open style={{ color: "red" }} />,
  //   );

  //
  //   expect(wrapper.getDOMNode().style).toHaveProperty("color", "red");
  // });
});