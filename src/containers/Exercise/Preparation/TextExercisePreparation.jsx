import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Button, Divider, Message, Segment } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import TextSelection from '../../TextSelection/TextSelection';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import TextPreview from '../Preview/TextPreview';

export class TextExercisePreparation extends Component {
  state = {
    textSelectionOpened: false,
  };

  textSelectionToggleHandler = () => {
    this.setState({ textSelectionOpened: !this.state.textSelectionOpened });
  }

  render() {
    return (
      <Container style={{ marginTop: '4vh' }}>
        <h2>{this.props.translate(`exercises.title-${this.props.type}`)}</h2>
        <p>{this.props.translate(`exercises.description-${this.props.type}`)}</p>
        <Button
          positive
          floated="right"
          onClick={this.props.onProceed}
          content={this.props.translate('exercises.proceed')}
        />
        <h3>{this.props.translate('exercises.text-selection')}</h3>
        <Segment compact>
          Musuo hõim – kas naiste maailm või meeste paradiis?
        </Segment>
        <Button
          color="facebook"
          onClick={this.textSelectionToggleHandler}
          content="Choose text"
        />
        <TextSelection
          open={this.state.textSelectionOpened}
          onClose={this.textSelectionToggleHandler}
        />
        <Divider />
        <Message info>
          <p>{this.props.translate('exercises.info-content')}</p>
        </Message>
        <TextOptions />
        <ExerciseOptions />
        <SpeedOptions />
        <TextPreview />
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

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
