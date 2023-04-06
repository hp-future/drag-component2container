import styles from './style.module.less';
import { useAppSelector } from '../../store/hooks';
import useAlignLine from './hook/useAlignLine';
import useReticle from './hook/useReticle';

/**
 * 标线
 * @returns
 */
const Reticule = () => {
  const dragComponentData = useAppSelector((state) => state.dragComponent);

  /**
   * 更新十字标线
   */
  useReticle();

  /**
   * 更新对齐标线
   */
  useAlignLine();

  return (
    <div className={styles.Reticule}>
      <div data-distance={dragComponentData.reticuleInfo.y + 'px'} id="Reticule-X" className={styles.x}></div>
      <div data-distance={dragComponentData.reticuleInfo.x + 'px'} id="Reticule-Y" className={styles.y}></div>
      <div id="align-X"></div>
      <div id="align-Y"></div>
    </div>
  );
};

export default Reticule;
