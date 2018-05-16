import { Component } from 'react';
import { Modal, Form, Input, Cascader } from 'antd';

const FormItem = Form.Item;


class TeamEditModal extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false,
      options: [],
      parentVal: [],
    };
  }


  resetOptions() {
    const { unitsList = [], departmentsList = [] }=this.props;

    let opts = (unitsList || []).map((unit) => {
      let children = [];

      departmentsList.forEach((item) => {
        let parent = item.parent || [];
        if (parent[0]._id === unit._id) {
          children.push({
            label: item.name,
            value: item._id,
          })
        }
      })
      return {
        label: unit.name,
        value: unit._id,
        children,
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
          title="编辑战队"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="战队名称">
              {
                getFieldDecorator('name',
                  { initialValue: name, rules: [{ required: 'true', message: '请输入战队名称' }] })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="从属部门">
              {
                getFieldDecorator('parent',
                  { initialValue: this.state.parentVal, rules: [{ required: 'true', message: '请选择从属部门' }] })(
                    <Cascader options={this.state.options} placeholder="请选择" />)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(TeamEditModal);