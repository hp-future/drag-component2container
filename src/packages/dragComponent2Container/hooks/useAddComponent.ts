import { RefObject, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { actions } from '../store/slice';
import { StateType } from '../store/state/types';
import { getWHByType } from '../utils/util';

/**
 * 添加组件
 */
const useAddComponent = (asideRef: RefObject<HTMLElement>, mainRef: RefObject<HTMLElement>) => {
  const dispatch = useAppDispatch();
  const dragComponentDataState = useAppSelector((state) => state.dragComponent);
  const dragComponentData = useRef<StateType>(dragComponentDataState);
  useEffect(() => {
    dragComponentData.current = dragComponentDataState;
  }, [dragComponentDataState]);

  // 拖拽过程中的共享数据
  const dragInfo = useRef({
    // 鼠标在被拖拽的元素中的位置
    mouseInTarget: { x: 0, y: 0 },
    // 鼠标在目标区域中的相对位置
    mouseInDropTarget: { x: 0, y: 0 },
    // 组件类型
    type: '',
  });

  // 始化事件
  useEffect(() => {
    const asideDom = asideRef.current;
    const mainDom = mainRef.current;

    asideDom?.addEventListener('dragstart', onDragStart);
    mainDom?.addEventListener('dragenter', onDragEnter);
    mainDom?.addEventListener('dragover', onDragOver);
    mainDom?.addEventListener('drop', onDrop);
    mainDom?.addEventListener('dragleave', onDragLeave);
    document.addEventListener('mouseup', mouseup);

    return () => {
      asideDom?.removeEventListener('dragstart', onDragStart);
      mainDom?.removeEventListener('dragenter', onDragEnter);
      mainDom?.removeEventListener('dragover', onDragOver);
      mainDom?.removeEventListener('drop', onDrop);
      mainDom?.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('mouseup', mouseup);
    };
  }, []);

  function mouseup() {
    dispatch(actions.updateDragging(false));
  }

  // 开始拖拽
  function onDragStart(e: DragEvent) {
    // 被拖拽的元素
    const dragTarget = e.target as HTMLElement;
    // 鼠标在被拖拽的元素中的位置
    const { left, top } = dragTarget.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    dragInfo.current.mouseInTarget = { x: mouseX, y: mouseY };
    // 组件类型
    const componentType = dragTarget.getAttribute('data-type')!;
    dragInfo.current.type = componentType;
  }

  // 进入目标区域
  function onDragEnter(e: DragEvent) {}

  // 在目标区域中移动
  function onDragOver(e: DragEvent) {
    e.preventDefault();

    dispatch(actions.updateDragging(true));

    const currentTarget = e.currentTarget as HTMLElement;
    // 鼠标在目标区域中的真实移动位置
    const { left, top } = currentTarget.getBoundingClientRect();
    const mouseX = e.pageX - left;
    const mouseY = e.pageY - top;

    // 鼠标在目标元素中的相对位置
    const { mouseInTarget } = dragInfo.current;
    const computedX = mouseX - mouseInTarget.x;
    const computedY = mouseY - mouseInTarget.y;
    dragInfo.current.mouseInDropTarget = { x: computedX, y: computedY };
    // 更新十字标线坐标信息
    dispatch(actions.updateReticuleInfo({ ...dragInfo.current.mouseInDropTarget }));

    // const { components } = dragComponentData.current;
    // // 计算和其他元素的横向距离
    // for (let i = 0; i < components.length; i++) {
    //   const { layout } = components[i];
    //   // 对齐标线在左侧
    //   const xLeft = Math.abs(computedX - layout.x);
    //   // 对齐标线在右侧
    //   const xRight = Math.abs(computedX - layout.x - layout.width);
    //   if (xLeft <= 15) {
    //     dragInfo.current.mouseInDropTarget.x = layout.x;
    //     break;
    //   }
    //   if (xRight <= 15) {
    //     dragInfo.current.mouseInDropTarget.x = layout.x + layout.width;
    //     break;
    //   }
    // }

    // // 计算和其他元素的纵向距离
    // for (let i = 0; i < components.length; i++) {
    //   const { layout } = components[i];
    //   // 对齐标线在上侧
    //   const yTop = Math.abs(computedY - layout.y);
    //   // 对齐标线在下侧
    //   const yBottom = Math.abs(computedY - layout.y - layout.height);
    //   if (yTop <= 15) {
    //     dragInfo.current.mouseInDropTarget.y = layout.y;
    //     break;
    //   }
    //   if (yBottom <= 15) {
    //     dragInfo.current.mouseInDropTarget.y = layout.y + layout.height;
    //     break;
    //   }
    // }
  }

  // 在目标区域释放
  function onDrop(e: DragEvent) {
    const target = e.target as HTMLElement;
    // 排除目标区域中其他元素的干扰
    if (!target.hasAttribute('data-drop-container')) {
      return;
    }

    dispatch(actions.updateDragging(false));

    // 新增组件
    const id = 'component_' + Date.now();
    const { type, mouseInDropTarget } = dragInfo.current;

    // 对齐线
    const { alignLineInfo } = dragComponentData.current;
    const x = alignLineInfo.x ? alignLineInfo.x : mouseInDropTarget.x;
    const y = alignLineInfo.y ? alignLineInfo.y : mouseInDropTarget.y;

    dispatch(
      actions.addComponents({
        id,
        type,
        layout: {
          // 自动识别边界
          x: x <= 15 ? 0 : x,
          y: y <= 15 ? 0 : y,
          ...getWHByType(type)!,
        },
      })
    );
  }

  // 离开目标区域
  function onDragLeave(e: DragEvent) {}
};

export default useAddComponent;
