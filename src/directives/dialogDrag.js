import Vue from 'vue'

/*

*  使用方法

*  将以下代码复制到一个js文件中，然后在入口文件main.js中import引入即可；

*  给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了。

*  给dialog设置 :close-on-click-modal="false" , 禁止点击遮罩层关闭弹出层

*  如果是form表单，不要将提交等按钮放置el-form-item，以免在上下拉伸时被隐藏

*/

// v-dialogDrag: 弹窗拖拽+水平方向伸缩
Vue.directive('dialogDrag', {
  bind (el, binding, vnode, oldVnode) {
    // let minWidth = 400
    // let minHeight = 300
    // let isFullScreen = false
    // let nowWidth = 0
    // let nowHight = 0
    // let nowMarginTop = 0
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dragDom.style.overflow = 'auto'
    dialogHeaderEl.style.cursor = 'move'
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    let moveDown = (e) => {
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      let styL, styT
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/px/g, '')
        styT = +sty.top.replace(/px/g, '')
      }
      document.onmousemove = function (e) {
        const l = e.clientX - disX
        const t = e.clientY - disY
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    dialogHeaderEl.onmousedown = moveDown
    // dialogHeaderEl.ondblclick = (e) => {
    //   if (isFullScreen === false) {
    //     nowHight = dragDom.clientHeight
    //     nowWidth = dragDom.clientWidth
    //     nowMarginTop = dragDom.style.marginTop
    //     dragDom.style.left = 0
    //     dragDom.style.top = 0
    //     dragDom.style.height = '100VH'
    //     dragDom.style.width = '100VW'
    //     dragDom.style.marginTop = 0
    //     isFullScreen = true
    //     dialogHeaderEl.style.cursor = 'initial'
    //     dialogHeaderEl.onmousedown = null
    //   } else {
    //     dragDom.style.height = 'auto'
    //     dragDom.style.width = nowWidth + 'px'
    //     dragDom.style.marginTop = nowMarginTop
    //     isFullScreen = false
    //     dialogHeaderEl.style.cursor = 'move'
    //     dialogHeaderEl.onmousedown = moveDown
    //   }
    // }
    // dragDom.onmousemove = function (e) {
    //   // let moveE = e
    //   if (e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 || dragDom.offsetLeft + 10 > e.clientX) {
    //     dragDom.style.cursor = 'w-resize'
    //   } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
    //     dragDom.style.cursor = 's-resize'
    //   } else {
    //     dragDom.style.cursor = 'default'
    //     dragDom.onmousedown = null
    //   }
    //   dragDom.onmousedown = (e) => {
    //     const clientX = e.clientX
    //     const clientY = e.clientY
    //     let elW = dragDom.clientWidth
    //     let elH = dragDom.clientHeight
    //     let EloffsetLeft = dragDom.offsetLeft
    //     let EloffsetTop = dragDom.offsetTop
    //     dragDom.style.userSelect = 'none'
    //     let ELscrollTop = el.scrollTop
    //     if (clientX > EloffsetLeft && clientX < EloffsetLeft + elW && clientY > EloffsetTop && clientY < EloffsetTop + 100) {
    //     } else {
    //       document.onmousemove = function (e) {
    //         e.preventDefault()
    //         if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
    //           if (clientX > e.clientX) {
    //             dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px'
    //           }
    //           if (clientX < e.clientX) {
    //             if (dragDom.clientWidth < minWidth) {
    //             } else {
    //               dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px'
    //             }
    //           }
    //         }
    //         if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
    //           if (clientX > e.clientX) {
    //             if (dragDom.clientWidth < minWidth) {
    //             } else {
    //               dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px'
    //             }
    //           }
    //           if (clientX < e.clientX) {
    //             dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px'
    //           }
    //         }
    //         if (ELscrollTop + clientY > EloffsetTop + elH - 20 && ELscrollTop + clientY < EloffsetTop + elH) {
    //           if (clientY > e.clientY) {
    //             if (dragDom.clientHeight < minHeight) {
    //             } else {
    //               dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px'
    //             }
    //           }
    //           if (clientY < e.clientY) {
    //             dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px'
    //           }
    //         }
    //       }
    //       document.onmouseup = function (e) {
    //         document.onmousemove = null
    //         document.onmouseup = null
    //       }
    //     }
    //   }
    // }
  }
})
