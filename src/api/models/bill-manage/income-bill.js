// 进项发票
import {post, get} from '@/utils/request'
import { exportExcelse } from '../asset-manage/classesThisval'

export function queryDataInfo (param) { // 进项发票查询
  return post('/zxkj/zncs/gl_vatincinvact2/queryInfo', param)
}

export function queryOnTicket (param) { // 一键取票查询
  return post('/zxkj/zncs/gl_vatincinvact2/onTicket', param)
}

export function chooseTicketWay (param) { // 一键取票 查询纳税人识别号和绑定码
  return post('/zxkj/zncs/gl_vatincinvact2/chooseTicketWay', param)
}

export function queryCategoryset (param) { // 入账设置查询
  return post('/zxkj/zncs/gl_vatincinvact2/queryCategoryset', param)
}

export function queryRule (param) { // 合并规则查询
  return post('/zxkj/zncs/gl_vatincinvact2/queryRule', param)
}

export function queryCategoryRef (param) { // 业务类型参照
  return get('/zxkj/zncs/gl_vatincinvact2/queryCategoryRef', param)
}

export function updateCategoryset (param) { // 入账设置保存
  return post('/zxkj/zncs/gl_vatincinvact2/updateCategoryset', param)
}

export function queryByPkcorp (param) { // 入账设置科目参照
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkcorp2', param)
}
export function queryByPkcorpAll (param) { // 入账设置科目参照全部数据(包括accindex：0，1，2，3，4，5)
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkCorp', param)
}

export function saveInventoryData (param) { // 匹配
  return post('/zxkj/zncs/gl_vatincinvact2/saveInventoryData', param)
}

export function queryBySpecialKM (param) { // 匹配存货科目名称参照
  return get('/zxkj/icset/inventoryact/queryBySpecialKM', param)
}

export function combineRule (param) { // 合并规则保存
  return post('/zxkj/zncs/gl_vatincinvact2/combineRule', param)
}

export function getGoodsInvenRela (param) { // 存货匹配
  return post('/zxkj/zncs/gl_vatincinvact2/getGoodsInvenRela_long', param)
}

export function matchInventoryData (param) { // 存货匹配2
  return post('/zxkj/zncs/gl_vatincinvact2/matchInventoryData_long', param)
}

export function goodsNameQueryInfo (param) { // 存货名称参照
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}

export function cbhsTypeQuery (param) { // 存货成本核算方式查询
  return get('/zxkj/glic/gl_icinvset/query', param)
}

export function createPZData (param) { // 生成凭证2
  return post('/zxkj/zncs/gl_vatincinvact2/createPzData_long', param)
}

export function queryFilterKm (param) {
  return get('/zxkj/zncs/gl_vatincinvact2/queryFilterKm', param)
}

export function impExcel (param) { // 导入
  return post('/zxkj/zncs/gl_vatincinvact2/impExcel', param)
}

export function exportExcelData (fileName, param) { // 导出
  return exportExcelse('/zxkj/zncs/gl_vatincinvact2/expExcelData', fileName, param)
}

export function queryCorpReference (param) { // 新增时购买方信息参照
  return post('/zxkj/zncs/gl_vatincinvact2/queryCorpReference', param)
}

export function setBusPeriod (param) { // 期间调整
  return post('/zxkj/zncs/gl_vatincinvact2/setBusiperiod', param)
}

export function queryInfoByID (param) { // 查询票据详细信息
  return get('/zxkj/zncs/gl_vatincinvact2/queryInfoByID', param)
}

export function combinePZ (param) { // 生成凭证
  return post('/zxkj/zncs/gl_vatincinvact2/combinePZ_long', param)
}

export function queryB (param) { // 货物或应税劳务参照
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}

export function onDelete (param) { // 进项发票删除
  return post('/zxkj/zncs/gl_vatincinvact2/onDelete', param)
}

export function saveOrUpdate (param) { // 进项发票新增 修改
  return post('/zxkj/zncs/gl_vatincinvact2/saveOrUpdate', param)
}

export function saleQueryB (param) { // 销售方参照
  return get('/zxkj/zncs/gl_vatincinvact2/queryB', param)
}

export function workQueryB (param) { // 存货档案（总账）
  return post('/zxkj/zncs/workbench/queryB', param)
}

export function inventoryQueryInfo (param) { // 存货档案（库存）
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}
