/*
 * @Author: lixiang 
 * @Date: 2019-01-13 21:42:55 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-13 22:44:04
 */
import { fetchStop, toggleStop } from '../services/controller';
import { message } from 'antd';
import { getAuthorized } from '../utils/sessionHelper';


export default {
  namespace: 'controller',
  state: {
    stopList: [],
  },

  effects: {
    *fetchStop(_, { call, put }) {
      const response = yield call(fetchStop);
      if (response && response.status === 'ok') {
        yield put({
          type: 'save',
          payload: response.data,
        })
      } else {
        message.error('获取数据出错');
      }
    },
    *toggleStop(_, { call, put }) {
      const response = yield call(toggleStop);
      if (response && response.status === 'ok') {
        yield put({
          type: 'fetchStop',
        })
      } else {
        message.error('获取数据出错');
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state, stopList: payload.list,
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/stop' && getAuthorized()) {
          dispatch({ type: 'fetchStop' });
        }
      });
    },
  },
}