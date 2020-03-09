<template>
  <div style = "margin-right: 10px">期间:
    <span class="left-icon" @click="previous()"></span>
    <el-popover
      placement="bottom-start"
      title = "利润表季报查询"
      width = "430"
      popper-class = "query-popover"
      v-model="queryVisible">
      <el-form ref="form" :model="formParam" label-width="auto">
        <el-form-item label="期间:">
            <el-date-picker
              v-model="formParam.year"
              style="width: 150px;float:left"
              :clearable="false"
              value-format="yyyy"
              :picker-options="yearPickerOptions"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          <el-select
            v-model="formParam.jd"
            value-key="id"
            style="margin-left:15px;width: 150px;float:left">
            <el-option
              v-for="item in months"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司:" >
          <el-select filterable v-model="formParam.corpobj" style="width:315px" value-key="pk_gs">
            <el-option v-for="item in corpIds"
                       :key="item.pk_gs"
                       :value="item"
                       :label="item.uname"
                       style = "width:315px">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox
            label="包含未记账凭证"
            true-label ="N"
            false-label = "Y"
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
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'queryhead',
  mixins: [datePickerMixin],
  data () {
    return {
      queryVisible: false,
      formParam: {
        corpIds: this.$store.getters.currentCorp.pk_gs,
        corpobj: this.$store.getters.currentCorp,
        corpName: this.$store.getters.currentCorp.uname,
        ishasjz: 'N',
        year: this.$store.getters.getLoginDate.substr(0, 4),
        jd: this.selectQuarterValue(this.$store.getters.getLoginDate),
        begindate: '',
        bshowzero: 'N' // 金额为0 显示为0
      },
      queryqj: '2019--第一季度',
      corpIds: this.$store.getters.corps,
      years: [
        {
          id: '2019',
          name: '2019'
        },
        {
          id: '2018',
          name: '2018'
        }
      ],
      months: [
        {
          id: '03',
          name: '第一季度'
        },
        {
          id: '06',
          name: '第二季度'
        },
        {
          id: '09',
          name: '第三季度'
        },
        {
          id: '12',
          name: '第四季度'
        }
      ]
    }
  },
  created () {
    this.query()
  },
  watch: {
  },
  methods: {
    getYearBetweens () {

    },
    query () {
      this.formParam.begindate = this.formParam.year + '-' + this.formParam.jd + '-01'
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.formParam.corpName = this.formParam.corpobj.uname
      this.queryqj = this.formParam.year + '--' + this.filterJd(this.formParam.jd)[0].name
      this.$emit('query', this.formParam)
      this.queryVisible = false
    },
    filterJd (id) {
      return this.months.filter(item => {
        if (item.id === id) {
          return item
        }
      })
    },
    selectQuarterValue (str) {
      const s = str.substring(5, 7)
      if (s === '01' || s === '02' || s === '03') {
        return '03'
      } else if (s === '04' || s === '05' || s === '06') {
        return '06'
      } else if (s === '07' || s === '08' || s === '09') {
        return '09'
      } else {
        return '12'
      }
    },
    previous () {
      const period = this.$store.getters.getCorp(this.formParam.corpIds).bdate.substring(0, 7)
      let startYear = parseInt(this.formParam.year)
      let startMonth = parseInt(this.formParam.jd)

      startMonth = startMonth - 3

      if (startMonth <= 0) {
        startMonth = 12
        startYear = startYear - 1
      }
      let startMonthstr = startMonth < 10 ? '0' + startMonth : startMonth + ''

      if (period.substring(0, 7) >= (startYear + '-' + startMonthstr)) {
        this.$message({
          showClose: true,
          message: '查询日期不能在建账日期前',
          type: 'warning'
        })
        return
      }
      this.formParam.year = startYear + ''
      this.formParam.jd = startMonthstr
      this.query()
    },
    next () {
      let startYear = parseInt(this.formParam.year)
      let startMonth = parseInt(this.formParam.jd)

      startMonth = startMonth + 3

      if (startMonth > 12) {
        startMonth = 3
        startYear = startYear + 1
      }
      this.formParam.year = startYear + ''
      this.formParam.jd = startMonth < 10 ? '0' + startMonth : startMonth + ''
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
