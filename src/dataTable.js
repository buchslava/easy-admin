import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Table, Spin, Button, Popconfirm, Modal } from 'antd';
import { axiosAuthInstance } from "./connection";

export function DataTable() {
  const [{ currentScreen }] = useStore();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [confirmEditLoading, setConfirmEditLoading] = useState(false);

  const handleEditOk = () => {
    setConfirmEditLoading(true);
    (async () => {
      const res = await axiosAuthInstance.post(`insert/${currentScreen}`, {name: "foo"});
      const newRecord = res.data;
      console.log(newRecord);
      newRecord.key = newRecord.rowid;
      setData([newRecord, ...data]);
      setConfirmEditLoading(false);
      setEditVisible(false);
    })();
  };
  const handleEditCancel = () => {
    setEditVisible(false);
  };
  const addNewRow = () => setEditVisible(true);
  const handleDelete = (recordKey) => {
    console.log(recordKey);
  };

  useEffect(() => {
    (async () => {
      if (!currentScreen) {
        return;
      }
      setLoading(true);
      const content = await axiosAuthInstance.get(`select/${currentScreen}`);
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
      columns.push({
        title: '...',
        dataIndex: 'operation',
        render: (text, record) =>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
      });

      const rows = content.data.rows.map((row, i) => ({ ...row, key: i }));
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
          <div>
            <Button onClick={addNewRow} type="primary" style={{ margin: 10 }}>
              Add a row
            </Button>
            <Button type="secondary" style={{ margin: 10 }}>
              Refresh
            </Button>
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
            <Modal
              title="---"
              visible={editVisible}
              onOk={handleEditOk}
              confirmLoading={confirmEditLoading}
              onCancel={handleEditCancel}
            >
              <div>modal</div>
            </Modal>
          </div>
        )
  );
}
