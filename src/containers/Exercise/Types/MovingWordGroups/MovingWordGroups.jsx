import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useEvent, useKeypress, usePrevious } from '../../../../utils/hooks';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function MovingWordGroups(props) {
  const offscreenRef = useRef(null);
  const alphabetRef = useRef(null);
  const timeoutRef = useRef();
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const speedRef = useRef(0);
  const groupIndexRef = useRef(0);
  const groupPositionRef = useRef(0);

  const textOptions = useSelector((state) => state.options.textOptions);
  const exerciseOptions = useSelector((state) => state.options.exerciseOptions);
  const speedOptions = useSelector((state) => state.options.speedOptions);

  const previousWordPerMinute = usePrevious(speedOptions.wordsPerMinute);
  const previousTimerState = usePrevious(props.timerState);
  const [wordGroups, setWordGroups] = useState([]);
  const [averageCharacterWidth, setAverageCharacterWidth] = useState(0);
  const [fixatorPosition, setFixatorPosition] = useState(0);

  useKeypress('ArrowRight', () => {
    if (speedOptions.manualMode) {
      nextGroup();
    }
  });

  useKeypress('Space', () => {
    if (speedOptions.manualMode) {
      nextGroup();
    }
  });

  useEvent('touchend', () => {
    if (speedOptions.manualMode) {
      nextGroup();
    }
  });

  const nextGroup = () => {
    // New group
    let finished = false;
    setWordGroups((wordGroups) =>
      wordGroups.map((group, index) => (index === groupIndexRef.current ? { ...group } : group)),
    );
    groupIndexRef.current += 1;
    const newGroup = wordGroups[groupIndexRef.current];
    if (!newGroup) {
      // Exercise finished
      finished = true;
      props.onExerciseFinish();
    }
    return { finished };
  };

  const loop = useCallback(() => {
    if (speedOptions.manualMode || wordGroups.length === 0) {
      return;
    }
    const time = performance.now();
    let finished = false;
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const widthProgress = speedRef.current * deltaTime;
      groupPositionRef.current += widthProgress;
      const group = wordGroups[groupIndexRef.current];
      if (groupPositionRef.current >= group.text.length) {
        groupPositionRef.current -= group.text.length;
        ({ finished } = nextGroup());
      }
    }
    previousTimeRef.current = time;
    if (!finished) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [wordGroups, speedOptions.manualMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const delayedLoop = useCallback(
    (delay) => {
      timeoutRef.current = setTimeout(() => {
        previousTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(loop);
      }, delay);
    },
    [loop],
  );

  useEffect(() => {
    if (speedOptions.manualMode) {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(requestRef.current);
    } else if (!props.timerState.stopped && !props.timerState.paused) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(requestRef.current);
    };
  }, [speedOptions.manualMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (previousTimerState) {
      if (
        (!previousTimerState.started && props.timerState.started) ||
        (previousTimerState.paused && !props.timerState.paused)
      ) {
        // Exercise started or resumed
        delayedLoop(exerciseOptions.startDelay);
      } else if (!previousTimerState.resetted && props.timerState.resetted) {
        // Exercise resetted
        clearTimeout(timeoutRef.current);
        cancelAnimationFrame(requestRef.current);
        groupIndexRef.current = 0;
        groupPositionRef.current = 0;
        setWordGroups((wordGroups) => wordGroups.map((group) => ({ ...group })));
      } else if (
        (!previousTimerState.stopped && props.timerState.stopped) ||
        (!previousTimerState.paused && props.timerState.paused)
      ) {
        // Exercise stopped or paused
        clearTimeout(timeoutRef.current);
        cancelAnimationFrame(requestRef.current);
      }
    }
    return () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(requestRef.current);
    };
  }, [props.timerState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const wordCount = props.wordGroups.reduce((acc, group) => acc + group.length, 0);
    const totalTime = Math.round((wordCount / speedOptions.wordsPerMinute) * 60 * 1000);
    const totalCharacterCount = props.wordGroups.reduce((acc, group) => acc + group.join(' ').length, 0);
    speedRef.current = totalCharacterCount / totalTime;
    const node = [...offscreenRef.current.childNodes][0];
    const children = [...node.childNodes];
    let maxWidth = 0;
    props.wordGroups.forEach((_, index) => {
      const groupElement = children[index];
      maxWidth = Math.max(maxWidth, groupElement.offsetWidth);
    });
    const averageCharacterWidth = alphabetRef.current.children[0].offsetWidth / ALPHABET.length;
    const fixatorPosition = props.canvasWidth / 2 - maxWidth / 2 + 5 * averageCharacterWidth;
    let margin = 0;
    const wordGroups = props.wordGroups.map((wordGroup, index) => {
      const groupElement = children[index];
      const translateX = margin + props.canvasWidth / 2 - maxWidth / 2;
      margin -= groupElement.offsetWidth;
      return {
        translateX,
        text: wordGroup.join(' '),
      };
    });
    setWordGroups(wordGroups);
    setAverageCharacterWidth(averageCharacterWidth);
    setFixatorPosition(fixatorPosition);
  }, [props.wordGroups, props.canvasHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (previousWordPerMinute) {
      const change = speedOptions.wordsPerMinute / previousWordPerMinute;
      speedRef.current = speedRef.current * change;
    }
  }, [speedOptions.wordsPerMinute]); // eslint-disable-line react-hooks/exhaustive-deps

  const group = wordGroups[groupIndexRef.current];

  return (
    <>
      <div
        ref={alphabetRef}
        style={{
          visibility: 'hidden',
          width: props.canvasWidth,
          height: 0,
          fontSize: `${textOptions.fontSize / 0.75}px`,
          fontFamily: textOptions.font,
          lineHeight: `${textOptions.fontSize / 0.75}px`,
          whiteSpace: 'pre',
          overflow: 'hidden',
        }}
      >
        <span>{ALPHABET}</span>
      </div>
      <div
        ref={offscreenRef}
        style={{
          visibility: 'hidden',
          width: props.canvasWidth,
          height: 0,
          fontSize: `${textOptions.fontSize / 0.75}px`,
          fontFamily: textOptions.font,
          userSelect: 'none',
          lineHeight: `${textOptions.fontSize / 0.75}px`,
          whiteSpace: 'pre',
          overflow: 'hidden',
        }}
      >
        <div>
          {props.wordGroups.map((wordGroup, index) => (
            <span key={`${index} ${wordGroup.join(' ')}`} style={{ marginRight: `${averageCharacterWidth * 5}px` }}>
              {wordGroup.join(' ')}&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          width: props.canvasWidth,
          height: props.canvasHeight,
          fontSize: `${textOptions.fontSize / 0.75}px`,
          fontFamily: textOptions.font,
          userSelect: 'none',
          lineHeight: `${textOptions.fontSize / 0.75}px`,
          whiteSpace: 'pre',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            transform: `translateX(${fixatorPosition}px) translateY(${averageCharacterWidth}px)`,
            background: 'greenyellow',
            height: averageCharacterWidth,
            width: averageCharacterWidth,
            borderRadius: '100%',
            flex: '0 0 auto',
          }}
        ></div>
        <div style={{ transform: `translateX(${group ? group.translateX : 0}px)` }}>
          {wordGroups.map((wordGroup, index) => (
            <span
              key={`${index} ${wordGroup.text}`}
              style={{ color: groupIndexRef.current === index ? 'black' : 'gray' }}
            >
              {wordGroup.text}&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default MovingWordGroups;
