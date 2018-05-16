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
      const { data: usersData } = yield call(usersService.fetch);
      const { data: unitsData } = yield call(organizationService.fetch, organizationType.unit);
      const { data: departmentsData } = yield call(organizationService.fetch, organizationType.department);
      const { data: teamsData } = yield call(organizationService.fetch, organizationType.team);
      const { data: groupsData } = yield call(organizationService.fetch, organizationType.group);

      const { records: list } = usersData
      const { records: unitsList } = unitsData;
      const { records: departmentsList } = departmentsData;
      const { records: teamsList } = teamsData;
      const { records: groupsList } = groupsData;
      yield put({ type: 'save', payload: { list, groupsList, departmentsList, unitsList, teamsList } });
    },

    *remove({ payload: { id } }, { call, put }) {
      if (!!id) {
        yield call(usersService.remove, id);
        yield put({ type: 'fetch', payload: {} })
      } else {
        // console.log('id is null')
      }
    },

    *patch({ payload: { id, values } }, { call, put }) {
      // console.log('valuse',id);
      yield call(usersService.patch, id, values);
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