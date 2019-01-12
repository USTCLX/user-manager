export const blankCustomer = {
  aliWangWang: '',
  storeType: '',
  region: [],
  serviceType: [],
  childAccount: '',
  childPassword: '',
  phone: '',
  qq: '',
  weChart: '',
  character: '',
  promiseEffect: '',
  extraService: '',
  keyPoint: '',
  other: '',
  createTime: '',
  lastModifiedTime: '',
  servicePerson: {},
  status: -1, // 0 待分配 1正在服务 2 即将到期 3 合作暂停 4 合作到期
  startTime: '', // 开始服务时
  pauseTime: '', // 暂停服务时间
  stopTime: '', // 停止服务时间
  totalTime: 0, // 理论服务的总时长，按天算
  commission: {
    type: '',
    proportion: 0,
  },
};

export const fieldLabels = {
  aliWangWang: { name: '客户旺旺', id: 'aliWangWang' },
  sex: { name: '性别', id: 'sex' },
  age: { name: '年龄', id: 'age' },
  storeType: { name: '网店类型', id: 'storeType' },
  region: { name: '地区', id: 'region' },
  serviceType: { name: '套餐', id: 'serviceType' },
  packageTypeName: { name: '套餐', id: 'packageName' },
  packageTypeCount: { name: '数量', id: 'packageCount' },
  packageTypeSum: { name: '金额', id: 'packageSum' },
  childAccount: { name: '子账号', id: 'childAccount' },
  childPassword: { name: '子账号密码', id: 'childPassword' },
  phone: { name: '手机', id: 'phone' },
  qq: { name: 'QQ', id: 'qq' },
  weChart: { name: '微信', id: 'weChart' },

  intention: { name: '意向度', id: 'intention' },
  developmentMode: { name: '开发使用方式', id: 'developmentMode' },
  callbackMode: { name: '回访方式', id: 'callbackMode' },

  levelOne: { name: '一级类目', id: 'levelOne' },
  levelTwo: { name: '二级类目', id: 'levelTwo' },
  levelThree: { name: '三级类目', id: 'levelThree' },
  levelFour: { name: '四级类目', id: 'levelFour' },

  character: { name: '客户性格', id: 'character' },
  promiseEffect: { name: '效果承诺', id: 'promiseEffect' },
  extraService: { name: '赠送服务', id: 'extraService' },
  keyPoint: { name: '客户在意点', id: 'keyPoint' },
  other: { name: '其他', id: 'other' },

  serviceTime: { name: '服务时间', id: 'serviceTime' },
  serviceDays: { name: '服务天数', id: 'serviceDays' },
  sum: { name: '金额', id: 'sum' },
};