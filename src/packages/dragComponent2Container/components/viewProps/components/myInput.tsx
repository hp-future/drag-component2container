import { InputNumber, InputNumberProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { componentType } from '../../../store/state/types';
import { actions } from '../../../store/slice';
import { useEffect, useState } from 'react';
import styles from '../style.module.less';

interface IMyInput extends InputNumberProps {
  field: keyof componentType['layout'];
}

const MyInput = ({ field, ...props }: IMyInput) => {
  const { currentComponentId, components } = useAppSelector((state) => state.dragComponent);
  const dispatch = useAppDispatch();

  const [currentComponent, setCurrentComponent] = useState<componentType | null>();
  useEffect(() => {
    const com = components.find((item) => item.id === currentComponentId);
    if (com) {
      setCurrentComponent(com);
    }
  }, [currentComponentId, components]);

  return (
    <InputNumber
      {...props}
      disabled={!currentComponentId}
      value={currentComponent?.layout[field]}
      addonAfter="px"
      className={styles.input}
      onChange={(value) => {
        dispatch(
          actions.updateComponents({
            ...currentComponent!,
            layout: { ...currentComponent!.layout, [field]: value! },
          })
        );
      }}
    />
  );
};

export default MyInput;
