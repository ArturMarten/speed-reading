import React from 'react';
import {Button} from 'semantic-ui-react';

const Debugging = (props) => {
  return (
    <div>
      <Button
        type='button'
        negative
        basic
        size='mini'
        onClick={
          () => {
            console.log(props.exercise);
          }
        }
      >Log state</Button>
    </div>
  );
};

Debugging.propTypes = {
  exercise: React.PropTypes.object.isRequired
};

export default Debugging;
