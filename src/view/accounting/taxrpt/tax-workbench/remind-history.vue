<template>
  <el-dialog
    title="提醒历史"
    :visible.sync="dialogVisible"
    width="30%"

    @close="closeDialog"
    left>
    <div style="height: 350px; text-align: center" v-if="historyData !== null && historyData.length > 0">
        <template v-for="v in historyData">
          {{v.msgtypename}}&nbsp;&nbsp;{{v.user_name}}&nbsp;&nbsp;{{v.vdate}} <br/>
        </template>
    </div>
    <div style="height: 350px; text-align: center; line-height: 350px" v-else>
      暂无数据
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'remind-history',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    historyData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {

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
    closeDialog () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
