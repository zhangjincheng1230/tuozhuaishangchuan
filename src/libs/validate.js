/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}
/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validateUsername(rule, value, callback) {
  const reg = /^[0-9a-zA-Z]{2,14}$/
  validate(rule, value, callback, reg)
}
/**
 *数字或字母组合 6-20位,(机构编码)
 * 长度为6-20字节
 * @param rule
 * @param value
 * @param callback
 */
export function validateUserCode(rule, value, callback) {
  const reg = /^[0-9a-zA-Z]{6,20}$/
  validate(rule, value, callback, reg)
}

/**
 * 发票代码校验
 * @param rule
 * @param value
 * @param callback
 */
export function invoiceCodeValidate(rule, value, callback) {
  const reg = /^[0-9]{12}$/
  validate(rule, value, callback, reg)
}
/**
 * 发票号码校验
 * @param rule
 * @param value
 * @param callback
 */
export function invoiceNumValidate(rule, value, callback) {
  const reg = /^[0-9]{8}$/
  validate(rule, value, callback, reg)
}
/**
 *中文数字英文字母，包含~`!@#$^*+:;?-(){}[],.|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;"特殊字符
 * 长度为1-100字节
 * @param rule
 * @param value
 * @param callback
 */
export function validateStoreName(rule, value, callback) {
  const reg = /^[a-zA-Z0-9\s\u4e00-\u9fa5[~`!@#$^*+:;?\-(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]{1,100}$/
  validate(rule, value, callback, reg)
}
/**
 * 校验手机号，长度为7-20
 * @param rule
 * @param value
 * @param callback
 */
export function validatePhone(rule, value, callback) {
  const reg = /^(1\d{10}|[0-9-—]{7,20})$/
  validate(rule, value, callback, reg)
}
/**
 * 校验手机号，长度为1开头 11位数字
 * @param rule
 * @param value
 * @param callback
 */
export function validateMobile(rule, value, callback) {
  const reg = /^1[0-9]{10}$/
  validate(rule, value, callback, reg)
}
/**
 * 校验电子邮箱
 * @param rule
 * @param value
 * @param callback
 */
export function validateEmail(rule, value, callback) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5\._-]+@[\.a-zA-Z0-9_-]+$/
  validate(rule, value, callback, reg)
}
/**
 * 校验地址包含中文数字英文字母，以及包含_#-()（）特殊字符
 * @param rule
 * @param value
 * @param callback
 */
export function validateAddress(rule, value, callback) {
  const reg = /^\s*[a-zA-Z0-9\u0391-\uFFE5_#-()（）]{1,100}\s*$/
  validate(rule, value, callback, reg)
}
/**
 * 检验姓名  中文数字英文字母包含空格 长度为1-10
 * @param rule
 * @param value
 * @param callback
 */
export function validateName(rule, value, callback) {
  const reg = /^[0-9a-zA-Z\s\u4e00-\u9fa5]{1,10}$/
  validate(rule, value, callback, reg)
}
/**
 *  系统管理 --用户管理--检验姓名 中文数字英文字母包含空格 长度为1-10
 * @param rule
 * @param value
 * @param callback
 */
export function validateNameList(rule, value, callback) {
  const reg = /^[a-zA-Z\s\u4e00-\u9fa5]{1,10}$/
  validate(rule, value, callback, reg)
}
/**
 * 商品名称 1-100个字节，字母数字中文
 * @param rule
 * @param value
 * @param callback
 */
export function validateoodsName(rule, value, callback) {
  const reg = /^[0-9a-zA-Z\s\u4e00-\u9fa5]{1,100}$/
  validate(rule, value, callback, reg)
}
/**
 * 税收分类编码  纯数字 19位以内
 * @param rule
 * @param value
 * @param callback
 */
export function taxClassificationCode(rule, value, callback) {
  const reg = /^[0-9]{1,19}$/
  validate(rule, value, callback, reg)
}
/**
 * 校验纳税人识别号
 * 数字或大写字母组合，6-20个字符
 * @param rule
 * @param value
 * @param callback
 */
export function validateTaxCode(rule, value, callback) {
  const reg = /^[A-Z0-9]{6,20}$/
  validate(rule, value, callback, reg)
}

/**
 * 银行账号：
 * 字母数字及~`!@#$%^*()_+[]\;',./?:"{}|~·！@#￥%……*（）——+{}|：“《》？【】、；‘，。/  字符组合；
 * @param rule
 * @param value
 * @param callback
 */
export function validateBankAccount(rule, value, callback) {
  const reg = /^[a-zA-Z0-9[~`!@#$^*+:;?\-(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]+$/
  validate(rule, value, callback, reg)
}
/**
 * 规格型号-----计量单位：
 * 字母数字中文及：~`!@#$%^*()_+[]\;',./?:"{}|~·！@#￥%……*（）——+{}|：“《》？
 * @param rule
 * @param value
 * @param callback
 */
export function validateMeasurement(rule, value, callback) {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5[~`!@#$^*+:;?\-(){}\[\],\.\|《》、，。！{}·#￥……*（）——:：“”？【】；‘’`_;\"]+$/
  validate(rule, value, callback, reg)
}
/**
 * 校验法人代表姓名
 * 法定代表人姓名：必填，可以为中文或者英文、空格，2-50个字符
 * @param rule
 * @param value
 * @param callback
 */
export function validateLegalName(rule, value, callback) {
  const reg = /^[a-zA-Z0-9\s\u4e00-\u9fa5]{2,50}$/
  validate(rule, value, callback, reg)
}
export function notNullValidate(rule, value, callback) {
  validate(rule, value, callback, null)
}
function validate(rule, value, callback, reg) {
  if (rule.validate) {
    if (!value) {
      return callback(new Error(rule.msg + '不能为空'))
    }
  }
  if (value) {
    if (!reg.test(value)) {
      return callback(new Error('请输入正确格式的' + rule.msg))
    }
  }
  return callback()
}
