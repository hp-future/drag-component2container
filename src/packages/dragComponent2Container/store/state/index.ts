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
  componentsRect: [],
  currentComponentId: '',
};

export default state;
