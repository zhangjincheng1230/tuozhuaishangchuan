<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div style="float: left;">
          <el-menu
            :default-active="defaultMenuIndex"
            mode="horizontal">
            <el-menu-item
              :index="auxiliaryType.id"
              v-for="auxiliaryType in constAuxiliaryTypes"
              @click="changeType(auxiliaryType.id)"
              :key="auxiliaryType.id">
              {{ auxiliaryType.name }}
            </el-menu-item>
            <el-submenu
              v-if="dynamicAuxiliaryTypes && dynamicAuxiliaryTypes.length > 0"
              index="dynamic" class="custom-type" :popper-append-to-body="false">
              <template slot="title">{{customTypeName}}</template>
              <el-menu-item
                :index=" auxiliaryType.id"
                v-for="auxiliaryType in dynamicAuxiliaryTypes"
                @click="changeType(auxiliaryType.id)"
                :key="auxiliaryType.id">
                {{ auxiliaryType.name }}
              </el-menu-item>
            </el-submenu>
            <el-input
              v-model="searchText"
              placeholder="按编码或名称查询"
              style="width: 150px; margin-left: 5px;"></el-input>
            <el-button @click="queryByParam" type="primary" style="margin-left: 8px">查询</el-button>
          </el-menu>
        </div>
        <div class="kj-button-group">
          <el-button v-if="typeId === TYPE_CONST.STAFF" @click="openBatchEditDialog">批量修改</el-button>
          <el-button @click="openDialog">新增</el-button>
          <el-button @click="deleteSelections">删除</el-button>
          <el-button @click="openImportDialog">导入</el-button>
          <el-button v-if="typeId === TYPE_CONST.INVENTORY" @click="openUpdateImportDialog">更新导入</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            @selection-change="handleSelectionChange"
            highlight-current-row
            ref="table"
            v-loading="loading"
            element-loading-text="数据加载中，请稍候..."
            element-loading-spinner="el-icon-loading"
            stripe
            border
            height="100%"
            style="width: 100%">
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              width="120">
              <template #default="{ row }">
                <el-button type="text" @click="editRow(row)">修改</el-button>
                <span class="opt-split"></span>
                <el-button type="text" @click="delRow(row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column
              property="code"
              label="编码"
              header-align="center"
              width="100">
            </el-table-column>
            <el-table-column
              property="name"
              label="名称"
              show-overflow-tooltip
              header-align="center"
              width="150">
            </el-table-column>
            <template v-if="typeId === TYPE_CONST.CUSTOMER || typeId === TYPE_CONST.SUPPLIER">
              <el-table-column
                property="credit_code"
                label="统一社会信用代码"
                header-align="center"
                width="150">
              </el-table-column>
              <el-table-column
                property="address"
                label="地址"
                header-align="center"
                width="150">
              </el-table-column>
              <el-table-column
                property="phone_num"
                label="电话"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="bank"
                label="开户行"
                header-align="center"
                width="170">
              </el-table-column>
              <el-table-column
                property="account_num"
                label="账户"
                header-align="center"
                width="130">
              </el-table-column>
            </template>
            <template v-else-if="typeId === TYPE_CONST.STAFF">
              <el-table-column
                property="billtype"
                label="员工类型"
                :formatter="formatStaffType"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="zjlx"
                label="证照类型"
                header-align="center"
                width="130">
              </el-table-column>
              <el-table-column
                property="zjbm"
                label="证照号码"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                property="vphone"
                label="手机号"
                header-align="center"
                width="110">
              </el-table-column>
              <el-table-column
                property="varea"
                label="国籍"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="isex"
                label="性别"
                :formatter="formatStaffSex"
                header-align="center"
                width="50">
              </el-table-column>
              <el-table-column
                property="birthdate"
                label="出生日期"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="employedate"
                label="任职受雇日期"
                header-align="center"
                width="110">
              </el-table-column>
              <el-table-column
                property="entrydate"
                label="首次入境时间"
                header-align="center"
                width="110">
              </el-table-column>
              <el-table-column
                property="leavedate"
                label="预计离境时间"
                header-align="center"
                width="110">
              </el-table-column>
              <el-table-column
                property="vbirtharea"
                label="出生国家(地区)"
                header-align="center"
                width="120">
              </el-table-column>
              <el-table-column
                property="vdeptname"
                label="部门"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="sffc"
                label="是否封存"
                align="center"
                width="90">
                <template #default="{ row }">
                  <el-checkbox
                    v-model="row.sffc"
                    :true-label="1"
                    :false-label="0" @change="sealChange(row, $event)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                property="vmemo"
                label="备注"
                header-align="center"
                width="180">
              </el-table-column>
            </template>
            <template v-else-if="typeId === TYPE_CONST.INVENTORY">
              <el-table-column
                property="spec"
                label="规格(型号)"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="jsprice"
                label="结算单价"
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="unit"
                label="计量单位"
                header-align="center"
                width="90">
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination
            :total="total"
            :page.sync="pageInfo.page"
            :limit.sync="pageInfo.rows"
            @pagination="fetchData"
            :page-sizes="[50, 100, 200, 500, 1000]"></Pagination>
        </div>
      </div>
    </div>
    <AuxiliaryDialog
      :visible.sync="dialogFormVisible"
      :data="formData"
      @save="onSaved"
      :type="typeId"></AuxiliaryDialog>
    <UploaderDialog
      :visible.sync="impDialogVisible"
      name="impfile"
      :title="importTitle"
      @submit="importExcel"
      :param="uploadParam">
      <template #description>
        <div v-if="updateImport" class="import-description">
          支持将原有存货档案导出补全信息再导入
          <a @click="exportTemplate()">点击下载</a>
        </div>
        <div v-else class="import-description">支持标准模板导入,没有导入模板<a @click="expExcel()">点击下载</a></div>
      </template>
    </UploaderDialog>
    <el-dialog
      title="人员批量修改"
      v-if="typeId === TYPE_CONST.STAFF"
      :close-on-click-modal="false"
      :visible.sync="batchEditDialogVisible"
      width="400px">
      <el-form
        :model="formData"
        ref="batchEditForm"
        label-width="auto">
        <el-form-item label="已选择人数">
          {{ selections && selections.length }}
        </el-form-item>
        <el-form-item label="待修改属性">
          <el-select v-model="batchEditForm.xglx" style="width: 100%">
            <el-option
              v-for="item in batchEditField"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="batchEditForm.xglx === 'employedate'" label="任职受雇日期" prop="employedate">
          <el-date-picker
            v-model="batchEditForm.employedate"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 100%">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="batchEditForm.xglx === 'cdeptid'" label="部门" prop="cdeptid1">
          <el-select v-model="batchEditForm.cdeptid1" filterable style="width: 100%">
            <el-option
              v-for="item in departmentData"
              :key="item.id"
              :label="item.code + ' ' + item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchEditDialogVisible = false">关 闭</el-button>
          <el-button type="primary" @click="batchEditSave">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AuxiliaryDialog from './components/AuxiliaryDialog'
