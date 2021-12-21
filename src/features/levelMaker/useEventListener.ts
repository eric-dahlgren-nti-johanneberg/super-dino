import { RefObject, useEffect, useRef } from 'react';

function useEventListener<E, T extends HTMLElement = HTMLDivElement>(
  eventName: keyof WindowEventMap | string, // string to allow custom event
  handler: (event: E) => void,
  element?: RefObject<T | null>
) {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: E) => void>();

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      const ev = event as unknown as E;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(ev);
      }
    };

    targetElement.addEventListener(eventName, eventListener, { passive: true });

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, handler]);
}

export { useEventListener };
