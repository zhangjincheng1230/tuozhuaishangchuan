// 进项发票(旧)
import {post, get, exportExcel} from '@/utils/request'

export function queryDataInfo (param) { // 进项发票查询
  return post('/zxkj/zncs/gl_vatincinvact/queryInfo', param)
}

export function queryOnTicket (param) { // 一键取票查询
  return get('/zxkj/zncs/gl_vatincinvact/onTicket', param)
}

export function chooseTicketWay (param) { // 一键取票 查询纳税人识别号和绑定码
  return post('/zxkj/zncs/gl_vatincinvact/chooseTicketWay', param)
}

export function queryCategoryset (param) { // 入账设置查询
  return post('/zxkj/zncs/gl_vatincinvact/queryCategoryset', param)
}

export function queryRule (param) { // 合并规则查询
  return post('/zxkj/zncs/gl_vatincinvact/queryRule', param)
}

export function queryCategoryRef (param) { // 业务类型参照
  return get('/zxkj/zncs/gl_vatincinvact/queryCategoryRef', param)
}

export function updateCategoryset (param) { // 入账设置保存
  return post('/zxkj/zncs/gl_vatincinvact/updateCategoryset', param)
}

export function setBusiType (param) { // 入账设置保存（jiu）
  return post('/zxkj/zncs/gl_vatincinvact/setBusiType', param)
}

export function getBusiType (param) { // 191212业务类型参照（入账设置查询）
  return get('/zxkj/zncs/gl_vatincinvact/getBusiType', param)
}

export function queryByPkcorp (param) { // 入账设置科目参照
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkcorp2', param)
}
export function queryByPkcorpAll (param) { // 入账设置科目参照全部数据(包括accindex：0，1，2，3，4，5)
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkCorp', param)
}

export function saveInventoryData (param) { // 匹配
  return post('/zxkj/zncs/gl_vatincinvact/saveInventoryData', param)
}

export function queryBySpecialKM (param) { // 匹配存货科目名称参照
  return get('/zxkj/icset/inventoryact/queryBySpecialKM', param)
}

export function combineRule (param) { // 合并规则保存
  return post('/zxkj/zncs/gl_vatincinvact/combineRule', param)
}

export function getGoodsInvenRela (param) { // 存货匹配
  return post('/zxkj/zncs/gl_vatincinvact/getGoodsInvenRela', param)
}

export function matchInventoryData (param) { // 存货匹配2
  return post('/zxkj/zncs/gl_vatincinvact/matchInventoryData', param)
}

export function goodsNameQueryInfo (param) { // 存货名称参照
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}

export function cbhsTypeQuery (param) { // 存货成本核算方式查询
  return get('/zxkj/glic/gl_icinvset/query', param)
}

export function createPZData (param) { // 生成凭证2
  return post('/zxkj/zncs/gl_vatincinvact/createPzData', param)
}

export function queryFilterKm (param) {
  return get('/zxkj/zncs/gl_vatincinvact/queryFilterKm', param)
}

export function impExcel (param) { // 导入
  return post('/zxkj/zncs/gl_vatincinvact/impExcel', param)
}

export function exportExcelData (fileName, param) { // 导出
  return exportExcel('/zxkj/zncs/gl_vatincinvact/expExcelData', fileName, param)
}

export function queryCorpReference (param) { // 新增时购买方信息参照
  return get('/zxkj/sys_corpinfo/queryCorpInfo', param)
}

export function setBusPeriod (param) { // 期间调整
  return post('/zxkj/zncs/gl_vatincinvact/setBusiperiod', param)
}

export function queryInfoByID (param) { // 查询票据详细信息
  return get('/zxkj/zncs/gl_vatincinvact/queryInfoByID', param)
}

export function combinePZ (param) { // 生成凭证
  return post('/zxkj/zncs/gl_vatincinvact/combinePZ', param)
}

export function queryB (param) { // 货物或应税劳务参照
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}

export function onDelete (param) { // 进项发票删除
  return post('/zxkj/zncs/gl_vatincinvact/onDelete', param)
}

export function saveOrUpdate (param) { // 进项发票(旧)新增 修改
  return post('/zxkj/zncs/gl_vatincinvact/onUpdate', param)
}

export function saleQueryB (param) { // 销售方参照
  return get('/zxkj/zncs/gl_vatincinvact/queryB', param)
}

export function workQueryB (param) { // 存货档案（总账）
  return post('/zxkj/zncs/workbench/queryB', param)
}

export function inventoryQueryInfo (param) { // 存货档案（库存）
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}

export function createIC (param) { // 生成入库
  return post('/zxkj/zncs/gl_vatincinvact/createIC ', param)
}
