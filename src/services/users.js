import request from '../utils/request';

export function fetch({ page = 1,limit=10 }) {
  return request(`/api/users?_page=${page}&_limit=10`);
}

export function fetchAllUnits() {
  return request(`/api/units`);
}

export function fetchAllDepartments(){
  return request(`/api/departments`);
}

export function fetchAllGroups(){
  return request(`/api/groups`);
}

export function remove(id){
  return request(`/api/users/${id}`,{
    method:'DELETE'
  })
}

export function patch(id,values){
  return request(`/api/users/${id}`,{
    method:'PATCH',
    body:values
  })
}

export function create(values){
  return request(`/api/users`,{
    method:'PUT',
    body:values
  })
}