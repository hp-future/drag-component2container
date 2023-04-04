import { RefObject, useEffect, useState } from 'react';

const useResizeChange = (ref: RefObject<HTMLDivElement>) => {
  const [rect, setRect] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
        const target = entries[0].target;
        setRect({ width: target.clientWidth, height: target.clientHeight });
      });
      resizeObserver.observe(ref.current);
    }
  }, []);

  return rect;
};

export default useResizeChange;
