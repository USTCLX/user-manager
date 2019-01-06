/*
 * @Author: lixiang 
 * @Date: 2019-01-06 22:11:01 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-06 22:53:15
 */

import { fetch } from '../services/customers';
import { message } from 'antd';
import { getAuthorized } from '../utils/sessionHelper';


export default {
  namespace: 'customers',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    }
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const curPagination = yield select(({ customers }) => customers.pagination);
      const { current, pageSize } = curPagination;
      payload = Object.assign({ currentPage: current, pageSize }, payload);
      const response = yield call(fetch, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else if (response.status === 'error') {
        message.error(response.message || '获取数据出错');
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/customers' && getAuthorized()) {
          dispatch({ type: 'fetch' });
        }
      });
    }
  }
}