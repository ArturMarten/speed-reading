import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';

export class TextSelection extends Component {
  state = {};
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

const mapStateToProps = state => ({
  selectedText: state.selectedText,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSelection);
