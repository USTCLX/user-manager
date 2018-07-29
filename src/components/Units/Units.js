/*
 * @Author: lixiang 
 * @Date: 2018-05-11 21:05:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-07-29 15:58:21
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button } from 'antd';
import UnitModal from './UnitModal';
import style from './Units.less';

function Units({ units, loading, dispatch }) {

  // const { list, pagination: { total, current, pageSize } } = units;
  const { list } = units;


  function deleteHandler(_id) {
    dispatch({
      type: 'units/remove',
      payload: {
        _id
      }
    })
  }

  // function pageChangeHandler(page) {
  //   dispatch({
  //     type: 'units/fetch',
  //     payload: {
  //       currentPage: page,
  //     }
  //   })
  // }

  function editHandler(_id, values) {
    dispatch({
      type: 'units/update',
      payload: { _id, ...values },
    })
  }

  function createHandler(values) {
    dispatch({
      type: 'units/create',
      payload: { ...values },
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
          <UnitModal record={record} onOk={editHandler.bind(null, record._id)}>
            <a>编辑</a>
          </UnitModal>
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
        <UnitModal record={{}} onOk={createHandler}>
          <Button type="primary">创建中心</Button>
        </UnitModal>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        rowKey={record => record._id}
        pagination={false}
        loading={loading}
      />
      {/* <Pagination
        className="ant-table-pagination"
        total={total}
        current={current}
        pageSize={pageSize}
        showTotal={(total, range) => `共条数: ${total}`}
        onChange={pageChangeHandler}
      /> */}

    </div>
  )
}

function mapStateToProps({ units, loading }) {
  return {
    units,
    loading: loading.effects['units/fetch'],
  }
}

export default connect(mapStateToProps)(Units);