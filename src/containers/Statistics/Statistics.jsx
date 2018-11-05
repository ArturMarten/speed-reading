import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Dropdown, Segment, Tab, Form, Dimmer, Loader, Checkbox, Grid } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { rolePermissions } from '../../store/reducers/profile';
import StatisticsTable from '../../components/Statistics/StatisticsTable';
import RegressionChart from '../../components/Statistics/RegressionChart';
import GroupTable from '../../components/Statistics/GroupTable';
import { getExerciseId } from '../../store/reducers/exercise';
import { reduceSumFunc, formatMillisecondsInHours } from '../../shared/utility';

export class Statistics extends Component {
  exerciseCharts = [
    [
      {
        id: 0,
        title: this.props.translate('regression-chart.reading-speed-trend'),
        yLabel: this.props.translate('regression-chart.speed-words-per-minute'),
        legendTitles: [this.props.translate('regression-chart.reading-speed')],
        yFields: ['wordsPerMinute'],
        dataStrokeColor: ['#FF4C4C'],
        dataFillColor: ['#FF9999'],
        dataLineColor: ['#FF0000'],
      }, {
        id: 1,
        title: this.props.translate('regression-chart.comprehension-speed-trend'),
        yLabel: this.props.translate('regression-chart.speed-words-per-minute'),
        legendTitles: [this.props.translate('regression-chart.comprehension-speed')],
        yFields: ['comprehensionPerMinute'],
        dataStrokeColor: ['#009900'],
        dataFillColor: ['#00FF00'],
        dataLineColor: ['#007F00'],
      }, {
        id: 2,
        title: this.props.translate('regression-chart.comprehension-level-trend'),
        yLabel: this.props.translate('regression-chart.comprehension-level-percentage'),
        legendTitles: [this.props.translate('regression-chart.comprehension-level')],
        yFields: ['comprehensionResult'],
        dataStrokeColor: ['#4C4CFF'],
        dataFillColor: ['#9999FF'],
        dataLineColor: ['#0000FF'],
      },
    ], [
      {
        id: 0,
        title: this.props.translate('regression-chart.finding-speed-trend'),
        yLabel: this.props.translate('regression-chart.speed-symbols-per-minute'),
        legendTitles: [this.props.translate('regression-chart.finding-speed')],
        yFields: ['symbolsPerMinute'],
        dataStrokeColor: ['#009900'],
        dataFillColor: ['#00FF00'],
        dataLineColor: ['#007F00'],
      },
    ], [
      {
        id: 0,
        title: this.props.translate('regression-chart.exercise-result-trend'),
        yLabel: this.props.translate('regression-chart.result-percentage'),
        legendTitles: [this.props.translate('regression-chart.exercise-result')],
        yFields: ['exerciseResult'],
        dataStrokeColor: ['#4C4CFF'],
        dataFillColor: ['#9999FF'],
        dataLineColor: ['#0000FF'],
      },
    ],
  ];

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

  scaleOptions = [
    { text: this.props.translate('statistics.exercise-index'), value: 'index' },
    { text: this.props.translate('statistics.exercise-date'), value: 'date' },
    { text: this.props.translate('statistics.exercise-time-spent'), value: 'time', disabled: true },
  ];

  state = {
    activeIndex: 0,
    isTeacher: rolePermissions[this.props.role] >= rolePermissions.teacher,
    isAdmin: rolePermissions[this.props.role] >= rolePermissions.admin,
    groupId: this.props.groupId === null ? 'all-groups' : this.props.groupId,
    userId: this.props.userId,
    exercise: 'readingExercises',
    chartIndex: 0,
    scale: 'index',
    xLabel: this.props.translate('regression-chart.index'),
    startTime: new Date(2018, 2, 2).toISOString().split('T')[0],
    endTime: new Date().toISOString().split('T')[0],
    filterOutliers: true,
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
    this.props.onFetchUserExerciseStatistics(this.props.userId, this.props.token);
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: Group statistics fetching fix
    if (prevState.activeIndex !== this.state.activeIndex &&
      this.state.activeIndex === 2 && Object.keys(this.props.groupExerciseStatistics).length === 0) {
      const fetchGroupId = this.state.groupId === 'all-groups' ? null : this.state.groupId;
      this.props.onFetchGroupExerciseStatistics(fetchGroupId, this.props.token);
    }
  }

