import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actionCreators from './store/actions';
import { listenToErrors } from './utils/errorReporter';
import Loadable from './hoc/Loadable/Loadable';
import Layout from './containers/Layout/Layout';
import Logout from './containers/Auth/Logout';
import { rolePermissions } from './store/reducers/profile';

const Home = Loadable({
  loader: () => import('./containers/Home/Home'),
});

const TextEntry = Loadable({
  loader: () => import('./containers/TextEntry/TextEntry'),
});

const TextExerciseContainer = Loadable({
  loader: () => import('./containers/Exercise/Container/TextExerciseContainer'),
  render(loaded, props) {
    const ContainerComponent = loaded.default;
    return <ContainerComponent {...props} />;
  },
});

const HelpExerciseContainer = Loadable({
  loader: () => import('./containers/Exercise/Container/HelpExerciseContainer'),
  render(loaded, props) {
    const ContainerComponent = loaded.default;
    return <ContainerComponent {...props} />;
  },
});

const Statistics = Loadable({
  loader: () => import('./containers/Statistics/Statistics'),
});

const Manage = Loadable({
  loader: () => import('./containers/Manage/Manage'),
});

export class App extends Component {
  componentDidMount() {
    listenToErrors();
    this.props.onTryAutoLogin();
  }

  render() {
    const isPermittedToModifyTexts = rolePermissions[this.props.role] >= rolePermissions.editor;
    const isPermittedToManageUsers = rolePermissions[this.props.role] >= rolePermissions.teacher;
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        {isPermittedToModifyTexts ? <Route path="/text-entry" component={TextEntry} /> : null}
        <Route path="/exercise/reading-test" render={() => <TextExerciseContainer type="readingTest" />} />
        <Route path="/exercise/reading-aid" render={() => <TextExerciseContainer type="readingAid" />} />
        <Route path="/exercise/scrolling-text" render={() => <TextExerciseContainer type="scrolling" />} />
        <Route path="/exercise/disappearing-text" render={() => <TextExerciseContainer type="disappearing" />} />
        <Route path="/exercise/word-groups" render={() => <TextExerciseContainer type="wordGroups" />} />
        <Route path="/exercise/schulte-tables" render={() => <HelpExerciseContainer type="schulteTables" />} />
        <Route path="/exercise/concentration" render={() => <HelpExerciseContainer type="concentration" />} />
        <Route path="/statistics" component={Statistics} />
        {isPermittedToManageUsers ? <Route path="/manage" component={Manage} /> : null}
        <Route path="/logout" component={Logout} />
      </Layout>
    );
  }
}

App.propTypes = {
  role: PropTypes.string.isRequired,
  onTryAutoLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  role: state.profile.role,
});

const mapDispatchToProps = (dispatch) => ({
  onTryAutoLogin: () => {
    dispatch(actionCreators.authCheckState());
  },
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
