import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import state from './state';
import { componentType, StateType } from './state/types';

export const Slice = createSlice({
  name: 'dragComponent',
  initialState: state,
  reducers: {
    /**
     * 初始化 components
     */
    initComponents(state: StateType, action: PayloadAction<componentType[]>) {
      state.history.undo.push([]);
      state.components = action.payload
      state.history.undo.push(state.components);
    },
    /**
     * 新增组件
     */
    addComponents(state: StateType, action: PayloadAction<componentType>) {
      state.components.push(action.payload);
      state.history.undo.push(state.components);
    },
    /**
     * 更新组件信息
     */
    updateComponents(state: StateType, action: PayloadAction<componentType>) {
      const index = state.components.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
      }
    },
    /**
     * 更新拖拽状态
     */
    updateDragging(state: StateType, action: PayloadAction<boolean>) {
      state.dragging = action.payload;
    },
    /**
     * 更新十字标线
     */
    updateReticuleInfo(state: StateType, action: PayloadAction<StateType['reticuleInfo']>) {
      state.reticuleInfo = action.payload;
    },
    /**
     * 更新对齐标线
     */
    updateAlignLineInfo(state: StateType, action: PayloadAction<{ x?: number | null; y?: number | null }>) {
      const { x, y } = action.payload;
      if (x !== undefined) {
        state.alignLineInfo.x = x;
      }
      if (y !== undefined) {
        state.alignLineInfo.y = y;
      }
    },
    /**
     * 当前正在操作的组件
     */
    updateCurrentComponentId(state: StateType, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;

      const ele = document.getElementById(state.currentComponentId);
      const handleBox = ele?.querySelector('.handleBox') as HTMLElement;
      if (handleBox) {
        handleBox.style.display = 'none';
      }

      if (id && id !== state.currentComponentId) {
        const ele = document.getElementById(id)!;
        const handleBox = ele.querySelector('.handleBox') as HTMLElement;
        handleBox.style.display = 'block';
      }

      state.currentComponentId = id;
    },
    /**
     * 更新z-index,保证被拖拽的目标元素一直在最上层
     */
    updateZIndex(state: StateType) {
      state.zIndex += 1;
    },
    /**
     * 添加历史记录
     */
    addHistory(state: StateType) {
      state.history.undo.push(state.components);
    },
    /**
     * 撤销
     */
    undo(state: StateType) {
      state.currentComponentId = '';
      const historyItem = state.history.undo.pop();
      state.components = state.history.undo[state.history.undo.length - 1] || [];
      if (historyItem) {
        state.history.redo.push(historyItem);
        if (state.history.redo.length > 100) {
          state.history.redo.shift();
        }
      }
    },
    /**
     * 恢复
     */
    redo(state: StateType) {
      state.currentComponentId = '';
      const historyItem = state.history.redo.pop();
      state.components = historyItem || [];
      if (historyItem) {
        state.history.undo.push(historyItem);
        if (state.history.undo.length > 100) {
          state.history.undo.shift();
        }
      }
    },
    /**
     * 清空
     */
    clear(state: StateType) {
      state.currentComponentId = '';
      state.components = [];
      // 重置历史记录
      state.history = {
        undo: [],
        redo: [],
      };
    },
  },
});

export const actions = Slice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectConfig = (state: RootState) => state.dragComponent.components;

export default Slice.reducer;
