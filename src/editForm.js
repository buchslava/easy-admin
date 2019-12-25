import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { Spin, Form, Input } from 'antd';
// import { axiosInstance, axiosAuthInstance } from "./connection";

const createFieldResoler = getFieldDecorator => ({
  text: (config, key) => (
    <Form.Item
      key={key}
      label={
        <span>{config.label}&nbsp;</span>
      }
    >
      {getFieldDecorator(config.id, {
        rules: config.rules,
      })(<Input />)}
    </Form.Item>
  )
});

function EditFormSrc(props) {
  const [loading, setLoading] = useState(false);
  const [{ config, currentScreen }] = useStore();
  const currentScreenConfig = !!currentScreen ? config.find(item => item.id === currentScreen) : null;
  const { form } = props;

  useEffect(() => {
    if (props.submitFlag === 0) {
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      props.handleEditOk(values);
      form.resetFields();
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
  const fieldResoler = createFieldResoler(getFieldDecorator);
  const fields = currentScreenConfig.columns.map((column, i) => {
    // console.log(column.type, fieldResoler);
    return fieldResoler[column.type](column, i);
  });

  return (
    loading ? (<Spin tip="Loading..."></Spin>) : (<Form {...formItemLayout}>{fields}</Form>)
  );
}

export const EditForm = Form.create({ name: 'editData' })(EditFormSrc);
