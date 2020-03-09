<template>
  <div style="position: relative">
    <el-dialog class="businessType" title="业务类型" :visible.sync="dialogBusiType" width="500px"
               :close-on-click-modal="false"
               @close="colseCreate">
      <el-form
        ref="tableForm"
        @submit.native.prevent
        :inline="true">
        <el-row style="margin: 0 20px 5px">
          <el-input v-model="typeName"  placeholder="输入业务类型名称按Enter键查询" @change="selectInfo"></el-input>
        </el-row>
        <el-row>
          <el-table
            :data="tableList"
            ref="jxfpTableRef"
            highlight-current-row
            @current-change="tableCurrentChange"
            stripe
            :header-cell-style="headerCellStyle"
            :height="height"
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              lable=""
              width="50">
            </el-table-column>
            <el-table-column
              v-if="!isold"
              prop="categoryname"
              header-align="center"
              align="left"
              show-overflow-tooltip
              min-width="180"
              label="业务类型名称">
            </el-table-column>
            <el-table-column
              v-if="isold"
              prop="businame"
              header-align="center"
              align="left"
              show-overflow-tooltip
              min-width="180"
              label="业务类型名称">
            </el-table-column>
            <el-table-column
              label="结算方式"
              width="200"
              align="left"
              header-align="center">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.radio" @change="radioChange(scope.$index, scope.row)">
                  <el-radio v-if="!isold || scope.row.showvalue.indexOf('06') !== -1 || scope.row.showvalue.indexOf('05') !== -1" style="margin-right: 10px" label="0">往来</el-radio>
                  <el-radio v-if="!isold || scope.row.showvalue.indexOf('02') !== -1|| scope.row.showvalue.indexOf('01') !== -1" style="margin-right: 10px" label="1">现金</el-radio>
                  <el-radio v-if="!isold || scope.row.showvalue.indexOf('03') !== -1|| scope.row.showvalue.indexOf('04') !== -1" style="margin-right: 0" label="2">银行</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="colseCreate">取 消</el-button>
        <el-button type="primary" @click="querySelect">确 定</el-button>
        <el-button v-if="isold" type="primary" @click="AddBusiType">新增业务类型</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="isShowAdd" class="addBusi" title="业务类型模板" :visible.sync="dialogAddBusi" width="1100px"
               :close-on-click-modal="false"
               @close="closeAddTemp">
      <div class="kj-container kj-card">
        <div class="kj-head">
          <div class="kj-button-group">
            <el-button @click="closeAddTemp">取消</el-button>
            <el-button @click="saveTemp">保存</el-button>
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
                  <el-input ref="busitempcode_attr" v-model="formData.busitempcode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务类型名称" prop="busitempname" :rules="rules.busitempname">
                  <el-input v-model.trim="formData.busitempname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="票据类型" prop="vspstylename">
                  <el-select  @change="onvspstyleChange" v-model="formData.vspstylename" filterable placeholder="请选择" style="width: 178px">
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
                  <el-select @change="onSzstyleChange" v-model="formData.szstylename" filterable placeholder="请选择" style="width: 178px">
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
                  <el-input v-model="formData.keywords"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="行业" prop="tradename">
                  <el-select  @change="onTradeChange" v-model="formData.tradename" filterable placeholder="请选择" style="width: 178px">
                    <el-option
                      v-for="item in tradenames"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="8">
                <el-form-item label="是否常用" prop="isdefault" style="margin-bottom: 0">
                  <el-checkbox true-label ="是" false-label = "否" v-model="formData.isdefault"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注" prop="vnote" :rules="rules.mbms" style="margin-bottom: 0">
                  <el-input v-model="formData.vnote"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="card-table-head">
              <div class="kj-button-group">
                <el-button @click="addCardRow">增行</el-button>
                <el-button @click="delCardRow">删行</el-button>
              </div>
            </div>
            <el-table
              :data="formData.children"
              ref="refTable"
              @selection-change="handleCardRowSelection"
              class="edit-table"
              height="300"
              style="width: 100%;margin-bottom: 10px">
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
                    <el-input v-model.trim="scope.row.zy"></el-input>
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
    </el-dialog>
  </div>
</template>

