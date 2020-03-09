<template>
    <div class="app-main">
        <div class="kj-container">
            <div class = "kj-head">
                <div class="query-info">
                    <div>期间：
                        <el-popover
                                placement="bottom-start"
                                title="数量金额明细账查询"
                                width="450"
                                popper-class="query-popover"
                                v-model="queryVisible">
                            <el-form ref="form" :model="formParam" label-width="auto">
                                <el-form-item label="期间">
                                    <el-date-picker
                                            v-model="formParam.periodRange"
                                            type="monthrange"
                                            unlink-panels
                                            range-separator="至"
                                            :picker-options="monthPickerOptions"
                                            value-format="yyyy-MM"
                                            style="width: 315px">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="科目">
                                    <el-select
                                            v-model="formParam.kms_first"
                                            default-first-option
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
                                            v-model="formParam.kms_last"
                                            default-first-option
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
                                <el-form-item label="级次">
                                  <el-select
                                    v-model="formParam.cjq"
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
                                    v-model="formParam.cjz"
                                    style="width: 150px">
                                    <el-option
                                      v-for="item in subjectLevel"
                                      :key="item.value"
                                      :value="item.value"
                                      :label="item.label">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-collapse-transition>
                                    <div v-show="showFullParam" style="max-height: 210px">
                                        <el-form-item label="">
                                            <el-checkbox
                                                    label="包含未记账凭证"
                                                    false-label="Y" true-label="N"
                                                    v-model="formParam.ishasjz"
                                                    style="width: 150px"></el-checkbox>
                                            <el-checkbox
                                                    label="显示辅助核算"
                                                    true-label="Y" false-label="N"
                                                    v-model="formParam.xsfzhs"></el-checkbox>
                                            <el-checkbox
                                                    label="无余额无发生不显示"
                                                    true-label="Y" false-label="N"
                                                    v-model="formParam.xswyewfs"
                                                    style="width: 150px"></el-checkbox>
                                            <el-checkbox
                                                    label="有余额无发生不显示"
                                                    false-label="Y" true-label="N"
                                                    v-model="formParam.ishowfs"></el-checkbox>
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
                    <span style = "display:inline-block;margin-left: 20px">公司:{{corpName}}</span>
                    <span style = "display:inline-block;margin-left: 20px" v-show="singlekmname!=null && singlekmname.length>0">名称:{{singlekmname}}</span>
                </div>
                <div class="kj-button-group">
                    <el-dropdown style="margin-left:10px">
                      <el-button >显示单价<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                      <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: 0px">
                        <div style="width:119px;height:25px">
                          <el-checkbox v-model="showcolumnjfnprice" @change="checkchange" true-label="Y" false-label="N">借方单价</el-checkbox>
                        </div>
                        <div >
                          <el-checkbox v-model="showcolumndfnprice" @change="checkchange" true-label="Y" false-label="N">贷方单价</el-checkbox>
                        </div>
                        <div >
                          <el-checkbox v-model="showcolumnyenprice" @change="checkchange" true-label="Y" false-label="N">余额单价</el-checkbox>
                        </div>
                      </el-dropdown-menu>
                    </el-dropdown>
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
                <sljemxbody  ref="bodyTable" :alltabledata="alltabledata" :loading="loading"
                            :nodename="nodename" :routerParam.sync="routerParam"
                            :treedata="treedata"
                            :page-info="pageInfo"
                            :bodycolumnjfnprice="showcolumnjfnprice" :bodycolumndfnprice="showcolumndfnprice"
                            :bodycolumnyenprice="showcolumnyenprice"
                            @updatetotal="updatetotal" @updatesinglekmname="updatesinglekmname"
                            @updatecurrdata="updatecurrdata"></sljemxbody>
                <div class="table-pagination">
                    <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" :pageSizes.sync="pageInfo.pageSizes"  ></Pagination>
                </div>
            </div>
        </div>
        <!-- 打印对话框 -->
        <print-dialog ref="printdialog" :printTempRef="printTempRef" :enddate ="formParam.enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>

    </div>
</template>

