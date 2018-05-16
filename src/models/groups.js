/*
 * @Author: lixiang 
 * @Date: 2018-05-14 12:28:47 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-16 01:02:55
 */
import { message } from 'antd';
import * as organizationsService from '../services/organizations';
import { organizationType } from '../constants';

export default {
  namespace: 'groups',
  state: {
    list: [],
    unitsList: [],
    departmentsList: [],
    teamsList: [],
  },
  reducers: {
    save(state, { payload: { list, unitsList, departmentsList, teamsList } }) {
      return { ...state, list, unitsList, departmentsList, teamsList };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, limit } }, { call, put }) {
      const { data } = yield call(organizationsService.fetch, organizationType.group);
      const { data: unitsData } = yield call(organizationsService.fetch, organizationType.unit);
      const { data: departmentsData } = yield call(organizationsService.fetch, organizationType.department);
      const { data: teamsData } = yield call(organizationsService.fetch, organizationType.team);
      const { records: list } = data;
      const { records: unitsList } = unitsData
      const { records: departmentsList } = departmentsData;
      const { records: teamsList } = teamsData
      yield put({ type: 'save', payload: { list, unitsList, departmentsList, teamsList } });
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
      yield call(organizationsService.create, values, organizationType.group);
      yield yield put({ type: 'fetch', payload: {} });
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