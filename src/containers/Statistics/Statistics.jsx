import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Dropdown, Segment, Tab, Form, Dimmer, Loader } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { rolePermissions } from '../../store/reducers/profile';
import RegressionChart from '../../components/Statistics/RegressionChart';
import StatisticsTable from '../../components/Statistics/StatisticsTable';
import { getExerciseId } from '../../store/reducers/exercise';

export class Statistics extends Component {
  state = {
    isTeacher: rolePermissions[this.props.role] >= rolePermissions.teacher,
    groupId: this.props.groupId === null ? 'all-groups' : this.props.groupId,
    userId: this.props.userId,
    exercise: 'readingExercises',
  };

  componentDidMount() {
    if (this.state.isTeacher) {
      if (this.props.users.length === 0) {
        this.props.onFetchUsers(this.props.token);
      }
      if (this.props.groups.length === 0) {
        this.props.onFetchGroups();
      }
    }
    this.props.onFetchExerciseStatistics(this.props.userId, this.props.token);
  }

  groupChangeHandler = (event, { value }) => {
    let { userId } = this.state;
    const currentUser = this.props.users.find(user => user.publicId === userId);
    if (currentUser && currentUser.groupId !== value) {
      const groupUsers = this.props.users.filter(groupUser => groupUser.groupId === value);
      if (groupUsers.length > 0) {
        userId = groupUsers[0].publicId;
        this.props.onFetchExerciseStatistics(userId, this.props.token);
      }
    }
    this.setState({ groupId: value, userId });
  }

  userChangeHandler = (event, { value }) => {
    if (this.state.userId !== value) {
      const selectedUser = this.props.users.find(user => user.publicId === value);
      if (selectedUser) {
        this.props.onFetchExerciseStatistics(value, this.props.token);
        const { groupId } = selectedUser;
        this.setState({ userId: value, groupId: groupId === null ? 'all-groups' : groupId });
      }
    }
  }

  exerciseSelectionHandler = (event, { value }) => {
    if (this.state.exercise !== value) {
      this.setState({ exercise: value });
    }
  }

  filterOutliers = attempt => true || attempt.wpm <= 500;

  exerciseOptions = [
    { text: this.props.translate('statistics.reading-exercises'), value: 'readingExercises' },
    { text: this.props.translate('statistics.reading-test'), value: 'readingTest' },
    { text: this.props.translate('statistics.reading-aid'), value: 'readingAid' },
    { text: this.props.translate('statistics.scrolling-text'), value: 'scrolling' },
    { text: this.props.translate('statistics.disappearing-text'), value: 'disappearing' },
    { text: this.props.translate('statistics.word-groups'), value: 'wordGroups' },
    { text: this.props.translate('statistics.schulte-tables'), value: 'schulteTables' },
    { text: this.props.translate('statistics.concentration'), value: 'concentration' },
  ];

