<template>
  <div
    class="app-main"
    v-loading="loading"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner">
    <div class="kj-container" v-show="!cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="addTemp">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delTemp">删除</el-button>
          <el-button @click="copyTemp">跨公司复制</el-button>
          <el-button @click="showTemp">卡片显示</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div style="height: 50%">
          <el-table
            ref="table"
            :data="sortedData"
            highlight-current-row
            @current-change="handleListRowSelect"
            @selection-change="handleListRowSelection"
            @row-click="onClickRow"
            stripe
            border
            height="100%"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="mbbm"
              label="模板编码"
              header-align="center"
              width="120">
            </el-table-column>
            <el-table-column
              property="mbmc"
              label="模板名称"
              header-align="center"
              width="200">
            </el-table-column>
            <el-table-column
              property="mbms"
              label="说明"
              header-align="center"
              width="180">
            </el-table-column>
          </el-table>
        </div>
        <div style="height: 50%">
          <el-table
            :data="childrenTableData"
            stripe
            border
            height="100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="kmmc"
              label="科目"
              show-overflow-tooltip
              header-align="center"
              width="200">
            </el-table-column>
            <el-table-column
              property="fx"
              label="方向"
              header-align="center"
              width="100">
              <template #default="scope">
                {{ scope.row.fx === 1 ? '贷方' : '借方' }}
              </template>
            </el-table-column>
            <el-table-column
              property="mny"
              label="金额"
              header-align="center"
              align="right"
              width="120">
              <template #default="{row}">
                {{ row.mny|forThousands }}
              </template>
            </el-table-column>
            <el-table-column
              property="des"
              label="摘要"
              header-align="center"
              width="200">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="kj-container kj-card" v-show="cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button v-if="editStatus" @click="saveTemp">保存</el-button>
          <el-button v-if="editStatus" @click="cancelEdit">取消</el-button>
          <el-button v-if="!editStatus" @click="addTemp">新增</el-button>
          <el-button v-if="!editStatus" @click="editStatus = true">修改</el-button>
          <el-button v-if="!editStatus" @click="delTemp">删除</el-button>
          <el-button v-if="!editStatus" @click="cardShow = false">列表显示</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-form
          :inline="true"
          :model="formData"
          :rules="rules"
          ref="formRef">
          <el-form-item label="模板编码" prop="mbbm">
            <el-input :disabled="!editStatus" v-model="formData.mbbm"></el-input>
          </el-form-item>
          <el-form-item label="模板名称" prop="mbmc">
            <el-input :disabled="!editStatus" v-model.trim="formData.mbmc"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="mbms">
            <el-input :disabled="!editStatus" v-model="formData.mbms"></el-input>
          </el-form-item>
          <div class="card-table-head">
            <div class="kj-button-group">
              <el-button :disabled="!editStatus" @click="addCardRow">增行</el-button>
              <el-button :disabled="!editStatus" @click="delCardRow">删行</el-button>
            </div>
          </div>
          <el-table
            :data="formData.children"
            ref="addChildTable"
            @selection-change="handleCardRowSelection"
            class="edit-table"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              type="selection"
              align="center"
              width="50">
            </el-table-column>
            <el-table-column
              property="kmmc"
              label="科目"
              header-align="center"
              width="200">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.km'" :rules="rules.kmid">
                  <el-select
                    :disabled="!editStatus"
                    filterable
                    v-model="scope.row.km"
                    style="width: 100%">
                    <el-option
                      v-for="subj in subjectRef"
                      :key="subj.id"
                      :label="subj.kmbm + '_' + subj.kmmc"
                      :value="subj.id">
                    </el-option>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              property="fx"
              label="方向"
              header-align="center"
              width="120">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.fx'" :rules="rules.fx">
                  <el-select
                    :disabled="!editStatus"
                    v-model="scope.row.fx"
                    style="width: 100%">
                    <el-option
                      v-for="direction in directions"
                      :key="direction.value"
                      :label="direction.label"
                      :value="direction.value">
                    </el-option>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              property="mny"
              label="金额"
              header-align="center"
              width="180">
              <template #default="scope">
                <el-input-number
                  :disabled="!editStatus"
                  v-model="scope.row.mny"
                  :controls="false"
                  :min="-999999999"
                  :max="999999999"
                  :precision="2"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column
              property="des"
              label="摘要"
              header-align="center"
              width="200">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.des'" :rules="rules.summary">
                  <el-input :disabled="!editStatus" v-model.trim="scope.row.des"></el-input>
                </TableFormItem>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <CorpDialog :visible.sync="dialogVisible"
                @selected="handleCorpSelect"></CorpDialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import TableFormItem from '@/components/TableFormItem'
import CorpDialog from '@/components/reference/CorpDialog'
import loadingMixin from '@/mixins/loading'
import { orderBy } from 'natural-orderby'
import { DIRECTIONS } from '@/constants'

