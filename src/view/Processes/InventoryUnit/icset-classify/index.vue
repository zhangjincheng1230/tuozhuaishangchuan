<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
        </div>
        <div class="kj-button-group">
          <el-button @click="addInfo">新增</el-button>
          <el-button @click="editData">修改</el-button>
          <el-button @click="deleteSelections">删除</el-button>
          <el-button @click="fetchData(true)">刷新</el-button>
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
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
            stripe
            border
            height="100%"
            style="width: 100%">
            <el-table-column type="selection" align="center" width="50" v-if="false"></el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column property="id" label="操作" header-align ="center" align="center" width="160" v-if="false">
              <template #default="{ row }">
                <el-button type="text" @click="editRow(row)">修改</el-button>
                <span class="opt-split"></span>
                <el-button type="text" @click="delRow(row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column property="cd" label="分类编码" width="180" header-align ="center" align="left"></el-table-column>
            <el-table-column property="nm" label="分类名称" width="150" header-align ="center" align="left"></el-table-column>
            <el-table-column property="mark" label="备注" header-align ="center" align="left" width="240"></el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                      @pagination="fetchData"></Pagination>
        </div>
      </div>
      <InventoryClassDialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :data="formData" @save="onSaved"></InventoryClassDialog>
      <UploaderDialog  :visible.sync="dialogImpFormVisible"  name="impfile"  :title="dialogImpFormTitle"  @submit="onUpload" :param="uploadParam">
        <template #description>
         <div class="import-description" style="text-align:center"> 支持标准模板导入,没有导入模板<a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
        </template>
      </UploaderDialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import UploaderDialog from '@/components/UploaderDialog'
import InventoryClassDialog from './components/InventoryClassDialog'
import * as MsgUtil from '../../msg-util'
import { orderBy } from 'natural-orderby'
export default {
  name: 'icset-classify',
  components: {
    InventoryClassDialog,
    UploaderDialog,
    Pagination
  },
  data () {
    return {
      pk_corp: this.$store.getters.currentCorp.pk_gs,
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
      dialogFormVisible: false,
      dialogFormTitle: '新增',
      dialogImpFormTitle: '导入存货分类',
      dialogImpFormVisible: false,
      formData: {},
      // 列表数据过滤
      filters: {
        nm: []
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.cd)
    },
    uploadParam () {
      return {
        pk_corp: this.pk_corp,
        sourcename: '存货分类'
      }
    }
  },
  created () {
    this.fetchData()
  },
  mounted: function mounted () {
  },
  methods: {
    getParam () {
      const params = {
        pk_corp: this.pk_corp,
        isfenye: 'Y',
        ...this.pageInfo
      }
      delete params.pageSizes
      return params
    },
    fetchData (flag) {
      this.loading = true
      this.$api.InventoryManageApi.IcsetClassfy.query(this.getParam()).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'nm')
          if (flag === true) { MsgUtil.successMsg(this, '刷新成功') }
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    addInfo () {
      this.formData = Object.assign({}, { cd: '001' })
      this.formData.type = 'add'
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增'
    },
    editData () {
      this.editRow(this.listCurrentRow)
    },
    editRow (row) {
      if (row) {
        row.type = 'edit'
        this.formData = Object.assign({}, row)
        this.dialogFormVisible = true
        this.dialogFormTitle = '修改'
      } else {
        MsgUtil.warnMsg(this, '请选择要修改的数据！')
      }
    },
    onSaved () {
      this.$message.success('保存成功!')
      this.fetchData()
    },
    deleteSelections () {
      let rows = []
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        rows = this.listSelectedRows
      } else if (this.listCurrentRow) {
        rows = [this.listCurrentRow]
      } else {
        MsgUtil.warnMsg(this, '请选择要删除的数据！')
        return
      }
      this.delRows(rows)
    },
    delRow (row) {
      this.delRows([row])
    },
    delRows (rows) {
      let ids = ''
      if (rows && rows.length > 0) {
        ids = rows.reduce((id, row) => id + ',' + row.invcls_id, '')
      } else {
        MsgUtil.warnMsg(this, '请选择要删除的数据！')
        return
      }
      const loading = MsgUtil.loading(this, '正在删除...')
      this.$confirm('确定要删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          ids: ids,
          pk_corp: this.pk_corp
        }
        this.$api.InventoryManageApi.IcsetClassfy.deleteData(param).then(result => {
          loading.close()
          if (result.success) {
            if (!result.msg) {
              MsgUtil.successMsg(this, '删除成功!')
              this.fetchData()
              this.dialogImpFormVisible = false
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
            this.fetchData()
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
        }).catch(e => {
          loading.close()
        })
      }).catch(e => {
        loading.close()
      })
    },
    impDialog () {
      this.dialogImpFormVisible = true
    },
    onUpload (formData) {
      if (!formData) {
        MsgUtil.errorMsg(this, '请先选择导入文件!')
        return
      }
      const loading = MsgUtil.loading(this, '正在导入...')
      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.InventoryManageApi.IcsetClassfy.impExcel(formData).then(result => {
        loading.close()
        if (result.success) {
          if (!result.msg) {
            MsgUtil.successMsg(this, '导入成功!')
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (!result.msg) {
            MsgUtil.errorMsg(this, '导入失败!')
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
        }
      }).catch(e => {
        loading.close()
      })
    },
    expExcel () {
      this.$api.InventoryManageApi.IcsetClassfy.expExcel()
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
    }
  }
}
</script>

<style scoped>
  .opt-split {
    margin: 0 8px;
    border-right: 1px solid #777;
  }
  .import-description {
    text-align: center;
  }
  .import-description a {
    text-decoration: none;
    color: #2C9DD8;
    cursor: pointer;
  }
</style>
