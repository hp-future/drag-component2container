import { RefObject, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getTranslate } from '../../../utils/util';
import { actions } from '../../../store/slice';
import { StateType } from '../../../store/state/types';

/**
 * 缩放
 */
const useResize = (ref: RefObject<HTMLDivElement>) => {
  const dispatch = useAppDispatch();
  const dragComponentDataState = useAppSelector((state) => state.dragComponent);
  const dragComponentData = useRef<StateType>(dragComponentDataState);
  useEffect(() => {
    dragComponentData.current = dragComponentDataState;
  }, [dragComponentDataState]);

  // 起始位置
  const mouseStartPosi = useRef({ x: 0, y: 0 });
  // 鼠标正在移动
  const mouseMmoving = useRef(false);
  // 缩放方向
  const scaleDirection = useRef('');
  // 初始大小
  const startSize = useRef({ width: 0, height: 0 });
  const startTransform = useRef({ translateX: 0, translateY: 0 });
  // 组件允许缩放的最小宽高
  const minWH = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const handleBoxDom = ref.current;
    if (!handleBoxDom) {
      return;
    }

    handleBoxDom.addEventListener('mouseup', mouseup, true);
    handleBoxDom.addEventListener('mousedown', mousedown, true);
    document.addEventListener('mousemove', mousemove, true);
    document.addEventListener('mouseup', mouseup, true);

    return () => {
      document.removeEventListener('mousemove', mousemove, true);
      document.removeEventListener('mouseup', mouseup, true);
      handleBoxDom?.removeEventListener('mouseup', mouseup, true);
      handleBoxDom?.removeEventListener('mousedown', mousedown, true);
    };
  }, []);

  /**
   * 鼠标左键按下事件
   */
  function mousedown(e: MouseEvent) {
    if (!(e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }

    if (e.button !== 0) {
      return;
    }

    // 开始移动
    mouseMmoving.current = true;
    // 鼠标移动前的起始位置
    mouseStartPosi.current = { x: e.clientX, y: e.clientY };

    const parentElement = (e.currentTarget as HTMLElement).parentElement!;
    // 初始大小
    startSize.current = { width: parentElement.clientWidth, height: parentElement.clientHeight };
    // 初始tanslate
    const [translateX, translateY] = getTranslate(parentElement);
    startTransform.current = { translateX, translateY };

    // 获得缩放手柄，记录缩放方向
    const handleName = (e.target as HTMLElement).getAttribute('handle-name');
    scaleDirection.current = handleName || '';

    // 组件允许缩放的最小宽高
    const { components, currentComponentId } = dragComponentData.current;
    const findCom = components.find((item) => item.id === currentComponentId);
    if (findCom) {
      minWH.current = { width: findCom.layout.minWidth, height: findCom.layout.minHeight };
    }
  }

  /**
   * 鼠标左键按下移动事件
   */
  function mousemove(e: MouseEvent) {
    if (!mouseMmoving.current || !ref.current) {
      return;
    }

    if (e.button !== 0) {
      return;
    }

    const xDiff = e.clientX - mouseStartPosi.current.x;
    const yDiff = e.clientY - mouseStartPosi.current.y;

    const { translateX, translateY } = startTransform.current;
    const { width, height } = startSize.current;
    const layout = {
      x: translateX,
      y: translateY,
      width,
      height,
    };

    switch (scaleDirection.current) {
      case 'top-left': {
        if (width - xDiff >= minWH.current.width) {
          layout.width = width - xDiff;
          layout.x = translateX + xDiff;
        }
        if (height - yDiff >= minWH.current.height) {
          layout.height = height - yDiff;
          layout.y = translateY + yDiff;
        }
        break;
      }
      case 'bottom-right': {        
        if (width + xDiff >= minWH.current.width) {
          layout.width = width + xDiff;
        }
        if (height + yDiff >= minWH.current.height) {
          layout.height = height + yDiff;
        }
        break;
      }
      case 'top-center': {
        if (width + xDiff >= minWH.current.width) {
          layout.width = width + xDiff;
        }
        if (height - yDiff >= minWH.current.height) {
          layout.height = height - yDiff;
          layout.y = translateY + yDiff;
        }
        break;
      }
      case 'bottom-center': {
        if (height + yDiff >= minWH.current.height) {
          layout.height = height + yDiff;
        }
        break;
      }
      case 'top-right': {
        if (width + xDiff >= minWH.current.width) {
          layout.width = width + xDiff;
        }
        if (height - yDiff >= minWH.current.height) {
          layout.height = height - yDiff;
          layout.y = translateY + yDiff;
        }
        break;
      }
      case 'bottom-left': {
        if (width - xDiff >= minWH.current.width) {
          layout.width = width - xDiff;
          layout.x = translateX + xDiff;
        }
        if (height + yDiff >= minWH.current.height) {
          layout.height = height + yDiff;
        }
        break;
      }
      case 'right-center': {
        if (width + xDiff >= minWH.current.width) {
          layout.width = width + xDiff;
        }
        break;
      }
      case 'left-center': {
        if (width - xDiff >= minWH.current.width) {
          layout.width = width - xDiff;
          layout.x = translateX + xDiff;
        }
        break;
      }
      default:
        break;
    }

    const { components, currentComponentId } = dragComponentData.current;
    const findCom = components.find((item) => item.id === currentComponentId)!;
    dispatch(actions.updateComponents({ ...findCom, layout: { ...findCom.layout, ...layout } }));
  }

  /**
   * 鼠标左键抬起事件
   */
  function mouseup(e: MouseEvent) {
    if (!mouseMmoving.current) {
      return;
    }
    if (e.button !== 0) {
      return;
    }

    mouseMmoving.current = false;

    dispatch(actions.addHistory());
  }
};

export default useResize;
