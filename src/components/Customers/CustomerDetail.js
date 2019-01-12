/*
 * @Author: lixiang
 * @Date: 2019-01-12 20:55:49
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-01-12 22:54:50
 */
import React, { PureComponent, Fragment } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  Cascader,
  Spin,
  message,
  InputNumber,
  Icon,
  Button,
  DatePicker,
} from 'antd';
import fetch from 'dva/fetch';
import { isString, debounce } from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import cities from '../../utils/cities.json';
import { fieldLabels } from '../../utils/constants';
import styles from './CustomerDetail.less';

const { Option } = Select;
const { TextArea } = Input;
moment.locale('zh-cn');

const fetchOptions = {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
};

@Form.create()
export default class CustomerDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchLevelOne = debounce(this.fetchLevelOne, 800);
    this.fetchLevelTwo = debounce(this.fetchLevelTwo, 800);
    this.fetchLevelThree = debounce(this.fetchLevelThree, 800);
    this.fetchLevelFour = debounce(this.fetchLevelFour, 800);
  }

  state = {
    categroyData: [],
    categroyData2: [],
    categroyData3: [],
    categroyDate4: [],
    categroyFetching: false,
    serviceTypes: [],
    serviceTypesFetching: false,
    packageKeys: [0], // 套餐数组
    disableEdit: true, // 编辑模式
  };

  // ok
  onOk = () => {
    const { form, handleModalVisible, onOk } = this.props;
    const { validateFields } = form;
    validateFields((error, values) => {
      if (!error) {
        // submit the values
        const keys = Object.keys(values);
        keys.forEach(key => {
          if (isString(values[key])) {
            values[key] = values[key].trim();
          }
        });
        if (values.serviceTime) {
          values.startTime = values.serviceTime[0].toJSON();
          values.stopTime = values.serviceTime[1].toJSON();
        }
        if (values.packageType) {
          values.packageType = values.packageType.filter(item => {
            return item !== undefined;
          });
        }
        onOk(values);
        handleModalVisible(false);
      }
    });
  };

  // 取消
  onCancel = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  // 获取套餐
  fetchServiceTypes = () => {
    if (this.state.serviceTypes.length > 0) {
      return;
    }
    this.setState({ serviceTypesFetching: true });
    fetch('/api/serviceType/all', fetchOptions)
      .then(response => response.json())
      .then(({ status, data }) => {
        // console.log('boyd', data);
        if (status === 'ok') {
          this.setState({
            serviceTypes: data.list,
            serviceTypesFetching: false,
          });
        } else {
          message.error('获取套餐出错');
        }
      });
  };

  // 获取一级类目
  fetchLevelOne = () => {
    if (this.state.categroyData.length > 0) {
      return;
    }

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ categroyFetching: true });
    fetch(`/api/categroy?levelOne`, fetchOptions)
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        if (body.status !== 'ok') {
          message.error('获取类目一出错');
          return;
        }
        const categroyData = body.date.list.map(level => ({
          text: level,
          value: level,
        }));
        this.setState({ categroyData, categroyFetching: false });
      });
  };

  // 获取二级类目
  fetchLevelTwo = () => {
    if (this.state.categroyData2.length > 0) {
      return;
    }

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const levelOneVal = this.props.form.getFieldValue('levelOne');
    this.setState({ categroyFetching: true });
    fetch(`/api/categroy?levelOne=${levelOneVal}&levelTwo`, fetchOptions)
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        if (body.status !== 'ok') {
          message.error('获取类目二出错');
          return;
        }
        const categroyData2 = body.date.list.map(level => ({
          text: level,
          value: level,
        }));
        this.setState({ categroyData2, categroyFetching: false });
      });
  };

  // 获取三级类目
  fetchLevelThree = () => {
    if (this.state.categroyData3.length > 0) {
      return;
    }

    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const levelOneVal = this.props.form.getFieldValue('levelOne');
    const levelTwoVal = this.props.form.getFieldValue('levelTwo');
    this.setState({ categroyFetching: true });
    fetch(`/api/categroy?levelOne=${levelOneVal}&levelTwo=${levelTwoVal}&levelThree`, fetchOptions)
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        if (body.status !== 'ok') {
          message.error('获取类目三出错');
          return;
        }
        const categroyData3 = body.date.list.map(level => ({
          text: level,
          value: level,
        }));
        this.setState({ categroyData3, categroyFetching: false });
      });
  };

  // 获取四级泪目
  fetchLevelFour = () => {
    if (this.state.categroyDate4.length > 0) {
      return;
    }
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    const levelOneVal = this.props.form.getFieldValue('levelOne');
    const levelTwoVal = this.props.form.getFieldValue('levelTwo');
    const levelThreeVal = this.props.form.getFieldValue('levelThree');
    this.setState({ categroyData: [], categroyFetching: true });
    fetch(
      `/api/categroy?levelOne=${levelOneVal}&levelTwo=${levelTwoVal}&levelThree=${levelThreeVal}&levelFour`,
      fetchOptions
    )
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          return;
        }
        if (body.status !== 'ok') {
          return;
        }
        const categroyDate4 = body.date.list.map(level => ({
          text: level,
          value: level,
        }));
        if (categroyDate4.length === 0) {
          categroyDate4.push({ text: '无', value: '无' });
        }
        this.setState({ categroyDate4, categroyFetching: false });
      });
  };

  // 一级类目改变, 清空后面类目项
  handleChangeLevel1 = categroyValue => {
    this.setState({
      categroyFetching: false,
      categroyData2: [],
      categroyData3: [],
      categroyDate4: [],
    });

    this.props.form.setFieldsValue({ levelOne: categroyValue, levelTwo: '', levelThree: '' });
  };

  // 二级类目改变，清空后面类目项
  handleChangeLevel2 = categroyValue => {
    this.setState({
      categroyFetching: false,
      categroyData3: [],
      categroyDate4: [],
    });

    this.props.form.setFieldsValue({ levelTwo: categroyValue, levelThree: '' });
  };

  // 三级类目改变，清空后面类目项
  handleChangeLevel3 = categroyValue => {
    this.setState({
      categroyFetching: false,
      categroyDate4: [],
    });

    this.props.form.setFieldsValue({ levelThree: categroyValue, levelFour: '' });
  };

  // 四级类目改变，清空后面类目项
  handleChangeLevel4 = categroyValue => {
    this.setState({
      categroyFetching: false,
    });

    this.props.form.setFieldsValue({ levelFour: categroyValue });
  };

  // 增加套餐
  handleAddPackage = () => {
    const { packageKeys } = this.state;
    const nextPackageKeys = packageKeys.concat(packageKeys[packageKeys.length - 1] + 1);
    this.setState({ packageKeys: nextPackageKeys });
  };

  // 删除套餐
  handleRemovePackage = k => {
    const { packageKeys } = this.state;
    if (packageKeys.length === 1) {
      return;
    }
    this.setState({
      packageKeys: packageKeys.filter(key => key !== k),
    });
  };

  // 套餐数据变更
  handlePackageTypeChange = (value, index, type) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const { serviceTypes } = this.state;
    let name;
    let count;
    let sum;
    if (type === 'name') {
      name = value;
      count = getFieldValue(`packageType[${index}].count`);
    } else if (type === 'count') {
      name = getFieldValue(`packageType[${index}].name`);
      count = value;
    }

    if (name && count) {
      const service = serviceTypes.filter(item => {
        return item.name === name;
      })[0];
      sum = ((service && service.price) || service.limitPrice) * count;
      const field = {};
      field[`packageType[${index}].sum`] = sum;
      setFieldsValue(field);
    }
  };

  // 开启编辑模式
  handleEdit = () => {
    this.setState({
      disableEdit: !this.state.disableEdit,
    })
  }

  render() {
    const {
      categroyFetching,
      categroyData,
      categroyData2,
      categroyData3,
      categroyDate4,
      serviceTypes,
      serviceTypesFetching,
      packageKeys,
      disableEdit,
    } = this.state;
    const { form, modalVisible } = this.props;
    const { getFieldDecorator } = form;
    const curCustomer = this.props.curCustomer || {};

    // 检查手机格式
    const checkPhone = (rule, value, callback) => {
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value && !phoneReg.test(value)) {
        callback('手机号格式有误');
      }
      callback();
    };

    // 检查数字
    const checkNumber = (rule, value, callback) => {
      const numReg = /^\d*$/;
      if (value && !numReg.test(value)) {
        callback('必须为数字');
      }
      callback();
    };

    // 套餐控件
    const PackageTypeForm = curCustomer.packageType || [].map(key => (
      <Row gutter={24} key={key}>
        <Col lg={7} md={7} sm={7}>
          <Form.Item label={fieldLabels.packageTypeName.name}>
            {getFieldDecorator(`packageType[${key}].name`, {
              initialValue: curCustomer.packageType && curCustomer.packageType[key].name,
              rules: [{ required: true, message: '请输入套餐' }],
            })(
              <Select
                placeholder="请选择套餐"
                notFoundContent={
                  !serviceTypesFetching && serviceTypes.length === 0 ? <Spin size="small" /> : null
                }
                onFocus={this.fetchServiceTypes}
                onChange={v => {
                  this.handlePackageTypeChange(v, key, 'name');
                }}
                disabled={disableEdit}
              >
                {serviceTypes.map(item => {
                  return (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col lg={7} md={7} sm={7}>
          <Form.Item label={fieldLabels.packageTypeCount.name}>
            {getFieldDecorator(`packageType[${key}].count`, {
              initialValue: curCustomer.packageType && curCustomer.packageType[key].count,
              rules: [{ required: true, message: '数量' }],
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                disabled={disableEdit}
                onChange={v => {
                  this.handlePackageTypeChange(v, key, 'count');
                }}
              />
            )}
          </Form.Item>
        </Col>
        <Col lg={7} md={7} sm={7}>
          <Form.Item label={fieldLabels.packageTypeSum.name}>
            {getFieldDecorator(`packageType[${key}].sum`, {
              initialValue: curCustomer.packageType && curCustomer.packageType[key].sum,
              rules: [{ required: true, message: '金额' }],
            })(
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/¥\s?|(,*)/g, '')}
                min={1}
                precision={0}
                disabled
              />
            )}
          </Form.Item>
        </Col>
        {packageKeys.length !== 1 && (
          <Col lg={3} md={3} sm={3}>
            <Form.Item label="操作">
              <Icon
                className={styles.dynamicDeleteButton}
                type="minus-circle-o"
                onClick={() => {
                  this.handleRemovePackage(key);
                }}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    ));

    // 模态框头部
    const Title = (
      <Fragment>
        <span style={{ marginRight: '10px' }}>客户信息</span>
        <Icon type='form'
          style={{ cursor: 'pointer' }}
          onClick={this.handleEdit} />
      </Fragment>
    )

    return (
      <Modal
        destroyOnClose
        title={Title}
        okText="提交"
        cancelText="取消"
        width={1000}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
        centered
        visible={modalVisible}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Form layout="vertical">
          {/* 旺旺 微信 手机 QQ */}
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.aliWangWang.name}>
                {getFieldDecorator(fieldLabels.aliWangWang.id, {
                  rules: [{ required: true, message: '请输入客户旺旺' }],
                  initialValue: curCustomer.aliWangWang,
                })(<Input placeholder="请输入客户旺旺" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.weChart.name}>
                {getFieldDecorator(fieldLabels.weChart.id, {
                  initialValue: curCustomer.weChart,
                })(<Input placeholder="请输入微信" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.phone.name}>
                {getFieldDecorator(fieldLabels.phone.id, {
                  initialValue: curCustomer.phone,
                  rules: [{ validator: checkPhone }],
                })(<Input placeholder="请输入手机" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.qq.name}>
                {getFieldDecorator(fieldLabels.qq.id, {
                  initialValue: curCustomer.qq,
                  rules: [{ validator: checkNumber }],
                })(<Input placeholder="请输入QQ" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
          </Row>

          {/* 性别、意向度、网店类型 */}
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.sex.name}>
                {getFieldDecorator(fieldLabels.sex.id, {
                  initialValue: curCustomer.sex,
                  rules: [{ required: true, message: '请选择客户性别' }],
                })(
                  <Select placeholder="请选择客户性别" disabled={disableEdit}>
                    <Select.Option value="男">男</Select.Option>
                    <Select.Option value="女">女</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.region.name}>
                {getFieldDecorator(fieldLabels.region.id, {
                  initialValue: curCustomer.region,
                  rules: [{ required: true, message: '请选择地区' }],
                })(<Cascader options={cities} placeholder="请选择地区" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.intention.name}>
                {getFieldDecorator(fieldLabels.intention.id, {
                  initialValue: curCustomer.intention,
                  rules: [{ required: true, message: '请选择意向度' }],
                })(
                  <Select placeholder="请选择意向度" disabled={disableEdit}>
                    <Select.Option value="高">高</Select.Option>
                    <Select.Option value="中">中</Select.Option>
                    <Select.Option value="低">低</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label={fieldLabels.storeType.name}>
                {getFieldDecorator(fieldLabels.storeType.id, {
                  initialValue: curCustomer.storeType,
                  rules: [{ required: true, message: '请选择店铺类型' }],
                })(
                  <Select placeholder="请选择店铺类型" disabled={disableEdit}>
                    <Select.Option value="天猫">天猫</Select.Option>
                    <Select.Option value="企业C店">企业C店</Select.Option>
                    <Select.Option value="淘宝C店">淘宝C店</Select.Option>
                    <Select.Option value="京东">京东</Select.Option>
                    <Select.Option value="拼多多">拼多多</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* 类目一、二、三、四 */}
          <Row gutter={24}>
            <Col lg={6} md={6} sm={24}>
              <Form.Item label={fieldLabels.levelOne.name}>
                {getFieldDecorator(fieldLabels.levelOne.id, {
                  rules: [{ required: true, message: '请输入类目一' }],
                  initialValue: curCustomer.levelOne,
                })(
                  <Select
                    showSearch
                    showArrow={false}
                    placeholder="搜索类目一"
                    notFoundContent={
                      !categroyFetching && categroyData.length === 0 ? <Spin size="small" /> : null
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onFocus={this.fetchLevelOne}
                    onChange={this.handleChangeLevel1}
                    style={{ width: '100%' }}
                    disabled={disableEdit}
                  >
                    {categroyData.map(d => <Option key={d.value}>{d.text}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <Form.Item label={fieldLabels.levelTwo.name}>
                {getFieldDecorator(fieldLabels.levelTwo.id, {
                  rules: [{ required: true, message: '请输入类目二' }],
                  initialValue: curCustomer.levelTwo,
                })(
                  <Select
                    showSearch
                    showArrow={false}
                    placeholder="搜索类目二"
                    notFoundContent={
                      !categroyFetching && categroyData2.length === 0 ? <Spin size="small" /> : null
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onFocus={this.fetchLevelTwo}
                    onChange={this.handleChangeLevel2}
                    style={{ width: '100%' }}
                    disabled={disableEdit}
                  >
                    {categroyData2.map(d => <Option key={d.value}>{d.text}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <Form.Item label={fieldLabels.levelThree.name}>
                {getFieldDecorator(fieldLabels.levelThree.id, {
                  rules: [{ required: true, message: '请输入类目三' }],
                  initialValue: curCustomer.levelThree,
                })(
                  <Select
                    showSearch
                    showArrow={false}
                    placeholder="搜索类目三"
                    notFoundContent={
                      !categroyFetching && categroyData3.length === 0 ? <Spin size="small" /> : null
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onFocus={this.fetchLevelThree}
                    onChange={this.handleChangeLevel3}
                    style={{ width: '100%' }}
                    disabled={disableEdit}
                  >
                    {categroyData3.map(d => <Option key={d.value}>{d.text}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={6} sm={24}>
              <Form.Item label={fieldLabels.levelFour.name}>
                {getFieldDecorator(fieldLabels.levelFour.id, {
                  rules: [{ required: true, message: '请输入类目四' }],
                  initialValue: curCustomer.levelThree,
                })(
                  <Select
                    showSearch
                    showArrow={false}
                    placeholder="搜索类目四"
                    notFoundContent={
                      !categroyFetching && categroyDate4.length === 0 ? <Spin size="small" /> : null
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onFocus={this.fetchLevelFour}
                    onChange={this.handleChangeLevel4}
                    style={{ width: '100%' }}
                    disabled={disableEdit}
                  >
                    {categroyDate4.map(d => <Option key={d.value}>{d.text}</Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* 套餐 */}
          {PackageTypeForm}
          <Row gutter={24}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item>
                <Button type="dashed" style={{ width: '100%' }} disabled={disableEdit} onClick={this.handleAddPackage}>
                  <Icon type="plus" /> 增加套餐
                </Button>
              </Form.Item>
            </Col>
          </Row>

          {/* 开发方式，回访方式 */}
          <Row gutter={24}>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label={fieldLabels.developmentMode.name}>
                {getFieldDecorator(fieldLabels.developmentMode.id, {
                  initialValue: curCustomer.developmentMode,
                  rules: [{ required: true, message: '开发使用方式' }],
                })(
                  <Select placeholder="开发使用方式" disabled={disableEdit}>
                    <Select.Option value="电话">电话</Select.Option>
                    <Select.Option value="微信">微信</Select.Option>
                    <Select.Option value="旺旺">旺旺</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Form.Item label={fieldLabels.callbackMode.name}>
                {getFieldDecorator(fieldLabels.callbackMode.id, {
                  initialValue: curCustomer.callbackMode,
                  rules: [{ required: true, message: '请选择回访方式' }],
                })(
                  <Select mode="tags" placeholder="请选择回访方式" disabled={disableEdit}>
                    <Select.Option value="电话">电话</Select.Option>
                    <Select.Option value="微信">微信</Select.Option>
                    <Select.Option value="旺旺">旺旺</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* 金额 服务天数 佣金范围 佣金比例 */}
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="金额">
                {getFieldDecorator('sum', {
                  rules: [{ required: true, message: '请输入金额' }],
                  initialValue: curCustomer.sum,
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/¥\s?|(,*)/g, '')}
                    min={0}
                    precision={0}
                    disabled={disableEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="服务天数">
                {getFieldDecorator('serviceDays', {
                  initialValue: curCustomer.serviceDays,
                  rules: [{ required: true, message: '请输入服务天数' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    precision={0}
                    placeholder="请输入服务天数"
                    disabled={disableEdit}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="佣金范围">
                {getFieldDecorator('commission.type', {
                  initialValue: curCustomer.commission && curCustomer.commission.type,
                  rules: [{ required: true, message: '请输入佣金范围' }],
                })(
                  <Select style={{ width: '100%' }} disabled={disableEdit}>
                    <Select.Option value="全店销售额">全店销售额</Select.Option>
                    <Select.Option value="全店销售额增长部分">全店销售额增长部分</Select.Option>
                    <Select.Option value="直通车销售额">直通车销售额</Select.Option>
                    <Select.Option value="直通车销售额增长部分">直通车销售额增长部分</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="佣金比例">
                {getFieldDecorator('commission.proportion', {
                  initialValue: curCustomer.commission && curCustomer.commission.proportion,
                  rules: [{ required: true, message: '请输入佣金比例' }],
                })(
                  <InputNumber
                    style={{ width: '100%' }}
                    min={2}
                    max={10}
                    formatter={value => `${value}%`}
                    parser={value => parseInt(value.replace('%', ''), 10)}
                    disabled={disableEdit}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* 子账号 子账号密码 服务开始时间 服务结束时间 */}
          <Row gutter={24}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="子账号">
                {getFieldDecorator('childAccount', {
                  initialValue: curCustomer.childAccount,
                  rules: [{ required: true, message: '请输入子账号' }],
                })(<Input placeholder="请输入子账号" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="子账号密码">
                {getFieldDecorator('childPassword', {
                  initialValue: curCustomer.childPassword,
                  rules: [{ required: true, message: '请输入子账号密码' }],
                })(<Input placeholder="请输入子账号密码" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="服务开始时间">
                {getFieldDecorator('startTime', {
                  initialValue: moment(curCustomer.startTime),
                  rules: [{ required: true, message: '请输入服务开始时间' }],
                })(<DatePicker disabled={disableEdit}
                  style={{ width: '100%' }}
                  placeholder='请输入服务开始时间' />)}
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="服务结束时间">
                {getFieldDecorator('stopTime', {
                  initialValue: moment(curCustomer.stopTime),
                  rules: [{ required: true, message: '请输入服务结束时间' }],
                })(<DatePicker disabled={disableEdit}
                  style={{ width: '100%' }}
                  placeholder='请输入服务结束时间' />)}
              </Form.Item>
            </Col>
          </Row>

          {/* 备注 */}
          <Row gutter={24}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('remark', {
                  initialValue: curCustomer.remark,
                  rules: [{ required: true, message: '备注' }],
                })(<TextArea rows={1} placeholder="填写首付及赠送情况" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
          </Row>

          {/* 客户性格 */}
          <Row gutter={24}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="客户性格">
                {getFieldDecorator('character', {
                  initialValue: curCustomer.character,
                  rules: [{ required: true, message: '请输入客户性格' }],
                })(<TextArea rows={1} placeholder="请输入客户性格" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
          </Row>

          {/* 赠送服务 */}
          <Row gutter={24}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="赠送服务">
                {getFieldDecorator('extraService', {
                  initialValue: curCustomer.extraService,
                  rules: [{ required: true, message: '请输入赠送服务' }],
                })(<TextArea rows={1} placeholder="请输入赠送服务" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
          </Row>

          {/* 客户在意点 */}
          <Row gutter={24}>
            <Col lg={24} md={24} sm={24}>
              <Form.Item label="客户在意点">
                {getFieldDecorator('keyPoint', {
                  initialValue: curCustomer.keyPoint,
                  rules: [{ required: true, message: '请输入客户在意点' }],
                })(<TextArea rows={1} placeholder="请输入客户在意点" disabled={disableEdit} />)}
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>
    )
  }
}