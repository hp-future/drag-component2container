import styles from './style.module.less';
import React from 'react';

const MyList = () => {
  return (
    <div className={styles.myList}>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
      <div className={styles.listItem}>listItem</div>
    </div>
  );
};

export default React.memo(MyList);
