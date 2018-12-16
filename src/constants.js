/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:11:13 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-16 22:26:43
 */


export const levelMap = [
  { value: 'operator', name: '组员' },
  { value: 'groupLeader', name: '组长' },
  { value: 'director', name: '主管' },
  { value: 'manager', name: '经理' }
]

export const levelNameMap = {
  operator: '运营',
  groupLeader: '组长',
  director: '主管',
  manager: '经理'
}

export const organizationType = {
  unit: 'unit',
  department: 'department',
  team: 'team',
  group: 'group',
};

export const statusNameMap = {
  normal: '正常',
  frozen: '停用',
}

export const PAGE_SIZE = 10;