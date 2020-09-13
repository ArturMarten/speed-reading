import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Icon, Segment, Button, Form, Dropdown, Message } from 'semantic-ui-react';
import { getTranslate } from 'react-localize-redux';
import AchievementProgress from '../../components/AchievementProgress/AchievementProgress';
import * as actionCreators from '../../store/actions';
import * as api from '../../api';
import {
  initialAchievements,
  updateUserAchievements,
  checkTemporalAchievements,
  getCategoryAchievementKeys,
  getAchievement,
  mergeDeep,
} from './achievements';
import { rolePermissions } from '../../store/reducers/profile';

import './Achievements.css';
import AchievementsTable from './AchievementsTable';

const calculateRanking = (achievements, groupUsers) => (category) => {
  let top = false;
  let bottom = false;
  const groupSize = groupUsers.length;
  const counts = groupUsers
    .map((user) => (user.achievements ? user.achievements[category].exercise.count : 0))
    .sort((a, b) => b - a);
  const times = groupUsers
    .map((user) => (user.achievements ? user.achievements[category].exercise.time : 0))
    .sort((a, b) => b - a);
  if (Math.max(...counts) > 0 && Math.max(...times) > 0) {
    const countRankingIndex = counts.indexOf(achievements[category].exercise.count);
    const timeRankingIndex = times.indexOf(achievements[category].exercise.time);
    if (achievements[category].exercise.count === 0 || achievements[category].exercise.time === 0) {
      bottom = true;
    } else if (countRankingIndex !== -1 && timeRankingIndex !== -1) {
      const topIndex = Math.ceil((groupSize - 1) * 0.3);
      const bottomIndex = Math.ceil((groupSize - 1) * 0.7);
      if (countRankingIndex <= topIndex || timeRankingIndex <= topIndex) {
        top = true;
      } else if (countRankingIndex >= bottomIndex && timeRankingIndex >= bottomIndex) {
        bottom = true;
      }
    }
  }
  return { top, bottom };
};

