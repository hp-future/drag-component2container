import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { actions } from '../store/slice';
import { StateType } from '../store/state/types';

let timeId: number | undefined;

/**
 * 自定义 hook，封装拖拽逻辑
 */
const useDrag = () => {
  const dispatch = useAppDispatch();
  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  // 拖拽全程中的数据
  const dragStartInfo = useRef({ x: 0, y: 0, width: 0, height: 0 });
  // 标线信息
  const reticuleInfo = useRef({ x: 0, y: 0 });

  const dragComponentDataRef = useRef<StateType>();
  useAppSelector((state) => {
    dragComponentDataRef.current = state.dragComponent;
    return state.dragComponent;
  });

  // 开始拖拽
  function dragStartEvent(e: DragEvent) {
    const target = e.target as HTMLElement;
    // 传递拖拽信息
    e.dataTransfer?.setData('type', target.getAttribute('data-type')!);

    // 鼠标在元素内的点击位置
    const x = e.clientX - target.getBoundingClientRect().left;
    const y = e.clientY - target.getBoundingClientRect().top;
    dragStartInfo.current = { x, y, width: target.clientWidth, height: target.clientHeight };

    dispatch(actions.updateCurrentComponentId({ id: '' }));
  }

  // 鼠标抬起
  function mouseUpEvent(e: MouseEvent) {
    dispatch(actions.updateDragging(false));
  }

  // 进入目标区域
  function dragEnterEvent(e: DragEvent) {
    if ((e.target as HTMLElement).hasAttribute('data-drop-container')) {
      dispatch(actions.updateDragging(true));
      return;
    }
  }

  // 离开目标区域
  function dragLeaveEvent(e: DragEvent) {
    if ((e.target as HTMLElement).hasAttribute('data-drop-container')) {
      dispatch(actions.updateDragging(false));
      return;
    }
  }

  // 在目标区域内移动
  function dragoverEvent(e: DragEvent) {
    e.preventDefault();

    const currentTarget = e.currentTarget as HTMLElement;

    // 计算在目标区域内，鼠标的相对位置
    const mouseX = e.clientX - currentTarget.getBoundingClientRect().left;
    const mouseY = e.clientY - currentTarget.getBoundingClientRect().top;

    // 更新标线位置信息
    const y = mouseY - dragStartInfo.current.y;
    const x = mouseX - dragStartInfo.current.x;
    reticuleInfo.current = { y, x };

    dispatch(actions.updateReticuleInfo(reticuleInfo.current));
  }

  // 在目标区域释放
  function dropEvent(e: DragEvent) {
    if (!(e.target as HTMLElement).hasAttribute('data-drop-container')) {
      return;
    }

    dispatch(actions.updateDragging(false));

    const id = 'chart_' + Date.now();

    const { alignLineInfo } = dragComponentDataRef.current!;
    const newPosi = { ...reticuleInfo.current };
    if (alignLineInfo.x !== null && alignLineInfo.x !== undefined) {
      newPosi.x = alignLineInfo.x;
    }
    if (alignLineInfo.y !== null && alignLineInfo.y !== undefined) {
      newPosi.y = alignLineInfo.y;
    }

    dispatch(
      actions.addComponents({
        id,
        type: e.dataTransfer?.getData('type')!,
        layout: { ...newPosi },
      })
    );
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      dispatch(actions.updateComponentsRect({ id }));
    }, 0);
  }

  // 初始化注册事件
  useEffect(() => {
    const asideDom = asideRef.current;
    if (asideDom) {
      asideDom.addEventListener('dragstart', dragStartEvent, true);
      asideDom.addEventListener('mouseup', mouseUpEvent, true);
    }

    const mainDom = mainRef.current;
    if (mainDom) {
      mainDom.addEventListener('dragover', dragoverEvent, true);
      mainDom.addEventListener('drop', dropEvent, true);
      mainDom.addEventListener('dragenter', dragEnterEvent, true);
      mainDom.addEventListener('dragleave', dragLeaveEvent, true);
    }

    return () => {
      asideDom?.removeEventListener('dragstart', dragStartEvent, true);
      asideDom?.removeEventListener('mouseup', mouseUpEvent, true);

      mainDom?.removeEventListener('dragover', dragoverEvent, true);
      mainDom?.removeEventListener('drop', dropEvent, true);
      mainDom?.removeEventListener('dragenter', dragEnterEvent, true);
      mainDom?.removeEventListener('dragleave', dragLeaveEvent, true);
    };
  }, []);

  return { asideRef, mainRef };
};

export default useDrag;
