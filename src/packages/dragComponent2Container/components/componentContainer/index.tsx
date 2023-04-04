import { useAppDispatch, useAppSelector } from '../../store/hooks';
import styles from './style.module.less';
import { Button } from 'antd';
import MyTable from '../charts/myTable';
import Handle from '../handle';
import { actions } from '../../store/slice';

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
        return <Button style={{ width: '100%', height: '100%' }}>按钮</Button>;
      case 'table':
        return <MyTable />;
      default:
        return null;
    }
  }

  return (
    <>
      {components.map((item, index) => (
        <div
          key={item.id}
          id={item.id}
          className={styles.componentContainer}
          onClick={componentClick}
          style={{ transform: `translate(${item.layout.x}px, ${item.layout.y}px)` }}
        >
          {getComponentByType(item.type)}
          <Handle />
        </div>
      ))}
    </>
  );
};

export default ComponentContainer;
