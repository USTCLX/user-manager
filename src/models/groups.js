/*
 * @Author: lixiang 
 * @Date: 2018-05-14 12:28:47 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-01 23:11:47
 */
import { message } from 'antd';
import { create, fetch, fetchAll, update, remove } from '../services/organizations';
import { organizationType } from '../constants';
import { getAuthorized } from '../utils/sessionHelper';

export default {
  namespace: 'groups',
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
        { type: organizationType.group }
      );

      const response = yield call(create, payload);

      if (response && response.status === 'ok') {
        yield yield put({ type: 'fetch' });
      } else {
        message.error('创建失败');
      }
    },

    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.groups.pagination);
      payload = Object.assign(
        { currentPage: pagination.current, pageSize: pagination.pageSize },
        payload,
        { type: organizationType.group }
      );

      const response = yield call(fetch, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取小组信息出错，请重试');
      }
    },

    *fetchAll({ payload }, { call, put }) {
      payload = Object.assign(
        {},
        payload,
        { type: organizationType.group }
      );

      const response = yield call(fetchAll, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取小组信息出错，请重试');
      }
    },

    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll' });
      } else {
        //error
        message.error('删除小组出错');
      }
    },

    *update({ payload }, { call, put }) {
      const response = yield call(update, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll' });
      } else {
        //error
        message.error('更新小组出错');
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
        if (pathname === '/groups' && getAuthorized()) {
          dispatch({ type: 'units/fetchAll' });
          dispatch({ type: 'departments/fetchAll' });
          dispatch({ type: 'teams/fetchAll' });
          dispatch({ type: 'fetchAll', payload: query || {} });
        }
      });
    },
  },
};