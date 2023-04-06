import { actions } from './../../../store/slice';
import { RefObject, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

/**
 * 对齐标线
 */
const useAlignLine = () => {
  // 十字标线信息
  const { reticuleInfo, components, currentComponentId, dragging } = useAppSelector((state) => state.dragComponent);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 横向标线
    const alignX = document.getElementById('align-X');
    // 纵向标线
    const alignY = document.getElementById('align-Y');

    if (alignX && alignY) {
      alignX.style.display = dragging ? 'block' : 'none';
      alignY.style.display = dragging ? 'block' : 'none';
    }
  }, [dragging]);

  useEffect(() => {
    // 横向标线
    const alignX = document.getElementById('align-X');
    // 纵向标线
    const alignY = document.getElementById('align-Y');

    if (!(alignX && alignY)) {
      return;
    }

    if (reticuleInfo.x <= 15) {
      alignY.style.transform = `translateX(0px)`;
      dispatch(actions.updateAlignLineInfo({ x: reticuleInfo.x }));
    } else {
      alignY.style.transform = `translateX(-100px)`;
      dispatch(actions.updateAlignLineInfo({ x: null }));
    }
    if (reticuleInfo.y <= 15) {
      alignX.style.transform = `translateY(0px)`;
      dispatch(actions.updateAlignLineInfo({ y: reticuleInfo.y }));
    } else {
      alignX.style.transform = `translateY(-100px)`;
      dispatch(actions.updateAlignLineInfo({ y: null }));
    }

    const otherComs = components.filter((item) => item.id !== currentComponentId);

    // x轴对齐线
    for (let i = 0; i < otherComs.length; i++) {
      const { y: top, height } = otherComs[i].layout;

      // x轴对齐线在上
      const yDiffTop = Math.abs(reticuleInfo.y - top);
      // x轴对齐线在下
      const yDiffBottom = Math.abs(reticuleInfo.y - top - height);

      if (yDiffTop <= 15 || yDiffBottom <= 15) {
        if (yDiffTop <= 15) {
          alignX.style.transform = `translateY(${top}px)`;
          dispatch(actions.updateAlignLineInfo({ y: top }));
        }
        if (yDiffBottom <= 15) {
          alignX.style.transform = `translateY(${top + height}px)`;
          dispatch(actions.updateAlignLineInfo({ y: top + height }));
        }

        break;
      } else {
        alignX.style.transform = 'translateY(-100px)';
        dispatch(actions.updateAlignLineInfo({ y: null }));
      }
    }

    // y轴对齐线
    for (let i = 0; i < otherComs.length; i++) {
      const { x: left, width } = otherComs[i].layout;
      // y轴对齐线在左
      const xDiffLeft = Math.abs(reticuleInfo.x - left);
      // y轴对齐线在右
      const xDiffRight = Math.abs(reticuleInfo.x - left - width);

      if (xDiffLeft <= 15 || xDiffRight <= 15) {
        if (xDiffLeft <= 15) {
          alignY.style.transform = `translateX(${left}px)`;
          dispatch(actions.updateAlignLineInfo({ x: left }));
        }
        if (xDiffRight <= 15) {
          alignY.style.transform = `translateX(${left + width}px)`;
          dispatch(actions.updateAlignLineInfo({ x: left + width }));
        }

        break;
      } else {
        alignY.style.transform = 'translateX(-100px)';
        dispatch(actions.updateAlignLineInfo({ x: null }));
      }
    }
  }, [reticuleInfo.x, reticuleInfo.y]);
};

export default useAlignLine;
