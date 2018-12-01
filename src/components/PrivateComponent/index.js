/*
 * @Author: lixiang 
 * @Date: 2018-12-01 23:06:24 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-01 23:08:11
 */
import React from 'react';
import { Route, Redirect } from 'dva/react-router'
import { getAuthorized } from '../../utils/sessionHelper';

export default function PrivateRoute({ component: Component, ...rest }) {
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