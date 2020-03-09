// 销项发票(旧)
import {get, post, exportExcel} from '@/utils/request'

export function queryData (param) { // 销项查询
  return post('/zxkj/zncs/gl_vatsalinvact/queryInfo', param)
}

export function onTicket (param) { // 一键取票
  return post('/zxkj/zncs/gl_vatsalinvact/onTicket', param)
}

export function ticketWay (param) { // 一键取票查询
  return post('/zxkj/zncs/gl_vatsalinvact/chooseTicketWay', param)
}

export function queryCategory (param) { // 业务类型参照
  return get('/zxkj/zncs/gl_vatsalinvact/queryCategoryRef', param)
}

export function getBusiType (param) { // 191212业务类型参照（入账设置查询）
  return post('/zxkj/zncs/gl_vatsalinvact/getBusiType', param)
}

export function setBusiType (param) { // 入账设置查询保存(旧)
  return post('/zxkj/zncs/gl_vatsalinvact/setBusiType', param)
}

export function onDelte (param) { // 删除
  return post('/zxkj/zncs/gl_vatsalinvact2/onDelete', param)
}

export function saveInventoryData (param) {
  return post('/zxkj/zncs/gl_vatsalinvact/saveInventoryData', param)
}
export function queryInfo (param) { // 匹配存货 存货名称参照
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}

export function combineRule (param) { // 合并规则 保存
  return post('/zxkj/zncs/gl_vatsalinvact/combineRule', param)
}

export function queryRule (param) { // 合并规则设置查询
  return get('/zxkj/zncs/gl_vatsalinvact2/queryRule', param)
}

export function impExcel (param) { // 导入
  return post('/zxkj/zncs/gl_vatsalinvact/impExcel', param)
}

export function exportExcelData (fileName, param) { // 导出
  return exportExcel('/zxkj/zncs/gl_vatsalinvact/expExcelData', fileName, param)
}

export function saveOrUpdate (param) { // 新增 修改
  return post('/zxkj/zncs/gl_vatsalinvact/onUpdate', param)
}

export function queryB (param) { // 新增 货物或应税劳务名称 参照
  return get('/zxkj/bdset/gl_fzhsact/queryB', param)
}

export function customerInfoQueryB (param) { // 新增 购买方公司信息参照
  return get('/zxkj/zncs/gl_vatincinvact/queryB', param)
}

export function queryCorpReference (param) { // 新增 销售方公司参照
  return get('/zxkj/sys_corpinfo//queryCorpInfo', param)
}

export function queryInfoByID (param) { // 查询票据详细信息
  return get('/zxkj/zncs/gl_vatsalinvact/queryInfoByID', param)
}

export function getGoods (param) { // 生成凭证 获取存货关系
  return post('/zxkj/zncs/gl_vatsalinvact/getGoodsInvenRela', param)
}

export function combinePZ (param) { // 生成凭证保存
  return post('/zxkj/zncs/gl_vatsalinvact/combinePZ', param)
}

export function cbhsTypeQuery (param) { // 存货成本核算方式查询
  return get('/zxkj/glic/gl_icinvset/query', param)
}

export function createPzData (param) { // 生成凭证2
  return post('/zxkj/zncs/gl_vatsalinvact/createPzData', param)
}

export function matchInventoryData (param) { // 获取存货数据2
  return post('/zxkj/zncs/gl_vatsalinvact/matchInventoryData', param)
}
export function queryBySpercialKM (param) { // 生成凭证匹配存货 科目名称参照
  return get('/zxkj/icset/inventoryact/queryBySpecialKM', param)
}

export function createIC (param) { // 生成出库
  return post('/zxkj/zncs/gl_vatsalinvact/createIC', param)
}
