import React, { useRef } from 'react';
import styles from './style.module.less';
import useMove from './hook/useMove';
import useResize from './hook/useResize';

const Handle = () => {
  const handleBoxRef = useRef(null);
  useMove(handleBoxRef);
  useResize(handleBoxRef);

  function handleBoxClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className={[styles.handleContainer, 'handleBox'].join(' ')} ref={handleBoxRef} onClick={handleBoxClick}>
      <div handle-name="top-left" className={styles.handle}></div>
      <div handle-name="top-center" className={styles.handle}></div>
      <div handle-name="top-right" className={styles.handle}></div>
      <div handle-name="right-center" className={styles.handle}></div>
      <div handle-name="bottom-right" className={styles.handle}></div>
      <div handle-name="bottom-center" className={styles.handle}></div>
      <div handle-name="bottom-left" className={styles.handle}></div>
      <div handle-name="left-center" className={styles.handle}></div>
    </div>
  );
};

export default Handle;
