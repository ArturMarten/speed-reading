import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Grid, Statistic, Transition, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { formatMilliseconds } from '../../../shared/utility';

export class HelpExerciseResults extends Component {
  state = {};

  render() {
    return (
      <Modal open={this.props.open} size="tiny">
        <Modal.Header>{this.props.translate('help-exercise-results.modal-header')}</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={5}>
                <Transition animation="tada" duration={3000} transitionOnMount>
                  <Icon name="winner" size="massive" color="yellow" />
                </Transition>
              </Grid.Column>
              <Grid.Column width={11} textAlign="center">
                <Statistic size="small" color="black">
                  <Statistic.Value>{formatMilliseconds(this.props.result.elapsedTime)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('help-exercise-results.elapsed-time')}</Statistic.Label>
                </Statistic>
                {this.props.result.symbolsPerMinute !== undefined ? (
                  <Statistic size="small" color="green">
                    <Statistic.Value>{this.props.result.symbolsPerMinute}</Statistic.Value>
                    <Statistic.Label>{this.props.translate('help-exercise-results.symbolsPerMinute')}</Statistic.Label>
                  </Statistic>
                ) : null}
                {this.props.result.total !== undefined &&
                this.props.result.correct !== undefined &&
                this.props.result.msPerSymbolGroup !== undefined &&
                this.props.result.msPerSymbol !== undefined ? (
                  <>
                    <Statistic size="small" color="blue">
                      <Statistic.Value>
                        {`${Math.round((this.props.result.correct / this.props.result.total) * 100)}%`}
                      </Statistic.Value>
                      <Statistic.Label>{this.props.translate('help-exercise-results.percentage')}</Statistic.Label>
                    </Statistic>
                    <br />
                    <Statistic color="green" horizontal>
                      <Statistic.Value>{this.props.result.msPerSymbolGroup}</Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('help-exercise-results.decision-speed')}
                        <br />
                        {this.props.translate('help-exercise-results.msPerSymbolGroup')}
                      </Statistic.Label>
                    </Statistic>
                    <Statistic color="red" horizontal>
                      <Statistic.Value>{this.props.result.msPerSymbol}</Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('help-exercise-results.decision-speed')}
                        <br />
                        {this.props.translate('help-exercise-results.msPerSymbol')}
                      </Statistic.Label>
                    </Statistic>
                  </>
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.props.onRetry} content={this.props.translate('help-exercise-results.retry')} />
          <Button negative onClick={this.props.onEnd} content={this.props.translate('help-exercise-results.end')} />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  result: state.exercise.result,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HelpExerciseResults);
