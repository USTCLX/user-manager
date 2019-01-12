/*
 * @Author: lixiang 
 * @Date: 2019-01-06 22:01:09 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-12 22:52:18
 */

import { stringify } from 'qs';
import request from '../utils/request';

export async function fetch(params) {
  return request(`/api/customers?${stringify(params)}`);
}

// 更新客户信息
export async function update(params) {
  return request(`/api/customers/${params._id}`, {
    method: 'PUT',
    body: params,
  });
}