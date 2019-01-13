/*
 * @Author: lixiang 
 * @Date: 2019-01-13 21:18:14 
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-13 22:58:25
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Card, Form, Switch, Table } from 'antd';
import styles from './index.less';

moment.locale('zh-cn');

const STATUS_MAP = {
  'stoping': '暂停中',
  'finish': '完成',
}

@Form.create()
@connect(({ controller, loading }) => {
  return {
    stopList: controller.stopList,
    fetchLoading: loading.effects['controller/fetchStop'],
    toggLoading: loading.effects['controller/toggleStop'],
  }
})
export default class ControllerStop extends PureComponent {

  handleStop = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'controller/toggleStop',
    })
  }

  render() {
    const { form: { getFieldDecorator }, fetchLoading, toggLoading, stopList } = this.props;
    const columns = [{
      title: '暂停开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: val => moment(val).format('YYYY-MM-DD hh:mm'),
    }, {
      title: '暂停结束时间',
      dataIndex: 'stopTime',
      key: 'stopTime',
      render: val => moment(val).format('YYYY-MM-DD hh:mm'),
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (val) => STATUS_MAP[val],
    }]

    return <Card bordered={false} >
      <Form layout='inline' className={styles.create}>
        <Form.Item label='全部暂停'>
          {getFieldDecorator('stop')(
            <Switch onChange={this.handleStop} loading={toggLoading} />
          )}
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        loading={fetchLoading}
        dataSource={stopList}
        rowKey={record => record._id} />
    </Card>
  }
}

