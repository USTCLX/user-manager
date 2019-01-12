/*
 * @Author: lixiang 
 * @Date: 2019-01-06 22:11:01 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-12 22:59:09
 */

import { fetch, update } from '../services/customers';
import { message } from 'antd';
import { getAuthorized } from '../utils/sessionHelper';


export default {
  namespace: 'customers',
  state: {
    aliWangWang: '',
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    }
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const customers = yield select(({ customers }) => customers);
      const { pagination: curPagination, aliWangWang } = customers;
      const { current, pageSize } = curPagination;
      payload = Object.assign({ currentPage: current, pageSize, aliWangWang }, payload);
      const response = yield call(fetch, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      } else if (response.status === 'error') {
        message.error(response.message || '获取数据出错');
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response && response.status === 'ok') {
        message.info('更新成功');
        yield put({
          type: 'saveOne',
          payload: {
            customer: response.data,
          },
        });
      } else if (response.status === 'error') {
        message.error(response.message || '更新出错');
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveOne(state, { payload: { customer } }) {
      return {
        ...state,
        list: state.list.map(item => {
          if (customer && (customer._id === item._id)) {
            return customer;
          } else {
            return item;
          }
        })
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