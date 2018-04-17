import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Message, Grid, Segment, Icon, Dropdown, Checkbox, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseDescription from '../Description/ExerciseDescription';
import TextSelection from '../../TextSelection/TextSelection';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import TextPreview from '../Preview/TextPreview';

export class TextExercisePreparation extends Component {
  state = {
    saveStatistics: true,
    textSelectionOpened: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.exerciseStatus !== 'prepared' && this.props.exerciseStatus === 'prepared') {
      this.props.onProceed();
    }
  }

  saveChangeHandler = (event, data) => {
    this.setState({ saveStatistics: data.checked });
  }

  textSelectionToggleHandler = () => {
    this.setState({ textSelectionOpened: !this.state.textSelectionOpened });
  }

  textPreparationHandler = () => {
    this.props.onExercisePrepare(this.state.saveStatistics, this.props.exerciseOptions, this.props.selectedText);
  }

  modificationChangeHandler = (event, data) => {
    this.props.onModificationChange(data.value);
  }

  render() {
    const selectedText = this.props.selectedText ? (
      <div>
        <div>
          {`${this.props.translate('exercise-preparation.title')}: `}<b>{this.props.selectedText.title}</b>
        </div>
        <div>
          <span>
            {`${this.props.translate('exercise-preparation.author')}: `}<b>{this.props.selectedText.author}</b>
          </span>
          <span>
            {` ${this.props.translate('exercise-preparation.editor')}: `}
            <b>{this.props.selectedText.editor ?
              this.props.selectedText.editor : this.props.translate('exercise-preparation.editor-missing')}
            </b>
          </span>
          <span>
            {` ${this.props.translate('exercise-preparation.questions-author')}: `}
            <b>{this.props.selectedText.questionsAuthor ?
              this.props.selectedText.questionsAuthor : this.props.translate('exercise-preparation.questions-author-missing')}
            </b>
          </span>
        </div>
        <div>
          {`${this.props.translate('exercise-preparation.reference')}: `}
          <b>{this.props.selectedText.reference ?
            this.props.selectedText.reference : this.props.translate('exercise-preparation.reference-missing')}
          </b>
        </div>
      </div>
    ) : <b style={{ color: 'red' }}>{this.props.translate('exercise-preparation.text-not-selected')}</b>;
    const modificationOptions = this.props.modificationOptions
      .map((option, index) => ({ ...option, key: index, text: this.props.translate(`modification.${option.value}`) }));
    const startCheckbox = (
      <Fragment>
        {this.props.translate('exercise-preparation.start-automatically')}
        <Popup
          trigger={<Icon name="question circle outline" />}
          position="left center"
          content={this.props.translate('exercise-preparation.start-automatically-description')}
        />
      </Fragment>);
    const saveCheckbox = (
      <Fragment>
        {this.props.translate('exercise-preparation.save-statistics')}
        <Popup
          trigger={<Icon name="question circle outline" />}
          position="left center"
          content={this.props.translate('exercise-preparation.save-statistics-description')}
        />
      </Fragment>);
    return (
      <Container style={{ marginTop: '4vh' }}>
        <Grid stackable>
          <Grid.Row verticalAlign="bottom">
            <Grid.Column width={10}>
              <Header as="h2" content={this.props.translate(`exercises.title-${this.props.type}`)} />
            </Grid.Column>
            <Grid.Column width={6}>
              {this.props.translate('exercise-preparation.exercise-modification')}
              <Popup
                trigger={<Icon name="question circle outline" />}
                position="bottom left"
                content={this.props.translate('exercise-preparation.exercise-modification-description')}
              />
              <Dropdown
                fluid
                selection
                scrolling
                disabled={modificationOptions.length === 1}
                value={this.props.exerciseModification}
                options={modificationOptions}
                onChange={this.modificationChangeHandler}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={13}>
              <ExerciseDescription
                type={this.props.type}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={13}>
              <Segment clearing>
                <Header as="h4" textAlign="center">
                  {this.props.translate('exercise-preparation.text-selection')}
                </Header>
                {selectedText}
                <Button
                  primary
                  floated="right"
                  onClick={this.textSelectionToggleHandler}
                  content={this.props.selectedText ?
                    this.props.translate('exercise-preparation.change-text') :
                    this.props.translate('exercise-preparation.select-text')}
                />
                {this.state.textSelectionOpened ?
                  <TextSelection
                    open={this.state.textSelectionOpened}
                    onClose={this.textSelectionToggleHandler}
                  /> : null}
              </Segment>
            </Grid.Column>
            <Grid.Column floated="right" width={3} verticalAlign="bottom">
              <Button
                positive
                floated="right"
                style={{ margin: '2px' }}
                loading={this.props.exerciseStatus === 'preparing'}
                disabled={!this.props.selectedText || this.props.exerciseStatus === 'preparing'}
                onClick={this.textPreparationHandler}
                content={this.props.translate('exercise-preparation.proceed')}
              />
              <Checkbox
                style={{ float: 'right', margin: '2px' }}
                label={{ children: startCheckbox }}
              />
              <Checkbox
                checked={this.state.saveStatistics}
                onChange={this.saveChangeHandler}
                style={{ float: 'right', margin: '2px' }}
                label={{ children: saveCheckbox }}
              />
            </Grid.Column>
          </Grid.Row>
          {this.props.info.exerciseSettingsInfo ?
            <Grid.Row columns={1}>
              <Grid.Column>
                <Message info onDismiss={this.props.onExerciseSettingsInfoDismiss}>
                  <Icon name="settings" size="large" />
                  {this.props.translate('exercise-preparation.info-content')}
                </Message>
              </Grid.Column>
            </Grid.Row> : null}
        </Grid>
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Segment>
                <Header as="h4" textAlign="center">
                  {this.props.translate('exercise-preparation.exercise-options')}
                </Header>
                {this.props.visibleSpeedOptions.length === 0 && this.props.visibleExerciseOptions.length === 0 ?
                  this.props.translate('exercise-preparation.exercise-options-missing') :
                  <table>
                    <tbody>
                      <SpeedOptions />
                      <ExerciseOptions />
                    </tbody>
                  </table>
                }
                {this.props.visibleSpeedOptions.length !== 0 && this.props.info.speedChangeInfo ?
                  <Message info onDismiss={this.props.onSpeedChangeInfoDismiss}>
                    {this.props.translate('exercise-preparation.keyboard-keys')}
                    <Icon style={{ marginRight: 0 }} size="large" color="black" name="plus square outline" />
                    {this.props.translate('exercise-preparation.and')}
                    <Icon style={{ marginRight: 0 }} size="large" color="black" name="minus square outline" />
                    {this.props.translate('exercise-preparation.can-be-used')}
                  </Message> : null}
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Header as="h4" textAlign="center">
                  {this.props.translate('exercise-preparation.text-options')}
                </Header>
                {this.props.visibleTextOptions.length === 0 ?
                  this.props.translate('exercise-preparation.text-options-missing') :
                  <table>
                    <tbody>
                      <TextOptions exerciseType={this.props.type} />
                    </tbody>
                  </table>
                }
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
  info: state.info,
  selectedText: state.text.selectedText,
  exerciseModification: state.exercise.modification,
  modificationOptions: state.exercise.modificationOptions,
  exerciseOptions: state.options.exerciseOptions,
  visibleTextOptions: state.options.visibleTextOptions,
  visibleExerciseOptions: state.options.visibleExerciseOptions,
  visibleSpeedOptions: state.options.visibleSpeedOptions,
  exerciseStatus: state.exercise.status,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onExerciseSettingsInfoDismiss: () => {
    dispatch(actionCreators.dismissExerciseSettingsInfo());
  },
  onSpeedChangeInfoDismiss: () => {
    dispatch(actionCreators.dismissSpeedChangeInfo());
  },
  onModificationChange: (modification) => {
    dispatch(actionCreators.changeModification(modification));
  },
  onExercisePrepare: (save, exerciseOptions, text) => {
    dispatch(actionCreators.prepareTextExercise(save, exerciseOptions, text));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
