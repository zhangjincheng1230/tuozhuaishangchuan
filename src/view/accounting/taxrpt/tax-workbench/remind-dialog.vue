<template>
  <el-dialog
    title="提醒"
    :visible.sync="dialogVisible"
    width="20%"
    left>
    <span>
      提醒:&nbsp;&nbsp;
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </span>
    <div slot="footer" style="text-align: center" class="dialog-footer">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'remind-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [{
        value: '38',
        label: '送票'
      }, {
        value: '39',
        label: '抄税'
      }, {
        value: '40',
        label: '清卡'
      }, {
        value: '41',
        label: '凭证交接'
      }, {
        value: '51',
        label: '应缴'
      }, {
        value: '52',
        label: '实缴'
      }],
      value: '38'
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.value)
    }
  }
}
</script>

<style scoped>

</style>