export class Achievements extends Component {
  state = {
    achievements: null,
    userAchievements: null,
    groupId: this.props.groupId === null ? 'all-groups' : this.props.groupId,
    userId: this.props.userId,
    updating: false,
  };

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.fetchInitialData();
    }
  }

  fetchInitialData = () => {
    this.fetchUserAchievements();
    if (this.props.isTeacher) {
      this.props.onFetchUsers();
      if (this.props.groups.length === 0) {
        this.props.onFetchGroups();
      }
    }
  };

  fetchUserAchievements = () => {
    api.fetchAchievements().then(
      (data) => {
        const now = new Date();
        const updatedUserAchievements = data.map((user) => ({
          ...user,
          achievements: user.achievements ? checkTemporalAchievements(user.achievements, now) : null,
        }));
        this.setState({ userAchievements: updatedUserAchievements });
      },
      (error) => {
        console.warn(error);
      },
    );
  };

  groupChangeHandler = (event, { value }) => {
    if (this.state.groupId !== value) {
      let { userId } = this.state;
      let selectedUser = this.props.users.find((user) => user.publicId === userId);
      if (selectedUser && selectedUser.groupId !== value) {
        const groupUsers = this.props.users.filter((groupUser) => groupUser.groupId === value);
        if (groupUsers.length > 0) {
          [selectedUser] = groupUsers;
          userId = selectedUser.publicId;
        }
        const achievements =
          selectedUser.achievements !== null
            ? mergeDeep(initialAchievements, selectedUser.achievements)
            : initialAchievements;
        this.setState({ achievements });
      }

      this.setState({ groupId: value, userId });
    }
  };

  userChangeHandler = (event, { value }) => {
    if (this.state.userId !== value) {
      const selectedUser = this.props.users.find((user) => user.publicId === value);
      if (selectedUser) {
        const { groupId } = selectedUser;
        const achievements =
          selectedUser.achievements !== null
            ? mergeDeep(initialAchievements, selectedUser.achievements)
            : initialAchievements;
        this.setState({
          userId: value,
          groupId: groupId === null ? 'all-groups' : groupId,
          achievements: checkTemporalAchievements(achievements, new Date()),
        });
      }
    }
  };

  updateHandler() {
    const { userId } = this.state;
    const selectedUserData = this.props.users.find((user) => user.publicId === userId);
    if (selectedUserData) {
      this.setState({ updating: true });
      updateUserAchievements(selectedUserData).then(
        (achievements) => {
          this.props.onFetchUsers();
          this.fetchUserAchievements();
          this.setState({ achievements, updating: false });
        },
        (error) => {
          console.warn(error);
          this.setState({ updating: false });
        },
      );
    }
  }

  updateAllHandler() {
    const updates = [];
    this.setState({ updating: true });
    this.props.users.forEach((userData) => {
      updates.push(updateUserAchievements(userData));
    });
    Promise.all(updates).then(() => {
      this.props.onFetchUsers();
      this.fetchUserAchievements();
      this.setState({ updating: false });
    });
  }

  render() {
    const { achievements: givenAchievements, translate } = this.props;
    const achievements = this.state.achievements || givenAchievements;
    const dailyData = getCategoryAchievementKeys(achievements, 'daily').map((achievementKey) =>
      getAchievement(achievements, achievementKey),
    );
    const weeklyData = getCategoryAchievementKeys(achievements, 'weekly').map((achievementKey) =>
      getAchievement(achievements, achievementKey),
    );
    const monthlyData = getCategoryAchievementKeys(achievements, 'monthly').map((achievementKey) =>
      getAchievement(achievements, achievementKey),
    );
    const progressData = getCategoryAchievementKeys(achievements, 'progress').map((achievementKey) =>
      getAchievement(achievements, achievementKey),
    );

    const { groupId } = this.state;
    const ranking = {
      daily: {
        top: false,
        bottom: false,
      },
      weekly: {
        top: false,
        bottom: false,
      },
      monthly: {
        top: false,
        bottom: false,
      },
    };
    if (groupId !== 'all-groups' && this.state.userAchievements) {
      const groupUsers = this.state.userAchievements.filter((user) => user.groupId === groupId);
      const calculateCategoryRanking = calculateRanking(achievements, groupUsers);
      ranking.daily = calculateCategoryRanking('daily');
      ranking.weekly = calculateCategoryRanking('weekly');
      ranking.monthly = calculateCategoryRanking('monthly');
    }

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

    const groupFilterInput = (
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
    );

    const userFilterInput = (
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
    );

    const groupAndUserFilterInput = (
      <>
        {this.props.isTeacher ? (
          <Form>
            <Form.Group widths="equal">
              {groupFilterInput}
              {userFilterInput}
            </Form.Group>
          </Form>
        ) : null}
      </>
    );

    const topMessage = (category) => (
      <Message positive>
        <Message.Header>
          {translate('achievements.ranking.top', { temporal: translate(`achievements.temporal.${category}`) })}
        </Message.Header>
      </Message>
    );

    const bottomMessage = (category) => (
      <Message warning>
        <Message.Header>
          {translate('achievements.ranking.bottom', { temporal: translate(`achievements.temporal.${category}`) })}
        </Message.Header>
      </Message>
    );

    return (
      <Container style={{ marginTop: '3vh' }}>
        <Header as="h2">{translate('achievements.title')}</Header>
        <p>{translate('achievements.description')}</p>
        {groupAndUserFilterInput}
        {this.props.isAdmin ? (
          <>
            <Button
              onClick={() => this.updateHandler()}
              loading={this.state.updating || this.props.usersStatus.loading}
            >
              Uuenda saavutusi
            </Button>
            <Button
              onClick={() => this.updateAllHandler()}
              loading={this.state.updating || this.props.usersStatus.loading}
            >
              Uuenda kõigi saavutusi
            </Button>
            <AchievementsTable users={this.props.users} userAchievements={this.state.userAchievements} />
          </>
        ) : null}
        <Segment>
          <h3>
            {translate('achievements.daily')}
            <span style={{ float: 'right' }}>
              {achievements.daily.points + achievements.daily.uniquePoints}
              <Icon name="star" color="yellow" style={{ margin: 0 }} />
            </span>
          </h3>
          {ranking.daily.top ? topMessage('daily') : null}
          {ranking.daily.bottom ? bottomMessage('daily') : null}
          <div className="flex-grid">
            {dailyData.map((achievementData) => (
              <AchievementProgress
                className="col"
                key={achievementData.achievementKey}
                achievementData={achievementData}
                translate={translate}
              />
            ))}
          </div>
        </Segment>
        <Segment>
          <h3>
            {translate('achievements.weekly')}
            <span style={{ float: 'right' }}>
              {achievements.weekly.points + achievements.weekly.uniquePoints}
              <Icon name="star" color="yellow" style={{ margin: 0 }} />
            </span>
          </h3>
          {ranking.weekly.top ? topMessage('weekly') : null}
          {ranking.weekly.bottom ? bottomMessage('weekly') : null}
          <div className="flex-grid">
            {weeklyData.map((achievementData) => (
              <AchievementProgress
                className="col"
                key={achievementData.achievementKey}
                achievementData={achievementData}
                translate={translate}
              />
            ))}
          </div>
        </Segment>
        <Segment>
          <h3>
            {translate('achievements.monthly')}
            <span style={{ float: 'right' }}>
              {achievements.monthly.points + achievements.monthly.uniquePoints}
              <Icon name="star" color="yellow" style={{ margin: 0 }} />
            </span>
          </h3>
          {ranking.monthly.top ? topMessage('monthly') : null}
          {ranking.monthly.bottom ? bottomMessage('monthly') : null}
          <div className="flex-grid">
            {monthlyData.map((achievementData) => (
              <AchievementProgress
                className="col"
                key={achievementData.achievementKey}
                achievementData={achievementData}
                translate={translate}
              />
            ))}
          </div>
        </Segment>
        <Segment>
          <h3>
            {translate('achievements.progress')}
            <span style={{ float: 'right' }}>
              &nbsp; {achievements.progress.points}
              <Icon name="star" color="yellow" style={{ margin: 0 }} />
            </span>
          </h3>
          <div className="flex-grid">
            {progressData.map((achievementData) => (
              <AchievementProgress
                className="col"
                key={achievementData.achievementKey}
                achievementData={achievementData}
                translate={translate}
              />
            ))}
          </div>
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.token !== null,
  isTeacher: rolePermissions[state.profile.role] >= rolePermissions.teacher || state.profile.role === 'statistician',
  isAdmin: rolePermissions[state.profile.role] >= rolePermissions.admin,
  groupId: state.profile.groupId,
  userId: state.auth.userId,
  usersStatus: state.user.usersStatus,
  users: state.user.users,
  groupsStatus: state.group.groupsStatus,
  groups: state.group.groups,
  achievements: state.profile.achievements,
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch) => ({
  onFetchUsers: () => {
    dispatch(actionCreators.fetchUsers());
  },
  onFetchGroups: () => {
    dispatch(actionCreators.fetchGroups());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Achievements);
