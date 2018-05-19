/*
 * @Author: lixiang 
 * @Date: 2018-05-15 22:20:54 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-19 23:21:20
 */
import * as organizationService from '../services/organizations';
import { organizationType } from '../constants';

export default {
  namespace: 'units',
  state: {
    list: [],
  },
  reducers: {
    save(state, { payload: { records: list } }) {
      return { ...state, list };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(organizationService.fetch, organizationType.unit);
      if (data && data.status === 'ok') {
        const { records } = data;
        yield put({ type: 'save', payload: { records } });
      } else {
        //error
      }
    },

    *remove({ payload: { id } }, { call, put }) {
      if (!!id) {
        const { data } = yield call(organizationService.remove, id);
        if (data && data.status === 'ok') {
          yield put({ type: 'fetch', payload: {} })
        } else {
          //error
        }
      } else {
        //error
      }
    },

    *patch({ payload: { id, values } }, { call, put }) {
      // console.log('patch', id, values);
      const { data } = yield call(organizationService.put, id, values);
      if (data && data.status === 'ok') {
        yield put({ type: 'fetch', payload: {} });
      } else {
        //error
      }
    },

    *create({ payload: { values } }, { call, put }) {
      const { data } = yield call(organizationService.create, values, organizationType.unit);
      if(data&&data.status==='ok'){
        yield yield put({ type: 'fetch', payload: {} });
      }else{
        //error
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/units') {
          dispatch({ type: 'fetch', payload: query || {} });
        }
      });
    },
  },
};