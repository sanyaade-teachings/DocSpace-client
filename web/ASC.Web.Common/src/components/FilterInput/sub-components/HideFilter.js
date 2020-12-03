import React from "react";
import { Icons, DropDown } from "asc-web-components";
import PropTypes from "prop-types";
import { Caret, StyledHideFilterButton } from "../StyledFilterInput";

class HideFilter extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    this.dropDownRef = React.createRef();
    this.state = {
      popoverOpen: this.props.open,
    };
  }

  onClick = (state, e) => {
    if (!state && e && this.dropDownRef.current.contains(e.target)) {
      return;
    }
    if (!this.props.isDisabled) {
      this.setState({
        popoverOpen: state,
      });
    }
  };

  handleClickOutside = (e) => {
    if (
      this.ref.current.contains(e.target) &&
      !e.target.closest("#backdrop-active")
    )
      return;
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };

  render() {
    //console.log("HideFilter render");
    const { isDisabled, count, children } = this.props;
    const { popoverOpen } = this.state;
    return (
      <div
        className="styled-hide-filter"
        onClick={this.onClick.bind(this, !popoverOpen)}
        ref={this.ref}
        id="styled-hide-filter"
      >
        <StyledHideFilterButton id="PopoverLegacy" isDisabled={isDisabled}>
          {count}
          <Caret isOpen={popoverOpen}>
            <Icons.ExpanderDownIcon
              color="#A3A9AE"
              isfill={true}
              size="scale"
            />
          </Caret>
        </StyledHideFilterButton>

        <div className="dropdown-style" ref={this.dropDownRef}>
          <DropDown
            className="drop-down hide-filter-drop-down"
            clickOutsideAction={this.handleClickOutside}
            manualY="8px"
            open={popoverOpen}
          >
            {children}
          </DropDown>
        </div>
      </div>
    );
  }
}
HideFilter.propTypes = {
  children: PropTypes.any,
  count: PropTypes.number,
  isDisabled: PropTypes.bool,
  open: PropTypes.bool,
};
export default HideFilter;
