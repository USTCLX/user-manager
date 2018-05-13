/*
 * @Author: lixiang 
 * @Date: 2018-05-13 20:07:29 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-13 21:58:58
 */
/*
 * @Author: lixiang 
 * @Date: 2018-05-13 17:08:22 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-13 17:08:48
 */

import request from '../utils/request';

export function fetch({ page = 1,limit=10 }) {
  return request(`/api/departments?_page=${page}&_limit=10`);
}

export function fetchAllUnits() {
  return request(`/api/units`);
}

export function remove(id){
  return request(`/api/departments/${id}`,{
    method:'DELETE'
  })
}

export function patch(id,values){
  return request(`/api/departments/${id}`,{
    method:'PATCH',
    body:values
  })
}

export function create(values){
  return request(`/api/departments`,{
    method:'PUT',
    body:values
  })
}