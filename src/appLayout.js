import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Layout, Menu, notification } from 'antd';
import { resetUserProfile } from './actions';
import { axiosInstance } from "./connection";
import { DataTable } from './dataTable';

const { Content, Footer, Sider } = Layout;

export function AppLayout() {
  const [{ userProfile }, dispatch] = useStore();
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

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div className="logo">
          {userProfile.username}&nbsp;|&nbsp;
        <a href="#" onClick={logout}>Logout</a>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
          <Menu.Item key="1">
            <span className="nav-text">nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <span className="nav-text">nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <span className="nav-text">nav 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
            <DataTable></DataTable>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Design ©2019</Footer>
      </Layout>
    </Layout>
  );
}
