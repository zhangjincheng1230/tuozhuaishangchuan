<template>
  <el-dialog
    :title="remindSet.length === 0 ? '提醒设置':'查看设置'"
    :visible.sync="dialogVisible"
    show-close
    @close="closeDialog"
    width="30%"
    left>
    <span>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            送票&nbsp;&nbsp;开始日期：每月
            <el-select v-model="remrow[0].bday" style="width: 30%" placeholder="请选择">
              <el-option
                v-for="item in dayBeginRange"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            日
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            截止日期：每月
            <el-select v-model="remrow[0].eday" style="width: 30%" placeholder="请选择">
              <el-option
                v-for="item in dayEndRange"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            日
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            抄税&nbsp;&nbsp;开始日期：每月
            <el-select v-model="remrow[1].bday" style="width: 30%" placeholder="请选择">
              <el-option
                v-for="item in dayBeginRange"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            日
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            截止日期：每月
            <el-select v-model="remrow[1].eday" style="width: 30%" placeholder="请选择">
              <el-option
                v-for="item in dayEndRange"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            日
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            清卡&nbsp;&nbsp;开始日期：每月
            <el-select v-model="remrow[2].bday" style="width: 30%" placeholder="请选择">
              <el-option
                v-for="item in dayBeginRange"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            日
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            截止日期：每月
            <el-select v-model="remrow[2].eday" style="width: 30%" placeholder="请选择">
              <el-option
                v-for="item in dayEndRange"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            日
          </div>
        </el-col>
      </el-row>
    </span>
    <div slot="footer" style="text-align: center" class="dialog-footer" v-if="remindSet.length === 0">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="save()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'remind-set',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    remindSet: {
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
    remrow () {
      return this.remindSet.length === 0 ? [
        {retype: '38', bday: 25, eday: 5},
        {retype: '39', bday: 1, eday: 5},
        {retype: '40', bday: 1, eday: 15}
      ] : this.remindSet
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    dayBeginRange () {
      return Array.from({ length: 30 }, (_, index) => index + 1)
    },
    dayEndRange () {
      return Array.from({ length: 31 }, (_, index) => index + 1)
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    save () {
      this.$emit('save', this.remrow)
    },
    closeDialog () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
