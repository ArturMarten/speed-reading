import React from 'react';
import { Icon } from 'semantic-ui-react';
import ProgressBar from '../ProgressBar/ProgressBar';
import { getAchievementData } from '../../containers/Achievements/achievements';

import './AchievementProgress.css';

function AchievementProgress(props) {
  const { achievementData, className, translate } = props;
  const {
    achievementKey,
    percent,
    progress,
    currentLevel,
    nextProgress,
    currentPoints,
    nextPoints,
    totalPoints,
  } = achievementData;
  const { achievementType, color, formatter, textFormatter } = getAchievementData(achievementKey);

  const formattedNextProgress = textFormatter ? textFormatter(nextProgress, translate) : nextProgress;
  const achievementCategoryKey = achievementKey.substring(achievementKey.indexOf('.') + 1);
  const temporalTranslated =
    achievementType !== 'progress' ? translate(`achievements.temporal.${achievementType}`) : '';

  return (
    <div className={`${className} achievement-progress`}>
      <div
        className="achievement-progress-level"
        style={{ backgroundColor: currentLevel > 0 ? color : 'rgb(243, 243, 243)' }}
      >
        {currentLevel > 0 ? (
          <>
            {achievementType === 'progress' ? (
              <div className="achievement-progress-level-text">{translate('achievements.level')}</div>
            ) : null}
            <div className="achievement-progress-level-number">
              {percent >= 100 && achievementType !== 'progress' ? '✓' : currentLevel}
            </div>
          </>
        ) : null}
      </div>
      <div className="achievement-progress-content">
        <div>
          {translate(`achievements.temporal.${achievementCategoryKey}`, {
            temporal: temporalTranslated,
            value: formattedNextProgress,
          })}
        </div>
        <ProgressBar
          min={0}
          percent={percent}
          max={nextProgress}
          value={progress}
          color={color}
          formatter={formatter}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {currentPoints} / {totalPoints}
            <Icon name="star" color="yellow" style={{ margin: 0 }} />
          </div>
          {nextPoints > 0 ? (
            <span>
              +{nextPoints}
              <Icon name="star" color="yellow" style={{ margin: 0 }} />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AchievementProgress;
