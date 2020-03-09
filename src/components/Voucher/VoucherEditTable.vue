<template>
  <div style="width: 1050px; margin: 0px auto">
    <div v-show="showImageView" style="margin-bottom: 10px;">
      <VoucherImageView
        ref="imageView"
        :image-groups="imageGroups"
        :image-group-id="localData.tpgid"></VoucherImageView>
    </div>
    <div style="position: relative">
      <div class="status-icon" :class="statusIcon"></div>
      <div>
        <div style="text-align: center; font-size: 25px; font-weight: 700">记账凭证</div>
      </div>
      <div class="clearfix">
        <div style="float:left;">
          凭证字
          <el-input value="记账凭证" readonly suffix-icon="el-icon-arrow-down" style="width: 100px"></el-input>
          <el-input
            v-model="localData.pzh"
            :disabled="!editable"
            @blur="onVoucherNumberBlur"
            style="width: 86px">
            <template #suffix>
              <div style="width: 25px; height: 100%; position: relative">
                <span class="voucher-number-suffix" @click="addVoucherNumber" style="top: 1px">
                  <i class="el-icon-arrow-up"></i>
                </span>
                <span class="voucher-number-suffix" @click="subVoucherNumber" style="bottom: 1px">
                  <i class="el-icon-arrow-down"></i>
                </span>
              </div>
            </template>
          </el-input>
          号
          <span style="margin-left: 5px;">日期</span>
          <el-date-picker
            v-model="localData.zdrq"
            :disabled="!editable"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            style="width: 150px">
          </el-date-picker>
        </div>
        <div style="float: right">
          附单据
          <el-input-number
            v-model="localData.fdjs"
            :disabled="!editable"
            :precision="0" :controls="false" style="width: 60px"></el-input-number>
          张
        </div>
      </div>
    </div>
    <div style="margin-top: 5px;">
      <table class="voucher-table" :class="{'show-semi-column': showSemiColumn, 'show-all-column': showAllColumn}">
        <colgroup>
          <col class="column-summary">
          <col class="column-subject">
          <col v-if="showNumberColumn" class="column-number">
          <col v-if="showCurrencyColumn" class="column-currency">
          <col class="column-money">
          <col class="column-money">
        </colgroup>
        <thead>
        <tr>
          <th class="column-summary">摘要</th>
          <th class="column-subject">会计科目</th>
          <th v-if="showNumberColumn" class="column-number">数量</th>
          <th v-if="showCurrencyColumn" class="column-currency">币别</th>
          <th class="column-money">借方金额
            <div class="money_unit"><span>亿</span> <span>千</span> <span>百</span> <span>十</span> <span>万</span>
              <span>千</span> <span>百</span> <span>十</span> <span>元</span> <span>角</span> <span class="mr0">分</span>
            </div>
          </th>
          <th class="column-money">贷方金额
            <div class="money_unit"><span>亿</span> <span>千</span> <span>百</span> <span>十</span> <span>万</span>
              <span>千</span> <span>百</span> <span>十</span> <span>元</span> <span>角</span> <span class="mr0">分</span>
            </div>
          </th>
        </tr>
        </thead>
        <tbody>
        <VoucherEditRow
          ref="entryRef"
          v-for="(entry, index) in localData.children"
          :entry-data="entry"
          :subject-ref="subjectRefData"
          :abstract-ref="abstractRefData"
          :auxiliary-archive="auxiliaryArchive"
          :show-currency-column.sync="showCurrencyColumn"
          :show-number-column.sync="showNumberColumn"
          :index="index"
          :auto-save-common-auxiliary="autoSaveCommonAuxiliary"
          :rate-archive="rateArchive"
          :show-mny-balance="showMnyBalance"
          :show-number-balance="showNumberBalance"
          :show-balance-price="showBalancePrice"
          :mny-balance-map="mnyBalanceDataRealtime"
          :number-balance-map="numberBalanceDataRealtime"
          :income-warning-info="incomeWarningInfo"
          :editing-cell="editingCell"
          @change="onValInput"
          @add-row="addRow"
          @del-row="delRow"
          @apply-template="applyTemplate"
          @update-common-auxiliary-setting="updateCommonAuxiliarySetting"
          @common-auxiliary-change="prepareSubjectRefData"
          @delete-common-auxiliary-ref="deleteCommonAuxiliary"
          @show-subject-reference="showSubjectReferenceDialog"
          @update-balance="updateBalanceData"
          @update-auxiliary="fetchAuxiliaryArchive"
          :editable="editable"
          :key="entry.key">
        </VoucherEditRow>
        <tr>
          <td :colspan="showNumberColumn ? (showCurrencyColumn ? 4 : 3) : (showCurrencyColumn ? 3 : 2)">
            合计:<span :class="debitSum < 0 ? 'money-negative' : ''">{{chineseAmount}}</span>
          </td>
          <td class="column-money" :class="debitSum < 0 ? 'money-negative' : ''">
            <span class="voucher-cell-view">{{ debitFormatted }}</span>
          </td>
          <td class="column-money" :class="creditSum < 0 ? 'money-negative' : ''">
            <span class="voucher-cell-view">{{ creditFormatted }}</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="voucher-footer">
      <div class="footer-operator">
        <span>制单:{{ voucherCreatorName }}</span>
        <span v-if="cashierName">出纳:{{ cashierName }}</span>
        <span v-if="auditorName">审核:{{ auditorName }}</span>
        <span v-if="accountName">记账:{{ accountName }}</span>
      </div>
      <el-checkbox
        v-model="localData.sffpxjll"
        :disabled="true"
        true-label="是" false-label="否"
        :class="localData.sffpxjll === '是' && localData.error_cash_analyse === true ? 'error-check' : ''">
        {{ localData.sffpxjll === '是' && localData.error_cash_analyse === true ? '现金流量有误' : '现金流量已分析'}}
      </el-checkbox>
      <el-checkbox
        v-model="localData.is_tax_analyse"
        :disabled="true"
        :class="localData.is_tax_analyse === true && localData.error_tax_analyse === true ? 'error-check' : ''">
        {{ localData.is_tax_analyse === true && localData.error_tax_analyse === true ? '申报表税项有误' : '申报表税项已生成'}}
      </el-checkbox>
      <el-checkbox-group
        v-model="invoiceTypes"
        :disabled="!editable" style="display: inline-block; margin-left: 15px;">
        <template v-if="isSmallCorp">
          <el-checkbox :label="2">专票</el-checkbox>
          <el-checkbox :label="3">未开票和其他</el-checkbox>
        </template>
        <template v-else="">
          <el-checkbox :label="1">普票和其他</el-checkbox>
          <el-checkbox :label="3">未开票</el-checkbox>
        </template>
      </el-checkbox-group>
      <div style="float: right" v-if="showModifyDate">最后修改时间: {{localData.ts}}</div>
    </div>
    <div style="margin-top: 10px;" v-if="localData.sffpxjll === '是'">
      <el-collapse>
        <el-collapse-item title="现金流量">
          <VoucherCashFlowTable :table-data="cashFlowData"></VoucherCashFlowTable>
        </el-collapse-item>
      </el-collapse>
    </div>
    <SubjectReferenceDialog
      :visible.sync="subjectDialogVisible"
      @select="selectSubject"
      @add-subject="selectSubject"
      :add-button="true">
    </SubjectReferenceDialog>
  </div>
