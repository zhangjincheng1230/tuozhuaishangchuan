<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>截止日期：
            <el-popover
              placement="bottom-start"
              title="往来账龄余额表查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.enddate"
                    type="date"
                    range-separator="选择日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="核算科目：">
                  <el-select
                    @change="changeKm"
                    v-model="queryForm.kmbm"
                    filterable
                    clearable>
                    <el-option
                      v-for="item in subjectRef"
                      :key="item.id"
                      :value="item.kmbm"
                      :label="item.codename">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="辅助类别：">
                  <el-select
                    v-model="queryForm.fzlb"
                    value-key="id"
                    style="width: 315px">
                    <el-option label="不限" value="-1"></el-option>
                    <el-option
                      v-for="item in auxiliaryTypes"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="辅助项目：">
                  <el-select
                    v-model="queryForm.fzxm"
                    style="width: 315px">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      v-for="item in fzxmByH"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="账龄期间：">
                  <el-select
                    v-model="queryForm.pk_age"
                    style="width: 315px">
                    <el-option
                      v-for="item in accountAge"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select
                    v-model="queryForm.corpIds"
                    style="width: 315px">
                    <el-option v-for="item in corps"
                               :key="item.pk_gs"
                               :value="item.pk_gs"
                               :label="item.uname"
                               style="width:315px">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                             {{queryForm.enddate}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
          <span style="display:inline-block;margin-left: 20px">公司:{{corpName}}</span>
          <span style="display:inline-block;margin-left: 20px" v-show="singlekmname!=null && singlekmname.length>0">名称:{{singlekmname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="excelexport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
          <el-table
            :data="tableData"
            highlight-current-row
            stripe
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              property="kmbm"
              label="科目编码"
              key="kmbm"
              header-align="center"
              align="left"
              width="320"
            ></el-table-column>
            <el-table-column
              property="kmmc"
              key="kmmc"
              label="科目名称"
              align="left"
              header-align="center"
              width="200"
            ></el-table-column>
            <template v-for="column in fzlbColumns">
              <el-table-column
                :property="column.code"
                :label="column.name"
                :key="column.code"
                header-align="center"
                align="left"
                width="180"
              ></el-table-column>
            </template>
            <el-table-column
              property="days"
              key="days"
              label="天数"
              header-align="center"
              align="center"
              width="180"
            ></el-table-column>

            <el-table-column
              label="凭证号"
              key="vchnum"
              header-align="center"
              align="center"
              width="180"
            >
              <template slot-scope="scope" >
                <span v-if="(scope.row.pk_voucher && scope.row.vchnum !== '未核销期初')">
                  记<el-link  type="primary"  @click.stop.prevent="linkPzByid(scope.row.pk_voucher)">{{scope.row.vchnum}}</el-link>
                </span>
                <span v-else>
                  {{scope.row.vchnum}}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              label="核销金额"
              key="verify_mny"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="180"
            >
              <template slot-scope="scope" >
                <span v-if="(scope.row.pk_verify_voucher)">
                  <el-link  type="primary"  @click.stop.prevent="linkPzByid(scope.row.pk_verify_voucher)">{{scope.row.verify_mny}}</el-link>
                </span>
                <span v-else>
                  {{scope.row.verify_mny}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              property="total"
              key="total"
              label="未核销金额"
              :formatter="formatMny"
              header-align="center"
              align="right"
              width="180"
            ></el-table-column>
            <template v-for="column in periodColumns">
              <el-table-column
                :property="column.code"
                :key="column.code"
                :label="column.name"
                :formatter="formatMny"
                header-align="center"
                align="right"
                width="180"
              ></el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>
</template>

<script>
import { ACCOUNT_AGE } from '@/constants'
import subjectRefMixin from '@/mixins/report-wlhx-subject'
import auxiliaryTypeMixin from '@/mixins/report-auxiliary-type'
import fzxmMixin from '@/mixins/report-fzxm'
import {formatDate} from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'wlzlye-report',
  mixins: [subjectRefMixin, auxiliaryTypeMixin, fzxmMixin, datePickerMixin],
  data () {
    return {
      singlekmname: '',
      queryVisible: false,
      showFullParam: false,
      loading: false,
      corps: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      queryForm: {
        enddate: this.$store.getters.getLoginDate,
        kmbm: '',
        fzlb: '-1',
        fzxm: '',
        pk_age: '00000100000000ZZnTcA002I',
        corpIds: this.$store.getters.currentCorp.pk_gs
      },
      queryParam: {
        enddate: '',
        kmbm: '',
        fzlb: '',
        fzxm: '',
        zllx: '',
        corp: '',
        pk_corp: '',
        fzhsName: '',
        unit: '',
        pk_age: ''
      },
      tableData: [],
      periods: [],
      period_names: [],
      fzxmByH: [],
      accountAge: ACCOUNT_AGE
    }
  },
  created () {
    this.init()
  },
  watch: {
    'queryForm.corpIds': function (val, oldval) {
      this.queryAuxiliaryType()
      this.querySubjectRef()
      this.queryFzxm()
    },
    'subjectRef': function (val, oldval) {
      this.queryForm.kmbm = val !== null && val.length > 0 ? val[0].kmbm : ''
      this.query()
    },
    'queryForm.fzlb': function (val, oldval) {
      this.fzxmByH = this.fzxmList.filter(v => v.pid === val)
    }
  },
  computed: {
    periodColumns () {
      let columns = []
      if (typeof this.periods === 'undefined') {
        return []
      }
      for (let i = 0; i < this.periods.length; i++) {
        columns.push({name: this.period_names[i], code: this.periods[i], isdecimal: true, digit: 2, zeroshownull: true, colwidth: 15, ispercent: false})
      }
      return columns
    },
    fzlbColumns () {
      let columns = []
      if (this.queryParam.fzlb === -1) {
        for (let allAuxiliary of this.auxiliaryTypes) {
          let index = this.allAuxiliaryTypes.findIndex(v => v.id === allAuxiliary.id)
          columns.push({name: allAuxiliary.name, code: 'fzhsx' + (index + 1), isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false})
        }
      } else {
        let allAuxiliary = this.allAuxiliaryTypes[parseInt(this.queryParam.fzlb) - 1]
        columns.push({name: allAuxiliary.name, code: 'fzhsx' + this.queryParam.fzlb, isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false})
      }
      return columns
    },
    auxiliaryTypes () {
      if (typeof this.selectedSubject === 'undefined' || !this.selectedSubject.hasOwnProperty('isfzhs')) {
        return []
      }
      let auxiliaryTypeIndex = this.searchFzhsType(this.selectedSubject.isfzhs)
      return this.allAuxiliaryTypes.filter((value, index) => auxiliaryTypeIndex.indexOf(index) !== -1)
    },
    selectedSubject () {
      return this.subjectRef.find(v => v.kmbm === this.queryForm.kmbm)
    }
  },
  methods: {
    linkPzByid (id_voucher) {
      if (!this.$hasPermission('voucher-edit')) {
        return
      }
      if (!id_voucher) {
        this.$message({showClose: true, message: '无凭证！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: id_voucher
        }
      })
    },
    init () {
      if (this.subjectRef instanceof Array && this.subjectRef.length > 0) {
        this.queryForm.kmbm = this.subjectRef[0].kmbm
      }
    },
    query () {
      this.$api.wlzlmxReport.query(this.getQueryPram()).then(result => {
        if (result.success === true) {
          this.queryVisible = false
          this.loading = false
          this.tableData = []
          for (const row of result.rows.result) {
            let periodsmny = row.periodsmny
            this.tableData.push(Object.assign(row, periodsmny))
          }
          this.periods = result.rows.periods
          this.period_names = result.rows.period_names
        } else {
          this.loading = false
          this.$message.error(result.msg)
        }
      })
    },
    getQueryPram () { // 获取查询条件
      this.queryParam.enddate = this.queryForm.enddate
      this.queryParam.kmbm = this.queryForm.kmbm
      let fzlb = this.allAuxiliaryTypes.findIndex(v => v.id === this.queryForm.fzlb)
      this.queryParam.fzlb = fzlb === -1 ? -1 : (fzlb + 1)
      this.queryParam.fzxm = this.queryForm.fzxm
      let accoutAge = this.queryAccountAgeByPk(this.queryForm.pk_age)
      this.queryParam.zllx = accoutAge.type
      this.queryParam.corp = this.queryForm.corpIds
      this.queryParam.unit = accoutAge.days
      this.queryParam.pk_age = this.queryForm.pk_age
      return this.queryParam
    },
    excelexport () {
      this.$api.wlzlmxReport.exportExcel('往来账龄明细' + formatDate(new Date()), this.getExportParam())
    },
    getExportParam () {
      const exportParam = {
        data: JSON.stringify(this.tableData),
        corpName: this.corpName,
        qj: this.queryParam.enddate.substr(0, 7) + '-01—' + this.queryParam.enddate,
        fields: JSON.stringify(this.exportFields())
      }
      return exportParam
    },
    exportFields () {
      let fields = [{name: '科目编码', code: 'kmbm', isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false}, {name: '科目名称', code: 'kmmc', isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false}]
      let fields1 = [{name: '日期', code: 'vchdate', isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false}, {name: '天数', code: 'days', isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false}, {name: '凭证号', code: 'vchnum', isdecimal: false, digit: 0, zeroshownull: true, colwidth: 15, ispercent: false}, {name: '核销金额', code: 'verify_mny', isdecimal: true, digit: 2, zeroshownull: true, colwidth: 15, ispercent: false}, {name: '未核销金额', code: 'total', isdecimal: true, digit: 2, zeroshownull: true, colwidth: 15, ispercent: false}]
      return [...fields, ...this.fzlbColumns, ...fields1, ...this.periodColumns]
    },
    checkNull (val) {
      return typeof this.val === 'undefined' || val === null
    },
    formatMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    queryAccountAgeByPk (pk) {
      return this.accountAge.find(v => v.id === pk)
    },
    selectGet (vId) { // 下拉框选中事件 ,这个vId也就是value值
      let obj = {}
      obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.pk_gs === vId// 筛选出匹配数据
      })
      return obj.uname
    },
    searchFzhsType (fzhs) {
      let fzhsType = []
      for (let index = 0, length = fzhs.length; index < length; index++) {
        if (fzhs.charAt(index) === '1') {
          fzhsType.push(index)
        }
      }
      return fzhsType
    },
    changeKm (val) {
      if (this.showFzSearxh && this.auxiliaryTypes instanceof Array && this.auxiliaryTypes.length > 0) {
        const defaultAuxiliaryType = this.auxiliaryTypes[0]
        this.queryForm.fzlb = defaultAuxiliaryType.id
      } else {
        this.queryForm.fzlb = ''
        this.queryForm.fzxm = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
