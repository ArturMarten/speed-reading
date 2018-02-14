import React, {Component} from 'react';
import {Segment} from 'semantic-ui-react';
import Aux from '../hoc/Auxiliary';

class TextSelection extends Component {

  render() {
    return (
      <Aux>
        <h3>{this.props.translate('exercises.text-selection')}</h3>
        <Segment compact>
          Musuo hõim – kas naiste maailm või meeste paradiis?
        </Segment>
      </Aux>
    );
  }
}

export default TextSelection;
