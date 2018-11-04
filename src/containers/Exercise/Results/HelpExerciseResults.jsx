import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Grid, Statistic, Transition, Icon } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import { formatMilliseconds } from '../../../shared/utility';

export class HelpExerciseResults extends Component {
  state = {}

  render() {
    return (
      <Modal open={this.props.open} size="tiny">
        <Modal.Header>
          {this.props.translate('help-exercise-results.modal-header')}
        </Modal.Header>
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
                  <Statistic.Value>
                    {formatMilliseconds(this.props.result.elapsedTime)}
                  </Statistic.Value>
                  <Statistic.Label>
                    {this.props.translate('help-exercise-results.elapsed-time')}
                  </Statistic.Label>
                </Statistic>
                {this.props.result.spm !== undefined ?
                  <Statistic size="small" color="green">
                    <Statistic.Value>
                      {this.props.result.spm}
                    </Statistic.Value>
                    <Statistic.Label>
                      {this.props.translate('help-exercise-results.symbolsPerMinute')}
                    </Statistic.Label>
                  </Statistic> : null}
                {this.props.result.total !== undefined && this.props.result.correct !== undefined &&
                this.props.result.incorrect !== undefined && this.props.result.unanswered !== undefined ?
                  <Fragment>
                    <Statistic size="small" color="blue">
                      <Statistic.Value>
                        {`${Math.round((this.props.result.correct / this.props.result.total) * 100)}%`}
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('help-exercise-results.percentage')}
                      </Statistic.Label>
                    </Statistic>
                    <br />
                    <Statistic size="small" color="green">
                      <Statistic.Value>
                        {this.props.result.correct}
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('help-exercise-results.correct')}
                      </Statistic.Label>
                    </Statistic>
                    <Statistic size="small" color="red">
                      <Statistic.Value>
                        {this.props.result.incorrect}
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('help-exercise-results.incorrect')}
                      </Statistic.Label>
                    </Statistic>
                    <Statistic size="small" color="grey">
                      <Statistic.Value>
                        {this.props.result.unanswered}
                      </Statistic.Value>
                      <Statistic.Label>
                        {this.props.translate('help-exercise-results.unanswered')}
                      </Statistic.Label>
                    </Statistic>
                  </Fragment> : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            onClick={this.props.onRetry}
            content={this.props.translate('help-exercise-results.retry')}
          />
          <Button
            negative
            onClick={this.props.onEnd}
            content={this.props.translate('help-exercise-results.end')}
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

export default connect(mapStateToProps, mapDispatchToProps)(HelpExerciseResults);
