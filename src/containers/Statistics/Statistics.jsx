import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Header,
  Dropdown,
  Segment,
  Tab,
  Form,
  Dimmer,
  Loader,
  Checkbox,
  Grid,
  Button,
  Input,
  Label,
} from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';

import * as actionCreators from '../../store/actions';
import { rolePermissions } from '../../store/reducers/profile';
import StatisticsTable from '../../components/Statistics/StatisticsTable';
import RegressionChart from '../../components/Statistics/RegressionChart';
import GroupTable from '../../components/Statistics/GroupTable';
import { getExerciseId } from '../../store/reducers/exercise';
import { reduceSumFunc, formatMillisecondsInHours } from '../../shared/utility';

const getPeriodTime = (period) => {
  switch (period) {
    case 'one-day':
      return 24 * 60 * 60 * 1000;
    case 'one-week':
      return 7 * 24 * 60 * 60 * 1000;
    case 'two-weeks':
      return 14 * 24 * 60 * 60 * 1000;
    case 'three-weeks':
      return 21 * 24 * 60 * 60 * 1000;
    case 'one-month':
      return 30.4398 * 24 * 60 * 60 * 1000;
    case 'three-months':
      return 91.3194 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

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
      },
      {
        id: 1,
        title: this.props.translate('regression-chart.comprehension-speed-trend'),
        yLabel: this.props.translate('regression-chart.speed-words-per-minute'),
        legendTitles: [this.props.translate('regression-chart.comprehension-speed')],
        yFields: ['comprehensionPerMinute'],
        dataStrokeColor: ['#009900'],
        dataFillColor: ['#00FF00'],
        dataLineColor: ['#007F00'],
      },
      {
        id: 2,
        title: this.props.translate('regression-chart.comprehension-level-trend'),
        yLabel: this.props.translate('regression-chart.comprehension-level-percentage'),
        legendTitles: [this.props.translate('regression-chart.comprehension-level')],
        yFields: ['comprehensionResult'],
        dataStrokeColor: ['#4C4CFF'],
        dataFillColor: ['#9999FF'],
        dataLineColor: ['#0000FF'],
      },
    ],
    [
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
    ],
    [
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

  periodOptions = [
    { text: this.props.translate('statistics.period-not-defined'), value: 'not-defined' },
    { text: this.props.translate('statistics.period-one-week'), value: 'one-week' },
    { text: this.props.translate('statistics.period-two-weeks'), value: 'two-weeks' },
    { text: this.props.translate('statistics.period-three-weeks'), value: 'three-weeks' },
    { text: this.props.translate('statistics.period-one-month'), value: 'one-month' },
    { text: this.props.translate('statistics.period-three-months'), value: 'three-months' },
  ];

  state = {
    activeIndex: 0,
    groupId: this.props.groupId === null ? 'all-groups' : this.props.groupId,
    userId: this.props.userId,
    exercise: 'readingExercises',
    chartIndex: 0,
    scale: 'index',
    xLabel: this.props.translate('regression-chart.index'),
    startTime: new Date(2018, 2, 2).toISOString().split('T')[0],
    endTime: new Date().toISOString().split('T')[0],
    period: 'not-defined',
    filterOutliers: true,
    minimumAttemptCount: 0,
    order: 1,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.preventDefault);
    document.addEventListener('keyup', this.keyUpHandler);
    if (this.props.isAuthenticated) {
      this.fetchInitialData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
      this.fetchInitialData();
    }
    // TODO: Group statistics fetching fix
    if (
      prevState.activeIndex !== this.state.activeIndex &&
      this.state.activeIndex === 2 &&
      Object.keys(this.props.groupExerciseStatistics).length === 0
    ) {
      const fetchGroupId = this.state.groupId === 'all-groups' ? null : this.state.groupId;
      this.props.onFetchGroupExerciseStatistics(fetchGroupId);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.preventDefault);
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  fetchInitialData = () => {
    if (this.props.isTeacher) {
      if (this.props.users.length === 0) {
        this.props.onFetchUsers();
      }
      if (this.props.groups.length === 0) {
        this.props.onFetchGroups();
      }
    }
    this.props.onFetchUserExerciseStatistics(this.props.userId);
  };

  tabChangeHandler = (event, { activeIndex }) => this.setState({ activeIndex });

  groupChangeHandler = (event, { value }) => {
    if (this.state.groupId !== value) {
      let { userId } = this.state;
      const currentUser = this.props.users.find((user) => user.publicId === userId);
      if (currentUser && currentUser.groupId !== value) {
        const groupUsers = this.props.users.filter((groupUser) => groupUser.groupId === value);
        if (groupUsers.length > 0) {
          userId = groupUsers[0].publicId;
          this.props.onFetchUserExerciseStatistics(userId);
        }
      }
      if (this.state.activeIndex === 2) {
        const fetchGroupId = value === 'all-groups' ? null : value;
        this.props.onFetchGroupExerciseStatistics(fetchGroupId);
      }
      this.setState({ groupId: value, userId });
    }
  };

  userChangeHandler = (event, { value }) => {
    if (this.state.userId !== value) {
      const selectedUser = this.props.users.find((user) => user.publicId === value);
      if (selectedUser) {
        this.props.onFetchUserExerciseStatistics(value);
        const { groupId } = selectedUser;
        this.setState({ userId: value, groupId: groupId === null ? 'all-groups' : groupId });
      }
    }
  };

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
  };

  scaleSelectionHandler = (event, { value }) => {
    if (this.state.scale !== value) {
      this.setState({
        scale: value,
        xLabel:
          value === 'date'
            ? this.props.translate('regression-chart.date')
            : this.props.translate('regression-chart.index'),
      });
    }
  };

  minimumAttemptCountChangeHandler = (event, { value }) => {
    this.setState({
      minimumAttemptCount: value,
    });
  };

  timeChangeHandler = (event, { name, value }) => {
    const { startTime, endTime, period } = this.state;
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
    if (period !== 'not-defined') {
      const periodTime = getPeriodTime(period);
      const dayCorrection = getPeriodTime('one-day');
      const currentStartTime = new Date(startTime);
      const currentEndTime = new Date(endTime);
      let newStartTime = currentStartTime;
      let newEndTime = currentEndTime;
      if (name === 'startTime') {
        newStartTime = new Date(newTime);
        newEndTime = new Date(newStartTime.getTime() + periodTime - dayCorrection);
      } else {
        newEndTime = new Date(newTime);
        newStartTime = new Date(newEndTime.getTime() - periodTime + dayCorrection);
      }
      const [changedStartTime] = newStartTime.toISOString().split('T');
      const [changedEndTime] = newEndTime.toISOString().split('T');
      this.setState({
        startTime: changedStartTime,
        endTime: changedEndTime,
      });
    } else {
      this.setState({
        [name]: newTime,
      });
    }
  };

  periodSelectionHandler = (event, { value }) => {
    const { startTime, endTime } = this.state;
    let changedStartTime = startTime;
    if (value !== 'not-defined') {
      const currentEndTime = new Date(endTime);
      const periodTime = getPeriodTime(value);
      const dayCorrection = getPeriodTime('one-day');
      const newStartTime = new Date(currentEndTime.getTime() - periodTime + dayCorrection);
      [changedStartTime] = newStartTime.toISOString().split('T');
    }
    this.setState({
      period: value,
      startTime: changedStartTime,
    });
  };

  periodChangeHandler = (event, { name }) => {
    const { startTime, endTime, period } = this.state;
    const periodTime = getPeriodTime(period);
    const currentStartTime = new Date(startTime);
    const currentEndTime = new Date(endTime);
    let newStartTime = currentStartTime;
    let newEndTime = currentEndTime;
    if (name === 'prev') {
      newStartTime = new Date(currentStartTime.getTime() - periodTime);
      newEndTime = new Date(currentEndTime.getTime() - periodTime);
    } else {
      newStartTime = new Date(currentStartTime.getTime() + periodTime);
      newEndTime = new Date(currentEndTime.getTime() + periodTime);
    }
    const [changedStartTime] = newStartTime.toISOString().split('T');
    const [changedEndTime] = newEndTime.toISOString().split('T');
    this.setState({
      startTime: changedStartTime,
      endTime: changedEndTime,
    });
  };

  preventDefault = (event) => {
    const { key } = event;
    if (['ArrowLeft', 'ArrowRight'].indexOf(key) !== -1 && document.activeElement.id === '') {
      event.preventDefault();
    }
  };

  keyUpHandler = (event) => {
    if (document.activeElement.id === '') {
      event.preventDefault();
      const { key } = event;
      switch (key) {
        case 'ArrowLeft': {
          this.periodChangeHandler(event, { name: 'prev' });
          break;
        }
        case 'ArrowRight': {
          this.periodChangeHandler(event, { name: 'next' });
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  outlierFilter = (attempt) => !this.state.filterOutliers || !attempt.wordsPerMinute || attempt.wordsPerMinute <= 500;

  timeFilter = (attempt) =>
    attempt.date >= new Date(this.state.startTime) && attempt.date <= new Date(`${this.state.endTime}T23:59:59Z`);

  filterOutliersHandler = () => {
    this.setState({
      filterOutliers: !this.state.filterOutliers,
    });
  };

  render() {
    const groupOptions = [
      {
        key: -1,
        text: this.props.translate('statistics.all-groups'),
        value: 'all-groups',
      },
    ].concat(
      this.props.groups.map((group, index) => ({
        key: index,
        value: group.id,
        text: `${group.name} (${group.userCount} ${this.props.translate('statistics.users')})`,
      })),
    );
    const userOptions = this.props.users
      .filter((user) => this.state.groupId === 'all-groups' || user.groupId === this.state.groupId)
      .map((user, index) => ({
        key: index,
        value: user.publicId,
        text: `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''} <${user.email}>`,
      }));
    const userExerciseData = this.props.userExerciseStatistics
      .filter((attempt) => getExerciseId(this.state.exercise).indexOf(attempt.exerciseId) !== -1)
      .filter((attempt) => this.timeFilter(attempt))
      .filter(this.outlierFilter)
      .map((attempt, index) => ({ ...attempt, index: index + 1 }));
    const totalExerciseTime = userExerciseData.map((exercise) => exercise.elapsedTime).reduce(reduceSumFunc, 0);
    const totalTestTime = userExerciseData.map((exercise) => exercise.testElapsedTime).reduce(reduceSumFunc, 0);
    const xField = this.state.scale === 'index' ? 'index' : 'date';

    const groupExerciseData = Object.assign(
      {},
      ...Object.keys(this.props.groupExerciseStatistics).map((userId) => ({
        [userId]: this.props.groupExerciseStatistics[userId].filter(this.timeFilter).filter(this.outlierFilter),
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

    const exerciseFilter = (
      <Form.Field
        id="attempt-count-input"
        type="number"
        width={6}
        value={this.state.minimumAttemptCount}
        onChange={this.minimumAttemptCountChangeHandler}
        loading={this.props.groupExerciseStatisticsStatus.loading}
        label={this.props.translate('statistics.minimum-attempt-count')}
        control={Input}
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
        {this.props.isTeacher ? (
          <Form.Group widths="equal">
            {groupFilter}
            {userFilter}
          </Form.Group>
        ) : null}
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
        <Form.Field>
          <label htmlFor="statistics-period" style={{ margin: 0 }}>
            {this.props.translate('statistics.period')}
          </label>
          <Dropdown
            id="statistics-period"
            name="period"
            compact
            selection
            value={this.state.period}
            onChange={this.periodSelectionHandler}
            options={this.periodOptions}
            style={{ width: '50%' }}
          />
          <Button.Group basic style={{ width: '50%' }}>
            <Button
              id="statistics-period-prev"
              name="prev"
              type="button"
              disabled={this.state.period === 'not-defined'}
              icon="angle double left"
              onClick={this.periodChangeHandler}
            />
            <Button
              id="statistics-period-next"
              name="next"
              type="button"
              disabled={this.state.period === 'not-defined'}
              icon="angle double right"
              onClick={this.periodChangeHandler}
            />
          </Button.Group>
        </Form.Field>
      </Fragment>
    );

    const exerciseStatistics = (
      <Grid style={{ width: '75%' }} textAlign="center">
        <Grid.Row columns={4}>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>{this.props.translate('statistics.total-attempt-count')}</span>
            <br />
            <span style={{ fontSize: '1.6em' }}>{userExerciseData.length}</span>
          </Grid.Column>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>{this.props.translate('statistics.total-attempt-time')}</span>
            <br />
            <span style={{ fontSize: '1.6em' }}>{formatMillisecondsInHours(totalExerciseTime)}</span>
          </Grid.Column>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>{this.props.translate('statistics.total-test-time')}</span>
            <br />
            <span style={{ fontSize: '1.6em' }}>{formatMillisecondsInHours(totalTestTime)}</span>
          </Grid.Column>
          <Grid.Column>
            <span style={{ fontSize: '0.9em' }}>{this.props.translate('statistics.total-time')}</span>
            <br />
            <span style={{ fontSize: '1.6em' }}>{formatMillisecondsInHours(totalExerciseTime + totalTestTime)}</span>
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
              <Form.Group widths="equal">{timeFilter}</Form.Group>
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
              <Form.Group widths="equal">{timeFilter}</Form.Group>
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
                  <Input
                    type="number"
                    labelPosition="left"
                    value={this.state.order}
                    style={{ display: 'block', textAlign: 'right' }}
                    onChange={(event) => this.setState({ order: +event.target.value })}
                  >
                    <Label basic>Polünoomi aste</Label>
                    <input style={{ width: '5em' }} max="30" />
                  </Input>
                  <div style={{ textAlign: 'center', overflowX: 'auto' }}>
                    <RegressionChart
                      width={1000}
                      height={400}
                      data={userExerciseData}
                      xField={xField}
                      xLabel={this.state.xLabel}
                      translate={this.props.translate}
                      order={this.state.order}
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
          disabled:
            (!this.props.isTeacher && this.props.groupId === null) ||
            this.props.userExerciseStatisticsStatus.loading ||
            this.props.groupExerciseStatisticsStatus.loading,
        },
        render: () => (
          <Tab.Pane>
            <Form>
              <Form.Group widths="equal">
                {this.props.isTeacher ? groupFilter : null}
                {this.props.isTeacher ? exerciseFilter : null}
              </Form.Group>
              <Form.Group widths="equal">{timeFilter}</Form.Group>
            </Form>
            <div style={{ overflowX: 'auto' }}>
              <Segment basic style={{ padding: 0 }}>
                <Dimmer inverted active={this.props.groupExerciseStatisticsStatus.loading}>
                  <Loader indeterminate content={this.props.translate('statistics.fetching-data')} />
                </Dimmer>
                <GroupTable
                  isTeacher={this.props.isTeacher}
                  data={groupExerciseData}
                  minimumAttemptCount={this.state.minimumAttemptCount}
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
        <Tab panes={panes} activeIndex={this.state.activeIndex} onTabChange={this.tabChangeHandler} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
  role: state.profile.role,
  isTeacher: rolePermissions[state.profile.role] >= rolePermissions.teacher || state.profile.role === 'statistician',
  isAdmin: rolePermissions[state.profile.role] >= rolePermissions.admin,
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

const mapDispatchToProps = (dispatch) => ({
  onFetchUsers: () => {
    dispatch(actionCreators.fetchUsers());
  },
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
  onFetchUserExerciseStatistics: (userId) => {
    dispatch(actionCreators.fetchUserExerciseStatistics(userId));
  },
  onFetchGroupExerciseStatistics: (groupId) => {
    dispatch(actionCreators.fetchGroupExerciseStatistics(groupId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Statistics);
