import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import Loadable from 'react-loadable';

import ResponsiveLayout from './containers/Layout/ResponsiveLayout';

const Loading = () => <Loader active size="massive" indeterminate />;

const Home = Loadable({
  loader: () => import('./containers/Home/Home'),
  loading: Loading,
  delay: 100,
});

const TextEntry = Loadable({
  loader: () => import('./containers/TextEntry/TextEntry'),
  loading: Loading,
  delay: 100,
});

const TextExerciseContainer = Loadable({
  loader: () => import('./containers/Exercise/Container/TextExerciseContainer'),
  loading: Loading,
  delay: 100,
  render(loaded, props) {
    const Component = loaded.default;
    return <Component {...props} />;
  },
});

const Statistics = Loadable({
  loader: () => import('./containers/Statistics/Statistics'),
  loading: Loading,
  delay: 100,
});

const App = () => (
  <ResponsiveLayout>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/text-entry" component={TextEntry} />
      <Route path="/exercise/reading-test" render={() => <TextExerciseContainer type="reading" />} />
      <Route path="/exercise/word-groups" render={() => <TextExerciseContainer type="wordGroup" />} />
      <Route path="/exercise/disappearing-text" render={() => <TextExerciseContainer type="disappearing" />} />
      <Route path="/statistics" component={Statistics} />
    </Switch>
  </ResponsiveLayout>
);

export default App;
