import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useEvent, useKeypress, usePrevious } from '../../../../utils/hooks';

function VerticalReading(props) {
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
  const [pageIndex, setPageIndex] = useState(0);
  const [wordGroups, setWordGroups] = useState([]);
  const [maxWidth, setMaxWidth] = useState(0);

  useKeypress('ArrowRight', (event) => {
    if (speedOptions.manualMode) {
      event.preventDefault();
      nextGroup();
    }
  });

  useKeypress('Space', (event) => {
    if (speedOptions.manualMode) {
      event.preventDefault();
      nextGroup();
    }
  });

  useEvent('touchend', () => {
    if (speedOptions.manualMode) {
      nextGroup();
    }
  });

  const nextGroup = () => {
    const currentGroup = wordGroups[groupIndexRef.current];
    let finished = false;
    let newPage = false;
    setWordGroups((wordGroups) =>
      wordGroups.map((group, index) => (index === groupIndexRef.current ? { ...group, read: true } : group)),
    );
    groupIndexRef.current += 1;
    const newGroup = wordGroups[groupIndexRef.current];
    if (!newGroup) {
      // Exercise finished
      finished = true;
      props.onExerciseFinish();
    } else if (currentGroup.pageIndex !== newGroup.pageIndex) {
      // New page
      newPage = true;
      setPageIndex(newGroup.pageIndex);
    }
    return { finished, newPage };
  };

  const loop = useCallback(() => {
    if (speedOptions.manualMode || wordGroups.length === 0) {
      return;
    }
    const time = performance.now();
    let newPage = false;
    let finished = false;
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      const widthProgress = speedRef.current * deltaTime;
      groupPositionRef.current += widthProgress;
      const group = wordGroups[groupIndexRef.current];
      if (groupPositionRef.current >= group.text.length) {
        groupPositionRef.current -= group.text.length;
        ({ finished, newPage } = nextGroup());
      }
    }
    previousTimeRef.current = time;
    if (newPage) {
      delayedLoop(exerciseOptions.pageBreakDelay);
    } else if (!finished) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [exerciseOptions.pageBreakDelay, wordGroups, speedOptions.manualMode]);

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
  }, [speedOptions.manualMode]);

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
        setPageIndex(0);
        setWordGroups((wordGroups) => wordGroups.map((group) => ({ ...group, read: false })));
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
    const children = [...offscreenRef.current.childNodes];

    const wordCount = props.wordGroups.reduce((acc, group) => acc + group.length, 0);
    const totalTime = Math.round((wordCount / speedOptions.wordsPerMinute) * 60 * 1000);
    const totalCharacterCount = props.wordGroups.reduce((acc, group) => acc + group.join(' ').length, 0);
    speedRef.current = totalCharacterCount / totalTime;

    const marginTop = children[0].offsetTop;
    let pageMargin = 0;
    let pageIndex = 0;
    let maxWidth = 0;
    const wordGroups = props.wordGroups.map((wordGroup, index) => {
      const groupElement = children[index];
      maxWidth = Math.max(maxWidth, groupElement.children[0].offsetWidth);
      if (groupElement.offsetTop - marginTop - pageMargin + groupElement.offsetHeight > props.canvasHeight) {
        pageIndex += 1;
        pageMargin = groupElement.offsetTop;
      }
      return {
        text: wordGroup.join(' '),
        pageIndex,
        read: false,
      };
    });
    setWordGroups(wordGroups);
    setMaxWidth(maxWidth + 1);
  }, [props.wordGroups, props.canvasHeight]);

  useEffect(() => {
    if (previousWordPerMinute) {
      const change = speedOptions.wordsPerMinute / previousWordPerMinute;
      speedRef.current = speedRef.current * change;
    }
  }, [speedOptions.wordsPerMinute]);

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
        }}
      >
        {props.wordGroups.map((wordGroup, index) => (
          <div key={`${index} ${wordGroup.join(' ')}`}>
            <span>{wordGroup.join(' ')}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          width: props.canvasWidth,
          height: props.canvasHeight,
          fontSize: `${textOptions.fontSize / 0.75}px`,
          fontFamily: textOptions.font,
          userSelect: 'none',
          lineHeight: `${textOptions.fontSize / 0.75}px`,
        }}
      >
        {wordGroups
          .filter((wordGroup) => wordGroup.pageIndex === pageIndex)
          .map((wordGroup, index) => (
            <div
              key={`${index} ${wordGroup.text}`}
              style={{
                visibility: wordGroup.read ? 'hidden' : 'visible',
                width: maxWidth,
                margin: '0 auto',
                textAlign: 'left',
              }}
            >
              <span>{wordGroup.text}</span>
            </div>
          ))}
      </div>
    </>
  );
}

export default VerticalReading;
