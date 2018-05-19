/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-19 23:31:29
 */

import { connect } from 'dva';
import { Table, Popconfirm, Button } from 'antd';
import UserModal from './UserModal';
import style from './Users.less';
import { levelNameMap } from '../../constants';

function Users({ list: dataSource, loading, dispatch, unitsList = [], departmentsList = [], teamsList = [], groupsList = [] }) {

  dataSource.forEach((data) => {
    data.levelName = levelNameMap[data.level];
  })

  function deleteHandler(id) {
    dispatch({
      type: 'users/remove',
      payload: {
        id
      }
    })
  }


  function editHandler(id, values) {
    dispatch({
      type: 'users/patch',
      payload: { id, values }
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'users/create',
      payload: { values }
    })
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: text => <a>{text}</a>,
    }, {
      title: '职位',
      dataIndex: 'levelName',
      key: 'levelName'
    }, {
      title: '从属中心',
      dataIndex: 'parent[0].name',
      key: 'unit'
    }, {
      title: '从属部门',
      dataIndex: 'parent[1].name',
      key: 'department'
    }, {
      title: '从属战队',
      dataIndex: 'parent[2].name',
      key: 'team'
    }, {
      title: '从属小组',
      dataIndex: 'parent[3].name',
      key: 'group'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <UserModal
            record={record}
            onOk={editHandler.bind(null, record._id)}
            unitsList={unitsList}
            departmentsList={departmentsList}
            teamsList={teamsList}
            groupsList={groupsList}
          >
            <a>编辑</a>
          </UserModal>
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
          <UserModal record={{}} onOk={createHandler}
            unitsList={unitsList}
            departmentsList={departmentsList}
            teamsList={teamsList}
            groupsList={groupsList}
          >
            <Button type="primary">创建账户</Button>
          </UserModal>
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
  const { list, total, page, unitsList, groupsList, departmentsList, teamsList } = state.users;
  return {
    list,
    total,
    page,
    loading: state.loading.models.users,
    unitsList,
    groupsList,
    departmentsList,
    teamsList
  }
}

export default connect(mapStateToProps)(Users);