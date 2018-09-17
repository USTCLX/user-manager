/*
 * @Author: lixiang 
 * @Date: 2018-09-17 21:33:52 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-09-17 21:34:52
 */

export default function () {
  return "xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = (c === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}