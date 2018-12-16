import { Component } from 'react';
import { Modal, Form, Input, Select, Cascader, Checkbox, Radio, message } from 'antd';
import { levelMap } from '../../constants';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


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
    if (!level) {
      this.setState({ options: [] });
      return;
    }

    const recursion = (arr, stopType = 'department') => {
      if (!arr)
        return;
      arr.forEach(item => {
        if (item.type === stopType) {
          item.children = null;
        } else {
          recursion(item.children, stopType);
        }
      });
    }

    const { unitsList = [], departmentsList = [], teamsList = [], groupsList = [] } = this.props;
    let opts = unitsList.map((unit) => {

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
                value: group._id,
                type: group.type,
              })
            }
          })

          if (parent[1]._id === item._id) {
            children2.push({
              label: team.name,
              value: team._id,
              type: team.type,
              children: children3
            })
          }
        })

        if (parent[0]._id === unit._id) {
          children1.push({
            label: item.name,
            value: item._id,
            type: item.type,
            children: children2,
          })
        }
      })

      return {
        label: unit.name,
        value: unit._id,
        type: unit.type,
        children: children1
      }
    });

    switch (level) {
      case 'manager':
        recursion(opts, 'department');
        break;
      case 'director':
        recursion(opts, 'team');
        break;
      case 'groupLeader':
      case 'operator':
        break;
      default:
        opts = [];
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
      case 'operator':
        opts = ['add', 'renew', 'pause', 'stop'];
        break;
      case 'groupLeader':
      case 'teamLeader':
      case 'director':
      case 'manager':
        break;
      default:
        opts = [];
        break;
    }
    this.setState({ authority: opts });
  }

  checkUsername(rule, value, callback) {
    const usernameReg = /^[麦谷_]+[\u4e00-\u9fa5]+$/
    if (!usernameReg.test(value)) {
      callback('用户名只能是麦谷_加汉字')
    }
    callback()
  }

  checkPhone(rule, value, callback) {
    const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(value)) {
      callback('手机号格式有误');
    }
    callback()
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
    this.props.form.resetFields();
  }

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (err) {
        // console.log('err', err);
      } else {
        const { parent, level } = values;
        let pass = true;
        switch (level) {
          case 'manager':
            if (parent.length !== 2) {
              pass = false;
            } else {
              pass = true;
              values.department = parent[1];
              values.unit = parent[0];
            }
            break;
          case 'director':
            if (parent.length !== 3) {
              pass = false;
            } else {
              pass = true;
              values.team = parent[2];
              values.department = parent[1];
              values.unit = parent[0];
            }
            break;
          case 'groupLeader':
            if (parent.length !== 4) {
              pass = false;
            } else {
              pass = true;
              values.group = parent[3];
              values.team = parent[2];
              values.department = parent[1];
              values.unit = parent[0];
            }
            break;
          case 'operator':
            if (parent.length !== 4) {
              pass = false;
            } else {
              pass = true;
              values.group = parent[3];
              values.team = parent[2];
              values.department = parent[1];
              values.unit = parent[0];
            }
            break;
          default:
            pass = false;
            break;
        }
        if (!pass) {
          message.error('参数有误，请检查职位与从属小组');
          return;
        }
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
    const { username, password, name, idCard, phone, email, level, status } = this.props.record;
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
                  { initialValue: username || '麦谷_', rules: [{ required: 'true', message: '请输入用户名' }, { validator: this.checkUsername }] })(<Input />)
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
                  { initialValue: phone, rules: [{ required: true, message: '请输入手机号码' }, { validator: this.checkPhone }] })(
                    <Input addonBefore={prefixSelector} />)
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
                    <Select.Option value={levelMap[0].value}>{levelMap[0].name}</Select.Option>
                    <Select.Option value={levelMap[1].value}>{levelMap[1].name}</Select.Option>
                    <Select.Option value={levelMap[2].value}>{levelMap[2].name}</Select.Option>
                    <Select.Option value={levelMap[3].value}>{levelMap[3].name}</Select.Option>
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

            <FormItem {...formItemLayout} label="账号状态">
              {
                getFieldDecorator('status',
                  { initialValue: status || 'normal', rules: [{ required: true, message: '请选择账号状态' }] })(
                    <RadioGroup>
                      <Radio value='normal'>正常</Radio>
                      <Radio value='frozen'>停用</Radio>
                    </RadioGroup>
                  )
              }
            </FormItem>
          </Form>

        </Modal>
      </span>
    )
  }

}

export default Form.create()(UserEditModal);