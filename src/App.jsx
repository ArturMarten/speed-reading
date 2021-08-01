import React, { Component, Suspense, lazy } from 'react';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';

import * as actionCreators from './store/actions';
import { listenToErrors } from './utils/errorReporter';
import Layout from './containers/Layout/Layout';
import Logout from './containers/Auth/Logout';
import { rolePermissions } from './store/reducers/profile';

const Home = lazy(() => import('./containers/Home/Home'));
const TextEntry = lazy(() => import('./containers/TextEntry/TextEntry'));
const TextExerciseContainer = lazy(() => import('./containers/Exercise/Container/TextExerciseContainer'));
const HelpExerciseContainer = lazy(() => import('./containers/Exercise/Container/HelpExerciseContainer'));
const Achievements = lazy(() => import('./containers/Achievements/Achievements'));
const Statistics = lazy(() => import('./containers/Statistics/Statistics'));
const Manage = lazy(() => import('./containers/Manage/Manage'));

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
        <Suspense fallback={<Loader active size="massive" indeterminate />}>
          <Route exact path="/" component={Home} />
          {isPermittedToModifyTexts ? <Route path="/text-entry" component={TextEntry} /> : null}
          <Route path="/exercise/reading-test" render={() => <TextExerciseContainer type="readingTest" />} />
          <Route path="/exercise/reading-aid" render={() => <TextExerciseContainer type="readingAid" />} />
          <Route path="/exercise/scrolling-text" render={() => <TextExerciseContainer type="scrolling" />} />
          <Route path="/exercise/disappearing-text" render={() => <TextExerciseContainer type="disappearing" />} />
          <Route path="/exercise/word-groups" render={() => <TextExerciseContainer type="wordGroups" />} />
          <Route path="/exercise/vertical-reading" render={() => <TextExerciseContainer type="verticalReading" />} />
          <Route path="/exercise/moving-word-groups" render={() => <TextExerciseContainer type="movingWordGroups" />} />
          <Route path="/exercise/schulte-tables" render={() => <HelpExerciseContainer type="schulteTables" />} />
          <Route path="/exercise/concentration" render={() => <HelpExerciseContainer type="concentration" />} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/statistics" component={Statistics} />
          {isPermittedToManageUsers ? <Route path="/manage" component={Manage} /> : null}
          <Route path="/logout" component={Logout} />
        </Suspense>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
