import React, { Component, Fragment } from 'react';
import { Header, Statistic, Icon, Grid } from 'semantic-ui-react';

import * as api from '../../../api';
import { updateObject, formatMillisecondsInHours } from '../../../shared/utility';
import { EXERCISE_COUNT } from '../../../store/reducers/exercise';

export class ApplicationStatistics extends Component {
  _isMounted = false;

  state = {
    loading: true,
    statistics: {
      exerciseCount: EXERCISE_COUNT,
      exerciseAttemptCount: 0,
      textCount: 0,
      questionCount: 0,
      userCount: 0,
      feedbackCount: 0,
      readingExerciseTime: 0,
      helpExerciseTime: 0,
      testTime: 0,
      totalTime: 0,
    },
  };

  componentDidMount() {
    this._isMounted = true;
    // console.log(navigator.userAgent, navigator.platform);
    api.fetchApplicationStatistics().then(
      (statistics) => {
        if (this._isMounted) {
          const updatedStatistics = updateObject(this.state.statistics, {
            ...statistics,
          });
          this.setState({
            loading: false,
            statistics: updatedStatistics,
          });
        }
      },
      () => {
        if (this._isMounted) {
          this.setState({
            loading: false,
          });
        }
      },
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Fragment>
        <Header as="h3">{this.props.translate('application-statistics.state')}</Header>
        <Grid textAlign="center" doubling>
          <Grid.Column computer={2} tablet={3} mobile={8}>
            <Statistic size="small">
              <Statistic.Value style={{ whiteSpace: 'nowrap' }}>
                <Icon name="winner" />
                {this.state.loading ? <Icon loading name="spinner" /> : this.state.statistics.exerciseCount}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.different')}
                <br />
                {this.props.translate('application-statistics.exercises')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={3} tablet={4} mobile={8}>
            <Statistic size="small">
              <Statistic.Value style={{ whiteSpace: 'nowrap' }}>
                <Icon name="flask" />
                {this.state.loading ? <Icon loading name="spinner" /> : this.state.statistics.exerciseAttemptCount}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.exercise')}
                <br />
                {this.props.translate('application-statistics.attempts')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={3} tablet={4} mobile={8}>
            <Statistic size="small">
              <Statistic.Value style={{ whiteSpace: 'nowrap' }}>
                <Icon name="file alternate outline" />
                {this.state.loading ? <Icon loading name="spinner" /> : this.state.statistics.textCount}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.reading')}
                <br />
                {this.props.translate('application-statistics.texts')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={3} tablet={4} mobile={8}>
            <Statistic size="small">
              <Statistic.Value style={{ whiteSpace: 'nowrap' }}>
                <Icon name="question circle" />
                {this.state.loading ? <Icon loading name="spinner" /> : this.state.statistics.questionCount}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.test')}
                <br />
                {this.props.translate('application-statistics.questions')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={2} tablet={3} mobile={8}>
            <Statistic size="small">
              <Statistic.Value style={{ whiteSpace: 'nowrap' }}>
                <Icon name="talk" />
                {this.state.loading ? <Icon loading name="spinner" /> : this.state.statistics.feedbackCount}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.feedback')}
                <br />
                {this.props.translate('application-statistics.received')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={3} tablet={4} mobile={8}>
            <Statistic size="small">
              <Statistic.Value style={{ whiteSpace: 'nowrap' }}>
                <Icon name="users" />
                {this.state.loading ? <Icon loading name="spinner" /> : this.state.statistics.userCount}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.users')}
                <br />
                {this.props.translate('application-statistics.registered')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={4} tablet={5} mobile={16}>
            <Statistic size="small">
              <Statistic.Value style={{ textTransform: 'lowercase', whiteSpace: 'nowrap' }}>
                {this.state.loading ? (
                  <Icon loading name="spinner" />
                ) : (
                  formatMillisecondsInHours(this.state.statistics.readingExerciseTime)
                )}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.elapsed-time-for')}
                <br />
                {this.props.translate('application-statistics.reading-exercises')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={4} tablet={4} mobile={16}>
            <Statistic size="small">
              <Statistic.Value style={{ textTransform: 'lowercase', whiteSpace: 'nowrap' }}>
                {this.state.loading ? (
                  <Icon loading name="spinner" />
                ) : (
                  formatMillisecondsInHours(this.state.statistics.helpExerciseTime)
                )}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.elapsed-time-for')}
                <br />
                {this.props.translate('application-statistics.help-exercises')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={4} tablet={8} mobile={16}>
            <Statistic size="small">
              <Statistic.Value style={{ textTransform: 'lowercase', whiteSpace: 'nowrap' }}>
                {this.state.loading ? (
                  <Icon loading name="spinner" />
                ) : (
                  formatMillisecondsInHours(this.state.statistics.testTime)
                )}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.elapsed-time-for')}
                <br />
                {this.props.translate('application-statistics.tests')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column computer={4} tablet={8} mobile={16}>
            <Statistic size="small">
              <Statistic.Value style={{ textTransform: 'lowercase', whiteSpace: 'nowrap' }}>
                <Icon name="clock" />
                {this.state.loading ? (
                  <Icon loading name="spinner" />
                ) : (
                  formatMillisecondsInHours(this.state.statistics.totalTime)
                )}
              </Statistic.Value>
              <Statistic.Label>
                {this.props.translate('application-statistics.elapsed-time-for')}
                <br />
                {this.props.translate('application-statistics.all')}
              </Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid>
      </Fragment>
    );
  }
}

export default ApplicationStatistics;
