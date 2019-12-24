import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Table, Spin } from 'antd';
import { axiosAuthInstance } from "./connection";

export function DataTable() {
  const [{ userProfile, currentScreen }] = useStore();
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (userProfile && userProfile.token) {
        const content = await axiosAuthInstance.get("data");
        setColumns(content.data.columns);
        setData(content.data.data);
        setLoading(false);
      }
    })();
  }, [userProfile]);

  useEffect(() => {
    console.log('!!!', currentScreen);
  }, [currentScreen]);


  return (
    loading ? (
      <Spin tip="Loading..."></Spin>
    ) : (
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />
      )
  );
}
