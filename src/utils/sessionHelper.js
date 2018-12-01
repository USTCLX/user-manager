/*
 * @Author: lixiang 
 * @Date: 2018-12-01 17:03:18 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-01 23:10:23
 */


export function setAuthorized(isAuthorized) {
  window.sessionStorage.setItem('isAuthorized', !!isAuthorized);
}

export function getAuthorized() {
  return window.sessionStorage.getItem('isAuthorized');
}

export function clearAuthorized() {
  window.sessionStorage.removeItem('isAuthorized');
}
