import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './style.module.less';
import { Button } from 'antd';
import MyTable from '../charts/myTable';
import Handle from '../handle';
import { actions } from '../../store/slice';
import React from 'react';
import MyList from '../charts/myList';

const ComponentContainer = () => {
  const { components } = useAppSelector((state) => state.dragComponent);
  const dispatch = useAppDispatch();

  /**
   * 组件点击事件
   */
  function componentClick(e: React.MouseEvent) {
    e.stopPropagation();

    if (e.ctrlKey) {
      dispatch(actions.updateCurrentComponentId({ id: e.currentTarget.id }));
    }
  }

  /**
   * 根据组件类型返回指定组件
   * @param type
   */
  function getComponentByType(type: string) {
    switch (type) {
      case 'button':
        return (
          <Button type="primary" block style={{ height: '100%', borderRadius: 0 }}>
            按钮
          </Button>
        );
      case 'table':
        return <MyTable />;
      case 'list':
        return <MyList />;
      default:
        return null;
    }
  }

  /**
   * 右键菜单
   */
  function contextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <>
      {components.map((item, index) => (
        <div
          key={item.id}
          id={item.id}
          className={styles.componentContainer}
          onClick={componentClick}
          onContextMenu={contextMenu}
          draggable={false}
          style={{
            transform: `translate(${item.layout.x}px, ${item.layout.y}px)`,
            width: `${item.layout.width}px`,
            height: `${item.layout.height}px`,
          }}
        >
          {getComponentByType(item.type)}
          <Handle />
        </div>
      ))}
    </>
  );
};

export default ComponentContainer;
