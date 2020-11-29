import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Grid, Transition, Icon, Statistic, Button, Popup, Rating } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { formatMilliseconds } from '../../../shared/utility';

export class TestResults extends Component {
  state = {
    difficultyRating: 0,
  };

  onRateHandler = (event, data) => {
    this.setState({
      difficultyRating: data.rating,
    });
  };

  onEndHandler = () => {
    if (this.state.difficultyRating) {
      this.props.onRate(this.state.difficultyRating);
    }
    this.props.onEnd();
  };

  onCheckTestAnswersHandler = () => {
    if (this.state.difficultyRating) {
      this.props.onRate(this.state.difficultyRating);
    }
    this.props.onCheckAnswers();
  };

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
              <Grid.Column width={11} textAlign="center">
                <Statistic size="small" color="black">
                  <Statistic.Value>{formatMilliseconds(this.props.result.elapsedTime)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.elapsed-time')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="blue">
                  <Statistic.Value>{`${Math.round(this.props.result.testResult * 100)}%`}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.test-result')}</Statistic.Label>
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
                <br />
                <Statistic size="small" color="blue">
                  <Statistic.Value>{`${Math.round(this.props.result.comprehensionResult * 100)}%`}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.comprehension-level')}</Statistic.Label>
                </Statistic>
                <Statistic size="small" color="green">
                  <Statistic.Value>{Math.round(this.props.result.comprehensionPerMinute)}</Statistic.Value>
                  <Statistic.Label>{this.props.translate('test-results.comprehension-speed')}</Statistic.Label>
                </Statistic>
              </Grid.Column>
            </Grid.Row>
            {this.props.selectedText.id ? (
              <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }} stretched>
                <Grid.Column width={5} textAlign="right">
                  <span>
                    <b>{this.props.translate('test-results.rate-test-difficulty')}</b>
                    {` (${this.props.translate('test-results.optional')})`}
                  </span>
                </Grid.Column>
                <Grid.Column width={11} verticalAlign="middle">
                  <Popup
                    trigger={
                      <Rating
                        icon="star"
                        clearable
                        maxRating={10}
                        rating={this.state.difficultyRating}
                        onRate={this.onRateHandler}
                      />
                    }
                    position="top center"
                    content={this.props.translate('test-results.rate-test-difficulty-description')}
                  />
                </Grid.Column>
              </Grid.Row>
            ) : null}
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            icon="tasks"
            onClick={this.onCheckTestAnswersHandler}
            content={this.props.translate('test-results.check-correct-answers')}
          />
          <Button negative onClick={this.onEndHandler} content={this.props.translate('test-results.end')} />
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  result: state.exerciseTest.result,
  selectedText: state.text.selectedText,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TestResults);
