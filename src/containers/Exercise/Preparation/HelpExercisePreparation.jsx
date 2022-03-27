import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Grid, Segment, Icon, Dropdown, Checkbox, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import HelpPopup from '../../../components/HelpPopup/HelpPopup';
import ExerciseDescription from '../Description/ExerciseDescription';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SchulteTablesPreview from '../Preview/SchulteTablesPreview';
import ConcentrationPreview from '../Preview/ConcentrationPreview';
import VisualVocabularyPreview from '../Preview/VisualVocabularyPreview';

export class HelpExercisePreparation extends Component {
  state = {
    saveStatistics: true,
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

  moreSettingsToggleHandler = () => {
    this.setState({ moreSettingsOpened: !this.state.moreSettingsOpened });
  };

  exercisePreparationHandler = () => {
    this.props.onExercisePrepare(this.state.saveStatistics, this.props.exerciseOptions);
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

  render() {
    const modificationOptions = this.props.modificationOptions.map((option, index) => ({
      ...option,
      key: index,
      text: this.props.translate(`modification.${option.value}`),
    }));
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
        <Header as="h2" content={this.props.translate(`exercises.title-${this.props.type}`)} />
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
                {this.props.translate('exercise-preparation.exercise')}
              </Header>
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
                    disabled={this.props.exerciseStatus === 'preparing'}
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
                      <table style={{ width: '100%' }}>
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
                      <table style={{ width: '100%' }}>
                        <tbody>
                          <TextOptions exerciseType={this.props.type} />
                        </tbody>
                      </table>
                    )}
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {this.props.type === 'schulteTables' ? <SchulteTablesPreview /> : null}
            {this.props.type === 'concentration' ? <ConcentrationPreview /> : null}
            {this.props.type === 'visualVocabulary' ? <VisualVocabularyPreview /> : null}
          </>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
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
  onModificationChange: (modification) => {
    dispatch(actionCreators.changeModification(modification));
  },
  onExerciseOptionsReset: () => {
    dispatch(actionCreators.resetExerciseOptions());
  },
  onTextOptionsReset: () => {
    dispatch(actionCreators.resetTextOptions());
  },
  onExercisePrepare: (save, exerciseOptions) => {
    dispatch(actionCreators.prepareHelpExercise(save, exerciseOptions));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpExercisePreparation);
