/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-12 20:43:11
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button, Card } from 'antd';
import DepartmentModal from './DepartmentModal';
import style from './Departments.less';

function Departments({ units, departments, loading, dispatch }) {

  // const { list, pagination: { current, total, pageSize } } = departments;
  const { list } = departments;
  const { list: unitsList } = units;

  function deleteHandler(_id) {
    dispatch({
      type: 'departments/remove',
      payload: {
        _id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'departments/fetch',
  //     payload: {
  //       currentPage: page
  //     }
  //   })
  // }

  function editHandler(_id, values) {
    dispatch({
      type: 'departments/update',
      payload: { _id, ...values },
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'departments/create',
      payload: { ...values },
    })
  }

  const columns = [
    {
      title: '部门名称',
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
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <DepartmentModal record={record} onOk={editHandler.bind(null, record._id)} unitsList={unitsList} >
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
        <DepartmentModal record={{}} onOk={createHandler} unitsList={unitsList} >
          <Button type="primary">创建部门</Button>
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

function mapStateToProps({ units, departments, loading }) {
  return {
    units,
    departments,
    loading: loading.global,
  }
}

export default connect(mapStateToProps)(Departments);