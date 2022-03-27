import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { useKeypress, usePrevious } from '../../../../utils/hooks';

const PAIR_FIRST = 'PAIR_FIRST';
const PAUSE = 'PAUSE';
const PAIR_SECOND = 'PAIR_SECOND';
const ANSWER = 'ANSWER';

export default function VisualVocabulary(props) {
  const timeoutRef = useRef();
  const [pairIndex, setPairIndex] = useState(0);
  const [pairState, setPairState] = useState(null);

  const stringPairs = useSelector((state) => props.stringPairs || state.exercise.stringPairs);
  const textOptions = useSelector((state) => props.textOptions || state.options.textOptions);
  const exerciseOptions = useSelector((state) => props.exerciseOptions || state.options.exerciseOptions);
  const previousTimerState = usePrevious(props.timerState);

  const PAUSE_TIME = 100; // in ms
  const ANSWER_TIME = 2000; // in ms

  function answerSelect(answer) {
    if (pairState === ANSWER) {
      props.setAnswers(Object.assign([...props.answers], { [pairIndex]: answer }));
    }
  }

  useKeypress('-', () => {
    answerSelect(false);
  });

  useKeypress('ArrowLeft', () => {
    answerSelect(false);
  });

  useKeypress('+', () => {
    answerSelect(true);
  });

  useKeypress('ArrowRight', () => {
    answerSelect(true);
  });

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (pairState === PAIR_FIRST) {
      timeoutRef.current = setTimeout(() => {
        setPairState(PAUSE);
      }, exerciseOptions.fixationTime);
    } else if (pairState === PAUSE) {
      timeoutRef.current = setTimeout(() => {
        setPairState(PAIR_SECOND);
      }, PAUSE_TIME);
    } else if (pairState === PAIR_SECOND) {
      timeoutRef.current = setTimeout(() => {
        setPairState(ANSWER);
      }, exerciseOptions.fixationTime);
    } else if (pairState === ANSWER) {
      timeoutRef.current = setTimeout(() => {
        if (pairIndex === stringPairs.length - 1) {
          props.onExerciseFinish();
        } else {
          setPairIndex(pairIndex + 1);
          setPairState(PAIR_FIRST);
        }
      }, ANSWER_TIME);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [pairState, exerciseOptions.fixationTime]);

  const delayedStart = useCallback((delay) => {
    timeoutRef.current = setTimeout(() => {
      setPairState(PAIR_FIRST);
    }, delay);
  }, []);

  useEffect(() => {
    if (previousTimerState) {
      if (
        (!previousTimerState.started && props.timerState.started) ||
        (previousTimerState.paused && !props.timerState.paused)
      ) {
        // Exercise started or resumed
        delayedStart(exerciseOptions.startDelay);
      } else if (!previousTimerState.resetted && props.timerState.resetted) {
        // Exercise resetted
        clearTimeout(timeoutRef.current);
        setPairIndex(0);
        setPairState(null);
        props.setAnswers([]);
      } else if (
        (!previousTimerState.stopped && props.timerState.stopped) ||
        (!previousTimerState.paused && props.timerState.paused)
      ) {
        // Exercise stopped
        clearTimeout(timeoutRef.current);
      } else {
        // Unknown
      }
    }
  }, [previousTimerState, props.timerState, delayedStart]);

  return (
    <>
      <div style={{ height: '100px' }}>&nbsp;</div>
      <div
        style={{
          fontSize: `${textOptions.fontSize / 0.75}px`,
          fontFamily: textOptions.font,
          userSelect: 'none',
          lineHeight: `${textOptions.fontSize / 0.75}px`,
          width: '100%',
          minHeight: `${textOptions.fontSize * 2}px`,
          position: 'relative',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center', height: `${textOptions.fontSize / 0.75}px` }}>
          {pairState === PAIR_FIRST ? stringPairs[pairIndex][0] : null}
          {pairState === PAIR_SECOND ? stringPairs[pairIndex][1] : null}
        </div>
        <div
          style={{
            background: 'greenyellow',
            height: `${textOptions.fontSize}px`,
            width: `${textOptions.fontSize}px`,
            borderRadius: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${textOptions.fontSize / 0.75}px`,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        ></div>
        <Button.Group
          size="tiny"
          style={{
            verticalAlign: 'middle',
            marginTop: `${textOptions.fontSize + 5}px`,
            transition: pairState === ANSWER ? `opacity ${ANSWER_TIME / 1000}s ease-in` : 'none',
            opacity: pairState === ANSWER ? '0%' : '100%',
          }}
        >
          <Button
            compact
            icon="minus"
            color={props.answers[pairIndex] === false ? 'red' : null}
            onClick={() => answerSelect(false)}
          />
          <Button
            compact
            icon="plus"
            color={props.answers[pairIndex] === true ? 'green' : null}
            onClick={() => answerSelect(true)}
          />
        </Button.Group>
      </div>
      <div style={{ height: '100px' }}>&nbsp;</div>
    </>
  );
}
