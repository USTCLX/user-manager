/*
 * @Author: lixiang 
 * @Date: 2019-01-06 22:01:09 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-06 22:10:15
 */

import { stringify } from 'qs';
import request from '../utils/request';

export function fetch(params) {
  return request(`/api/customers?${stringify(params)}`);
}