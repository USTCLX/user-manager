import { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;


class UnitEditModal extends Component {
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
        // console.log('err', err);
      } else {
        onOk(values);
        this.hideModalHandler();
      }
    })
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { name } = this.props.record;
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
          title="编辑中心"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="中心名称">
              {
                getFieldDecorator('name',
                  { initialValue: name, rules: [{ required: 'true', message: '请输入中心名称' }] })(<Input />)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(UnitEditModal);