/*
 * @Author: lixiang 
 * @Date: 2018-05-14 12:26:56 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-14 12:28:18
 */
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
  return request(`/api/groups?_page=${page}&_limit=10`);
}

export function fetchAllUnits() {
  return request(`/api/units`);
}

export function fetchAllDepartments(){
  return request(`/api/departments`);
}

export function remove(id){
  return request(`/api/groups/${id}`,{
    method:'DELETE'
  })
}

export function patch(id,values){
  return request(`/api/groups/${id}`,{
    method:'PATCH',
    body:values
  })
}

export function create(values){
  return request(`/api/groups`,{
    method:'PUT',
    body:values
  })
}