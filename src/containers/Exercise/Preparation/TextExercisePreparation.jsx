import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Divider, Message, Grid, Segment } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import TextSelection from '../../TextSelection/TextSelection';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import TextPreview from '../Preview/TextPreview';

export class TextExercisePreparation extends Component {
  state = {
    textSelectionOpened: false,
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.prepared && this.props.prepared) {
      this.props.onProceed();
    }
  }

  textSelectionToggleHandler = () => {
    this.setState({ textSelectionOpened: !this.state.textSelectionOpened });
  }

  textPreparationHandler = () => {
    this.props.onExercisePrepare(this.props.selectedText, this.props.exerciseOptions);
  }

  render() {
    const selectedText = this.props.selectedText ?
      <span>{this.props.translate('text-exercise-preparation.text-selected')}: <b>{this.props.selectedText.title}</b></span> :
      <b>{this.props.translate('text-exercise-preparation.text-not-selected')}</b>;
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2" content={this.props.translate(`exercises.title-${this.props.type}`)} />
        {this.props.translate(`exercises.description-${this.props.type}`)}
        <Button
          positive
          floated="right"
          disabled={!this.props.selectedText}
          onClick={this.textPreparationHandler}
          content={this.props.translate('text-exercise-preparation.proceed')}
        />
        <Header as="h3" content={this.props.translate('text-exercise-preparation.text-selection')} />
        {selectedText}{' '}
        <Button
          primary
          onClick={this.textSelectionToggleHandler}
          content={this.props.selectedText ?
            this.props.translate('text-exercise-preparation.change-text') :
            this.props.translate('text-exercise-preparation.select-text')}
        />
        {this.state.textSelectionOpened ?
          <TextSelection
            open={this.state.textSelectionOpened}
            onClose={this.textSelectionToggleHandler}
          /> : null}
        <Divider />
        <Message info>
          {this.props.translate('text-exercise-preparation.info-content')}
        </Message>
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <Header as="h4" textAlign="center">
                  {this.props.translate('text-exercise-preparation.text-options')}
                </Header>
                <table>
                  <tbody>
                    <TextOptions exerciseType={this.props.type} />
                  </tbody>
                </table>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header as="h4" textAlign="center">
                  {this.props.translate('text-exercise-preparation.exercise-options')}
                </Header>
                <table>
                  <tbody>
                    <SpeedOptions exerciseType={this.props.type} />
                    <ExerciseOptions exerciseType={this.props.type} />
                  </tbody>
                </table>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <TextPreview />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  selectedText: state.text.selectedText,
  exerciseOptions: state.options.exerciseOptions,
  prepared: state.exercise.prepared,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onExercisePrepare: (text, characterCount) => {
    dispatch(actionCreators.prepareExercise(text, characterCount));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