<script>
import { SUBJECT_LEVEL, CURRENCY_RMB } from '@/constants'
import PrintDialog from '@/components/Report/PrintDialog'
import Pagination from '@/components/Pagination'
import sljemxbody from './body'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'sljemxz-report',
  props: {
    routerParam: {
      type: Object
    }
  },
  mixins: [datePickerMixin],
  components: {
    Pagination,
    sljemxbody,
    PrintDialog
  },
  data () {
    return {
      nodename: '数量金额明细账',
      printSetting: {},
      singlekmname: '',
      queryVisible: false,
      showFullParam: false,
      subjectLevel: SUBJECT_LEVEL,
      formParam: {
        periodRange: [this.$store.getters.getLoginDate.substring(0, 7), this.$store.getters.getLoginDate.substring(0, 7)],
        cjq: '1',
        cjz: '5',
        begindate: '',
        enddate: '',
        kms_first: '',
        kms_last: '',
        ishasjz: 'N',
        xsfzhs: 'Y',
        xswyewfs: 'Y',
        ishowfs: 'Y'
      },
      queryqj: '',
      alltabledata: [],

      showcolumnjfnprice: 'N',
      showcolumndfnprice: 'N',
      showcolumnyenprice: 'N',

      loading: false,
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
      allexcelexport: false, // 是否全部导出

      printTempRef: [
        { value: '1', label: 'A4纸模板' },
        { value: '2', label: 'B5纸模板' }
      ]
    }
  },
  created () {
    if (!this.routerParam) {
      this.formParam.cjq = SUBJECT_LEVEL[0].value
      this.formParam.cjz = SUBJECT_LEVEL[SUBJECT_LEVEL.length - 1].value

      this.query()
    }
    // 获取个性化保存信息
    this.querySettingMsg()
  },
  computed: {
    subSubjectRef () {
      return this.$store.getters.subSubjectRef
    }
  },
  watch: {
    'showcolumnjfnprice' (newval, oldvalue) {
      if (newval == undefined) {
        this.showcolumnjfnprice = 'N'
      }
    },
    'showcolumndfnprice' (newval, oldvale) {
      if (newval == undefined) {
        this.showcolumndfnprice = 'N'
      }
    },
    'showcolumnyenprice' (newval, oldvale) {
      if (newval == undefined) {
        this.showcolumnyenprice = 'N'
      }
    },
    routerParam: {
      handler (data) {
        if (data) {
          this.init()
          this.query()
        }
      },
      immediate: true
    },
    'treedata' (newval, oldvale) { // 构造text
      if (newval && newval.length > 0) {
        for (let obj of newval) {
          obj.text = obj.kmbm + '_' + obj.kmmc
          if (obj.children != null && obj.children.length > 0) {
            this.loopTreeData(obj.children)
          }
        }
      }
    }
  },
  methods: {
    loopTreeData (rows) {
      for (let row of rows) {
        row.text = row.kmbm + '_' + row.kmmc
        if (row.children && row.children.length > 0) {
          this.loopTreeData(row.children)
        }
      }
    },
    checkchange () {
      this.saveSettingMsg()
    },
    // 保存设置
    saveSettingMsg () {
      this.printSetting.showcolumnjfnprice = this.showcolumnjfnprice
      this.printSetting.showcolumndfnprice = this.showcolumndfnprice
      this.printSetting.showcolumnyenprice = this.showcolumnyenprice
      let param = {
        nodename: this.nodename,
        print_setting: JSON.stringify(this.printSetting),
        updatecolumn: 'print_setting'
      }
      this.$api.printSetting.saveMulColumn(param).then(result => {
      }).catch(e => {
      })
    },
    // 查询报表设置
    querySettingMsg () {
      this.$api.printSetting.printQuerySetting(this.nodename, this.$store.getters.currentCorp.pk_gs).then(result => {
        if (result.success) {
          if (result.rows) {
            if (result.rows.print_setting) {
              this.printSetting = JSON.parse(result.rows.print_setting)
            }
          }
          if (this.printSetting) { // 处理历史数据
            this.showcolumnjfnprice = this.printSetting['showcolumnjfnprice']
            this.showcolumndfnprice = this.printSetting['showcolumndfnprice']
            this.showcolumnyenprice = this.printSetting['showcolumnyenprice']
          }
        }
      }).catch(e => {
      })
    },
    init () {
      if (!this.$_.isEmpty(this.routerParam)) {
        if (this.routerParam.hasOwnProperty('id') &&
              this.routerParam.id === 'sljezz') {
          let queryParam = this.routerParam.queryParam
          this.formParam.periodRange = queryParam.periodRange
          this.formParam.corpobj = queryParam.corpobj
          this.formParam.cjq = queryParam.cjq
          this.formParam.cjz = queryParam.cjz
          this.formParam.kms_first = queryParam.kms_first
          this.formParam.kms_last = queryParam.kms_last
          this.formParam.ishasjz = queryParam.ishasjz
          this.formParam.xsfzhs = queryParam.isfzhs
          this.formParam.xswyewfs = queryParam.xswyewfs
          this.formParam.ishowfs = queryParam.ishowfs
        }
      }
    },
    query () {
      this.loading = true
      this.queryqj = this.formParam.periodRange[0] + '至' + this.formParam.periodRange[1]
      // 数量金额明细查询
      this.$api.SljemxzReport.query(this.getQueryPram()).then(result => {
        if (result.success) {
          this.$refs.bodyTable.setDefaultIds()
          this.alltabledata = result.rows === undefined ? [] : result.rows
          this.total = result.total
          this.treedata = result.numMnyDetail
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
      this.allexcelexport = false
      this.confirmExcelExport()
    },
    excelAll () {
      this.allexcelexport = true
      this.confirmExcelExport()
    },
    confirmExcelExport () {
      const excelparam = {
        projectname: this.singlekmname,
        export_all: this.allexcelexport ? 'Y' : 'N',
        titleperiod: this.queryqj,
        corpName: this.corpName,
        showjf: this.showcolumnjfnprice,
        showdf: this.showcolumndfnprice,
        showye: this.showcolumnyenprice
      }
      this.$api.SljemxzReport.expExcel(this.nodename, Object.assign({
        list: JSON.stringify(this.getExpRows(this.allexcelexport ? this.alltabledata : this.currtabledata))
      }, this.getQueryPram(), excelparam))
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
        titlePeriod: this.queryqj,
        corpName: this.corpName,
        showjf: this.showcolumnjfnprice,
        showdf: this.showcolumndfnprice,
        showye: this.showcolumnyenprice,
        list: JSON.stringify(this.getExpRows(this.allprint ? this.alltabledata : this.currtabledata))
      }
      this.$api.SljemxzReport.printPdf(this.nodename, Object.assign({}, this.getQueryPram(), val, otherparam))
    },
    getExpRows (rows) {
      let temps = []
      if (rows != null && rows.length > 0) {
        temps = JSON.parse(JSON.stringify(rows))
        temps.forEach(row => {
          row.dir = row.dir == 0 ? '借' : row.dir == 1 ? '贷' : '平'
          row.titlePeriod = this.queryqj
          row.gs = this.corpName
          if (row.children) {
            row.children = null
          }
        })
      }

      return temps
    },
    // selectGet (vId) { // 下拉框选中事件 ,这个vId也就是value值
    //   let obj = {}
    //   obj = this.$store.getters.corps.find((item) => { // 这里的userList就是上面遍历的数据源
    //     return item.pk_gs === vId// 筛选出匹配数据
    //   })
    //   return obj.uname
    // },
    getQueryPram () { // 获取查询条件
      let param = {}
      param.begindate = this.formParam.periodRange[0] + '-01'
      param.enddate = this.formParam.periodRange[1] + '-01'
      param.cjq = this.formParam.cjq
      param.cjz = this.formParam.cjz
      param.kms_first = this.formParam.kms_first
      param.kms_last = this.formParam.kms_last
      param.ishasjz = this.formParam.ishasjz
      param.xsfzhs = this.formParam.xsfzhs
      param.xswyewfs = this.formParam.xswyewfs
      param.ishowfs = this.formParam.ishowfs
      param.page = this.pageInfo.page
      param.rows = this.pageInfo.rows
      return param
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
   >>> .el-checkbox:last-of-type{
     padding-left: 7px
   }
   >>> .el-checkbox__label{
     padding-left: 4px
   }
</style>
