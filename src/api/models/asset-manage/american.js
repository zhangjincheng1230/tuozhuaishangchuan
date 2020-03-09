
import { get, post, exportExcel} from '@/utils/request'
import { exportExcelse } from './classesThisval'
// 银行对账单账户参照
export function Producator (param) {
  return get('/zxkj/bdset/gl_yhzhact/query', param)
}

// 银行对账单查询
export function Contributors (param) {
  return post('/zxkj/zncs/gl_yhdzdact/queryInfo', param)
}

// 修改（新增）银行账户
export function openAccount (param) {
  return post('/zxkj/bdset/gl_yhzhact/save', param)
}
// 获取增加银行账户的编码
export function belastingcode (param) {
  return get('/zxkj/bdset/gl_yhzhact/queryDjCode', param)
}

// 银行对账单新增
export function statements (param) {
  return post('/zxkj/zncs/gl_yhdzdact/onUpdate', param)
}

// 银行对账单业务类型参照
export function Banking (param) {
  return get('/zxkj/sys/sys_dcpzmb/queryByRef', param)
}

// 银行对账单删除
export function Bankingdel (param) {
  return post('/zxkj/zncs/gl_yhdzdact/onDelete', param)
}

// 银行对账单导入
export function Bankingperog (param) {
  return post('/zxkj/zncs/gl_yhdzdact/impExcel', param)
}

// 银行对账单期间调整
export function qijiandailog (param) {
  return post('/zxkj/zncs/gl_yhdzdact/setBusiperiod', param)
}

// 银行对账单期间调整
export function qijianyewu (param) {
  return get('/zxkj/zncs/gl_yhdzdact/queryCategoryset', param)
}

// 银行对账单期间保存
export function qijianyewubaocun (param) {
  return post('/zxkj/zncs/gl_yhdzdact/setBusiType', param)
}
// 银行对账单合并c查询
export function queryRule (param) {
  return get('/zxkj/zncs/gl_yhdzdact/queryRule', param)
}

// 银行对账单合并c查询
export function combineRule (param) {
  return post('/zxkj/zncs/gl_yhdzdact/combineRule', param)
}

// 银行对账单合并c查询
export function exportExcels (fileName, param) {
  return exportExcel('/zxkj/zncs/gl_yhdzdact/expExcelData', fileName, param)
}

// 银行对账单生成
export function getGoodsInvenRela (param) {
  return post('/zxkj/zncs/gl_yhdzdact/checkBeforPZ', param)
}

// 银行对账单生成多条
export function getGoodsInvenRelasa (param) {
  return post('/zxkj/zncs/gl_yhdzdact/combinePZ', param)
}

// 银行对账勾对
export function getgouduitab (param) {
  return post('/zxkj/zncs/workbench/queryBankInfo', param)
}

// 银行对账勾对
export function getgouduitabsave (param) {
  return get('/zxkj/zncs/workbench/matchBankInfo', param)
}
// 银行对账单单条收录
export function getonevoucher (param) {
  return post('/zxkj/zncs/gl_yhdzdact/getTzpzHVOByID', param)
}
