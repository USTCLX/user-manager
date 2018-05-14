/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-14 12:55:07
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button } from 'antd';
import GroupModal from './GroupModal';
import style from './Groups.less';

function Groups({ list: dataSource, total, page: current, loading, dispatch, unitsList,departmentsList }) {

  function deleteHandler(id) {
    dispatch({
      type: 'groups/remove',
      payload: {
        id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'groups/fetch',
  //     payload: {
  //       page
  //     }
  //   })
  // }

  function editHandler(id, values) {
    dispatch({
      type: 'groups/patch',
      payload: { id, values }
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'groups/create',
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
      dataIndex:'department.unit.name',
      key:'unit',
    }, {
      title: '从属部门',
      dataIndex:'department.name',
      key:'group',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <GroupModal record={record} onOk={editHandler.bind(null, record._id)} unitsList={unitsList} departmentsList={departmentsList} >
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
    <div className={style.normal}>
      <div>
        <div className={style.create}>
          <GroupModal record={{}} onOk={createHandler} unitsList={unitsList} departmentsList={departmentsList}>
            <Button type="primary">创建小组</Button>
          </GroupModal>
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
  const { list, total, page, unitsList ,departmentsList} = state.groups;
  return {
    list,
    total,
    page,
    loading: state.loading.models.departments,
    unitsList,
    departmentsList
  }
}

export default connect(mapStateToProps)(Groups);