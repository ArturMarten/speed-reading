import React from 'react';

const ExerciseMenu = (props) => {
  return (
    <div className='exercise-menu'>
      <ul>
        <li>
          <button onClick={()=>props.onExerciseSelect('reading')}>Reading test</button>
        </li>
        <li>
          <button onClick={()=>props.onExerciseSelect('wordGroup')}>Word group test</button>
        </li>
        <li>
          <button onClick={()=>props.onExerciseSelect('disappearing')}>Disappearing text</button>
        </li>
      </ul>
    </div>
  );
};

export default ExerciseMenu;
