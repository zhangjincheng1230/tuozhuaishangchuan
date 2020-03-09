/* eslint-disable no-param-reassign */
export default {
  // 之所以用 inserted 而不是 bind，是需要确保 contentmenu mounted 后才进行 addRef 操作
  inserted (el, binding, vnode) {
    el.onmousedown = function (event) {
      if (!event.ctrlKey && event.button !== 0) {
        const contextmenu = typeof binding.value.ref === 'object' ? binding.value.ref : vnode.context.$refs[binding.value.ref]
        contextmenu.addRef({el, vnode}, binding.value)
        contextmenu.$contextmenuId = el.id || contextmenu._uid // eslint-disable-line no-underscore-dangle
      }
    }
  }
}
