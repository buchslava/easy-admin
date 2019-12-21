import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { setUserProfile } from './actions';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

function LoginFormSrc(props) {
  const [{ userProfile }, dispatch] = useStore();
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        dispatch(setUserProfile({
          email: values.username
        }));
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <div style={styles.center}>
      <Form onSubmit={handleSubmit} style={styles.loginForm}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a style={styles.loginFormForgot} href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" style={styles.loginFormButton}>
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
}

const styles = {
  loginForm: {
    maxWidth: 300
  },
  loginFormForgot: {
    float: 'right'
  },
  loginFormButton: {
    width: '100%'
  },
  center: {
    padding: 15,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)'
  }
};

export const LoginForm = Form.create({ name: 'normal_login' })(LoginFormSrc);
