import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { PageLayout, RequestLoader } from "asc-web-components";
import { withTranslation } from 'react-i18next';
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

import {
  ArticleHeaderContent,
  ArticleBodyContent,
  ArticleMainButtonContent
} from "../../Article";
import {
  SectionHeaderContent,
  SectionBodyContent,
  SectionFilterContent,
  SectionPagingContent
} from "./Section";
import { setSelected } from "../../../store/people/actions";

class PureHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHeaderVisible: false,
      isHeaderIndeterminate: false,
      isHeaderChecked: false,
      isLoading: false
    };
  }

  renderGroupButtonMenu = () => {
    const { users, selection, selected, setSelected } = this.props;

    const headerVisible = selection.length > 0;
    const headerIndeterminate =
      headerVisible && selection.length > 0 && selection.length < users.length;
    const headerChecked = headerVisible && selection.length === users.length;

    console.log(`renderGroupButtonMenu()
      headerVisible=${headerVisible} 
      headerIndeterminate=${headerIndeterminate} 
      headerChecked=${headerChecked}
      selection.length=${selection.length}
      users.length=${users.length}
      selected=${selected}`);

    let newState = {};

    if (headerVisible || selected === "close") {
      newState.isHeaderVisible = headerVisible;
      if (selected === "close") {
        setSelected({ selected: "none" });
      }
    }

    newState.isHeaderIndeterminate = headerIndeterminate;
    newState.isHeaderChecked = headerChecked;

    this.setState(newState);
  };

  componentDidUpdate(prevProps) {
    if (this.props.selection !== prevProps.selection) {
      this.renderGroupButtonMenu();
    }
  }

  onSectionHeaderContentCheck = checked => {
    this.props.setSelected(checked ? "all" : "none");
  };

  onSectionHeaderContentSelect = selected => {
    this.props.setSelected(selected);
  };

  onClose = () => {
    const { selection, setSelected } = this.props;

    if (!selection.length) {
      setSelected("none");
      this.setState({ isHeaderVisible: false });
    } else {
      setSelected("close");
    }
  };

  onLoading = status => {
    this.setState({ isLoading: status });
  };

  render() {
    const {
      isHeaderVisible,
      isHeaderIndeterminate,
      isHeaderChecked,
      selected
    } = this.state;
    const t = this.props.t;
    return (
      <>
        <RequestLoader
          visible={this.state.isLoading}
          zIndex={256}
          loaderSize={16}
          loaderColor={"#999"}
          label={`${t('LoadingProcessing')} ${t('LoadingDescription')}`}
          fontSize={12}
          fontColor={"#999"}
        />
        <PageLayout
          withBodyScroll={false}
          articleHeaderContent={<ArticleHeaderContent />}
          articleMainButtonContent={<ArticleMainButtonContent />}
          articleBodyContent={<ArticleBodyContent />}
          sectionHeaderContent={
            <SectionHeaderContent
              isHeaderVisible={isHeaderVisible}
              isHeaderIndeterminate={isHeaderIndeterminate}
              isHeaderChecked={isHeaderChecked}
              onCheck={this.onSectionHeaderContentCheck}
              onSelect={this.onSectionHeaderContentSelect}
              onClose={this.onClose}
              onLoading={this.onLoading}
            />
          }
          sectionFilterContent={<SectionFilterContent onLoading={this.onLoading} />}
          sectionBodyContent={
            <SectionBodyContent
              selected={selected}
              onLoading={this.onLoading}
              onChange={this.onRowChange}
            />
          }
          sectionPagingContent={
            <SectionPagingContent onLoading={this.onLoading} />
          }
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.people.users,
    selection: state.people.selection,
    selected: state.people.selected,
    isLoaded: state.auth.isLoaded
  };
}

const HomeContainer = withTranslation()(PureHome);

const Home = (props) => <I18nextProvider i18n={i18n}><HomeContainer {...props}/></I18nextProvider>;

Home.propTypes = {
  users: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  isLoaded: PropTypes.bool
};

export default connect(
  mapStateToProps,
  { setSelected }
)(withRouter(Home));