  tabChangeHandler = (event, { activeIndex }) => this.setState({ activeIndex });

  groupChangeHandler = (event, { value }) => {
    if (this.state.groupId !== value) {
      let { userId } = this.state;
      const currentUser = this.props.users.find(user => user.publicId === userId);
      if (currentUser && currentUser.groupId !== value) {
        const groupUsers = this.props.users.filter(groupUser => groupUser.groupId === value);
        if (groupUsers.length > 0) {
          userId = groupUsers[0].publicId;
          this.props.onFetchUserExerciseStatistics(userId, this.props.token);
        }
      }
      if (this.state.activeIndex === 2) {
        const fetchGroupId = value === 'all-groups' ? null : value;
        this.props.onFetchGroupExerciseStatistics(fetchGroupId, this.props.token);
      }
      this.setState({ groupId: value, userId });
    }
  }

  userChangeHandler = (event, { value }) => {
    if (this.state.userId !== value) {
      const selectedUser = this.props.users.find(user => user.publicId === value);
      if (selectedUser) {
        this.props.onFetchUserExerciseStatistics(value, this.props.token);
        const { groupId } = selectedUser;
        this.setState({ userId: value, groupId: groupId === null ? 'all-groups' : groupId });
      }
    }
  }

  exerciseSelectionHandler = (event, { value }) => {
    if (this.state.exercise !== value) {
      let { chartIndex } = this.state;
      if (value === 'schulteTables') {
        chartIndex = 1;
      } else if (value === 'concentration') {
        chartIndex = 2;
      } else {
        chartIndex = 0;
      }
      this.setState({ exercise: value, chartIndex });
    }
  }

  scaleSelectionHandler = (event, { value }) => {
    if (this.state.scale !== value) {
      this.setState({
        scale: value,
        xLabel: value === 'date' ? this.props.translate('regression-chart.date') : this.props.translate('regression-chart.index'),
      });
    }
  }

  timeChangeHandler = (event, { name, value }) => {
    let newTime = value;
    if (newTime === '') {
      const currentTime = new Date(this.state[name]);
      if (currentTime.getDate() === 1) {
        currentTime.setDate(currentTime.getDate() - 1);
      } else {
        currentTime.setDate(currentTime.getDate() + 1);
      }
      [newTime] = currentTime.toISOString().split('T');
    }
    this.setState({
      [name]: newTime,
    });
  }

  outlierFilter = attempt => !this.state.filterOutliers || !attempt.wordsPerMinute || attempt.wordsPerMinute <= 500;

  timeFilter = attempt => (
    attempt.date >= new Date(this.state.startTime) &&
    attempt.date <= new Date(`${this.state.endTime}T23:59:59Z`)
  );

  filterOutliersHandler = () => {
    this.setState({
      filterOutliers: !this.state.filterOutliers,
    });
  }

