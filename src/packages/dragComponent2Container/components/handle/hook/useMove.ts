import { RefObject, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateReticuleInfo, updateDragging } from '../../../store/slice';

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

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.addEventListener('mousedown', mousedown);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);

    return () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      ref.current?.removeEventListener('mousedown', mousedown);
    };
  }, []);

  function mousemove(e: MouseEvent) {
    if (!moving.current || !ref.current) {
      return;
    }

    const newTranslateX = startPosi.current.translateX + e.clientX - mouseStartPosi.current.x;
    const newTranslateY = startPosi.current.translateY + e.clientY - mouseStartPosi.current.y;
    ref.current.parentElement!.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
    dispatch(updateReticuleInfo({ x: newTranslateX, y: newTranslateY }));
  }
  function mouseup(e: MouseEvent) {
    moving.current = false;
    dispatch(updateDragging(false));
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  function mousedown(e: MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }
    moving.current = true;
    const style = getComputedStyle((e.currentTarget as HTMLElement).parentElement!);

    const [translateX, translateY] = style.transform
      .match(/(?<=matrix\().*(?=\))/)![0]
      .split(',')
      .slice(4);
    startPosi.current = { translateX: Number(translateX), translateY: Number(translateY) };

    mouseStartPosi.current = { x: e.clientX, y: e.clientY };
    dispatch(updateDragging(true));
  }
};

export default useMove;
