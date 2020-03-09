<template>
  <div class="kj-container">
    <div class="kj-head">
      <div class="query-info">
        <QueryParam></QueryParam>
      </div>
      <div class="kj-button-group">
        <el-button @click="batchEdit">批量修改</el-button>
        <el-button @click="addInfo">新增</el-button>
        <el-button @click="delRows">删除</el-button>
        <el-button @click="impDialog">导入</el-button>
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
          <el-table-column property="code" label="工号" fixed header-align ="center" align="left" width="70"> </el-table-column>
          <el-table-column property="name" label="姓名" fixed header-align ="center" align="left" width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span @click="editRow(scope.row)"
                      class="spanlink" >{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column property="billtype" label="员工类型" header-align ="center" align="left" width="100" :formatter="yglxformatter" > </el-table-column>
          <el-table-column property="zjlx" label="证照类型" header-align ="center" align="left" width="160"  show-overflow-tooltip :formatter="zjlxformatter" > </el-table-column>
          <el-table-column property="zjbm" label="证照号码" header-align ="center" align="left" width="170"  show-overflow-tooltip> </el-table-column>
          <el-table-column property="vphone" label="手机号" header-align ="center" align="left" width="140"></el-table-column>
          <el-table-column property="varea" label="国籍" header-align ="center" align="left" width="120" ></el-table-column>
          <el-table-column property="isex" label="性别" header-align ="center" align="left" width="60" :formatter="sexformatter" ></el-table-column>
          <el-table-column property="birthdate" label="出生日期"  header-align ="center" align="left" width="100"></el-table-column>
          <el-table-column property="employedate" label="任职受雇从业日期" header-align ="center" align="left" width="150"></el-table-column>
          <el-table-column property="entrydate" label="首次入境时间" header-align ="center" align="left" width="120"></el-table-column>
          <el-table-column property="leavedate" label="预计离境时间" header-align ="center" align="left" width="120"></el-table-column>
          <el-table-column property="vbirtharea" label="出生国家(地区)" header-align ="center" align="left" width="150"></el-table-column>
          <el-table-column property="lhdate" label="来华时间" v-if='false' header-align ="center" align="left" width="100"></el-table-column>
          <el-table-column property="lhtype" label="适用公式" v-if='false' header-align ="center" align="left" width="200"></el-table-column>
          <el-table-column property="vdeptname" label="部门" header-align ="center" align="left" width="150"></el-table-column>
          <el-table-column property="sffc" label="是否封存" header-align ="center" align="center" width="100" >
            <template slot-scope="scope">
              <el-checkbox v-model=scope.row.sffc :true-label =1 :false-label=0 @change="seal(scope.row)" ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column property="vmemo" label="备注" header-align ="center" align="left" width="150"></el-table-column>
        </el-table>
      </div>
      <div class="table-pagination">
        <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                    @pagination="fetchData"></Pagination>
      </div>
      <BatchEditDialog v-show="dialogFormTitle==='批量修改'" :visible.sync="dialogEditFormVisible" :title="dialogFormTitle" :data="dialgFormData" ></BatchEditDialog>
    </div>
    <UploaderDialog
      v-show="dialogFormTitle==='导入职员'"
      :visible.sync="dialogImpFormVisible"
      name="impfile"
      :title="dialogFormTitle"
      @submit="onUpload"
      :param="fileData">
      <template #description>
        <div class="import-description">支持标准模板导入,没有导入模板<a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
      </template>
    </UploaderDialog>
    <StaffInfoDialog :visible.sync="dialogVisible" :data="this.$parent.formData" @fetchData="fetchData" ></StaffInfoDialog>
  </div>
</template>

<script>
import BatchEditDialog from './BatchEditDialog'
import UploaderDialog from '@/components/UploaderDialog'
import Pagination from '@/components/Pagination/index'
import QueryParam from './QueryParam'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import { orderBy } from 'natural-orderby'
import StaffInfoDialog from './StaffInfoDialog'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'list',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
    QueryParam,
    Pagination,
    BatchEditDialog,
    StaffInfoDialog,
    UploaderDialog
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
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      dialogVisible: false,
      dialogImpFormVisible: false,
      dialogDeptFormVisible: false,
      dialogEditFormVisible: false,
      dialogFormTitle: '',
      dialgFormData: {},
      persondata: {},
      fileData: {pk_corp: this.pk_corp, sourcename: '职员档案'},
      // 列表数据过滤
      filters: {
        ygname: []
      },
      deptData: []
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.ygbm)
    },
    cardShow: {
      get () {
        return this.cardShow
      },
      set () {
        this.$emit('update:cardShow', false)
      }
    }
  },
  created () {
    this.fetchData()
  },
  mounted: function mounted () {
    this.getDeptData()
  },
  methods: {
    refreshData () {
      this.getDeptData()
    },
    getDeptData () {
      this.$api.SalaryManageApi.StaffInfo.queryB({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT,
        pk_corp: this.$parent.pk_corp
      }).then(result => {
        if (result.success) {
          if (result.rows) {
            this.deptData = result.rows
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    getParam (param) {
      const params = {
        pk_corp: this.$parent.pk_corp,
        id: AUXILIARY_CONST.AUXILIARY_TYPE.STAFF,
        type: 'gz',
        isfenye: 'Y',
        param: param,
        ...this.pageInfo
      }
      delete params.pageSizes
      return params
    },
    fetchData () {
      this.loading = true
      this.$api.SalaryManageApi.StaffInfo.queryB(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'name')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    addInfo () {
      this.$parent.formData = {curOptType: 'new', pk_corp: this.$parent.pk_corp}
      this.dialogVisible = true
      this.$parent.cardShow = true
      this.$parent.editStatus = true
    },
    // 导入
    impDialog () {
      this.dialogFormTitle = '导入职员'
      this.dialogImpFormVisible = true
    },
    onUpload (formData) {
      if (!formData) {
        this.errorMsg('请先选择导入文件!')
        return
      }
      this.showLoading('正在导入...')
      // 下面append的东西就会到form表单数据的fields中；
      formData.append('hid', AUXILIARY_CONST.AUXILIARY_TYPE.STAFF)
      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.SalaryManageApi.StaffInfo.importB(formData).then(result => {
        this.closeLoading()
        if (result.success) {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.successMsg('导入成功!')
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.errorMsg('导入失败!')
          }
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    // 批量修改
    batchEdit () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
      } else {
        this.warnMsg('请选择至少一行数据！')
        return
      }

      this.dialgFormData.num = this.listSelectedRows.length
      this.dialgFormData.cdeptid2 = null
      this.dialgFormData.vdeptname = null
      // const date = this.$store.getters.system.LoginDate
      const date = '2019-01-01'
      this.dialgFormData.employedate = date
      this.dialgFormData.atrr = AUXILIARY_CONST.BATCH_MODIFY_FIELD[0].value
      this.dialogFormTitle = '批量修改'
      this.dialogEditFormVisible = true
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
      let tips = ''
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        tips = '确定要删除选中的数据？'
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
        this.$api.SalaryManageApi.StaffInfo.deleteRows(this.listSelectedRows).then(result => {
          this.closeLoading()
          if (result.success) {
            if (result.msg.indexOf('失败') > -1) {
              this.errorMsg(result.msg)
            } else {
              this.successMsg('删除成功!')
            }
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
    expExcel () {
      this.$api.SalaryManageApi.StaffInfo.expExcel({'hid': AUXILIARY_CONST.AUXILIARY_TYPE.STAFF})
    },
    seal (row) {
      if (row === null) {
        return false
      }

      if (row.sffc && row.sffc === 1) {
        this.onSeal(row)
      } else {
        this.unseal(row)
      }
    },
    onSeal (row) {
      if (row === null) {
        return false
      }
      this.showLoading('正在封存...')
      this.$api.SalaryManageApi.StaffInfo.onSeal({ id: row.id }).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg('封存成功!')
        } else {
          this.errorMsg('封存成功')
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    unseal (row) {
      if (row === null) {
        return false
      }
      this.showLoading('正在取消封存...')
      this.$api.SalaryManageApi.StaffInfo.unSeal({ id: row.id }).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg('取消封存成功!')
        } else {
          this.errorMsg('取消封存失败!')
        }
      }).catch(e => {
        this.closeLoading()
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
    },
    sexformatter (row, column, cellValue, index) {
      if (cellValue) {
        const item = AUXILIARY_CONST.STAFF_SEX.find(item => item.value === cellValue)
        return item ? item.label : ''
      }
      return '1'
    },
    // 证件类型
    zjlxformatter (row, column, cellValue, index) {
      if (cellValue) {
        const item = AUXILIARY_CONST.CERTIFICATE_TYPE.find(item => item.value === cellValue)
        return item ? item.text : ''
      }
      return ''
    },
    // 员工类型
    yglxformatter (row, column, cellValue, index) {
      if (cellValue) {
        const item = AUXILIARY_CONST.STAFF_TYPE.find(item => item.value === cellValue)
        return item ? item.label : ''
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .import-description {
    text-align: center;
    color:#999;
  }
  .import-description a {
    text-decoration: none;
    color: #2C9DD8;
    cursor: pointer;
    font-size:14px;
  }
</style>
