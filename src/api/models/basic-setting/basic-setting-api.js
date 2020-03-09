// 基础设置api
// 银行账户
import * as BankAccount from '@/api/models/basic-setting/bank-account'
// 常用摘要
import * as Abstract from '@/api/models/basic-setting/common-abstract'
// 常用凭证模板
import * as VoucherTemplate from '@/api/models/basic-setting/voucher-template'
import XspzMb from '@/api/models/basic-setting/xspz-mb'
import XjllQc from '@/api/models/basic-setting/xjll-qc'
import dataUpgrade from '@/api/models/basic-setting/data-upgrade'
// 期末结转模版
import * as TransferTemplate from '@/api/models/basic-setting/transfer-template'
// 操作日志
import * as SysOpeLog from '@/api/models/basic-setting/sys_opelog'
// 业务类型模板
import * as BusinessTypeTemplate from '@/api/models/basic-setting/business-type-template'

// 预警设置
import * as IncomeWarning from '@/api/models/basic-setting/income-warning'
// 备份与恢复
import * as BackUp from '@/api/models/basic-setting/backup'
// 参数设置
import * as ParamSetting from '@/api/models/basic-setting/param-setting'
// 外币汇率
import * as ExchangeRate from '@/api/models/basic-setting/exchangerate'
// 辅助核算
import * as Auxiliary from '@/api/models/basic-setting/auxiliary'
// 标准科目
import * as StandardSubject from '@/api/models/basic-setting/standard-subject'
// 公司科目
import * as Subject from '@/api/models/basic-setting/subject'
// 公司科目
import * as Currency from '@/api/models/basic-setting/currency'
// 账套设置
import * as CompanySetting from '@/api/models/basic-setting/company-setting'
// 导出接口
export {
  BankAccount,
  Abstract,
  VoucherTemplate,
  XspzMb,
  XjllQc,
  dataUpgrade,
  TransferTemplate,
  SysOpeLog,
  BusinessTypeTemplate,
  IncomeWarning,
  BackUp,
  ParamSetting,
  ExchangeRate,
  Auxiliary,
  StandardSubject,
  Subject,
  Currency,
  CompanySetting
}