<script>
import { DIRECTIONS } from '@/constants'
import * as MsgUtil from '../msg-util'
export default {
  name: 'BusinessType',
  props: ['busiTypeList'],
  data () {
    return {
      dialogBusiType: true,
      dialogAddBusi: false,
      isShowAdd: false,
      loading: false,
      isold: false,
      isJx: true,
      height: 400,
      typeName: '',
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      pageInfo: {
        page: 1,
        rows: 10
      },
      directions: DIRECTIONS,
      formData: {},
      tableList: [],
      currentRow: '',
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
      },
      cardSelectedRows: null
    }
  },
  computed: {
    subjectRef () {
      return this.$store.getters.subSubjectRef
    }
  },
  methods: {
    selectInfo: function (val) {
      this.tableList = this.busiTypeList.filter(ev => {
        if (this.isold) {
          return ev.businame.indexOf(val) !== -1
        } else {
          return ev.categoryname.indexOf(val) !== -1
        }
      })
    },
    tableCurrentChange: function (row) {
      this.currentRow = row
    },
    radioChange: function (index, row) {
      this.tableList.splice(index, 1, row)
    },
    querySelect: function () {
      this.dialogIsShow()
    },
    AddBusiType: function () {
      // this.$router.push({name: 'common-settings', params: {routerParam: {seq: 6, action: 'add'}}})
      this.isShowAdd = true
      this.dialogAddBusi = true
      this.formData = {
        children: [{}, {}]
      }
      this.formData.isdefault = '是'
      this.tradenamesRef()
      // 定位到第一项
      this.$nextTick(() => {
        this.$refs.busitempcode_attr.focus()
        let refsElTable = this.$refs.refTable // 获取表格对象
        refsElTable.toggleRowSelection(this.formData.children[0])
        refsElTable.toggleRowSelection(this.formData.children[1])
      })
    },
    colseCreate: function () {
      this.dialogIsShow(1)
    },
    dialogIsShow: function (val) {
      let param = null
      if (val !== 1) {
        param = {
          CurrentBusiType: this.currentRow,
          isShowBusiType: false
        }
      } else {
        param = {
          isShowBusiType: false
        }
      }
      this.$emit('getBusiTypeData', param)
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
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
    closeAddTemp: function () {
      this.dialogAddBusi = false
      this.isShowAdd = false
    },
    saveTemp () {
      this.$refs.formRef.validate((valid) => {
        if (valid && this.checkBeforeSave(this.formData)) {
          const saveHead = Object.assign({}, this.formData)
          delete saveHead.children
          let head = JSON.stringify(saveHead)
          let body = this.formData.children.reduce((rs, row) => rs + JSON.stringify(row), '')
          let loading = MsgUtil.loading(this)
          this.$api.BasicSettingApi.BusinessTypeTemplate.saveTemp({
            head,
            body
          }).then(result => {
            loading.close()
            if (result.success) {
              MsgUtil.successMsg(this, result.msg)
              this.formData = result.head
              this.formData.children = result.childs.rows
              let indx = '0'
              if (this.isJx && (result.head.szstylecode === '06' || result.head.szstylecode === '04' || result.head.szstylecode === '02')) {
                indx = result.head.szstylecode === '04' ? '2' : result.head.szstylecode === '02' ? '1' : '0'
                this.tableList.splice(0, 0, {businame: result.head.busitempname, showvalue: result.head.szstylecode, radio: indx})
              }
              if (!this.isJx && (result.head.szstylecode === '05' || result.head.szstylecode === '03' || result.head.szstylecode === '01')) {
                indx = result.head.szstylecode === '03' ? '2' : result.head.szstylecode === '01' ? '1' : '0'
                this.tableList.splice(0, 0, {businame: result.head.busitempname, showvalue: result.head.szstylecode, radio: indx})
              }
              this.dialogAddBusi = false
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
          }).catch(e => {
            loading.close()
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
    onSubjectChange (subjId, index) {
      if (subjId) {
        const subj = this.subjectRef.find(subj => subj.id === subjId)
        if (subj) {
          this.formData.children[index].kmbm = subj.kmbm
        }
      }
    },
    onvspstyleChange (val) {
      if (val) {
        const rs = this.vspstylenames.find(obj => obj.value === val)
        if (rs) {
          this.formData.vspstylecode = rs.lable
        }
      }
    },
    onSzstyleChange (val) {
      if (val) {
        const rs = this.szstylenames.find(obj => obj.value === val)
        if (rs) {
          this.formData.szstylecode = rs.lable
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
    tradenamesRef () {
      this.$api.BasicSettingApi.BusinessTypeTemplate.queryHYRef({
        name: 'Z',
        ...this.pageInfo
      }).then(result => {
        this.tradenames = result.rows
      }).catch(e => {
        this.tradenames = []
      })
    }
  },
  mounted () {
    if (this.busiTypeList !== undefined && this.busiTypeList.length > 0) {
      this.busiTypeList.forEach(item => {
        if (item.radio === undefined) {
          item['radio'] = '0'
        }
        if (item.isold !== undefined) {
          this.isold = true
          if (item.showvalue !== undefined) {
            this.isJx = item.showvalue.indexOf('02') > 0 || item.showvalue.indexOf('04') > 0 || item.showvalue.indexOf('06') > 0
          }
          if (item.selectvalue === undefined) {
            if (item.showvalue === '03' || item.showvalue === '04') {
              item['radio'] = '2'
            } else if (item.showvalue === '02' || item.showvalue === '01') {
              item['radio'] = '1'
            } else {
              item['radio'] = '0'
            }
          } else {
            let strList = item.showvalue !== undefined ? item.showvalue.split(',') : ''
            if (strList !== '' && strList.length < 3) {
              strList.forEach(child => {
                if (child === '03' || child === '04') {
                  item['radio'] = '2'
                } else if (child === '02' || child === '01') {
                  item['radio'] = '1'
                } else {
                  item['radio'] = '0'
                }
              })
            }
          }
        }
      })
      this.tableList = this.busiTypeList
    } else if (this.busiTypeList.isold) {
      this.isold = true
    }
  }
}
</script>

<style lang="less">
  .businessType{
    /deep/ .el-dialog__body{
      padding: 0 !important;
    }
    /deep/ .el-radio__label{
    padding-left: 5px;
    }
  }
  .addBusi{
    /deep/ .el-dialog__body{
      padding: 0 !important;
    }
  }
</style>
