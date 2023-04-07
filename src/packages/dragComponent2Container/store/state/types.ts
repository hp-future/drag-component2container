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
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
  };
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
   * 十字标线信息
   */
  reticuleInfo: {
    x: number;
    y: number;
  };
  /**
   * 对齐标线信息
   */
  alignLineInfo: {
    x: number | null;
    y: number | null;
  };
  /**
   * 当前正在操作的组件id
   */
  currentComponentId: string;
  /**
   * 最高的z-index
   */
  zIndex: number;
  /**
   * 历史记录
   */
  history: {
    undo: Array<componentType>[];
    redo: Array<componentType>[];
  };
};
