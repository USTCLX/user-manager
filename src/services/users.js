import request from '../utils/request';

export function fetch({ page = 1,limit=10 }) {
  return request(`/api/users?_page=${page}&_limit=10`);
}

export function remove(id){
  return request(`/api/users:${id}`,{
    method:'DELETE'
  })
}

export function patch(id,values){
  return request(`/api/users:${id}`,{
    method:'PATCH',
    body:JSON.stringify(values)
  })
}

export function create(values){
  return request(`/api/user`,{
    method:'POST',
    body:JSON.stringify(values)
  })
}