/*
 * @Author: lixiang 
 * @Date: 2019-01-27 16:40:06 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-27 17:53:30
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import UserModal from '../Users/UserModal';
import { statusNameMap } from '../../constants'

moment.locale('zh-cn');


@Form.create()
@connect(({ units, departments, teams, groups, users, loading }) => {
  return {
    units,
    departments,
    teams,
    groups,
    users,
    loading: loading.effects['users/fetch'],
  }
})
export default class AuditAccount extends PureComponent {


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetch',
      payload: {
        status: 'register',
      }
    })
  }

  editHandler(_id, values) {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/update',
      payload: { _id, ...values }
    })
  }

  render() {
    const { units: { list: unitsList },
      departments: { list: departmentsList },
      teams: { list: teamsList },
      groups: { list: groupsList },
      users: { list }, loading } = this.props;
    const columns = [{
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: val => statusNameMap[val],
    }, {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: val => moment(val).format('YYYY-MM-DD hh:mm'),
    }, {
      title: '操作',
      key: 'operation',
      render: (record, index) => {
        return <UserModal
          record={record}
          onOk={this.editHandler.bind(null, record._id)}
          unitsList={unitsList}
          departmentsList={departmentsList}
          teamsList={teamsList}
          groupsList={groupsList}
        >
          <a>编辑</a>
        </UserModal>
      }
    }]

    return <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        key={(record => record._id)} />
    </div>
  }
}