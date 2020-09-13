import React from 'react';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import { formatMillisecondsInHours } from '../shared/utility';
import { Achievements } from '../containers/Achievements/Achievements';
import { translate } from './utils';
import { checkTemporalAchievements } from '../containers/Achievements/achievements';

export default { title: 'Achievements' };

export const ProgressBarControls = (args) => <ProgressBar {...args} />;

ProgressBarControls.args = {
  min: 0,
  max: 100000000,
  value: 47000000,
  percent: 47,
  color: 'dodgerblue',
  formatter: formatMillisecondsInHours,
};

ProgressBarControls.argTypes = {
  min: { control: { type: 'range', min: 0, max: 100000000 } },
  max: { control: { type: 'range', min: 0, max: 100000000 } },
  value: { control: { type: 'range', min: 0, max: 100000000 } },
  percent: { control: { type: 'range', min: 0, max: 100 } },
  color: { control: 'color' },
  formatter: { disable: true },
};

const achievements = checkTemporalAchievements({
  points: 0,
  daily: {
    points: 0,
    uniquePoints: 0,
    date: null,
    exercise: {
      count: 0,
      time: 0,
    },
  },
  weekly: {
    points: 0,
    uniquePoints: 0,
    date: null,
    exercise: {
      count: 0,
      time: 0,
    },
  },
  monthly: {
    points: 0,
    uniquePoints: 0,
    date: null,
    exercise: {
      count: 0,
      time: 0,
    },
  },
  unique: {
    points: 0,
    readingTest: false,
  },
  progress: {
    points: 0,
    exercise: {
      count: 0,
      time: 0,
    },
    readingExercise: {
      count: 0,
      time: 0,
    },
    helpExercise: {
      count: 0,
      time: 0,
    },
    readingTest: {
      count: 0,
      time: 0,
    },
    readingAid: {
      count: 0,
      time: 0,
    },
    scrolling: {
      count: 0,
      time: 0,
    },
    disappearing: {
      count: 0,
      time: 0,
    },
    wordGroups: {
      count: 0,
      time: 0,
    },
    schulteTables: {
      count: 0,
      time: 0,
    },
    concentration: {
      count: 0,
      time: 0,
    },
  },
});

const setObjectValue = (object, key, value) => {
  const [property, ...properties] = key.split('.');
  if (object[property] !== undefined) {
    if (properties.length === 0) {
      object[property] = value; // eslint-disable-line no-param-reassign
      return object;
    }
    return setObjectValue(object[property], properties.join('.'), value);
  }
  return null;
};

export const AchievementsControls = ({ ...args }) => {
  const updatedAchievements = JSON.parse(JSON.stringify(achievements));
  Object.keys(args).forEach((key) => {
    setObjectValue(updatedAchievements, key, args[key]);
  });
  return <Achievements translate={translate} achievements={updatedAchievements} />;
};

AchievementsControls.args = {
  'progress.exercise.count': 23,
  'progress.exercise.time': 5325212,
  'progress.readingExercise.count': 16,
  'progress.readingExercise.time': 3152231,
  'progress.helpExercise.count': 7,
  'progress.helpExercise.time': 25236143,
};

AchievementsControls.argTypes = {
  'progress.exercise.count': { control: { type: 'range', min: 0, max: 1000 } },
  'progress.exercise.time': { control: { type: 'range', min: 0, max: 100000000 } },
  'progress.readingExercise.count': { control: { type: 'range', min: 0, max: 1000 } },
  'progress.readingExercise.time': { control: { type: 'range', min: 0, max: 100000000 } },
  'progress.helpExercise.count': { control: { type: 'range', min: 0, max: 1000 } },
  'progress.helpExercise.time': { control: { type: 'range', min: 0, max: 100000000 } },
};
