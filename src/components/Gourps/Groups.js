/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-13 21:23:00
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button, Card } from 'antd';
import GroupModal from './GroupModal';
import style from './Groups.less';

function Groups({ units, departments, teams, groups, loading, dispatch }) {

  // const { list, pagination: { current, total, pageSize } } = groups;
  const { list } = groups;
  const { list: unitsList } = units;
  const { list: departmentsList } = departments;
  const { list: teamsList } = teams;

  function deleteHandler(_id) {
    dispatch({
      type: 'groups/remove',
      payload: {
        _id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'goups/fetch',
  //     payload: {
  //       currentPage: page
  //     }
  //   })
  // }

  function editHandler(_id, values) {
    dispatch({
      type: 'groups/update',
      payload: { _id, ...values }
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'groups/create',
      payload: { ...values }
    })
  }

  const columns = [
    {
      title: '小组名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    }, {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm')}</span>,
    }, {
      title: '修改日期',
      dataIndex: 'lastModifiedTime',
      key: 'lastModifiedTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm')}</span>,
    }, {
      title: '从属中心',
      dataIndex: 'parent[0].name',
      key: 'unit',
    }, {
      title: '从属部门',
      dataIndex: 'parent[1].name',
      key: 'department',
    },
    {
      title: '从属战队',
      dataIndex: 'parent[2].name',
      key: 'team',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <GroupModal record={record} onOk={editHandler.bind(null, record._id)} unitsList={unitsList} departmentsList={departmentsList} teamsList={teamsList} >
            <a>编辑</a>
          </GroupModal>
          <Popconfirm title="确定删除？" onConfirm={deleteHandler.bind(null, record._id)}>
            <a href="">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]

  return (
    <Card bordered={false}>
      <div className={style.create}>
        <GroupModal record={{}} onOk={createHandler} unitsList={unitsList} departmentsList={departmentsList} teamsList={teamsList}>
          <Button type="primary">创建小组</Button>
        </GroupModal>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        rowKey={record => record._id}
        pagination={false}
        loading={loading}
      />
    </Card>

  )
}

function mapStateToProps({ units, departments, teams, groups, loading }) {
  return {
    units,
    departments,
    teams,
    groups,
    loading: loading.global,
  }
}

export default connect(mapStateToProps)(Groups);