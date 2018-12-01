/*
 * @Author: lixiang 
 * @Date: 2018-05-15 22:20:54 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-01 23:12:26
 */
import { create, fetch, fetchAll, update, remove } from '../services/organizations';
import { organizationType } from '../constants';
import { message } from 'antd';
import { getAuthorized } from '../utils/sessionHelper';

export default {
  namespace: 'units',
  state: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    }
  },
  effects: {

    // 创建组织
    *create({ payload }, { call, put }) {
      payload = Object.assign(
        {},
        payload,
        { type: organizationType.unit });

      const response = yield call(create, payload);

      if (response && response.status === 'ok') {
        yield put({ type: 'fetch', payload: {} });
      } else {
        message.error('创建中心出错，请重试');
      }
    },

    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.units.pagination);
      payload = Object.assign(
        { currentPage: pagination.current, pageSize: pagination.pageSize },
        payload,
        { type: organizationType.unit }
      );

      const response = yield call(fetch, payload);

      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取中心信息出错，请重试');
      }
    },
    *fetchAll({ payload }, { call, put }) {
      payload = Object.assign(
        {},
        payload,
        { type: organizationType.unit }
      );

      const response = yield call(fetchAll, payload);

      if (response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取中心信息出错，请重试');
      }
    },

    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll' })
      } else {
        //error
        message.error('删除中心出错');
      }
    },

    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll' });
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
        if (pathname === '/units' && getAuthorized()) {
          dispatch({ type: 'fetchAll', payload: query || {} });
        }
      });
    },
  },
};