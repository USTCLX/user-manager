/*
 * @Author: lixiang 
 * @Date: 2018-11-29 23:44:39 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-01 00:03:14
 */

import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { fetchCurrent } from '../services/global';

export default {
  namespace: 'global',

  state: {
    currentUser: {},
    isAuthorized: false,
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(fetchCurrent);
      if (response && response.status === 'ok') {
        const user = response.data;
        yield put({
          type: 'save',
          payload: {
            currentUser: response.data,
            isAuthorized: user.level === "admin",
          }
        })
      } else {
        message.error('获取数据失败');

      }
    },
    *redirect({ payload }, { put, select }) {
      const { to } = payload;
      const isAuthorized = yield select(({ global }) => global.isAuthorized);
      console.log('haha', isAuthorized);
      if (!isAuthorized) {
        yield put(routerRedux.push(to));
      }
    }
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
      dispatch({
        type: 'fetchCurrent',
      });

      return history.listen(({ pathname }) => {

        if (pathname !== '/not-authorized' && pathname !== '/login') {
          dispatch({
            type: 'redirect',
            payload: {
              to: 'not-authorized',
            }
          })
        } else {

        }
      })
    },
  },
};

