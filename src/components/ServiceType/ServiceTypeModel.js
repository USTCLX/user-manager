/*
 * @Author: lixiang 
 * @Date: 2018-09-17 20:55:25 
 * @Last Modified by: lixiang
 * @Last Modified time: 2018-11-25 18:11:21
 */
import { Component } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const FormItem = Form.Item;


class ServiceTypeModal extends Component {
  constructor(prop) {
    super();
    this.state = {
      visible: false,
    };
  }

  showModalHandler = (e) => {
    if (e)
      e.stopPropagation();

    this.setState({
      visible: true
    })
  }

  hideModalHandler = () => {
    this.setState({
      visible: false
    })
  }

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        Object.keys(values).map(key => {
          return values[key] = values[key].trim ? values[key].trim() : values[key];
        });
        onOk(values);
        this.hideModalHandler();
      }
    })
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { name, limitPrice } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }

    return (
      <span>
        <span onClick={this.showModalHandler}>
          {children}
        </span>
        <Modal
          title="套餐"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="套餐名称">
              {
                getFieldDecorator('name',
                  { initialValue: name, rules: [{ required: 'true', message: '套餐名称' }] })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="最低限价">
              {
                getFieldDecorator('limitPrice',
                  { initialValue: limitPrice, rules: [{ required: true, message: '最低限价' }] })(
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0} />
                  )
              }

            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(ServiceTypeModal);