export default {
  name: 'common-template',
  components: {
    Pagination,
    TableFormItem,
    CorpDialog
  },
  mixins: [loadingMixin],
  data () {
    return {
      loading: true,
      cardShow: false,
      editStatus: false,
      total: 0,
      tableData: [],
      childrenTableData: [],
      dialogVisible: false,
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      formData: {},
      directions: DIRECTIONS,
      rules: {
        mbbm: [
          { required: true, message: '请输入模板编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        mbmc: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        mbms: [
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        kmid: [
          { required: true, message: '科目不能为空', trigger: 'change' }
        ],
        fx: [
          { required: true, message: '方向不能为空', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '摘要不能为空', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.mbbm)
    },
    subjectRef () {
      return this.$store.getters.subSubjectRef
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    cardShow (newValue) {
      if (!newValue) {
        // 切到列表界面时，清空表单
        this.$refs.formRef.resetFields()
      }
    }
  },
  methods: {
    fetchData () {
      this.showLoading()
      this.$api.BasicSettingApi.VoucherTemplate.queryTemp({
        withBody: 'Y'
      }).then(result => {
        this.closeLoading()
        if (result.rows) {
          this.tableData = result.rows
          this.total = result.rows.length
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (rows) {
      this.listSelectedRows = rows
      if (rows && rows.length > 0) {
        this.childrenTableData = rows[rows.length - 1].children
      } else {
        this.childrenTableData = []
      }
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    onClickRow (row) {
      this.childrenTableData = row.children
      this.$refs.table.toggleRowSelection(row)
    },
    addTemp () {
      this.formData = {
        mbbm: '',
        children: [{}, {}]
      }
      this.getNewCode()
      this.cardShow = true
      this.editStatus = true
      this.$nextTick(() => {
        this.formData.children.forEach(child => {
          this.$refs.addChildTable.toggleRowSelection(child)
        })
      })
    },
    getNewCode () {
      this.$api.BasicSettingApi.VoucherTemplate.getNewCode().then(res => {
        if (res.success) {
          this.formData.mbbm = res.data
        }
      })
    },
    showTemp () {
      let rows = this.getSelections()
      if (rows.length > 0) {
        let row = rows[0]
        this.formData = JSON.parse(JSON.stringify(row))
        this.cardShow = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要展示的数据',
          type: 'warning'
        })
      }
    },
    getSelections () {
      return this.$refs.table.selection
    },
    delTemp () {
      let ids = ''
      let tips = ''
      if (this.cardShow) {
        tips = '确定要删除当前模板？'
        ids = this.formData.pk_h_id
      } else {
        let rows = this.getSelections()
        if (rows.length > 0) {
          tips = '确定要删除选中的模板？'
          ids = rows.reduce((id, row) => id + ',' + row.pk_h_id, '')
          ids = ids.substring(1)
        } else {
          this.$message({
            showClose: true,
            message: '请选择要删除的数据',
            type: 'warning'
          })
          return
        }
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.showLoading('删除中...')
        this.$api.BasicSettingApi.VoucherTemplate.deleteTemp({
          ids
        }).then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg('删除成功!')
            this.cardShow = false
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(() => {
          this.closeLoading()
        })
      })
    },
    handleCorpSelect (selectedCorps) {
      let rows = this.getSelections()
      if (rows.length > 0) {
        let tmps = rows.reduce((id, row) => id + ',' + row.pk_h_id, '')
        tmps = tmps.substring(1)
        const corps = []
        selectedCorps.forEach(corp => corps.push({
          pk_gs: corp.pk_gs,
          uname: corp.uname
        }))
        this.showLoading('复制中...')
        this.$api.BasicSettingApi.VoucherTemplate.copyTemp({
          tmps,
          corps: JSON.stringify(corps)
        }).then(result => {
          this.closeLoading()
          if (result.success) {
            if (result.msg.indexOf('失败') > -1) {
              this.$alert(result.msg, '提示', {
                dangerouslyUseHTMLString: true
              })
            } else {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: result.msg,
                type: 'success'
              })
            }
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(() => {
          this.closeLoading()
        })
      } else {
        this.$message.warning('请选择要复制的数据')
      }
    },
    copyTemp () {
      let rows = this.getSelections()
      if (rows.length > 0) {
        this.dialogVisible = true
      } else {
        this.$message.warning('请选择要复制的数据')
      }
    },
    editRow () {
      let rows = this.getSelections()
      if (rows.length > 0) {
        let row = rows[0]
        this.formData = JSON.parse(JSON.stringify(row))
        this.cardShow = true
        this.editStatus = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要编辑的数据',
          type: 'warning'
        })
      }
    },
    cancelEdit () {
      this.editStatus = false
      this.cardShow = false
    },
    saveTemp () {
      this.$refs.formRef.validate((valid) => {
        if (valid && this.checkBeforeSave(this.formData)) {
          const saveData = Object.assign({}, this.formData)
          saveData.children = this.formData.children
          this.showLoading('保存中...')
          this.$api.BasicSettingApi.VoucherTemplate.saveTemp(saveData).then(result => {
            this.closeLoading()
            if (result.success) {
              this.successMsg(result.msg)
              this.cardShow = false
              this.editStatus = false
              this.fetchData()
            } else {
              this.errorMsg(result.msg)
            }
          }).catch(() => {
            this.closeLoading()
          })
        }
      })
    },
    checkBeforeSave (temp) {
      if (!temp.children || temp.children.length < 2) {
        this.errorMsg('表体最少含有两条数据')
        return false
      }
      // 贷方分录合计
      let creditCount = 0
      // 借方
      let debitCount = 0
      temp.children.forEach(row => row.fx === 1 ? creditCount++ : debitCount++)
      if (creditCount === 0 || debitCount === 0) {
        this.errorMsg('分录不能在同一方向')
        return false
      }
      return true
    },
    addCardRow () {
      let row = {}
      this.formData.children.push(row)
      this.$nextTick(() => {
        this.$refs.addChildTable.toggleRowSelection(row)
      })
    },
    delCardRow () {
      if (this.cardSelectedRows) {
        this.cardSelectedRows.forEach(selectedRow => {
          const index = this.formData.children.findIndex(child => child === selectedRow)
          this.formData.children.splice(index, 1)
        })
      }
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>
