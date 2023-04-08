import { useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';

/**
 * 十字标线
 */
const useReticle = () => {
  const { reticuleInfo, dragging } = useAppSelector((state) => state.dragComponent);

  useEffect(() => {
    // 横向标线
    const reticleX = document.getElementById('Reticule-X');
    // 纵向标线
    const reticleY = document.getElementById('Reticule-Y');

    if (!(reticleX && reticleY)) {
      return;
    }

    reticleX.style.display = dragging ? 'block' : 'none';
    reticleY.style.display = dragging ? 'block' : 'none';

    const { x, y } = reticuleInfo;
    reticleX.style.transform = `translateY(${y}px)`;
    reticleY.style.transform = `translateX(${x}px)`;
  }, [reticuleInfo, dragging]);
};

export default useReticle;
