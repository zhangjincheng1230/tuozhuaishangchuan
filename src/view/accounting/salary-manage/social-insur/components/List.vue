<template>
  <div class="kj-container" >
    <div class="kj-head">
      <div class="query-info">期间
        <QueryPeriod :qj.sync="period" @query="onQueryD" ></QueryPeriod>
      </div>
      <div class="kj-button-group">
        <el-button @click="addInfo">新增</el-button>
        <el-button @click="delRows">删除</el-button>
        <el-button @click="chgNum">统一基数设置</el-button>
        <el-button @click="batchchgNum">批量调整</el-button>
      </div>
    </div>
    <div class="kj-main">
      <div class="table-container">
        <el-table
          :data="sortedData"
          highlight-current-row
          @current-change="handleListRowSelect"
          @selection-change="handleListRowSelection"
          :row-class-name="tableRowClassName"
          @row-click="dblclickRow"
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          stripe
          border
          height="100%"
          ref="tableRef"
          style="width: 100%">
          <el-table-column label="序号" type="index" align="center" fixed  width="50"></el-table-column>
          <el-table-column type="selection" align="center" fixed width="50"></el-table-column>
          <el-table-column property="ygbm" label="工号" header-align ="center" align="left" fixed width="70"></el-table-column>
          <el-table-column property="ygname" label="姓名" header-align ="center" align="left" fixed show-overflow-tooltip width="100">
            <template slot-scope="scope">
                <span @click="editRow(scope.row)"
                        class="spanlink" >{{scope.row.ygname}}</span>
            </template>
          </el-table-column>
          <el-table-column property="zjbm" label="证件号码" header-align ="center" align="left"  width="170"></el-table-column>
          <el-table-column label="养老保险"  align="center" header-align ="center">
            <el-table-column property="yfbx_js" label="基数" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="yfbx_bl" label="个人%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="yfbx_mny" label="固额"  header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="qyyfbx_bl" label="企业%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
          </el-table-column>
          <el-table-column label="医疗保险"  align="center" header-align ="center">
            <el-table-column property="ylbx_js" label="基数" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="ylbx_bl" label="个人%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="ylbx_mny" label="固额" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="qyylbx_bl" label="企业%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
          </el-table-column>
          <el-table-column label="失业保险"  align="center" header-align ="center">
            <el-table-column property="sybx_js" label="基数" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="sybx_bl" label="个人%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="sybx_mny" label="固额"  header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="qysybx_bl" label="企业%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
          </el-table-column>
          <el-table-column label="公积金"  align="center" header-align ="center">
            <el-table-column property="gjj_js" label="基数" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="gjj_bl" label="个人%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="gjj_mny" label="固额"  header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="qygjj_bl" label="企业%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
          </el-table-column>
          <el-table-column label="工伤保险"  align="center" header-align ="center">
            <el-table-column property="gsbx_js" label="基数" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="qygsbx_bl" label="企业%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
          </el-table-column>
          <el-table-column label="生育保险"  align="center" header-align ="center">
            <el-table-column property="shybx_js" label="基数" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
            <el-table-column property="qyshybx_bl" label="企业%" header-align ="center" align="right" :formatter="nmnyformatter" width="100"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                    @pagination="fetchData"></Pagination>
      </div>
    </div>
    <SalaryBaseDialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :data="dialogFormData" ></SalaryBaseDialog>
    <SocialInsurDialog :visible.sync="dialogVisible" :data="this.$parent.formData" @fetchData="fetchData" ></SocialInsurDialog>
  </div>
</template>

