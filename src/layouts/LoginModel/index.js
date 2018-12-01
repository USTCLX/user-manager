/*
 * @Author: lixiang 
 * @Date: 2018-12-01 23:20:57 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-12-02 00:41:41
 */
import React, { Component } from 'react';
import { Modal, Input, Icon, Form } from 'antd';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
  }

  onOk = () => {
    const { form: { validateFields }, onOk } = this.props;
    validateFields((err, values) => {
      if (err)
        return;
      onOk(values);
    })
  }

  render() {
    const { visible, onCancel, form: { getFieldDecorator }, loading } = this.props;
    return (
      <Modal
        title="登录"
        visible={visible}
        onOk={this.onOk}
        onCancel={onCancel}
        confirmLoading={loading}
      >
        <Form>
          <Form.Item label="用户名" {...this.formItemLayout}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入用户名' }]
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />
            )}
          </Form.Item>
          <Form.Item label="密码"  {...this.formItemLayout}>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type='password' placeholder="密码"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(LoginModal)