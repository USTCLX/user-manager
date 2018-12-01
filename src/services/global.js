/*
 * @Author: lixiang 
 * @Date: 2018-11-30 00:07:46 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-01 17:01:42
 */
import request from '../utils/request';

// 获取当前用户
export async function fetchCurrent() {
  return request('/api/account/current');
}

export async function login(params) {
  return request('/api/account/admin/login', {
    method: 'POST',
    body: params,
  })
}

export async function logout() {
  return request('/api/account/admin/logout');
}