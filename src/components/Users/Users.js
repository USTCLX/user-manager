/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-13 23:09:42
 */

import { connect } from 'dva';
import { Table, Popconfirm, Button } from 'antd';
import UserModal from './UserModal';
import style from './Users.less';
import {levelMap} from '../../constants';

function Users({ list: dataSource, total, page: current, loading, dispatch ,units}) {

  dataSource.forEach((data)=>{
    data.levelName = levelMap[data.level].name;
  })

  // console.log('dataStource',dataSource);

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
          <UserModal record={record} onOk={editHandler.bind(null, record._id)}>
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
          <UserModal record={{}} onOk={createHandler}>
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
  const { list, total, page,units } = state.users;
  return {
    list,
    total,
    page,
    units,
    loading: state.loading.models.users
  }
}

export default connect(mapStateToProps)(Users);