import UploaderDialog from '@/components/UploaderDialog'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import { orderBy } from 'natural-orderby'
import { formatDate } from '@/utils'

const EDIT_FILED = [
  {
    label: '任职受雇日期',
    value: 'employedate'
  },
  {
    label: '部门',
    value: 'cdeptid'
  }
]

function redirectInventory (type, vm) {
  if (type === AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY && vm.$store.getters.inventoryModuleEnabled) {
    vm.$router.push({
      name: 'icset-inventory',
      params: {
        tagTitle: '存货'
      }
    })
  }
}

export default {
  name: 'auxiliary-archive',
  components: {
    Pagination,
    AuxiliaryDialog,
    UploaderDialog
  },
  props: {
    type: {
      type: String,
      default: AUXILIARY_CONST.AUXILIARY_TYPE.CUSTOMER
    }
  },
  data () {
    return {
      typeId: AUXILIARY_CONST.AUXILIARY_TYPE.CUSTOMER,
      defaultMenuIndex: AUXILIARY_CONST.AUXILIARY_TYPE.CUSTOMER,
      loading: true,
      pageInfo: {
        page: 1,
        rows: 50
      },
      total: 0,
      searchText: '',
      rawData: [],
      dialogFormVisible: false,
      impDialogVisible: false,
      updateImport: false,
      TYPE_CONST: AUXILIARY_CONST.AUXILIARY_TYPE,
      selections: null,
      formData: {},
      batchEditDialogVisible: false,
      batchEditForm: {},
      batchEditField: EDIT_FILED,
      departmentData: []
    }
  },
  beforeCreate () {
    redirectInventory(this.$route.params.type, this)
  },
  created () {
    if (this.type) {
      this.typeId = this.type
    }
    this.fetchData()
  },
  watch: {
    type (val) {
      this.typeId = val
    },
    typeId (val, old) {
      this.defaultMenuIndex = val
      if (val === AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY && this.$store.getters.inventoryModuleEnabled) {
        redirectInventory(val, this)
        this.typeId = old
        this.updateActiveMenu()
      } else {
        this.fetchData()
      }
    },
    typeName: {
      handler (name) {
        if (!name) {
          name = '辅助核算档案'
        }
        this.$store.dispatch('tagsView/updateTagTitle', {
          name: this.$options.name,
          title: name
        })
      },
      immediate: true
    }
  },
  computed: {
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    constAuxiliaryTypes () {
      return this.auxiliaryTypes.filter(item => item.gsid === '000001')
    },
    dynamicAuxiliaryTypes () {
      return this.auxiliaryTypes.filter(item => item.gsid !== '000001')
    },
    typeName () {
      let type = this.auxiliaryTypes.find(row => row.id === this.typeId)
      return type ? type.name : ''
    },
    tableData () {
      return orderBy(this.rawData, row => row.code)
    },
    uploadParam () {
      return {
        hid: this.typeId,
        sourcename: this.typeName
      }
    },
    templateUrl () {
      let fileName = 'fztemplate.xls'
      switch (this.typeId) {
        case this.TYPE_CONST.CUSTOMER:
        case this.TYPE_CONST.SUPPLIER:
          fileName = 'fztemplateTax.xls'
          break
        case this.TYPE_CONST.STAFF:
          fileName = 'fztemplateZY.xls'
          break
        case this.TYPE_CONST.INVENTORY:
          fileName = 'fztemplateCH.xls'
          break
        default:
          break
      }
      return process.env.VUE_APP_OLD_API + '/files/template/' + fileName
    },
    importTitle () {
      return (this.updateImport ? '更新' : '') + '导入' + this.typeName
    },
    customTypeName () {
      let name = '自定义'
      let customType = this.dynamicAuxiliaryTypes.find(type => type.id === this.typeId)
      if (customType) {
        name = customType.name
      }
      return name
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: this.typeId,
        isfenye: 'Y',
        ...this.pageInfo
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.rawData = result.rows
          this.total = result.total
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        }
      }).catch(e => {
        this.loading = false
      })
    },
    changeType (id) {
      if (id === AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY && this.$store.getters.inventoryModuleEnabled) {
        this.updateActiveMenu()
        redirectInventory(id, this)
      } else {
        this.typeId = id
      }
    },
    updateActiveMenu () {
      this.defaultMenuIndex = ''
      this.$nextTick(() => {
        this.defaultMenuIndex = this.typeId
      })
    },
    queryByParam () {
      this.loading = true
      this.$api.BasicSettingApi.Auxiliary.queryArchiveByParam({
        id: this.typeId,
        param: this.searchText,
        isfenye: 'Y',
        ...this.pageInfo
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.rawData = result.rows
          this.total = result.total
        }
      }).catch(e => {
        this.loading = false
      })
    },
    handleSelectionChange (val) {
      this.selections = val
    },
    formatStaffType (row, column, cellValue) {
      const type = AUXILIARY_CONST.STAFF_TYPE.find(row => row.value === cellValue)
      return type ? type.label : ''
    },
    formatStaffSex (row, column, cellValue) {
      const type = AUXILIARY_CONST.STAFF_SEX.find(row => row.value === cellValue)
      return type ? type.label : ''
    },
    formatPrice (row, column, cellValue) {
      return cellValue === undefined || cellValue === 0 ? '' : cellValue
    },
    filterZero (row, column, cellValue) {
      return cellValue === undefined || cellValue === 0 ? '' : cellValue
    },
    openDialog () {
      this.formData = {}
      this.dialogFormVisible = true
    },
    editRow (row) {
      this.formData = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    onSaved () {
      this.$message.success('保存成功!')
      this.fetchData()
    },
    deleteSelections () {
      if (this.selections && this.selections.length > 0) {
        this.deleteArchive(this.selections)
      } else {
        this.$message.warning('请选择要删除的数据')
      }
    },
    delRow (row) {
      this.deleteArchive([row])
    },
    deleteArchive (rows) {
      this.$confirm('删除后不可恢复！您确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.BasicSettingApi.Auxiliary.deleteArchive(rows).then(result => {
          if (result.success) {
            if (result.msg.indexOf('删除失败') > -1) {
              this.$message({
                dangerouslyUseHTMLString: true,
                message: result.msg,
                type: 'warning'
              })
            } else {
              this.$message({
                dangerouslyUseHTMLString: true,
                message: result.msg,
                type: 'success'
              })
            }
            this.fetchData()
          } else {
            this.$message.error(result.msg)
          }
        })
      }).catch(() => {
      })
    },
    openImportDialog () {
      this.impDialogVisible = true
      this.updateImport = false
    },
    openUpdateImportDialog () {
      this.impDialogVisible = true
      this.updateImport = true
    },
    importExcel (formData) {
      const api = this.updateImport ? this.$api.BasicSettingApi.Auxiliary.importArchiveUpdate : this.$api.BasicSettingApi.Auxiliary.importArchive
      api(formData).then(res => {
        if (res.success) {
          this.impDialogVisible = false
          this.$message({
            dangerouslyUseHTMLString: true,
            message: res.msg,
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    exportTemplate () {
      if (this.selections && this.selections.length > 0) {
        this.$api.BasicSettingApi.Auxiliary.exportArchiveTemplate({
          daterows: JSON.stringify(this.selections)
        })
      } else {
        this.$message.warning('请选择要导出的数据')
      }
    },
    expExcel () {
      this.$api.BasicSettingApi.Auxiliary.expExcel({'hid': this.typeId})
    },
    openBatchEditDialog () {
      if (this.selections && this.selections.length > 0) {
        const zyids = this.selections.reduce((id, row) => id + ',' + row.id, '').substring(1)
        this.batchEditForm = {
          zyids,
          xglx: 'employedate',
          employedate: formatDate(new Date())
        }
        this.fetchDepartmentData()
        this.batchEditDialogVisible = true
      } else {
        this.$message.warning('请选择要修改的数据')
      }
    },
    batchEditSave () {
      this.$refs.batchEditForm.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.Auxiliary.batchEditStaff(this.batchEditForm).then(res => {
            if (res.success) {
              this.batchEditDialogVisible = false
              this.$message.success(res.msg)
              this.fetchData()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    sealChange (row, val) {
      if (val === 0) {
        this.unsealArchive(row)
      } else {
        this.sealArchive(row)
      }
    },
    sealArchive (id) {
      this.$api.BasicSettingApi.Auxiliary.seal({
        id
      }).then(res => {
        if (res.success) {
          this.$message.success('封存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    unsealArchive (id) {
      this.$api.BasicSettingApi.Auxiliary.unseal({
        id
      }).then(res => {
        if (res.success) {
          this.$message.success('取消封存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    fetchDepartmentData () {
      let id = AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT
      this.$api.BasicSettingApi.Auxiliary.queryArchive({id: id}).then(res => {
        if (res.success) {
          this.departmentData = res.rows
        }
      })
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
  >>> .el-menu--horizontal .el-menu--popup,
  >>> .el-submenu .el-menu-item {
    min-width: 100px;
  }
  >>> .el-menu--popup .el-menu-item {
    text-align: center;
  }
  .kj-head >>> .el-menu--horizontal>.el-menu-item, .kj-head >>> .el-menu--horizontal>.el-submenu .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }
</style>
