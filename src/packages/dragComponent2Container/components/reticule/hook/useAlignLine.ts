import { RefObject, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';

/**
 * 动态显示对齐标线
 */
const useAlignLine = (ref: RefObject<HTMLDivElement>) => {
  // 十字标线信息
  const { reticuleInfo, componentsRect, currentComponentId } = useAppSelector((state) => state.dragComponent);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const reticuleDom = ref.current;
    // x轴对齐线
    const alignX = reticuleDom.querySelector('#align-X') as HTMLElement;
    // y轴对齐线
    const alignY = reticuleDom.querySelector('#align-Y') as HTMLElement;

    const otherComs = componentsRect.filter((item) => item[0] !== currentComponentId);

    // x轴对齐线
    for (let i = 0; i < otherComs.length; i++) {
      const { top, height } = otherComs[i][1];

      // x轴对齐线在上
      const yDiffTop = Math.abs(reticuleInfo.y - top);
      // x轴对齐线在下
      const yDiffBottom = Math.abs(reticuleInfo.y - top - height);

      if (yDiffTop <= 15 || yDiffBottom <= 15) {
        alignX.style.display = 'block';

        if (yDiffTop <= 15) {
          alignX.style.transform = `translateY(${top}px)`;
        }
        if (yDiffBottom <= 15) {
          alignX.style.transform = `translateY(${top + height}px)`;
        }

        break;
      } else {
        alignX.style.display = 'none';
        alignX.style.transform = 'none';
      }
    }

    // y轴对齐线
    for (let i = 0; i < otherComs.length; i++) {
      const { left, width } = otherComs[i][1];
      // y轴对齐线在左
      const xDiffLeft = Math.abs(reticuleInfo.x - left);
      // y轴对齐线在右
      const xDiffRight = Math.abs(reticuleInfo.x - left - width);

      if (xDiffLeft <= 15 || xDiffRight <= 15) {
        alignY.style.display = 'block';

        if (xDiffLeft <= 15) {
          alignY.style.transform = `translateX(${left}px)`;
        }
        if (xDiffRight <= 15) {
          alignY.style.transform = `translateX(${left + width}px)`;
        }

        break;
      } else {
        alignY.style.display = 'none';
        alignY.style.transform = 'none';
      }
    }
  }, [reticuleInfo.x, reticuleInfo.y]);
};

export default useAlignLine;
