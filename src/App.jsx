import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionCreators from './store/actions';
import Loadable from './hoc/Loadable/Loadable';
import ResponsiveLayout from './containers/Layout/ResponsiveLayout';
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
    this.props.onTryAutoLogin();
  }
  render() {
    const isPermitted = rolePermissions[this.props.role] >= rolePermissions.teacher;
    return (
      <ResponsiveLayout>
        <Route exact path="/" component={Home} />
        {isPermitted ?
          <Route path="/text-entry" component={TextEntry} /> : null}
        <Route path="/exercise/reading-test" render={() => <TextExerciseContainer type="readingTest" />} />
        <Route path="/exercise/reading-aid" render={() => <TextExerciseContainer type="readingAid" />} />
        <Route path="/exercise/disappearing-text" render={() => <TextExerciseContainer type="disappearing" />} />
        <Route path="/exercise/word-groups" render={() => <TextExerciseContainer type="wordGroups" />} />
        <Route path="/exercise/schulte-tables" render={() => <HelpExerciseContainer type="schulteTables" />} />
        <Route path="/exercise/concentration" render={() => <HelpExerciseContainer type="concentration" />} />
        <Route path="/statistics" component={Statistics} />
        {isPermitted ?
          <Route path="/manage" component={Manage} /> : null}
        <Route path="/logout" component={Logout} />
      </ResponsiveLayout>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
  role: state.profile.role,
});

const mapDispatchToProps = dispatch => ({
  onTryAutoLogin: () => {
    dispatch(actionCreators.authCheckState());
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
