import React from 'react';

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
      </div>
    </div>
  );
};

Debugging.propTypes = {
  exercise: React.PropTypes.object.isRequired
};

export default Debugging;