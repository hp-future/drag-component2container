import { RefObject, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { actions } from '../../../store/slice';
import { getTranslate } from '../../../utils/util';

/**
 * 封装移动逻辑
 */
const useMove = (ref: RefObject<HTMLDivElement>) => {
  const dispatch = useAppDispatch();
  // 正在移动
  const moving = useRef(false);
  // 移动的位置（相对于布局区域）
  const startPosi = useRef({ translateX: 0, translateY: 0 });
  const mouseStartPosi = useRef({ x: 0, y: 0 });

  // 初始化绑定事件
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener('mousedown', mousedown, true);
    ref.current.addEventListener('mouseup', mouseup, true);
    document.addEventListener('mousemove', mousemove);

    return () => {
      document.removeEventListener('mousemove', mousemove);
      ref.current?.removeEventListener('mousedown', mousedown, true);
      ref.current?.removeEventListener('mouseup', mouseup, true);
    };
  }, []);

  function mousemove(e: MouseEvent) {
    if (!moving.current || !ref.current) {
      return;
    }

    const newTranslateX = startPosi.current.translateX + e.clientX - mouseStartPosi.current.x;
    const newTranslateY = startPosi.current.translateY + e.clientY - mouseStartPosi.current.y;
    ref.current.parentElement!.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
    dispatch(actions.updateReticuleInfo({ x: newTranslateX, y: newTranslateY }));
  }
  function mouseup(e: MouseEvent) {
    moving.current = false;
    dispatch(actions.updateDragging(false));

    // 更新组件的物理信息
    const parentEle = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    dispatch(actions.updateComponentsRect({ id: parentEle.id }));

    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  function mousedown(e: MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }

    moving.current = true;
    const [translateX, translateY] = getTranslate((e.currentTarget as HTMLElement).parentElement!);
    startPosi.current = { translateX, translateY };

    mouseStartPosi.current = { x: e.clientX, y: e.clientY };
    dispatch(actions.updateDragging(true));
  }
};

export default useMove;
