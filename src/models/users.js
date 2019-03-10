/*
 * @Author: lixiang 
 * @Date: 2018-05-16 23:47:22 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-03-10 15:06:32
 */
import { fetch, fetchAll, update, create, remove } from '../services/users';
import { message } from 'antd';
import { getAuthorized } from '../utils/sessionHelper';

export default {
  namespace: 'users',
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
      payload = Object.assign({}, payload);

      const response = yield call(create, payload);

      if (response && response.status === 'ok') {
        message.info('创建成功');
        yield yield put({ type: 'fetchAll' });
      } else {
        message.error(response.message || '创建失败');
      }
    },

    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select(state => state.users.pagination);
      payload = Object.assign(
        { currentPage: pagination.current, pageSize: pagination.pageSize },
        payload,
      );

      const response = yield call(fetch, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取用户信息出错，请重试');
      }
    },

    *fetchAll({ payload }, { call, put }) {
      payload = Object.assign({}, payload);

      const response = yield call(fetchAll, payload);

      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取用户信息出错，请重试');
      }
    },

    *remove({ payload }, { call, put }) {
      const response = yield call(remove, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll' });
      } else {
        //error
        message.error('删除用户出错');
      }
    },

    *update({ payload, nextPayload }, { call, put }) {
      const response = yield call(update, payload);
      if (response && response.status === 'ok') {
        yield put({ type: 'fetchAll', payload: nextPayload || {} });
      } else {
        //error
        message.error('更新用户新出错');
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
        if (pathname === '/users' && getAuthorized()) {
          dispatch({ type: 'units/fetchAll' });
          dispatch({ type: 'departments/fetchAll' });
          dispatch({ type: 'teams/fetchAll' });
          dispatch({ type: 'groups/fetchAll' });
          dispatch({ type: 'fetchAll', payload: query || {} });
        }
      });
    },
  },
};