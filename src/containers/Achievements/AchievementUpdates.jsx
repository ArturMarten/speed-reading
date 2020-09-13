import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import AchievementProgress from '../../components/AchievementProgress/AchievementProgress';
import {
  calculateAchievements,
  checkTemporalAchievements,
  diffAchievements,
  getAchievementKeys,
  getAchievement,
} from './achievements';

export class AchievementUpdates extends Component {
  state = {
    achievements: null,
    achievementsDiff: null,
  };

  updateHandler() {
    const { achievements: givenAchievements, attempts } = this.props;
    const achievements = this.state.achievements || givenAchievements;
    let updatedAchievements = JSON.parse(JSON.stringify(achievements));
    console.log('before', updatedAchievements);
    if (attempts) {
      attempts.forEach((attempt) => {
        const newAchievements = calculateAchievements(updatedAchievements, attempts, attempt, false);
        updatedAchievements = newAchievements;
        // console.log(updatedAchievements);
      });
      const checkedAchievements = checkTemporalAchievements(updatedAchievements, new Date(), false);
      console.log('after', checkedAchievements);
      const achievementsDiff = diffAchievements(achievements, checkedAchievements);
      console.log('diff', achievementsDiff);
      this.setState({
        achievements: checkedAchievements,
        achievementsDiff,
      });
    }
  }

  render() {
    const { achievements: givenAchievements, achievementsDiff: givenAchievementsDiff, translate } = this.props;
    const achievements = this.state.achievements || givenAchievements;
    const achievementsDiff = this.state.achievementsDiff || givenAchievementsDiff;
    const achievementKeys = getAchievementKeys(achievementsDiff);
    const achievementsData = achievementKeys
      .map((achievementKey) => getAchievement(achievements, achievementKey))
      .sort((a, b) => {
        if (
          (a.percent > 100 && b.percent < 100) ||
          (a.achievementType === 'progress' && b.achievementType !== 'progress')
        ) {
          return 1;
        }
        if (
          (a.percent < 100 && b.percent > 100) ||
          (a.achievementType !== 'progress' && b.achievementType === 'progress')
        ) {
          return -1;
        }
        return b.percent - a.percent;
      });
    return (
      <>
        {/*
        <Button onClick={() => this.updateHandler()}>Uuenda saavutusi</Button>
        */}
        {achievementKeys.length > 0
          ? achievementsData.map((achievementData) => (
              <AchievementProgress
                key={achievementData.achievementKey}
                achievementData={achievementData}
                translate={translate}
              />
            ))
          : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
  achievements: state.profile.achievements,
  achievementsDiff: state.profile.achievementsDiff,
  attempts: state.statistics.exerciseStatistics,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AchievementUpdates);
