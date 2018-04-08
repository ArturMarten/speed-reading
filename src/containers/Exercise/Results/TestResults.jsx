import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Grid, Transition, Icon, Statistic, Button, Popup } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { formatMilliseconds } from '../../../shared/utility';

export class TestResults extends Component {
  state = {}

  render() {
    return (
      <Modal open={this.props.open} size="tiny">
        <Modal.Header>{this.props.translate('test-results.modal-header')}</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column verticalAlign="middle" width={5}>
                <Transition animation="shake" duration={2000} transitionOnMount>
                  <Icon name="graduation" size="massive" color="black" />
                </Transition>
              </Grid.Column>
              <Grid.Column width={11}>
                <Statistic size="small" color="black">
                  <Statistic.Value>{formatMilliseconds(this.props.result.elapsedTime)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.elapsed-time')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="blue">
                  <Statistic.Value>{Math.round((this.props.result.correct / this.props.result.total) * 100)}%</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.percentage')}</Statistic.Label>
                </Statistic>
                <br />
                <Statistic size="small" color="green">
                  <Statistic.Value>{this.props.result.correct}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.correct')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="red">
                  <Statistic.Value>{this.props.result.incorrect}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.incorrect')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="grey">
                  <Statistic.Value>{this.props.result.unanswered}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.unanswered')}</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Popup
            trigger={
              <Button
                primary
                icon="lock"
                content={this.props.translate('test-results.check-correct-answers')}
              />
            }
            content={this.props.translate('auth.not-implemented')}
            on="hover"
          />
          <Button
            negative
            onClick={this.props.onEnd}
            content={this.props.translate('test-results.end')}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  result: state.test.result,
  translate: getTranslate(state.locale),
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
