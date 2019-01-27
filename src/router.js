import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import BasicLayout from './layouts/BasicLayout';
import HomePage from './components/HomePage/HomePage'
import Users from './components/Users/Users';
import Units from './components/Units/Units';
import Departments from './components/Departments/Departments'
import Teams from './components/Teams/Teams';
import Groups from './components/Gourps/Groups';
import ServiceType from './components/ServiceType/ServiceType';
import Customers from './components/Customers';
import ControllerStop from './components/ControllerStop';
import AuditAccount from './components/AuditAccount';
import Dashboard from './components/Dashboard';
import { getAuthorized } from './utils/sessionHelper';


function PrivateRoute({ component: Component, ...rest }) {
  const isAuthorized = getAuthorized();
  return (
    <Route
      {...rest}
      render={props => isAuthorized ? (
        <Component {...rest} />
      ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location }
            }}
          />
        )}
    />
  )
}



function RouterConfig({ history }) {
  return (
    <LocaleProvider locale={zh_CN}>
      <Router history={history}>
        <BasicLayout>

          <Switch>
            <Route path='/' exact component={HomePage} />
            <PrivateRoute path='/users' component={Users} />
            <Route path='/units' component={Units} />
            <Route path='/departments' component={Departments} />
            <Route path='/teams' component={Teams} />
            <Route path='/groups' component={Groups} />
            <Route path='/serviceType' component={ServiceType} />
            <Route path='/customers' component={Customers} />
            <Route path='/stop' component={ControllerStop} />
            <Route path='/audit' component={AuditAccount}></Route>
            <Route path='/dashboard' component={Dashboard}></Route>
          </Switch>

        </BasicLayout>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
