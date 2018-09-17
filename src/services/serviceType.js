/*
 * @Author: lixiang 
 * @Date: 2018-09-17 21:08:49 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-09-17 22:06:04
 */
// import { stringify } from 'qs';
import request from '../utils/request';

// 创建组织
export function create(params) {
  return request(`/api/serviceType`, {
    method: 'POST',
    body: params,
  })
}

// 获取组织，不分页
export function fetchAll(params) {
  return request(`/api/serviceType/all`);
}


// 更新
export function update(params) {
  return request(`/api/serviceType/${params._id}`, {
    method: 'PUT',
    body: params,
  })
}


// 删除
export function remove(params) {
  return request(`/api/serviceType/${params._id}`, {
    method: 'DELETE'
  })
}