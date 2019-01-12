/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-12 20:47:24
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button, Card } from 'antd';
import DepartmentModal from './TeamModal';
import style from './Teams.less';

function Teams({ units, departments, teams, loading, dispatch }) {

  const { list } = teams;
  const { list: unitsList } = units;
  const { list: departmentsList } = departments;

  function deleteHandler(_id) {
    dispatch({
      type: 'teams/remove',
      payload: {
        _id
      }
    })
  }

  function editHandler(_id, values) {
    dispatch({
      type: 'teams/update',
      payload: { _id, ...values },
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'teams/create',
      payload: { ...values }
    })
  }

  const columns = [
    {
      title: '战队名称',
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
    },
    {
      title: '从属部门',
      dataIndex: 'parent[1].name',
      key: 'department',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <DepartmentModal record={record} onOk={editHandler.bind(null, record._id)} unitsList={unitsList} departmentsList={departmentsList} >
            <a>编辑</a>
          </DepartmentModal>
          <Popconfirm title="确定删除？" onConfirm={deleteHandler.bind(null, record._id)}>
            <a href="">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]

  return (
    <Card>
      <div className={style.create}>
        <DepartmentModal record={{}} onOk={createHandler} unitsList={unitsList} departmentsList={departmentsList} >
          <Button type="primary">创建战队</Button>
        </DepartmentModal>
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

function mapStateToProps({ units, departments, teams, loading }) {
  return {
    units,
    departments,
    teams,
    loading: loading.global,
  }
}

export default connect(mapStateToProps)(Teams);