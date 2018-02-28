import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

export class TextExerciseTest extends Component {
  state = {};
  render() {
    return (
      <Container style={{ marginTop: '4vh' }}>
        <h2>{this.props.translate('exercises.test-title')}</h2>
        <p>{this.props.translate('exercises.test-description')}</p>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseTest);
