/*
 * @Author: lixiang
 * @Date: 2019-01-13 22:22:41
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-13 22:25:44
 */
import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchStop(params) {
  return request(`/api/controller/stop?${stringify(params)}`);
}

export async function toggleStop(params) {
  return request(`/api/controller/stop`, {
    method: 'POST',
    body: params,
  })
}