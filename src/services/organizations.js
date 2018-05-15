/*
 * @Author: lixiang 
 * @Date: 2018-05-15 22:10:53 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-15 22:47:05
 */

import request from '../utils/request';

export function fetch(type) {
  return request(`/api/organizations?_type=${type}`);
}

export function remove(id) {
  return request(`/api/organizations/${id}`, {
    method: 'DELETE'
  })
}

export function patch(id, values) {
  return request(`/api/organizations/${id}`, {
    method: 'PATCH',
    body: values
  })
}

export function create(values, type) {
  let newVal = Object.assign({}, values);
  newVal.type = type;
  return request(`/api/organizations`, {
    method: 'PUT',
    body: newVal,
  })
}