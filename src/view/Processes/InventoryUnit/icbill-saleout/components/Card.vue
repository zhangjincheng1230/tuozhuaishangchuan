<template>
  <div class="kj-container kj-card">
    <div class="kj-head">
      <div class="kj-button-group">
        <el-button  v-if="!disabled" @click="cancelEdit">取消</el-button>
        <el-button  v-if="!disabled" @click="saveForm('N')">保存</el-button>
<!--        <el-button  v-if="!disabled" @click="saveFormAuto">保存并生成凭证</el-button>-->
        <el-button  v-if="disabled"  icon="el-icon-caret-left" :disabled="disablePrevButton" @click="prevBill"></el-button>
        <el-button  v-if="disabled"  icon="el-icon-caret-right" :disabled="disableNextButton" @click="nextBill"></el-button>
        <el-button  v-if="disabled" @click="onBack">返回</el-button>
<!--        <el-button  v-if="disabled" @click="cancelEdit">上一页</el-button>-->
<!--        <el-button  v-if="disabled" @click="cancelEdit">下一页</el-button>-->
      </div>
    </div>
    <div class="kj-main">
      <el-form
        :inline="true"
        :model="headData"
        :rules="rules"
        ref="formRef"
        size="mini"
        label-width="80px">
        <el-row>
          <el-col :span="7">
            <el-form-item size="mini" prop="cbusitype"  label="出库类型">
              <el-select v-model="headData.cbusitype" filterable @change="typechange" :disabled="isEidt" style="width: 185px">
                <el-option  v-for="item in cbusitypedata" :key="item.label"  :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item size="mini" label="单据编号">
              <el-input v-model="headData.did" style="width: 185px;" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item size="mini" prop="ddate" label="单据日期">
              <el-date-picker type="date" v-model="headData.ddate" :editable="false" :clearable="false"
                              @change="dateChange" value-format="yyyy-MM-dd" :disabled="disabled" :picker-options="pickerOptions" style="width: 185px;"> </el-date-picker>
            </el-form-item>
            <el-form-item size="mini" prop="isback"  v-if="headData.cbusitype === '46' && headData.isback === 'true' ">
              <el-checkbox v-model="headData.isback" :disabled="true" style="margin-left: 50px">红字冲回</el-checkbox>
            </el-form-item>
            <el-form-item size="mini" prop="isjc"  v-if="headData.cbusitype === '47'">
              <el-checkbox v-model="headData.isjc"  @change="jcChecked"  :disabled="disabled" style="margin-left: 50px">显示结存数量</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="headData.cbusitype === '46'">
          <el-col :span="7">
            <el-form-item size="mini" prop="iway" label="付款方式">
              <el-select v-model="headData.iway"  @change="iwayChange" :disabled="disabled" style="width: 185px">
                <el-option label="现金" value="0"></el-option>
                <el-option label="往来" value="1"></el-option>
                <el-option label="银行" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item size="mini" prop="invid" label="发票号">
              <el-input v-model.trim="headData.invid" style="width: 185px;" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item size="mini" prop="invdate" label="发票日期">
              <el-date-picker type="date"  value-format="yyyy-MM-dd"  :editable="false" v-model="headData.invdate" clearable  style="width: 185px;" :disabled="disabled"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="headData.cbusitype === '46'">
          <el-col :span="7">
            <el-form-item size="mini" prop="yhzh" label="银行账户">
              <el-select v-model="headData.yhzh" style="width: 185px;"  clearable filterable :disabled="headData.iway !== '2' || disabled" >
                <el-option  v-for="item in bankAccount" :key="item.id" :label="item.bkcode +' / '+ item.bkname" :value="item.id">
                  <span  style="float: left">{{item.bkcode +' / '+ item.bkname}}</span>
                  <span  style="float: right" @click="editBank($event, item)">
                    <i class="el-icon-edit"></i>
                  </span>
                </el-option>
              </el-select>
              <i style="font-size:15px;color: #409EFF" class="el-icon-circle-plus" v-if="!disabled" @click="addBank()"></i>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item size="mini" prop="pk_cust" label="客户">
              <el-select   v-model="headData.pk_cust"
                           default-first-option placeholder="请选择" clearable filterable :disabled="disabled" style= "width:185px">
                <el-option v-for="item in gysData" :key="item.id" :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id" style= "width:185px">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item size="mini" prop="fp_style" label="发票类型">
              <el-select v-model="headData.fp_style" :disabled="disabled" style="width: 185px;">
                <el-option label="增值税专用发票" value="2"></el-option>
                <el-option label="增值税普通发票" value="1"></el-option>
                <el-option label="未开票" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="headData.cbusitype === '49'">
          <el-form-item size="mini" prop="memo" label="备注" >
            <el-input v-model="headData.memo"  :disabled="disabled" style="width: 185px;"></el-input>
          </el-form-item>
        </el-row>
          <el-button size="mini" style="margin: 5px 0 5px 10px" v-if="!disabled"  @click="addRow">增行</el-button>
          <el-button size="mini" class="close" type="type" v-if="!disabled" @click="removeRow">删行</el-button>
          <el-table
            :data="sortedData"
            class="edit-table"
            highlight-current-row
            @current-change="handleListRowSelect"
            @selection-change="handleListRowSelection"
            :row-class-name="tableRowClassName"
            @row-click="dblclickRow"
            stripe
            border
            :height="this.$parent.tableHeight"
            show-summary
            :summary-method="getSummaries"
            style="width: 100%"
            ref="addTableRef">
            <el-table-column type="selection" width="35" header-align ="left" align="center"> </el-table-column>
            <el-table-column prop="invcode" label="存货编码"  header-align ="center" align="left" width="80"> </el-table-column>
            <el-table-column prop="invname"  label="存货名称" header-align ="center" align="left" width="155" style="height: 50px">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.id_inventory'" :rules="rules.id_inventory">
                  <el-select  v-model="row.id_inventory"
                              default-first-option placeholder="请选择"  @change="chChange($index,row)" filterable :disabled="disabled" style= "width:155px">
                    <el-option v-for="item in invenData" :key="item.id" :label="item.spmc" :value="item.id" style="width:300px">
                      <span style="float: left;width:300px">{{ item.fullname }}</span>
                    </el-option>
                    <template slot="prefix">
                      <i @click.stop="openInv($index)" class="el-icon-search"></i>
                    </template>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column prop="invspec" label="规格(型号)" show-overflow-tooltip header-align ="center" align="left" width="100"> </el-table-column>
            <el-table-column prop="measure" label="计量单位" header-align ="center" align="left"  width="70"> </el-table-column>
            <el-table-column prop="num" label="数量" header-align ="center" align="right" width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.num'">
                  <el-input-number v-model="row.num" :precision="numPre" :controls =false @change="numChange($index,row)"  :min="-99999999" :max="999999999" :disabled=" headData.cbusitype === '49' || disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column v-if="headData.cbusitype === '46'" prop="price" label="销售单价" header-align ="center"  align="right" width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.price'">
                  <el-input-number v-model="row.price" :precision="pricePre" :controls =false @change="numChange($index,row)" :min="-99999999" :max="999999999" :disabled="disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column v-if="headData.cbusitype === '46'" prop="mny" label="销售金额" header-align ="center" align="right"  width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.mny'" :rules="rules.mny">
                  <el-input-number v-model="row.mny" :precision="2" :controls =false  @change="mnyChange($index,row)" :min="-99999999" :max="999999999" :disabled="disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column  v-if="headData.cbusitype === '46'" prop="ntax" header-align ="center" label="税率(%)" align="right" width="70">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.ntax'">
                  <el-input-number v-model="row.ntax" :precision="0" :controls =false  @change="taxChange($index,row)" :min="-99999999" :max="999999999" :disabled="disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column v-if="headData.cbusitype === '46'" prop="tmny" header-align ="center"   label="税额"  align="right" width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.tmny'">
                  <el-input-number v-model="row.tmny" :precision="2" :controls =false  @change="tmnyChange($index,row)"  :min="-99999999" :max="999999999" :disabled="disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column v-if="headData.cbusitype === '46'" prop="ttmny"  label="税价合计" header-align ="center" align="right" width="120"></el-table-column>
            <el-table-column  prop="vf1" header-align ="center"   label="成本单价"  align="right" width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.vf1'">
                  <el-input-number v-model="row.vf1" :precision="pricePre" :controls =false  @change="numChange($index,row)"  :min="-99999999" :max="999999999" :disabled=" headData.cbusitype == '46' ||  headData.cbusitype == '49' || disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column  prop="cost" header-align ="center"   label="成本金额"  align="right" width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'children.' + $index+'.cost'">
                  <el-input-number v-model="row.cost" :precision="2" :controls =false  @change="costChange($index,row)"  :min="-99999999" :max="999999999" :disabled=" headData.cbusitype !== '49' || disabled"></el-input-number>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column  prop="kmbm" label="科目编码" show-overflow-tooltip header-align ="center" align="center" width="100"> </el-table-column>
            <el-table-column prop="kmmc" label="科目名称" show-overflow-tooltip header-align ="center" align="left"  width="130">  </el-table-column>
            <el-table-column  prop="invclassname" label="存货分类" header-align ="center" align="left"  width="80"> </el-table-column>
          </el-table>
      </el-form>
    </div>
    <BankAccountDialog :visible.sync="bankFormVisible"  :account="formAccount" @save="onBankSaved"></BankAccountDialog>
    <InventoryDialog :visible.sync="dialogVisible" :queryData="queryData" select-first @selected="handleInvSelect"></InventoryDialog>
  </div>
