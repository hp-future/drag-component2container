import React, { useEffect, useRef } from "react";
import styles from "./styles.module.less";
import { draggableComponents } from "./config";
import { useAppDispatch } from "./store/hooks";
import Reticule from "./components/reticule";
import ComponentContainer from "./components/componentContainer";
import { actions } from "./store/slice";
import useAddComponent from "./hooks/useAddComponent";
import ViewProps from "./components/viewProps";
import Toolbar from "./components/Toolbar";
import "./icon/iconfont.css";
import useDragging from "./hooks/useDragging";

const DragComponent2Container = () => {
  const dispatch = useAppDispatch();

  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // 侧边栏，可拖拽组件列表
  const draggableComponentList = draggableComponents.map((item, index) => (
    <div key={item.title} draggable data-draggable data-index={index}>
      <i className={"iconfont " + item.icon}></i>
      <span>{item.title}</span>
    </div>
  ));

  function mainMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).hasAttribute("data-drop-container")) {
      dispatch(actions.updateCurrentComponentId({ id: "" }));
    }
  }

  /**
   * 新增组件
   */
  useAddComponent();

  useDragging();

  function contextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  /**
   * 初始化
   */
  function init() {
    const data = [
      {
        id: "component_1681047050837",
        type: "text",
        layout: {
          x: 489,
          y: 147,
          width: 100,
          height: 30,
        },
      },
      {
        id: "component_1681047052144",
        type: "list",
        layout: {
          x: 405,
          y: 225,
          width: 200,
          height: 260,
        },
      },
    ];

    const components = data.map((item) => {
      const { props } = draggableComponents.find(
        (el) => el.type === item.type
      )!;

      return {
        ...item,
        layout: {
          ...item.layout,
          minWidth: props.minWidth,
          minHeight: props.minHeight,
        },
      };
    });

    dispatch(actions.initComponents(components));
  }
  // useEffect(() => {
  //   init();
  // }, []);

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
