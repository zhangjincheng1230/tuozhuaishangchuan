<template>
  <div class="app-main">
    <div
      class="kj-container"
      v-loading="loading"
      :element-loading-text="loadingText"
      :element-loading-spinner="loadingSpinner">
      <div class="kj-head">
        <div style="float: left">
          <el-button-group>
            <el-button icon="el-icon-caret-left" :disabled="disablePrevButton" @click="prevVoucher"></el-button>
            <el-button icon="el-icon-caret-right" :disabled="disableNextButton" @click="nextVoucher"></el-button>
          </el-button-group>
          <el-popover
            placement="bottom"
            width="200"
            trigger="hover"
            popper-class="popover-no-padding">
            <img src="@/assets/voucher/short-key-guide.png">
            <a slot="reference" class="short-key-ref">
              <span><i class="icon-short-key"></i>快捷键</span>
            </a>
          </el-popover>
        </div>
        <div class="kj-button-group">
          <template v-if="outsideNewVoucher">
            <el-button v-if="showSaveButton" @click="save()" key="saveButton">保存</el-button>
            <el-button v-if="!saved" @click="commonTemplateVisible = true" key="tempButton">常用模板</el-button>
            <el-button v-if="showImageQueryButton" @click="openImageQueryDialog" key="picButton">单据图片</el-button>
            <el-button
              v-if="hasImage && imageViewVisible === false"
              @click="imageViewVisible = true" key="showPicButton">
              显示图片
            </el-button>
            <el-button
              v-if="hasImage && imageViewVisible === true"
              @click="imageViewVisible = false" key="hidePicButton">隐藏图片</el-button>
          </template>
          <template v-else>
            <el-button v-if="saved" @click="newVoucher" key="newButton">新增</el-button>
            <el-button v-if="!saved" @click="save(true)" key="saveAndNewButton">保存并新增</el-button>
            <el-button v-if="showSaveButton" @click="save()" key="saveButton">保存</el-button>
            <el-button v-if="saved" @click="copy()" key="copyButton">复制</el-button>
            <el-button v-if="showDelButton" @click="deleteVoucher" key="delButton">删除</el-button>
            <el-button v-if="showAuditButton" @click="auditVoucher" key="auditButton">审核</el-button>
            <el-button v-if="showUnAuditButton" @click="unAuditVoucher" key="unAuditButton">反审核</el-button>
            <el-button v-if="showUnAuditButton" @click="scarletLetter" key="scarletLetterButton">红字回冲</el-button>
            <el-button v-if="showCashFlowButton" @click="openCashFlowDialog" key="cashFlowButton">现金流量</el-button>
            <el-button v-if="showTaxItemButton" @click="openTaxItemDialog" key="taxItemButton">税表表项</el-button>
            <el-button v-if="saved" @click="openAddTemplateDialog" key="saveTempButton">保存为常用模板</el-button>
            <el-button v-if="saved" @click="printVoucher" key="printButton">打印</el-button>
            <el-button v-if="!saved" @click="commonTemplateVisible = true" key="tempButton">常用模板</el-button>
            <el-button v-if="showImageQueryButton" @click="openImageQueryDialog" key="picButton">单据图片</el-button>
            <el-button
              v-if="!saved && quickCreateEnable === false"
              @click="enableQuickCreate" key="quickButton">快速制单</el-button>
            <el-button
              v-if="quickCreateEnable === true"
              @click="disableQuickCreate" key="quitQuickButton">退出快速制单</el-button>
          </template>
        </div>
      </div>
      <div class="kj-main" style="overflow: auto">
        <VoucherEditTable
          ref="voucherTable"
          :voucher-data="voucherData"
          :image-groups="imageGroups"
          :image-view-visible="imageViewVisible"
          :is-insert="isInsert"></VoucherEditTable>
      </div>
      <div v-show="quickCreateEnable" class="quick-create-popup">
        <div class="clearfix" style="background-color: #DFE5F4; line-height: 35px; padding: 0 10px;">
          <div style="float: left;">快速制单</div>
          <div style="float: right">
            <i v-if="quickCreateVisible" class="el-icon-arrow-down" @click="quickCreateVisible = false"></i>
            <i v-else class="el-icon-arrow-up" @click="quickCreateVisible = true"></i>
          </div>
        </div>
        <div v-show="quickCreateVisible" style="padding: 10px;">
          <QuickCreateVoucher @create-voucher="applyQuickCreate"></QuickCreateVoucher>
        </div>
      </div>
    </div>
    <CommonTemplateDialog
      :visible.sync="commonTemplateVisible" @selected="applyTemplate">
    </CommonTemplateDialog>
    <el-dialog
      title="单据图片"
      :visible.sync="imageQueryVisible"
      :close-on-click-modal="false"
      width="400px">
      <el-form label-width="auto">
        <el-form-item label="入账起始日期:">
          <el-date-picker
            v-model="imageQueryForm.beginDate"
            value-format="yyyy-MM-dd"
            :clearable="false"
            type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="入账结束日期:">
          <el-date-picker
            v-model="imageQueryForm.endDate"
            value-format="yyyy-MM-dd"
            :clearable="false"
            type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="选择公司:">
          <el-select
            v-model="imageQueryForm.corpId"
            filterable
            :disabled="true"
            value-format="yyyy-MM-dd"
            :clearable="false"
            type="date">
            <el-option
              v-for="item in corps"
              :key="item.pk_gs"
              :value="item.pk_gs"
              :label="item.uname"
              style="width:315px">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="imageQueryVisible = false">取消</el-button>
          <el-button type="primary" @click="queryImage">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <VoucherCashFlowDialog
      :visible.sync="cashFlowVisible"
      :voucher-data="voucherData"
      @save="onSaveCashFlow"
      @delete="onDeleteCashFlow"></VoucherCashFlowDialog>

    <el-dialog
      title="新增模板"
      :visible.sync="addTemplateVisible"
      :close-on-click-modal="false"
      width="350px">
      <el-form label-width="auto">
        <el-form-item label="模板编码:">
          <el-input v-model="addTemplateParam.tempCode" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="模板名称:">
          <el-input v-model="addTemplateParam.tempName" style="width: 200px;"></el-input>
        </el-form-item>
        <div>
          <el-checkbox v-model="addTemplateParam.saveMny">保存金额</el-checkbox>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addTemplateVisible = false">取消</el-button>
          <el-button type="primary" @click="saveAsTemplate">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <VoucherTaxItemDialog
      :visible.sync="taxItemVisible"
      :voucher-data="taxItemVoucher"
      :tax-items="taxItems"
      :subject-rules="taxSubjectRule">
    </VoucherTaxItemDialog>
  </div>
