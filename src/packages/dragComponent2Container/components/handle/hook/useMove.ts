import { RefObject, useEffect, useRef } from 'react';
import useDropAreaResize from '../../../hooks/useDropAreaResize';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { actions } from '../../../store/slice';
import { StateType } from '../../../store/state/types';
import { getTranslate } from '../../../utils/util';

/**
 * 封装移动逻辑
 */
const useMove = (ref: RefObject<HTMLDivElement>) => {
  const dispatch = useAppDispatch();
  const dragComponentDataState = useAppSelector((state) => state.dragComponent);
  const dragComponentData = useRef<StateType>(dragComponentDataState);
  useEffect(() => {
    dragComponentData.current = dragComponentDataState;
  }, [dragComponentDataState]);

  // 鼠标正在移动
  const mouseMmoving = useRef(false);
  // 移动的位置（相对于布局区域）
  const startPosi = useRef({ translateX: 0, translateY: 0 });
  const mouseStartPosi = useRef({ x: 0, y: 0 });
  const posi = useRef({ x: 0, y: 0 });

  // 释放区域的大小
  const dropContainerInfo = useDropAreaResize();

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

  /**
   * 鼠标左键按下事件
   */
  function mousedown(e: MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }

    if (e.button !== 0) {
      return;
    }

    mouseMmoving.current = true;
    dispatch(actions.updateDragging(true));

    // 组件容器
    const comContainer = (e.currentTarget as HTMLElement).parentElement!;
    // 组件容器距离释放区域边界的距离
    const { translateX, translateY } = getTranslate(comContainer);

    // 起始位置
    startPosi.current = { translateX, translateY };
    mouseStartPosi.current = { x: e.clientX, y: e.clientY };

    // 更新十字标线坐标
    dispatch(actions.updateReticuleInfo({ x: translateX, y: translateY }));
    // 更新对齐线坐标
    dispatch(actions.updateAlignLineInfo({ x: null, y: null }));
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

    const { currentComponentId, components } = dragComponentData.current;
    const currentComponent = components.find((item) => item.id === currentComponentId)!;

    // 新的边界坐标
    let newTranslateX = startPosi.current.translateX + e.clientX - mouseStartPosi.current.x;
    let newTranslateY = startPosi.current.translateY + e.clientY - mouseStartPosi.current.y;

    // 边界碰撞
    // 碰撞左边界
    newTranslateX = newTranslateX <= 0 ? 0 : newTranslateX;
    // 碰撞上边界
    newTranslateY = newTranslateY <= 0 ? 0 : newTranslateY;
    // 碰撞右边界
    const { width } = currentComponent.layout;
    newTranslateX =
      width + newTranslateX >= dropContainerInfo.current.width
        ? dropContainerInfo.current.width - width
        : newTranslateX;

    const newTranslate = { x: newTranslateX, y: newTranslateY };

    // 更新十字标线坐标
    dispatch(actions.updateReticuleInfo(newTranslate));
    // 更新组件布局
    const findCom = components.find((item) => item.id === currentComponentId);
    if (findCom) {
      dispatch(actions.updateComponents({ ...findCom, layout: { ...findCom.layout, ...newTranslate } }));
    }
  }

  /**
   * 鼠标左键抬起事件
   */
  const mouseup = (e: MouseEvent) => {
    if ((e.target as HTMLElement).hasAttribute('handle-name')) {
      return;
    }

    if (e.button !== 0) {
      return;
    }
    mouseMmoving.current = false;

    const { components, currentComponentId, alignLineInfo } = dragComponentData.current;

    // 更新组件布局
    const findCom = components.find((item) => item.id === currentComponentId);
    if (findCom) {
      const x = alignLineInfo.x ? alignLineInfo.x : findCom.layout.x;
      const y = alignLineInfo.y ? alignLineInfo.y : findCom.layout.y;
      const newLayout = { ...findCom.layout, x: x <= 15 ? 0 : x, y: y <= 15 ? 0 : y };
      dispatch(actions.updateComponents({ ...findCom, layout: newLayout }));
    }

    dispatch(actions.updateDragging(false));
    dispatch(actions.addHistory());
  };
};

export default useMove;
