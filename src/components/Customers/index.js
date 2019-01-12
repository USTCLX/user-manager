/*
 * @Author: lixiang 
 * @Date: 2019-01-06 21:56:46 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-09 08:52:34
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Badge, Card, Input, Form, Row, Col, Button } from 'antd';

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

@Form.create()
@connect(({ customers, loading }) => ({
  customers,
  loading: loading.effects['customers/fetch'],
}))
export default class Customers extends PureComponent {


  // 搜索
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'customers/save',
        payload: values,
      });

      dispatch({
        type: 'customers/fetch',
        payload: {
          currentPage: 1,
        },
      });
    });
  };

  // 重置表单
  handleFormReset = () => {
    const { form, dispatch } = this.props;

    form.setFieldsValue({ aliWangWang: '' });

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'customers/save',
        payload: values,
      });

      dispatch({
        type: 'customers/fetch',
        payload: {
          currentPage: 1,
        },
      });
    });
  };

  // 切换页面
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
    const { customers: { list, pagination, aliWangWang }, loading, form: { getFieldDecorator } } = this.props;
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
      <Card>
        <Form onSubmit={this.handleSearch} layout="inline" style={{ marginBottom: '16px' }}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <Form.Item label="卖家旺旺">
                {getFieldDecorator('aliWangWang', {
                  initialValue: aliWangWang,
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <Button type="primary" htmlType="submit">
                查询
                </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>

        <Table
          columns={columns}
          dataSource={list}
          rowKey={record => record._id}
          pagination={{ ...pagination, showSizeChanger: true }}
          loading={loading}
          onChange={this.handleStandardTableChange}
        />
      </Card>
    )
  }
}