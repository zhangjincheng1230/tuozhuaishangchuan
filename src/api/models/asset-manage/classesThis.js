// 资产类别
import { get, post, printpdf, exportExcel, downloadFile} from '@/utils/request'
import { exportExcelse } from './classesThisval'

// 资产类别属性
export function Attribute (param) {
  return get('/zxkj/sys/sys_zclbact/queryRef', param)
}

// 资产类别保存
export function IAssetExporter (data) {
  return post('/zxkj/sys/sys_zclbact/save', data)
}

// 资产类别删除
export function shortcutToAssetId (param) {
  return post('/zxkj/sys/sys_zclbact/delete', param)
}

// 资产类别查询
export function testCreateAssets (param) {
  return get('/zxkj/sys/sys_zclbact/query', param)
}

// 资产科目对照查询
export function Accounts (param) {
  return get('/zxkj/sys/sys_zczzdzbact/query', param)
}

// 资产科目参照
export function queryByPKcorp (param) {
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkcorp2', param)
}
// 资产科目对照增加、保存
export function controlled (data) {
  return post('/zxkj/sys/sys_zczzdzbact/save', data)
}
// 资产科目对照修改
export function controlledxiu (data) {
  return post('/zxkj/sys/sys_zczzdzbact/save', data)
}

// 资产科目对照删除
export function BankAccount (data) {
  return post('/zxkj/sys/sys_zczzdzbact/delete', data)
}

// 资产科目全部
export function IMyMoneyStorageAll (data) {
  return get('/zxkj/bdset/gl_cpacckmact/queryByPz', data)
}

// 资产科目参照
export function IMyMoneyStorage (data) {
  return get('/zxkj/bdset/gl_cpacckmact/queryByPkcorp2', data)
}

// 工作量查询
export function querying (data) {
  return post('/zxkj/am_workloadManagement/query', data)
}

// 工作量修改
export function coreworkloads (data) {
  return post('/zxkj/am_workloadManagement/save', data)
}
// 工作量继承
export function coreworkloadsjc (data) {
  return post('/zxkj/am_workloadManagement/inherit', data)
}
// 工作量打印
export function coreworkloadspdf (fileName, param) {
  return printpdf('/zxkj/am_rep_zjhzbact/print', fileName, param)
}

// 资产明细账查询
export function subsidiaryfortune (data) {
  return post('/zxkj/am_rep_zcmxact/query', data)
}

// 库存管理恢复默认
export function Managementul (data) {
  return get('/zxkj/icset/chkmszact/saveGroup', data)
}

// 库存管理查询
export function xininventory (data) {
  return get('/zxkj/icset/chkmszact/query', data)
}

// 库存管理保存
export function MaxSaves (data) {
  return post('/zxkj/icset/chkmszact/save', data)
}

// 库存管理辅助核算
export function accountingweb (data) {
  return get('/zxkj/bdset/gl_fzhsact/queryB', data)
}

// 存货分类查询
export function lastQueryStr (data) {
  return get('/zxkj/icset/invclassify/query', data)
}

// 存货分类保存
export function lastQueryStrsave (data) {
  return post('/zxkj/icset/invclassify/save', data)
}

// 存货分类删除
export function lastQueryStrdel (data) {
  return post('/zxkj/icset/invclassify/delete', data)
}

// 存货分类导入
export function lastQueryStrex (data) {
  return post('/zxkj/icset/invclassify/impExcel', data)
}
// 存货分类导入
export function lastQuerycod (data) {
  return get('/zxkj/icset/invclassify/queryDjCode', data)
}

// 计量单位获取编码
export function formalize (data) {
  return get('/zxkj/icset/meausreact/queryDjCode', data)
}

// 计量单位获取编码
export function measuring (data) {
  return get('/zxkj/icset/meausreact/queryInfo', data)
}

// 计量单位保存
export function autocomplete (data) {
  return post('/zxkj/icset/meausreact/onUpdate', data)
}

// 计量单位删除
export function stopOnFalse (data) {
  return post('/zxkj/icset/meausreact/onDelete', data)
}
// 计量单位删除
export function stopOnstrex (data) {
  return post('/zxkj/icset/meausreact/impExcel', data)
}

