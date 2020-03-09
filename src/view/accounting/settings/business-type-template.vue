<template>
  <div class="app-main">
    <div class="kj-container" v-show="!cardShow">
      <div class="kj-head">
        <div class="query-info">
          <el-input placeholder="请输入业务类型编码或名称"
            v-model = "searchField"
            @change="filterByText">
          </el-input>
        </div>
        <div class="kj-button-group">
          <el-button @click="addTemp">新增</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delTemp">删除</el-button>
          <el-button @click="refresh">刷新</el-button>
          <el-button @click="showTemp">卡片显示</el-button>
          <el-button @click="impDialog">导入</el-button>
          <el-button @click="copy">复制新增</el-button>
          <el-button @click="copyTemp">复制到其它公司</el-button>

        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
            <el-table
              ref="multipleTable"
              :data="sortedData"
              highlight-current-row
              @current-change="handleListRowSelect"
              @selection-change="handleListRowSelection"
              @row-click="handleRowChange"
              v-loading="loading"
              :element-loading-text="loadingText"
              :element-loading-spinner="loadingSpinner"
              stripe
              border
              height="50%"
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
                property="busitempcode"
                label="业务类型编码"
                header-align="center"
                show-overflow-tooltip
                width="120">
              </el-table-column>
              <el-table-column
                property="busitempname"
                label="业务类型名称"
                header-align="center"
                show-overflow-tooltip
                width="120">
              </el-table-column>
              <el-table-column
                property="vspstylename"
                label="票据类型"
                header-align="center"
                show-overflow-tooltip
                width="130">
              </el-table-column>
              <el-table-column
                property="szstylename"
                label="结算方式"
                header-align="center"
                show-overflow-tooltip
                width="100">
              </el-table-column>
              <el-table-column
                property="tradename"
                label="行业"
                header-align="center"
                show-overflow-tooltip
                width="130">
              </el-table-column>
              <el-table-column
                property="keywords"
                label="关键字"
                header-align="center"
                show-overflow-tooltip
                width="150">
              </el-table-column>
              <el-table-column
                property="isdefault"
                label="是否常用"
                align="center"
                show-overflow-tooltip
                width="130">
                <template #default="scope">
                  <el-checkbox :disabled="true" :checked="scope.row.isdefault === '是'"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                property="vnote"
                label="备注"
                show-overflow-tooltip
                header-align="center"
                width="130">
              </el-table-column>
            </el-table>
            <el-table
              :data="tableData2"
              highlight-current-row
              stripe
              height="50%"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                property="zy"
                label="摘要"
                show-overflow-tooltip
                header-align="center"
                width="130">
              </el-table-column>
              <el-table-column
                property="kmbm"
                label="科目编码"
                show-overflow-tooltip
                header-align="center"
                width="130">
              </el-table-column>
              <el-table-column
                property="kmmc"
                label="科目名称"
                show-overflow-tooltip
                header-align="center"
                width="130">
              </el-table-column>
              <el-table-column
                property="direction"
                label="方向"
                show-overflow-tooltip
                header-align="center"
                width="100">
                <template #default="scope">
                  {{ scope.row.direction === 1 ? '贷方' : '借方' }}
                </template>
              </el-table-column>
              <el-table-column
                property="vfield"
                label="取数字段"
                show-overflow-tooltip
                header-align="center"
                width="200">
                <template #default="scope">
                  {{ formatterQs(scope.row.vfield) }}
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
                      @pagination="fetchData"></Pagination>
        </div>
      </div>
    </div>
    <div class="kj-container kj-card" v-show="cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button v-if="!editStatus" @click="addTemp">新增</el-button>
          <el-button v-if="!editStatus" @click="editStatus = true">修改</el-button>
          <el-button v-if="!editStatus" @click="delTemp">删除</el-button>
          <el-button v-if="!editStatus" @click="cardShow = false">列表显示</el-button>
          <el-button v-if="editStatus" @click="cancelEdit">取消</el-button>
          <el-button v-if="editStatus" @click="saveTemp">保存</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-form
          :inline="true"
          :model="formData"
          :rules="rules"
          ref="formRef" size="mini" label-width="150px">
          <el-row >
            <el-col :span="8">
              <el-form-item label="业务类型编码" prop="busitempcode" :rules="rules.busitempcode">
                <el-input ref="busitempcode_attr" :disabled="!editStatus" v-model="formData.busitempcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务类型名称" prop="busitempname" :rules="rules.busitempname">
                <el-input :disabled="!editStatus" v-model.trim="formData.busitempname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="票据类型" prop="vspstylename">
                <el-select :disabled="!editStatus" @change="onvspstyleChange" v-model="formData.vspstylename" filterable placeholder="请选择" style="width: 178px">
                  <el-option
                    v-for="item in vspstylenames"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="8">
              <el-form-item label="结算方式" prop="szstylename">
                <el-select :disabled="!editStatus" @change="onSzstyleChange" v-model="formData.szstylename" filterable placeholder="请选择" style="width: 178px">
                  <el-option
                    v-for="item in szstylenames"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关键字" prop="keywords" :rules="rules.keywords">
                <el-input :disabled="!editStatus" v-model="formData.keywords"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="行业" prop="tradename">
                <el-select  @change="onTradeChange" :disabled="!editStatus" v-model="formData.tradename" filterable placeholder="请选择" style="width: 178px">
                  <el-option
                    v-for="item in tradenames"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                    <span style="float:left">{{ item.code }} / {{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="8">
              <el-form-item label="是否常用" prop="isdefault">
                <el-checkbox :disabled="!editStatus" true-label ="是" false-label = "否" v-model="formData.isdefault"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="vnote" :rules="rules.mbms">
                <el-input :disabled="!editStatus" v-model="formData.vnote"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="card-table-head">
            <div class="kj-button-group">
              <el-button :disabled="!editStatus" @click="addCardRow">增行</el-button>
              <el-button :disabled="!editStatus" @click="delCardRow">删行</el-button>
            </div>
          </div>
          <el-table
            :data="formData.children"
            ref="refTable"
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
              property="des"
              label="摘要"
              header-align="center"
              width="130">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.zy'" :rules="rules.summary">
                  <el-input :disabled="!editStatus" v-model.trim="scope.row.zy"></el-input>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              property="kmbm"
              label="科目编码"
              header-align="center"
              width="130">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.kmbm'" >
                  <el-input :disabled="true" v-model.trim="scope.row.kmbm"></el-input>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              property="kmmc"
              label="科目"
              header-align="center"
              width="200">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.pk_accsubj'" :rules="rules.kmid">
                  <el-select
                    :disabled="!editStatus"
                    @change="onSubjectChange($event, scope.$index)"
                    filterable
                    v-model="scope.row.pk_accsubj"
                    style="width: 100%">
                    <el-option
                      v-for="subj in subjectRef"
                      :key="subj.id"
                      :label="subj.kmmc"
                      :value="subj.id">
                      <span>{{ subj.kmbm + '_' + subj.kmmc }}</span>
                    </el-option>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              property="direction"
              label="方向"
              header-align="center"
              width="120">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.direction'" :rules="rules.fx">
                  <el-select
                    :disabled="!editStatus"
                    v-model="scope.row.direction"
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
              property="vfield"
              label="取数字段"
              header-align="center"
              width="120">
              <template #default="scope">
                <TableFormItem label="" :prop="'children.'+scope.$index+'.vfield'">
                  <el-select
                    :disabled="!editStatus"
                    v-model="scope.row.vfield"
                    style="width: 100%">
                    <el-option
                      v-for="vfield in vfields"
                      :key="vfield.id"
                      :label="vfield.text"
                      :value="vfield.id">
                    </el-option>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
    <CorpDialog :visible.sync="corpDialogVisible"
                @selected="handleCorpSelect"></CorpDialog>
    <UploaderDialog
      :visible.sync="dialogImpFormVisible"
      name="impfile"
      title="导入业务类型模板"
      @submit="importExcel"
      :param="uploadParam">
      <template #description>
        <div class="import-description">支持标准模板导入,没有导入模板<a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
      </template>
    </UploaderDialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import TableFormItem from '@/components/TableFormItem'
import CorpDialog from '@/components/reference/CorpDialog'
import UploaderDialog from '@/components/UploaderDialog'
import loadingMixin from '@/mixins/loading'
import { orderBy } from 'natural-orderby'
import { DIRECTIONS } from '@/constants'
import {closeTag} from '@/utils'

export default {
  name: 'business-type-template',
  props: {
    routerParam: {
      type: Object
    }
  },
  components: {
    Pagination,
    TableFormItem,
    CorpDialog,
    UploaderDialog
  },
  mixins: [loadingMixin],
  data () {
    return {
      cardShow: false,
      editStatus: false,
      pageInfo: {
        page: 1,
        rows: 10
      },
      total: 0,
      tableData: [],
      tableData2: [],
      storeData: [],
      corpDialogVisible: false,
      dialogImpFormVisible: false,
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      formData: {},
      directions: DIRECTIONS,
      searchField: '',
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
      tradenames: [],
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
        vspstylename: [
          { required: true, message: '请选择业务类型', trigger: 'blur' }
        ],
        szstylename: [
          { required: true, message: '请选择业务类型', trigger: 'blur' }
        ],
        mbms: [
          { min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '请选择业务类型', trigger: 'blur' },
          { min: 0, max: 300, message: '长度在 0 到 300 个字符', trigger: 'blur' }
        ],
        kmid: [
          { required: true, message: '科目不能为空', trigger: 'change' }
        ],
        fx: [
          { required: true, message: '方向不能为空', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '摘要不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
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
    uploadParam () {
      return {
        a: 'a'
      }
    }

  },
  mounted () {
    if (this.$route.query.action !== undefined) {
      this.addTemp()
    }
  },
  created () {
    this.tradenamesRef()
    this.fetchData()
  },
  watch: {
    cardShow (newValue) {
      if (!newValue) {
        // 切到列表界面时，清空表单
        this.$refs.formRef.resetFields()
      }
    },
    routerParam: {
      handler (data) {
        if (data) {
          this.addTemp()
        }
      },
      immediate: true
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.BusinessTypeTemplate.queryTemp({
        ...this.pageInfo
      }).then(result => {
        this.loading = false
        if (result.rows) {
          this.tableData = result.rows
          this.storeData = this.tableData
          this.total = result.rows.length
          this.tableData2 = []
        }
      }).catch(e => {
        this.loading = false
      })
    },
    tradenamesRef () {
      this.$api.BasicSettingApi.BusinessTypeTemplate.queryHYRef({
        name: 'Z',
        ...this.pageInfo
      }).then(result => {
        this.tradenames = result.rows
      }).catch(e => {
        this.tradenames = []
      })
    },
    refresh () {
      this.fetchData()
    },
    handleRowChange (row, event, column) {
      let refsElTable = this.$refs.multipleTable // 获取表格对象
      refsElTable.toggleRowSelection(row)

      //判断下
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
          let value = this.listSelectedRows[this.listSelectedRows.length - 1];
          this.queryB(value.pk_model_h)
      } else {
          this.tableData2 = []
      }

    },
    queryB (value) {
      this.$api.BasicSettingApi.BusinessTypeTemplate.queryB({
        pk_model_h: value
      }).then(result => {
        if (result.rows) {
          this.tableData2 = result.rows
        }
      }).catch(e => {
      })
    },
    filterByText (value) {
      if (this.storeData) {
        let filter = []
        for (let i = 0; i < this.storeData.length; i++) {
          let row = this.storeData[i]
          value = value.toUpperCase()
          // eslint-disable-next-line no-mixed-operators
          if (row.busitempname && row.busitempname.toUpperCase().indexOf(value) >= 0 ||
          // eslint-disable-next-line no-mixed-operators
                    row.busitempcode && row.busitempcode.toUpperCase().indexOf(value) >= 0) {
            filter.push(row)
          }
        }
        this.tableData = filter
      }
    },
    expExcel () {
      this.$api.BasicSettingApi.BusinessTypeTemplate.expExcel()
    },
    impDialog () {
      this.dialogImpFormVisible = true
    },

    importExcel (formData) {
      this.showLoading()
      this.$api.BasicSettingApi.BusinessTypeTemplate.importB(
        formData
      ).then(res => {
        this.closeLoading()
        if (res.success) {
          this.dialogImpFormVisible = false
          this.successMsg(res.msg)
          this.refresh()
        } else {
          this.errorMsg(res.msg)
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    copy () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        if (this.listSelectedRows.length != 1) {
          this.errorMsg('请选择一条要展示的数据')
          return
        }

        this.formData = JSON.parse(JSON.stringify(this.listSelectedRows[0]))
        this.cardShow = true
        this.editStatus = true
        this.formData.pk_model_h = ''
        this.formData.primaryKey = ''
        let datas = this.tableData2
        for (let i = 0; i < datas.length; i++) {
          datas[i].pk_model_h = ''
          datas[i].pk_model_b = ''
          datas[i].primaryKey = ''
        }
        this.formData.children = datas
      } else {
        this.errorMsg('请选择要展示的数据')
      }
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val

      if (val && val.length > 0) {
        this.queryB(val[val.length - 1].pk_model_h)
      } else {
        this.tableData2 = []
      }
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    onvspstyleChange (val) {
      if (val) {
        const rs = this.vspstylenames.find(obj => obj.value == val)
        if (rs) {
          this.formData.vspstylecode = rs.lable
        }
      }
    },
    onSzstyleChange (val) {
      if (val) {
        const rs = this.szstylenames.find(obj => obj.value == val)
        if (rs) {
          this.formData.szstylecode = rs.lable
        }
      }
    },
    onSubjectChange (subjId, index) {
      if (subjId) {
        const subj = this.subjectRef.find(subj => subj.id === subjId)
        if (subj) {
          this.formData.children[index].kmbm = subj.kmbm
        }
      }
    },
    onTradeChange (id) {
      if (id) {
        const trade = this.tradenames.find(trade => trade.name === id)
        if (trade) {
          this.formData.pk_trade = trade.id
        }
      }
    },
    addTemp () {
      this.formData = {
        children: [{}, {}]
      }
      this.formData.isdefault = '是'
      this.cardShow = true
      this.editStatus = true

      // 定位到第一项
      this.$nextTick(() => {
        this.$refs.busitempcode_attr.focus()
        let refsElTable = this.$refs.refTable // 获取表格对象
        refsElTable.toggleRowSelection(this.formData.children[0])
        refsElTable.toggleRowSelection(this.formData.children[1])
      })
    },
    showTemp () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        if (this.listSelectedRows.length != 1) {
          this.errorMsg('请选择一条要展示的数据')
          return
        }
        this.formData = JSON.parse(JSON.stringify(this.listSelectedRows[0]))
        this.formData.children = this.tableData2
        this.editStatus = false
        this.cardShow = true
      } else {
        this.errorMsg('请选择要展示的数据')
      }
    },
    delTemp () {
      let ids = ''
      let tips = ''
      if (this.cardShow) {
        tips = '确定要删除当前模板？'
        ids = this.formData.pk_model_h
      } else {
        if (this.listSelectedRows && this.listSelectedRows.length > 0) {
          tips = '确定要删除选中的模板？'
          ids = this.listSelectedRows.reduce((id, row) => id + ',' + row.pk_model_h, '')
          ids = ids.substring(1)
        } else {
          this.errorMsg('请选择要删除的数据')
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
        this.$api.BasicSettingApi.BusinessTypeTemplate.deleteTemp({
          pk_model_h: ids
        }).then(result => {
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
    handleCorpSelect (selectedCorps) {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        let tmps = this.listSelectedRows.reduce((id, row) => id + ',' + row.pk_model_h, '')
        tmps = tmps.substring(1)
        let corps = selectedCorps.reduce((id, corp) => id + ',' + corp.pk_gs, '')
        corps = corps.substring(1)
        this.$api.BasicSettingApi.BusinessTypeTemplate.copyTemp({
          parentid: tmps,
          corps: corps
        }).then(result => {
          if (result.success) {
            if (result.msg.indexOf('失败') > -1) {
              this.$alert(result.msg, '提示', {
                dangerouslyUseHTMLString: true
              })
            } else {
              this.successMsg(result.msg)
            }
          } else {
            this.errorMsg(result.msg)
          }
        })
      } else {
        this.errorMsg('请选择要复制的数据')
      }
    },
    copyTemp () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.corpDialogVisible = true
      } else {
        this.errorMsg('请选择要复制的数据')
      }
    },
    editRow () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        if (this.listSelectedRows.length != 1) {
          this.errorMsg('请选择一条要展示的数据')
          return
        }

        this.formData = JSON.parse(JSON.stringify(this.listSelectedRows[0]))
        this.formData.children = this.tableData2
        this.cardShow = true
        this.editStatus = true

        // let refsElTable = this.$refs.refTable // 获取表格对象
        // this.$nextTick(() =>{
        //     this.formData.children.reduce((temp,row) =>{
        //         refsElTable.toggleRowSelection(row, true)
        //     }, '')
        // })
      } else {
        this.errorMsg('请选择要一条编辑的数据')
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
          let head = JSON.stringify(saveHead)
          let body = this.formData.children.reduce((rs, row) => rs + JSON.stringify(row), '')
          this.$api.BasicSettingApi.BusinessTypeTemplate.saveTemp({
            head,
            body
          }).then(result => {
            if (result.success) {
              this.successMsg(result.msg)
              this.editStatus = false
              this.formData = result.head
              this.formData.children = result.childs.rows
              // 更新数据
              this.afterUpdateLinkData()

              this.fetchData()
            } else {
              this.errorMsg(result.msg)
            }
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
      temp.children.forEach(row => row.direction === 1 ? creditCount++ : debitCount++)
      if (creditCount === 0 || debitCount === 0) {
        this.errorMsg('分录不能在同一方向')
        return false
      }
      return true
    },
    afterUpdateLinkData () {
      if (this.routerParam) {
        this.$bus.$emit('updateBusiInfo', this.formData)
        this.$nextTick(() => {
          closeTag(this.$route)
        })
      }
    },
    addCardRow () {
      this.formData.children.push({})

      let refsElTable = this.$refs.refTable // 获取表格对象
      refsElTable.toggleRowSelection(this.formData.children[this.formData.children.length - 1])
    },
    delCardRow () {
      if (this.cardSelectedRows) {
        this.cardSelectedRows.forEach(selectedRow => {
          const index = this.formData.children.findIndex(child => child === selectedRow)
          this.formData.children.splice(index, 1)
        })
      }
    },
    formatterQs (qs) {
      if (qs === 'totalmny') {
        return '总金额'
      } else if (qs === 'mny') {
        return '金额'
      } else if (qs === 'wsmny') {
        return '无税金额'
      } else if (qs === 'smny') {
        return '税额'
      } else if (qs === 'yjmny') {
        return '预借差旅金额'
      } else if (qs === 'blmny') {
        return '补领金额'
      } else if (qs === 'thmny') {
        return '退还金额'
      } else if (qs === 'sbmny') {
        return '扣社保'
      } else if (qs === 'gsmny') {
        return '扣个税'
      } else if (qs === 'sfmny') {
        return '实发工资'
      } else if (qs === 'hsmny') {
        return '含税金额'
      }

      return ''
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'error'
      })
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
