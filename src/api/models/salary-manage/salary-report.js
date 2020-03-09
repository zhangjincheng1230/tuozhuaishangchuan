// 工资表 api
import { downloadFile, get, post } from '@/utils/request'

// 查询工资表
export function query (param) {
  return get('/zxkj/salary/gl_gzbact2/query', param)
}

// 删除工资表
export function deleteRows (param) {
  return post('/zxkj/salary/gl_gzbact2/delete', param)
}

// 工资表关账检查
export function judgeHasPZ (param) {
  return get('/zxkj/salary/gl_gzbact2/judgeHasPZ', param)
}
// 工资表关账
export function isGZ (param) {
  return get('/zxkj/salary/gl_gzbact2/isGZ', param)
}

// 复制工资表月份
export function getCopyMonth (param) {
  return get('/zxkj/salary/gl_gzbact2/getCopyMonth', param)
}

// 复制工资表
export function copyByMonth (param) {
  return get('/zxkj/salary/gl_gzbact2/copyByMonth', param)
}

// 打印
export function printPdf (param) {
  return downloadFile('/zxkj/salary/gl_gzbact2/print', param)
}

// 导出工资表数据
export function expExcelData (param) {
  return downloadFile('/zxkj/salary/gl_gzbact2/expExcelData', param)
}

// 导出模板文件
export function expExcel (param) {
  return downloadFile('/zxkj/salary/gl_gzbact2/expExcel', param)
}

// 导出纳税申报
export function expNSSBB (param) {
  return downloadFile('/zxkj/salary/gl_gzbact2/expNSSBB', param)
}

// 导出人员信息
export function expPersonp (param) {
  return post('/zxkj/salary/gl_gzbact2/expPersonCheck', param)
}

// 导出人员信息
export function expPerson (param) {
  return downloadFile('/zxkj/salary/gl_gzbact2/expPerson', param)
}

// 获取人员工资信息
export function getSalaryAccSet (param) {
  return post('/zxkj/salary/gl_gzbact2/getSalaryAccSet', param)
}

// 保存工资
export function saveInfo (param) {
  return post('/zxkj/salary/gl_gzbact2/save', param)
}

// 导入工资
export function importB (param) {
  return post('/zxkj/salary/gl_gzbact2/impExcel', param)
}

// 联查凭证
export function queryGlpz (param) {
  return get('/zxkj/salary/gl_gzbact2/queryGlpz', param)
}

// 生成凭证校验
export function check (param) {
  return get('/zxkj/salary/gl_gzbact2/check', param)
}

// 工资发放
export function gzff (param) {
  return get('/zxkj/salary/gl_gzbact2/gzff', param)
}

// 工资计提
export function gzjt (param) {
  return get('/zxkj/salary/gl_gzbact2/gzjt', param)
}
