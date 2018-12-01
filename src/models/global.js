/*
 * @Author: lixiang 
 * @Date: 2018-11-29 23:44:39 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-02 01:01:49
 */

import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { login, logout } from '../services/global';
import { clearAuthorized, setAuthorized, getAuthorized } from '../utils/sessionHelper';

export default {
  namespace: 'global',

  state: {
    currentUser: {},
  },

  effects: {
    *redirect({ payload }, { put }) {
      yield put(routerRedux.push('/'));
      if (payload.message) {
        message.error(payload.message);
      }
    },
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response && response.status === 'ok') {
        if (payload.next) {
          payload.next();
        }
        setAuthorized(response.data.isAuthorized);
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error(response.message || "登录出错");
      }
    },
    *logout(_, { call, put }) {
      yield call(logout);
      yield put({
        type: 'save',
        payload: {
          currentUser: {},
        }
      })
      clearAuthorized();
      yield put(routerRedux.push('/'));
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname !== '/') {
          if (!getAuthorized()) {
            dispatch({
              type: 'redirect',
              payload: {
                message: '请登录',
              }
            })
          }
        }
      })
    },
  },
};

