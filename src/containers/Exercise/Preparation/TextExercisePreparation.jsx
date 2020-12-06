import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Message, Grid, Segment, Icon, Dropdown, Checkbox, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import HelpPopup from '../../../components/HelpPopup/HelpPopup';
import ExerciseDescription from '../Description/ExerciseDescription';
import OwnTextEditor from '../../OwnTextEditor/OwnTextEditor';
import TextSelection from '../../TextSelection/TextSelection';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SpeedOptions from '../Options/SpeedOptions';
import TextExercisePreview from '../Preview/TextExercisePreview';

export class TextExercisePreparation extends Component {
  state = {
    saveStatistics: true,
    ownTextEditorOpened: false,
    textSelectionOpened: false,
    moreSettingsOpened: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.exerciseStatus !== 'prepared' && this.props.exerciseStatus === 'prepared') {
      this.props.onProceed();
    }
  }

  saveChangeHandler = (event, data) => {
    this.setState({ saveStatistics: data.checked });
  };

  ownTextEditorToggleHandler = () => {
    this.setState({ ownTextEditorOpened: !this.state.ownTextEditorOpened });
  };

  textSelectionToggleHandler = () => {
    this.setState({ textSelectionOpened: !this.state.textSelectionOpened });
  };

  moreSettingsToggleHandler = () => {
    this.setState({ moreSettingsOpened: !this.state.moreSettingsOpened });
  };

  exercisePreparationHandler = () => {
    this.props.onExercisePrepare(this.state.saveStatistics, this.props.exerciseOptions, this.props.selectedText);
  };

  modificationChangeHandler = (event, data) => {
    this.props.onModificationChange(data.value);
  };

  exerciseOptionsResetHandler = () => {
    this.props.onExerciseOptionsReset();
  };

  textOptionsResetHandler = () => {
    this.props.onTextOptionsReset();
  };

  getSelectedText() {
    if (this.props.selectedText && this.props.selectedText.id) {
      return (
        <Message positive>
          <Message.Content>
            <Message.Header style={{ textAlign: 'center', marginBottom: '0.5em' }}>
              <Icon name="check" />
              Valitud tekst: {this.props.selectedText.title}
            </Message.Header>
            <div style={{ wordBreak: 'break-word' }}>
              <div>
                {`${this.props.translate('exercise-preparation.author')}: `}
                <b>{this.props.selectedText.author}</b>
              </div>
              <div>
                {` ${this.props.translate('exercise-preparation.questions-author')}: `}
                <b>
                  {this.props.selectedText.questionsAuthor
                    ? this.props.selectedText.questionsAuthor
                    : this.props.translate('exercise-preparation.questions-author-missing')}
                </b>
              </div>
              <div>
                {`${this.props.translate('exercise-preparation.reference')}: `}
                <b>
                  {this.props.selectedText.reference
                    ? this.props.selectedText.reference
                    : this.props.translate('exercise-preparation.reference-missing')}
                </b>
              </div>
            </div>
          </Message.Content>
        </Message>
      );
    } else if (this.props.selectedText) {
      return (
        <Message positive icon>
          <Icon name="file text" />
          <Message.Content>
            <Message.Header>{this.props.translate('exercise-preparation.own-text')}</Message.Header>
          </Message.Content>
        </Message>
      );
    }
    return (
      <Message negative icon>
        <Icon name="file text" />
        <Message.Content>
          <Message.Header>{this.props.translate('exercise-preparation.text-not-selected')}</Message.Header>
          <p>{this.props.translate('exercise-preparation.text-required')}</p>
        </Message.Content>
      </Message>
    );
  }

  render() {
    const selectedText = this.getSelectedText();
    const modificationOptions = this.props.modificationOptions.map((option, index) => ({
      ...option,
      key: index,
      text: this.props.translate(`modification.${option.value}`),
    }));
    const startCheckboxLabel = (
      <Fragment>
        {this.props.translate('exercise-preparation.start-automatically')}
        <HelpPopup
          position="left center"
          content={this.props.translate('exercise-preparation.start-automatically-description')}
        />
      </Fragment>
    );
    const saveCheckboxLabel = (
      <Fragment>
        {this.props.translate('exercise-preparation.save-statistics')}
        <HelpPopup
          position="left center"
          content={this.props.translate('exercise-preparation.save-statistics-description')}
        />
      </Fragment>
    );
    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{this.props.translate(`exercises.title-${this.props.type}`)}</Header>
        <ExerciseDescription type={this.props.type} />
        <Grid stackable style={{ marginTop: '5px', boxShadow: 'none' }} as={Segment} divided>
          <Grid.Row columns="equal" style={{ padding: 0 }}>
            {modificationOptions.length > 1 ? (
              <Grid.Column>
                <Header as="h4" textAlign="center">
                  <Popup
                    trigger={<span>{this.props.translate('exercise-preparation.exercise-modification')}</span>}
                    content={this.props.translate('exercise-preparation.exercise-modification-description')}
                  />
                </Header>
                <div style={{ margin: '10px' }}>
                  <Dropdown
                    fluid
                    selection
                    scrolling
                    disabled={modificationOptions.length === 1}
                    value={this.props.exerciseModification}
                    options={modificationOptions}
                    onChange={this.modificationChangeHandler}
                  />
                </div>
              </Grid.Column>
            ) : null}
            <Grid.Column>
              <Header as="h4" textAlign="center">
                {this.props.translate('exercise-preparation.text-selection')}
              </Header>
              <div style={{ textAlign: 'center', margin: '10px' }}>
                <Button.Group>
                  <Button
                    secondary
                    onClick={this.ownTextEditorToggleHandler}
                    content={this.props.translate('exercise-preparation.use-own-text')}
                  />
                  <Button.Or text={this.props.translate('exercise-preparation.or')} />
                  <Button
                    primary
                    onClick={this.textSelectionToggleHandler}
                    content={this.props.translate('exercise-preparation.select-text')}
                  />
                </Button.Group>
              </div>
              <div>{selectedText}</div>
              {this.state.ownTextEditorOpened ? (
                <OwnTextEditor open={this.state.ownTextEditorOpened} onClose={this.ownTextEditorToggleHandler} />
              ) : null}
              {this.state.textSelectionOpened ? (
                <TextSelection open={this.state.textSelectionOpened} onClose={this.textSelectionToggleHandler} />
              ) : null}
            </Grid.Column>
            <Grid.Column>
              <Header as="h4" textAlign="center">
                {this.props.translate('exercise-preparation.exercise')}
              </Header>
              <div style={{ textAlign: 'center' }}>
                <span>
                  <SpeedOptions />
                </span>
              </div>
              <div style={{ textAlign: 'center', margin: '1em' }}>
                <Button.Group>
                  <Button style={{ margin: '2px' }} onClick={this.moreSettingsToggleHandler}>
                    <Icon name={this.state.moreSettingsOpened ? 'chevron up' : 'chevron down'} />
                    {this.props.translate('exercise-preparation.more-settings')}
                  </Button>
                  <Button
                    positive
                    style={{ margin: '2px' }}
                    loading={this.props.exerciseStatus === 'preparing'}
                    disabled={!this.props.selectedText || this.props.exerciseStatus === 'preparing'}
                    onClick={this.exercisePreparationHandler}
                  >
                    {this.props.translate('exercise-preparation.proceed')}
                    <Icon name="chevron right" />
                  </Button>
                </Button.Group>
              </div>
              <div style={{ textAlign: 'center' }}>
                {/*
                <Checkbox style={{ margin: '2px' }} label={{ children: startCheckboxLabel }} />
                <br />
                 */}
                <Checkbox
                  checked={this.state.saveStatistics}
                  onChange={this.saveChangeHandler}
                  style={{ margin: '2px' }}
                  label={{ children: saveCheckboxLabel }}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.moreSettingsOpened ? (
          <>
            <Grid stackable>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Segment>
                    <Header as="h4" textAlign="center">
                      {this.props.translate('exercise-preparation.exercise-options')}
                      &nbsp;
                      <Popup
                        trigger={
                          <Button
                            inverted
                            circular
                            compact
                            size="tiny"
                            color="orange"
                            icon="repeat"
                            floated="right"
                            content={this.props.translate('exercise-preparation.reset')}
                            onClick={this.exerciseOptionsResetHandler}
                          />
                        }
                        content={this.props.translate('exercise-preparation.reset-exercise-options')}
                        position="bottom center"
                      />
                    </Header>
                    {this.props.visibleSpeedOptions.length === 0 && this.props.visibleExerciseOptions.length === 0 ? (
                      <p>{this.props.translate('exercise-preparation.exercise-options-missing')}</p>
                    ) : (
                      <table>
                        <tbody>
                          <ExerciseOptions />
                        </tbody>
                      </table>
                    )}
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Header as="h4" textAlign="center">
                      {this.props.translate('exercise-preparation.text-options')}
                      &nbsp;
                      <Popup
                        trigger={
                          <Button
                            inverted
                            circular
                            compact
                            size="tiny"
                            color="orange"
                            icon="repeat"
                            floated="right"
                            content={this.props.translate('exercise-preparation.reset')}
                            onClick={this.textOptionsResetHandler}
                          />
                        }
                        content={this.props.translate('exercise-preparation.reset-text-options')}
                        position="bottom center"
                      />
                    </Header>
                    {this.props.visibleTextOptions.length === 0 ? (
                      <p>{this.props.translate('exercise-preparation.text-options-missing')}</p>
                    ) : (
                      <table>
                        <tbody>
                          <TextOptions exerciseType={this.props.type} />
                        </tbody>
                      </table>
                    )}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <TextExercisePreview exerciseType={this.props.type} />
          </>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
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

const mapDispatchToProps = (dispatch) => ({
  onExerciseSettingsInfoDismiss: () => {
    dispatch(actionCreators.dismissExerciseSettingsInfo());
  },
  onSpeedChangeInfoDismiss: () => {
    dispatch(actionCreators.dismissSpeedChangeInfo());
  },
  onModificationChange: (modification) => {
    dispatch(actionCreators.changeModification(modification));
  },
  onExerciseOptionsReset: () => {
    dispatch(actionCreators.resetExerciseOptions());
  },
  onTextOptionsReset: () => {
    dispatch(actionCreators.resetTextOptions());
  },
  onExercisePrepare: (save, exerciseOptions, text) => {
    dispatch(actionCreators.prepareTextExercise(save, exerciseOptions, text));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExercisePreparation);
