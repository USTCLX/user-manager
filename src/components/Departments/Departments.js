/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-15 23:55:40
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button } from 'antd';
import DepartmentModal from './DepartmentModal';
import style from './Departments.less';
// import { PAGE_SIZE } from '../../constants';

function Departments({ list: dataSource, total, page: current, loading, dispatch, unitsList }) {

  function deleteHandler(id) {
    dispatch({
      type: 'departments/remove',
      payload: {
        id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'departments/fetch',
  //     payload: {
  //       page
  //     }
  //   })
  // }

  function editHandler(id, values) {
    dispatch({
      type: 'departments/patch',
      payload: { id, values }
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'departments/create',
      payload: { values }
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
    <div className={style.normal}>
      <div>
        <div className={style.create}>
          <DepartmentModal record={{}} onOk={createHandler} unitsList={unitsList} >
            <Button type="primary">创建部门</Button>
          </DepartmentModal>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={record => record._id}
          pagination={false}
          loading={loading}
        />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { list, total, page, unitsList } = state.departments;
  return {
    list,
    total,
    page,
    loading: state.loading.models.departments,
    unitsList,
  }
}

export default connect(mapStateToProps)(Departments);