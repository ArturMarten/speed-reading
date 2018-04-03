import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actionCreators from './store/actions';
import Loadable from './hoc/Loadable/Loadable';
import ResponsiveLayout from './containers/Layout/ResponsiveLayout';
import Logout from './containers/Auth/Logout';

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

const Statistics = Loadable({
  loader: () => import('./containers/Statistics/Statistics'),
});

const Manage = Loadable({
  loader: () => import('./containers/Manage/Manage'),
});

export class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    return (
      <ResponsiveLayout>
        <Route exact path="/" component={Home} />
        <Route path="/text-entry" component={TextEntry} />
        <Route path="/exercise/reading-test" render={() => <TextExerciseContainer type="readingTest" />} />
        <Route path="/exercise/reading-aid" render={() => <TextExerciseContainer type="readingAid" />} />
        <Route path="/exercise/disappearing-text" render={() => <TextExerciseContainer type="disappearing" />} />
        <Route path="/exercise/word-groups" render={() => <TextExerciseContainer type="wordGroups" />} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/manage" component={Manage} />
        <Route path="/logout" component={Logout} />
      </ResponsiveLayout>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = dispatch => ({
  onTryAutoSignup: () => {
    dispatch(actionCreators.authCheckState());
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
