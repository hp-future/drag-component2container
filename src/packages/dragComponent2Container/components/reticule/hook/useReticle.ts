import { RefObject, useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';

/**
 * 移动过程中的十字标线
 */
const useReticle = (ref: RefObject<HTMLDivElement>) => {
  // 十字标线信息
  const { reticuleInfo } = useAppSelector((state) => state.dragComponent);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const reticuleDom = ref.current;

    const { x, y } = reticuleInfo;
    // x轴标线
    const xReticule = reticuleDom.querySelector('#Reticule-X') as HTMLElement;
    xReticule.style.transform = `translateY(${y}px)`;
    // y轴标线
    const yReticule = reticuleDom.querySelector('#Reticule-Y') as HTMLElement;
    yReticule.style.transform = `translateX(${x}px)`;
  }, [reticuleInfo.x, reticuleInfo.y]);
};

export default useReticle;
