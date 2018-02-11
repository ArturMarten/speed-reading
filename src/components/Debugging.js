import React from 'react';
import PropTypes from 'prop-types';
import Aux from '../hoc/Auxiliary';
import {Button} from 'semantic-ui-react';

const Debugging = (props) => {
  return (
    <Aux>
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
    </Aux>
  );
};

Debugging.propTypes = {
  exercise: PropTypes.object.isRequired
};

export default Debugging;
