import React, {Component} from 'react';
import {Segment} from 'semantic-ui-react';

class TextSelection extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>{this.props.translate('exercises.text-selection')}</h3>
        <Segment compact>
          Musuo hõim – kas naiste maailm või meeste paradiis?
        </Segment>
      </div>
    );
  }
}

export default TextSelection;
