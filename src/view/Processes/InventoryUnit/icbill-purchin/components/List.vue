<template>
  <div class="kj-container" >
    <div class="kj-head">
      <div class="query-info">期间
        <div style="margin-left: 5px">
          <el-popover
            placement="bottom-start"
            title="入库单查询"
            width="450"
            popper-class="query-popover"
            v-model="queryVisible">
            <QueryForm ref="queryForm"> </QueryForm>
            <div class="query-footer">
              <div class="kj-button-group">
                <el-button @click="queryVisible = false">取消</el-button>
                <el-button @click="clearQueryForm">清除</el-button>
                <el-button type="primary" @click="query">确定</el-button>
              </div>
            </div>
            <span class="query-period" slot="reference">
              {{qrydate}}
              <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
            </span>
          </el-popover>
        </div>
        <span class="query-corp"></span>
        <el-switch  style="margin-left: 10px;margin-top:4px" v-model="ishowcust"
                    active-value= true inactive-value= false active-text="显示供应商" @change="saveSetting"></el-switch>
      </div>
      <div class="kj-button-group">
        <el-button  style="margin-left:10px" @click="reFetchData">刷新</el-button>
        <el-dropdown style="margin-left:10px">
          <el-button   @click="onAdd">新增<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: 6px">
            <div @click="onCopy">
              <el-dropdown-item >复制</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button  style="margin-left:10px" @click="editData">修改</el-button>
        <el-button  style="margin-left:10px" @click="onDelete">删除</el-button>
        <el-dropdown style="margin-left:10px">
          <el-button   @click="toVou">生成凭证<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: -6px">
            <div @click="toVous">
              <el-dropdown-item >汇总生成凭证</el-dropdown-item>
            </div>
            <div @click="cancelToVoU">
              <el-dropdown-item >取消生成凭证</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown style="margin-left:10px">
          <el-button   @click="impExcel">导入<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right: 6px">
            <div @click="expExcel">
              <el-dropdown-item >导出</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button  style="margin-left:10px" @click="print">打印</el-button>
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
          show-summary
          :summary-method="getSummaries"
          stripe
          border
          height="100%"
          ref="tableRef"
          style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="50"></el-table-column>
          <el-table-column type="selection" align="center"  width="50"> </el-table-column>
          <el-table-column prop="cbusitype" align="center"  label="入库类型"  width="80" :formatter="typeformatter"></el-table-column>
          <el-table-column prop="ddate"  align="center" label="单据日期" width="90"> </el-table-column>
          <el-table-column prop="did" align="center" label="单据编号" min-width="120" >
            <template slot-scope="scope">
              <span @click="editRow(scope.row)"
                      class="spanlink" >{{scope.row.did}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pzh" align="center" label="凭证号" min-width="80" >
            <template slot-scope="scope" v-if="scope.row.pzh">
              记<span @click="linkVou(scope.row)"  class="spanlink" >{{scope.row.pzh}}</span>
            </template>
          </el-table-column>
          <TableColumnPre prop="vdef5" label="数量" :pretype = 3></TableColumnPre>
          <TableColumnPre prop="vdef4" label="单价" :pretype = 2></TableColumnPre>
          <TableColumnPre prop="mny" label="金额"></TableColumnPre>
          <TableColumnPre prop="tmny" label="税额"></TableColumnPre>
          <TableColumnPre prop="ttmny" label="价税合计"></TableColumnPre>
          <el-table-column prop="zgname" header-align ="center" align="center" label="暂估" width="100">
            <template slot-scope="scope">
              <span   class="spanlink" >{{scope.row.zgname}}</span>
            </template>
          </el-table-column >
          <el-table-column v-if="this.ishowcust==='true'"  prop="custname" align="center" label="供应商" show-overflow-tooltip width="150" > </el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                    @pagination="fetchData"></Pagination>
      </div>
      <UploaderDialog
        :visible.sync="dialogImpFormVisible"
        name="impfile"
        :title="dialogImpFormTitle"
        @submit="onUpload"
        :param="uploadParam">
        <template #description>
          <div class="import-description">支持标准模板导入,没有导入模板<a href="javascript:void(0)" @click="expExcelemplate()">点击下载</a></div>
        </template>
      </UploaderDialog>
      <PrintDataDialog ref="printdialog" :visible.sync="dialogPrintFormVisible" :title="dialogPrintFormTitle"  :nodename="nodename" @getPrint="setPrint" @confirmPrint="confirmPrint">
      </PrintDataDialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import TableColumnPre from '@/components/TableColumnPre/index'
import PrintDataDialog from '../../component/PrintDataDialog'
import QueryForm from './QueryForm'
import * as MsgUtil from '../../../msg-util'
import * as IcbillManageConst from '../../icbill-manage-const'
import UploaderDialog from '@/components/UploaderDialog'
import { orderBy } from 'natural-orderby'
import { calculate } from '@/utils'
export default {
  name: 'List',
  components: {
    Pagination,
    TableColumnPre,
    QueryForm,
    UploaderDialog,
    PrintDataDialog
  },
  data () {
    return {
      loading: false,
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      nodename: '入库单',
      total: 0,
      tableData: [],
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      dialogImpFormVisible: false,
      dialogImpFormTitle: '导入入库单',
      ishowcust: 'true',
      dialogPrintFormVisible: false,
      dialogPrintFormTitle: '打印',
      queryParam: {},
      printParam: {},
      queryVisible: false,
      numPre: this.$store.getters.numPre,
      qrydate: this.$store.getters.getLoginDate.substr(0, 7) + '-01' + '至' + this.$store.getters.getLoginDate.substr(0, 7)
    }
  },
  computed: {
    sortedData () {
      return this.tableData
    },
    uploadParam () {
      return {
        pk_corp: this.$parent.pk_corp,
        sourcename: '入库单'
      }
    }
  },
  watch: {
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout()
    })
  },
  mounted () {
    if (this.$parent.queryData) {
      if (this.$parent.queryData.page) { this.pageInfo.page = this.$parent.queryData.page }
      if (this.$parent.queryData.rows) { this.pageInfo.rows = this.$parent.queryData.rows }
      this.$refs.queryForm.loadQueryParam(this.$parent.queryData)
    }
    this.fetchData()
  },
  methods: {
    fetchData (isQuery) {
      this.loading = true
      let param = this.getQueryParam()
      if (param.dateType === '2') {
        param.serdate = 'serMon'
        this.qrydate = param.beginPeriod + '至' + param.endPeriod
      } else {
        param.serdate = 'serDay'
        this.qrydate = param.begindate + '至' + param.enddate
      }
      this.queryParam = param
      this.$api.InventoryManageApi.IcbillPurchin.queryData(param).then(result => {
        this.loading = false
        if (result.success) {
          for (let item of result.rows) {
            this.$parent.formateForm(item)
          }
          this.tableData = result.rows
          this.$parent.tableData = this.sortedData
          this.total = result.total
          if (isQuery)
            MsgUtil.successMsg(this, '查询成功')
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    getQueryParam () {
      let param = this.$refs.queryForm.getQueryParam()
      if (param !== false) {
        Object.assign(param, this.pageInfo)
      }
      delete param.pageSizes
      return param
    },
    query () {
      this.fetchData(true)
      this.queryVisible = false
    },
    reFetchData () {
      this.pageInfo.page = 1
      this.fetchData()
    },
    paginationQuery () {
      this.fetchData()
    },
    clearQueryForm () {
      return this.$refs.queryForm.resetForm()
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = orderBy(val, v => v.index)
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
    onAdd () {
      const date = this.$store.getters.getLoginDate
      const busitype = IcbillManageConst.purchInType[1].value
      let param = {
        ddate: date,
        cbusitype: busitype
      }
      this.$api.InventoryManageApi.IcbillPurchin.getBillNo(param).then(result => {
        if (!result.success) {
          MsgUtil.errorMsg(this, result.msg)
        } else {
          this.$api.InventoryManageApi.IcsetSetting.query().then(res => {
            const formData = {curOptType: 'new', id_corp: this.$parent.pk_corp, did: result.data, cbusitype: busitype, ddate: date, iway: res.rows.cgfkfs + '', invid: null, invdate: null, isback: false, iszg: false, isczg: false, isrz1: false}
            if (this.$parent.chargedeptname()) {
              formData.fp_style = '2'
              formData.isrz1 = true
            } else {
              formData.fp_style = '1'
            }
            formData.children = [{ ntax: 13 }]
            this.openCard(formData, true)
          })
        }
      })
    },
    editData () {
      let rowData = null
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        rowData = this.listSelectedRows[0]
      }
      this.editRow(rowData, true)
    },
    editRow (rowData, isEdit) {
      if (rowData) {
        // 调用后台的业务逻辑
        this.$api.InventoryManageApi.IcbillPurchin.editData({'id_ictrade_h': rowData.id_ictrade_h}).then(result => {
          if (!result.success) {
            if (isEdit) {
              MsgUtil.errorMsg(this, '已经转总账数据不能修改！')
            } else {
              this.$api.InventoryManageApi.IcbillPurchin.editData({'id_ictrade_h': rowData.id_ictrade_h, 'ignoreCheck': 'Y'}).then(result => {
                if (result.success) {
                  this.openCard(result.data, false)
                }
              })
            }
          } else {
            this.openCard(result.data, true)
          }
        })
      } else {
        MsgUtil.warnMsg(this, '请选中要编辑行数据！')
      }
    },
    openCard (formData, editStatus) {
      this.$parent.formData = formData
      this.$parent.queryData = this.queryParam
      this.$parent.cardShow = true
      this.$parent.editStatus = editStatus
    },
    onCopy () {
      let id = ''
      if (this.IsSelectCurrentRow()) {
        id = this.listSelectedRows[0].id_ictrade_h
      } else {
        return
      }
      if (id === undefined || id === '' || id === null) {
        MsgUtil.warnMsg(this, '请选中要编辑行数据！')
        return
      }
      // 调用后台的业务逻辑
      this.$api.InventoryManageApi.IcbillPurchin.copeData({'id_ictrade_h': id}).then(result => {
        if (!result.success) {
          MsgUtil.warnMsg(this, result.msg)
        } else {
          const formData = result.data
          let param = {
            ddate: formData.ddate,
            cbusitype: formData.cbusitype
          }
          this.$api.InventoryManageApi.IcbillPurchin.getBillNo(param).then(res => {
            if (!res.success) {
              MsgUtil.errorMsg(this, res.msg)
            } else {
              formData.did = res.data
              this.openCard(formData, true)
            }
          })
        }
      })
    },
    onDelete () {
      if (this.IsSelectCurrentRow()) {
        const loading = MsgUtil.loading(this, '正在删除...')
        this.$confirm('您确定删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.InventoryManageApi.IcbillPurchin.deleteRow({head: JSON.stringify(this.listSelectedRows)}).then(result => {
            loading.close()
            if (result.success) {
              MsgUtil.successMsg(this, result.msg)
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
            this.reFetchData()
          })
        }).catch(e => {
          loading.close()
        })
      }
    },
    toVou () {
      if (this.IsSelectCurrentRow()) {
        const loading = MsgUtil.loading(this, '正在转总账...')
        this.$confirm(' 你确定要进行转总账吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.InventoryManageApi.IcbillPurchin.saveToZz({head: JSON.stringify(this.listSelectedRows)}).then(result => {
            loading.close()
            if (result.success) {
              MsgUtil.successMsg(this, result.msg)
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
            this.reFetchData()
          })
        }).catch(e => {
          loading.close()
        })
      }
    },
    toVous () {
      if (this.IsSelectCurrentRow()) {
        const loading = MsgUtil.loading(this, '正在转总账...')
        this.$confirm('你确定要进行转总账吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.InventoryManageApi.IcbillPurchin.saveToTotalZz({head: JSON.stringify(this.listSelectedRows)}).then(result => {
            loading.close()
            if (result.success) {
              MsgUtil.successMsg(this, result.msg)
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
            this.reFetchData()
          })
        }).catch(e => {
          loading.close()
        })
      }
    },
    cancelToVoU () {
      if (this.IsSelectCurrentRow()) {
        const loading = MsgUtil.loading(this, '正在取消转总账...')
        this.$confirm('你确定要进行取消转总账吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.InventoryManageApi.IcbillPurchin.clearToZz({head: JSON.stringify(this.listSelectedRows)}).then(result => {
            loading.close()
            if (result.success) {
              MsgUtil.successMsg(this, result.msg)
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
            this.reFetchData()
          })
        }).catch(e => {
          loading.close()
        })
      }
    },
    linkVou (row) {
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: row.pzid
        }
      })
    },
    impExcel () {
      this.dialogImpFormTitle = '导入入库单'
      this.dialogImpFormVisible = true
    },
    onUpload (formData) {
      if (!formData) {
        MsgUtil.errorMsg(this, '请先选择导入文件!')
        return
      }
      const loading = MsgUtil.loading(this, '正在导入...')
      this.$api.InventoryManageApi.IcbillPurchin.impExcel(formData).then(result => {
        loading.close()
        if (result.success) {
          if (result.msg) {
            MsgUtil.errorMsg(this, result.msg)
          } else {
            MsgUtil.successMsg(this, '导入成功!')
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (result.msg) {
            MsgUtil.errorMsg(this, result.msg)
          } else {
            MsgUtil.errorMsg(this, '导入失败!')
          }
        }
      }).catch(e => {
        loading.close()
      })
    },
    expExcelemplate () {
      let list = 'download'
      this.$api.InventoryManageApi.IcbillPurchin.expExcel({'list': JSON.stringify(list)})
    },
    expExcel () {
      if (this.IsSelectCurrentRow()) {
        let ids = ''
        if (this.listSelectedRows && this.listSelectedRows.length > 0) {
          this.listSelectedRows.forEach(row => {
            ids += row.id_ictrade_h + ','
          })
        }
        this.$api.InventoryManageApi.IcbillPurchin.expExcel({'list': JSON.stringify(ids)})
      }
    },
    setPrint (param) {
      this.printParam = param
      this.ishowcust = (this.printParam.isshow === 'Y' || this.printParam.isshow === 'true') ? 'true' : 'false'
    },
    // 保存设置
    saveSetting () {
      this.$refs.printdialog.formDialogData.isshow = this.ishowcust
      this.$refs.printdialog.saveSettingMsg()
    },
    print () {
      if (!this.IsSelectCurrentRow()) {
        return
      }
      this.dialogPrintFormVisible = true
    },
    confirmPrint (printData) {
      this.printParam = printData

      if (!this.IsSelectCurrentRow()) {
        return
      }
      this.ids = ''
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.listSelectedRows.forEach(row => {
          this.ids += row.id_ictrade_h + ','
        })
      }
      let param = {
        corpName: this.$store.getters.currentCorp.uname,
        list: this.ids.toString().substring(0, this.ids.length - 1)
      }
      printData = Object.assign(param, printData)
      this.$api.InventoryManageApi.IcbillPurchin.print(printData)
      this.dialogPrintFormVisible = false
    },
    IsSelectCurrentRow: function () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        return true
      } else {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return false
      }
    },
    typeformatter (row, column, cellValue, index) {
      if (cellValue) {
        const item = IcbillManageConst.purchInType.find(item => item.value === cellValue)
        return item && item.label ? item.label : IcbillManageConst.purchInType[1].label
      }
      return IcbillManageConst.purchInType[1].label
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      const excludeInx = [0, 1, 3, 4, 5, 7, 11, 12]
      columns.forEach((column, index) => {
        if (excludeInx.includes(index)) {
          return
        }
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        let npre = 2
        if (index === 6) {
          npre = this.numPre
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return calculate('add', prev, curr, npre)
            } else {
              return prev
            }
          }, 0)
        }
      })
      sums.forEach((sum, index) => {
        let npre = 2
        if (index === 6) {
          npre = this.numPre
        }
        if (typeof sum === 'number') {
          sums[index] = this.$options.filters.forThousands(sum, npre)
        }
      })
      return sums
    }
  }
}
</script>

<style scoped>
  .import-description {
    text-align: center;
  }
  .import-description a {
    text-decoration: none;
    color: #2C9DD8;
    cursor: pointer;
  }
</style>
