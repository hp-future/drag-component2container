import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { actions } from '../store/slice';

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
  // 正在拖拽
  const dragging = useRef(false);
  // 组件类型
  const componentType = useRef('');
  // 标线信息
  const reticuleInfo = useRef({ x: 0, y: 0 });

  // 开始拖拽
  function dragStartEvent(e: DragEvent) {
    dispatch(actions.updateDragging(true));
    const target = e.target as HTMLElement;
    componentType.current = target.getAttribute('data-type')!;

    // 鼠标在元素内的点击位置
    const x = e.clientX - target.getBoundingClientRect().left;
    const y = e.clientY - target.getBoundingClientRect().top;
    dragStartInfo.current = { x, y, width: target.clientWidth, height: target.clientHeight };

    // 开始拖拽
    dragging.current = true;

    dispatch(actions.updateCurrentComponentId({ id: '' }));
  }

  // 在目标区域内移动
  function dragoverEvent(e: DragEvent) {
    e.preventDefault();

    const currentTarget = e.currentTarget as HTMLElement;

    // 计算在目标区域内，鼠标的相对位置
    const mouseX = e.clientX - currentTarget.getBoundingClientRect().left;
    const mouseY = e.clientY - currentTarget.getBoundingClientRect().top;

    // 更新标线信息
    const y = mouseY - dragStartInfo.current.y - 1;
    const x = mouseX - dragStartInfo.current.x - 1;
    dispatch(actions.updateReticuleInfo({ x, y }));
    reticuleInfo.current = { y, x };
  }

  // 在目标区域释放
  function dropEvent(e: DragEvent) {
    if (!(e.target as HTMLElement).hasAttribute('data-drop-container')) {
      return;
    }

    dragging.current = false;
    dispatch(actions.updateDragging(false));

    const id = 'chart_' + Date.now();
    dispatch(
      actions.addComponents({
        id,
        type: componentType.current,
        layout: { ...reticuleInfo.current },
      })
    );
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      dispatch(actions.updateComponentsRect({ id }));
    }, 0);
  }

  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.ondragstart = dragStartEvent;
      asideRef.current.onmouseup = () => {
        dragging.current = false;
        dispatch(actions.updateDragging(false));
      };
    }
    if (mainRef.current) {
      mainRef.current.ondragover = dragoverEvent;
      mainRef.current.ondrop = dropEvent;

      mainRef.current.ondragenter = (e: DragEvent) => {
        if (!(e.target as HTMLElement).hasAttribute('data-drop-container')) {
          return;
        }
        dragging.current = true;
        dispatch(actions.updateDragging(true));
      };
      mainRef.current.ondragleave = (e: DragEvent) => {
        if (reticuleInfo.current.x > 0) {
          return;
        }
        dragging.current = false;
        dispatch(actions.updateDragging(false));
      };
    }
  }, []);

  return { asideRef, mainRef };
};

export default useDrag;