// 存货档案查询
export function queryB (param) {
  return get('/zxkj/icset/inventoryact/queryInfoBypage', param)
}
// 存货查询 按照参数
export function queryBParam (param) {
  return get('/zxkj/icset/inventoryact/queryInfo', param)
}
// 存货保存
export function saveb (param) {
  return post('/zxkj/icset/inventoryact/save', param)
}
// 存货批改
export function batchSaveB (param) {
  return post('/zxkj/icset/inventoryact/batchSave', param)
}
// 存货删除
export function deleteB (param) {
  return post('/zxkj/icset/inventoryact/onDelete', param)
}
// 存货导入
export function importB (param) {
  return post('/zxkj/icset/inventoryact/impExcel', param)
}
// // 存货导入更新
// export function impUpdateB (param) {
//   return post('/zxkj/bdset/gl_fzhsact/impUpdateB', param)
// }
// 存货合并
export function mergeData (param) {
  return post('/zxkj/icset/inventoryact/mergeData', param)
}
// 获取辅助编号
export function getCode (param) {
  return get('/zxkj/icset/inventoryact/queryDjCode', param)
}

// 获取存货档案科目参照
export function Preferences (param) {
  return get('/zxkj/icset/inventoryact/queryBySpecialKM', param)
}

// 存货档案生成结算价
export function fTradePrice (param) {
  return post('/zxkj/icset/inventoryact/createPrice', param)
}

// 上传图片
export function GetOptions (param) {
  return post('/zxkj/zncs/gl_imageuplad/uploadSingleFile', param)
}
// 上传图片校验
export function OnButtonStart (data) {
  return post('/zxkj/zncs/gl_imageuplad/beforeCheck', data)
}

// 银行对账单账户参照
export function Producator (param) {
  return get('/zxkj/bdset/gl_yhzhact/query', param)
}

// 银行对账单查询
export function Contributors (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/queryInfo', param)
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
  return post('/zxkj/zncs/gl_yhdzdact2/onUpdate', param)
}

// 银行对账单业务类型参照
export function Banking (param) {
  return get('/zxkj/zncs/gl_yhdzdact2/queryCategoryRef', param)
}

// 银行对账单删除
export function Bankingdel (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/onDelete', param)
}

// 银行对账单导入
export function Bankingperog (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/impExcel', param)
}

// 银行对账单期间调整
export function qijiandailog (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/setBusiperiod', param)
}

// 银行对账单期间调整
export function qijianyewu (param) {
  return get('/zxkj/zncs/gl_yhdzdact2/queryCategoryset', param)
}

// 银行对账单期间保存
export function qijianyewubaocun (param) {
  return get('/zxkj/zncs/gl_yhdzdact2/updateCategoryset', param)
}
// 银行对账单合并c查询
export function queryRule (param) {
  return get('/zxkj/zncs/gl_yhdzdact2/queryRule', param)
}

// 银行对账单合并c查询
export function combineRule (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/combineRule', param)
}

// 银行对账单合并c查询
export function exportExcels (fileName, param) {
  return exportExcelse('/zxkj/zncs/gl_yhdzdact2/expExcelData', fileName, param)
}

// 银行对账单生成
export function getGoodsInvenRela (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/checkBeforPZ', param)
}

// 银行对账单生成多条
export function getGoodsInvenRelasa (param) {
  return post('/zxkj/zncs/gl_yhdzdact2/combinePZ_long', param)
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
  return post('/zxkj/zncs/gl_yhdzdact2/getTzpzHVOByID', param)
}
// 图片预览查询
export function getphoto (param) {
  return post('/zxkj/zncs/gl_pzglact/search', param)
}

// 图片预览显示
export function getpiaoju (param) {
  return post('/zxkj/zncs/gl_imgview/getPicStatistics', param)
}

// 图片预览查询
export function photoopen (param) {
  return get('/zxkj/zncs/gl_imgview/search', param)
}

// 图片预览作废
export function zuofeiphoto (param) {
  return post('/zxkj/zncs/gl_pzglact/delImage', param)
}

// 图片业务
export function getyewu (param) {
  return get('/zxkj/sys/sys_dcpzmb/query', param)
}

// 图片制单
export function getzhidan (param) {
  return post('/zxkj/voucher-manage/voucher/quickCreateVoucher', param)
}

// 图片预览制单摘要
export function photozy (param) {
  return get('/zxkj/sys/sys_dcpzmb/queryChildByID', param)
}

// 图片预览凭证
export function photopz (param) {
  return post('/zxkj/voucher-manage/voucher/serVoucherByImagePk', param)
}
