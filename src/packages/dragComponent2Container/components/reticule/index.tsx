import styles from './style.module.less';
import { useAppSelector } from '../../store/hooks';
import { useEffect, useRef } from 'react';
import useAlignLine from './hook/useAlignLine';
import useReticle from './hook/useReticle';

/**
 * 标线
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

  useReticle(reticuleRef);
  useAlignLine(reticuleRef);

  return (
    <div className={styles.Reticule} ref={reticuleRef} id="Reticule">
      <div data-distance={dragComponentData.reticuleInfo.y + 'px'} id="Reticule-X" className={styles.x}></div>
      <div data-distance={dragComponentData.reticuleInfo.x + 'px'} id="Reticule-Y" className={styles.y}></div>
      <div id="align-X"></div>
      <div id="align-Y"></div>
    </div>
  );
};

export default Reticule;
