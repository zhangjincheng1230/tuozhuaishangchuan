<template>
    <div @click="editCell" class="voucher-cell">
      <span v-show="!isEdit" class="voucher-cell-view">
        <slot name="view">
          {{ formattedValue }}
        </slot>
      </span>
      <slot v-if="isEdit" name="editor"></slot>
      <slot name="suffix"></slot>
    </div>
</template>

<script>
export default {
  name: 'EditCell',
  props: {
    value: {
      type: [ String, Number ]
    },
    row: {
      type: Object
    },
    formatter: {
      type: Function
    },
    onEndEdit: {
      type: Function
    },
    editable: {
      type: Boolean,
      default: true
    },
    autoFocus: {
      type: Boolean,
      default: true
    },
    inputSelector: {
      type: String,
      default: null
    },
    editingCell: {
      type: Object,
      default: null
    },
    beforeEndEdit: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      isEdit: false
    }
  },
  computed: {
    formattedValue () {
      let formatted = this.value
      if (this.formatter) {
        formatted = this.formatter(this.value, this.row)
      }
      return formatted
    }
  },
  watch: {
    isEdit (val) {
      if (val) {
        this.$emit('begin-edit')
        this.$bus.emit('edit-voucher-cell', this)
        document.addEventListener('click', this.handleDocumentClick)
      } else {
        this.$emit('end-edit')
        this.$bus.emit('end-edit-voucher-cell', this)
        document.removeEventListener('click', this.handleDocumentClick)
      }
    }
  },
  methods: {
    editCell () {
      setTimeout(() => {
        if (this.isEdit || !this.editable || this.editingCell) {
          return
        }
        this.isEdit = true
        if (this.autoFocus) {
          this.$nextTick(() => {
            let input = this.$el.querySelector(this.inputSelector ? this.inputSelector : 'textarea,input')
            input.focus()
            input.select()
          })
        }
      }, 0)
    },
    focus () {
      let input = this.$el.querySelector(this.inputSelector ? this.inputSelector : 'textarea,input')
      input.focus()
    },
    endEditCell (target) {
      if (this.beforeEndEdit) {
        let rs = this.beforeEndEdit(target)
        if (rs !== false) {
          this.isEdit = false
        }
      } else {
        this.isEdit = false
      }
    },
    handleDocumentClick (e) {
      if (this.isEdit === true && this.$el.contains(e.target) === false) {
        this.endEditCell(e.target)
      }
    }
  },
  beforeDestroy () {
    if (this.isEdit) {
      this.$bus.emit('end-edit-voucher-cell', this)
      document.removeEventListener('click', this.handleDocumentClick)
    }
  }
}
</script>

<style scoped>
  .voucher-cell {
    height: 100%;
    word-break: break-all;
    display: flex;
    align-items: center;
    max-height: 60px;
    overflow: hidden;
    position: relative;
  }
  .voucher-cell-view {
    width: 100%;
    padding: 0px 5px;
    max-height: 60px;
    overflow: auto;
  }
  .voucher-cell >>> .el-input {
    height: 100%;
  }
  .voucher-cell >>> .el-input-number, .voucher-cell >>> .el-select,
  .voucher-cell >>> .el-autocomplete {
    width: 100%;
    height: 100%;
  }
  .voucher-cell >>> .el-input__inner {
    height: 100%;
    border-radius: 0px;
  }
  .voucher-cell >>> .el-textarea__inner {
    height: 100%;
    resize: none;
    border-radius: 0px;
  }
</style>
