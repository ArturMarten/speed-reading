import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Dropdown, Segment, Tab } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import RegressionChart from '../../components/Statistics/RegressionChart';
import StatisticsTable from '../../components/Statistics/StatisticsTable';
import { getExerciseId } from '../../store/reducers/exercise';

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
      { text: this.props.translate('statistics.schulte-tables'), value: 'schulteTables' },
      { text: this.props.translate('statistics.concentration'), value: 'concentration' },
    ];
    const data = this.props.exerciseStatistics
      .filter(attempt => attempt.exerciseId === getExerciseId(this.state.exercise));
    const exerciseDropdown = (
      <Dropdown
        fluid
        selection
        value={this.state.exercise}
        onChange={this.exerciseSelectionHandler}
        options={exercises}
      />
    );
    const panes = [
      {
        menuItem: {
          key: 'table',
          icon: 'table',
          content: this.props.translate('statistics.table'),
        },
        render: () => (
          <Tab.Pane loading={this.props.exerciseStatisticsStatus.loading}>
            {exerciseDropdown}
            <StatisticsTable
              exercise={this.state.exercise}
              data={data}
              translate={this.props.translate}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'chart',
          icon: 'line chart',
          content: this.props.translate('statistics.regression'),
          disabled: this.props.exerciseStatisticsStatus.loading,
        },
        render: () => (
          <Tab.Pane loading={this.props.exerciseStatisticsStatus.loading}>
            {exerciseDropdown}
            {/*
            <Message warning>
              <Message.Header>{this.props.translate('statistics.warning-title')}</Message.Header>
            </Message>
            */}
            <Segment basic>
              <RegressionChart
                exercise={this.state.exercise}
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
