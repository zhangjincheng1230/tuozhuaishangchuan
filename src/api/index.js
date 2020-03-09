/**
 * api接口的统一出口
 */

// 系统
import * as System from '@/api/models/system'
import * as Home from '@/api/models/home'
import * as WorkToDo from '@/api/models/home/workToDo'
import * as Public from '@/api/models/public'
import qybdReport from '@/api/models/financial-report/qybd-report'
// 多栏账
import dlzReport from '@/api/models/financial-book/dlz-report'
// 往来账龄余额
import wlzlyeReport from '@/api/models/financial-book/wlzlye-report'
// 往来账龄明细
import wlzlmxReport from '@/api/models/financial-book/wlzlmx-report'
// 年末结账
import * as nmjz from '@/api/models/jzcl/nmjz'
// 会计记账查询
import * as kjjzSearch from '@/api/models/jzcl/kjjz-search'
// 风控体检报告
import fktjbg from '@/api/models/financial-book/fktjbg-report'
// 增值税明细明细
import zzsmxReport from '@/api/models/financial-book/zzsmx-report'

import * as printSetting from '@/api/models/financial-book/print-report'
// 辅助余额表
import * as AuxiliaryBalanceReport from '@/api/models/financial-book/auxiliary-balance-report'
// 辅助明细账
import * as FzmxReport from '@/api/models/financial-book/fzmx-report'
// 现金流量表
import * as XjllReport from '@/api/models/financial-report/xjll-report'
// 利润表
import * as LrbReport from '@/api/models/financial-report/lrb-report'
// 分部利润表
import * as LrbCenterReport from '@/api/models/financial-report/lrb-center-report'
// 业务活动表
import * as YwhdReport from '@/api/models/financial-report/ywhd-report'
// 业务活动季报
import * as YwhdJbReport from '@/api/models/financial-report/ywhdJb-report'
import yyfpReport from '@/api/models/financial-report/yyfp-report'
// 收入支出表
import * as srzcReport from '@/api/models/financial-report/srzc-report'
// 序时账
import * as xszReport from '@/api/models/financial-book/xsz-report'
// 财务概要信息表
import * as cwgyReport from '@/api/models/financial-report/cwgy-report'
// 基础设置
import * as BasicSettingApi from '@/api/models/basic-setting/basic-setting-api'
// 工资表
import * as SalaryManageApi from '@/api/models/salary-manage/salary-manage-api'
// 纳税申报
import * as TaxRptApi from '@/api/models/taxrpt/taxrpt-api'
// 发生额及余额表
import * as fsyebReport from '@/api/models/financial-book/fsyeb-report'
// 科目明细表
import * as kmmxReport from '@/api/models/financial-book/kmmx-report'
// 科目总账
import * as kmzzReport from '@/api/models/financial-book/kmzz-report'
// 现金银行日记账
import * as xjyhrjzReport from '@/api/models/financial-book/xjyhrjz-report'
// 利润表季报
import * as lrbjbReport from '@/api/models/financial-report/lrbjb-report'
// 现金流量表季报
import * as xjlljbReport from '@/api/models/financial-report/xjlljb-report'
// 资产负债表
import * as zcfzReport from '@/api/models/financial-report/zcfz-report'
// 科目汇总表
import * as kmhzbReport from '@/api/models/financial-book/kmhzb-report'
// 数量金额总账
import * as SljezzReport from '@/api/models/financial-book/sljezz-report'
// 数量金额明细账
import * as SljemxzReport from '@/api/models/financial-book/sljemxz-report'
// 存货管理
import * as GeneralInventoryApi from '@/api/models/general-inventory/general-inventory-api'
// 库存管理
import * as InventoryManageApi from '@/api/models/inventory-manage/inventory-manage-api'
// 资产类别
import * as linkAssets from '@/api/models/asset-manage/classesThis'
// 资产总账
import * as zczzReport from '@/api/models/asset-manage/zczzRpt'
// 资产明细账
import * as zcmxReport from '@/api/models/asset-manage/zcmxRpt'
// 总账对账
import * as generalLedger from '@/api/models/asset-manage/general-ledger'
// 折旧汇总表
import * as zjhzReport from '@/api/models/asset-manage/zjhzRpt'
// 折旧明细账
import * as tableOfContents from '@/api/models/asset-manage/tableof-contents'
// 资产清理
import * as toLowerCases from '@/api/models/asset-manage/tolower-case'
// 凭证
import * as Voucher from '@/api/models/voucher'
// 资产卡片
import * as assetsCard from '@/api/models/asset-manage/assets-card'
// 原值变更
import * as originalChange from '@/api/models/asset-manage/original-change'
// 科目期初
import * as KmQc from '@/api/models/basic-setting/km-qc'
// 期末处理
import * as qmcl from '@/api/models/jzcl/qmcl'
// 一键结转
import * as yjjz from '@/api/models/jzcl/yjjz'
// 期末关账
import * as qmgz from '@/api/models/jzcl/qmgz'
// 期末关账
import * as qmgzbg from '@/api/models/jzcl/qmgzbg'
// 税费计算
import * as TaxCalculator from '@/api/models/jzcl/tax-calculator'
// 进项发票
import * as inComeBill from '@/api/models/bill-manage/income-bill'
// 进项发票(旧)
import * as oldInComeBill from '@/api/models/bill-manage/oldincome-bill'
// 销项发票
import * as outPutBill from '@/api/models/bill-manage/outputbills'
// 销项发票(旧)
import * as oldOutPutBill from '@/api/models/bill-manage/oldoutputbills'
// 银行对账单(旧)
import * as linkAssetstwo from '@/api/models/asset-manage/american'
// 导出接口
export default {
  System,
  WorkToDo,
  Public,
  Home,
  qybdReport,
  dlzReport,
  AuxiliaryBalanceReport,
  FzmxReport,
  yyfpReport,
  xszReport,
  cwgyReport,
  BasicSettingApi,
  SalaryManageApi,
  TaxRptApi,
  XjllReport,
  YwhdReport,
  YwhdJbReport,
  printSetting,
  srzcReport,
  LrbReport,
  LrbCenterReport,
  wlzlyeReport,
  wlzlmxReport,
  zzsmxReport,
  nmjz,
  kjjzSearch,
  fsyebReport,
  kmmxReport,
  kmzzReport,
  xjyhrjzReport,
  lrbjbReport,
  xjlljbReport,
  zcfzReport,
  kmhzbReport,
  SljezzReport,
  SljemxzReport,
  GeneralInventoryApi,
  InventoryManageApi,
  fktjbg,
  linkAssets,
  generalLedger,
  tableOfContents,
  toLowerCases,
  Voucher,
  assetsCard,
  originalChange,
  KmQc,
  qmcl,
  yjjz,
  qmgz,
  qmgzbg,
  TaxCalculator,
  inComeBill,
  oldInComeBill,
  outPutBill,
  oldOutPutBill,
  zczzReport,
  zcmxReport,
  zjhzReport,
  linkAssetstwo,
}
