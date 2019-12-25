import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Layout, Menu, notification, Spin, Form, Input } from 'antd';
import { resetUserProfile, setCurrentScreen } from './actions';
import { axiosInstance, axiosAuthInstance } from "./connection";
import { DataTable } from './dataTable';

const { Content, Footer, Sider } = Layout;

function EditFormSrc(props) {
  const [loading, setLoading] = useState(false);
  const [{ config, currentScreen }] = useStore();
  const currentScreenConfig = !!currentScreen ? config.find(item => item.id === currentScreen) : null;
  const { form } = props;

  // console.log(currentScreenConfig, form, props);  

  useEffect(() => {
    if (props.submitFlag === 0) {
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      props.handleEditOk(values)
    });
  }, [props.submitFlag]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const { getFieldDecorator } = props.form;

  return (
    loading ? (
      <Spin tip="Loading..."></Spin>
    ) : (
        <Form {...formItemLayout}>
          <Form.Item
            label={
              <span>Nickname&nbsp;</span>
            }
          >
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
            })(<Input />)}
          </Form.Item>
        </Form>
      )
  );
}

export const EditForm = Form.create({ name: 'editData' })(EditFormSrc);
