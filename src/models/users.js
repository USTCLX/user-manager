/*
 * @Author: lixiang 
 * @Date: 2018-05-16 23:47:22 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-19 23:21:54
 */
import { message } from 'antd';
import * as usersService from '../services/users';
import * as organizationService from '../services/organizations';
import { organizationType } from '../constants'

export default {
  namespace: 'users',
  state: {
    list: [],
    unitsList: [],
    departmentsList: [],
    teamsList: [],
    groupsList: [],
  },
  reducers: {
    save(state, { payload: { list, unitsList, departmentsList, teamsList, groupsList } }) {
      return { ...state, list, unitsList, departmentsList, groupsList, teamsList };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const usersPromise = call(usersService.fetch);
      const organizationsPromise = call(organizationService.fetch, organizationType.unit);
      const departmentsPromise = call(organizationService.fetch, organizationType.department);
      const teamsPromise = call(organizationService.fetch, organizationType.team);
      const groupsPromise = call(organizationService.fetch, organizationType.group);

      const { data: {records:list} } = yield usersPromise
      const { data: {records:unitsList} } = yield organizationsPromise
      const { data: {records:departmentsList} } = yield departmentsPromise
      const { data: {records:teamsList} } = yield teamsPromise
      const { data: {records:groupsList} } = yield groupsPromise


      yield put({ type: 'save', payload: { list, groupsList, departmentsList, unitsList, teamsList } });
    },

    *remove({ payload: { id } }, { call, put }) {
      if (!!id) {
        yield call(usersService.remove, id);
        yield put({ type: 'fetch', payload: {} })
      } else {
        // console.log('id is null')
        message.error('删除出错，id为空');
      }
    },

    *patch({ payload: { id, values } }, { call, put }) {
      // console.log('valuse',id);
      yield call(usersService.put, id, values);
      yield put({ type: 'fetch', payload: {} });
    },

    *create({ payload: { values } }, { call, put }) {
      // console.log('*create values',values);
      yield call(usersService.create, values);
      yield yield put({ type: 'fetch', payload: {} });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query || {} });
        }
      });
    },
  },
};