import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Grid, Statistic, Transition, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { formatMilliseconds } from '../../../shared/utility';

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
                <Transition animation="tada" duration={3000} transitionOnMount>
                  <Icon name="winner" size="massive" color="yellow" />
                </Transition>
              </Grid.Column>
              <Grid.Column width={11}>
                <Statistic size="small" color="black">
                  <Statistic.Value>{formatMilliseconds(this.props.result.elapsedTime)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.elapsed-time')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="green">
                  <Statistic.Value>{this.props.result.wpm}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.wpm')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="blue">
                  <Statistic.Value>{this.props.result.cps}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('text-exercise-results.cps')}</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={this.props.onEnd}
            content={this.props.translate('text-exercise-results.end')}
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
  result: state.exercise.result,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TextExerciseResults);
