import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Grid, Statistic, Transition, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

function format(input) {
  const pad = (time, length) => {
    let result = time;
    while (result.length < length) {
      result = `0${result}`;
    }
    return result;
  };
  const inputTime = new Date(input);
  const minutes = pad(inputTime.getMinutes().toString(), 2);
  const seconds = pad(inputTime.getSeconds().toString(), 2);
  const milliseconds = pad(inputTime.getMilliseconds().toString()[0], 1);
  return `${minutes}:${seconds}.${milliseconds}`;
}

export class TextExerciseResults extends Component {
  state = {}

  render() {
    return (
      <Modal open={this.props.open} size="tiny">
        <Modal.Header>{this.props.translate('text-exercise-results.modal-header')}</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={5}>
                <Transition animation="tada" duration={3000} visible transitionOnMount>
                  <Icon name="winner" size="massive" color="yellow" />
                </Transition>
              </Grid.Column>
              <Grid.Column width={11}>
                <Statistic size="small" color="black">
                  <Statistic.Value>{format(this.props.results.elapsedTime)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.elapsed-time')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="green">
                  <Statistic.Value>{this.props.results.wpm}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.wpm')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="blue">
                  <Statistic.Value>{this.props.results.cpm}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.cpm')}</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={this.props.onFinish}
            content={this.props.translate('text-exercise-results.finish')}
          />
          <Button
            positive
            onClick={this.props.onProceed}
            content={this.props.translate('text-exercise-results.proceed')}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  results: state.exercise.results,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseResults);
