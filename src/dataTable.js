import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useStore } from "./store";
import { Table, Button, Modal, Popconfirm } from "antd";
import { axiosAuthInstance } from "./connection";
import { EditForm } from "./editForm";

export function DataTable(props) {
  const [{ config, currentScreen }] = useStore();
  const [editVisible, setEditVisible] = useState(false);
  const [confirmEditLoading] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(0);
  const [columns, setColumns] = useState();
  const [data, setData] = useState();
  const [deleteRequest, setDeleteRequest] = useState(0);
  const [currentRecordId, setCurrentRecordId] = useState(0);

  useEffect(() => {
    doDelete(deleteRequest);
  }, [deleteRequest]);

  useEffect(() => {
    if (editVisible) {
      (async () => {
        const currentScreenConfig = !!currentScreen ? config.find(item => item.id === currentScreen) : null;
        const relations = currentScreenConfig.columns.filter(column => !!column.relation).map(column => column.relation);

        const res = await axiosAuthInstance.post(`relations`, relations);

        console.log(res);
      })();
    }
  }, [editVisible]);

  useEffect(() => {
    if (props.columns && props.data) {
      const columns = [];
      columns.push({
        title: "ID",
        dataIndex: "rowid",
        width: 50,
      });
      for (const column of props.columns) {
        columns.push({
          title: column.label,
          dataIndex: column.id,
          width: 150,
        });
      }
      columns.push({
        title: '...',
        width: 200,
        dataIndex: 'operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={() => handleEdit(record.key)}>Edit</a>&nbsp;|&nbsp;
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          </span>
        )
      });
      setColumns(columns);
      const data = props.data.rows.map(row => ({ ...row, key: row.rowid }));
      setData(data);
    }
  }, [props.columns, props.data]);

  const currentScreenConfig = !!currentScreen ? config.find(item => item.id === currentScreen) : null;

  const handleDelete = rowid => setDeleteRequest(rowid);

  const handleEdit = rowid => {
    setCurrentRecordId(rowid);
    setEditVisible(true)
  };

  const doDelete = rowid => {
    (async () => {
      if (currentScreen) {
        await axiosAuthInstance.get(`delete/${currentScreen}/${rowid}`);
        let rows = [...data.filter(record => record.key !== rowid)];
        setData(rows);
      }
    })();
  };

  const doEditOk = () => {
    setSubmitFlag(submitFlag + 1);
  };

  const handleEditOk = (formData) => {
    (async () => {
      if (currentRecordId === 0) {
        const res = await axiosAuthInstance.post(`insert/${currentScreen}`, formData);
        const newRecord = res.data;
        newRecord.key = newRecord.rowid;
        setData([newRecord, ...data]);
      } else {
        const res = await axiosAuthInstance.post(`update/${currentScreen}/${currentRecordId}`, formData);
        const index = data.findIndex(record => record.rowid === currentRecordId);
        data[index] = { ...res.data, rowid: currentRecordId, key: currentRecordId };
        setData(data);
      }
      setEditVisible(false);
    })();
  };

  const handleEditCancel = () => {
    setEditVisible(false);
  };

  const addNewRow = () => {
    setCurrentRecordId(0);
    setEditVisible(true);
  }

  return (
    !currentScreen || !columns ? (<></>) :
      <div>
        <Button onClick={addNewRow} type="primary" style={{ margin: 10 }}>New</Button>
        <Button type="secondary" style={{ margin: 10 }}>Refresh</Button>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 50 }}
          scroll={{ y: 240 }} />
        <Modal
          title={currentScreenConfig.label}
          visible={editVisible}
          onOk={doEditOk}
          confirmLoading={confirmEditLoading}
          onCancel={handleEditCancel}>
          <EditForm recordId={currentRecordId} submitFlag={submitFlag} handleEditOk={handleEditOk}></EditForm>
        </Modal>
      </div>
  )
}
