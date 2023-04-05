import { RefObject, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { actions } from '../../../store/slice';
import { StateType } from '../../../store/state/types';
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
  const posi = useRef({ x: 0, y: 0 });
  const dragComponentDataRef = useRef<StateType>();

  useAppSelector((state) => {
    dragComponentDataRef.current = state.dragComponent;
    return state.dragComponent;
  });

  // 初始化绑定事件
  useEffect(() => {
    const handleBoxDom = ref.current;

    if (!handleBoxDom) {
      return;
    }

    handleBoxDom.addEventListener('mousedown', mousedown, true);
    handleBoxDom.addEventListener('mouseup', mouseup, true);
    document.addEventListener('mousemove', mousemove, true);

    return () => {
      document.removeEventListener('mousemove', mousemove, true);
      handleBoxDom?.removeEventListener('mousedown', mousedown, true);
      handleBoxDom?.removeEventListener('mouseup', mouseup, true);
    };
  }, []);

  function mousemove(e: MouseEvent) {
    if (!moving.current || !ref.current) {
      return;
    }

    const newTranslateX = startPosi.current.translateX + e.clientX - mouseStartPosi.current.x;
    const newTranslateY = startPosi.current.translateY + e.clientY - mouseStartPosi.current.y;
    // ref.current.parentElement!.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
    posi.current = { x: newTranslateX, y: newTranslateY };
    dispatch(actions.updateReticuleInfo(posi.current));
    const { currentComponentId, alignLineInfo, components } = dragComponentDataRef.current!;

    const findCom = components.find((item) => item.id === currentComponentId);
    if (findCom) {
      dispatch(actions.updateComponents({ ...findCom, layout: posi.current }));
    }
  }
  const mouseup = (e: MouseEvent) => {
    if ((e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }

    moving.current = false;
    dispatch(actions.updateDragging(false));

    const { currentComponentId, alignLineInfo, components } = dragComponentDataRef.current!;

    const findCom = components.find((item) => item.id === currentComponentId);

    const newPosi = { ...posi.current };
    if (alignLineInfo.x !== null && alignLineInfo.x !== undefined) {
      newPosi.x = alignLineInfo.x;
    }
    if (alignLineInfo.y !== null && alignLineInfo.y !== undefined) {
      newPosi.y = alignLineInfo.y;
    }

    if (findCom) {
      dispatch(actions.updateComponents({ ...findCom, layout: newPosi }));
    }

    // 更新组件的物理信息
    const parentEle = (e.currentTarget as HTMLElement).parentElement as HTMLElement;
    dispatch(actions.updateComponentsRect({ id: parentEle.id }));

    e.stopPropagation();
    e.stopImmediatePropagation();
  };

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
