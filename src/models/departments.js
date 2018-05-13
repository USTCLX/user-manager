import * as departmentsService from '../services/departments';

export default {
  namespace: 'departments',
  state: {
    list: [],
    total: null,
    page: null,
    unitsList: []
  },
  reducers: {
    save(state, { payload: { list, total, page, unitsList } }) {
      return { ...state, list, total, page, unitsList };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, limit } }, { call, put }) {
      const { data } = yield call(departmentsService.fetch, { page, limit });
      const { data: unitsData } = yield call(departmentsService.fetchAllUnits);
      const { list, pagination } = data;
      const { list: unitsList } = unitsData
      yield put({ type: 'save', payload: { list, total: pagination.total, page, unitsList } });
    },

    *remove({ payload: { id } }, { call, put, select }) {
      if (!!id) {
        yield call(departmentsService.remove, id);
        const page = yield select(state => state.departments.page);
        yield put({ type: 'fetch', payload: { page } })
      } else {
        // console.log('id is null')
      }
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      // console.log('valuse',id);
      yield call(departmentsService.patch, id, values);
      const page = yield select(state => state.departments.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *create({ payload: { values } }, { call, put, select }) {
      // console.log('*create values',values);
      yield call(departmentsService.create, values);
      const page = yield select(state => state.departments.page);
      yield yield put({ type: 'fetch', payload: { page } });
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