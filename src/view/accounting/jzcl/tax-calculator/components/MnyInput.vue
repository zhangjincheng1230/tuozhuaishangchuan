<template>
  <input type="text"
         v-model="displayValue" :readonly="editable ? false : 'readonly'" @blur="isInputActive = false" @focus="onFocus"/>
</template>

<script>
export default {
  name: 'MnyInput',
  props: ['value', 'editable', 'precision', 'formatter'],
  data: function () {
    return {
      isInputActive: false
    }
  },
  computed: {
    displayValue: {
      get: function () {
        let precision = this.precision === undefined ? 2 : Number(this.precision)
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          let val = ''
          if (this.value !== undefined) {
            val = String(this.value)
            let reg = new RegExp('\\.\\d{' + (precision + 1) + ',}')
            if (val.match(reg)) {
              val = Number(val).toFixed(precision)
            }
          }
          return val
        } else {
          let val = ''
          if (this.value !== undefined && this.value !== '') {
            if (this.formatter && typeof this.formatter === 'function') {
              val = this.formatter(this.value)
            } else {
              let rpReg = new RegExp('(\\d)(?=(\\d{3})+(?:\\.\\d+)' + (precision === 0 ? '?' : '+') + '$)', 'g')
              val = Number(this.value).toFixed(precision).replace(rpReg, '$1,')
            }
          }
          return val
        }
      },
      set: function (modifiedValue) {
        if (modifiedValue !== '') {
          // Recalculate value after ignoring "$" and "," in user input
          modifiedValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''))
          // Ensure that it is not NaN
          if (isNaN(modifiedValue)) {
            modifiedValue = 0
          }
          // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
        }
        // $emit the event so that parent component gets it
        this.$emit('input', modifiedValue)
      }
    }
  },
  methods: {
    onFocus: function (e) {
      if (this.editable) {
        this.isInputActive = true
      } else {
        // e.target.blur();
      }
    }
  }
}
</script>

<style scoped>

</style>
