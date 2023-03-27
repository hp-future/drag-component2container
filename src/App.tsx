import { useState } from 'react';
import './App.css';
import 'antd/dist/reset.css';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import DragComponent2Container from './packages/dragComponent2Container';

function App() {
  const [count, setCount] = useState(0);

  return (
    <ConfigProvider locale={zhCN}>
      <div className="App">
        <DragComponent2Container />
      </div>
    </ConfigProvider>
  );
}

export default App;
