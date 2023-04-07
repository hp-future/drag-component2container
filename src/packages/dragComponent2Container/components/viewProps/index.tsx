import styles from './style.module.less';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
// import { updateCurrentChart } from '../../store/slice';
import { Descriptions, InputNumber, Collapse, Button } from 'antd';
import React from 'react';

const ViewProps = () => {
  const { components } = useAppSelector((state) => state.dragComponent);
  const dispatch = useAppDispatch();

  return (
    <div className={styles['props-view']}>
      <Button block type="primary" style={{ borderRadius: 0, backgroundColor: '#2969ff' }}>
        保存
      </Button>
      <div className={styles.content}>
        <Collapse style={{ borderRadius: 0 }} size="small" bordered={false}>
          <Collapse.Panel header="图表容器配置" key="1">
            <Descriptions column={1} colon={false} labelStyle={{ alignItems: 'center' }}>
              <Descriptions.Item label="宽度">
                {/* <InputNumber
                  value={currentChart.containerProps.width}
                  onChange={(value) => {
                    dispatch(
                      updateCurrentChart({
                        ...currentChart,
                        containerProps: { ...currentChart.containerProps, width: value as number },
                      })
                    );
                  }}
                  style={{ width: '100%', borderRadius: 0 }}
                /> */}
              </Descriptions.Item>
              <Descriptions.Item label="高度">
                {/* <InputNumber
                  value={currentChart.containerProps.height}
                  onChange={(value) => {
                    dispatch(
                      updateCurrentChart({
                        ...currentChart,
                        containerProps: { ...currentChart.containerProps, height: value as number },
                      })
                    );
                  }}
                  style={{ width: '100%', borderRadius: 0 }}
                /> */}
              </Descriptions.Item>
            </Descriptions>
          </Collapse.Panel>
          <Collapse.Panel header="图表配置" key="2">
            <Descriptions column={1} colon={false} labelStyle={{ alignItems: 'center' }}>
              <Descriptions.Item label="图表配置">123</Descriptions.Item>
            </Descriptions>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ViewProps;
