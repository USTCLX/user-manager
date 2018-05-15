/*
 * @Author: lixiang 
 * @Date: 2018-05-16 00:34:28 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-16 00:59:47
 */
/*
 * @Author: lixiang 
 * @Date: 2018-05-14 12:28:47 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-16 00:33:01
 */
import { message } from 'antd';
import * as organizationsService from '../services/organizations';
import { organizationType } from '../constants';

export default {
  namespace: 'teams',
  state: {
    list: [],
    unitsList: [],
    departmentsList: [],
  },
  reducers: {
    save(state, { payload: { list, unitsList, departmentsList } }) {
      // console.log('list', list, unitsList, departmentsList);
      return { ...state, list, unitsList, departmentsList };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, limit } }, { call, put }) {
      const { data } = yield call(organizationsService.fetch, organizationType.team);
      const { data: unitsData } = yield call(organizationsService.fetch, organizationType.unit);
      const { data: departmentsData } = yield call(organizationsService.fetch, organizationType.department);
      const { records: list } = data;
      const { records: unitsList } = unitsData
      const { records: departmentsList } = departmentsData;
      yield put({ type: 'save', payload: { list, unitsList, departmentsList } });
    },

    *remove({ payload: { id } }, { call, put }) {
      if (!!id) {
        yield call(organizationsService.remove, id);
        yield put({ type: 'fetch', payload: {} })
      } else {
        message.error('删除出错，id为空');
      }
    },

    *patch({ payload: { id, values } }, { call, put }) {
      // console.log('valuse',id);
      yield call(organizationsService.patch, id, values);
      yield put({ type: 'fetch', payload: {} });
    },

    *create({ payload: { values } }, { call, put }) {
      // console.log('*create values',values);
      yield call(organizationsService.create, values, organizationType.team);
      yield yield put({ type: 'fetch', payload: {} });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/teams') {
          dispatch({ type: 'fetch', payload: query || {} });
        }
      });
    },
  },
};