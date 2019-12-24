import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Table, Spin } from 'antd';
import { axiosAuthInstance } from "./connection";

export function DataTable() {
  const [{ currentScreen }] = useStore();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const content = await axiosAuthInstance.get(`data/${currentScreen}`);
      if (!currentScreen) {
        return;
      }
      setLoading(true);
      const columns = [];
      columns.push({
        title: "ID",
        dataIndex: "rowid",
        width: 50,
      });
      for (const column of content.data.columns) {
        columns.push({
          title: column.label,
          dataIndex: column.id,
          width: 150,
        });
      }
      const rows = content.data.rows.map((row, i) => ({...row, key: i}));
      setColumns(columns);
      setData(rows);
      setLoading(false);
    })();
  }, [currentScreen]);

  return (
    !currentScreen ? (<></>) :
    loading ? (
      <Spin tip="Loading..."></Spin>
    ) : (
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
      )
  );
}
