// 科目方向
export const DIRECTIONS = [
  {
    value: 0,
    label: '借方'
  },
  {
    value: 1,
    label: '贷方'
  }
]

export const KJ2007_AREA = [
  {'id': '0', 'text': '深圳', 'py': 'shenzhen'},
  {'id': '5', 'text': '上海', 'py': 'shanghai'},
  {'id': '6', 'text': '江苏', 'py': 'jiangsu'},
  {'id': '4', 'text': '北京', 'py': 'beijing'},
  {'id': '8', 'text': '河南', 'py': 'henan'},
  {'id': '9', 'text': '广西', 'py': 'guangxi'},
  {'id': '10', 'text': '海南', 'py': 'hainan'},
  {'id': '3', 'text': '青岛', 'py': 'qingdao'},
  {'id': '11', 'text': '山东', 'py': 'shandong'},
  {'id': '12', 'text': '重庆', 'py': 'chongqing'},
  {'id': '13', 'text': '福建', 'py': 'fujian'},
  {'id': '14', 'text': '湖南', 'py': 'hunan'},
  {'id': '15', 'text': '辽宁', 'py': 'liaoning'},
  {'id': '16', 'text': '厦门', 'py': 'xiamen'},
  {'id': '17', 'text': '安徽', 'py': 'anhui'},
  {'id': '18', 'text': '广东', 'py': 'guangdong'},
  {'id': '19', 'text': '甘肃', 'py': 'gansu'},
  {'id': '20', 'text': '贵州', 'py': 'guizhou'},
  {'id': '22', 'text': '内蒙古', 'py': 'neimenggu'},
  {'id': '24', 'text': '云南', 'py': 'yunnan'},
  {'id': '25', 'text': '山西', 'py': 'shanxi'},
  {'id': '26', 'text': '陕西', 'py': 'shaanxi'},
  // {"id":"27","text":"新疆","py":"xinjiang"}, //暂时只有小企业财报
  {'id': '28', 'text': '大连', 'py': 'dalian'},
  {'id': '29', 'text': '宁波', 'py': 'ningbo'},
  {'id': '30', 'text': '江西', 'py': 'jiangxi'},
  // {"id":"31","text":"黑龙江","py":"heilongjiang"}, //暂时只有小企业财报
  {'id': '32', 'text': '青海', 'py': 'qinghai'}
  // {"id":"33","text":"西藏","py":"xizang"} //暂未支持
]
export const KJ2013_AREA = [
  {'id': '0', 'text': '深圳', 'py': 'shenzhen'},
  {'id': '1', 'text': '河北', 'py': 'hebei'},
  {'id': '6', 'text': '江苏', 'py': 'jiangsu'},
  {'id': '4', 'text': '北京', 'py': 'beijing'},
  {'id': '5', 'text': '上海', 'py': 'shanghai'},
  {'id': '7', 'text': '湖北', 'py': 'hubei'},
  {'id': '2', 'text': '浙江', 'py': 'zhejiang'},
  {'id': '8', 'text': '河南', 'py': 'henan'},
  {'id': '9', 'text': '广西', 'py': 'guangxi'},
  {'id': '10', 'text': '海南', 'py': 'hainan'},
  {'id': '3', 'text': '青岛', 'py': 'qingdao'},
  {'id': '11', 'text': '山东', 'py': 'shandong'},
  {'id': '12', 'text': '重庆', 'py': 'chongqing'},
  {'id': '13', 'text': '福建', 'py': 'fujian'},
  {'id': '14', 'text': '湖南', 'py': 'hunan'},
  {'id': '15', 'text': '辽宁', 'py': 'liaoning'},
  {'id': '16', 'text': '厦门', 'py': 'xiamen'},
  {'id': '17', 'text': '安徽', 'py': 'anhui'},
  {'id': '18', 'text': '广东', 'py': 'guangdong'},
  {'id': '19', 'text': '甘肃', 'py': 'gansu'},
  {'id': '20', 'text': '贵州', 'py': 'guizhou'},
  {'id': '21', 'text': '吉林', 'py': 'jilin'},
  {'id': '22', 'text': '内蒙古', 'py': 'neimenggu'},
  {'id': '23', 'text': '四川', 'py': 'sichuan'},
  {'id': '24', 'text': '云南', 'py': 'yunnan'},
  {'id': '25', 'text': '山西', 'py': 'shanxi'},
  {'id': '26', 'text': '陕西', 'py': 'shaanxi'},
  {'id': '27', 'text': '新疆', 'py': 'xinjiang'},
  {'id': '28', 'text': '大连', 'py': 'dalian'},
  {'id': '29', 'text': '宁波', 'py': 'ningbo'},
  {'id': '30', 'text': '江西', 'py': 'jiangxi'},
  {'id': '31', 'text': '黑龙江', 'py': 'heilongjiang'},
  {'id': '32', 'text': '青海', 'py': 'qinghai'} //
  // {"id":"33","text":"西藏","py":"xizang"} //暂未支持
]

// 科目辅助核算默认值
export const SUBJECT_AUXILIARY_DEFAULT = '0000000000'

// 默认科目编码规则
export const CODE_RULE_DEFAULT = '4/2/2/2/2'
// 科目层级
export const SUBJECT_LEVEL = [
  {
    value: 1,
    label: '1级'
  },
  {
    value: 2,
    label: '2级'
  },
  {
    value: 3,
    label: '3级'
  },
  {
    value: 4,
    label: '4级'
  },
  {
    value: 5,
    label: '5级'
  }
]
// 科目类型
export const SUBJECT_ATTR = [
  {
    value: null,
    label: '全部'
  },
  {
    value: 0,
    label: '资产'
  },
  {
    value: 1,
    label: '负债'
  },
  {
    value: 2,
    label: '共同'
  },
  {
    value: 3,
    label: '所有者权益'
  },
  {
    value: 4,
    label: '成本'
  },
  {
    value: 5,
    label: '损益'
  }
]
export const ACCOUNT_AGE = [
  {
    code: '01',
    corp: '000001',
    days: 1,
    id: '00000100000000ZZnTcA002I',
    name: '日账龄',
    order: 'asc',
    page: 1,
    rows: 10,
    status: 0,
    type: 0
  }, {
    code: '02',
    corp: '000001',
    days: 30,
    id: '00000100000000ZZnTcA002J',
    name: '月账龄',
    order: 'asc',
    page: 1,
    rows: 10,
    status: 0,
    type: 1
  }, {
    code: '03',
    corp: '000001',
    days: 360,
    id: '00000100000000ZZnTcA002K',
    name: '年账龄',
    order: 'asc',
    page: 1,
    rows: 10,
    status: 0,
    type: 2
  }
]
// 人民币id
export const CURRENCY_RMB = '00000100AA10000000000BKT'
export const CURRENCY_ZHBWB = 'zhbwb'

export const CORP_VERSION_NAME = {
  '1': '普通版',
  '2': 'C端版',
  '3': '渠道商版',
  '4': '标准版',
  '5': '旗舰版',
  '6': '普通加盟商',
  '7': '工厂版',
  '8': '金牌加盟商',
  '9': '演示加盟商'
}

export const RELATE_DATE_TYPE = {
  voucher: 'data-change-voucher',
  subject: 'data-change-subject',
  period_close: 'data-change-period_close',
  companyinfo: 'data-change-companyinfo'
}
export const REFRESH_DATA = {
  refreshData: 'refreshData'
}

export const VEX_MAXLENGTH = 10000
