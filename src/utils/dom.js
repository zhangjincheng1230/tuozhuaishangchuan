import store from '@/store'
import _ from '@/utils/lodash'

export function isVisible (element) {
  return element.offsetWidth > 0 || element.offsetHeight > 0
}

function inputEnterLikeTab (e) {
  if (e.keyCode === 13) {
    let selfElement = e.target
    if (selfElement.nodeName !== 'INPUT') {
      return
    }
    if (selfElement.classList.contains('el-input__inner')) {
      // el-select
      let selectWrapper = selfElement.closest('.el-select')
      if (selectWrapper) {
        let inputWrapper = selfElement.parentNode
        if (inputWrapper.classList.contains('is-focus')) {
          return
        }
      }
    }
    let parentForm = selfElement.closest('form')
    if (parentForm) {
      let allInput = [...parentForm.querySelectorAll('input')]
        .filter(input => isVisible(input) && !input.disabled)
      for (let i = 0; i < allInput.length; i++) {
        if (selfElement === allInput[i]) {
          let nextIndex = i + 1
          if (nextIndex < allInput.length) {
            allInput[nextIndex].focus()
          }
          break
        }
      }
    }
    return false
  }
}

const onWindowResize = _.debounce(function () {
  store.dispatch('updateDialogHeight')
}, 100)

export function registerGlobalEventListener () {
  window.addEventListener('resize', onWindowResize)
  document.addEventListener('keydown', inputEnterLikeTab)
}