<script>
import SalaryBaseDialog from './SalaryBaseDialog'
import SocialInsurDialog from './SocialInsurDialog'
import Pagination from '@/components/Pagination/index'
import QueryPeriod from '../../components/QueryPeriod'
import { orderBy } from 'natural-orderby'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'List',
  mixins: [MessageUtil, Loading],
  components: {
    SalaryBaseDialog,
    SocialInsurDialog,
    Pagination,
    QueryPeriod
  },
  data () {
    return {
      loading: false,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      tableData: [],
      dialogVisible: false,
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      dialogFormVisible: false,
      dialogFormData: {},
      dialogFormTitle: '',
      period: this.$parent.initperiod,
      // 列表数据过滤
      filters: {
        ygname: []
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.ygbm)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      const params = {
        opdate: this.period,
        pk_corp: this.$parent.pk_corp,
        isfenye: 'Y',
        ...this.pageInfo
      }
      delete params.pageSizes
      this.$api.SalaryManageApi.SocialInsur.query(params).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'ygname')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onQueryD () {
      this.fetchData()
    },
    addInfo () {
      this.$parent.formData = {curOptType: 'new', qj: this.period, pk_corp: this.$parent.pk_corp}
      this.dialogVisible = true
      this.$parent.cardShow = true
      this.$parent.editStatus = true
    },
    editRow (rowData) {
      if (rowData) {
        this.$parent.formData = JSON.parse(JSON.stringify(rowData))
        this.dialogVisible = true
        this.$parent.cardShow = true
        this.$parent.editStatus = true
      } else {
        this.warnMsg('请选中要编辑行数据！')
      }
    },
    delRows () {
      let ids = ''
      let tips = ''
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        tips = '确定要删除选中的数据？'
        ids = this.listSelectedRows.reduce((id, row) => id + ',' + row.pk_sqlarybase, '')
      } else {
        this.warnMsg('请选择要删除的数据！')
        return
      }
      this.showLoading('正在删除...')
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          pks: ids,
          ops: this.listSelectedRows[0].pk_corp,
          opdate: this.period,
          pk_corp: this.$parent.pk_corp
        }
        this.$api.SalaryManageApi.SocialInsur.deleteRows(param).then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg('删除成功!')
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      }).catch(e => {
        this.closeLoading()
      })
    },
    // 批量基数调整
    batchchgNum () {
      if (!this.listSelectedRows || this.listSelectedRows.length === 0) {
        this.warnMsg('请选择一行数据进行调整！')
        return
      }
      this.dialogFormTitle = '批量调整'
      this.dialogFormVisible = true
      this.getAccsetData(this.listSelectedRows[0].cpersonid)
    },
    // 统一基数设置
    chgNum () {
      this.dialogFormTitle = '统一基数设置'
      this.dialogFormVisible = true
      this.getAccsetData()
    },
    getAccsetData (cpersonids, row) {
      this.$api.SalaryManageApi.SocialInsur.getSalaryAccSet({
        opdate: this.period,
        pk_corp: this.$parent.pk_corp,
        cpersonids: cpersonids
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            this.dialogFormData = result.rows
            if (row) {
              this.dialogFormData.cpersonid = row.id
              this.dialogFormData.ygname = row.name
              this.dialogFormData.zjbm = row.zjbm
              this.dialogFormData.zjlx = row.zjlx
            }
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    tableRowClassName (row, index) {
      row.row.index = row.rowIndex
    },
    dblclickRow (row) {
      this.$refs.tableRef.toggleRowSelection(row)
    },
    filterHandler (value, row, column) {
      return row[column.property] && row[column.property].indexOf(value) !== -1
    },
    initFilter: function (list, field) {
      this.filters[field] = []
      const tempObj = {}
      for (const idx in list) {
        if (list[idx][field] && !tempObj[list[idx][field]]) {
          if (list[idx][field].indexOf(';') !== -1) {
            const arrayinds = list[idx][field].split(';')
            for (const ics in arrayinds) {
              if (!tempObj[arrayinds[ics]]) {
                this.filters[field].push({ text: arrayinds[ics], value: arrayinds[ics] })
                tempObj[arrayinds[ics]] = arrayinds[ics]
              }
            }
          } else if (list[idx][field].indexOf(',') !== -1) {
            const arrayinds = list[idx][field].split(',')
            for (const ics in arrayinds) {
              if (!tempObj[arrayinds[ics]]) {
                this.filters[field].push({ text: arrayinds[ics], value: arrayinds[ics] })
                tempObj[arrayinds[ics]] = arrayinds[ics]
              }
            }
          } else {
            this.filters[field].push({ text: list[idx][field], value: list[idx][field] })
            list[idx][field] && (tempObj[list[idx][field]] = list[idx][field])
          }
        }
      }
    },
    nmnyformatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 2, true)
    }
  }
}
</script>

<style scoped>

</style>
