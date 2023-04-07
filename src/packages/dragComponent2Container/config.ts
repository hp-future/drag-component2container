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
  // { type: 'column', title: '柱状图', icon: 'icon-HISTOGRAM' },
  // { type: 'pie', title: '饼图', icon: 'icon-PIE_CHART' },
  { type: 'button', title: '按钮', icon: 'icon-anniu', props: { minWidth: 70, minHeight: 32 } },
  { type: 'table', title: '表格', icon: 'icon-biaoge', props: { minWidth: 300, minHeight: 200 } },
  { type: 'list', title: '列表', icon: 'icon-liebiao', props: { minWidth: 200, minHeight: 260 } },
  { type: 'lineChart', title: '折线图', icon: 'icon-LINE_CHART', props: { minWidth: 400, minHeight: 200 } },
];
