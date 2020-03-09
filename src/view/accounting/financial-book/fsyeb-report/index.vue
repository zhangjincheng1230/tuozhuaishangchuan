<!--发生额余额表-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div>
          <selfhead ref="selfhead" :nodename="nodename" :routerParam="routerParam" :page-info="pageInfo" @query="query" @filterFzlb="filterFzlb"
           @print="print" @exportReport="exportReport"></selfhead>
        </div>
      </div>
      <div class="kj-main" v-loading="loading"  element-loading-text="数据加载中，请稍候..."
           element-loading-spinner="el-icon-loading">
        <tablebwb  :queryParam.sync="queryparam" v-show="bxswbtable == false"  :tabledata="filtertabledata" ></tablebwb>
        <tablewb :queryParam.sync="queryparam"  v-show="bxswbtable == true" :tabledata="filtertabledata" ></tablewb>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <print-dialog ref="printdialog" :enddate ="queryparam.enddate" :bshowDir="false" :defaultleft="40" :defaulttop="5"
                  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
    <excel-export-dialog ref="excelExportdialog" :excelselTemp ="excelselTemp"  @confirmExcelExport="confirmExcelExport"></excel-export-dialog>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop/index'
import Pagination from '@/components/Pagination/index'
import PrintDialog from '@/components/Report/PrintDialog'
import ExcelExportDialog from '@/components/Report/ExcelDialog'
import selfhead from '@/view/accounting/financial-book/fsyeb-report/components/head'
import tablebwb from '@/view/accounting/financial-book/fsyeb-report/components/table_bwb'
import tablewb from '@/view/accounting/financial-book/fsyeb-report/components/table_wb'
export default {
  name: 'fsyeb-report',
  components: {
    BackToTop,
    Pagination,
    PrintDialog,
    ExcelExportDialog,
    selfhead,
    tablewb,
    tablebwb
  },
  data: function () {
    return {
      loading: false,
      nodename: '发生额及余额表',
      bxswbtable: false,
      checklist: [],
      tableData: [],
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      queryparam: {},
      corpname: '',
      excelselTemp: [
        {value: 0, label: '当前查询期间EXCEL格式'},
        {value: 1, label: '当前年度EXCEL格式'}
      ],
      startindex: 0
    }
  },
  props: {
    routerParam: {}
  },
  computed: {
    filtertabledata: function () {
      this.startindex = 0
      if (this.queryparam && this.queryparam.sfzxm === 'Y') {
        return this.handleTabledata(this.tableData, this.$refs.selfhead.getCheckList(), this.startindex)
      } else {
        return this.handleTabledata(this.tableData, null, this.startindex)
      }
    }
  },
  methods: {
    query (formParam) {
      this.loading = true
      this.queryparam = formParam
      if (this.queryparam.pk_currency &&
        this.queryparam.pk_currency !== 'zhbwb' &&
        this.queryparam.pk_currency !== '00000100AA10000000000BKT') {
        this.bxswbtable = true
      } else {
        this.bxswbtable = false
      }
      this.$api.fsyebReport.query(Object.assign(this.queryparam, this.pageInfo)).then(result => {
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
        } else {
          this.$message({showClose: true, message: result.msg, type: 'warning'})
          this.tableData = []
          this.total = 0
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    filterFzlb (checklist) {
      this.checklist = checklist
    },
    handleTabledata (data, checklist) {
      return data.filter(item => {
        let btrue = (item.fzlbcode == null || item.fzlbcode.length === 0) || (checklist && this.includes(checklist, item.fzlbcode))
        return btrue
      }).map(item => {
        item = Object.assign({}, item)
        this.startindex = this.startindex + 1
        item['index'] = this.startindex
        if (item.children) {
          item.children = this.handleTabledata(item.children, checklist)
        }
        return item
      })
    },
    includes (arr1, str2) {
      if (str2 && str2.length > 0) {
        const arr2 = str2.substring(0, str2.length - 1).split(',')
        return arr2.every(val => arr1.includes(val))
      }
      return false
    },
    fetchData () {
      this.$refs.selfhead.query()
    },
    print () {
      if (this.filtertabledata.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const list = []
      this.treeConvertList(this.filtertabledata, list)
      const otherprintparam = {
        titleperiod: this.$refs.selfhead.qrydate,
        corpName: this.queryparam.corpobj.uname,
        list: JSON.stringify(list)
      }
      this.$api.fsyebReport.printPdf(this.nodename, Object.assign({}, this.queryparam, val, otherprintparam))
    },
    filterQueryParam (queryparam) {
      return queryparam
    },
    exportReport () {
      if (this.tableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.excelExportdialog.show()
    },
    treeConvertList (childs, list) {
      if (childs && childs.length > 0) {
        let temp = null
        for (const tt of childs) {
          temp = JSON.parse(JSON.stringify(tt))
          temp.children = null
          list.push(temp)
          if (tt.children && tt.children.length > 0) {
            this.treeConvertList(tt.children, list)
          }
        }
      }
    },
    confirmExcelExport (excelselect) {
      // 走后台查询
      const qrydate = this.$refs.selfhead.qrydate
      const list = []
      this.treeConvertList(this.filtertabledata, list)
      const param = {
        titleperiod: qrydate,
        corpName: this.queryparam.corpobj.uname,
        excelsel: '' + excelselect,
        list: JSON.stringify(list)
      }
      this.$api.fsyebReport.expExcel(this.nodename, Object.assign({}, this.queryparam, param))
    }
  }
}
</script>

<style scoped>

</style>
