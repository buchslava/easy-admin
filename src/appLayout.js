import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Layout, Menu, notification, Spin, Avatar, Button, Row, Col, Card, Popconfirm } from 'antd';
import { resetUserProfile, setCurrentScreen, setConfig } from './actions';
import { axiosInstance, axiosAuthInstance } from "./connection";
import { DataTable } from './dataTable';

const { Content, Footer, Sider } = Layout;

export function AppLayout() {
  const [{ userProfile, currentScreen, config }, dispatch] = useStore();
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const logout = async () => {
    try {
      await axiosInstance.get("logout");
      dispatch(resetUserProfile());
    } catch (e) {
      notification.open({
        message: "Logout",
        description: "Logout error. Perhaps this session is invalidated."
      });
    }
  };
  const selectMenuItem = (menuId) => dispatch(setCurrentScreen(menuId));

  useEffect(() => {
    (async () => {
      if (!config) {
        setLoading(true);
        const content = await axiosAuthInstance.get("global-config");
        dispatch(setConfig(content.data));
        sessionStorage.setItem('config', JSON.stringify(content.data));
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!currentScreen) {
        return;
      }
      setDataLoading(true);
      const content = await axiosAuthInstance.get(`select/${currentScreen}`);
      setColumns(content.data.columns);
      setData(content.data);
      setDataLoading(false);
    })();
  }, [currentScreen]);

  return (
    loading || !config ? (
      <Spin tip="Loading..."></Spin>
    ) : (
        <Layout>
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <Row>
              <Col>
                <Card style={{ backgroundColor: '#7265e6', textAlign: 'center', border: 'none' }}>
                  <Avatar style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }} size="large">
                    {userProfile.username}
                  </Avatar>
                  <Button
                    size="small"
                    style={{ marginLeft: 16, verticalAlign: 'middle' }}
                    onClick={logout}>
                    logout
                  </Button>
                </Card>
              </Col>
            </Row>
            <Menu theme="dark" mode="inline">
              {config.map((value, index) => {
                return <Menu.Item key={index} onClick={() => selectMenuItem(value.id)}>
                  <span className="nav-text">{value.label}</span>
                </Menu.Item>
              })}
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
              <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                <DataTable columns={columns} data={data}></DataTable>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Design ©2019</Footer>
          </Layout>
        </Layout>
      )
  );
}
