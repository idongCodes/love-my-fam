import { useCallback, useRef, useState } from 'react';

export default function useLongPress(
  onLongPress: () => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 500 } = {}
) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>(undefined);
  const target = useRef<EventTarget>(undefined);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (_event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      
      // If the timer didn't finish (it wasn't a long press), trigger the normal click
      if (shouldTriggerClick && !longPressTriggered) {
        onClick();
      }
      
      setLongPressTriggered(false);
      target.current = undefined;
    },
    [onClick, longPressTriggered] // <--- FIXED: Removed 'shouldTriggerClick' from here
  );

  return {
    onMouseDown: (e: any) => start(e),
    onTouchStart: (e: any) => start(e),
    onMouseUp: (e: any) => clear(e),
    onMouseLeave: (e: any) => clear(e, false),
    onTouchEnd: (e: any) => clear(e)
  };
}