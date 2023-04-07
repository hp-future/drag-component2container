import React, { useRef } from 'react';
import styles from './styles.module.less';
import { draggableComponents } from './config';
import { useAppDispatch } from './store/hooks';
import Reticule from './components/reticule';
import ComponentContainer from './components/componentContainer';
import { actions } from './store/slice';
import useAddComponent from './hooks/useAddComponent';
import ViewProps from './components/viewProps';
import Toolbar from './components/Toolbar';
import './icon/iconfont.css';

const DragComponent2Container = () => {
  const dispatch = useAppDispatch();

  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // 侧边栏，可拖拽组件列表
  const draggableComponentList = draggableComponents.map((item, index) => (
    <div key={item.title} draggable data-index={index}>
      <i className={'iconfont ' + item.icon}></i>
      <span>{item.title}</span>
    </div>
  ));

  function mainMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute('data-drop-container')) {
      dispatch(actions.updateCurrentComponentId({ id: '' }));
    }
  }

  /**
   * 新增组件
   */
  useAddComponent(asideRef, mainRef);

  function contextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <div className={styles.DragComponent2Container}>
      {/* 侧边栏 */}
      <aside ref={asideRef} id="asideContainer">
        {draggableComponentList}
      </aside>
      {/* 展示区域 */}
      <main
        ref={mainRef}
        id="dropContainer"
        data-drop-container
        onMouseDown={mainMouseDown}
        onContextMenu={contextMenu}
      >
        <ComponentContainer />
        <Reticule />
        {/* 工具栏 */}
        <Toolbar />
      </main>
      {/* 属性设置 */}
      <ViewProps />
    </div>
  );
};

export default DragComponent2Container;
