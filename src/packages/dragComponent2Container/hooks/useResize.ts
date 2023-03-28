import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateCurrentChart, updateData } from '../store/slice';

/**
 * 调整 chart 大小
 * @param showHandle    是否显示手柄
 */
const useResize = (showHandle: boolean) => {
  const currentChart = useAppSelector((state) => state.config.currentChart);
  const dispatch = useAppDispatch();
  let lineChartDom: HTMLElement | null = null;
  let handleName = '';
  let cursorInitPosition: number[] = [];

  function mouseDownEvent(e: React.MouseEvent) {
    if (!showHandle) return;
    lineChartDom = document.getElementById(currentChart.key);

    const name = (e.target as HTMLElement).getAttribute('data-handle-name');
    if (name) {
      handleName = name;
      cursorInitPosition = [e.clientX, e.clientY];
      document.addEventListener('mousemove', mouseMoveEvent);
      document.addEventListener('mouseup', mouseUpEvent);
    }
  }
  function mouseUpEvent(e: MouseEvent) {
    if (!showHandle) return;
    document.removeEventListener('mousemove', mouseMoveEvent);
    document.removeEventListener('mouseup', mouseUpEvent);
  }

  function mouseMoveEvent(e: MouseEvent) {
    const x = e.clientX - cursorInitPosition[0];
    const y = e.clientY - cursorInitPosition[1];

    const currentChartCopy = JSON.parse(JSON.stringify(currentChart));

    switch (handleName) {
      case 'top-left':
      case 'top-right':
      case 'bottom-left':
      case 'bottom-right':
        currentChartCopy.containerProps.width += x;
        currentChartCopy.containerProps.height += y;
        break;
      case 'top-center':
      case 'bottom-center':
        currentChartCopy.containerProps.height += y;
        break;
      default:
        currentChartCopy.containerProps.width += x;

        break;
    }
    dispatch(updateData(currentChartCopy));
  }

  return { mouseDownEvent };
};
export default useResize;
