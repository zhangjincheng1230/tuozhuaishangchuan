// 首页api
import {get, post} from '@/utils/request'
// this.$api.Home.

// 财务概要信息
export function glRepCwgyinfoact (param) {
  return post('/gl/gl_rep_cwgyinfoact/query', param)
}
// 利润表
export function glRepLrbactqueryYearAction (param) {
  return get('/gl/gl_rep_lrbact/queryYear', param)
}
// 发生余额表
export function glRepFsyebactqueryYearAction (param) {
  return get('/gl/gl_rep_fsyebact/queryYear', param)
}
// 客服类型
export function custServActQuery (param) {
  return get('/sys/custServAct/query', param)
}
// getSummary 方法
export function sysZyactQuery (param) {
  return post('/sys/sys_zyact/query', param)
}
// getVCHTemplate 方法
export function glCymbQuery (param) {
  return post('/gl/gl_cymb/query', param)
}
// 获取参数设置节点数据
export function sysParameteract (param) {
  return post('/sys/sys_parameteract', param)
}

// 查询财务进度
export function getFinanceProgress (param) {
  return get('/zxkj/workbench/getFinanceProgress', param)
}
// 更新财务进度（记账完成状态不可编辑）
export function updateFinanceProgress (data) {
  return post('/zxkj/workbench/updateFinanceProgress', data)
}
// 预警类别
export function queryIncomeWarningInfo (param) {
  return post('/gl/gl_incomewarning/queryIncomeWarningInfo', param)
}
// 首页消息数量
export function checkNewMessage (param) {
  return get('/zxkj/msg/message/checkNewMessage', param)
}
// 主页消息
export function pubMessageGetAdminMsg (param) {
  return get('/zxkj/msg/message/getAdminMsg', param)
}
// 主页公告
export function pubMessageGetSysMsg (param) {
  return get('/zxkj/msg/message/getSysMsg', param)
}
// 读取更新消息
export function updateMsgStatus (data) {
  return post('/zxkj/msg/message/updateMsgStatus', data)
}
// 查询企业信息
export function enterpriseQuery (param) {
  return get('/zxkj/sys/sys_kj_ztsz/query', param)
}
// 查询增值税
export function getYearAddTax (year, corpId) {
  return get('/report/home/addTaxInfo', {
    year,
    corpId
  })
}

// 查询增值税税负预警线
export function getTaxWarningRate (corpId) {
  return get('/zxkj/sys/sys_corpact/getTaxWarningRate', {
    corpId
  })
}

// 更新增值税税负预警线
export function updateTaxWarningRate (rate, corpId) {
  return post('/zxkj/sys/sys_corpact/updateTaxWarningRate', {
    rate,
    corpId
  })
}

// 修改密码
export function updatePassword (param) {
  return post('/auth/updatePassword', param)
}

// 获取版本号
export function getVersionNo (param) {
  return get('/zxkj/gl_logpicact/query', param)
}

export function saveReadChangelog (param) {
  return get('/zxkj/gl_logpicact/save', param)
}

export function readAnnouncement (param) {
  return get('/zxkj/msg/message/readAnnouncement', param)
}
