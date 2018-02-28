import React from 'react';
import { Route } from 'react-router-dom';

import ResponsiveLayout from './containers/Layout/ResponsiveLayout';
import Home from './containers/Home/Home';
import TextEntry from './containers/TextEntry/TextEntry';
import TextExerciseContainer from './containers/Exercise/Container/TextExerciseContainer';
import Statistics from './containers/Statistics/Statistics';

const App = () => (
  <ResponsiveLayout>
    <Route exact path="/" component={Home} />
    <Route path="/text-entry" component={TextEntry} />
    <Route path="/exercise/reading-test" render={() => <TextExerciseContainer type="reading" />} />
    <Route path="/exercise/word-groups" render={() => <TextExerciseContainer type="wordGroup" />} />
    <Route path="/exercise/disappearing-text" render={() => <TextExerciseContainer type="disappearing" />} />
    <Route path="/statistics" component={Statistics} />
  </ResponsiveLayout>
);

export default App;
