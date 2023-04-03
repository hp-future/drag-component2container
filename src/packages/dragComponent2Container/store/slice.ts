import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CSSProperties } from 'react';
import { RootState } from './index';
import state from './state';
import { componentType, StateType } from './state/types';

export const Slice = createSlice({
  name: 'dragComponent',
  initialState: state,
  reducers: {
    addComponents(state: StateType, action: PayloadAction<Omit<componentType, 'id'>>) {
      const id = 'chart_' + state.components.length;
      state.components.push({ ...action.payload, id });
    },
    updateComponents(state: StateType, action: PayloadAction<componentType>) {
      const index = state.components.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.components[index] = action.payload;
      }
    },
    updateDragging(state: StateType, action: PayloadAction<boolean>) {
      state.dragging = action.payload;
    },
    updateReticuleInfo(state: StateType, action: PayloadAction<StateType['reticuleInfo']>) {
      state.reticuleInfo = action.payload;
    },
    updateA(state: StateType, action: PayloadAction<number>) {
      state.a = action.payload;
    },
  },
});

export const { addComponents, updateComponents, updateDragging, updateReticuleInfo, updateA } = Slice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectConfig = (state: RootState) => state.dragComponent.components;

export default Slice.reducer;
