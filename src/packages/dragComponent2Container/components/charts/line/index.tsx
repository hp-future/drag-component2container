import { Line, LineConfig } from '@ant-design/plots';
import React, { useEffect, useState } from 'react';
import './style.scss';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { DataType, updateCurrentChart, updateData } from '../../../store/slice';
import useResize from '../../../hooks/useResize';

const LineChart = ({ props }: { props: DataType }) => {
  const configData = useAppSelector((state) => state.config);
  const dispatch = useAppDispatch();
  const [showHandle, setShowHandle] = useState(false);

  // 调整 chart 大小
  const { mouseDownEvent } = useResize(showHandle);

  useEffect(() => {
    asyncFetch();
  }, []);

  const [config, setConfig] = useState<LineConfig>({
    data: [],
    xField: 'Date',
    yField: 'scales',
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
    style: {
      height: '100%',
      backgroundColor: '#fff',
    },
  });

  const asyncFetch = async () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
      .then((response) => response.json())
      .then((json) => {
        setConfig((prevValue) => ({ ...prevValue, data: json }));
      })
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  useEffect(() => {
    setConfig((prevValue) => {
      const findData = configData.data.find((item) => item.key === props.key);
      return { ...prevValue, ...findData?.chartProps };
    });
  }, [configData]);

  useEffect(() => {
    setShowHandle(true);
  }, [configData.currentChart.key]);

  // 单击查看配置选项
  function clickEvent(e: React.MouseEvent) {
    dispatch(updateCurrentChart(configData.data.find((item) => item.key === props.key)!));
    setShowHandle((prevValue) => !prevValue);
  }

  return (
    <div className="linechart-container" onClick={clickEvent} style={props.containerProps} id={props.key}>
      <Line {...config} />
      <div
        className="out-handle"
        style={{
          display: showHandle && props.key === configData.currentChart.key ? 'block' : 'none',
          backgroundColor: showHandle && props.key === configData.currentChart.key ? 'rgb(255, 0, 0, 0.1)' : '',
        }}
        onMouseDown={mouseDownEvent}
      >
        <div onClick={(e) => e.stopPropagation()} data-handle-name="top-left" className="handle top-left"></div>
        <div onClick={(e) => e.stopPropagation()} data-handle-name="top-center" className="handle top-center"></div>
        <div onClick={(e) => e.stopPropagation()} data-handle-name="top-right" className="handle top-right"></div>
        <div onClick={(e) => e.stopPropagation()} data-handle-name="right-center" className="handle right-center"></div>
        <div onClick={(e) => e.stopPropagation()} data-handle-name="bottom-right" className="handle bottom-right"></div>
        <div
          onClick={(e) => e.stopPropagation()}
          data-handle-name="bottom-center"
          className="handle bottom-center"
        ></div>
        <div onClick={(e) => e.stopPropagation()} data-handle-name="bottom-left" className="handle bottom-left"></div>
        <div onClick={(e) => e.stopPropagation()} data-handle-name="left-center" className="handle left-center"></div>
      </div>
    </div>
  );
};

export default LineChart;
