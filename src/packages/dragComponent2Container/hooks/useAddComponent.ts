import { useEffect, useRef } from 'react';
import { draggableComponents, DraggableComponentType } from '../config';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { actions } from '../store/slice';
import { StateType } from '../store/state/types';

/**
 * 添加组件
 */
const useAddComponent = () => {
  const dispatch = useAppDispatch();
  const dragComponentDataState = useAppSelector((state) => state.dragComponent);
  const dragComponentData = useRef<StateType>(dragComponentDataState);
  useEffect(() => {
    dragComponentData.current = dragComponentDataState;
  }, [dragComponentDataState]);

  // 始化事件
  useEffect(() => {
    document.addEventListener('dragstart', onDragStart)
    document.addEventListener('dragover', onDragOver)
    document.addEventListener('drop', onDrop)

    return () => {
      document.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('dragover', onDragOver)
      document.removeEventListener('drop', onDrop)
    }
  }, []);

  // 允许拖拽
  const allowDrag = useRef(false)
  // 被拖拽组件的信息
  const draggableComponentInfo = useRef<DraggableComponentType>();

  /**
   * 开始拖拽
   */
  function onDragStart(e: DragEvent) {
    const target = e.target as HTMLElement
    // 排除其他可拖拽元素
    if (!target.hasAttribute('data-draggable')) {
      return
    }

    allowDrag.current = true

    // 记录被拖拽组件的信息
    const index = +target.getAttribute('data-index')!;
    draggableComponentInfo.current = { ...draggableComponents[index] }
  }

  /**
   * 拖拽中
   */
  function onDragOver(e: DragEvent) {
    e.preventDefault()

    if (!allowDrag.current) {
      return
    }
  }

  /**
   * 拖拽释放
   */
  function onDrop(e: DragEvent) {
    if (!allowDrag.current) {
      return
    }

    const target = e.target as HTMLElement

    //  排除目标区域中其他元素的干扰
    if (!target.hasAttribute('data-drop-container')) {
      return;
    }

    // 目标元素是否在可释放区域内
    const isInclude = target?.contains(target) || false
    if (!isInclude) {
      return
    }

    // 新增组件
    const id = 'component_' + Date.now();
    const { type, props } = draggableComponentInfo.current!;
    const { reticuleInfo, alignLineInfo } = dragComponentData.current


    dispatch(actions.addComponents({
      id,
      type,
      layout: {
        x: alignLineInfo.x === null ? reticuleInfo.x : alignLineInfo.x,
        y: alignLineInfo.y === null ? reticuleInfo.y : alignLineInfo.y,
        width: props.minWidth,
        height: props.minHeight,
        minWidth: props.minWidth,
        minHeight: props.minHeight,
      }
    }))

  }
};

export default useAddComponent;
