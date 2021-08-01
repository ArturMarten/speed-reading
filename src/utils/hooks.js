import { useRef, useEffect } from 'react';

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useKeypress(key, action) {
  useEffect(() => {
    function onKeyup(event) {
      if (event.key === key || event.code === key) action(event);
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, [key, action]);
}

export function useEvent(event, action) {
  useEffect(() => {
    function onEvent(event) {
      action(event);
    }
    window.addEventListener(event, onEvent);
    return () => window.removeEventListener(event, onEvent);
  }, [event, action]);
}
