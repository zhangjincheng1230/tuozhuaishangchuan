<template>
  <div class="app-main">
    <div class="kj-container" v-show="!cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="addTemp">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delTemp">删除</el-button>
          <el-button @click="refresh">刷新</el-button>
          <el-button @click="showTemp">卡片显示</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container" style="height: 50%">
          <el-table
            :data="sortedData"
            highlight-current-row
            @current-change="handleListRowSelect"
            element-loading-text="数据加载中，请稍候..."
            element-loading-spinner="el-icon-loading"
            stripe
            border
            height="100%"
            style="width: 100%">
            <el-table-column
              property="zrkmmc"
              label="转入科目名称"
              show-overflow-tooltip
              header-align="center"
              width="130">
            </el-table-column>
            <el-table-column
              property="zrkmbm"
              label="转入科目编码"
              show-overflow-tooltip
              header-align="center"
              width="130">
            </el-table-column>
            <el-table-column
              property="zy"
              label="摘要"
              show-overflow-tooltip
              header-align="center"
              width="130">
            </el-table-column>
            <el-table-column
              property="bz"
              label="备注"
              show-overflow-tooltip
              header-align="center"
              width="175">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-container">
          <el-table border :data="childrens">
            <el-table-column
              property="kmmc"
              label="科目名称"
              show-overflow-tooltip
              header-align="center"
              width="130">
            </el-table-column>
            <el-table-column
              property="dir"
              label="方向"
              header-align="center"
              :formatter="formatter"
              width="130">
            </el-table-column>
            <el-table-column
              property="zys"
              label="摘要"
              show-overflow-tooltip
              header-align="center"
              width="130">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination" style="display: none">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                      @pagination="fetchData"></Pagination>
        </div>
      </div>
    </div>
    <div class="kj-container kj-card" v-show="cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button v-if="!editStatus" @click="addTemp">新增</el-button>
          <el-button v-if="!editStatus" @click="cardEdit">修改</el-button>
          <el-button v-if="!editStatus" @click="delTemp">删除</el-button>
          <el-button v-if="editStatus" @click="saveTemp">保存</el-button>
          <el-button v-if="!editStatus" @click="cardShow = false">列表显示</el-button>
          <el-button v-if="editStatus" @click="cancelEdit">取消</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-form
          :inline="true"
          :model="formData"
          :rules="rules"
          ref="formRef">
          <el-form-item label="转入科目：" prop="zrkmid" :rules="rules.zrkmid">
            <el-select :disabled="!editStatus" v-if="isEdit" v-model="formData.zrkmid" @change="changKm" filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="subj in subjectRef"
                :key="subj.id"
                :label="subj.kmbm + '_' + subj.kmmc"
                :value="subj.id">
              </el-option>
            </el-select>
            <span v-else>
              <el-input :disabled="true" v-model="formData.zrkmmc"></el-input>
            </span>
          </el-form-item>
          <el-form-item label="科目编码" prop="zrkmbm">
            <el-input :disabled="true" v-model="formData.zrkmbm"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="zy" :rules="rules.zy">
            <el-input :disabled="!editStatus" v-model="formData.zy"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="bz" :rules="rules.bz">
            <el-input :disabled="!editStatus" v-model="formData.bz"></el-input>
          </el-form-item>
          <div class="card-table-head">
            <div class="kj-button-group">
              <el-button :disabled="!editStatus" @click="addCardRow">增行</el-button>
              <el-button :disabled="!editStatus" @click="delCardRow">删行</el-button>
            </div>
          </div>
          <el-table
            ref="addChildTable"
            :data="formData.children"
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
                <TableFormItem v-if="isEdit" label="" :prop="'children.'+scope.$index+'.accid'" :rules="rules.kmid">
                  <el-select
                    :disabled="!editStatus"
                    @change="onSubjectChange"
                    filterable
                    v-model="scope.row.accid"
                    style="width: 100%">
                    <el-option
                      v-for="subj in subjectRef"
                      :key="subj.id"
                      :label="subj.kmbm + '_' + subj.kmmc"
                      :value="subj.id">
                    </el-option>
                  </el-select>
                </TableFormItem>
                <span v-else>
                  {{scope.row.kmmc}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              property="dir"
              label="方向"
              header-align="center"
              width="120">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.dir'" :rules="rules.dir">
                  <el-select
                    :disabled="!editStatus"
                    v-model="scope.row.dir"
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
              property="zys"
              label="摘要"
              header-align="center"
              width="130">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.zys'" :rules="rules.zys">
                  <el-input :disabled="!editStatus" v-model.trim="scope.row.zys"></el-input>
                </TableFormItem>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import TableFormItem from '@/components/TableFormItem'
import { orderBy } from 'natural-orderby'
import { DIRECTIONS } from '@/constants'

export default {
  name: 'profit-loss-carryover-template',
  components: {
    Pagination,
    TableFormItem
  },
  data () {
    return {
      loading: true,
      cardShow: false,
      editStatus: false,
      childrens: [],
      pageInfo: {
        page: 1,
        rows: 10
      },
      total: 0,
      tableData: [],
      storeData: [],
      dialogVisible: false,
      listCurrentRow: null,
      cardSelectedRows: null,
      formData: {},
      directions: DIRECTIONS,
      vspstylenames: [
        {lable: '01', value: '增值税专用发票'},
        {lable: '02', value: '增值税普通发票'},
        {lable: '20', value: '银行收付款回单'},
        {lable: '21', value: '其他票据'}
      ],
      szstylenames: [
        {lable: '01', value: '现金收入'},
        {lable: '02', value: '现金支出'},
        {lable: '03', value: '银行收入'},
        {lable: '04', value: '银行支出'},
        {lable: '05', value: '其他收入'},
        {lable: '06', value: '其他支出'}
      ],
      vfields: [
        {id: 'totalmny', text: '总金额'},
        {id: 'mny', text: '金额'},
        {id: 'wsmny', text: '无税金额'},
        {id: 'smny', text: '税额'},
        {id: 'hsmny', text: '含税金额'}
      ],
      rules: {
        busitempcode: [
          { required: true, message: '请输入模板编码', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        busitempname: [
          { required: true, message: '请输入模板名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        bz: [
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
        ],
        zy: [
          { required: true, message: '摘要不能为空', trigger: 'change' },
          { min: 0, max: 300, message: '长度在 0 到 300 个字符', trigger: 'blur' }
        ],
        zys: [
          { required: true, message: '摘要不能为空', trigger: 'change' },
          { min: 0, max: 300, message: '长度在 0 到 300 个字符', trigger: 'blur' }
        ],
        kmid: [
          { required: true, message: '科目不能为空', trigger: 'change' }
        ],
        dir: [
          { required: true, message: '方向不能为空', trigger: 'change' }
        ],
        zrkmid: [
          { required: true, message: '转入科目不能为空', trigger: 'blur' }
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
    },
    isEdit () {
      return !(this.formData.cpid && this.formData.cpid === '000001')
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
    changKm (val) {
      this.formData.zrkmbm = this.subjectRef.find(v => v.id === val).kmbm
    },
    cardEdit () {
      if (this.listCurrentRow.cpid && this.listCurrentRow.cpid === '000001') {
        this.$message({
          showClose: true,
          message: '预置数据不可修改',
          type: 'warning'
        })
        return
      }
      this.editStatus = true
    },
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.TransferTemplate.queryQjsyTemplate().then(result => {
        this.loading = false
        if (result.rows) {
          this.tableData = result.rows
          this.storeData = this.tableData
          this.total = result.rows.length
          // 清空子表
          this.childrens = []
        }
      }).catch(e => {
        this.loading = false
      })
    },
    refresh () {
      this.fetchData()
    },
    formatter (row, column, cellValue) {
      return cellValue === 0 ? '借方' : '贷方'
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
      this.childrens = val.children
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    onSubjectChange (subjId) {
      if (subjId) {
        const subj = this.subjectRef.find(subj => subj.id === subjId)
        if (subj) {
          this.formData.kmbm = subj.kmbm
        }
      }
    },
    addTemp () {
      this.formData = {
        children: [{}, {}]
      }
      this.cardShow = true
      this.editStatus = true
      this.$nextTick(() => {
        this.formData.children.forEach(child => {
          this.$refs.addChildTable.toggleRowSelection(child)
        })
      })
    },
    showTemp () {
      if (this.listCurrentRow) {
        this.formData = JSON.parse(JSON.stringify(this.listCurrentRow))
        console.log('this.formData------------------>', this.formData)
        this.cardShow = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要展示的数据',
          type: 'warning'
        })
      }
    },
    delTemp () {
      if (this.listCurrentRow.cpid && this.listCurrentRow.cpid === '000001') {
        this.$message({
          showClose: true,
          message: '预置数据不可删除',
          type: 'warning'
        })
        return
      }
      let tips = ''
      let data
      if (this.cardShow) {
        tips = '确定要删除当前模板？'
        data = this.formData
      } else {
        if (this.listCurrentRow) {
          tips = '确定要删除选中的模板？'
          data = this.listCurrentRow
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
        this.$api.BasicSettingApi.TransferTemplate.deleteQjsyTemplate({mainid: data.mainid}).then(result => {
          if (result.success) {
            this.successMsg('删除成功!')
            this.cardShow = false
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        })
      })
    },
    editRow () {
      if (this.listCurrentRow) {
        if (this.listCurrentRow.cpid && this.listCurrentRow.cpid === '000001') {
          this.$message({
            showClose: true,
            message: '预置数据不可修改',
            type: 'warning'
          })
          return
        }
        this.formData = JSON.parse(JSON.stringify(this.listCurrentRow))
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
          const saveHead = Object.assign({}, this.formData)
          delete saveHead.children
          let body = this.formData.children
          saveHead.zrkmmc = this.subjectRef.find(v => v.id === saveHead.zrkmid).kmmc
          body = body.map(v => {
            v.kmmc = this.subjectRef.find(t => t.id === v.accid).codename
            return v
          })
          this.$api.BasicSettingApi.TransferTemplate.saveQjsyTemplate({headvo: saveHead, bodyvos: body}).then(result => {
            if (result.success) {
              this.successMsg(result.msg)
              this.cardShow = false
              this.editStatus = false
              this.fetchData()
            } else {
              this.errorMsg(result.msg)
            }
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    checkBeforeSave (temp) {
      if (!temp.children || temp.children.length < 1) {
        this.errorMsg('表体最少含有一条数据')
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
