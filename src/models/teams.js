/*
 * @Author: lixiang 
 * @Date: 2018-05-16 00:34:28 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-07-29 16:53:37
 */

import { create, fetch, fetchAll, update, remove } from '../services/organizations';
import { organizationType } from '../constants';
import { message } from 'antd';


export default {
  namespace: 'teams',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    }
  },
  effects: {
    *create({ payload }, { call, put }) {
      payload = Object.assign(
        {},
        payload,
        { type: organizationType.team }
      );

      const response = yield call(create, payload);

      if (response && response.status === 'ok') {
        yield yield put({ type: 'fetch' });
      } else {
        message.error('创建失败');
      }
    },

    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.teams.pagination);
      payload = Object.assign(
        { currentPage: pagination.current, pageSize: pagination.pageSize },
        payload,
        { type: organizationType.team }
      );

      const response = yield call(fetch, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取战队信息出错，请重试');
      }
    },

    *fetchAll({ payload }, { call, put }) {
      payload = Object.assign(
        {},
        payload,
        { type: organizationType.team }
      );

      const response = yield call(fetchAll, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取战队信息出错，请重试');
      }
    },

    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll' });
      } else {
        //error
        message.error('删除中心出错');
      }
    },

    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetch' });
      } else {
        //error
        message.error('更新中心新出错');
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
        if (pathname === '/teams') {
          dispatch({ type: 'units/fetchAll' });
          dispatch({ type: 'departments/fetchAll' });
          dispatch({ type: 'fetchAll', payload: query || {} });
        }
      });
    },
  },
};