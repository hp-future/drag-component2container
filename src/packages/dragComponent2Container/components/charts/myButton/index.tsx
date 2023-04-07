import { Button } from 'antd';
import styles from './style.module.less';
import React from 'react';

const MyButton = () => {
  return (
    <Button type="primary" block style={{ height: '100%', borderRadius: 0 }}>
      按钮
    </Button>
  );
};

export default React.memo(MyButton);
