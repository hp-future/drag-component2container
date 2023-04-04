import styles from './style.module.less';
import { Table, TableColumnsType } from 'antd';
import { useRef, useState } from 'react';
import useResizeChange from './hook/useResizeChange';

const MyTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const columns: TableColumnsType<{}> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Address', dataIndex: 'address' },
  ];
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 监听表格容器的大小变化
  const rect = useResizeChange(tableContainerRef);

  return (
    <div className={styles.MyTable} ref={tableContainerRef}>
      <Table columns={columns} dataSource={dataSource} size="small" style={{ height: rect.height + 'px' }} />
    </div>
  );
};

export default MyTable;
