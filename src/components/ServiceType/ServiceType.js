/*
 * @Author: lixiang 
 * @Date: 2018-09-17 20:13:30 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-12 20:46:15
 */

import { connect } from 'dva';
import moment from 'moment';
import { Table, Popconfirm, Button, Card } from 'antd';
import ServiceTypeModal from './ServiceTypeModel';
import style from './ServiceType.css';

function ServiceType({ serviceType, loading, dispatch }) {

  const { list } = serviceType;

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <a>{index + 1}</a>
    },
    {
      title: '套餐名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '销售价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '最低限价',
      dataIndex: 'limitPrice',
      key: 'limitPrice',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm')}</span>
    },
    {
      title: '修改日期',
      dataIndex: 'lastModifiedTime',
      key: 'lastModifiedTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm')}</span>
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record, index) => (
        <span className={style.operation}>
          <ServiceTypeModal record={record} onOk={editHandler.bind(null, index)}>
            <a>编辑</a>
          </ServiceTypeModal>
          <Popconfirm title="确定删除？" onConfirm={deleteHandler.bind(null, index)}>
            <a href="">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]

  function createHandler(values) {
    dispatch({
      type: 'serviceType/create',
      payload: { ...values },
    })
  }

  function editHandler(_id, values) {
    dispatch({
      type: 'serviceType/update',
      payload: { _id, ...values },
    })
  }

  function deleteHandler(_id) {
    dispatch({
      type: 'serviceType/remove',
      payload: {
        _id
      }
    })
  }


  return (
    <Card>
      <div className={style.create}>
        <ServiceTypeModal record={{}} onOk={createHandler}>
          <Button type="primary">创建套餐</Button>
        </ServiceTypeModal>
      </div>
      <Table
        columns={columns}
        dataSource={list}
        rowKey={record => record.name}
        pagination={false}
        loading={loading}
      />
    </Card>
  )
}

function mapStateToProps({ serviceType, loading }) {
  return {
    serviceType,
    loading: loading.models['serviceType'],
  }
}

export default connect(mapStateToProps)(ServiceType);