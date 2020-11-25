import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledBackdrop = styled.div`
  background-color: ${(props) =>
    props.withBackdrop && !props.backdropExist
      ? "rgba(6, 22, 38, 0.1)"
      : "unset"};
  display: ${(props) => (props.visible ? "block" : "none")};
  height: 100vh;
  position: fixed;
  width: 100vw;
  z-index: ${(props) => props.zIndex};
  left: 0;
  top: 0;
  cursor: ${(props) => (props.withBackdrop ? "pointer" : "default")}; ;
`;

class Backdrop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backdropExist: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      const isExist =
        document.querySelectorAll("#backdrop-component").length > 1;
      this.setState({ backdropExist: isExist });
    }
  }

  render() {
    const { backdropExist } = this.state;

    console.log("backdropExist", backdropExist);

    return this.props.visible ? (
      <StyledBackdrop
        id="backdrop-component"
        {...this.props}
        backdropExist={backdropExist}
      />
    ) : null;
  }
}

Backdrop.propTypes = {
  visible: PropTypes.bool,
  zIndex: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  withBackdrop: PropTypes.bool,
};

Backdrop.defaultProps = {
  visible: false,
  zIndex: 200,
  withBackdrop: true,
};

export default Backdrop;
