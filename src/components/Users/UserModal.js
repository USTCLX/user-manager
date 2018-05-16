import { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Checkbox } from 'antd';
import { levelMap } from '../../constants';
// import departments from '../../models/departments';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;


class UserEditModal extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false,
      options: [],
      parentVal: [],
      authority: [],
    };
  }


  resetOptions(level) {
    if (level === -1) {
      this.setState({ options: [] });
      return;
    }
    const { unitsList = [], departmentsList = [], teamsList = [], groupsList = [] } = this.props;
    let opts = (unitsList || []).map((unit) => {

      let children1 = [];
      departmentsList.forEach((item) => {
        let parent = item.parent || [];
        let children2 = []

        teamsList.forEach((team) => {
          let parent = team.parent || [];
          let children3 = [];
          groupsList.forEach((group) => {
            let parent = group.parent || [];

            if (parent[2]._id === team._id) {
              children3.push({
                label: group.name,
                value: group._id
              })
            }
          })

          if (parent[1]._id === item._id) {
            children2.push({
              label: team.name,
              value: team._id,
              children: children3
            })
          }
        })

        if (parent[0]._id === unit._id) {
          children1.push({
            label: item.name,
            value: item._id,
            children: children2,
          })

        }
      })

      return {
        label: unit.name,
        value: unit._id,
        children: children1
      }
    })

    switch (level) {
      case 2:
        opts.forEach((unit) => {
          let children = unit.children
          if (children.length !== 0) {
            children.forEach((department) => {
              let children = department.children;
              if (children.length !== 0) {
                children.forEach((team) => {
                  team.children = null;
                })
              }
            })
          }
        })
        break;
      case 3:
        opts.forEach((unit) => {
          let children = unit.children
          if (children.length !== 0) {
            children.forEach((department) => {
              department.children = null;
            })
          }
        })
        break;
      case 4:
        opts.forEach((unit) => {
          unit.children = null;
        })
        break;
      case 0:
      case 1:
      default:
        break;
    }

    this.setState({ options: opts });
  }

  resetParentVal() {
    let { parent } = this.props.record;
    let parentVal = (parent || []).map((item) => {
      return item._id;
    })
    this.setState({ parentVal });
  }

  resetAuthority(level) {
    let opts = ['add', 'renew', 'pause', 'stop', 'audit'];
    switch (level) {
      case 0:
        opts = ['add', 'renew', 'pause', 'stop'];
        break;
      case 1:
      case 2:
      case 3:
        break;
      default:
        opts = [];
        break;
    }
    // console.log(level, opts);
    this.setState({ authority: opts });
  }

  showModalHandler = (e) => {
    if (e)
      e.stopPropagation();

    this.resetOptions(this.props.record.level);
    this.resetParentVal();
    this.resetAuthority(this.props.record.level);

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
    this.props.form.resetFields('parent');
    this.resetOptions(value);
    this.resetAuthority(value);
  }

  // onAuthorityChange = (value) => {
  //   console.log('value', value);
  // }

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { username, password, name, idCard, phone, email, level } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const boxOptions = [{
      label: '添加',
      value: 'add',
    }, {
      label: '续约',
      value: 'renew',
    }, {
      label: '暂停',
      value: 'pause',
    }, {
      label: '停止',
      value: 'stop'
    }, {
      label: '审核',
      value: 'audit'
    }];

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

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
                  { initialValue: username||'麦谷_', rules: [{ required: 'true', message: '请输入用户名' }] })(<Input />)
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
                  { initialValue: phone, rules: [{ required: true, message: '手机号码为数字' }] })(
                    <Input addonBefore={prefixSelector} type='number' />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="邮箱">
              {
                getFieldDecorator('email',
                  {
                    initialValue: email, rules: [{
                      type: 'email', message: '无效的邮箱!',
                    }]
                  })(<Input />)
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
                    <Select.Option value={levelMap[4].id}>{levelMap[4].name}</Select.Option>
                  </Select>)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="权限">
              {
                getFieldDecorator('authority',
                  { initialValue: this.state.authority })(<CheckboxGroup options={boxOptions} />)
              }
            </FormItem>

            <FormItem {...formItemLayout} label="从属小组">
              {
                getFieldDecorator('parent',
                  { initialValue: this.state.parentVal, rules: [{ required: true, message: '请选择隶属小组' }] })(<Cascader options={this.state.options} placeholder="请选择" />)
              }
            </FormItem>

          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(UserEditModal);