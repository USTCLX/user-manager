import { Component } from 'react';
import { Modal, Form, Input, Select, Cascader } from 'antd';
import { levelMap } from '../../constants';
// import departments from '../../models/departments';

const FormItem = Form.Item;


class UserEditModal extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false,
      options: props.options,
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

  levelChangeHandler = (value) => {
    this.props.record.organization = [];
    this.props.form.resetFields('organization');
    let newOpts;
    switch (value) {
      case 0:
      case 1:
        this.setState({ options: this.props.options });
        break;
      case 2:
        newOpts = (this.props.options || []).map((unit) => {
          let newUnit = {
            label: unit.label,
            value: unit.value
          }
          newUnit.children = unit.children.map((departments) => {
            return {
              label: departments.label,
              value: departments.value,
            }
          })
          return newUnit
        })
        this.setState({ options: newOpts });
        break;
      case 3:
        newOpts = (this.props.options || []).map((unit) => {
          let newUnit = {
            label: unit.label,
            value: unit.value
          }
          return newUnit
        })
        this.setState({ options: newOpts });
        break;
      default:
        break;
    }
  }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { username, password, name, idCard, phone, email, level, organization } = this.props.record;
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
          title="编辑账号"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form onSubmit={this.okHandler}>

            <FormItem {...formItemLayout} label="用户名">
              {
                getFieldDecorator('username',
                  { initialValue: username, rules: [{ required: 'true', message: '请输入用户名' }] })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="密码">
              {
                getFieldDecorator('password',
                  { initialValue: password || 123456, rules: [{ required: true, message: '请输入密码' }] })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="真实姓名">
              {
                getFieldDecorator('name',
                  { initialValue: name })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="身份证号">
              {
                getFieldDecorator('idCard',
                  { initialValue: idCard })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="手机号码">
              {
                getFieldDecorator('phone',
                  { initialValue: phone, rules: [{ required: true, message: '手机号码为数字' }] })(<Input type='number' />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="邮箱">
              {
                getFieldDecorator('email',
                  { initialValue: email })(<Input />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="职位">
              {
                getFieldDecorator('level',
                  { initialValue: level, rules: [{ required: true, message: '请选择职位' }] })(<Select placeholder="请选择职位" onChange={this.levelChangeHandler}>
                    <Select.Option value={levelMap[0].id}>{levelMap[0].name}</Select.Option>
                    <Select.Option value={levelMap[1].id}>{levelMap[1].name}</Select.Option>
                    <Select.Option value={levelMap[2].id}>{levelMap[2].name}</Select.Option>
                    <Select.Option value={levelMap[3].id}>{levelMap[3].name}</Select.Option>
                  </Select>)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="隶属于">
              {
                getFieldDecorator('organization',
                  { initialValue: organization, rules: [{ required: true, message: '请选择职位' }] })(<Cascader options={this.state.options} placeholder="请选择" />)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(UserEditModal);