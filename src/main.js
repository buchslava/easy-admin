import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { useStore } from './store';
import { LoginForm } from './login';
import { AppLayout } from './appLayout';

export function Main(props) {
  const [{ userProfile }] = useStore();

  React.useEffect(() => {
    if (userProfile === null) {
      localStorage.removeItem('userProfile');
    } else {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const out = !userProfile ? (
    <LoginForm></LoginForm>
  ) : (
      <AppLayout></AppLayout>
    );


  return out;
}
