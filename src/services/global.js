/*
 * @Author: lixiang 
 * @Date: 2018-11-30 00:07:46 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-11-30 08:06:49
 */
import request from '../utils/request';

// 获取当前用户
export async function fetchCurrent() {
  return request('/api/account/current');
}