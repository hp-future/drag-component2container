import React from 'react';
import styles from './styles.module.less';
import { componentTypes } from './config';
import useDrag from './hooks/useDrag';
import { useAppDispatch, useAppSelector } from './store/hooks';
import Reticule from './components/reticule';
import ComponentContainer from './components/componentContainer';
import { actions } from './store/slice';

const DragComponent2Container = () => {
  const dispatch = useAppDispatch();

  // 侧边栏，可拖拽组件列表
  const draggableComponents = componentTypes.map((item) => (
    <div key={item.title} draggable data-type={item.type}>
      <i className={'iconfont ' + item.icon}></i>
      <span>{item.title}</span>
    </div>
  ));
  const { asideRef, mainRef } = useDrag();

  // 主区域点击事件
  function mainClick(e: React.MouseEvent) {}

  function mainMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute('data-drop-container')) {
      dispatch(actions.updateCurrentComponentId({ id: '' }));
    }
  }

  return (
    <div className={styles.DragComponent2Container}>
      {/* 侧边栏 */}
      <aside ref={asideRef}>{draggableComponents}</aside>
      {/* 展示区域 */}
      <main ref={mainRef} data-drop-container onClick={mainClick} onMouseDown={mainMouseDown}>
        <ComponentContainer />
        <Reticule />
      </main>
      {/* 属性设置 */}
    </div>
  );
};

export default DragComponent2Container;
