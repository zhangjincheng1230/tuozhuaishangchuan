<template>
  <tr>
    <td style="position: relative">
      <div class="row-operate">
        <i class="el-icon-circle-plus-outline" title="增行" @click="addRow()"></i>
        <i class="el-icon-remove-outline" title="删行" @click="delRow()"></i>
      </div>
      <EditCell
        ref="abstractCell"
        @begin-edit="onEditAbstract"
        :editable="editable"
        :value="voucherEntry.zy"
        :editing-cell="editingCell"
        :row="voucherEntry">
        <template #editor>
          <el-autocomplete
            @keydown.native="onAbstractInputKeyDown"
            @keyup.native="onAbstractInputKeyUp"
            v-model="voucherEntry.zy"
            @select="onSelectAbstract"
            :trigger-on-focus="abstractTriggerOnFocus"
            :fetch-suggestions="abstractFilter" :popper-append-to-body="true"></el-autocomplete>
          <!--          <el-input v-model="voucherEntry.zy" type="textarea" style="height: 100%"></el-input>-->
        </template>
      </EditCell>
    </td>
    <td>
      <EditCell
        ref="subjectCell"
        :value="subjectDisplayValue"
        :row="voucherEntry"
        :auto-focus="false"
        @begin-edit="onEditSubject"
        :input-selector="'.subject-input .el-input__inner'"
        :editable="editable"
        :before-end-edit="onBeforeEndEditSubjectCell"
        :editing-cell="editingCell"
        @end-edit="assistVisible = false"
        class="subject-cell">
        <template #view>
          <div :class="showBalance ? 'subject-display-balance' : ''">{{subjectDisplayValue}}</div>
          <div class="balance-display" v-if="showBalance">
            <span class="balance-container" v-if="isShowMnyBalance">
              余额:<span :class="mnyBalance < 0 ? 'money-negative' : ''">{{ mnyBalance }}</span>
            </span>
            <span class="balance-container" v-if="isShowNumberBalance">
              数量:<span :class="numberBalance < 0 ? 'money-negative' : ''">{{ numberBalance }}</span>
            </span>
            <span class="balance-container" v-if="isShowBalancePrice">
              单价:<span :class="balancePrice < 0 ? 'money-negative' : ''">{{ balancePrice }}</span>
            </span>
          </div>
        </template>
        <template #editor>
          <el-popover
            placement="bottom"
            :width="auxiliaryPopperWidth"
            trigger="manual"
            v-model="assistVisible" style="width: 100%; height: 100%;">
            <el-select
              v-model="subjectRefId"
              @keydown.native="onSubjectInputKeyDown"
              filterable
              default-first-option
              clearable
              :filter-method="subjectFilter"
              @change="onSelectSubject"
              @visible-change="onSubjectDropDown"
              class="subject-input"
              slot="reference">
              <el-option
                v-for="item in subjectRefFiltered"
                :key="item.value"
                :value="item.value"
                :label="item.label">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right;" @click="deleteCommonAuxiliaryRef($event, item)"
                      v-if="item.value.indexOf(',') > 0">
                  <i class="el-icon-close"></i>
                </span>
              </el-option>
            </el-select>
            <div>
              <el-form label-width="70px">
                <el-form-item :label="type.name" v-for="type in usedAuxiliaryTypes" :key="type.id">
                  <el-select
                    ref="auxiliaryInput"
                    v-model="voucherEntry[type.key]"
                    @change="onAuxiliaryChange"
                    filterable>
                    <el-option
                      v-for="item in (type.code === 6 ? inventoryArchive : auxiliaryArchive[type.code])"
                      :key="item.id"
                      :value="item.id"
                      :label="item.code + ' ' + item.name + (item.spec ? '(' + item.spec + ')' : '')">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div>
                <div style="float:left;">
                  <el-checkbox v-model="isCommonAuxiliary" @change="onCommonAuxiliaryCheck">辅助检索</el-checkbox>
                </div>
                <div style="float: right">
                  <el-tooltip class="item" effect="dark" :content="commonAuxiliarySettingTips" placement="top-start">
                    <el-switch v-model="autoSaveCommonAuxiliaryValue" @change="onCommonAuxiliarySettingChange">
                    </el-switch>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-popover>
        </template>
        <template #suffix>
          <div class="subject-suffix" @click.stop="showSubjectReferenceDialog">科目</div>
        </template>
      </EditCell>
    </td>
    <td v-if="showNumberColumn" class="column-multi-line">
      <template v-if="showNumberField">
        <div>数量
          <el-input-number
            ref="numberInput"
            v-model="voucherEntry.chnum"
            :disabled="!editable"
            @change="onNumberChange"
            @blur="onNumberChange"
            :precision="numberPrecision"
            size="mini"
            :controls="false" style="width: 80px;">
          </el-input-number>
        </div>
        <div>单价
          <el-input-number
            ref="priceInput"
            v-model="voucherEntry.chdj"
            @change="onPriceChange"
            @blur="onPriceChange"
            :disabled="!editable"
            :precision="pricePrecision"
            size="mini"
            :controls="false" style="width: 80px;">
          </el-input-number>
        </div>
      </template>
    </td>
    <td v-if="showCurrencyColumn" class="column-multi-line">
      <template v-if="showCurrencyField">
        <div>
          <el-select
            v-model="voucherEntry.bzid"
            @change="onSelectCurrency"
            :disabled="!editable"
            size="mini"
            style="width: 50px;">
            <el-option
              v-for="currency in currencyRef"
              :key="currency.id"
              :value="currency.id"
              :label="currency.code"></el-option>
          </el-select>
          <el-input-number
            ref="rateInput"
            v-model="voucherEntry.nrate"
            @change="onRateChange"
            @blur="onRateChange"
            :disabled="!editable || !rateEditable"
            :precision="ratePrecision"
            size="mini"
            :controls="false"
            style="width: 65px;">
          </el-input-number>
        </div>
        <div>原币
          <el-input-number
            ref="originalMnyInput"
            v-model="originalMny"
            @change="onOriginalMnyChange"
            @blur="onOriginalMnyChange"
            :disabled="!editable || !rateEditable"
            :precision="4"
            size="mini"
            :controls="false"
            style="width: 80px;">
          </el-input-number>
        </div>
      </template>
    </td>
    <td class="column-money">
      <EditCell
        :value="voucherEntry.jfmny"
        ref="debitCell"
        :formatter="moneyFormatter"
        :editable="editable"
        :row="voucherEntry"
        :editing-cell="editingCell"
        :class="voucherEntry.jfmny < 0 ? 'money-negative' : ''">
        <template #editor>
          <el-input-number
            ref="debitInput"
            v-model="voucherEntry.jfmny"
            :controls="false"
            :precision="2"
            @keydown.native="onMnyInputKeyDown($event, 0)"
            @keyup.native="onMnyInputKeyUp($event, 0)"
            @change="onDebitChange"
            @blur="onDebitBlur"
            :max="999999999.99">
          </el-input-number>
        </template>
      </EditCell>
    </td>
    <td class="column-money">
      <EditCell
        :value="voucherEntry.dfmny"
        ref="creditCell"
        :formatter="moneyFormatter"
        :editable="editable"
        :row="voucherEntry"
        :editing-cell="editingCell"
        :class="voucherEntry.dfmny < 0 ? 'money-negative' : ''">
        <template #editor>
          <el-input-number
            ref="creditInput"
            v-model="voucherEntry.dfmny"
            @change="onCreditChange"
            @blur="onCreditBlur"
            @keydown.native="onMnyInputKeyDown($event, 1)"
            @keyup.native="onMnyInputKeyUp($event, 1)"
            :controls="false"
            :precision="2"
            :max="999999999.99">
          </el-input-number>
        </template>
      </EditCell>
    </td>
  </tr>
