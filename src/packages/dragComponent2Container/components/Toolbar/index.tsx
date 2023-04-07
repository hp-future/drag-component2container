import styles from './style.module.less';
import { Button, Modal, Popover, Descriptions } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { actions } from '../../store/slice';

const Toolbar = () => {
  const { history, components } = useAppSelector((state) => state.dragComponent);
  const dispatch = useAppDispatch();

  /**
   * 撤销
   */
  function onUndo() {
    dispatch(actions.undo());
  }

  /**
   * 恢复
   */
  function onRedo() {
    dispatch(actions.redo());
  }

  /**
   * 清空
   */
  function onClear() {
    Modal.confirm({
      title: '温馨提示',
      content: '确定要清空所有组件吗',
      zIndex: 10000,
      onOk() {
        dispatch(actions.clear());
      },
    });
  }

  const help = (
    <Descriptions column={1}>
      <Descriptions.Item label="ctrl+鼠标左键">激活移动缩放功能</Descriptions.Item>
    </Descriptions>
  );

  return (
    <div
      className={styles.toolbar}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        size="small"
        type="primary"
        onClick={onUndo}
        style={{ borderRadius: 0 }}
        disabled={history.undo.length === 0}
      >
        撤销
      </Button>
      <Button
        size="small"
        type="primary"
        onClick={onRedo}
        style={{ borderRadius: 0 }}
        disabled={history.redo.length === 0}
      >
        恢复
      </Button>
      <Button
        size="small"
        type="primary"
        onClick={onClear}
        danger
        style={{ borderRadius: 0 }}
        disabled={components.length === 0}
      >
        清空
      </Button>
      {/* 用户帮助 */}
      <Popover
        content={help}
        title="用户帮助"
        placement="bottomRight"
        trigger="click"
        overlayInnerStyle={{ width: '300px' }}
      >
        <QuestionCircleOutlined title="用户帮助" style={{ margin: '0 10px', cursor: 'help' }} />
      </Popover>
    </div>
  );
};

export default Toolbar;
