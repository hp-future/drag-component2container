import { RefObject, useEffect, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import LineChart from '../components/charts/line';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateData } from '../store/slice';

/**
 * 自定义 hook，封装拖拽逻辑
 */
const useDrag = (asideRef: RefObject<HTMLElement>, mainRef: RefObject<HTMLElement>) => {
  const config = useAppSelector((state) => state.config);
  const dispatch = useAppDispatch();

  // 开始拖拽
  function dragStartEvent(e: React.DragEvent) {
    // console.log(e);
    const target = e.target as HTMLElement;
    e.dataTransfer!.setData('type', target.getAttribute('data-type')!);
  }
  // 拖拽到目标元素上方
  function dragOverEvent(e: React.DragEvent) {
    e.preventDefault();
  }
  // 在目标元素释放
  function dropEvent(e: React.DragEvent) {
    // console.log(e);
    const lineType = e.dataTransfer!.getData('type');

    dispatch(
      updateData({
        key: 'chart_' + config.data.length,
        containerProps: {
          width: 300,
          height: 150,
          backgroungColor: '#fff',
        },
        chartProps: {
          type: lineType,
        },
      })
    );
  }

  return {
    dragStartEvent,
    dragOverEvent,
    dropEvent,
  };
};

export default useDrag;
