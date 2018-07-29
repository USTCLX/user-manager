import { Component } from 'react';
import { Modal, Form, Input, Cascader, message } from 'antd';

const FormItem = Form.Item;


class DeparmentEditModal extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false,
      options: [],
      parentVal: [],
    };
  }


  resetOptions() {
    let unitsList = this.props.unitsList;
    let opts = (unitsList).map((unit) => {
      return {
        label: unit.name,
        value: unit._id
      }
    })
    this.setState({ options: opts });
  }

  resetParentVal() {
    let { parent } = this.props.record;
    let parentVal = (parent || []).map((item) => {
      return item._id;
    })
    this.setState({ parentVal });
  }

  showModalHandler = (e) => {
    if (e)
      e.stopPropagation();

    this.resetOptions();
    this.resetParentVal();

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
        if (values.parent.length !== 1) {
          message.error('数据有误,部门的必须依次归属于中心');
          return;
        }
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
          title="编辑部门"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="部门名称">
              {
                getFieldDecorator('name',
                  { initialValue: name, rules: [{ required: 'true', message: '请输入部门名称' }] })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="从属中心">
              {
                getFieldDecorator('parent',
                  { initialValue: this.state.parentVal, rules: [{ required: 'true', message: '请选择从属中心' }] })(
                    <Cascader options={this.state.options} placeholder="请选择" />)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(DeparmentEditModal);