</template>

<script>
import * as MsgUtil from '../../../msg-util'
import InventoryDialog from '@/components/reference/InventoryNumDialog'
import * as IcbillManageConst from '../../icbill-manage-const'
import BankAccountDialog from '../../../../accounting/settings/bank-account/components/BankAccountDialog'
import TableFormItem from '@/components/TableFormItem/index'
import { calculate } from '@/utils'
import refreshDataMixin from '@/mixins/refresh-data'
import loadingMixin from '@/mixins/loading'
export default {
  name: 'card',
  mixins: [refreshDataMixin, loadingMixin],
  props: ['data', 'tableHeight', 'tableData'],
  components: {
    InventoryDialog,
    BankAccountDialog,
    TableFormItem
  },
  data () {
    return {
      headData: {},
      bankFormVisible: false,
      dialogVisible: false,
      bankAccount: [],
      formAccount: {},
      pickerOptions: this.datePicker(),
      pricePre: this.$store.getters.pricePre,
      numPre: this.$store.getters.numPre,
      rowIndex: 0,
      rules: {
        invid: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        id_inventory: [{required: true, message: '请输入存货', trigger: 'change'}],
        mny: [{required: true, message: '请输入金额', trigger: 'change'}]
      }
    }
  },
  watch: {
    formData: {
      handler (formData) {
        this.headData = formData
        if (this.headData.cbilltype || this.headData.cbusitype) {
          this.$parent.openCard(this.headData)
        }
      },
      immediate: true
    }
  },
  beforeUpdate () {
    this.$nextTick(() => {
      this.$refs.addTableRef.doLayout()
    })
  },
  created () {
  },
  computed: {
    sortedData () {
      return this.headData.children
    },
    cbusitypedata () {
      let cbusitypedata = IcbillManageConst.saleOutType
      return cbusitypedata.filter(item => (item.value !== ''))
    },
    disabled () {
      return !this.$parent.editStatus
    },
    isEidt () {
      if (this.headData.id_ictrade_h) {
        return true
      }
      return false
    },
    formData: {
      get () {
        return this.data
      },
      set () {
        this.$emit('update:data', false)
      }
    },
    billData: {
      get () {
        return this.tableData
      }
    },
    queryData: {
      get () {
        return {isshow: 'Y', vdate: this.headData.ddate}
      }
    },
    billIndex () {
      const index = this.billData.findIndex(item => item.id_ictrade_h === this.headData.id_ictrade_h)
      return index
    },
    disablePrevButton () {
      return this.billIndex <= 0
    },
    disableNextButton () {
      return this.billIndex >= this.billData.length - 1
    },
    invenData () {
      return this.$parent.chData
    },
    gysData () {
      return this.$parent.fzData
    }
  },
  mounted () {
    this.fetchBankData()
    this.headData = this.formData
    this.$set(this.headData, 'children',
      !this.headData.children || this.headData.children.length === 0 ? [] : this.headData.children)
  },
  methods: {
    refreshData () {
      this.fetchBankData()
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val
    },
    tableRowClassName (row, index) {
      row.row.index = row.rowIndex
    },
    dblclickRow (row) {
      this.$refs.addTableRef.toggleRowSelection(row)
    },
    addRow: function () {
      this.headData.children.splice(this.headData.children.length + 1, 0, { ntax: this.$parent.getNtax() })
    },
    removeRow: function () {
      if (!this.listSelectedRows || this.listSelectedRows.length === 0) {
        MsgUtil.warnMsg(this, '请先选择数据！')
      }
      this.listSelectedRows.forEach(item => {
        this.headData.children.splice(this.headData.children.indexOf(item), 1)
      })
    },
    saveForm (auto) { // 保存
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const saveHead = Object.assign({}, this.headData)
          delete saveHead.children
          const temp = {
            head: JSON.stringify(saveHead),
            body: JSON.stringify(this.headData.children),
            auto: auto
          }
          this.$api.InventoryManageApi.IcbillSaleout.saveSale(temp).then(result => {
            this.closeLoading()
            if (result.success) {
              if (IcbillManageConst.saleOutType[2].value === this.headData.cbusitype) {
                this.saveSetting()
              }
              this.$parent.cardShow = false
              this.$parent.editStatus = false
              MsgUtil.successMsg(this, result.msg)
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
          })
        } else {
          this.closeLoading()
        }
      })
    },
    saveFormAuto () { // 保存
      this.saveForm('auto')
    },
    // 保存设置
    saveSetting () {
      this.$parent.printForm['font-size'] = this.$parent.printForm.font
      this.$parent.printForm.isjcp = this.headData.isjc
      this.$api.printSetting.saveSetting(this.getParamToSaveSetting(this.$parent.printForm)).then(result => {
        if (result.success) {
        } else {
        }
      }).catch(e => {
      })
    },
    getParamToSaveSetting (printForm) {
      return {
        nodename: '出库单',
        print_setting: JSON.stringify(printForm),
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        corpids: this.$store.getters.currentCorp.pk_gs
      }
    },
    cancelEdit () {
      this.$confirm('您确定不保存修改过的信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.onBack()
      }).catch(e => {
      })
    },
    onBack () {
      this.$parent.editStatus = false
      this.$parent.cardShow = false
      this.$parent.period = this.headData.qj
    },
    prevBill () {
      let index = this.billIndex - 1
      if (index >= 0 && index <= this.billData.length) {
        this.loadBillById(this.billData[index].id_ictrade_h)
      }
    },
    nextBill () {
      let index = this.billIndex + 1
      if (index >= 0 && index <= this.billData.length) {
        this.loadBillById(this.billData[index].id_ictrade_h)
      }
    },
    loadBillById (id) {
      if (!id) {
        return
      }
      this.$api.InventoryManageApi.IcbillSaleout.editData({'id_ictrade_h': id, 'ignoreCheck': 'Y'}).then(res => {
        this.headData = res.data
        this.$parent.openCard(this.headData)
      })
    },

    fetchBankData () {
      this.$api.BasicSettingApi.BankAccount.queryBankAccount({'isnhsty': 'Y'}).then(result => {
        if (result.success) {
          this.bankAccount = result.rows
        }
      }).catch(e => {
      })
    },
    addBank () {
      if (this.headData.iway === '2') {
        this.formAccount = {}
        this.bankFormVisible = true
      }
    },
    editBank (event, item) {
      this.formAccount = Object.assign({}, item)
      this.bankFormVisible = true
    },
    onBankSaved (data) {
      if (data) {
        let index = this.bankAccount.findIndex(item => data.id === item.id)
        if (index < 0) {
          this.bankAccount.push(data)
        } else {
          this.bankAccount.splice(index, 1, data)
        }
        this.headData.yhzh = data.id
      }
    },
    openInv (index) {
      this.rowIndex = index
      this.dialogVisible = true
    },
    handleInvSelect (invData) {
      // 追加
      let len = this.headData.children.length - 1 + invData.length
      let howmany = 1
      if (this.rowIndex !== len) {
        // 插入
        len = this.rowIndex
      }
      invData.forEach((item, i) => {
        if (i !== 0) {
          howmany = 0
        }
        const child = this.changeInvInfo(item)
        this.headData.children.splice(len + i, howmany, child)
      })
    },
    typechange (type) {
      if (IcbillManageConst.saleOutType[1].value !== type) {
        this.headData.invid = null
        this.headData.invdate = null
        this.headData.yhzh = null
        this.headData.fp_style = '3'
        this.headData.pk_cust = null
        this.refreshCH()
      }
      this.$parent.setTableHeight(this.headData)
      for (let item of this.headData.children) {
        item.num = 0
        item.price = 0
        item.ntax = this.$parent.getNtax()
        item.tmny = 0
        item.ttmny = 0
        item.mny = 0
        item.cost = 0
        item.v1 = 0
      }
      this.setbillNo()
    },
    jcChecked (check) {
      if (check) {
        this.headData.fp_style = '3'
        this.headData.iway = '1'
        this.headData.invid = null
        this.headData.invdate = null
        this.iwayChange(this.headData.iway)
      } else {
        if (this.$parent.chargedeptname()) {
          this.headData.fp_style = '2'
        } else {
          this.headData.fp_style = '1'
        }
      }
    },
    iwayChange (iway) {
      if (iway !== '2') {
        this.headData.yhzh = null
      }
    },
    dateChange () {
      this.setbillNo()
      this.refreshCH()
    },
    setbillNo () {
      let param = {
        ddate: this.headData.ddate,
        cbusitype: this.headData.cbusitype
      }
      this.$api.InventoryManageApi.IcbillSaleout.getBillNo(param).then(result => {
        if (!result.success) {
          MsgUtil.errorMsg(this, result.msg)
        } else {
          this.headData.did = result.data
        }
      })
    },
    refreshCH () {
      if (IcbillManageConst.saleOutType[2].value === this.headData.cbusitype) {
        this.headData.isjc = this.$parent.printForm.isjcp
        this.$parent.formData.ddate = this.headData.ddate
        this.$parent.fetchCh()
      }
    },
    datePicker () {
      const self = this
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.$store.getters.currentCorp.bdate
          return period < jzDate.substring(0, 7)
        }
      }
    },
    chChange (index, row) {
      if (row.id_inventory) {
        const invdata = this.invenData.find(ch => ch.id === row.id_inventory)
        if (invdata) {
          this.headData.children.splice(index, 1, this.changeInvInfo(invdata))
        }
      }
    },
    changeInvInfo (invdata) {
      const object = {}
      object.id_inventory = invdata.id
      object.invclassname = invdata.splxmc
      object.invcode = invdata.spbm
      object.invspec = invdata.gg
      object.measure = invdata.jldw
      object.kmbm = invdata.kmbm
      object.kmmc = invdata.kmmc
      object.pk_subject = invdata.kmid

      object.ntax = this.$parent.getNtax()
      if (IcbillManageConst.saleOutType[2].value === this.headData.cbusitype) {
        if (this.headData.isjc) {
          object.vf1 = invdata.ncbprice
          object.cost = invdata.njzmny
          object.num = invdata.njznum
        }
      }
      return object
    },
    numChange (index, row) {
      this.headData.children[index].mny = calculate('mul', this.headData.children[index].price, this.headData.children[index].num, 2)
      this.headData.children[index].cost = calculate('mul', this.headData.children[index].vf1, this.headData.children[index].num, 2)
      this.calData(index)
    },
    mnyChange (index, row) {
      this.headData.children[index].price = calculate('div', this.headData.children[index].mny, this.headData.children[index].num, this.pricePre)
      this.calData(index)
    },
    taxChange (index, row) {
      this.calData(index)
    },
    tmnyChange (index, row) {
      this.headData.children[index].ttmny = calculate('add', this.headData.children[index].mny, this.headData.children[index].tmny, 2)
    },
    costChange (index, row) {
      this.headData.children[index].vf1 = calculate('div', this.headData.children[index].cost, this.headData.children[index].num, this.pricePre)
    },
    calData (index) {
      this.headData.children[index].tmny = calculate('mul', this.headData.children[index].mny, this.headData.children[index].ntax, 2)
      this.headData.children[index].tmny = calculate('div', this.headData.children[index].tmny, 100, 2)
      this.headData.children[index].ttmny = calculate('add', this.headData.children[index].mny, this.headData.children[index].tmny, 2)
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      let excludeInx = [0, 1, 3, 4, 6, 8, 11, 13, 14, 15]
      if (IcbillManageConst.saleOutType[1].value !== this.headData.cbusitype) { excludeInx = [0, 1, 3, 4, 6, 8, 9, 10] }
      columns.forEach((column, index) => {
        if (excludeInx.includes(index)) {
          return
        }
        if (index === 2) {
          sums[index] = '合计'
          return
        }
        let npre = 2
        if (index === 5) {
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
        if (index === 5) {
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

</style>
