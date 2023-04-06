import { StateType } from './types';

/**
 * 全局状态
 */
const state: StateType = {
  components: [],
  dragging: false,
  reticuleInfo: {
    x: 0,
    y: 0,
  },
  alignLineInfo: {
    x: null,
    y: null,
  },
  componentsRect: [],
  currentComponentId: '',
  zIndex: 0,
};

export default state;
