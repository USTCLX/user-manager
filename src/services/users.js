/*
 * @Author: lixiang 
 * @Date: 2018-07-29 17:04:19 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-07-29 17:16:45
 */

import { stringify } from 'qs';
import request from '../utils/request';

export function create(values) {
  return request(`/api/users`, {
    method: 'POST',
    body: values
  })
}

export function fetch(params) {
  return request(`/api/users?${stringify(params)}`);
}

// export function fetchAllGroups(){
//   return request(`/api/groups`);
// }

export function fetchAll(params) {
  return request(`/api/users/all?${stringify(params)}`);
}

export function update(params) {
  return request(`/api/users/${params._id}`, {
    method: 'PUT',
    body: params,
  })
}

export function remove(params) {
  return request(`/api/users/${params._id}`, {
    method: 'DELETE'
  })
}
