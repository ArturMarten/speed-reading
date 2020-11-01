import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
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

  const achievementBadge =
    achievementType === 'progress' ? (
      <Popup
        content={translate('achievements.progress-badge')}
        position="top center"
        trigger={
          <div
            className="achievement-progress-level"
            style={{ backgroundColor: currentLevel > 0 ? color : 'rgb(243, 243, 243)' }}
          >
            {currentLevel > 0 ? (
              <>
                <div className="achievement-progress-level-text">{translate('achievements.level')}</div>
                <div className="achievement-progress-level-number">{currentLevel}</div>
              </>
            ) : null}
          </div>
        }
      />
    ) : (
      <div
        className="achievement-progress-level"
        style={{ backgroundColor: currentLevel > 0 ? color : 'rgb(243, 243, 243)' }}
      >
        {currentLevel > 0 ? (
          <div className="achievement-progress-level-number">{percent >= 100 ? '✓' : null}</div>
        ) : null}
      </div>
    );

  return (
    <div className={`${className} achievement-progress`}>
      {achievementBadge}
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
          <Popup
            content={translate('achievements.current-and-total-points')}
            position="top center"
            trigger={
              <div>
                {currentPoints} / {totalPoints}
                <Icon name="star" color="yellow" style={{ margin: 0 }} />
              </div>
            }
          />
          {nextPoints > 0 ? (
            <Popup
              content={translate('achievements.next-points')}
              position="top center"
              trigger={
                <span>
                  +{nextPoints}
                  <Icon name="star" color="yellow" style={{ margin: 0 }} />
                </span>
              }
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AchievementProgress;
