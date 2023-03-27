import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CSSProperties } from 'react';
import { RootState } from './index';

export type DataType = {
  key: string;
  // 容器属性
  containerProps: {
    width: number;
    height: number;
    backgroungColor: CSSProperties['backgroundColor'];
  };
  // 图表属性
  chartProps: {
    // 图表类型
    type: string;
  };
};
// 为 slice state 定义一个类型
interface State {
  data: DataType[];
  currentChart: DataType;
}

// 使用该类型定义初始 state
const initialState: State = {
  data: [],
  currentChart: {
    key: '',
    containerProps: {
      width: 0,
      height: 0,
      backgroungColor: '#fff',
    },
    // 图表属性
    chartProps: {
      // 图表类型
      type: '',
    },
  },
};

export const Slice = createSlice({
  name: 'config',
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    updateData(state: State, action: PayloadAction<DataType>) {
      const index = state.data.findIndex((item) => item.key === action.payload.key);
      if (index === -1) {
        state.data = [...state.data, action.payload];
      } else {
        state.data[index] = action.payload;
      }
      state.currentChart = action.payload;
    },
    updateCurrentChart(state: State, action: PayloadAction<DataType>) {
      const index = state.data.findIndex((item) => item.key === action.payload.key);
      state.data[index] = action.payload;
      state.currentChart = action.payload;
    },
  },
});

export const { updateData, updateCurrentChart } = Slice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectConfig = (state: RootState) => state.config.data;

export default Slice.reducer;
