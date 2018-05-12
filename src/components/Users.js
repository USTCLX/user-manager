/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-12 09:21:47
 */

import { connect } from 'dva';
import { Table, Pagination, Popconfirm, Button } from 'antd';
import UserModal from './UserModal';
import style from './Users.less';
import { PAGE_SIZE } from '../constants';

function Users({ list: dataSource, total, page: current, loading, dispatch }) {
  function deleteHandler(id) {
    dispatch({
      type: 'users/remove',
      payload: {
        id
      }
    })
  }

  function pageChangeHandler(page) {
    dispatch({
      type: 'users/fetch',
      payload: {
        page
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
      dataIndex: 'name',
      key: 'name',
      render: text => <a href="">{text}</a>,
    }, {
      titile: '邮箱',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: '网站',
      dataIndex: '网站',
      key: 'website'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => (
        <span className={style.operation}>
          <UserModal record={record} onOk={editHandler.bind(null, record.id)}>
            <a>编辑</a>
          </UserModal>
          <Popconfirm title="确定删除？" onConfirm={deleteHandler.bind(null, record.id)}>
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
          rowKey={record => record.id}
          pagination={false}
          loading={loading}
        />
        <Pagination
          className="ant-table-pagination"
          total={50}
          current={current}
          pageSize={PAGE_SIZE}
          onChange={pageChangeHandler}
        />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { list, total, page } = state.users;
  return {
    list,
    total,
    page,
    loading: state.loading.models.users
  }
}

export default connect(mapStateToProps)(Users);