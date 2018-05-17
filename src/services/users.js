import request from '../utils/request';

export function fetch() {
  return request(`/api/users`);
}

export function fetchAllGroups(){
  return request(`/api/groups`);
}

export function remove(id){
  return request(`/api/users/${id}`,{
    method:'DELETE'
  })
}

export function put(id,values){
  return request(`/api/users/${id}`,{
    method:'PUT',
    body:values
  })
}

export function create(values){
  return request(`/api/users`,{
    method:'POST',
    body:values
  })
}