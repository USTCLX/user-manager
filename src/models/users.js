import * as usersService from '../services/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: null,
    groupsList: [],
    departmentsList: [],
    unitsList: [],
  },
  reducers: {
    save(state, { payload: { data: list, total, page, groupsList, departmentsList, unitsList } }) {
      return { ...state, list, total, page, groupsList, departmentsList, unitsList };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, limit } }, { call, put }) {
      const { data } = yield call(usersService.fetch, { page, limit });
      const { list, pagination } = data;
      const { data: groupsData } = yield call(usersService.fetchAllGroups);
      const { data: departmentsData } = yield call(usersService.fetchAllDepartments);
      const { data: unitsData } = yield call(usersService.fetchAllUnits);
      const { list: groupsList } = groupsData;
      const { list: departmentsList } = departmentsData;
      const { list: unitsList } = unitsData;
      yield put({ type: 'save', payload: { data: list, total: pagination.total, page, groupsList, departmentsList, unitsList}} );
    },

    *remove({ payload: { id } }, { call, put, select }) {
      if (!!id) {
        yield call(usersService.remove, id);
        const page = yield select(state => state.users.page);
        yield put({ type: 'fetch', payload: { page } })
      } else {
        // console.log('id is null')
      }
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      // console.log('valuse',id);
      yield call(usersService.patch, id, values);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *create({ payload: { values } }, { call, put, select }) {
      // console.log('*create values',values);
      yield call(usersService.create, values);
      const page = yield select(state => state.users.page);
      yield yield put({ type: 'fetch', payload: { page } });
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