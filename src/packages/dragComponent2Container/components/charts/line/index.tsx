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
  useResize(showHandle, props.key);

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

  // 单击查看配置选项
  function clickEvent(e: React.MouseEvent) {
    dispatch(updateCurrentChart(configData.data.find((item) => item.key === props.key)!));
    setShowHandle((prevValue) => !prevValue);
  }

  return (
    <div className="linechart-container" onClick={clickEvent} style={props.containerProps}>
      <Line {...config} />
      <div className="out-handle" style={{ display: showHandle ? 'block' : 'none' }}>
        <div className="handle top-left"></div>
        <div className="handle top-center"></div>
        <div className="handle top-right"></div>
        <div className="handle right"></div>
        <div className="handle bottom-right"></div>
        <div className="handle bottom-center"></div>
        <div className="handle bottom-left"></div>
        <div className="handle left"></div>
      </div>
    </div>
  );
};

export default LineChart;
