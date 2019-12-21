import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Main } from './main';

import { StoreProvider } from "./store";
import reducers from "./reducers"
import initialState from "./store/initialState"

const Root = () => {
  return (
    <StoreProvider initialState={initialState} reducer={reducers}>
      <Main></Main>
    </StoreProvider>
  );
}

ReactDOM.render(Root(), document.getElementById('root'));
