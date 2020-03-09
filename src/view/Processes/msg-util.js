export function successMsg (obj, msg) {
  this.showMsg(obj, msg, 'success')
}
export function errorMsg (obj, msg) {
  this.showMsg(obj, msg, 'error')
}
export function warnMsg (obj, msg) {
  this.showMsg(obj, msg, 'warning')
}
export function showMsg (obj, msg, type) {
  obj.$message({
    showClose: true,
    dangerouslyUseHTMLString: true,
    message: msg,
    type: type
  })
}

export function loading (obj, text) {
  if (!text) { text = '加载中' }
  const loading = obj.$loading({
    lock: true,
    text: text,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    target: document.querySelector('.div1')
  })
  return loading
}

export function successDataMsg (obj, data) {
  if (data.success) {
    this.successMsg(obj, data.msg)
  } else {
    this.errorMsg(obj, data.msg)
  }
}
