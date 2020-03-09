/***
 * data中的scrollParentSelector指定选择器, 默认是el-table的body
 * 选择器不能实现的重写getScrollParentElement方法
 */
export default {
  data () {
    return {
      scrollParentSelector: '.kj-main .el-table > .el-table__body-wrapper',
      savedScrollPosition: null
    }
  },
  methods: {
    getScrollParentElement () {
      if (this.scrollParentSelector) {
        return this.$el.querySelector(this.scrollParentSelector)
      }
      return null
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.savedScrollPosition !== null) {
        let scrollParent = vm.getScrollParentElement()
        if (scrollParent) {
          if (scrollParent.className.indexOf('el-table') > -1) {
            setTimeout(() => {
              scrollParent.scrollTop = vm.savedScrollPosition
            }, 0)
          } else {
            scrollParent.scrollTop = vm.savedScrollPosition
          }
        }
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    let scrollParent = this.getScrollParentElement()
    if (scrollParent) {
      this.savedScrollPosition = scrollParent.scrollTop
    }
    next()
  }
}
