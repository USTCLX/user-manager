import { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;


class GroupEditModal extends Component {
  constructor(props) {
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
    const { children, unitsList, departmentsList } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { name, department = {} } = this.props.record;

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

            {/* <FormItem {...formItemLayout} label="从属中心">
              {
                getFieldDecorator('unit',
                  { initialValue: unit._id, rules: [{ required: 'true', message: '请选择从属中心' }] })(
                    <Select>{unitsList.map((unit) => {
                      return (<Option key={unit._id} value={unit._id}>{unit.name}</Option>)
                    })}</Select>)
              }
            </FormItem> */}

            <FormItem {...formItemLayout} label="从属部门">
              {
                getFieldDecorator('department',
                  { initialValue: department._id, rules: [{ required: 'true', message: '请选择从属部门' }] })(
                    <Select>{departmentsList.map((department) => {
                      return (<Option key={department._id} value={department._id}>{department.name}</Option>)
                    })}</Select>)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(GroupEditModal);