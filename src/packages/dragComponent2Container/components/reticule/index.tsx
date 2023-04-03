import styles from './style.module.less';
import { useAppSelector } from '../../store/hooks';
import { useEffect, useRef } from 'react';

/**
 * 标线，十字线
 * @returns
 */
const Reticule = () => {
  const dragComponentData = useAppSelector((state) => state.dragComponent);
  const reticuleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reticuleRef.current) {
      reticuleRef.current.style.display = dragComponentData.dragging ? 'block' : 'none';
    }
  }, [dragComponentData.dragging]);

  useEffect(() => {
    if (!reticuleRef.current) {
      return;
    }
    const { x, y } = dragComponentData.reticuleInfo;
    // x轴标线
    const xReticule = reticuleRef.current.firstElementChild as HTMLElement;
    xReticule.style.transform = `translateY(${y}px)`;
    // y轴标线
    const yReticule = reticuleRef.current.lastElementChild as HTMLElement;
    yReticule.style.transform = `translateX(${x}px)`;
  }, [dragComponentData.reticuleInfo.x, dragComponentData.reticuleInfo.y]);

  return (
    <div className={styles.Reticule} ref={reticuleRef} id="Reticule">
      <div className={styles.x}></div>
      <div className={styles.y}></div>
    </div>
  );
};

export default Reticule;