  render() {
    const groupOptions = [{
      key: -1,
      text: this.props.translate('statistics.all-groups'),
      value: 'all-groups',
    }].concat(this.props.groups
      .map((group, index) => ({
        key: index,
        value: group.id,
        text: `${group.name} (${group.userCount} ${this.props.translate('statistics.users')})`,
      })));
    const userOptions = this.props.users
      .filter(user => this.state.groupId === 'all-groups' || user.groupId === this.state.groupId)
      .map((user, index) => ({
        key: index,
        value: user.publicId,
        text: `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''} <${user.email}>`,
      }));
    const userExerciseData = this.props.userExerciseStatistics
      .filter(attempt => getExerciseId(this.state.exercise).indexOf(attempt.exerciseId) !== -1)
      .filter(attempt => !this.state.isAdmin || this.timeFilter(attempt))
      .filter(this.outlierFilter)
      .map((attempt, index) => ({ ...attempt, index: index + 1 }));
    const totalExerciseTime = userExerciseData.map(exercise => exercise.elapsedTime).reduce(reduceSumFunc, 0);
    const totalTestTime = userExerciseData.map(exercise => exercise.testElapsedTime).reduce(reduceSumFunc, 0);
    const xField = this.state.scale === 'index' ? 'index' : 'date';

    const groupExerciseData = Object.assign(
      {},
      ...Object.keys(this.props.groupExerciseStatistics)
        .map(userId => ({
          [userId]: this.props.groupExerciseStatistics[userId]
            .filter(this.timeFilter)
            .filter(this.outlierFilter),
        })),
    );

    const groupFilter = (
      <Form.Field
        id="group-dropdown"
        fluid
        inline
        search
        selection
        value={this.state.groupId}
        onChange={this.groupChangeHandler}
        options={groupOptions}
        loading={this.props.groupsStatus.loading || this.props.groupExerciseStatisticsStatus.loading}
        label={this.props.translate('statistics.group')}
        control={Dropdown}
      />
    );

    const userFilter = (
      <Form.Field
        id="user-dropdown"
        fluid
        inline
        search
        selection
        value={this.state.userId}
        onChange={this.userChangeHandler}
        options={userOptions}
        loading={this.props.usersStatus.loading || this.props.userExerciseStatisticsStatus.loading}
        label={this.props.translate('statistics.user')}
        control={Dropdown}
      />
    );

    const userAndGroupFilter = (
      <Fragment>
        {this.state.isTeacher ?
          <Form.Group widths="equal">
            {groupFilter}
            {userFilter}
          </Form.Group> : null}
      </Fragment>
    );

    const timeFilter = (
      <Fragment>
        <Form.Input
          id="statistics-start"
          name="startTime"
          fluid
          inline
          type="date"
          value={this.state.startTime}
          onChange={this.timeChangeHandler}
          loading={this.props.groupExerciseStatisticsStatus.loading}
          label={this.props.translate('statistics.start-time')}
        />
        <Form.Input
          id="statistics-end"
          name="endTime"
          fluid
          inline
          type="date"
          value={this.state.endTime}
          onChange={this.timeChangeHandler}
          loading={this.props.groupExerciseStatisticsStatus.loading}
          label={this.props.translate('statistics.end-time')}
        />
      </Fragment>
    );

    const exerciseStatistics = (
      <Grid style={{ width: '75%' }} textAlign="center">
        <Grid.Row columns={4}>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>
              {this.props.translate('statistics.total-attempt-count')}
            </span>
            <br />
            <span style={{ fontSize: '1.6em' }}>
              {userExerciseData.length}
            </span>
          </Grid.Column>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>
              {this.props.translate('statistics.total-attempt-time')}
            </span>
            <br />
            <span style={{ fontSize: '1.6em' }}>
              {formatMillisecondsInHours(totalExerciseTime)}
            </span>
          </Grid.Column>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>
              {this.props.translate('statistics.total-test-time')}
            </span>
            <br />
            <span style={{ fontSize: '1.6em' }}>
              {formatMillisecondsInHours(totalTestTime)}
            </span>
          </Grid.Column>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>
              {this.props.translate('statistics.total-time')}
            </span>
            <br />
            <span style={{ fontSize: '1.6em' }}>
              {formatMillisecondsInHours(totalExerciseTime + totalTestTime)}
            </span>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );

    const panes = [
      {
        menuItem: {
          key: 'table',
          icon: 'table',
          content: this.props.translate('statistics.table'),
          disabled: this.props.userExerciseStatisticsStatus.loading || this.props.groupExerciseStatisticsStatus.loading,
        },
        render: () => (
          <Tab.Pane>
            <Form>
              {userAndGroupFilter}
              <Form.Group widths="equal">
                <Form.Field
                  id="exercise-dropdown"
                  fluid
                  inline
                  selection
                  value={this.state.exercise}
                  onChange={this.exerciseSelectionHandler}
                  options={this.exerciseOptions}
                  loading={this.props.userExerciseStatisticsStatus.loading}
                  label={this.props.translate('statistics.exercise')}
                  control={Dropdown}
                />
              </Form.Group>
              {this.state.isAdmin ?
                <Form.Group widths="equal">
                  {timeFilter}
                </Form.Group> : null}
              <Form.Group style={{ margin: 0 }} inline>
                <Form.Field
                  id="filter-checkbox"
                  checked={this.state.filterOutliers}
                  onChange={this.filterOutliersHandler}
                  label={this.props.translate('statistics.filter-outliers')}
                  control={Checkbox}
                />
                {exerciseStatistics}
              </Form.Group>
            </Form>
            <div style={{ overflowX: 'auto' }}>
              <Segment basic style={{ padding: 0 }}>
                <Dimmer inverted active={this.props.userExerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <StatisticsTable
                  exercise={this.state.exercise}
                  data={userExerciseData}
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
          disabled: this.props.userExerciseStatisticsStatus.loading || this.props.groupExerciseStatisticsStatus.loading,
        },
        render: () => (
          <Tab.Pane>
            <Form>
              {userAndGroupFilter}
              <Form.Group widths="equal">
                <Form.Field
                  id="exercise-dropdown"
                  fluid
                  inline
                  selection
                  value={this.state.exercise}
                  onChange={this.exerciseSelectionHandler}
                  options={this.exerciseOptions}
                  loading={this.props.userExerciseStatisticsStatus.loading}
                  label={this.props.translate('statistics.exercise')}
                  control={Dropdown}
                />
                <Form.Field
                  id="scale-dropdown"
                  fluid
                  inline
                  selection
                  value={this.state.scale}
                  onChange={this.scaleSelectionHandler}
                  options={this.scaleOptions}
                  loading={this.props.userExerciseStatisticsStatus.loading}
                  label={this.props.translate('statistics.scale')}
                  control={Dropdown}
                />
              </Form.Group>
              {this.state.isAdmin ?
                <Form.Group widths="equal">
                  {timeFilter}
                </Form.Group> : null}
              <Form.Group style={{ margin: 0 }} inline>
                <Form.Field
                  id="filter-checkbox"
                  checked={this.state.filterOutliers}
                  onChange={this.filterOutliersHandler}
                  label={this.props.translate('statistics.filter-outliers')}
                  control={Checkbox}
                />
                {exerciseStatistics}
              </Form.Group>
            </Form>
            <div style={{ margin: '1em 0em' }}>
              {this.exerciseCharts[this.state.chartIndex].map(({ id, ...chartProps }) => (
                <Segment key={id}>
                  <Dimmer inverted active={this.props.userExerciseStatisticsStatus.loading}>
                    <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                  </Dimmer>
                  <div style={{ textAlign: 'center', overflowX: 'auto' }}>
                    <RegressionChart
                      width={1000}
                      height={400}
                      data={userExerciseData}
                      xField={xField}
                      xLabel={this.state.xLabel}
                      translate={this.props.translate}
                      {...chartProps}
                    />
                  </div>
                </Segment>
              ))}
            </div>
          </Tab.Pane>
        ),
      },
      {
        menuItem: {
          key: 'group-table',
          icon: 'columns',
          content: this.props.translate('statistics.group-table'),
          disabled: (!this.state.isTeacher && this.props.groupId === null) ||
                      this.props.userExerciseStatisticsStatus.loading ||
                      this.props.groupExerciseStatisticsStatus.loading,
        },
        render: () => (
          <Tab.Pane>
            <Form>
              <Form.Group widths="equal">
                {this.state.isTeacher ? groupFilter : null}
                {timeFilter}
              </Form.Group>
            </Form>
            <div style={{ overflowX: 'auto' }}>
              <Segment basic style={{ padding: 0 }}>
                <Dimmer inverted active={this.props.groupExerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <GroupTable
                  startTime={this.state.startTime}
                  endTime={this.state.endTime}
                  data={groupExerciseData}
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
        <Header as="h2">
          {this.props.translate('statistics.title')}
        </Header>
        <p>
          {this.props.translate('statistics.description')}
        </p>
        <Tab
          panes={panes}
          activeIndex={this.state.activeIndex}
          onTabChange={this.tabChangeHandler}
        />
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
  userExerciseStatisticsStatus: state.statistics.userExerciseStatisticsStatus,
  userExerciseStatistics: state.statistics.userExerciseStatistics,
  groupExerciseStatisticsStatus: state.statistics.groupExerciseStatisticsStatus,
  groupExerciseStatistics: state.statistics.groupExerciseStatistics,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = dispatch => ({
  onFetchUsers: (token) => {
    dispatch(actionCreators.fetchUsers(token));
  },
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
  onFetchUserExerciseStatistics: (userId, token) => {
    dispatch(actionCreators.fetchUserExerciseStatistics(userId, token));
  },
  onFetchGroupExerciseStatistics: (groupId, token) => {
    dispatch(actionCreators.fetchGroupExerciseStatistics(groupId, token));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
