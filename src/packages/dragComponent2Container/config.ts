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
  { type: 'text', title: '文本', icon: 'icon-wenben', props: { minWidth: 100, minHeight: 30 } },
  { type: 'button', title: '按钮', icon: 'icon-anniu', props: { minWidth: 70, minHeight: 32 } },
  { type: 'table', title: '表格', icon: 'icon-biaoge', props: { minWidth: 300, minHeight: 200 } },
  { type: 'list', title: '列表', icon: 'icon-liebiao', props: { minWidth: 200, minHeight: 260 } },
  { type: 'lineChart', title: '折线图', icon: 'icon-LINE_CHART', props: { minWidth: 400, minHeight: 200 } },
  { type: 'pieChart', title: '饼图', icon: 'icon-PIE_CHART', props: { minWidth: 400, minHeight: 200 } },
  { type: 'columnChart', title: '柱状图', icon: 'icon-HISTOGRAM', props: { minWidth: 400, minHeight: 200 } },
];
