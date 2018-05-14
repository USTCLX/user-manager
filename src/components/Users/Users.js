/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-14 23:47:57
 */

import { connect } from 'dva';
import { Table, Popconfirm, Button } from 'antd';
import UserModal from './UserModal';
import style from './Users.less';
import { levelMap } from '../../constants';

function Users({ list: dataSource, total, page: current, loading, dispatch, unitsList = [], departmentsList = [], groupsList = [] }) {

  let options = unitsList.map((unit) => {
    let options1 = {
      label: unit.name,
      value: unit._id,
      children: []
    }
    departmentsList.forEach((department) => {
      if (department.unit._id === unit._id) {
        let options2 = {
          label: department.name,
          value: department._id,
          children: []
        }
        groupsList.forEach((group) => {
          if (group.department._id === department._id) {
            let options3 = {
              label: group.name,
              value: group._id
            }
            options2.children.push(options3)
          }
        })
        options1.children.push(options2)
      }
    })
    return options1;
  })

  dataSource.forEach((data) => {
    data.levelName = levelMap[data.level].name;
  })

  function deleteHandler(id) {
    dispatch({
      type: 'users/remove',
      payload: {
        id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'users/fetch',
  //     payload: {
  //       page
  //     }
  //   })
  // }

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
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <UserModal record={record} onOk={editHandler.bind(null, record._id)} options={options}>
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
          <UserModal record={{}} onOk={createHandler} options={options}>
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
        {/* <Pagination
          className="ant-table-pagination"
          total={total}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        /> */}
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { list, total, page, unitsList, groupsList, departmentsList } = state.users;
  return {
    list,
    total,
    page,
    loading: state.loading.models.users,
    unitsList,
    groupsList,
    departmentsList
  }
}

export default connect(mapStateToProps)(Users);