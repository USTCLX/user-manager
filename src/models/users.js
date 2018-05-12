import * as usersService from '../services/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
  effects: {
    *fetch({ payload: { page = 1, limit } }, { call, put }) {
      const { data } = yield call(usersService.fetch, { page, limit });
      const {list,pagination} = data;
      // console.log('data',data);
      yield put({ type: 'save', payload: { data: list, total: pagination.total, page: parseInt(pagination.current, 10) } });
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

    *patch({ payload: { id,values } }, { call, put, select }) {
      // console.log('valuse',id);
      yield call(usersService.patch, id, values);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *create({ payload: { values } }, { call, put, select }) {
      // console.log('*create values',values);
      yield call(usersService.create, values);
      const page = yield select(state => state.user.page);
      yield yield put({ type: 'fetch', payload: { page } });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          dispatch({ type: 'fetch', payload: query || {} });
        }
      });
    },
  },
};