/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-05-13 20:43:07
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button } from 'antd';
import UserModal from './UnitModal';
import style from './Units.less';
// import { PAGE_SIZE } from '../../constants';

function Units({ list: dataSource, total, page: current, loading, dispatch }) {

  function deleteHandler(id) {
    dispatch({
      type: 'units/remove',
      payload: {
        id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'units/fetch',
  //     payload: {
  //       page
  //     }
  //   })
  // }

  function editHandler(id, values) {
    dispatch({
      type: 'units/patch',
      payload: { id, values }
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'units/create',
      payload: { values }
    })
  }

  const columns = [
    {
      title: '中心名称',
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
      <div className={style.create}>
        <UserModal record={{}} onOk={createHandler}>
          <Button type="primary">创建中心</Button>
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
  )
}

function mapStateToProps(state) {
  const { list, total, page } = state.units;
  return {
    list,
    total,
    page,
    loading: state.loading.models.units
  }
}

export default connect(mapStateToProps)(Units);