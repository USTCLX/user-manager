/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-16 01:29:38
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button } from 'antd';
import GroupModal from './GroupModal';
import style from './Groups.less';

function Groups({ list: dataSource, loading, dispatch, unitsList, departmentsList, teamsList }) {
  function deleteHandler(id) {
    dispatch({
      type: 'groups/remove',
      payload: {
        id
      }
    })
  }

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
    <div className={style.normal}>
      <div>
        <div className={style.create}>
          <GroupModal record={{}} onOk={createHandler} unitsList={unitsList} departmentsList={departmentsList} teamsList={teamsList}>
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
  const { list, total, page, unitsList, departmentsList, teamsList } = state.groups;
  return {
    list,
    total,
    page,
    loading: state.loading.models.groups,
    unitsList,
    departmentsList,
    teamsList
  }
}

export default connect(mapStateToProps)(Groups);