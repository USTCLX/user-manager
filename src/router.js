import React from 'react';
import { Router, Route, Switch} from 'dva/router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import BasicLayout from './layouts/BasicLayout';
import HomePage from './components/HomePage/HomePage'
import Users from './components/Users/Users';
import Units from './components/Units/Units';
import Departments from './components/Departments/Departments'
import Teams from './components/Teams/Teams';
import Groups from './components/Gourps/Groups';


function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zh_CN}>
      <Router history={history}>
        <BasicLayout>

          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/users" component={Users} />
            <Route path="/units" component={Units}></Route>
            <Route path="/departments" component={Departments}></Route>
            <Route path='/teams' component={Teams}></Route>
            <Route path="/groups" component={Groups}></Route>
          </Switch>

        </BasicLayout>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
