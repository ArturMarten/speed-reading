import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Message, Dropdown, Segment, Dimmer, Loader, Icon, Tab } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
// import RegressionChart from '../../components/Statistics/RegressionChart';
import StatisticsTable from '../../components/Statistics/StatisticsTable';
import RegressionChartC3 from '../../components/Statistics/RegressionChartC3';

import { getExerciseId } from '../../store/reducers/exercise';

/*
const statistics = [
  [
    { date: '2017-09-20', wpm: 230, exerciseId: 1 },
    { date: '2017-10-10', wpm: 250, exerciseId: 1 },
    { date: '2017-11-1', wpm: 300, exerciseId: 1 },
    { date: '2017-11-11', wpm: 320, exerciseId: 1 },
    { date: '2017-11-17', wpm: 300, exerciseId: 1 },
    { date: '2018-1-1', wpm: 325, exerciseId: 1 },
    { date: '2018-1-12', wpm: 315, exerciseId: 1 },
    { date: '2017-09-21', wpm: 230, exerciseId: 2 },
    { date: '2017-10-10', wpm: 230, exerciseId: 2 },
    { date: '2017-11-1', wpm: 320, exerciseId: 2 },
    { date: '2017-11-11', wpm: 300, exerciseId: 2 },
    { date: '2017-12-1', wpm: 310, exerciseId: 2 },
    { date: '2018-1-1', wpm: 305, exerciseId: 2 },
    { date: '2018-1-12', wpm: 345, exerciseId: 2 },
    { date: '2017-09-24', wpm: 230, exerciseId: 3 },
    { date: '2017-10-10', wpm: 260, exerciseId: 3 },
    { date: '2017-11-1', wpm: 300, exerciseId: 3 },
    { date: '2017-12-11', wpm: 290, exerciseId: 3 },
    { date: '2018-1-1', wpm: 335, exerciseId: 3 },
    { date: '2018-1-12', wpm: 295, exerciseId: 3 },
    { date: '2018-1-7', wpm: 305, exerciseId: 3 },
  ],
];
*/

export class Statistics extends Component {
  state = {
    exercise: 'readingTest',
  };

  componentDidMount() {
    this.props.onFetchExerciseStatistics(this.props.userId, this.props.token);
  }

  exerciseSelectionHandler = (event, data) => {
    this.setState({ exercise: data.value });
  }

  render() {
    const exercises = [
      { text: this.props.translate('statistics.reading-test'), value: 'readingTest' },
      { text: this.props.translate('statistics.reading-aid'), value: 'readingAid' },
      { text: this.props.translate('statistics.disappearing-text'), value: 'disappearing' },
      { text: this.props.translate('statistics.word-groups'), value: 'wordGroups' },
    ];
    const data = this.props.exerciseStatistics
      .filter(attempt => attempt.exerciseId === getExerciseId(this.state.exercise) && attempt.result !== null)
      .map(attempt => ({
        id: attempt.id,
        modification: attempt.modification,
        date: new Date(attempt.startTime),
        readingAttempt: attempt.readingAttempt,
        wpm: attempt.result.wpm,
        testResult: attempt.test && attempt.test.result ? Math.round((attempt.test.result.correct / attempt.test.result.total) * 100) : null,
      }));
    const exerciseDropdown = (
      <Dropdown
        fluid
        selection
        upward
        value={this.state.exercise}
        onChange={this.exerciseSelectionHandler}
        options={exercises}
      />
    );
    const panes = [
      {
        menuItem: { key: 'table', icon: 'table', content: this.props.translate('statistics.table') },
        render: () => (
          <Tab.Pane>
            {exerciseDropdown}
            <StatisticsTable
              data={data}
              translate={this.props.translate}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: { key: 'chart', icon: 'line chart', content: this.props.translate('statistics.regression') },
        render: () => (
          <Tab.Pane>
            {exerciseDropdown}
            <Message warning>
              <Message.Header>{this.props.translate('statistics.warning-title')}</Message.Header>
            </Message>
            <Segment basic>
              <Dimmer inverted active={this.props.exerciseStatisticsStatus.loading}>
                <Loader>{this.props.translate('statistics.loading')}</Loader>
              </Dimmer>
              <Dimmer inverted active={data.length === 0}>
                <Header as="h5" icon>
                  <Icon name="search" />
                  {this.props.translate('statistics.missing-data')}
                </Header>
              </Dimmer>
              <RegressionChartC3
                data={data}
                translate={this.props.translate}
              />
            </Segment>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Container style={{ marginTop: '4vh' }}>
        <Header as="h2">{this.props.translate('statistics.title')}</Header>
        <p>{this.props.translate('statistics.description')}</p>
        <Tab panes={panes} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  userId: state.auth.userId,
  exerciseStatisticsStatus: state.statistics.exerciseStatisticsStatus,
  exerciseStatistics: state.statistics.exerciseStatistics,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchExerciseStatistics: (userId, token) => {
    dispatch(actionCreators.fetchExerciseStatistics(userId, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
