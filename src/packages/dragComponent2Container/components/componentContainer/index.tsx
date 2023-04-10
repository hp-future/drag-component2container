import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './style.module.less';
import MyTable from '../charts/myTable';
import Handle from '../handle';
import { actions } from '../../store/slice';
import React from 'react';
import MyList from '../charts/myList';
import MyLineChart from '../charts/myLineChart';
import MyPieChart from '../charts/myPieChart';
import MyColumnChart from '../charts/myColumnChart';
import MyButton from '../charts/myButton';
import { componentType } from '../../store/state/types';

const ComponentContainer = () => {
  const { components, zIndex } = useAppSelector((state) => state.dragComponent);
  const dispatch = useAppDispatch();

  /**
   * 组件点击事件
   */
  function componentClick(e: React.MouseEvent) {
    e.stopPropagation();

    if (e.ctrlKey) {
      (e.currentTarget as HTMLElement).style.zIndex = zIndex + 1 + '';
      dispatch(actions.updateZIndex());
      dispatch(actions.updateCurrentComponentId({ id: e.currentTarget.id }));
    }
  }

  /**
   * 根据组件类型返回指定组件
   * @param type
   */
  function getComponentByType(props: componentType) {
    switch (props.type) {
      case 'button':
        return <MyButton key={props.id} />;
      case 'table':
        return <MyTable key={props.id} />;
      case 'list':
        return <MyList key={props.id} />;
      case 'lineChart':
        return <MyLineChart key={props.id} />;
      case 'pieChart':
        return <MyPieChart key={props.id} />;
      case 'columnChart':
        return <MyColumnChart key={props.id} />;
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
          {getComponentByType(item)}
          <Handle />
        </div>
      ))}
    </>
  );
};

export default ComponentContainer;
