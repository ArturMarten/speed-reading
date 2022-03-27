import React, { useEffect, useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import { Grid, Button, Icon } from 'semantic-ui-react';

import { generateWordPairs } from '../../../store/reducers/exercise';
import { usePrevious } from '../../../utils/hooks';
import VisualVocabulary from '../Types/VisualVocabulary/VisualVocabulary';

const initialTimerState = {
  started: false,
  paused: false,
  resetted: false,
  stopped: false,
};

export default function VisualVocabularyPreview() {
  const [show, setShow] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [stringPairs, setStringPairs] = useState([]);
  const textOptions = useSelector((state) => state.options.textOptions);
  const exerciseOptions = useSelector((state) => state.options.exerciseOptions);
  const exerciseModification = useSelector((state) => state.exercise.modification);
  const translate = useSelector((state) => getTranslate(state.locale));
  const [timerState, setTimerState] = useState(initialTimerState);
  const [restarting, setRestarting] = useState(false);
  const previousRestarting = usePrevious(restarting);

  useEffect(() => {
    // Start exercise
    if (!timerState.started) {
      setTimerState({
        ...timerState,
        started: true,
      });
    }
  }, [timerState]);

  useEffect(() => {
    if (!previousRestarting && restarting) {
      setTimerState(initialTimerState);
      setRestarting(false);
    }
  }, [previousRestarting, restarting]);

  useEffect(() => {
    setStringPairs(generateWordPairs(exerciseOptions.symbolGroupCount, exerciseOptions.symbolCount));
  }, [exerciseOptions, exerciseModification]);

  function toggleShow() {
    const toggle = !show;
    setShow(toggle);
    setRestarting(toggle);
  }

  return (
    <Grid container centered>
      <Grid.Row style={{ paddingBottom: 0 }}>
        <Button basic fluid compact onClick={() => toggleShow()}>
          <Icon name={show ? 'chevron up' : 'chevron down'} style={{ opacity: 1 }} />
          {show ? translate('exercise-preview.hide') : translate('exercise-preview.show')}
        </Button>
      </Grid.Row>
      <Grid.Row style={{ marginBottom: '1em' }}>
        {!restarting && show ? (
          <VisualVocabulary
            exerciseOptions={exerciseOptions}
            textOptions={textOptions}
            stringPairs={stringPairs}
            answers={answers}
            setAnswers={setAnswers}
            timerState={timerState}
            onExerciseFinish={() => setRestarting(true)}
          />
        ) : null}
      </Grid.Row>
    </Grid>
  );
}
