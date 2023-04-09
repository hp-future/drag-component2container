import styles from "./style.module.less";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
// import { updateCurrentChart } from '../../store/slice';
import { Descriptions, InputNumber, Collapse, Button } from "antd";
import React, { useEffect, useState } from "react";
import { componentType } from "../../store/state/types";
import { actions } from "../../store/slice";
import MyInput from "./components/myInput";

const ViewProps = () => {
  const { components, currentComponentId } = useAppSelector(
    (state) => state.dragComponent
  );
  const dispatch = useAppDispatch();

  const [currentComponent, setCurrentComponent] =
    useState<componentType | null>();
  useEffect(() => {
    const com = components.find((item) => item.id === currentComponentId);
    if (com) {
      setCurrentComponent(com);
    }
  }, [currentComponentId, components]);

  /**
   * 保存
   */
  function saveHanler() {
    const data = components.map((item) => {
      const { width, height, x, y } = item.layout;

      return {
        type: item.type,
        layout: {
          width,
          height,
          x,
          y,
        },
      };
    });
  }

  return (
    <div className={styles["props-view"]}>
      <Button
        block
        type="primary"
        style={{ borderRadius: 0 }}
        disabled={components.length === 0}
        onClick={saveHanler}
      >
        保存
      </Button>
      <div className={styles.content}>
        <Collapse style={{ borderRadius: 0 }} size="small" bordered={false}>
          <Collapse.Panel header="布局配置" key="1">
            <Descriptions
              column={1}
              colon={false}
              labelStyle={{ alignItems: "center" }}
            >
              <Descriptions.Item label="宽">
                <MyInput field="width" />
              </Descriptions.Item>
              <Descriptions.Item label="高">
                <MyInput field="height" />
              </Descriptions.Item>
              <Descriptions.Item label="左">
                <MyInput field="x" />
              </Descriptions.Item>
              <Descriptions.Item label="上">
                <MyInput field="y" />
              </Descriptions.Item>
            </Descriptions>
          </Collapse.Panel>
          <Collapse.Panel header="样式配置" key="2">
            <Descriptions
              column={1}
              colon={false}
              labelStyle={{ alignItems: "center" }}
            >
              <Descriptions.Item label="图表配置">123</Descriptions.Item>
            </Descriptions>
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ViewProps;
