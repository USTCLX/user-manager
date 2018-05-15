import { message } from 'antd'
import * as organizationsService from '../services/organizations';
import { organizationType } from '../constants';

export default {
  namespace: 'departments',
  state: {
    list: [],
    unitsList: []
  },
  reducers: {
    save(state, { payload: { records: list, unitsList } }) {
      return { ...state, list, unitsList };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(organizationsService.fetch, organizationType.department);
      const { data: unitsData } = yield call(organizationsService.fetch, organizationType.unit);
      const { records } = data;
      const { records: unitsList } = unitsData
      yield put({ type: 'save', payload: { records, unitsList } });
    },

    *remove({ payload: { id } }, { call, put }) {
      if (!!id) {
        yield call(organizationsService.remove, id);
        yield put({ type: 'fetch', payload: {} })
      } else {
        // console.log('id is null')
      }
    },

    *patch({ payload: { id, values } }, { call, put }) {
      // console.log('valuse',id);
      yield call(organizationsService.patch, id, values);
      yield put({ type: 'fetch', payload: {} });
    },

    *create({ payload: { values } }, { call, put }) {
      const { data } = yield call(organizationsService.create, values, organizationType.department);
      if (data.status === 'ok') {
        yield yield put({ type: 'fetch', payload: {} });
      } else {
        message.error('创建失败');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/departments') {
          dispatch({ type: 'fetch', payload: query || {} });
        }
      });
    },
  },
};