</template>

<script>
import VoucherEditTable from '@/components/Voucher/VoucherEditTable'
import QuickCreateVoucher from './components/QuickCreateVoucher'
import CommonTemplateDialog from './components/CommonTemplateDialog'
import VoucherCashFlowDialog from './components/VoucherCashFlowDialog'
import VoucherTaxItemDialog from './components/VoucherTaxItemDialog'
import routeParamMixin from '@/mixins/route-param'
import loadingMixin from '@/mixins/loading'
import {closeTag} from '@/utils'

export default {
  name: 'voucher-edit',
  mixins: [routeParamMixin, loadingMixin],
  props: {
    idList: {
      type: Array,
      default () {
        return []
      }
    },
    id: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      voucherData: null,
      localIdList: [],
      quickCreateVisible: false,
      quickCreateEnable: false,
      commonTemplateVisible: false,
      imageQueryVisible: false,
      imageQueryForm: {
        beginDate: null,
        endDate: null,
        corpId: null
      },
      imageGroups: null,
      imageViewVisible: false,
      cashFlowVisible: false,
      addTemplateVisible: false,
      addTemplateParam: {
        tempCode: '',
        tempName: '',
        saveMny: false
      },
      taxItemVisible: false,
      // 税目
      taxItems: [],
      // 科目匹配税目规则
      taxSubjectRule: {},
      lastPressedKey: null,
      taxItemVoucher: {}
    }
  },
  computed: {
    saved () {
      return this.voucherData && this.voucherData.id
    },
    outsideNewVoucher () {
      return this.voucherData && !this.voucherData.id && this.voucherData.lydjlx
    },
    corps () {
      return this.$store.getters.corps
    },
    isSmallCorp () {
      let loginCorp = this.$store.getters.getLoginCorp
      return !loginCorp || loginCorp.chname !== '一般纳税人'
    },
    subjectMap () {
      return this.$store.getters.subjectMap
    },
    cashSubject () {
      return this.$store.getters.cashSubjectSet
    },
    showCashFlowButton () {
      let show = false
      if (this.saved && this.voucherData.children) {
        let hasCashSubject = false
        let allSubjectIsCash = true
        this.voucherData.children.forEach(entry => {
          let subject = this.subjectMap.get(entry.kmid)
          if (this.cashSubject.has(entry.kmcode.substring(0, 4)) &&
            subject && (!subject.unxjkm || subject.unxjkm === '否')) {
            hasCashSubject = true
          } else {
            allSubjectIsCash = false
          }
        })
        show = hasCashSubject && !allSubjectIsCash
      }
      return show
    },
    showTaxItemButton () {
      let show = false
      if (this.saved && this.voucherData.children) {
        let containsIncome = false
        let containsPurchase = false
        let containsTraffic = false
        let containsInTax = false
        if (this.taxSubjectRule.cargo) {
          let cargoSubj = this.taxSubjectRule.cargo
          let serviceSubj = this.taxSubjectRule.service
          let purchaseSubj = this.taxSubjectRule.purchase
          let trafficSubj = this.taxSubjectRule.traffic
          let inTaxSubj = this.taxSubjectRule.inTax
          let profitSubj = this.taxSubjectRule.profit
          this.voucherData.children.forEach(entry => {
            if (profitSubj && entry.kmcode.match(profitSubj)) {
              // 本年利润凭证不分析
              return false
            } else if (entry.kmcode.match(cargoSubj) ||
              entry.kmcode.match(serviceSubj)) {
              containsIncome = true
            } else if (entry.kmcode.match(purchaseSubj)) {
              containsPurchase = true
            } else if (trafficSubj != null && entry.kmcode.match(trafficSubj)) {
              containsTraffic = true
            } else if (entry.kmcode.match(inTaxSubj)) {
              containsInTax = true
            }
          })
        }
        let invoiceType = this.invoiceType
        if (!invoiceType) {
          invoiceType = this.isSmallCorp ? 1 : 2
        }
        let voucherData = this.voucherData.zdrq
        if (invoiceType === 3 || voucherData < '2019-04-01') {
          containsTraffic = false
        }
        return (!this.isSmallCorp && containsInTax &&
          ((invoiceType === 1 && containsPurchase) || containsTraffic)) ||
          containsIncome
      }
      return show
    },
    isInsert () {
      return this.paramData && this.paramData.isInsert
    },
    hasImage () {
      return (this.voucherData && this.voucherData.tpgid) || !this.$_.isEmpty(this.imageGroups)
    },
    showImageQueryButton () {
      return !this.saved && !this.hasImage
    },
    showSaveButton () {
      return !this.saved || (this.voucherData.pzzt !== 1 && this.voucherData.lydjlx !== 'HCH10535')
    },
    showDelButton () {
      return this.saved && this.voucherData.pzzt !== 1
    },
    showAuditButton () {
      return this.saved && this.voucherData.pzzt === 8
    },
    showUnAuditButton () {
      return this.saved && this.voucherData.pzzt === 1 && this.voucherData.sfjz !== '是'
    },
    voucherIndex () {
      let index = 0
      if (this.saved) {
        index = this.localIdList.findIndex(id => id === this.voucherData.id)
      } else {
        index = this.localIdList.length
      }
      return index
    },
    disablePrevButton () {
      return this.voucherIndex <= 0
    },
    disableNextButton () {
      return this.voucherIndex >= this.localIdList.length - 1
    }
  },
  watch: {
    idList: {
      handler (data) {
        if (data) {
          this.localIdList = data
        }
      },
      immediate: true
    }
  },
  created () {
    this.fetchTaxItemData()
  },
  activated () {
    if (this.id) {
      this.loadVoucherById(this.id)
    } else if (this.data) {
      this.voucherData = this.data
      if (this.data.tpgid) {
        this.imageViewVisible = true
      } else {
        this.imageViewVisible = false
      }
      if (this.voucherData.tpgid) {
        this.enableQuickCreate()
      } else {
        this.disableQuickCreate()
      }
    }
  },
  components: {
    VoucherEditTable,
    QuickCreateVoucher,
    CommonTemplateDialog,
    VoucherCashFlowDialog,
    VoucherTaxItemDialog
  },
  methods: {
    loadVoucherById (id) {
      if (!id) {
        return
      }
      this.showLoading('加载中...')
      this.$api.Voucher.queryById({
        id
      }).then(res => {
        this.closeLoading()
        this.voucherData = res.data
        if (this.voucherData.tpgid) {
          this.imageViewVisible = true
        } else {
          this.imageViewVisible = false
        }
        if (this.voucherData.pzzt === -1) {
          this.enableQuickCreate()
        } else {
          this.disableQuickCreate()
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    save (autoAddNew) {
      this.showLoading('保存中...')
      this.$refs.voucherTable.saveVoucher().then(data => {
        this.closeLoading()
        const queryBillInfos = true
        this.$bus.$emit('queryBillInfos', queryBillInfos)
        if (this.outsideNewVoucher) {
          this.voucherData = {}
          this.$nextTick(() => {
            closeTag(this.$route)
          })
        } else {
          if (!this.localIdList.find(id => id === data.id)) {
            this.localIdList.push(data.id)
          }
          if (this.isInsert) {
            this.clearRouteParam()
          }
          if (autoAddNew === true) {
            this.newVoucher()
          } else {
            this.voucherData = data
          }
        }
      }).catch(error => {
        this.closeLoading()
        console.log(error)
      })
    },
    newVoucher () {
      this.voucherData = {}
    },
    deleteVoucher () {
      this.showLoading('删除中...')
      this.$refs.voucherTable.deleteVoucher().then((data) => {
        this.closeLoading()
        this.newVoucher()
        let index = this.localIdList.findIndex(id => id === data.id)
        if (index > -1) {
          this.localIdList.splice(index, 1)
        }
      }).catch(e => {
        this.closeLoading()
        console.log(e)
      })
    },
    prevVoucher () {
      let index = this.voucherIndex - 1
      if (index >= 0 && index <= this.idList.length) {
        this.checkVoucherChange('凭证尚未保存, 是否切换?').then(() => {
          this.loadVoucherById(this.idList[index])
        })
      }
    },
    nextVoucher () {
      let index = this.voucherIndex + 1
      if (index >= 0 && index <= this.idList.length) {
        this.checkVoucherChange('凭证尚未保存, 是否切换?').then(() => {
          this.loadVoucherById(this.idList[index])
        })
      }
    },
    copy () {
      this.voucherData = this.getCopyData(this.voucherData)
    },
    getCopyData (source) {
      let copyData = {
        jfhj: source.jfhj,
        dfhj: source.dfhj,
        fp_style: source.fp_style
      }
      let copyChildren = []
      source.children.forEach(child => {
        let copyChild = {...child}
        delete copyChild.bid
        delete copyChild.pid
        copyChildren.push(copyChild)
      })
      copyData.children = copyChildren
      return copyData
    },
    auditVoucher () {
      this.checkAuditDate().then(() => {
        this.$api.Voucher.audit({
          ids: this.voucherData.id,
          mode: 0
        }).then(res => {
          if (res.success) {
            this.voucherData.pzzt = 1
            this.voucherData.sh_user = this.$store.getters.getLoginUserName
            this.$message.success('审核成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    unAuditVoucher () {
      this.$api.Voucher.unAudit({
        ids: this.voucherData.id
      }).then(res => {
        if (res.success) {
          this.voucherData.pzzt = 8
          this.$message.success('反审核成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    scarletLetter () {
      this.$api.Voucher.checkHasScarletLetter({
        pzh: this.voucherData.pzh,
        date: this.voucherData.zdrq
      }).then(res => {
        if (res.success) {
          if (res.data) {
            this.$message.warning('该凭证已经红字回冲过！')
          } else {
            let voucherData = this.getCopyData(this.voucherData)
            voucherData.children.forEach(child => {
              child.zy = `红冲${this.voucherData.zdrq} 记-${this.voucherData.pzh}号凭证`
              child.jfmny = child.jfmny ? -child.jfmny : 0
              child.dfmny = child.dfmny ? -child.dfmny : 0
            })
            this.voucherData = voucherData
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    checkAuditDate () {
      return new Promise((resolve) => {
        let loginDate = this.$store.getters.getLoginDate
        if (loginDate < this.voucherData.zdrq) {
          this.$confirm('审核日期早于凭证日期，是否延用凭证日期作为审核日期？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            resolve()
          }).catch(() => {
            this.$message.error('审核时间不能早于制单日期')
          })
        } else {
          resolve()
        }
      })
    },
    applyTemplate (param) {
      this.$api.Voucher.getTempById(param).then(res => {
        if (res.success) {
          this.$refs.voucherTable.loadVoucherData({
            children: res.rows
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    openImageQueryDialog () {
      let loginDate = this.$store.getters.getLoginDate
      this.imageQueryVisible = true
      this.imageQueryForm.beginDate = loginDate
      this.imageQueryForm.endDate = loginDate
      this.imageQueryForm.corpId = this.$store.getters.getLoginCorpId
    },
    queryImage () {
      this.$api.Voucher.queryImage(this.imageQueryForm).then(res => {
        if (res.success) {
          this.imageGroups = res.rows
          this.imageQueryVisible = false
          if (!this.$_.isEmpty(this.imageGroups)) {
            this.imageViewVisible = true
            this.enableQuickCreate()
          } else {
            this.$message.warning('没找到图片')
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    printVoucher () {
      this.$api.Voucher.printVoucher({
        ids: this.voucherData.id
      })
    },
    onSaveCashFlow () {
      if (this.voucherData) {
        this.voucherData.sffpxjll = '是'
      }
    },
    onDeleteCashFlow () {
      if (this.voucherData) {
        this.voucherData.sffpxjll = '否'
      }
    },
    openAddTemplateDialog () {
      let name = this.voucherData.children[0].zy
      if (name.length > 20) {
        name = name.substring(0, 20)
      }
      this.addTemplateParam.tempName = name
      this.addTemplateVisible = true
      this.$api.BasicSettingApi.VoucherTemplate.getNewCode().then(res => {
        if (res.success) {
          this.addTemplateParam.tempCode = res.data
        }
      })
    },
    saveAsTemplate () {
      this.$api.Voucher.saveAsTemplate({
        children: JSON.stringify(this.voucherData.children),
        ...this.addTemplateParam
      }).then(res => {
        if (res.success) {
          this.addTemplateVisible = false
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    fetchTaxItemData () {
      this.$api.Voucher.getTaxItem().then(res => {
        if (res.rows) {
          this.taxItems = res.rows
        }
        if (res.head) {
          this.taxSubjectRule = res.head
        }
      })
    },
    openCashFlowDialog () {
      if (this.$refs.voucherTable.checkIsVoucherChange()) {
        this.$message.warning('凭证已修改，但未保存，不能录入现金流量')
      } else {
        this.cashFlowVisible = true
      }
    },
    openTaxItemDialog () {
      if (this.$refs.voucherTable.checkIsVoucherChange()) {
        this.$message.warning('凭证已修改，但未保存，不能录入税表表项')
      } else {
        this.taxItemVoucher = this.$refs.voucherTable.getVoucherDataDisplay()
        this.taxItemVisible = true
      }
    },
    enableQuickCreate () {
      this.quickCreateEnable = true
      this.quickCreateVisible = true
    },
    disableQuickCreate () {
      this.quickCreateEnable = false
    },
    applyQuickCreate (voucherData) {
      this.voucherData = Object.assign({}, this.voucherData, voucherData)
    },
    keydown (e) {
      if (this._inactive) {
        return
      }
      let keyCode = e.keyCode
      if (e.ctrlKey && keyCode === 83) {
        // Ctrl+S
        e.preventDefault()
        this.save()
      } else if (keyCode === 123 || (keyCode === 107 && this.lastPressedKey === keyCode)) {
        this.lastPressedKey = null
        // F12
        e.preventDefault()
        this.save(true)
      }
      this.lastPressedKey = keyCode
    },
    checkVoucherChange (msg) {
      return new Promise((resolve) => {
        if (this.$refs.voucherTable.checkIsVoucherChange()) {
          this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            resolve()
          })
        } else {
          resolve()
        }
      })
    },
    beforeCloseTag () {
      if (this.$refs.voucherTable.checkIsVoucherChange()) {
        return this.$confirm('凭证尚未保存，是否确认离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        })
      }
    }
  },
  mounted () {
    document.addEventListener('keydown', this.keydown)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keydown)
  }
}
</script>

<style scoped>
  .quick-create-popup {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    z-index: 1;
  }

  .short-key-ref {
    display: inline-block;
    padding: 6px 15px;
    margin-left: 15px;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    line-height: 1;
  }

  .icon-short-key {
    display: inline-block;
    width: 32px;
    height: 18px;
    background: url("~@/assets/voucher/ico-shortcut-key.png") no-repeat;
    vertical-align: middle;
  }
</style>
