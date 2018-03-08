import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Button, Divider, Message } from 'semantic-ui-react';
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
    const selectedText = this.props.selectedText ?
      <span>{this.props.translate('exercises.text-selected')}: <b>{this.props.selectedText.title}</b></span> :
      <b>{this.props.translate('exercises.text-not-selected')}</b>;
    return (
      <Container style={{ marginTop: '4vh' }}>
        <h2>{this.props.translate(`exercises.title-${this.props.type}`)}</h2>
        <p>{this.props.translate(`exercises.description-${this.props.type}`)}</p>
        <Button
          positive
          floated="right"
          disabled={!this.props.selectedText}
          onClick={this.props.onProceed}
          content={this.props.translate('exercises.proceed')}
        />
        <h3>{this.props.translate('exercises.text-selection')}</h3>
        {selectedText}{' '}
        <Button
          color="facebook"
          onClick={this.textSelectionToggleHandler}
          content={this.props.selectedText ?
            this.props.translate('exercises.change-text') :
            this.props.translate('exercises.select-text')}
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
  selectedText: state.text.selectedText,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
