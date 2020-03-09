<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
              placement="bottom-start"
              title="多栏账查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.periodRange"
                    type="monthrange"
                    unlink-panels
                    range-separator="-"
                    :picker-options="monthPickerOptions"
                    value-format="yyyy-MM"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="科目：">
                  <el-select
                    @change="changeKm"
                    v-model="queryForm.km"
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
                <el-form-item v-show="showFzSearxh" label="辅助类别：">
                  <el-select
                    v-model="queryForm.fzlbobj"
                    value-key="id"
                    style="width: 315px">
                    <el-option
                      v-for="item in auxiliaryTypes"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="showFzSearxh" label="辅助项目：">
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
                <el-collapse-transition>
                  <div v-show="showFullParam" style="max-height: 210px">
                    <el-form-item label="币种：">
                      <el-select
                        v-model="queryForm.pk_currency"
                        style="width: 315px">
                        <el-option
                          v-for="item in subjectCurrency"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <el-radio v-model="queryForm.xsmx" label="1">只显示下级科目</el-radio>
                      <el-radio v-model="queryForm.xsmx" label="2">只显示最明细科目</el-radio>
                    </el-form-item>
                    <el-form-item label="公司：">
                      <el-select
                        v-model="queryForm.corpIds"
                        @change="changeCorp"
                        style="width: 315px">
                        <el-option v-for="item in corps"
                                   :key="item.pk_gs"
                                   :value="item.pk_gs"
                                   :label="item.uname"
                                   style="width:315px">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-collapse-transition>
              </el-form>
              <div class="query-footer">
                <div class="condition-control">
                  <el-link v-if="showFullParam" type="primary" :underline="false" @click="showFullParam=false">
                    收起更多<i class="el-icon-arrow-up el-icon--right"></i>
                  </el-link>
                  <el-link v-else type="primary" :underline="false" @click="showFullParam=true">
                    更多条件<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-link>
                </div>
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                             {{qj}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
          <span style="display:inline-block;margin-left: 20px" class="query-corp" :title="corpName">公司:{{corpName}}</span>
          <span style="display:inline-block;margin-left: 20px" v-show="singlekmname!=null && singlekmname !== ''">科目:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{singlekmname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
          <el-button @click="excelexport">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            highlight-current-row
            stripe
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              property="rq"
              rowspan="2"
              label="日期"
              header-align="center"
              align="left"
              width="100"
            ></el-table-column>
            <el-table-column
              property="pzh"
              rowspan="2"
              label="凭证号"
              header-align="center"
              align="left"
              width="100"
            >
              <template slot-scope="scope" v-if="scope.row.pzh != null && scope.row.pzh !== ''">
                记<el-link  type="primary"  @click.stop.prevent="linkPzByid(scope.row.pk_tzpz_h)">{{scope.row.pzh}}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              property="zy"
              rowspan="2"
              label="摘要"
              header-align="center"
              align="left"
              width="100"
            ></el-table-column>
            <el-table-column
              property="jf"
              rowspan="2"
              label="借方"
              header-align="center"
              align="right"
              width="150"
            ></el-table-column>
            <el-table-column
              property="df"
              rowspan="2"
              label="贷方"
              header-align="center"
              align="right"
              width="150"
            ></el-table-column>
            <el-table-column
              property="fx"
              rowspan="2"
              label="方向"
              header-align="center"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              property="ye"
              rowspan="2"
              label="余额"
              header-align="center"
              align="right"
              width="150"
            ></el-table-column>
            <template v-for="column in columns1">
              <template v-if="column.title !== '余额'">
                <el-table-column
                  :property="column.field"
                  :label="column.title"
                  rowspan="2"
                  header-align="center"
                  :align="column.align"
                  :width="column.width"
                >
                  <template v-for="column2 in columns2">
                    <el-table-column
                      :property="column2.field"
                      :label="column2.title"
                      header-align="center"
                      :align="column2.align"
                      :width="column2.width"
                    >
                    </el-table-column>
                  </template>
                </el-table-column>
              </template>
            </template>

            <el-table-column label></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <!-- 打印对话框 -->
    <print-dialog ref="printdialog" :enddate="enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import {CURRENCY_ZHBWB} from '@/constants'
import {getMonthEnd} from '@/utils'
import PrintDialog from '@/components/Report/PrintDialog'
import subjectRefMixin from '@/mixins/report-subject-ref'
import auxiliaryTypeMixin from '@/mixins/report-auxiliary-type'
import fzxmMixin from '@/mixins/report-fzxm'
import currencyMixin from '@/mixins/report-currency'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'dlz-report',
  components: {
    PrintDialog, BackToTop
  },
  mixins: [subjectRefMixin, auxiliaryTypeMixin, fzxmMixin, currencyMixin, datePickerMixin],
  data () {
    return {
      columns2: [],
      columns1: [],
      queryVisible: false,
      showFullParam: false,
      queryForm: {
        periodRange: [this.$store.getters.getLoginDate.substring(0, 7), this.$store.getters.getLoginDate.substring(0, 7)],
        km: '',
        corpIds: this.$store.getters.currentCorp.pk_gs,
        fzlbobj: '',
        fzxm: '',
        pk_currency: '',
        xsmx: '1'
      },
      loading: false,
      corps: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      queryParam: {
        begindate: '',
        enddate: '',
        kms_first: '',
        kms_last: '',
        corpIds1: '',
        pk_currency: '',
        isxsxj: '',
        isxsmx: '',
        fzlb: '',
        fzxm: ''
      },
      tableData: []
    }
  },
  watch: {
    'queryForm.corpIds': function (val, oldval) {
      this.queryForm.km = ''
      this.queryForm.pk_currency = CURRENCY_ZHBWB
      this.queryAuxiliaryType()
      this.querySubjectRef()
    }
  },
  computed: {
    nodename () {
      return '多栏账'
    },
    singlekmname () {
      console.log(this.queryParam)
      return this.$_.isEmpty(this.queryParam.kms_first) ? null : this.subjectRef.find(v => v.kmbm === this.queryParam.kms_first).kmmc
    },
    qj () {
      return this.queryForm.periodRange[0] + '-' + this.queryForm.periodRange[1]
    },
    columns () {
      return [
        {width: '100', title: '日期', field: 'rq', align: 'left'},
        {width: '100', title: '凭证号', field: 'pzh', align: 'left'},
        {width: '150', title: '摘要', field: 'zy', align: 'left'},
        {width: '150', title: '借方', field: 'jf', align: 'right'},
        {width: '150', title: '贷方', field: 'df', align: 'right'},
        {width: '150', title: '方向', field: 'fx', align: 'left'}
      ]
    },
    enddate () {
      return getMonthEnd(this.queryParam.enddate)
    },
    fzxmByH () {
      if (this.showFzSearxh) {
        return this.fzxmList.filter(v => v.pid === this.queryForm.fzlbobj)
      }
    },
    auxiliaryTypes () {
      if (this.showFzSearxh) {
        let auxiliaryTypeIndex = this.searchFzhsType(this.selectedSubject.isfzhs)
        return this.allAuxiliaryTypes.filter((value, index) => auxiliaryTypeIndex.indexOf(index) !== -1)
      }
    },
    showFzSearxh () {
      const subjectRef = this.selectedSubject
      return typeof subjectRef === 'object' && subjectRef.hasOwnProperty('yz') && subjectRef.yz === '是'
    },
    selectedSubject () {
      return this.subjectRef.find(v => v.kmbm === this.queryForm.km)
    }
  },
  methods: {
    // 联查凭证
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
    query () {
      this.loading = true
      this.$api.dlzReport.query(this.getQueryPram()).then(result => {
        this.queryVisible = false
        if (result.success === true) {
          this.loading = false
          this.tableData = result.rows
          this.columns1 = result.columns
          this.columns2 = result.columnlist2
        } else {
          this.loading = false
          this.tableData = []
          this.columns1 = []
          this.columns2 = []
          this.$message({
            message: result.msg,
            type: 'warning'
          })
        }
      })
    },
    changeCorp (val) {
      this.queryFzxm()
      this.queryAuxiliaryType()
      this.querySubjectRef()
    },
    changeKm (val) {
      const subject = this.subjectRef.find(v => v.kmbm === val)
      if (!this.checkKm(subject)) {
        this.queryForm.km = ''
        this.$message.error('您选择的科目无法生成多栏账信息，请选择非末级科目或挂辅助项目的科目!')
        return
      }
      if (this.showFzSearxh && this.auxiliaryTypes instanceof Array && this.auxiliaryTypes.length > 0) {
        const defaultAuxiliaryType = this.auxiliaryTypes[0]
        this.queryForm.fzlbobj = defaultAuxiliaryType.id
      } else {
        this.queryForm.fzlbobj = ''
        this.queryForm.fzxm = ''
      }
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
    checkKm (subject) {
      return typeof subject === 'object' && subject.hasOwnProperty('yz') && ((subject.yz === '是' && subject.isfzhs !== '0000000000') || subject.yz === '否')
    },
    print () {
      if (this.tableData === null || this.tableData.length === 0) {
        this.$message({
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      this.$refs.printdialog.show()
    },
    excelexport () {
      if (this.tableData === null || this.tableData.length === 0) {
        this.$message({
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      this.$api.dlzReport.exportExcel('多栏账', this.getExportParam())
    },
    confirmPrint (val) {
      this.$api.dlzReport.printPdf(this.singlekmname + '多栏账', this.getPrintParam(val))
    },
    selectGet (vId) { // 下拉框选中事件 ,这个vId也就是value值
      let obj = {}
      obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.pk_gs === vId// 筛选出匹配数据
      })
      return obj.uname
    },
    querykmByBm (kmbm) {
      return this.subjectRef.find(v => v.kmbm === kmbm)
    },
    getQueryPram () { // 获取查询条件
      this.queryParam.begindate = this.queryForm.periodRange[0] + '-01'
      this.queryParam.enddate = this.queryForm.periodRange[1] + '-01'
      this.queryParam.fzlb = this.queryForm.fzlbobj
      this.queryParam.kms_first = this.queryForm.km
      this.queryParam.kms_last = this.queryForm.km
      this.queryParam.isxsxj = this.queryForm.xsmx === '1' ? 'Y' : 'N'
      this.queryParam.isxsmx = this.queryForm.xsmx === '2' ? 'Y' : 'N'
      this.queryParam.corpIds1 = this.queryForm.corpIds
      this.queryParam.pk_currency = this.queryForm.pk_currency
      this.queryParam.fzxm = this.queryForm.fzxm
      return this.queryParam
    },
    getPrintParam (val) {
      let printParam = {
        data: JSON.stringify(this.tableData),
        columns1: JSON.stringify(this.columns1),
        columns2: JSON.stringify(this.columns2),
        title: this.querykmByBm(this.queryParam.kms_first).fullname,
        period: this.queryParam.begindate.substr(0, 7) + '--' + this.queryParam.enddate.substr(0, 7),
        corpName: this.corpName,
        columns: JSON.stringify(this.getPrintColumns())
      }
      return Object.assign(printParam, val)
    },
    getPrintColumns () {
      const columns1 = this.columns1
      const columns2 = this.columns2
      var sumcount = 0
      const columnsre = []
      for (let i = 0; i < this.columns.length; i++) {
        columnsre[sumcount] = {}
        columnsre[sumcount].columname = this.columns[i].title
        columnsre[sumcount].column = this.columns[i].field
        columnsre[sumcount].rowspan = columns2 == null ? 1 : 2// frozencolumns[i].rowspan;
        if (this.columns[i].width != null) {
          columnsre[sumcount].width = parseInt(this.columns[i].width <= 100 ? 1 : this.columns[i].width / 50)
        }
        sumcount++
      }

      for (var i = 0; i < columns1.length; i++) {
        if (columns1[i].hidden != null && columns1[i].hidden) { // 隐藏的字段不显示
          continue
        }
        columnsre[sumcount] = {}
        columnsre[sumcount].columname = columns1[i].title
        columnsre[sumcount].column = columns1[i].field
        columnsre[sumcount].colspan = columns1[i].colspan
        columnsre[sumcount].rowspan = columns1[i].rowspan
        if (columns1[i].width != null) {
          columnsre[sumcount].width = parseInt(columns1[i].width <= 100 ? 1 : columns1[i].width / 50)
        }
        sumcount++
      }

      if (columns2 != null) { // 需要找第二个添加
        for (var k = 0; k < columns2.length; k++) {
          columnsre[sumcount] = {}
          columnsre[sumcount].columname = columns2[k].title
          columnsre[sumcount].column = columns2[k].field
          columnsre[sumcount].colspan = columns2[k].colspan
          columnsre[sumcount].rowspan = columns2[k].rowspan
          if (columns2[k].width != null) {
            columnsre[sumcount].width = parseInt(columns2[k].width < 100 ? 1 : columns2[k].width / 100)
          }
          sumcount++
        }
      }

      return columnsre
    },
    getExportParam () {
      const exportParam = {
        data: JSON.stringify(this.tableData),
        corpName: this.corpName,
        period: this.queryParam.begindate.substr(0, 7) + '-' + this.queryParam.enddate.substr(0, 7),
        columncellattrvos: JSON.stringify(this.getExportColumns()),
        titleName: this.singlekmname
      }
      return exportParam
    },
    getExportColumns () {
      const columns1 = this.columns1
      const columns2 = this.columns2
      var sumcount = 0
      var subcount = 0
      const columnsre = []
      for (let i = 0; i < this.columns.length; i++) {
        columnsre[sumcount] = {}
        let title = this.columns[i].title
        if (title.indexOf('<img') > 0) {
          title = title.substring(0, title.indexOf('<img'))
        }
        columnsre[sumcount].columname = title
        columnsre[sumcount].column = this.columns[i].field
        columnsre[sumcount].rowspan = columns2 == null ? 1 : 2// column[i].rowspan;
        if (this.columns[i].width != null) {
          columnsre[sumcount].width = parseInt(this.columns[i].width < 100 ? 1 : this.columns[i].width / 100)
        }
        sumcount++
      }

      for (let i = 0; i < columns1.length; i++) {
        let title = columns1[i].title
        if (title.indexOf('<img') > 0) {
          title = title.substring(0, title.indexOf('<img'))
        }
        if (columns1[i].colspan != null && columns1[i].colspan >= 1) {
          for (var q = 0; q < columns1[i].colspan; q++) {
            columnsre[sumcount] = {}
            columnsre[sumcount].column = columns2[subcount].field
            columnsre[sumcount].columname = title + '_' + columns2[subcount].title
            columnsre[sumcount].rowspan = columns1[i].rowspan
            if (columns1[i].width != null) {
              columnsre[sumcount].width = parseInt(columns1[i].width < 100 ? 1 : columns1[i].width / 100)
            }
            sumcount++
            subcount++
          }
        } else {
          columnsre[sumcount] = {}
          columnsre[sumcount].column = columns1[i].field
          columnsre[sumcount].columname = title
          columnsre[sumcount].rowspan = columns1[i].rowspan
          if (columns1[i].width != null) {
            columnsre[sumcount].width = parseInt(columns1[i].width < 100 ? 1 : columns1[i].width / 100)
          }
          sumcount++
        }
      }
      return columnsre
    }
  }
}
</script>

<style scoped>

</style>