  render() {
    const groupOptions = [{
      key: -1,
      text: this.props.translate('statistics.all-groups'),
      value: 'all-groups',
    }].concat(this.props.groups
      .map((group, index) => ({ key: index, value: group.id, text: group.name })));
    const userOptions = this.props.users
      .filter(user => this.state.groupId === 'all-groups' || user.groupId === this.state.groupId)
      .map((user, index) => ({ key: index, value: user.publicId, text: `${user.name ? user.name : ''} <${user.email}>` }));
    const data = this.props.exerciseStatistics
      .filter(attempt => getExerciseId(this.state.exercise).indexOf(attempt.exerciseId) !== -1)
      .filter(this.filterOutliers)
      .map((attempt, index) => ({ ...attempt, index }));
    const filter = (
      <Form>
        {this.state.isTeacher ?
          <Form.Group widths="equal">
            <Form.Field
              id="group-dropdown"
              fluid
              inline
              search
              selection
              value={this.state.groupId}
              onChange={this.groupChangeHandler}
              options={groupOptions}
              loading={this.props.groupsStatus.loading}
              label={this.props.translate('statistics.group')}
              control={Dropdown}
            />
            <Form.Field
              id="user-dropdown"
              fluid
              inline
              search
              selection
              value={this.state.userId}
              onChange={this.userChangeHandler}
              options={userOptions}
              loading={this.props.usersStatus.loading}
              label={this.props.translate('statistics.user')}
              control={Dropdown}
            />
          </Form.Group> : null}
        <Form.Field
          id="exercise-dropdown"
          fluid
          inline
          selection
          value={this.state.exercise}
          onChange={this.exerciseSelectionHandler}
          options={this.exerciseOptions}
          loading={this.props.exerciseStatisticsStatus.loading}
          label={this.props.translate('statistics.exercise')}
          control={Dropdown}
        />
      </Form>
    );
    const panes = [
      {
        menuItem: {
          key: 'table',
          icon: 'table',
          content: this.props.translate('statistics.table'),
        },
        render: () => (
          <Tab.Pane>
            {filter}
            <div style={{ margin: '1em 0em', overflowX: 'auto' }}>
              <Segment basic>
                <Dimmer inverted active={this.props.exerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <StatisticsTable
                  exercise={this.state.exercise}
                  data={data}
                  translate={this.props.translate}
                />
              </Segment>
            </div>
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
          <Tab.Pane>
            {filter}
            <div style={{ margin: '1em 0em', overflowX: 'auto' }}>
              <Segment>
                <Dimmer inverted active={this.props.exerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <RegressionChart
                  title={this.props.translate('regression-chart.reading-speed-trend')}
                  xLabel={this.props.translate('regression-chart.date')}
                  yLabel={this.props.translate('regression-chart.speed-wpm')}
                  legendTitles={[this.props.translate('regression-chart.reading-speed')]}
                  width={1000}
                  height={400}
                  data={data}
                  xField="date"
                  yFields={['wpm']}
                  dataStrokeColor={['#FF4C4C']}
                  dataFillColor={['#FF9999']}
                  dataLineColor={['#FF0000']}
                  translate={this.props.translate}
                />
              </Segment>
              <Segment>
                <Dimmer inverted active={this.props.exerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <RegressionChart
                  title={this.props.translate('regression-chart.comprehension-speed-trend')}
                  xLabel={this.props.translate('regression-chart.date')}
                  yLabel={this.props.translate('regression-chart.speed-wpm')}
                  legendTitles={[this.props.translate('regression-chart.comprehension-speed')]}
                  width={1000}
                  height={400}
                  data={data}
                  xField="date"
                  yFields={['cpm']}
                  dataStrokeColor={['#009900']}
                  dataFillColor={['#00FF00']}
                  dataLineColor={['#007F00']}
                  translate={this.props.translate}
                />
              </Segment>
              <Segment>
                <Dimmer inverted active={this.props.exerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <RegressionChart
                  title={this.props.translate('regression-chart.comprehension-level-trend')}
                  xLabel={this.props.translate('regression-chart.date')}
                  yLabel={this.props.translate('regression-chart.comprehension-level-percentage')}
                  legendTitles={[this.props.translate('regression-chart.comprehension-level')]}
                  width={1000}
                  height={400}
                  data={data}
                  xField="date"
                  yFields={['comprehensionResult']}
                  dataStrokeColor={['#4C4CFF']}
                  dataFillColor={['#9999FF']}
                  dataLineColor={['#0000FF']}
                  translate={this.props.translate}
                />
              </Segment>
            </div>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{this.props.translate('statistics.title')}</Header>
        <p>{this.props.translate('statistics.description')}</p>
        <Tab panes={panes} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  role: state.profile.role,
  groupId: state.profile.groupId,
  userId: state.auth.userId,
  usersStatus: state.user.usersStatus,
  users: state.user.users,
  groupsStatus: state.group.groupsStatus,
  groups: state.group.groups,
  exerciseStatisticsStatus: state.statistics.exerciseStatisticsStatus,
  exerciseStatistics: state.statistics.exerciseStatistics,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchUsers: (token) => {
    dispatch(actionCreators.fetchUsers(token));
  },
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
  onFetchExerciseStatistics: (userId, token) => {
    dispatch(actionCreators.fetchExerciseStatistics(userId, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
