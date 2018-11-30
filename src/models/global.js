/*
 * @Author: lixiang 
 * @Date: 2018-11-29 23:44:39 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-11-30 08:07:08
 */

import { fetchCurrent } from '../services/global';

export default {
  namespace: 'global',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(fetchCurrent);
      console.log('response', response);
      if (response && response.status === 'ok') {

      } else {

      }
    },
  },

  reducers: {
    // save(state, { payload }) {
    //   return {
    //     ...state,
    //     collapsed: payload,
    //   };
    // },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      console.log('put');
      dispatch({
        type: 'fetchCurrent',
      });
    },
  },
};
