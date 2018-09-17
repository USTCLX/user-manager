/*
 * @Author: lixiang 
 * @Date: 2018-09-17 21:10:54 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-09-17 22:29:38
 */

import { create, fetchAll, update, remove } from '../services/serviceType';
import { message } from 'antd';

export default {
  namespace: 'serviceType',
  state: {
    list: [],
  },
  effects: {

    // 创建组织
    *create({ payload }, { call, put }) {
      payload = Object.assign({}, payload);

      const response = yield call(create, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('创建套餐出错，请重试');
      }
    },
    *fetchAll({ payload }, { call, put }) {
      payload = Object.assign({}, payload);

      const response = yield call(fetchAll, payload);

      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取套餐信息出错，请重试');
      }
    },

    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        //error
        message.error('删除套餐出错');
      }
    },

    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        //error
        message.error('更新套餐新出错');
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/serviceType') {
          dispatch({ type: 'fetchAll', payload: query || {} });
        }
      });
    },
  },
};