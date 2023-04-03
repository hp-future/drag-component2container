import React, { useRef, useState } from 'react';
import styles from './styles.module.less';
import { componentTypes } from './config';
import useDrag from './hooks/useDrag';
import useDragComponent from './hooks/useDragComponent';
import { useAppSelector, useAppDispatch } from './store/hooks';
import LineChart from './components/charts/line';
// import ViewProps from './components/viewProps';
import { Button } from 'antd';
import Handle from './components/handle';
import Reticule from './components/reticule';

const DragComponent2Container = () => {
  const components = useAppSelector((state) => state.dragComponent.components);
  // const dispatch = useAppDispatch();

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
    if (!(e.target as HTMLElement).hasAttribute('data-drop-container')) {
      return;
    }
    const currentTarget = e.currentTarget as HTMLElement;

    const handleBox = currentTarget.querySelectorAll('.handleBox');
    handleBox.forEach((item) => {
      (item as HTMLElement).style.display = 'none';
    });
  }

  // 组件点击事件
  function componentClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!e.ctrlKey) {
      return;
    }
    const currentTarget = e.currentTarget as HTMLElement;

    const handleBox = currentTarget.querySelector('.handleBox') as HTMLElement;
    handleBox.style.display = 'block';
  }

  return (
    <div className={styles.DragComponent2Container}>
      {/* 侧边栏 */}
      <aside ref={asideRef}>{draggableComponents}</aside>
      {/* 展示区域 */}
      <main ref={mainRef} data-drop-container onClick={mainClick} onMouseDown={mainMouseDown}>
        {components.map((item, index) => (
          <div
            key={item.id}
            className={styles.componentContainer}
            onClick={componentClick}
            style={{ transform: `translate(${item.layout.x}px, ${item.layout.y}px)` }}
          >
            {(() => {
              switch (item.type) {
                case 'button':
                  return (
                    <Button style={{ width: '100%', height: '100%' }} data-is-component>
                      按钮
                    </Button>
                  );
                default:
                  return null;
              }
            })()}
            <Handle />
          </div>
        ))}
        <Reticule />
      </main>
      {/* 属性设置 */}
      {/* <ViewProps /> */}
    </div>
  );
};

export default DragComponent2Container;
