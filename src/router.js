import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import BasicLayout from './layouts/BasicLayout';


function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zh_CN}>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={BasicLayout} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