</template>

<script>
import VoucherEditRow from './components/VoucherEditRow'
import VoucherImageView from './components/VoucherImageView'
import VoucherCashFlowTable from './components/VoucherCashFlowTable'
import SubjectReferenceDialog from '@/components/reference/SubjectDialog'
import Big from 'big.js'
import {formatChineseAmount, formatVoucherNumber} from '@/utils'

const uuidv4 = require('uuid/v4')

export default {
  name: 'VoucherEditTable',
  components: {
    VoucherEditRow,
    VoucherImageView,
    VoucherCashFlowTable,
    SubjectReferenceDialog
  },
  props: {
    // 凭证id
    voucherId: {
      type: String,
      default: null
    },
    voucherData: {
      type: Object,
      default: null
    },
    imageGroups: {
      type: Array,
      default: null
    },
    imageViewVisible: {
      type: Boolean,
      default: false
    },
    isInsert: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let loginDate = this.$store.getters.getLoginDate
    return {
      localData: {
        pzh: '',
        zdrq: loginDate,
        fdjs: 0,
        children: [
          {
            key: uuidv4(),
            kmid: ''
          }, {
            key: uuidv4()
          }, {
            key: uuidv4()
          }, {
            key: uuidv4()
          }
        ]
      },
      originalData: null,
      originalVoucherJson: null,
      showNumberColumn: false,
      showCurrencyColumn: false,
      // 科目参照
      subjectRefData: [],
      // 摘要
      abstractData: [],
      // 辅助核算
      auxiliaryArchive: {},
      // 摘要中的凭证模板
      abstractTemplate: [],
      // 借方合计
      debitSum: 0,
      // 贷方合计
      creditSum: 0,
      // 现金流量
      cashFlowData: [],
      // 发票类型
      invoiceTypes: [],
      // 已保存的凭证分录金额
      savedEntryBalanceData: null,
      // 科目余额
      mnyBalanceData: null,
      numberBalanceData: null,
      mnyBalanceDataRealtime: null,
      numberBalanceDataRealtime: null,
      // 常用辅助
      autoSaveCommonAuxiliary: true,
      // 汇率档案
      rateArchive: {},
      subjectDialogVisible: false,
      subjectDialogTriggerIndex: false,
      incomeWarningInfo: [],
      // 正在编辑的单元格
      editingCell: null,
      auxiliaryFetchRecord: new Map()
    }
  },
  computed: {
    corpInfo () {
      let corpId = this.localData.corpId || this.$store.getters.getLoginCorpId
      return this.$store.getters.corps.find(corp => corp.pk_gs === corpId)
    },
    isSmallCorp () {
      return this.corpInfo.chname !== '一般纳税人'
    },
    showImageView () {
      let hasImage = (this.imageGroups && this.imageGroups.length) || this.localData.tpgid
      return hasImage && this.imageViewVisible
    },
    showSemiColumn () {
      return (this.showNumberColumn && !this.showCurrencyColumn) ||
        (!this.showNumberColumn && this.showCurrencyColumn)
    },
    showAllColumn () {
      return this.showNumberColumn && this.showCurrencyColumn
    },
    subjectData () {
      return this.$store.getters.subSubjectRef
    },
    subjectMap () {
      return this.$store.getters.subjectMap
    },
    debitFormatted () {
      return this.debitSum ? new Big(this.debitSum).mul(100).toFixed(0).replace('-', '') : ''
    },
    creditFormatted () {
      return this.creditSum ? new Big(this.creditSum).mul(100).toFixed(0).replace('-', '') : ''
    },
    voucherCreatorName () {
      let name = this.localData.zd_user ? this.localData.zd_user : this.$store.getters.getLoginUserName
      return name
    },
    invoiceType () {
      return this.invoiceTypes.length > 0 ? this.invoiceTypes : undefined
    },
    chineseAmount () {
      let chineseAmount = ''
      if (this.debitSum !== 0 && this.debitSum === this.creditSum) {
        chineseAmount = formatChineseAmount(this.debitSum)
      }
      return chineseAmount
    },
    statusIcon () {
      let icon = 'status-hidden'
      if (this.localData.pzzt === 1) {
        icon = this.localData.sfjz === '是' ? 'status-account' : 'status-audit'
      } else if (this.localData.pzzt === -1) {
        icon = this.localData.iautorecognize === 1 ? 'status-recognized' : 'status-stage'
      }
      return icon
    },
    editable () {
      return this.localData.pzzt !== 1 && this.localData.lydjlx !== 'HCH10535'
    },
    showTemplateInAbstract () {
      return this.$store.getters.showTemplateInAbstract
    },
    abstractRefData () {
      let refData = this.abstractData
      let templateData = this.abstractTemplate
      if (!this.localData.id && this.showTemplateInAbstract) {
        refData = refData.concat(templateData)
      }
      return refData
    },
    showModifyDate () {
      let param = this.$store.getters.paramSettingMap.get('dzf020')
      return this.localData.ts && param && param.pdvalue === 1
    },
    // 显示余额
    showMnyBalance () {
      let param = this.$store.getters.paramSettingMap.get('dzf018')
      return param && param.pdvalue === 1
    },
    // 显示数量余额
    showNumberBalance () {
      let param = this.$store.getters.paramSettingMap.get('dzf019')
      return param && param.pdvalue === 1
    },
    // 显示单价
    showBalancePrice () {
      let param = this.$store.getters.paramSettingMap.get('dzf023')
      return param && param.pdvalue === 1
    },
    // 出纳签字
    showCashier () {
      let param = this.$store.getters.paramSettingMap.get('dzf003')
      return param && param.pdvalue === 0
    },
    cashierName () {
      return this.showCashier ? this.localData.cn_user : ''
    },
    // 审核人
    auditorName () {
      return this.localData.pzzt === 1 ? this.localData.sh_user : ''
    },
    // 记账人
    accountName () {
      return this.localData.sfjz === '是' ? this.localData.jz_user : ''
    },
    auxiliaryTypes () {
      return this.$store.getters.auxiliaryTypes
    }
  },
  watch: {
    voucherId (id) {
      this.fetchData()
    },
    voucherData: {
      handler (data) {
        this.loadVoucherData(data)
      },
      deep: true
    },
    invoiceTypes (newVal, oldVal) {
      if (oldVal.length === 1 && newVal.length === 2) {
        this.invoiceTypes = [newVal[1]]
      }
    },
    subjectData () {
      this.prepareSubjectRefData()
    }
  },
  created () {
    if (this.voucherId) {
      this.fetchData()
    } else if (this.voucherData) {
      this.loadVoucherData(this.voucherData)
    } else {
      this.getNewCode()
      this.fetchIncomeWarningInfo()
    }
    this.updateBalanceData = this.$_.debounce(this.updateBalanceData, 100)
    this.prepareSubjectRefData()
    this.fetchAbstractData()
    this.fetchCommonAssistSetting()
    this.fetchRateArchive()
    this.$bus.on('edit-voucher-cell', this.onEditCell)
    this.$bus.on('end-edit-voucher-cell', this.onEndEditCell)
  },
  methods: {
    fetchData () {
      this.$api.Voucher.queryById({
        id: this.voucherId
      }).then(res => {
        this.loadVoucherData(res.data)
        this.$emit('load-voucher-by-id', res.data)
      })
    },
    loadVoucherData (data) {
      this.originalData = data
      let copyData = JSON.parse(JSON.stringify(data))
      if (copyData.children === undefined) {
        copyData.children = []
      }
      if (copyData.pzh === undefined) {
        copyData.pzh = null
      }
      copyData.children.forEach(child => {
        child.key = uuidv4()
      })
      for (let i = copyData.children.length; i < 4; i++) {
        copyData.children.push({
          key: uuidv4()
        })
      }
      if (data.zdrq === undefined) {
        copyData.zdrq = this.$store.getters.getLoginDate
      }
      if (data.fdjs === undefined) {
        copyData.fdjs = 0
      }
      let previousId = this.localData.id
      if (!previousId && !data.pzh) {
        copyData.pzh = this.localData.pzh
      }
      this.localData = copyData
      this.debitSum = copyData.jfhj ? copyData.jfhj : 0
      this.creditSum = copyData.dfhj ? copyData.dfhj : 0
      if (!data.pzh) {
        this.getNewCode()
      }
      if (data.fp_style) {
        this.invoiceTypes = [data.fp_style]
      } else {
        this.invoiceTypes = []
      }
      if (data.sffpxjll === '是') {
        this.fetchCashFlowData()
      }
      this.setRelatedDataOnLoad(copyData)
      this.$nextTick(() => {
        this.calculateSumMny()
        if (data.pzh) {
          this.originalVoucherJson = JSON.stringify(this.getSaveData())
        }
      })
      if (this.localData.lydjlx === 'HCH10535') {
        this.$message.error('汇兑生成的凭证不允许修改')
      }
    },
    setRelatedDataOnLoad (voucher) {
      let entries = voucher.children
      this.checkSubjectExist(entries).then(() => {
        this.setShowColumn(entries)
        this.fetchBalanceData(voucher)
        this.fetchIncomeWarningInfo()
      })
    },
    checkSubjectExist (entries) {
      return new Promise((resolve) => {
        let hasNotExistSubject = false
        for (let i = 0; i < entries.length; i++) {
          let subjectId = entries[i].kmid
          if (subjectId && !this.subjectMap.has(subjectId)) {
            hasNotExistSubject = true
            break
          }
        }
        if (hasNotExistSubject) {
          this.$store.dispatch('fetchSubjectRefData').then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    },
    setShowColumn (entries) {
      let hasNum = false
      let hasCur = false
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i]
        if (entry.kmid) {
          let subject = this.subjectMap.get(entry.kmid)
          if (subject) {
            if (subject.sfsz === '是') {
              hasNum = true
            }
            if (subject.whhs === '是') {
              hasCur = true
            }
            if (hasNum && hasCur) {
              break
            }
          }
        }
      }
      this.showCurrencyColumn = hasCur
      this.showNumberColumn = hasNum
    },
    getNewCode () {
      this.$api.Voucher.getNewCode({
        date: this.localData.zdrq
      }).then(res => {
        if (res.success) {
          let oldCode = this.localData.pzh
          this.localData.pzh = res.data
          if (oldCode === null) {
            this.originalVoucherJson = JSON.stringify(this.getSaveData())
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    prepareSubjectRefData () {
      this.$api.Voucher.queryCommonAssist({
        hasAssistData: 'Y'
      }).then(res => {
        if (res.success) {
          let fzMap = new Map()
          res.rows.forEach(item => {
            if (fzMap.has(item.pk_accsubj)) {
              fzMap.get(item.pk_accsubj).push(item)
            } else {
              fzMap.set(item.pk_accsubj, [item])
            }
          })
          this.subjectRefData = this.getSubjectRefData(fzMap)
        }
      })
    },
    getSubjectRefData (assistMap) {
      let dataArray = []
      this.subjectData.forEach(item => {
        dataArray.push({
          label: item.kmbm + ' ' + item.fullname,
          value: item.id
        })
        if (assistMap && assistMap.has(item.id)) {
          assistMap.get(item.id).forEach(assistSetting => {
            let data = {}
            let key = item.id
            for (let i = 1; i <= 10; i++) {
              let fzId = assistSetting['fzhs' + i]
              if (fzId) {
                data['fzhs' + i] = fzId
                key += ',' + fzId
              }
            }
            let label = item.kmbm + ' ' + item.fullname
            assistSetting.assistData.forEach(assist => {
              label += '_' + assist.code + ' ' + assist.name
            })
            data.label = label
            data.value = key
            dataArray.push(data)
          })
        }
      })
      return dataArray
    },
    fetchAbstractData () {
      this.$api.BasicSettingApi.Abstract.queryAbstract({
        unjl: 'Y'
      }).then(res => {
        if (res.success) {
          this.abstractData = res.rows
        }
      })
      this.$api.BasicSettingApi.VoucherTemplate.queryTemp({
        isZy: 'Y',
        unjl: 'Y'
      }).then(res => {
        this.abstractTemplate = res.rows
      })
    },
    editRow (index, cell) {
      let refs = this.getEntryRefs()
      if (index < refs.length) {
        refs[index].editRow(cell)
      }
    },
    onValInput (field, val) {
      if (field === 'debit' || field === 'credit') {
        this.calculateSumMny()
        this.updateBalanceData()
      }
    },
    calculateSumMny () {
      let debitSum = new Big(0)
      let creditSum = new Big(0)
      this.$refs.entryRef.forEach(entry => {
        let entryData = entry.getEntryData()
        if (entryData.jfmny !== undefined) {
          debitSum = debitSum.plus(entryData.jfmny)
        }
        if (entryData.dfmny !== undefined) {
          creditSum = creditSum.plus(entryData.dfmny)
        }
      })
      this.debitSum = Number(debitSum.toFixed(2))
      this.creditSum = Number(creditSum.toFixed(2))
    },
    addRow (index) {
      if (!this.editable) {
        return
      }
      this.localData.children.splice(index + 1, 0, {
        key: uuidv4()
      })
    },
    delRow (index) {
      if (!this.editable) {
        return
      }
      if (this.localData.children.length === 2) {
        this.$message.warning('至少保留两条分录')
        return
      }
      this.localData.children.splice(index, 1)
      this.$nextTick(() => {
        this.calculateSumMny()
        this.updateBalanceData()
      })
    },
    saveVoucher (voucherData) {
      return new Promise((resolve, reject) => {
        let postData
        if (!voucherData) {
          this.autoFillLastEmptyMny()
          let check = this.checkInput()
          if (check === false) {
            reject(new Error('data invalid'))
            return
          }
          postData = this.getSaveData()
          if (this.checkBeforeSave(postData) === false) {
            reject(new Error('data invalid'))
            return
          }
          if (this.isInsert) {
            postData.isInsert = 'Y'
          }
        } else {
          postData = voucherData
        }
        // 修改状态为自由态
        postData.pzzt = 8
        this.$api.Voucher.save(postData).then(res => {
          if (res.success) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
              dangerouslyUseHTMLString: true
            })
            resolve(res.data)
          } else if (res.status === -150) {
            this.$confirm('损益结转已完成，保存凭证后请重新结转损益！', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              iconClass: 'el-icon-warning-outline',
              center: true,
              closeOnClickModal: false,
              closeOnPressEscape: false
            }).then(() => {
              postData.isqxsy = 'Y'
              this.saveVoucher(postData).then(res => {
                resolve(res)
              }).catch((e) => {
                reject(e)
              })
            }).catch((e) => {
              reject(e)
            })
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
              dangerouslyUseHTMLString: true
            })
            reject(res.msg)
          }
        })
      })
    },
    deleteVoucher () {
      return new Promise((resolve, reject) => {
        this.$confirm('您确认要删除此凭证吗？删除后将不可恢复，并会产生断号！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          let data = this.localData
          this.$api.Voucher.deleteVoucher([{id: data.id}]).then(res => {
            if (res.success) {
              this.$message.success('删除成功')
              resolve(data)
            } else {
              this.$message.error(res.msg)
              reject(res.msg)
            }
          }).catch(e => {
            reject(e)
          })
        }).catch(e => {
          reject(e)
        })
      })
    },
    showSubjectReferenceDialog (index) {
      this.subjectDialogVisible = true
      this.subjectDialogTriggerIndex = index
    },
    selectSubject (subject) {
      let entryRef = this.$refs.entryRef.find(ref => ref.index === this.subjectDialogTriggerIndex)
      entryRef.setSubject(subject.id)
    },
    getEntryRefs () {
      return this.$refs.entryRef.sort((ref1, ref2) => ref1.index - ref2.index)
    },
    getEntriesData () {
      let data = []
      this.getEntryRefs().forEach(ref => data.push(ref.getEntryData()))
      return data
    },
    getSaveData ({containsSubjectDisplay} = {}) {
      let data = {...this.localData}
      let children = []
      this.getEntryRefs().forEach(ref => {
        let entry = ref.getEntryData()
        if (containsSubjectDisplay === true) {
          entry.subjectDisplay = ref.subjectDisplayValue
        }
        children.push(entry)
      })
      if (((this.imageGroups && this.imageGroups.length > 0) || this.localData.tpgid) &&
        this.$refs.imageView.currentGroup.pid) {
        data.tpgid = this.$refs.imageView.currentGroup.pid
      }
      data.children = children.filter(child => child.kmid || child.jfmny || child.dfmny)
      data.pzlb = 0
      data.jfhj = this.debitSum
      data.dfhj = this.creditSum
      if (this.invoiceTypes.length > 0) {
        data.fp_style = this.invoiceTypes[0]
      } else {
        delete data.fp_style
      }
      return data
    },
    getVoucherDataDisplay () {
      return this.getSaveData({
        containsSubjectDisplay: true
      })
    },
    autoFillLastEmptyMny () {
      let entryRefs = this.getEntryRefs()
      for (let i = entryRefs.length - 1; i >= 0; i--) {
        let entryRef = entryRefs[i]
        let entryData = entryRef.getEntryData()
        if (entryData.kmid && !entryData.jfmny && !entryData.dfmny) {
          entryRef.calculateBalanceMny()
          break
        }
      }
    },
    checkInput () {
      let entryRefs = this.getEntryRefs()
      for (let i = 0; i < entryRefs.length; i++) {
        let entryRef = entryRefs[i]
        if (entryRef.checkInput() === false) {
          return false
        }
      }
    },
    checkBeforeSave (data) {
      let children = data.children
      if (children.length < 2) {
        this.$message.warning('至少两条分录')
        return false
      }
      if (this.debitSum !== this.creditSum) {
        this.$message.warning('借贷不平')
        return false
      }
    },
    checkIsVoucherChange () {
      let changed = false
      let newVoucher = this.getSaveData()
      if (this.originalVoucherJson === null || !this.localData.id) {
        if (newVoucher.children.length > 0) {
          changed = true
        }
      } else if (JSON.stringify(newVoucher) !== this.originalVoucherJson) {
        changed = true
      }
      return changed
    },
    fetchCashFlowData () {
      this.$api.Voucher.getVoucherCashFlow({
        id: this.localData.id
      }).then(res => {
        if (res.success) {
          this.cashFlowData = res.rows
        }
      })
    },
    applyTemplate (id) {
      this.$api.Voucher.getTempById({
        tempId: id
      }).then(res => {
        if (res.success) {
          this.loadVoucherData(Object.assign(
            {},
            this.localData,
            {
              children: res.rows
            }
          ))
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    fetchBalanceData (voucher) {
      let entries = voucher.children
      let subjectArray = this.getSubjectArrayForBalanceQuery(entries)
      if (subjectArray.length === 0) {
        this.savedEntryBalanceData = null
        return
      }
      if (voucher.id) {
        let savedEntryBalanceData = new Map()
        subjectArray.forEach(subj => {
          savedEntryBalanceData.set(subj.id, subj)
        })
        this.savedEntryBalanceData = savedEntryBalanceData
      } else {
        this.savedEntryBalanceData = null
      }
      if (this.showMnyBalance) {
        this.fetchMnyBalanceData(subjectArray).then(res => {
          this.mnyBalanceData = res
          this.mnyBalanceDataRealtime = this.calculateRealtimeBalance(res, subjectArray, 'mny')
        })
      }
      if (this.showNumberBalance) {
        let numSubjects = subjectArray.filter(subject => subject.hasNumber)
        this.fetchNumberBalanceData(numSubjects).then(res => {
          this.numberBalanceData = res
          this.numberBalanceDataRealtime = this.calculateRealtimeBalance(res, numSubjects, 'number')
        })
      }
    },
    updateBalanceData () {
      if (!this.showMnyBalance && !this.showNumberBalance) {
        return
      }
      let entries = []
      this.$refs.entryRef.forEach(ref => {
        if (ref.idWithAuxiliary) {
          entries.push(ref.getEntryData())
        }
      })
      let subjectArray = this.getSubjectArrayForBalanceQuery(entries)
      if (subjectArray.length === 0) {
        this.mnyBalanceData = null
        this.mnyBalanceDataRealtime = null
        this.numberBalanceData = null
        this.numberBalanceDataRealtime = null
      }
      if (this.showMnyBalance) {
        let mnyBalanceData = new Map()
        let noBalanceSubject = []
        subjectArray.forEach(subject => {
          if (this.mnyBalanceData && this.mnyBalanceData.has(subject.id)) {
            mnyBalanceData.set(subject.id, this.mnyBalanceData.get(subject.id))
          } else {
            noBalanceSubject.push(subject)
          }
        })

        this.fetchMnyBalanceData(noBalanceSubject).then(res => {
          res.forEach((value, key) => mnyBalanceData.set(key, value))
          this.mnyBalanceData = mnyBalanceData
          this.mnyBalanceDataRealtime = this.calculateRealtimeBalance(mnyBalanceData, subjectArray, 'mny')
        })
      }
      if (this.showNumberBalance) {
        let numberBalanceData = new Map()
        let numSubjects = subjectArray.filter(subject => subject.hasNumber)
        let noBalanceSubject = []
        numSubjects.forEach(subject => {
          if (this.numberBalanceData && this.numberBalanceData.has(subject.id)) {
            numberBalanceData.set(subject.id, this.numberBalanceData.get(subject.id))
          } else {
            noBalanceSubject.push(subject)
          }
        })
        this.fetchNumberBalanceData(noBalanceSubject).then(res => {
          res.forEach((value, key) => numberBalanceData.set(key, value))
          this.numberBalanceData = numberBalanceData
          this.numberBalanceDataRealtime = this.calculateRealtimeBalance(numberBalanceData, numSubjects, 'number')
        })
      }
    },
    calculateRealtimeBalance (balanceData, subjects, field) {
      let realTimeMap = new Map()
      let savedEntryBalanceData = this.savedEntryBalanceData
      subjects.forEach(data => {
        let id = data.id
        let balanceVal = balanceData.get(id)
        let savedMny = 0
        if (savedEntryBalanceData && savedEntryBalanceData.has(id)) {
          savedMny = savedEntryBalanceData.get(id)[field]
        }
        let newBalance
        if (data.direction === 0) {
          newBalance = Number(new Big(balanceVal).add(data[field]).sub(savedMny))
        } else {
          newBalance = Number(new Big(balanceVal).sub(data[field]).add(savedMny))
        }
        realTimeMap.set(id, newBalance)
      })
      return realTimeMap
    },
    fetchMnyBalanceData (subjectArray) {
      return new Promise((resolve) => {
        if (!subjectArray || subjectArray.length === 0) {
          resolve(new Map())
          return
        }
        let param = {
          begindate: this.localData.zdrq,
          enddate: this.localData.zdrq,
          ishasjz: 'N',
          cjq: 1,
          cjz: 7,
          xswyewfs: 'N',
          xsyljfs: 'N',
          sfzxm: 'Y',
          ishowfs: 'Y',
          unjl: 'Y'
        }
        if (subjectArray.length === 1) {
          param.kms_first = subjectArray[0].code
          param.kms_last = subjectArray[0].code
        }
        this.$api.fsyebReport.query(param).then(res => {
          if (res.success) {
            let balanceData = res.rows
            let subjectBalance = new Map()
            subjectArray.forEach(subject => {
              let balanceVal = 0
              let data = this.findBalanceDataBySubject(balanceData, subject, 'pk_km', '_')
              if (data) {
                if (data.fx === '借') {
                  balanceVal = data.qmjf
                } else if (data.fx === '贷') {
                  balanceVal = data.qmdf
                }
              }
              subjectBalance.set(subject.id, balanceVal)
            })
            resolve(subjectBalance)
          }
        })
      })
    },
    fetchNumberBalanceData (subjectArray) {
      return new Promise((resolve) => {
        if (!subjectArray || subjectArray.length === 0) {
          resolve(new Map())
          return
        }
        let period = this.localData.zdrq.substring(0, 7)
        let param = {
          qjq: period,
          qjz: period,
          ishasjz: 'N',
          cjq: 1,
          cjz: 7,
          xswyewfs: 'N',
          isfzhs: 'Y',
          ishowfs: 'Y',
          unjl: 'Y'
        }
        if (subjectArray.length === 1) {
          param.kms_first = subjectArray[0].code
          param.kms_last = subjectArray[0].code
        }
        this.$api.SljezzReport.query(param).then(res => {
          if (res.success) {
            let balanceData = res.rows
            let numberBalance = new Map()
            subjectArray.forEach(subject => {
              let balanceVal = 0
              let data = this.findBalanceDataBySubject(balanceData, subject, 'pk_subject', ',')
              if (data) {
                balanceVal = data.qmnum
              }
              numberBalance.set(subject.id, balanceVal)
            })
            resolve(numberBalance)
          }
        })
      })
    },
    getSubjectArrayForBalanceQuery (entries) {
      let subjectMap = new Map()
      entries.forEach(entry => {
        if (entry.kmid) {
          let subjectData = this.subjectMap.get(entry.kmid)
          let subjectCode = subjectData.kmbm
          let id = entry.kmid
          for (let i = 1; i <= 10; i++) {
            if (i === 6 && entry.chid) {
              id += ',' + entry.chid
            } else {
              let fzId = entry['fzhs' + i]
              if (fzId) {
                id += ',' + fzId
              }
            }
          }
          let mny
          if (entry.jfmny) {
            mny = new Big(entry.jfmny)
          } else if (entry.dfmny) {
            mny = new Big(entry.dfmny).mul(-1)
          } else {
            mny = new Big(0)
          }
          let hasNumber = subjectData.sfsz === '是'
          let number = new Big(0)
          if (hasNumber && entry.chnum) {
            number = entry.jfmny ? new Big(entry.chnum) : new Big(entry.chnum).mul(-1)
          }
          if (!subjectMap.has(id)) {
            subjectMap.set(id, {
              id,
              code: subjectCode,
              direction: subjectData.kmfx,
              hasNumber,
              mny,
              number
            })
          } else {
            let existData = subjectMap.get(id)
            existData.mny = existData.mny.add(mny)
            existData.number = existData.mny.add(number)
          }
        }
      })
      let subjectArray = []
      subjectMap.forEach((value) => {
        subjectArray.push(value)
        value.mny = Number(value.mny.toFixed(2))
        value.number = value.number ? Number(value.number.toFixed(2)) : 0
      })
      subjectArray.sort((a1, a2) => {
        return a1.code.localeCompare(a2.code)
      })
      return subjectArray
    },
    findBalanceDataBySubject (allBalanceData, {id, code}, idField, idJoinStr) {
      let idArray = id.split(',')
      let subjectId = idArray[0]
      let allID = idArray.join(idJoinStr)

      function findSubject (balanceData) {
        let subjectBalance = null
        let parent = balanceData.find(data => code.indexOf(data.kmbm) === 0)
        if (parent) {
          if (parent[idField] === subjectId) {
            if (idArray.length > 1) {
              if (parent.children) {
                subjectBalance = parent.children.find(child => child[idField] === allID)
              }
            } else {
              subjectBalance = parent
            }
          } else {
            subjectBalance = findSubject(parent.children)
          }
        }
        return subjectBalance
      }

      let balanceData = findSubject(allBalanceData)
      return balanceData
    },
    fetchCommonAssistSetting () {
      this.$api.Public.queryPrintSetting({
        nodeName: '填制凭证'
      }).then(res => {
        if (res.success && res.data) {
          let settingStr = res.data.print_setting
          let setting = JSON.parse(settingStr)
          if (setting && setting.auto_check_assist === 'N') {
            this.autoSaveCommonAuxiliary = false
          } else {
            this.autoSaveCommonAuxiliary = true
          }
        }
      })
    },
    // 汇率档案
    fetchRateArchive () {
      this.$api.BasicSettingApi.ExchangeRate.queryExRate({
        unjl: 'Y'
      }).then(res => {
        if (res.success) {
          let rateArchive = {}
          res.rows.forEach(row => {
            rateArchive[row.pk_cur] = row
          })
          this.rateArchive = rateArchive
        } else {
          this.rateArchive = {}
        }
      })
    },
    deleteCommonAuxiliary (val) {
      let index = this.subjectRefData.findIndex(ref => ref.value === val)
      this.subjectRefData.splice(index, 1)
    },
    updateCommonAuxiliarySetting (val) {
      this.autoSaveCommonAuxiliary = val
      this.saveCommonAssistSetting()
    },
    saveCommonAssistSetting () {
      this.$api.Public.savePrintSetting({
        nodename: '填制凭证',
        print_setting: JSON.stringify({
          auto_check_assist: this.autoSaveCommonAuxiliary ? 'Y' : 'N'
        }),
        pk_corp: this.$store.getters.getLoginCorpId
      })
    },
    onVoucherNumberBlur () {
      this.localData.pzh = formatVoucherNumber(this.localData.pzh)
    },
    subVoucherNumber () {
      let voucherNumber = Number(this.localData.pzh)
      if (voucherNumber === 1) {
        return
      }
      this.localData.pzh = formatVoucherNumber(voucherNumber - 1)
    },
    addVoucherNumber () {
      let voucherNumber = Number(this.localData.pzh)
      this.localData.pzh = formatVoucherNumber(voucherNumber + 1)
    },
    fetchAuxiliaryArchive (type, subjectId) {
      let currentTime = new Date().getTime()
      if (this.auxiliaryFetchRecord.has(type)) {
        let lastTime = this.auxiliaryFetchRecord.get(type)
        if (currentTime - lastTime < 3000) {
          // 距上次请求小于3s
          return
        }
      }
      this.auxiliaryFetchRecord.set(type, currentTime)
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: this.auxiliaryTypes.find(item => item.code === type).id,
        kmid: subjectId,
        unjl: 'Y'
      }).then(res => {
        if (res.rows) {
          this.$set(this.auxiliaryArchive, type, res.rows)
        } else {
          this.$set(this.auxiliaryArchive, type, [])
        }
      })
    },
    fetchIncomeWarningInfo () {
      this.$api.BasicSettingApi.IncomeWarning.queryIncomeWarningInfo({
        nowDate: this.localData.zdrq,
        filflg: 'Y',
        unjl: 'Y'
      }).then(res => {
        if (res.success && res.rows) {
          this.incomeWarningInfo = res.rows
        }
      })
    },
    onEditCell (cell) {
      this.editingCell = cell
    },
    onEndEditCell () {
      this.editingCell = null
    }
  },
  beforeDestroy () {
    this.$bus.off('edit-voucher-cell', this.onEditCell)
    this.$bus.off('end-edit-voucher-cell', this.onEndEditCell)
  }
}
</script>

<style scoped>
  .voucher-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }

  .voucher-table th {
    height: 48px;
    color: #555555;
    font-size: 14px;
    text-align: center;
    font-weight: bold;
    overflow: hidden;
    border: 1px solid #666;
  }

  td {
    border: 1px solid #666;
    height: 60px;
  }

  col.column-summary {
    width: 220px;
  }

  col.column-subject {
    width: 387px;
  }

  col.column-number {
    width: 120px;
  }

  col.column-currency {
    width: 120px;
  }

  col.column-money {
    width: 221px;
  }

  .show-semi-column col.column-summary {
    width: 180px;
  }

  .show-semi-column col.column-subject {
    width: 307px;
  }

  .show-all-column col.column-summary {
    width: 180px;
  }

  .show-all-column col.column-subject {
    width: 300px;
  }

  .show-all-column col.column-money {
    width: 166px;
  }

  .money_unit {
    height: 22px;
    line-height: 22px;
    border-top: 1px solid #e6e6e6;
    background: url('~@/assets/voucher/money_219.png') right repeat-y;
  }

  .money_unit span {
    float: left;
    font-size: 12px;
    width: 19px;
    height: 100%;
    margin-right: 1px;
  }

  .column-money .money_unit, >>> td.column-money {
    text-align: right;
    background: url('~@/assets/voucher/money_219.png') right repeat-y;
  }

  >>> .column-money .voucher-cell-view {
    letter-spacing: 11px;
    padding: 0;
    margin-right: -6px;
    line-height: 60px;
    font-size: 16px;
  }

  .show-all-column .money_unit {
    background: url('~@/assets/voucher/money_165.png') right repeat-y;
  }

  .show-all-column .money_unit span {
    width: 14px;
  }

  .show-all-column .column-money .money_unit, .show-all-column >>> td.column-money {
    background: url('~@/assets/voucher/money_165.png') right repeat-y;
  }

  .show-all-column >>> .column-money .voucher-cell-view {
    letter-spacing: 6px;
    padding: 0;
    margin-right: -4px;
    line-height: 60px;
    font-size: 16px;
  }

  >>> .column-money .voucher-cell {
    display: block;
  }

  >>> .column-money .el-input__inner {
    text-align: right;
  }

  >>> .money-negative {
    color: #dd4e4e;
  }

  .status-icon {
    position: absolute;
    right: 160px;
    width: 150px;
    height: 74px;
  }

  .error-check >>> .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: red;
  }

  .status-hidden {
    display: none;
  }

  .status-audit {
    background: url('~@/assets/voucher/audit.png') no-repeat;
  }

  .status-account {
    background: url('~@/assets/voucher/checkout.png') no-repeat;
  }

  .status-stage {
    background: url('~@/assets/voucher/zancun.png') no-repeat;
  }

  .status-recognized {
    background: url('~@/assets/voucher/recognized.png') no-repeat;
  }

  .voucher-number-suffix {
    position: absolute;
    right: -3px;
    width: 25px;
    height: 16px;
    text-align: center;
    background: #f5f7fa;
    color: #606266;
    cursor: pointer;
    font-size: 13px;
  }

  .footer-operator {
    display: inline-block;
  }

  .footer-operator > span {
    margin-right: 5px;
  }
</style>
