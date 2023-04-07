export interface DraggableComponentType {
  type: string;
  title: string;
  icon: string;
  props: {
    minWidth: number;
    minHeight: number;
  };
}

export const draggableComponents: DraggableComponentType[] = [
  // { type: 'line', title: '折线图', icon: 'icon-LINE_CHART' },
  // { type: 'column', title: '柱状图', icon: 'icon-HISTOGRAM' },
  // { type: 'pie', title: '饼图', icon: 'icon-PIE_CHART' },
  // { type: 'table', title: '列表', icon: 'icon-biaoge' },
  // { type: 'chartDemo', title: 'chartDemo', icon: 'icon-biaoge' },
  { type: 'button', title: '按钮', icon: '', props: { minWidth: 70, minHeight: 32 } },
  { type: 'table', title: '表格', icon: '', props: { minWidth: 300, minHeight: 200 } },
  { type: 'list', title: '列表', icon: '', props: { minWidth: 200, minHeight: 260 } },
];
