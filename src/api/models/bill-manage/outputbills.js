// 销项发票
import {get, post} from '@/utils/request'
import { exportExcelse } from '../asset-manage/classesThisval'

export function queryData (param) { // 销项查询
  return post('/zxkj/zncs/gl_vatsalinvact2/queryInfo', param)
}

export function onTicket (param) { // 一键取票
  return post('/zxkj/zncs/gl_vatsalinvact2/onTicket', param)
}

export function ticketWay (param) { // 一键取票查询
  return post('/zxkj/zncs/gl_vatsalinvact2/chooseTicketWay', param)
}

export function queryCategory (param) { // 业务类型参照
  return get('/zxkj/zncs/gl_vatsalinvact2/queryCategoryRef', param)
}

export function updateCategory (param) { // 入账设置保存
  return post('/zxkj/zncs/gl_vatsalinvact2/updateCategoryset', param)
}

export function queryCategorySet (param) { // 入账设置查询
  return post('/zxkj/zncs/gl_vatsalinvact2/queryCategoryset', param)
}

export function queryByPkcorp (param) { // 入账设置科目参照
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkcorp2', param)
}

export function onDelte (param) { // 删除
  return post('/zxkj/zncs/gl_vatsalinvact2/onDelete', param)
}

export function saveInventoryData (param) {
  return post('/zxkj/zncs/gl_vatsalinvact2/saveInventoryData', param)
}
export function queryInfo (param) { // 匹配存货 存货名称参照
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}

export function combineRule (param) { // 合并规则 保存
  return post('/zxkj/zncs/gl_vatsalinvact2/combineRule', param)
}

export function queryRule (param) { // 合并规则设置查询
  return get('/zxkj/zncs/gl_vatsalinvact2/queryRule', param)
}

export function impExcel (param) { // 导入
  return post('/zxkj/zncs/gl_vatsalinvact2/impExcel', param)
}

export function exportExcelData (fileName, param) { // 导出
  return exportExcelse('/zxkj/zncs/gl_vatsalinvact2/expExcelData', fileName, param)
}

export function saveOrUpdate (param) { // 新增 修改 保存
  return post('/zxkj/zncs/gl_vatsalinvact2/saveOrUpdate', param)
}

export function queryB (param) { // 新增 货物或应税劳务名称 参照
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}

export function customerInfoQueryB (param) { // 新增 购买方公司信息参照
  return get('/zxkj/zncs/gl_vatincinvact2/queryB', param)
}

export function queryCorpReference (param) { // 新增 销售方公司参照
  return get('/zxkj/zncs/gl_vatsalinvact2/queryCorpReference', param)
}

export function queryInfoByID (param) { // 查询票据详细信息
  return get('/zxkj/zncs/gl_vatsalinvact2/queryInfoByID', param)
}

export function getGoods (param) { // 生成凭证 获取存货关系
  return post('/zxkj/zncs/gl_vatsalinvact2/getGoodsInvenRela_long', param)
}

export function combinePZ (param) { // 生成凭证保存
  return post('/zxkj/zncs/gl_vatsalinvact2/combinePZ_long', param)
}

export function cbhsTypeQuery (param) { // 存货成本核算方式查询
  return get('/zxkj/glic/gl_icinvset/query', param)
}

export function createPzData (param) { // 生成凭证2
  return post('/zxkj/zncs/gl_vatsalinvact2/createPzData_long', param)
}

export function matchInventoryData (param) { // 获取存货数据2
  return post('/zxkj/zncs/gl_vatsalinvact2/matchInventoryData_long', param)
}
export function queryBySpercialKM (param) { // 生成凭证匹配存货 科目名称参照
  return get('/zxkj/icset/inventoryact/queryBySpecialKM', param)
}
