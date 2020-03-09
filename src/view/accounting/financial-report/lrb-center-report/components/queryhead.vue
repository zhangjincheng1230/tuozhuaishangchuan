<template>
  <div style = "margin-right: 10px">期间:
    <span class="left-icon" @click="previous()"></span>
    <el-popover
      placement="bottom-start"
      title = "分部利润表查询"
      width = "430"
      popper-class = "query-popover"
      v-model="queryVisible">
      <el-form ref="form" :model="formParam" label-width="auto">
        <el-form-item label="期间:">
          <el-date-picker
            v-model="formParam.qjq"
            value-format="yyyy-MM"
            :picker-options="monthPickerOptions"
            type="month"
            style="width:315px"></el-date-picker>
        </el-form-item>
        <el-form-item label="辅助类别：">
          <el-select
            v-model="formParam.fzlbobj"
            value-key="id"
            style="width: 315px">
            <el-option
              v-for="item in fzlbarray"
              :key="item.id"
              :value="item"
              :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="辅助项目：">
          <el-select filterable
            v-model="formParam.fzxmobj" value-key = "id"
            style="width: 315px">
            <el-option
              v-for="item in filterFzxmArray"
              :key="item.id"
              :value="item"
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
import {formatDate} from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'queryhead',
  mixins: [datePickerMixin],
  data () {
    return {
      queryVisible: false,
      formParam: {
        qjq: this.$store.getters.getLoginDate.substr(0, 7),
        corpobj: this.$store.getters.currentCorp,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        ishasjz: 'N',
        corpName: this.$store.getters.currentCorp.uname,
        fzlbobj: { },
        fzxmobj: { },
        xmlbid: '',
        xmmcid: '',
        bshowzero: 'N' // 金额为0 显示为0
      },
      queryqj: '',
      corpIds: this.$store.getters.corps,
      fzlbarray: [],
      fzxmarray: [],
      filterFzxmArray: [] // 过滤的辅助项目
    }
  },
  created () {
    this.queryFzLb(true)
    // this.query()
  },
  watch: {
    'formParam.fzlbobj': function (val, oldval) {
      this.getFilterFzxm(val, false)
    },
    'formParam.corpobj': function (val, oldval) {
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.queryFzLb(false)
    }
  },
  computed: {
  },
  methods: {
    query () {
      this.queryqj = this.formParam.qjq
      this.periodRange = [this.formParam.qjq, this.formParam.qjq]
      this.formParam.xmlbid = this.formParam.fzlbobj.id
      this.formParam.xmmcid = this.formParam.fzxmobj.id
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.formParam.corpName = this.formParam.corpobj.uname
      this.formParam.begindate = this.formParam.qjq + '-01'
      this.$emit('query', this.formParam)
      this.queryVisible = false
    },
    queryFzLb (bquery) {
      this.fzlbarray = []
      this.formParam.fzlbobj = {}
      if (this.formParam.corpIds === this.$store.getters.currentCorp.pk_gs) {
        this.getFilterFzlb(this.$store.state.accounting.auxiliaryTypes)
        this.queryFzxm(bquery)
      } else {
        this.$api.LrbCenterReport.getFzLb(this.formParam.corpIds).then(
          result => {
            if (result.success) {
              this.getFilterFzlb(result.rows)
              this.queryFzxm(bquery)
            }
          }
        ).catch(e => {
        })
      }
    },
    queryFzxm (bquery) {
      this.fzxmarray = []
      this.formParam.fzxmobj = {}
      this.$api.LrbCenterReport.getFzxm(this.formParam.corpIds).then(
        result => {
          if (result.success) {
            for (const temp of result.rows) {
              this.fzxmarray[this.fzxmarray.length] = {
                id: temp.id,
                code: temp.code,
                pid: temp.pid,
                name: temp.name
              }
            }
            this.getFilterFzxm(this.formParam.fzlbobj, bquery)
          }
        }
      ).catch(e => {
      })
    },
    getFilterFzxm (val, bquery) {
      this.filterFzxmArray = []
      this.formParam.fzxmobj = {}
      let filterarray = []
      if (this.fzxmarray && this.fzxmarray.length > 0) {
        for (const tt of this.fzxmarray) {
          if (tt.pid === val.id) {
            filterarray[filterarray.length] = tt
          }
        }
      }
      this.filterFzxmArray = filterarray
      if (this.filterFzxmArray && this.filterFzxmArray.length > 0) {
        this.formParam.fzxmobj = this.filterFzxmArray[0]
      }
      if (bquery) {
        this.query()
      }
    },
    getFilterFzlb (rows) {
      if (rows && rows.length > 0) {
        for (const temp of rows) {
          if (temp.name === '项目' || temp.name === '部门') {
            this.fzlbarray[this.fzlbarray.length] = {
              id: temp.id,
              code: temp.code,
              name: temp.name
            }
          }
        }
        if (this.fzlbarray && this.fzlbarray.length > 0) {
          this.formParam.fzlbobj = this.fzlbarray[0]
        }
      }
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
