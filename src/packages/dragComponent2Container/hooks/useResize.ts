import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';

/**
 * 调整 chart 大小
 * @param showHandle    是否显示手柄
 * @param key    chart唯一标识
 */
const useResize = (showHandle: boolean, key: string) => {
  const currentChart = useAppSelector((state) => state.config.currentChart);
  if (!(showHandle && currentChart.key === key)) return;

//   useEffect(() => )

  console.log(1);
};
export default useResize;