</template>

<script>
import EditCell from './EditCell'
import {SUBJECT_AUXILIARY_DEFAULT, CURRENCY_RMB} from '@/constants'
import Big from 'big.js'
import {forThousands} from '@/filters'
import {getIncomeWarningPeriodTypeName} from '@/utils'

export default {
  name: 'VoucherEditRow',
  props: {
    index: {
      type: Number,
      default: 0
    },
    entryData: {
      type: Object,
      default () {
        return {}
      }
    },
    showNumberColumn: {
      type: Boolean,
      default: false
    },
    showCurrencyColumn: {
      type: Boolean,
      default: false
    },
    subjectRef: {
      type: Array,
      default () {
        return []
      }
    },
    abstractRef: {
      type: Array,
      default () {
        return []
      }
    },
    auxiliaryArchive: {
      type: Object,
      default () {
        return {}
      }
    },
    editable: {
      type: Boolean,
      default: true
    },
    autoSaveCommonAuxiliary: {
      type: Boolean,
      default: true
    },
    mnyBalanceMap: {
      type: Map,
      default: null
    },
    numberBalanceMap: {
      type: Map,
      default: null
    },
    rateArchive: {
      type: Object,
      default () {
        return {}
      }
    },
    showMnyBalance: {
      type: Boolean,
      default: false
    },
    showNumberBalance: {
      type: Boolean,
      default: false
    },
    showBalancePrice: {
      type: Boolean,
      default: false
    },
    incomeWarningInfo: {
      type: Array,
      default () {
        return []
      }
    },
    editingCell: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      voucherEntry: {},
      subjectRefId: null,
      subjectRefFiltered: [],
      originalMny: 0,
      // subjectId: null,
      assistVisible: false,
      abstractTriggerOnFocus: true,
      isCommonAuxiliary: false,
      // 科目是否为存货大类
      isInventoryCategory: false
    }
  },
  computed: {
    subjectId () {
      return this.voucherEntry.kmid
    },
    idWithAuxiliary () {
      let id = null
      if (this.subjectId && !this.hasEmptyAuxiliary) {
        id = this.subjectId
        for (let i = 1; i <= 10; i++) {
          let auxiliaryId = this.voucherEntry['fzhs' + i]
          if (i === 6 && this.hasInventory) {
            auxiliaryId = this.voucherEntry.chid
          } else {
            auxiliaryId = this.voucherEntry['fzhs' + i]
          }
          if (auxiliaryId) {
            id += ',' + auxiliaryId
          }
        }
      }
      return id
    },
    allSubjectData () {
      return this.$store.getters.subSubjectRef
    },
    subject () {
      return this.subjectId
        ? this.allSubjectData.find(item => item.id === this.subjectId) : null
    },
    mnyValue () {
      return this.voucherEntry.jfmny || this.voucherEntry.dfmny
    },
    showNumberField () {
      return this.subject && this.subject.sfsz === '是'
    },
    showCurrencyField () {
      return this.subject && this.subject.whhs === '是'
    },
    currencyRef () {
      return this.subject ? this.subject.whhslist : []
    },
    rateData () {
      return this.voucherEntry.bzid ? this.rateArchive[this.voucherEntry.bzid] : null
    },
    currencyCalculateMode () {
      return this.rateData ? this.rateData.cmode : 0
    },
    auxiliaryTypes () {
      return this.$store.getters.auxiliaryTypes
    },
    usedAuxiliaryTypes () {
      let types = []
      if (this.subject) {
        this.subject.isfzhs.split('').forEach((key, index) => {
          let isInventory = index === 5 && this.hasInventory
          if (key === '1' || isInventory) {
            let code = index + 1
            let type = this.auxiliaryTypes.find(type => type.code === code)
            if (type) {
              types.push({
                code: type.code,
                name: type.name,
                key: isInventory ? 'chid' : 'fzhs' + code
              })
            }
          }
        })
      }
      return types
    },
    defaultDirection () {
      let direction = 0
      if (this.voucherEntry.dfmny) {
        direction = 1
      } else if (this.voucherEntry.jfmny) {
        direction = 0
      } else if (this.index === 0) {
        direction = 0
      } else if (this.subject && this.subject.kmfx === 1) {
        direction = 1
      }
      return direction
    },
    rateEditable () {
      return this.voucherEntry.bzid !== CURRENCY_RMB
    },
    subjectDisplayValue () {
      let formatted = ''
      if (this.subject) {
        formatted = this.subject.codefullname
        if (this.hasAuxiliary) {
          for (let i = 1; i <= 10; i++) {
            let auxiliaryId = this.voucherEntry['fzhs' + i]
            if (i === 6 && this.inventoryModuleEnabled) {
              auxiliaryId = this.voucherEntry.chid
            }
            if (auxiliaryId) {
              let archives = this.auxiliaryArchive[i]
              if (archives) {
                let archive = archives.find(item => item.id === auxiliaryId)
                if (archive) {
                  formatted += '_' + archive.code + ' ' + archive.name
                }
              }
            }
          }
        }
      } else {
        formatted = ''
      }
      return formatted
    },
    numberPrecision () {
      return this.$store.getters.numPre
    },
    pricePrecision () {
      return this.$store.getters.pricePre
    },
    ratePrecision () {
      return this.$store.getters.huilvPre
    },
    autoSaveCommonAuxiliaryValue: {
      get () {
        return this.autoSaveCommonAuxiliary
      },
      set (val) {
        this.$emit('update-common-auxiliary-setting', val)
      }
    },
    commonAuxiliarySettingTips () {
      return this.autoSaveCommonAuxiliaryValue ? '关闭：默认不勾选辅助检索' : '开启：默认勾选辅助检索'
    },
    inventoryModuleEnabled () {
      return this.$store.getters.inventoryModuleEnabled
    },
    // 库存推总账
    isIcToGl () {
      let corp = this.$store.getters.getLoginCorp
      return corp ? corp.buildicstyle === '1' : false
    },
    hasInventory () {
      let hasInventory = false
      if (this.inventoryModuleEnabled) {
        if (this.isIcToGl) {
          if (this.subject && this.subject.isfzhs.charAt(5) === '1') {
            hasInventory = true
          }
        } else if (this.subject && (this.subject.sfsz === '是' || this.subject.isfzhs.charAt(5) === '1')) {
          hasInventory = true
        }
      }
      return hasInventory
    },
    hasAuxiliary () {
      let hasAuxiliary = false
      if (this.subject && this.subject.isfzhs !== SUBJECT_AUXILIARY_DEFAULT) {
        hasAuxiliary = true
      }
      return hasAuxiliary || this.hasInventory
    },
    hasEmptyAuxiliary () {
      let hasEmpty = false
      if (this.hasAuxiliary) {
        let isfzhs = this.subject.isfzhs
        for (let i = 0; i < 10; i++) {
          if (i === 5 && this.hasInventory) {
            if (!this.voucherEntry.chid) {
              hasEmpty = true
            }
          } else {
            if ((isfzhs.charAt(i) === '1' && !this.voucherEntry['fzhs' + (i + 1)])) {
              hasEmpty = true
            }
          }
        }
      }
      return hasEmpty
    },
    auxiliaryPopperWidth () {
      let width = 387
      if (this.showNumberColumn || this.showCurrencyColumn) {
        if (!this.showNumberColumn || !this.showCurrencyColumn) {
          width = 307
        } else {
          width = 300
        }
      }
      return width
    },
    // 显示余额
    showBalance () {
      return this.idWithAuxiliary && (this.isShowMnyBalance || this.isShowNumberBalance)
    },
    isShowMnyBalance () {
      return this.showMnyBalance
    },
    isShowNumberBalance () {
      return this.showNumberField && this.showNumberBalance
    },
    isShowBalancePrice () {
      return this.showMnyBalance && this.isShowNumberBalance
    },
    mnyBalance () {
      let balance = 0
      if (this.idWithAuxiliary && this.mnyBalanceMap && this.mnyBalanceMap.has(this.idWithAuxiliary)) {
        balance = this.mnyBalanceMap.get(this.idWithAuxiliary)
      }
      return new Big(balance).toFixed(2)
    },
    numberBalance () {
      let balance = 0
      if (this.idWithAuxiliary && this.numberBalanceMap && this.numberBalanceMap.has(this.idWithAuxiliary)) {
        balance = this.numberBalanceMap.get(this.idWithAuxiliary)
      }
      return new Big(balance).toFixed(this.numberPrecision)
    },
    balancePrice () {
      let price
      if (Number(this.numberBalance) === 0) {
        price = new Big(0)
      } else {
        price = this.numberBalance ? new Big(this.mnyBalance).div(this.numberBalance) : 0
      }
      return price.toFixed(this.pricePrecision)
    },
    inventoryArchive () {
      let archives = this.auxiliaryArchive[6] || []
      if (this.inventoryModuleEnabled) {
        if (this.subject.kmbm === '1403' || this.subject.kmbm === '1405') {
          archives = archives.filter(archive => archive.pk_accsubj === this.subjectId)
        }
      } else if (this.isInventoryCategory) {
        archives = archives.filter(archive => archive.kmclassify === this.subjectId)
      }
      return archives
    }
  },
  created () {
  },
  watch: {
    entryData: {
      handler (val) {
        this.voucherEntry = this.createLocalData(val)
        if (this.subject) {
          this.loadAuxiliary(this.subject.isfzhs)
        }
      },
      immediate: true
    },
    subjectId (id, oldId) {
      if (oldId) {
        this.clearAuxiliarySelect()
        this.voucherEntry.bzid = null
        this.voucherEntry.nrate = undefined
        this.originalMny = undefined
        this.voucherEntry.chnum = undefined
        this.voucherEntry.chdj = undefined
      }
      let subject = this.subject
      if (subject) {
        if (this.hasInventory || (subject.isfzhs.charAt(5) === '1')) {
          this.checkIsInventoryCategory(subject.id)
        }
        if (this.hasAuxiliary) {
          this.loadAuxiliary(this.subject.isfzhs)
        }
        if (this.subject.whhs === '是') {
          this.$emit('update:showCurrencyColumn', true)
          this.voucherEntry.bzid = this.subject.whhslist[0].id
          this.onSelectCurrency()
        }
        if (this.subject.sfsz === '是') {
          this.$emit('update:showNumberColumn', true)
        }
        let warningMsg = this.getIncomeWarningMsg(subject.kmbm)
        if (warningMsg) {
          this.$alert(warningMsg, '提示', {
            dangerouslyUseHTMLString: true
          })
        }
      }
    },
    assistVisible (val) {
      if (val === true) {
        this.checkCommonAuxiliaryExist()
        this.$nextTick(() => {
          for (let i = 0; i < this.$refs.auxiliaryInput.length; i++) {
            let input = this.$refs.auxiliaryInput[i]
            if (!input.value) {
              input.focus()
              break
            }
          }
        })
      }
    },
    idWithAuxiliary () {
      this.$emit('update-balance')
    },
    'voucherEntry.chnum': function () {
      this.$emit('update-balance')
    },
    subjectRef: {
      handler (val) {
        this.subjectRefFiltered = val
      },
      immediate: true
    }
  },
  components: {
    EditCell
  },
  methods: {
    editRow (cell) {
      if (cell === 'mny') {
        if (this.defaultDirection === 0) {
          this.$refs.debitCell.editCell()
        } else {
          this.$refs.creditCell.editCell()
        }
      } else {
        this.$refs.abstractCell.editCell()
      }
    },
    onEditAbstract () {
      if (!this.voucherEntry.zy) {
        let entries = this.$parent.getEntriesData()
        for (let i = this.index - 1; i >= 0; i--) {
          if (entries[i].zy) {
            this.voucherEntry.zy = entries[i].zy
            break
          }
        }
      }
    },
    createLocalData (data) {
      data = JSON.parse(JSON.stringify(data))
      let localData = {
        kmid: null,
        bzid: null,
        chid: null,
        chnum: undefined,
        zy: '',
        jfmny: null,
        dfmny: null
      }
      for (let i = 1; i <= 10; i++) {
        localData['fzhs' + i] = null
      }
      Object.assign(localData, data)
      if (!localData.jfmny) {
        localData.jfmny = undefined
      }
      if (!localData.dfmny) {
        localData.dfmny = undefined
      }
      this.subjectRefId = localData.kmid
      this.originalMny = localData.jfmny ? localData.ybjfmny : localData.ybdfmny
      return localData
    },
    getEntryData () {
      let data = JSON.parse(JSON.stringify(this.voucherEntry))
      let originalMny
      if (this.showCurrencyField) {
        originalMny = this.originalMny
      } else {
        data.bzid = CURRENCY_RMB
        originalMny = this.voucherEntry.jfmny ? this.voucherEntry.jfmny : this.voucherEntry.dfmny
      }
      data.jfmny = this.voucherEntry.jfmny ? this.voucherEntry.jfmny : 0
      data.dfmny = this.voucherEntry.dfmny ? this.voucherEntry.dfmny : 0
      data.ybjfmny = this.voucherEntry.jfmny ? originalMny : 0
      data.ybdfmny = this.voucherEntry.dfmny ? originalMny : 0
      return data
    },
    abstractFilter (queryString, callback) {
      let suggestions = []
      this.abstractRef.forEach(item => {
        if (queryString === undefined || queryString === '' ||
          (item.code.indexOf('#muban#') === -1 && item.code.indexOf(queryString) > -1) ||
          item.name.indexOf(queryString) > -1) {
          suggestions.push({
            code: item.code,
            value: item.name
          })
        }
      })
      callback(suggestions)
    },
    subjectFilter (queryText) {
      if (!queryText) {
        this.subjectRefFiltered = this.subjectRef
      } else {
        queryText = queryText.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        let numberStart = /^\d+$/.test(queryText)
        this.subjectRefFiltered = this.subjectRef.filter(subj => {
          let matched = false
          let index = subj.label.toLowerCase().search(queryText)
          if (numberStart) {
            if (index === 0) {
              matched = true
            }
          } else if (index > -1) {
            matched = true
          }
          return matched
        })
      }
    },
    onAbstractInputKeyDown (e) {
      let keyCode = e.keyCode
      switch (keyCode) {
        case 9:
        case 13:
          if (!e.shiftKey) {
            this.$refs.abstractCell.endEditCell()
            this.$refs.subjectCell.editCell()
          } else {
            this.$refs.abstractCell.endEditCell()
            if (this.index > 0) {
              e.preventDefault()
              this.$parent.editRow(this.index - 1, 'mny')
            }
          }
          break
      }
    },
    onAbstractInputKeyUp () {
      if (this.index > 0) {
        if (this.voucherEntry.zy === '//') {
          this.voucherEntry.zy = this.getAbstractByIndex(0)
        } else if (this.voucherEntry.zy === '..') {
          this.voucherEntry.zy = this.getAbstractByIndex(this.index - 1)
        }
      }
    },
    getAbstractByIndex (index) {
      let entries = this.$parent.getEntriesData()
      return entries[index].zy
    },
    onSubjectInputKeyDown (e) {
      let keyCode = e.keyCode
      switch (keyCode) {
        case 9:
        case 13:
          if (!e.shiftKey) {
            if (this.subjectId) {
              this.subjectNavNext()
            } else {
              e.stopPropagation()
            }
          } else {
            if (!this.hasAuxiliary || !this.hasEmptyAuxiliary) {
              this.$refs.subjectCell.endEditCell()
              this.$refs.abstractCell.editCell()
            }
          }
          break
      }
    },
    subjectNavNext () {
      if (this.hasAuxiliary && this.hasEmptyAuxiliary) {
        if (!this.$refs.subjectCell.isEdit) {
          this.$refs.subjectCell.editCell()
        }
        return
      } else {
        this.assistVisible = false
      }
      this.$nextTick(() => {
        if (this.subjectId) {
          this.$refs.subjectCell.endEditCell()
          if (this.showNumberField) {
            this.$refs.numberInput.focus()
          } else if (this.showCurrencyField) {
            this.$refs.rateInput.focus()
          } else {
            if (this.defaultDirection === 0) {
              this.$refs.debitCell.editCell()
            } else {
              this.$refs.creditCell.editCell()
            }
          }
        }
      })
    },
    onSelectAbstract (val) {
      if (val.code.indexOf('#muban#') === 0) {
        this.$emit('apply-template', val.code.substring(7))
        return
      }
      this.abstractTriggerOnFocus = false
      this.$nextTick(() => {
        this.$refs.abstractCell.focus()
        this.abstractTriggerOnFocus = true
      })
    },
    showSubjectReferenceDialog () {
      if (this.editable) {
        this.$emit('show-subject-reference', this.index)
      }
    },
    onEditSubject () {
      if (this.hasAuxiliary) {
        this.$nextTick(() => {
          this.assistVisible = true
        })
      } else {
        this.$nextTick(() => {
          this.$refs.subjectCell.focus()
        })
      }
    },
    onBeforeEndEditSubjectCell (target) {
      if (this.hasEmptyAuxiliary) {
        if (this._inactive === false && !target.classList.contains('tag-item')) {
          this.$message.warning('辅助核算不能为空')
        }
        return false
      }
    },
    setSubject (id) {
      this.subjectRefId = id
      this.voucherEntry.kmid = id
      setTimeout(() => {
        this.subjectNavNext()
      }, 100)
    },
    onSelectSubject (val) {
      if (!val) {
        this.voucherEntry.kmid = null
        return
      }
      this.voucherEntry.kmid = val.substring(0, 24)
      this.$nextTick(() => {
        if (val.length > 24) {
          this.dealSubjectWithAuxiliary(val)
          this.subjectRefId = this.voucherEntry.kmid
        }
        this.subjectNavNext()
      })
    },
    onSubjectDropDown (val) {
      if (val) {
        if (this.assistVisible) {
          this.assistVisible = false
        }
        this.subjectRefFiltered = this.subjectRef
      } else if (this.hasAuxiliary) {
        this.assistVisible = true
      }
    },
    updateColumnDisplay () {
      if (this.subject) {
        if (this.subject.whhs === '是') {
          this.$emit('update:showCurrencyColumn', true)
        }
        if (this.subject.sfsz === '是') {
          this.$emit('update:showNumberColumn', true)
        }
      }
    },
    dealSubjectWithAuxiliary (id) {
      let subjectWithAuxiliary = this.subjectRef.find(item => item.value === id)
      for (let i = 1; i <= 10; i++) {
        let key = 'fzhs' + i
        if (i === 6 && this.inventoryModuleEnabled) {
          this.voucherEntry.chid = subjectWithAuxiliary[key]
        } else {
          this.voucherEntry[key] = subjectWithAuxiliary[key]
        }
      }
    },
    clearAuxiliarySelect () {
      for (let i = 0; i < 10; i++) {
        this.voucherEntry['fzhs' + (i + 1)] = null
      }
      this.voucherEntry.chid = null
    },
    loadAuxiliary () {
      [...this.subject.isfzhs].forEach((flag, index) => {
        if (index === 5 && this.inventoryModuleEnabled) {
          if (this.hasInventory) {
            this.$emit('update-auxiliary', index + 1)
          }
        } else {
          if (flag === '1') {
            this.$emit('update-auxiliary', index + 1)
          }
        }
      })
    },
    getIncomeWarningMsg (subjectCode) {
      let msg = ''
      if (this.incomeWarningInfo.length > 0 && subjectCode) {
        this.incomeWarningInfo.forEach(info => {
          if (info.isInputRemind === 'Y') {
            let infoSubjectArray = info.kmbm.split(',')
            let containsKm = infoSubjectArray.find(infoSubject => subjectCode.indexOf(infoSubject) === 0)
            if (containsKm) {
              if (info.yjz < info.fsTotal &&
                info.infoNumber > 0) {
                let infoNumber2 = info.fsTotal - info.yjz
                msg += '您的' + info.xmmc + '(' + getIncomeWarningPeriodTypeName(info.period_type) + ')' + '超过预警值' + forThousands(infoNumber2) + '元，请留意<br>'
              } else if (info.yjz < info.fsTotal &&
                info.infoNumber <= 0) {
                msg += '您的' + info.xmmc + '(' + getIncomeWarningPeriodTypeName(info.period_type) + ')' + '已达预警上限<br>'
              }
            }
          }
        })
      }
      return msg
    },
    moneyFormatter (val) {
      if (!val) {
        return ''
      }
      val = new Big(val)
      return val.mul(100).toFixed(0).replace('-', '')
    },
    onSelectCurrency () {
      let rateData = this.rateData
      if (rateData) {
        this.voucherEntry.nrate = rateData.erate
        this.calculateCurrency('rate')
      }
    },
    onRateChange (val) {
      this.calculateCurrency('rate')
    },
    onOriginalMnyChange (val) {
      this.calculateCurrency('original')
    },
    calculateCurrency (trigger) {
      // 计算金额
      if (this.voucherEntry.nrate && this.originalMny && trigger !== 'mny') {
        let mnyBig = this.currencyCalculateMode === 0 ? new Big(this.voucherEntry.nrate)
          .mul(this.originalMny) : new Big(this.voucherEntry.nrate).div(this.originalMny)
        let mny = Number(mnyBig.toFixed(2))
        this.setMnyValue(this.defaultDirection, mny)
      } else if (this.mnyValue && this.voucherEntry.nrate && trigger !== 'original' &&
        (!this.originalMny || !this.rateEditable)) {
        // 计算原币
        let originalMnyBig = this.currencyCalculateMode === 0 ? new Big(this.mnyValue).div(this.voucherEntry.nrate)
          : new Big(this.mnyValue).mul(this.voucherEntry.nrate)
        this.originalMny = Number(originalMnyBig.toFixed(4))
      }
    },
    checkCurrencyValue () {
      let msg = ''
      if (this.voucherEntry.nrate && this.originalMny) {
        let mnyBig = this.currencyCalculateMode === 0 ? new Big(this.voucherEntry.nrate)
          .mul(this.originalMny) : new Big(this.voucherEntry.nrate).div(this.originalMny)
        let mny = new Big(Number(mnyBig.toFixed(2)))
        if (mny.sub(this.mnyValue).abs().gt(0.1)) {
          msg = this.currencyCalculateMode === 0 ? '本位币金额不等于原币*汇率' : '本位币金额不等于原币/汇率'
        }
      }
      return msg
    },
    onPriceChange (val) {
      this.calculateNumber('price')
    },
    onNumberChange (val) {
      this.calculateNumber('number')
    },
    // 计算数量 单价 金额
    calculateNumber (trigger) {
      // 计算金额
      if (this.voucherEntry.chnum && this.voucherEntry.chdj && trigger !== 'mny') {
        let mny = Number(new Big(this.voucherEntry.chnum).mul(this.voucherEntry.chdj).toFixed(2))
        this.setMnyValue(this.defaultDirection, mny)
      } else if (this.mnyValue && this.voucherEntry.chnum && trigger !== 'price') {
        // 计算单价
        this.voucherEntry.chdj = Number(new Big(this.mnyValue)
          .div(this.voucherEntry.chnum).toFixed(this.pricePrecision))
      } else if (this.mnyValue && this.voucherEntry.chdj && !this.voucherEntry.chnum && trigger !== 'number') {
        // 计算数量
        this.voucherEntry.chnum = Number(new Big(this.mnyValue)
          .div(this.voucherEntry.chdj).toFixed(this.numberPrecision))
      }
    },
    onMnyInputKeyDown (e, direction) {
      let keyCode = e.keyCode
      switch (keyCode) {
        case 9:
        case 13:
          e.preventDefault()
          if (!e.shiftKey) {
            this.mnyNavNext(direction)
          } else {
            if (direction === 0) {
              this.$refs.debitCell.endEditCell()
            } else {
              this.$refs.creditCell.endEditCell()
            }
            this.$refs.subjectCell.editCell()
          }
          break
        case 32:
          e.preventDefault()
          this.swapMnyValue(direction)
          break
      }
    },
    onMnyInputKeyUp (e, direction) {
      let keyCode = e.keyCode
      switch (keyCode) {
        case 61:
        case 187:
          e.preventDefault()
          this.calculateBalanceMny(direction)
          break
      }
    },
    mnyNavNext (direction) {
      if (direction === 0) {
        this.$refs.debitInput.$el.querySelector('input').blur()
        this.$refs.debitCell.endEditCell()
        if (!this.voucherEntry.jfmny) {
          this.$refs.creditCell.editCell()
        } else {
          this.$parent.editRow(this.index + 1)
        }
      } else {
        this.$refs.creditInput.$el.querySelector('input').blur()
        this.$refs.creditCell.endEditCell()
        this.$parent.editRow(this.index + 1)
      }
    },
    // 借贷金额互换
    swapMnyValue (direction) {
      if (direction === 0) {
        this.$refs.debitInput.$el.querySelector('input').blur()
        this.$refs.debitCell.endEditCell()
        this.setMnyValue(1, this.voucherEntry.jfmny)
        this.$refs.creditCell.editCell()
      } else {
        this.$refs.creditInput.$el.querySelector('input').blur()
        this.$refs.creditCell.endEditCell()
        this.setMnyValue(0, this.voucherEntry.dfmny)
        this.$refs.debitCell.editCell()
      }
    },
    calculateBalanceMny (direction) {
      if (direction === undefined && this.subject) {
        direction = this.subject.kmfx
      }
      let entries = this.$parent.getEntriesData()
      let debitSum = new Big(0)
      let creditSum = new Big(0)
      entries.forEach(entryData => {
        if (entryData.key !== this.voucherEntry.key) {
          if (entryData.jfmny) {
            debitSum = debitSum.plus(entryData.jfmny)
          }
          if (entryData.dfmny) {
            creditSum = creditSum.plus(entryData.dfmny)
          }
        }
      })
      if (direction === 0) {
        this.setMnyValue(direction, Number(creditSum.sub(debitSum).toFixed(2)))
      } else {
        this.setMnyValue(direction, Number(debitSum.sub(creditSum).toFixed(2)))
      }
      this.$emit('change', 'debit')
    },
    setMnyValue (direction, val) {
      if (direction === 1) {
        this.voucherEntry.dfmny = val
        if (val) {
          this.voucherEntry.jfmny = undefined
        }
        this.$emit('change', 'credit', val)
      } else {
        this.voucherEntry.jfmny = val
        if (val) {
          this.voucherEntry.dfmny = undefined
        }
        this.$emit('change', 'debit', val)
      }
      this.$emit('@update-balance')
      if (this.showNumberField) {
        this.calculateNumber('mny')
      }
      if (this.showCurrencyField) {
        this.calculateCurrency('mny')
      }
    },
    onDebitChange (val) {
      this.setMnyValue(0, val)
    },
    onDebitBlur () {
      if (this.voucherEntry.jfmny) {
        if (this.showNumberField) {
          this.calculateNumber('mny')
        }
        if (this.showCurrencyField) {
          let msg = this.checkCurrencyValue()
          if (msg) {
            this.$message.warning(msg)
          }
        }
      }
    },
    onCreditChange (val) {
      this.setMnyValue(1, val)
    },
    onCreditBlur () {
      if (this.voucherEntry.dfmny) {
        if (this.showNumberField) {
          this.calculateNumber('mny')
        }
        if (this.showCurrencyField) {
          let msg = this.checkCurrencyValue()
          if (msg) {
            this.$message.warning(msg)
          }
        }
      }
    },
    onCommonAuxiliaryCheck (val) {
      if (!this.hasEmptyAuxiliary) {
        let auxiliaryData = this.getCommonAuxiliaryData()
        if (val) {
          this.saveCommonAuxiliary(auxiliaryData)
        } else {
          this.deleteCommonAuxiliary(auxiliaryData)
        }
      }
    },
    onCommonAuxiliarySettingChange (val) {
      if (val) {
        if (!this.isCommonAuxiliary) {
          this.checkCommonAuxiliaryExist()
        }
      } else if (this.isCommonAuxiliary && !this.hasEmptyAuxiliary) {
        let auxiliaryData = this.getCommonAuxiliaryData()
        this.deleteCommonAuxiliary(auxiliaryData)
        this.isCommonAuxiliary = false
      }
    },
    onAuxiliaryChange () {
      this.checkCommonAuxiliaryExist()
    },
    getCommonAuxiliaryData () {
      let data = {
        pk_accsubj: this.subjectId
      }
      let isfzhs = this.subject.isfzhs
      for (let i = 0; i < 10; i++) {
        if (isfzhs.charAt(i) === '1') {
          let key = 'fzhs' + (i + 1)
          data[key] = this.voucherEntry[key]
        } else if (i === 5 && this.inventoryModuleEnabled) {
          let key = 'fzhs' + (i + 1)
          data[key] = this.voucherEntry.chid
        }
      }
      return data
    },
    checkCommonAuxiliaryExist () {
      if (!this.hasEmptyAuxiliary) {
        let auxiliaryData = this.getCommonAuxiliaryData()
        this.$api.Voucher.checkCommonAssistExist(auxiliaryData).then(res => {
          if (res.success) {
            this.isCommonAuxiliary = true
          } else {
            if (this.autoSaveCommonAuxiliary) {
              this.isCommonAuxiliary = true
              this.saveCommonAuxiliary(auxiliaryData)
            } else {
              this.isCommonAuxiliary = false
            }
          }
        })
      } else {
        this.isCommonAuxiliary = false
      }
    },
    saveCommonAuxiliary (data) {
      this.$api.Voucher.saveCommonAssist(data).then(res => {
        if (res.success) {
          this.$emit('common-auxiliary-change')
        }
      })
    },
    deleteCommonAuxiliaryRef (e, refData) {
      e.stopPropagation()
      this.$emit('delete-common-auxiliary-ref', refData.value)
      let data = {...refData}
      data.pk_accsubj = data.value.substring(0, 24)
      delete data.value
      delete data.lable
      this.deleteCommonAuxiliary(data, false)
    },
    deleteCommonAuxiliary (data, emitChange) {
      if (this.subjectRefId && this.subjectRefId.indexOf(',') > 0) {
        this.subjectRefId = this.subjectRefId.substring(0, 24)
      }
      this.$api.Voucher.deleteCommonAssist(data).then(res => {
        if (res.success) {
          if (emitChange !== false) {
            this.$emit('common-auxiliary-change')
          }
        }
      })
    },
    // 检查必输项
    checkInput () {
      let mny = this.voucherEntry.jfmny || this.voucherEntry.dfmny
      let subjectId = this.subjectId
      let zy = this.voucherEntry.zy
      if (!mny && !subjectId) {
        return true
      }
      if (!zy) {
        this.$message.warning('请录入摘要')
        setTimeout(() => {
          this.$refs.abstractCell.editCell()
        }, 100)
        return false
      }
      if (!subjectId) {
        this.$message.warning('请录入科目')
        setTimeout(() => {
          this.$refs.subjectCell.editCell()
        }, 100)
        return false
      }
      if (this.hasAuxiliary && this.hasEmptyAuxiliary) {
        this.$message.warning('请录入辅助核算')
        setTimeout(() => {
          this.$refs.subjectCell.editCell()
        }, 100)
        return false
      }
      if (this.showNumberField) {
        if (!this.voucherEntry.chnum) {
          this.$message.warning('请录入数量')
          this.$refs.numberInput.focus()
          return false
        }
      }
      if (this.showCurrencyField) {
        if (!this.voucherEntry.nrate) {
          this.$message.warning('请录入汇率')
          this.$refs.rateInput.focus()
          return false
        }
        if (!this.originalMny) {
          this.$message.warning('请录入原币')
          this.$refs.originalMnyInput.focus()
          return false
        }
        let msg = this.checkCurrencyValue()
        if (msg) {
          this.$message.warning('第' + (this.index + 1) + '条分录' + msg)
          return false
        }
      }

      if (!mny) {
        if (!this.showNumberField || !this.voucherEntry.chnum) {
          this.$message.warning('请录入金额')
          return false
        }
      }
    },
    addRow () {
      this.$emit('add-row', this.index)
    },
    delRow () {
      this.$emit('del-row', this.index)
    },
    checkIsInventoryCategory (subjectId) {
      this.$api.BasicSettingApi.Auxiliary.checkIsInventoryCategory({subjectId}).then(res => {
        if (res.success) {
          this.isInventoryCategory = res.data
        }
      })
    }
  },
  activated () {
    if (this.$refs.subjectCell.isEdit === true && this.hasEmptyAuxiliary) {
      this.assistVisible = true
    }
  },
  deactivated () {
    if (this.assistVisible === true) {
      this.assistVisible = false
    }
  }
}
</script>

