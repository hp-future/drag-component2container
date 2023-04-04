/**
 * 组件的类型定义
 */
export type componentType = {
  /**
   * 组件的唯一标识
   */
  id: string;
  /**
   * 组件类型
   */
  type: string;
  /**
   * 布局信息
   */
  layout: {
    x: number;
    y: number;
  };
};

// 各组件的物理信息
export type ComponentsRectType = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * 全局状态类型
 */
export type StateType = {
  components: Array<componentType>;
  /**
   * 正在拖拽
   * @default false
   */
  dragging: boolean;
  /**
   * 标线信息
   */
  reticuleInfo: {
    x: number;
    y: number;
  };
  /**
   * 各组件的物理信息，拖拽对齐时使用
   */
  componentsRect: Array<[string, ComponentsRectType]>;
  /**
   * 当前正在操作的组件id
   */
  currentComponentId: string;
};
