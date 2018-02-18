import React from 'react';
import {Route} from 'react-router-dom';

import ResponsiveLayout from './containers/Layout/ResponsiveLayout';
import Home from './containers/Home/Home';
import TextEditor from './containers/TextInput/TextEditor';
import TextExercise from './containers/Exercise/TextExercise/TextExercise';
import Statistics from './containers/Statistics/Statistics';

const App = () => {
  return (
    <ResponsiveLayout>
      <Route exact path='/' component={Home} />
      <Route path='/text-entry' component={TextEditor} />
      <Route path='/exercise/reading-test' render={() => <TextExercise type='reading' />} />
      <Route path='/exercise/word-groups' render={() => <TextExercise type='wordGroup' />} />
      <Route path='/exercise/disappearing-text' render={() => <TextExercise type='disappearing' />} />
      <Route path='/statistics' component={Statistics} />
    </ResponsiveLayout>
  );
};

export default App;
