import React from 'react';
import { convertToRaw } from 'draft-js';

const Debugging = (props) => {
  return (
    <div className='debugging'>
      <div className='log-button'>
      <button type='button' 
          onClick={
            () => {
              console.log(props.exercise);
            }
          }
        >Log state</button>
        <button type='button' 
          onClick={
            () => {
              console.log(convertToRaw(props.exercise.editorState.getCurrentContent()));
            }
          }
        >Log editor state</button>
      </div>
    </div>
  );
};

Debugging.propTypes = {
  exercise: React.PropTypes.object.isRequired
};

export default Debugging;