/*
 * @Author: lixiang 
 * @Date: 2018-05-14 12:28:47 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-14 12:56:15
 */
import * as groupsService from '../services/groups';

export default {
  namespace: 'groups',
  state: {
    list: [],
    total: null,
    page: null,
    unitsList: [],
    departmentsList: []
  },
  reducers: {
    save(state, { payload: { list, total, page, unitsList, departmentsList } }) {
      return { ...state, list, total, page, unitsList, departmentsList };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, limit } }, { call, put }) {
      const { data } = yield call(groupsService.fetch, { page, limit });
      const { data: unitsData } = yield call(groupsService.fetchAllUnits);
      const { data: departmentsData } = yield call(groupsService.fetchAllDepartments);
      const { list, pagination } = data;
      const { list: unitsList } = unitsData
      const { list: departmentsList } = departmentsData;
      yield put({ type: 'save', payload: { list, total: pagination.total, page, unitsList, departmentsList } });
    },

    *remove({ payload: { id } }, { call, put, select }) {
      if (!!id) {
        yield call(groupsService.remove, id);
        const page = yield select(state => state.groups.page);
        yield put({ type: 'fetch', payload: { page } })
      } else {
        // console.log('id is null')
      }
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      // console.log('valuse',id);
      yield call(groupsService.patch, id, values);
      const page = yield select(state => state.groups.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *create({ payload: { values } }, { call, put, select }) {
      // console.log('*create values',values);
      yield call(groupsService.create, values);
      const page = yield select(state => state.groups.page);
      yield yield put({ type: 'fetch', payload: { page } });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/groups') {
          dispatch({ type: 'fetch', payload: query || {} });
        }
      });
    },
  },
};