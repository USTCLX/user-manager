/*
 * @Author: lixiang 
 * @Date: 2018-05-15 22:10:53 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-07-29 17:04:50
 */
import { stringify } from 'qs';
import request from '../utils/request';

// 创建组织
export function create(params) {
  return request(`/api/organizations`, {
    method: 'POST',
    body: params,
  })
}

// 获取组织，会分页
export function fetch(params) {
  return request(`/api/organizations?${stringify(params)}`);
}

// 获取组织，不分页
export function fetchAll(params) {
  return request(`/api/organizations/all?${stringify(params)}`);
}


// 更新
export function update(params) {
  return request(`/api/organizations/${params._id}`, {
    method: 'PUT',
    body: params,
  })
}


// 删除
export function remove(params) {
  return request(`/api/organizations/${params._id}`, {
    method: 'DELETE'
  })
}
