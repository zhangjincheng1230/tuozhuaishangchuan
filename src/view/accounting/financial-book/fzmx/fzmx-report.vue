<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                    <div>期间：
                        <el-popover
                                placement="bottom-start"
                                title="辅助明细查询"
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
                                <el-form-item label="辅助类别：">
                                    <el-select
                                            filterable
                                            v-model="queryForm.fzlbobj"
                                            value-key="id"
                                            style="width: 315px">
                                        <el-option
                                                v-for="item in allAuxiliaryTypes"
                                                :key="item.id"
                                                :value="item"
                                                :label="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="辅助项目：">
                                    <el-select
                                            filterable
                                            clearable
                                            v-model="queryForm.fzxm"
                                            style="width: 315px">
                                      <el-option
                                        v-for="item in fzxmByLb"
                                        :key="item.code"
                                        :value="item.code"
                                        :label="item.code  ? item.code + '_' + item.name : item.name">
                                      </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="科目：">
                                    <el-select
                                            v-model="queryForm.kms_first"
                                            filterable
                                            clearable
                                            style="width: 150px">
                                        <el-option
                                                v-for="item in subSubjectRef"
                                                :key="item.id"
                                                :value="item.kmbm"
                                                :label="item.codename"
                                                style="width:150px">
                                        </el-option>
                                    </el-select>
                                    -
                                    <el-select
                                            v-model="queryForm.kms_last"
                                            filterable
                                            clearable
                                            style="width: 150px">
                                        <el-option
                                                v-for="item in subSubjectRef"
                                                :key="item.id"
                                                :value="item.kmbm"
                                                :label="item.codename"
                                                style="width:150px">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-collapse-transition>
                                    <div v-show="showFullParam" style="max-height: 210px">
                                        <el-form-item label="级次：">
                                            <el-select
                                                    v-model="queryForm.cjq"
                                                    style="width: 150px">
                                                <el-option
                                                        v-for="item in subjectLevel"
                                                        :key="item.value"
                                                        :value="item.value"
                                                        :label="item.label"
                                                         >
                                                </el-option>
                                            </el-select>
                                            -
                                            <el-select
                                                    v-model="queryForm.cjz"
                                                    style="width: 150px">
                                                <el-option
                                                        v-for="item in subjectLevel"
                                                        :key="item.value"
                                                        :value="item.value"
                                                        :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
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
                                            <el-checkbox
                                                    label="包含未记账凭证"
                                                    false-label="Y"
                                                    true-label="N"
                                                    v-model="queryForm.ishasjz"
                                                    style="width: 150px"></el-checkbox>
                                            <el-checkbox
                                                    label="显示科目"
                                                    v-model="queryForm.xskm"></el-checkbox>
                                            <el-checkbox
                                                    label="无余额无发生不显示"
                                                    v-model="queryForm.xswyewfs"
                                                    style="width: 150px"></el-checkbox>
                                            <el-checkbox
                                                    label="有余额无发生不显示"
                                                    false-label="Y"
                                                    true-label="N"
                                                    v-model="queryForm.ishowfs"></el-checkbox>
                                        </el-form-item>
                                        <el-form-item label="公司：">
                                            <el-select
                                                    filterable
                                                    v-model="queryForm.corpIds"
                                                    style="width: 315px">
                                                <el-option v-for="item in corpIds"
                                                           :key="item.pk_gs"
                                                           :value="item.pk_gs"
                                                           :label="item.uname"
                                                           style = "width:315px">
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
                             {{queryqj}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
                        </el-popover>
                    </div>
                    <span style = "display:inline-block;margin-left: 20px" class="query-corp" :title="corpName">公司:{{corpName}}</span>
                    <span style = "display:inline-block;margin-left: 20px" v-show="singlekmname!=null && singlekmname.length>0">名称:{{singlekmname}}</span>
                </div>
                <div class="kj-button-group">
                    <el-dropdown @command="printAll">
                        <el-button @click="printCurr">
                            打印当前<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" >
                          <el-dropdown-item command="printall">打印全部</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    <el-dropdown @command="excelAll">
                        <el-button @click="excelCurr" >
                            导出当前<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="excelall">导出全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class = "kj-main">
                <fzmxbody ref="tablebwb" v-if="bxswbtable == false"  :alltabledata="alltabledata" :nodename="nodename" :loading="loading" :treedata="treedata" :page-info="pageInfo" @updatetotal="updatetotal" @updatesinglekmname="updatesinglekmname"
                @updatecurrdata="updatecurrdata"></fzmxbody>
              <fzwbmxbody  ref="tablewb" v-if="bxswbtable == true"  :alltabledata="alltabledata" :nodename="nodename"  :loading="loading" :treedata="treedata" :page-info="pageInfo" @updatetotal="updatetotal" @updatesinglekmname="updatesinglekmname"
                        @updatecurrdata="updatecurrdata"></fzwbmxbody>
                <div class="table-pagination">
                    <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" :pageSizes.sync="pageInfo.pageSizes"  ></Pagination>
                </div>
            </div>
        </div>
        <!-- 打印对话框 -->
        <print-dialog ref="printdialog" :enddate ="queryForm.enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>

       <!--导出对话框-->
        <el-dialog title="导出" :visible.sync="exceldilogvisible" width="20%" :close-on-click-modal="false"
                   :close-on-press-escape="false">
          <el-form ref="excelExportFormData">
            <el-form-item label="导出形式：" >
              <el-checkbox  v-model="excelIsPaging" true-label="Y" false-label="N">按辅助名称分页</el-checkbox>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="exceldilogvisible = false">取消</el-button>
            <el-button type="primary" @click="confirmExcelExport">确定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import { SUBJECT_LEVEL, CURRENCY_RMB } from '@/constants'
import PrintDialog from '@/components/Report/PrintDialog'
import Pagination from '@/components/Pagination'
import fzmxbody from './body'
import fzwbmxbody from './body_wb'
import auxiliaryTypeMixin from '@/mixins/report-auxiliary-type'
import fzxmMixin from '@/mixins/report-fzxm'
import datePickerMixin from '@/mixins/date-picker'
import currencyMixin from '@/mixins/report-currency'
import routeParamMixin from '@/mixins/route-param'
export default {
  name: 'fzmx-report',
  components: {
    Pagination,
    fzmxbody,
    fzwbmxbody,
    PrintDialog
  },
  mixins: [auxiliaryTypeMixin, fzxmMixin, datePickerMixin, currencyMixin, routeParamMixin],
  data () {
    return {
      nodename: '辅助明细账',
      singlekmname: '',
      queryVisible: false,
      showFullParam: false,
      bxswbtable: false,
      subjectLevel: SUBJECT_LEVEL,
      queryForm: {
        periodRange: [this.$store.getters.getLoginDate.substring(0, 7), this.$store.getters.getLoginDate.substring(0, 7)],
        cjq: SUBJECT_LEVEL[0].value,
        cjz: SUBJECT_LEVEL[SUBJECT_LEVEL.length - 1].value,
        begindate: '',
        enddate: '',
        kms_first: '',
        kms_last: '',
        corpIds: this.$store.getters.currentCorp.pk_gs,
        ishasjz: 'N',
        xskm: true,
        fzlb: '',
        fzlbobj: {
          id: '',
          label: ''
        },
        fzxm: '',
        pk_currency: '',
        xswyewfs: true,
        ishowfs: 'Y'
      },
      queryqj: '',
      alltabledata: [],
      loading: false,
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      treedata: [],
      currtabledata: [],
      allprint: false,
      exceldilogvisible: false, // 导出框是否显示
      excelIsPaging: 'N', // 按照辅助名称分页
      allexcelexport: false // 是否全部导出
    }
  },
  watch: {
    paramData (val) {
      if (!this.$_.isEmpty(val)) {
        this.query()
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  computed: {
    showForeignCurrency () {
      return this.queryParam.pk_currency && this.queryParam.pk_currency !== CURRENCY_RMB
    },
    subSubjectRef () {
      return this.$store.getters.subSubjectRef
    },
    auxiliaryTypeName () {
      const type = this.allAuxiliaryTypes.find(t => t.code === this.queryParam.fzlb)
      return type ? type.name : ''
    },
    fzxmByLb () {
      this.queryForm.fzxm = ''
      let array = new Array()
      let arr = [{
        code: '',
        name: '全部'
      }]
      for (const t of this.fzxmList) {
        if (t.pid === this.queryForm.fzlbobj.id) {
          array.push(t)
        }
      }
      if (array.length > 0) {
        return arr.concat(array)
      } else {
        return array
      }
    }
  },
  methods: {
    async init () {
      await this.queryAuxiliaryType()
      if (this.allAuxiliaryTypes && this.allAuxiliaryTypes.length > 0) {
        this.queryForm.fzlbobj = {
          id: this.allAuxiliaryTypes[0].id,
          label: this.allAuxiliaryTypes[0].name
        }
      }
      this.query()
    },
    query () {
      this.loading = true
      let queryParam
      let pk_currency
      if (this.hasRouteParam()) {
        queryParam = this.paramData
        this.queryForm.pk_currency = queryParam.pk_currency
        this.clearRouteParam()
      } else {
        queryParam = this.getQueryPram()
      }
      pk_currency = queryParam.pk_currency
      this.queryqj = this.queryForm.periodRange[0] + '-' + this.queryForm.periodRange[1]
      this.corpName = this.selectGet(this.queryForm.corpIds)
      if (pk_currency && pk_currency !== 'zhbwb' && pk_currency !== '00000100AA10000000000BKT') {
        this.bxswbtable = true
      } else {
        this.bxswbtable = false
      }
      // 辅助明细查询
      this.$api.FzmxReport.query(Object.assign(queryParam, this.pageInfo)).then(result => {
        if (result.success) {
          if (this.bxswbtable === false) {
            this.$refs.tablebwb.setDefaultIds()
          } else {
            this.$refs.tablewb.setDefaultIds()
          }
          this.alltabledata = result.rows === undefined ? [] : result.rows
          this.total = result.total
          this.treedata = result.fzkmmx
        } else {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'warning'
          })
        }
        this.loading = false
        this.queryVisible = false
      }).catch(e => {
      })
    },
    printCurr () {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.allprint = false
      this.$refs.printdialog.show()
    },
    printAll () {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.allprint = true
      this.$refs.printdialog.show()
    },
    excelCurr () {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.exceldilogvisible = true
      this.allexcelexport = false
    },
    excelAll () {
      if (this.alltabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.exceldilogvisible = true
      this.allexcelexport = true
    },
    confirmExcelExport () {
      const excelparam = {
        isPaging: this.excelIsPaging,
        projectname: this.singlekmname,
        export_all: this.allexcelexport ? 'Y' : 'N',
        fzlb_name: this.queryForm.fzlbobj.label,
        titleperiod: this.queryqj,
        corpName: this.corpName
      }
      this.$api.FzmxReport.expExcel('辅助明细账'+ this.queryqj, Object.assign({
        list: JSON.stringify(this.allexcelexport ? this.alltabledata : this.currtabledata)
      }, this.getQueryPram(), excelparam))
      this.exceldilogvisible = false
    },
    updatetotal (total) {
      this.total = total
    },
    updatesinglekmname (val) {
      this.singlekmname = val
    },
    updatecurrdata (val) {
      this.currtabledata = val
    },
    confirmPrint (val) {
      const otherparam = {
        projectname: this.singlekmname,
        print_all: this.allprint ? 'Y' : 'N',
        fzlb_name: this.queryForm.fzlbobj.label,
        titleperiod: this.queryqj,
        corpName: this.corpName
      }
      this.$api.FzmxReport.printPdf(this.nodename, Object.assign({
        list: JSON.stringify(this.allprint ? this.alltabledata : this.currtabledata)
      }, this.getQueryPram(), val, otherparam))
    },
    selectGet (vId) { // 下拉框选中事件 ,这个vId也就是value值
      let obj = {}
      obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
        return item.pk_gs === vId// 筛选出匹配数据
      })
      return obj.uname
    },
    getQueryPram () { // 获取查询条件
      this.queryForm.begindate = this.queryForm.periodRange[0] + '-01'
      this.queryForm.enddate = this.queryForm.periodRange[1] + '-01'
      this.queryForm.fzlb = this.queryForm.fzlbobj.id
      return this.queryForm
    }
  }
}
</script>

<style scoped>
   /*.el-dropdown {*/
   /*    vertical-align: top;*/
   /*}*/
   .el-dropdown + .el-dropdown {
       margin-left: 15px;
   }
   .el-icon-arrow-down {
       font-size: 12px;
   }
</style>
