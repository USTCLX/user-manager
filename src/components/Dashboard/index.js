/*
 * @Author: lixiang
 * @Date: 2019-01-27 21:48:35
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-28 23:44:33
 */


import React, { PureComponent } from 'react';
import { Row, Col, Card, Upload, Icon, message } from 'antd';

export default class Dashboard extends PureComponent {

  onUploadChange = ({ file }) => {
    if (file.status === 'done') {
      const { response } = file;
      if (response.status === 'ok') {
        message.info('上传成功');
      } else {
        message.error('上传成功');
      }
    }
  }

  render() {
    const uploadProps = {
      action: '/api/files/upload/csv',
      accept: '.csv',
      onChange: this.onUploadChange,
      showUploadList: false,
    }
    return (
      <Row gutter={24}>
        <Col span={6}>
          <Card title="上传csv文件"
            actions={[<Upload {...uploadProps}><Icon type="upload" /></Upload>]}>
            <p>第一步：填写批量导入客户的模版文件</p>
            <p>第二步：文件格式必须是csv</p>
            <p>第三步：点击上传</p>
          </Card>
        </Col>
      </Row>
    )
  }
}