<style scoped>
  td {
    border: 1px solid #666;
    height: 60px;
    padding: 0;
  }

  .column-multi-line {
    font-size: 12px;
  }

  .column-multi-line >>> .el-input__inner {
    padding: 0;
    border: none;
    border-bottom: 1px solid #DCDFE6;
  }

  .row-operate {
    left: -18px;
    padding-top: 7px;
  }

  .row-operate i {
    font-size: 18px;
  }

  .row-operate .el-icon-remove-outline {
    margin-top: 10px;
  }

  .subject-view-balance {
    max-height: 35px;
  }

  .balance-container {
    display: inline-block;
  }

  .subject-suffix {
    width: 28px;
    cursor: pointer;
    visibility: hidden;
    position: absolute;
    right: 0;
    height: 100%;
    line-height: 60px;
  }

  tr:hover .subject-suffix {
    visibility: visible;
  }

  .subject-input >>> .el-input__inner {
    padding-right: 58px;
  }

  .subject-input >>> .el-input__suffix {
    right: 33px;
  }

  .subject-cell >>> .voucher-cell-view {
    margin-right: 28px;
    overflow: hidden;
  }

  .subject-display-balance {
    max-height: 37px;
    line-height: 15px;
    overflow: auto;
  }
  .balance-display {
    font-size: 0.9em;
    line-height: 1;
  }
</style>
