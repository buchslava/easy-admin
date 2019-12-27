import React, { useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useStore } from "./store";
import { Form, Input } from "antd";
import { axiosAuthInstance } from "./connection";

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
  const [{ config, currentScreen }] = useStore();
  const currentScreenConfig = !!currentScreen ? config.find(item => item.id === currentScreen) : null;
  const { form, recordId } = props;

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

  useEffect(() => {
    if (recordId > 0) {
      (async () => {
        const res = await axiosAuthInstance.get(`record/${currentScreen}/${recordId}`);
        const formOnlyValues = currentScreenConfig.columns.map(column => column.id).reduce((acc, columnId) => {
          acc[columnId] = res.data.rows[columnId];
          return acc;
        }, {});
        form.setFieldsValue(formOnlyValues);
      })();
    }
  }, [recordId]);

  const { getFieldDecorator } = props.form;
  const fieldResoler = createFieldResoler(getFieldDecorator);
  const fields = currentScreenConfig.columns.map((column, i) => {
    // console.log(column.type, fieldResoler);
    return fieldResoler[column.type](column, i);
  });

  return (
    <Form {...formItemLayout}>{fields}</Form>
  );
}

export const EditForm = Form.create({ name: 'editData' })(EditFormSrc);
