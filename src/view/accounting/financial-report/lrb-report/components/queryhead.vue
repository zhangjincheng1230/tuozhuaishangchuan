<template>
  <div style="margin-right: 10px">期间:
    <span class="left-icon" @click="previous()"></span>
    <el-popover
      placement="bottom-start"
      title="利润表查询"
      width="390"
      popper-class="query-popover"
      v-model="queryVisible">
      <el-form ref="form" :model="formParam" label-width="auto">
        <el-form-item label="期间:">
          <el-date-picker
            v-model="formParam.qjq"
            value-format="yyyy-MM"
            type="month"
            :picker-options="monthPickerOptions"
            style="width:315px"></el-date-picker>
        </el-form-item>
        <el-form-item label="公司:">
          <el-select filterable v-model="formParam.corpobj" style="width:315px" value-key="pk_gs">
            <el-option v-for="item in corps"
                       :key="item.pk_gs"
                       :value="item"
                       :label="item.uname"
                       style="width:315px">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox
            label="包含未记账凭证"
            true-label="N"
            false-label="Y"
            v-model="formParam.ishasjz"
            style="width: 150px"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="formParam.bshowzero" true-label="Y" false-label="N">金额为0显示0</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="query-footer">
        <div class="kj-button-group">
          <el-button @click="queryVisible = false">取消</el-button>
          <el-button type="primary" @click="query">确定</el-button>
        </div>
      </div>
      <span class="query-period" slot="reference">
          {{queryqj}}
      </span>
    </el-popover>
    <span class="right-icon" @click="next()"></span>
  </div>
</template>

<script>
import {formatDate} from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'queryhead',
  mixins: [datePickerMixin],
  data () {
    return {
      formParam: {
        qjq: this.$store.getters.getLoginDate.substr(0, 7),
        corpobj: this.$store.getters.currentCorp,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        ishasjz: 'N',
        corpName: this.$store.getters.currentCorp.uname,
        bshowzero: 'N' // 金额为0 显示为0
      },
      queryqj: '',
      queryVisible: false,
      corps: this.$store.getters.corps
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      this.queryqj = this.formParam.qjq
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.formParam.corpName = this.formParam.corpobj.uname
      this.$emit('query', this.formParam)
      this.queryVisible = false

      // this.formParam.corpName = this.$refs.corpselect.selectedLabel
    },
    previous () {
      const period = this.$store.getters.getCorp(this.formParam.corpIds).bdate.substring(0, 7)
      if (period >= this.formParam.qjq) {
        this.$message({
          showClose: true,
          message: '查询日期不能在建账日期前',
          type: 'warning'
        })
        return
      }
      const date = new Date(this.formParam.qjq)
      date.setMonth(date.getMonth() - 1)
      this.formParam.qjq = formatDate(date, 'YYYY-MM')
      this.query()
    },
    next () {
      const date = new Date(this.formParam.qjq)
      date.setMonth(date.getMonth() + 1)
      this.formParam.qjq = formatDate(date, 'YYYY-MM')
      this.query()
    }
  }
}
</script>
<style lang="less">
  @import "../../styles/report.less";
</style>
<style scoped>

</style>
