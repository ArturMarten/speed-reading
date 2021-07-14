import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePrevious } from '../../../../utils/hooks';

function HorizontalWordGroups(props) {
  const offscreenRef = useRef(null);
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

  const loop = () => {
    const time = performance.now();
    let newPage = false;
    let finished = false;
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const widthProgress = speedRef.current * deltaTime;
      // const widthProgress = 0;
      groupPositionRef.current += widthProgress;
      const group = wordGroups[groupIndexRef.current];
      if (groupPositionRef.current > group.text.length) {
        // New group
        setWordGroups((wordGroups) =>
          wordGroups.map((group, index) => (index === groupIndexRef.current ? { ...group } : group)),
        );
        groupPositionRef.current -= group.text.length;
        groupIndexRef.current += 1;
        const newGroup = wordGroups[groupIndexRef.current];
        if (!newGroup) {
          // Exercise finished
          finished = true;
        }
      }
    }
    previousTimeRef.current = time;
    if (newPage) {
      delayedLoop(exerciseOptions.pageBreakDelay);
    } else if (finished) {
      props.onExerciseFinish();
    } else {
      requestRef.current = requestAnimationFrame(loop);
    }
  };

  const delayedLoop = (delay) => {
    timeoutRef.current = setTimeout(() => {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(loop);
    }, delay);
  };

  React.useEffect(() => {
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
  }, [props.timerState]);

  useEffect(() => {
    const wordCount = props.wordGroups.reduce((acc, group) => acc + group.length, 0);
    const totalTime = Math.round((wordCount / speedOptions.wordsPerMinute) * 60 * 1000);
    // const totalWidth = children.reduce((acc, child) => acc + child.children[0].offsetWidth, 0);
    const totalCharacterCount = props.wordGroups.reduce((acc, group) => acc + group.join(' ').length, 0);
    speedRef.current = totalCharacterCount / totalTime;
    const node = [...offscreenRef.current.childNodes][0];
    const children = [...node.childNodes];
    // console.log('totalCharacterCount', totalCharacterCount);
    let margin = 0;
    const wordGroups = props.wordGroups.map((wordGroup, index) => {
      const groupElement = children[index];
      const translateX = margin + props.canvasWidth / 2 - groupElement.offsetWidth / 2;
      margin -= groupElement.offsetWidth;
      return {
        translateX,
        text: wordGroup.join(' '),
      };
    });
    setWordGroups(wordGroups);
  }, [props.wordGroups, props.canvasHeight]);

  useEffect(() => {
    if (previousWordPerMinute) {
      const change = speedOptions.wordsPerMinute / previousWordPerMinute;
      speedRef.current = speedRef.current * change;
    }
  }, [speedOptions.wordsPerMinute]);

  const group = wordGroups[groupIndexRef.current];

  return (
    <>
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
            <span key={`${index} ${wordGroup.join(' ')}`}>{wordGroup.join(' ')}&nbsp;</span>
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
        <div style={{ transform: `translateX(${group ? group.translateX : 0}px)` }}>
          {wordGroups.map((wordGroup, index) => (
            <span
              key={`${index} ${wordGroup.text}`}
              style={{ color: groupIndexRef.current === index ? 'black' : 'gray' }}
            >
              {wordGroup.text}&nbsp;
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default HorizontalWordGroups;
