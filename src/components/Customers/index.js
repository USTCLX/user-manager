/*
 * @Author: lixiang 
 * @Date: 2019-01-06 21:56:46 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-06 23:01:12
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Badge } from 'antd';

const statusMap = [
  'warning',
  'warning',
  'default',
  'processing',
  'default',
  'success',
  'error',
  'error',
];
const statusArr = [
  '跟进中',
  '待审核',
  '待分配',
  '正在服务',
  '即将到期',
  '合作暂停',
  '合作到期',
  '合作终止',
];

// 将对象的值，转化为字符串
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ customers, loading }) => ({
  customers,
  loading: loading.effects['customers/fetch'],
}))
export default class Customers extends PureComponent {


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'customers/fetch',
      payload: params,
    })
  };

  render() {
    const { customers: { list, pagination }, loading } = this.props;
    // 表格配置
    const columns = [
      {
        title: '卖家旺旺',
        dataIndex: 'aliWangWang',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val + 2]} text={statusArr[val + 2]} />;
        },
      },
      {
        title: '运营',
        dataIndex: 'servicePerson.username',
      },
      {
        title: '服务开始时间',
        dataIndex: 'startTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '服务结束时间',
        dataIndex: 'stopTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '店铺类型',
        dataIndex: 'storeType',
      },
      {
        title: '更多操作',
        render: record => {
          return (<a>详细</a>);
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={list}
        rowKey={record => record._id}
        pagination={{ ...pagination, showSizeChanger: true }}
        loading={loading}
        onChange={this.handleStandardTableChange}
      />
    )
  }
}