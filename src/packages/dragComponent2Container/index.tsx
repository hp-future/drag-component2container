import { useRef } from 'react';
import './styles.scss';
import { asideList } from './config';
import useDrag from './hooks/useDrag';
import { useAppSelector, useAppDispatch } from './store/hooks';
import LineChart from './components/charts/line';
import ViewProps from './components/viewProps';

const DragComponent2Container = () => {
  const asideRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const configData = useAppSelector((state) => state.config.data);
  const dispatch = useAppDispatch();

  // 拖拽逻辑
  const { dragStartEvent, dragOverEvent, dropEvent } = useDrag(asideRef, mainRef);

  return (
    <div className="DragComponent2Container">
      <aside ref={asideRef} onDragStart={dragStartEvent}>
        {asideList.map((item) => (
          <div key={item.title} draggable data-type={item.type}>
            <i className={'iconfont ' + item.icon}></i>
            <span>{item.title}</span>
          </div>
        ))}
      </aside>
      <main ref={mainRef} onDragOver={dragOverEvent} onDrop={dropEvent}>
        {configData.map((item) => {
          switch (item.chartProps.type) {
            case 'line':
              return <LineChart key={item.key} props={item} />;
            default:
              return null;
          }
        })}
      </main>
      <ViewProps />
    </div>
  );
};

export default DragComponent2Container;
