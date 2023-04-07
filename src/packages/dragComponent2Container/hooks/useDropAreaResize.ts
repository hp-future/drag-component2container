import { useEffect, useRef } from 'react';

/**
 * 拖拽释放区域 四条边界距离屏幕左侧的距离
 */
const useDropAreaResize = () => {
  const dropAreaBoundary = useRef({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 });

  useEffect(() => {
    const dropContainer = document.getElementById('dropContainer');
    if (!dropContainer) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[], observer: ResizeObserver) => {
      const target = entries[0].target;

      const { left, top, width, height } = target!.getBoundingClientRect();
      dropAreaBoundary.current = { left, top, right: left + width, bottom: top + height, width, height };
    });
    resizeObserver.observe(dropContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return dropAreaBoundary;
};

export default useDropAreaResize;
