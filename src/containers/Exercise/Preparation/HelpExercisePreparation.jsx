import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Message, Grid, Segment, Icon, Dropdown, Checkbox } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../../store/actions';
import ExerciseDescription from '../Description/ExerciseDescription';
import TextOptions from '../Options/TextOptions';
import ExerciseOptions from '../Options/ExerciseOptions';
import SchulteTablesPreview from '../Preview/SchulteTablesPreview';
import ConcentrationPreview from '../Preview/ConcentrationPreview';

export class HelpExercisePreparation extends Component {
  state = {
    saveStatistics: true,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.exerciseStatus !== 'prepared' && this.props.exerciseStatus === 'prepared') {
      this.props.onProceed();
    }
  }

  saveChangeHandler = (event, data) => {
    this.setState({ saveStatistics: data.checked });
  }

  exercisePreparationHandler = () => {
    this.props.onExercisePrepare(this.state.saveStatistics, this.props.exerciseOptions);
  }

  modificationChangeHandler = (event, data) => {
    this.props.onModificationChange(data.value);
  }

  render() {
    const modificationOptions = this.props.modificationOptions
      .map((option, index) => ({ ...option, key: index, text: this.props.translate(`modification.${option.value}`) }));
    return (
      <Fragment>
        <Container style={{ marginTop: '4vh' }}>
          <Grid stackable>
            <Grid.Row verticalAlign="bottom">
              <Grid.Column width={10}>
                <Header as="h2" content={this.props.translate(`exercises.title-${this.props.type}`)} />
              </Grid.Column>
              <Grid.Column width={6}>
                {this.props.translate('text-exercise-preparation.exercise-modification')}
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
              <Grid.Column width={3} verticalAlign="bottom">
                <Button
                  positive
                  floated="right"
                  loading={this.props.exerciseStatus === 'preparing'}
                  disabled={this.props.exerciseStatus === 'preparing'}
                  onClick={this.exercisePreparationHandler}
                  content={this.props.translate('text-exercise-preparation.proceed')}
                />
                <Checkbox
                  checked={this.state.saveStatistics}
                  onChange={this.saveChangeHandler}
                  style={{ float: 'right', marginTop: '5px' }}
                  label={{ children: this.props.translate('exercises.save-statistics') }}
                />
              </Grid.Column>
            </Grid.Row>
            {this.props.info.exerciseSettingsInfo ?
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Message info onDismiss={this.props.onExerciseSettingsInfoDismiss}>
                    <Icon name="settings" size="large" />
                    {this.props.translate('text-exercise-preparation.info-content')}
                  </Message>
                </Grid.Column>
              </Grid.Row> : null}
          </Grid>
          <Grid stackable>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Segment>
                  <Header as="h4" textAlign="center">
                    {this.props.translate('text-exercise-preparation.exercise-options')}
                  </Header>
                  {this.props.visibleSpeedOptions.length === 0 && this.props.visibleExerciseOptions.length === 0 ?
                    this.props.translate('text-exercise-preparation.exercise-options-missing') :
                    <table>
                      <tbody>
                        <ExerciseOptions />
                      </tbody>
                    </table>
                  }
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <Header as="h4" textAlign="center">
                    {this.props.translate('text-exercise-preparation.text-options')}
                  </Header>
                  {this.props.visibleTextOptions.length === 0 ?
                    this.props.translate('text-exercise-preparation.text-options-missing') :
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
        </Container>
        {this.props.type === 'schulteTables' ?
          <SchulteTablesPreview /> : null}
        {this.props.type === 'concentration' ?
          <ConcentrationPreview /> : null}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  info: state.info,
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
  onModificationChange: (modification) => {
    dispatch(actionCreators.changeModification(modification));
  },
  onExercisePrepare: (save, exerciseOptions) => {
    dispatch(actionCreators.prepareHelpExercise(save, exerciseOptions));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HelpExercisePreparation);
