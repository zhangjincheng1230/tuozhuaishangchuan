<template>
  <div class="app-main">
    <div
      class="kj-container"
      v-loading="loading"
      :element-loading-text="loadingText"
      :element-loading-spinner="loadingSpinner">
      <div class="kj-head">
        <div class="query-info">
          <div>
            <div class="nav-query-period">
              <el-button
                @click="prevPeriod"
                :disabled="disablePrevPeriodButton"
                type="primary"
                class="period-nav"
                icon="el-icon-caret-left"></el-button>
              <el-date-picker
                v-model="navPeriodRange"
                :clearable="false"
                value-format="yyyy-MM"
                type="monthrange"
                :range-separator="queryPeriodDisplay"
                unlink-panels
                :picker-options="navPickerOptions"
                class="query-date-picker">
              </el-date-picker>
              <el-button
                @click="nextPeriod"
                type="primary"
                class="period-nav"
                icon="el-icon-caret-right"></el-button>
            </div>
            <el-input v-model="zy" placeholder="请输入摘要" style="width: 125px;">
              <template #suffix>
                <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="query"></i>
              </template>
            </el-input>
            <el-popover
              placement="bottom"
              title="凭证查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <VoucherQueryForm
                ref="queryForm"
                :period-range="navPeriodRange">
              </VoucherQueryForm>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button @click="clearQueryForm">清除</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <template slot="reference">
                <el-button>更多<i class="el-icon-s-operation el-icon--right"></i></el-button>
              </template>
            </el-popover>
          </div>
        </div>
        <div class="kj-button-group">
          <el-dropdown>
            <el-button @click="copyVoucher">
              复制<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="copyVoucherByMonth">按月复制</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <el-button @click="audit">
              审核<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="unAudit">反审核</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <el-button @click="account">
              记账<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="unAccount">反记账</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <el-button>
              凭证整理<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="openAutoSortDialog">自动整理</el-dropdown-item>
                <el-dropdown-item @click.native="openManualSortDialog">手动整理</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <el-button @click="printVoucher">
              打印<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="showPrintInventoryButton" @click.native="printInventory">打印出入库
                </el-dropdown-item>
                <el-dropdown-item @click.native="printSettingVisible = true">打印设置</el-dropdown-item>
                <el-dropdown-item @click.native="printCoverVisible = true">打印封皮</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown>
            <el-button @click="exportVoucher">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="importVisible = true">导入</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button @click="deleteVoucher">删除</el-button>
          <el-button @click="openCreatorModifyDialog">修改制单人</el-button>
          <el-dropdown>
            <el-button @click="mergeVoucher">
              凭证合并<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="mergeSettingVisible = true">合并规则</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div
        class="kj-main">
        <div class="voucher-list">
          <div class="voucher-list-head">
            <div class="col-resize-wrapper">
              <div
                class="col_resize" :style="{left: tdIndexWidth + 'px'}"
                @mousedown="handleMouseDown($event, 'tdIndexWidth')"></div>
              <div
                class="col_resize" :style="{left: (tdIndexWidth + tdZyWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdZyWidth')"></div>
              <div
                class="col_resize" :style="{left: (tdIndexWidth + tdZyWidth + tdKmWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdKmWidth')"></div>
              <div
                class="col_resize" :style="{left: (tdIndexWidth + tdZyWidth + tdKmWidth + tdJfWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdJfWidth')"></div>
              <div
                class="col_resize"
                :style="{left: (tdIndexWidth + tdZyWidth + tdKmWidth + tdJfWidth + tdDfWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdDfWidth')"></div>
            </div>
            <table class="head-table" border="0" cellspacing="0" cellpadding="0"
                   :style="{width: (tdIndexWidth + tdZyWidth + tdKmWidth + tdJfWidth + tdDfWidth) + 'px'}">
              <tr>
                <td :style="{width: tdIndexWidth + 'px',textAlign: 'left'}">
                  <div style="padding-left: 8px;">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"></el-checkbox>
                    全选
                  </div>
                </td>
                <td id="tdHeaderZy" :style="{width: tdZyWidth + 'px'}">摘要</td>
                <td :style="{width: tdKmWidth + 'px'}">会计科目</td>
                <td :style="{width: tdJfWidth + 'px'}">借方金额</td>
                <td :style="{width: tdDfWidth + 'px'}">贷方金额</td>
              </tr>
            </table>
          </div>
          <div class="voucher-list-body">
            <el-checkbox-group v-model="checkIndexes">
              <div v-for="(item, index) in voucherData" :key="item.id" style="position: relative">
                <div style="position: absolute; left: 0; top: 9px;">
                  <el-checkbox :label="index" style="margin: 0 5px;"><span></span></el-checkbox>
                </div>
                <VoucherListTable
                  :voucher-data="item"
                  :voucher-data-list="voucherData"
                  @click.native="checkItem($event, index)"
                  @delete="reFetchData"
                  :index-width="tdIndexWidth"
                  :abstract-width="tdZyWidth"
                  :subject-width="tdKmWidth"
                  :debit-width="tdJfWidth"
                  :credit-width="tdDfWidth">
                </VoucherListTable>
              </div>
            </el-checkbox-group>
          </div>
          <Pagination
            :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
            :page-sizes="[50, 100, 300, 500, 1000]"
            @pagination="paginationQuery"></Pagination>
        </div>
      </div>
    </div>
    <VoucherCopyDialog
      :vouchers="copyVouchers"
      :period="copyPeriod"
      :visible.sync="copyDialogVisible">
    </VoucherCopyDialog>
    <el-dialog
      title="自动整理"
      :visible.sync="autoSortVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-loading="sortLoading"
      element-loading-text="整理中..."
      :element-loading-spinner="loadingSpinner"
      width="450px">
      <div style="padding-left: 10px;">
        <div class="el-form-item">
          <div class="el-form-item__label">整理期间:</div>
          <div class="el-form-item__content" style="margin-left: 60px;">
            <el-date-picker
              v-model="autoSortParam.periodRange"
              value-format="yyyy-MM"
              :clearable="false"
              unlink-panels
              :picker-options="monthPickerOptions"
              type="monthrange">
            </el-date-picker>
          </div>
        </div>
        <div class="el-form-item">
          <div class="el-form-item__label">选择公司:</div>
          <div class="el-form-item__content">
            <el-input
              v-model="autoSortParam.corpName"
              :readonly="true" style="width: 315px;">
              <template #suffix>
                <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="corpDialogVisible = true"></i>
              </template>
            </el-input>
          </div>
        </div>
        <div class="el-form-item">
          <div style="margin-bottom: 10px;">自动整理凭证号:</div>
          <div style="margin-left: 15px;">
            <div>
              <el-radio v-model="autoSortParam.sort_type" label="auto_number">按凭证号顺次前移补齐断号</el-radio>
            </div>
            <div>
              <el-radio v-model="autoSortParam.sort_type" label="auto_date">按凭证日期次序重新编号</el-radio>
            </div>
            <div>
              <el-radio v-model="autoSortParam.sort_type" label="auto_uploadpic">按图片上传顺序，凭证号顺序编号</el-radio>
            </div>
          </div>
        </div>
        <div>
          <div style="margin-bottom: 10px;">自动整理出入库单据编号:</div>
          <div style="margin-left: 15px;">
            <div>
              <el-radio v-model="autoSortParam.sort_type" label="auto_churukubillcode">按出入库单据编号顺次前移补齐断号</el-radio>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="autoSortVisible = false">取 消</el-button>
          <el-button type="primary" @click="sortVoucher">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <CorpDialog
      :visible.sync="corpDialogVisible"
      @selected="handleCorpSelect"></CorpDialog>
    <el-dialog
      title="修改制单人"
      :visible.sync="creatorModifyVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      v-loading="creatorModifyLoading"
      element-loading-text="修改中..."
      :element-loading-spinner="loadingSpinner"
      width="360px">
      <div style="padding-left: 10px;">
        <div class="el-form-item">
          <div class="el-form-item__label">新制单人:</div>
          <div class="el-form-item__content" style="margin-left: 60px;">
            <el-select
              v-model="newCreator" filterable>
              <el-option
                v-for="user in powerUser"
                :key="user.uid"
                :value="user.uid"
                :label="user.ucode + ' ' + user.uname">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="creatorModifyVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyCreator">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      title="合并规则"
      :visible.sync="mergeSettingVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false" width="450px">
      <div style="padding-left: 10px;">
        <div class="el-form-item">
          <div style="margin-bottom: 10px;">凭证合并规则:</div>
          <div style="margin-left: 15px;">
            <div>
              <el-radio v-model="mergeSetting.group_type" :label="2">按往来单位分别生成凭证</el-radio>
            </div>
            <div v-if="mergeSetting.group_type === 2">
              无往来单位的凭证
              <el-radio v-model="mergeSetting.no_contact_rule" :label="1">合成一张</el-radio>
              <el-radio v-model="mergeSetting.no_contact_rule" :label="2">不合并</el-radio>
            </div>
            <div>
              <el-radio v-model="mergeSetting.group_type" :label="1">勾选凭证生成一张凭证</el-radio>
            </div>
          </div>
        </div>
        <div class="el-form-item">
          <p>
            说明：不支持进销项合并、期末处理凭证合并、手动录入期末处理凭证合并、专普票凭证合并
          </p>
        </div>
        <div class="el-form-item">
          <div style="margin-bottom: 10px;">科目相同的分录合并规则:</div>
          <div style="margin-left: 15px;">
            <div>
              <el-radio v-model="mergeSetting.entry_type" :label="1">同方向分录合并</el-radio>
            </div>
            <div>
              <el-radio v-model="mergeSetting.entry_type" :label="2">同方向， 不同方向分录均合并</el-radio>
            </div>
            <div>
              <el-checkbox v-model="mergeSetting.not_merge_bank" true-label="是" false-label="否">银行科目不合并</el-checkbox>
            </div>
          </div>
        </div>
        <div class="el-form-item">
          <p>
            说明：不支持不同税目分录合并
          </p>
        </div>
        <div class="el-form-item">
          <div style="margin-bottom: 10px;">摘要生成规则:</div>
          <div style="margin-left: 15px;">
            <el-radio v-model="mergeSetting.abstract_type" :label="1">自动汇总</el-radio>
            <el-radio v-model="mergeSetting.abstract_type" :label="2">手工填制</el-radio>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="mergeSettingVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveMergeSetting">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      title="摘要"
      :visible.sync="mergeAbstractVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false" width="360px">
      <div style="padding-left: 10px;">
        <div class="el-form-item">
          <div class="el-form-item__label">摘要:</div>
          <div class="el-form-item__content" style="margin-left: 60px;">
            <el-input
              v-model="mergeAbstract"
              type="textarea"
              maxlength="200"></el-input>
          </div>
        </div>
        <div>
          提示：确认要按所选合并规则合并勾选的2张凭证？合并后无法拆分，请慎重操作
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="mergeAbstractVisible = false">取 消</el-button>
          <el-button type="primary" @click="doMergeVoucher">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <UploaderDialog
      :visible.sync="importVisible"
      name="impfile"
      :param="{}"
      @submit="importVoucher">
      <template #description>
        <div style="text-align: center;">没有导入模板
          <el-button type="text" @click="downloadTemplate">点击下载</el-button>
        </div>
      </template>
    </UploaderDialog>
    <VoucherPrintSettingDialog :visible.sync="printSettingVisible">
    </VoucherPrintSettingDialog>
    <VoucherPrintCoverDialog :visible.sync="printCoverVisible">
    </VoucherPrintCoverDialog>
    <VoucherManualSort
      :visible.sync="manualSortVisible"
      :period="manualSortPeriod"
      :corp-id="manualSortCorp"
      @sort="reFetchData">
    </VoucherManualSort>
  </div>
</template>

<script>
import VoucherCopyDialog from './components/VoucherCopyDialog'
import VoucherPrintSettingDialog from './components/VoucherPrintSettingDialog'
import VoucherPrintCoverDialog from './components/VoucherPrintCoverDialog'
import VoucherListTable from '@/components/Voucher/VoucherListTable'
import VoucherQueryForm from './components/VoucherQueryForm'
import Pagination from '@/components/Pagination'
import CorpDialog from '@/components/reference/CorpDialog'
import UploaderDialog from '@/components/UploaderDialog'
import VoucherManualSort from './components/VoucherManualSort'
import loading from '@/mixins/loading'
import datePickerMixin from '@/mixins/date-picker'
import relateDataMixin from '@/mixins/relate-data'
import scrollBehavior from '@/mixins/scrollBehavior'
import {defaultDateFormat, formatDate, getPreviousPeriod, getNextPeriod, getMonthBegin, getMonthEnd} from '@/utils'
import dayjs from 'dayjs'

export default {
  name: 'voucher-manage',
  mixins: [loading, datePickerMixin, relateDataMixin, scrollBehavior],
  components: {
    VoucherCopyDialog,
    VoucherListTable,
    VoucherQueryForm,
    Pagination,
    CorpDialog,
    UploaderDialog,
    VoucherPrintSettingDialog,
    VoucherPrintCoverDialog,
    VoucherManualSort
  },
  props: {
    routeParam: {
      type: Object,
      default: null
    }
  },
  data () {
    let loginDate = this.$store.getters.getLoginDate
    let loginPeriod = loginDate.substring(0, 7)
    return {
      scrollParentSelector: '.voucher-list > .voucher-list-body',
      total: 0,
      // 摘要
      zy: '',
      navPeriodRange: [loginPeriod, loginPeriod],
      pageInfo: {
        page: 1,
        rows: 50
      },
      queryVisible: false,
      queryParam: {},
      voucherData: [],
      checkIndexes: [],
      allIndex: [],
      tdIndexWidth: 80,
      tdZyWidth: 250,
      tdKmWidth: 400,
      tdJfWidth: 200,
      tdDfWidth: 200,
      colWidthName: ['tdIndexWidth', 'tdZyWidth', 'tdKmWidth', 'tdJfWidth', 'tdDfWidth'],
      dragging: false,
      draggingElement: null,
      draggingColumnName: null,
      dragState: {},
      copyDialogVisible: false,
      copyVouchers: null,
      copyPeriod: null,
      // 自动整理对话框
      autoSortVisible: false,
      sortLoading: false,
      autoSortParam: {
        sort_type: 'auto_number'
      },
      // 选择公司对话框
      corpDialogVisible: false,
      // 修改制单人对话框
      creatorModifyVisible: false,
      creatorModifyLoading: false,
      powerUser: null,
      newCreator: null,
      mergeSettingVisible: false,
      mergeSetting: {
        group_type: 1,
        no_contact_rule: 1,
        entry_type: 1,
        not_merge_bank: '否',
        abstract_type: 1
      },
      mergeAbstractVisible: false,
      mergeAbstract: '',
      importVisible: false,
      printSettingVisible: false,
      printCoverVisible: false,
      // 存货成本核算方式
      inventoryCostMode: 2,
      columnSetting: {},
      manualSortVisible: false,
      manualSortPeriod: null,
      manualSortCorp: null,
      navPickerOptions: {
        disabledDate: (date) => {
          if (this.loginCorpBeginDateFirstDay === null) {
            return false
          }
          return date.getTime() < this.loginCorpBeginDateFirstDay.getTime()
        },
        onPick: ({minDate, maxDate}) => {
          if (maxDate && minDate) {
            this.navPeriodRange = [formatDate(minDate).substring(0, 7), formatDate(maxDate).substring(0, 7)]
            this.onNavPeriodChange()
          }
        }
      }
    }
  },
  computed: {
    queryPeriodDisplay () {
      let displayText
      if (this.queryParam.begindate) {
        displayText = this.queryParam.begindate
        if (this.queryParam.begindate !== this.queryParam.enddate) {
          displayText += ' - ' + this.queryParam.enddate
        }
      } else {
        displayText = this.queryParam.beginPeriod
        if (this.queryParam.beginPeriod !== this.queryParam.endPeriod) {
          displayText += ' - ' + this.queryParam.endPeriod
        }
      }
      return displayText
    },
    loginCorp () {
      return this.$store.getters.getLoginCorp
    },
    loginDate () {
      return this.$store.getters.getLoginDate
    },
    isIndeterminate () {
      return this.checkIndexes.length > 0 && this.allIndex.length !== this.checkIndexes.length
    },
    checkAll: {
      get () {
        return this.checkIndexes.length > 0 && this.allIndex.length === this.checkIndexes.length
      },
      set (val) {
        if (val === true) {
          this.checkIndexes = [...this.allIndex]
        } else {
          this.checkIndexes = []
        }
      }
    },
    disablePrevPeriodButton () {
      let prevPeriod = getPreviousPeriod(this.navPeriodRange[0])
      return this.isBeforeCorpBegin(prevPeriod)
    },
    showPrintInventoryButton () {
      return this.$store.getters.inventoryMode === '2' && this.inventoryCostMode !== 2
    }
  },
  watch: {
    routeParam (param) {
      if (param) {
        this.fetchData(this.processRouteParam(param))
      }
    }
  },
  created () {
    this.$api.GeneralInventoryApi.InventorySetting.query().then(res => {
      if (res.success && res.rows) {
        this.inventoryCostMode = res.rows.chcbjzfs
      }
    })
    this.readColumnSetting()
    this.queryMergeSetting()
    this.saveColumnSetting = this.$_.debounce(this.saveColumnSetting, 5000)
  },
  mounted () {
    this.fetchData(this.processRouteParam(this.routeParam))
    this.$el.querySelector('.voucher-list-body').addEventListener('scroll', () => {
      this.$el.querySelector('.voucher-list-head').style.left = (-this.$el.querySelector('.voucher-list-body').scrollLeft) + 'px'
    })
  },
  methods: {
    fetchData (param) {
      if (param === undefined || param === null) {
        param = this.getQueryParam()
        if (param === false) {
          return
        }
      }
      this.checkQueryParam(param).then((param) => {
        this.queryParam = param
        this.showLoading('数据加载中，请稍候...')
        this.$api.Voucher.queryVoucher(param).then(res => {
          this.closeLoading()
          this.checkAll = false
          this.voucherData = res.rows
          this.total = res.total
          let allIndex = []
          for (let i = 0; i < res.rows.length; i++) {
            allIndex.push(i)
          }
          this.allIndex = allIndex
        }).catch(() => {
          this.closeLoading()
        })
      })
    },
    checkQueryParam (param) {
      return new Promise(resolve => {
        let isOverLength = false
        let maxAllowDate
        if (param.dateType === '1') {
          if (param.begindate > param.enddate) {
            this.$message.warning('开始日期不能大于结束日期')
            return
          }
          maxAllowDate = dayjs(param.begindate).add(12, 'month').subtract(1, 'day').format(defaultDateFormat)
          isOverLength = maxAllowDate < param.enddate
        } else {
          if (param.beginPeriod > param.endPeriod) {
            this.$message.warning('开始日期不能大于结束日期')
            return
          }
          maxAllowDate = dayjs(param.beginPeriod + '-01').add(11, 'month').format(defaultDateFormat.substring(0, 7))
          isOverLength = maxAllowDate < param.endPeriod
        }
        if (isOverLength) {
          this.$confirm('系统支持查询的最大期间为12个月，您查询的期间数据已超过12个月，系统将为您自动截取数据', '提示', {
            showCancelButton: false,
            showClose: false,
            type: 'info ',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            if (param.dateType === '1') {
              param.enddate = maxAllowDate
            } else {
              param.endPeriod = maxAllowDate
            }
            resolve(param)
          }).catch(() => {
          })
        } else {
          resolve(param)
        }
      })
    },
    processRouteParam (param) {
      if (param) {
        if (param.begindate || param.enddate) {
          param.dateType = '1'
          if (!param.begindate) {
            param.begindate = getMonthBegin(this.loginDate)
          }
          if (!param.enddate) {
            param.enddate = getMonthEnd(this.loginDate)
          }
        } else {
          if (!param.beginPeriod) {
            param.beginPeriod = this.loginCorp.bdate.substring(0, 7)
          }
          if (!param.endPeriod) {
            param.endPeriod = this.loginDate.substring(0, 7)
          }
          param.dateType = '2'
        }
      }
      return param
    },
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    reFetchData () {
      this.pageInfo.page = 1
      this.fetchData()
    },
    paginationQuery () {
      this.fetchData()
    },
    onNavPeriodChange () {
      this.$nextTick(() => {
        this.reFetchData()
      })
    },
    prevPeriod () {
      let period = getPreviousPeriod(this.navPeriodRange[0])
      this.navPeriodRange = [period, period]
      this.onNavPeriodChange()
    },
    nextPeriod () {
      let period = getNextPeriod(this.navPeriodRange[0])
      this.navPeriodRange = [period, period]
      this.onNavPeriodChange()
    },
    clearQueryForm () {
      return this.$refs.queryForm.resetForm()
    },
    getQueryParam () {
      let param = this.$refs.queryForm.getQueryParam()
      if (param !== false) {
        param.zy = this.zy
        Object.assign(param, this.pageInfo)
      }
      return param
    },
    checkItem: function (event, index) {
      for (let r = 0; r < this.checkIndexes.length; r++) {
        if (this.checkIndexes[r] === index) {
          this.checkIndexes.splice(r, 1)
          return false
        }
      }
      this.checkIndexes.push(index)
    },
    handleMouseDown (event, name) {
      this.draggingElement = event.target
      this.dragging = true
      this.draggingColumnName = name
      this.dragState = {
        startMouseLeft: event.clientX,
        startLeft: this.draggingElement.offsetLeft,
        originWidth: this[name]
      }
      const handleMouseMove = this.$_.debounce((event) => {
        if (this.dragging) {
          const deltaLeft = event.clientX - this.dragState.startMouseLeft
          let newWidth = this.dragState.originWidth + deltaLeft
          if (newWidth > 60) {
            this.draggingElement.style.left = (this.dragState.startLeft + deltaLeft) + 'px'
            this[this.draggingColumnName] = newWidth
          }
        }
      }, 100)
      const handleMouseUp = () => {
        if (this.dragging) {
          this.dragging = false
          this.draggingElement = null
          this.draggingColumnName = null
          this.dragState = {}
          this.saveColumnSetting()
        }
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    readColumnSetting () {
      this.$api.Voucher.readColumnSetting().then(res => {
        if (res.success && res.rows) {
          this.columnSetting = JSON.parse(res.rows)
          if (this.columnSetting.sortSetting) {
            this.autoSortParam.sort_type = this.columnSetting.sortSetting.sort_type
          }
          if (this.columnSetting.colSetting) {
            this.colWidthName.forEach(name => {
              if (this.columnSetting.colSetting[name]) {
                this[name] = this.columnSetting.colSetting[name]
              }
            })
          }
        }
      })
    },
    saveColumnSetting () {
      let columnSetting = {}
      this.colWidthName.forEach(name => {
        let width = this[name]
        if (width < 60) {
          width = 60
          this[name] = width
        }
        columnSetting[name] = width
      })
      this.columnSetting.colSetting = columnSetting
      this.$api.Voucher.saveColumnSetting({
        setting: JSON.stringify(this.columnSetting)
      })
    },
    saveSortSetting () {
      this.columnSetting.sortSetting = {
        sort_type: this.autoSortParam.sort_type
      }
      this.$api.Voucher.saveColumnSetting({
        setting: JSON.stringify(this.columnSetting)
      })
    },
    printVoucher () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要打印的数据')
        return
      }
      let idArray = []
      this.checkIndexes.forEach(index => idArray.push(this.voucherData[index].id))
      this.$api.Voucher.printVoucher({
        ids: idArray.join(',')
      })
    },
    getSelections () {
      let idArray = []
      this.checkIndexes.forEach(index => idArray.push(this.voucherData[index].id))
      return idArray
    },
    copyVoucher () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要复制的数据')
        return
      }
      let vouchers = []
      this.checkIndexes.forEach(index => {
        let voucher = this.voucherData[index]
        vouchers.push({
          id: voucher.id,
          corpId: voucher.corpId
        })
      })
      this.copyPeriod = this.voucherData[this.checkIndexes[0]].qj
      this.copyVouchers = vouchers
      this.copyDialogVisible = true
    },
    copyVoucherByMonth () {
      this.copyVouchers = null
      this.copyPeriod = this.queryParam.beginPeriod || this.queryParam.begindate.substring(0, 7)
      this.copyDialogVisible = true
    },
    audit () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要审核的数据')
        return
      }
      let hasPrecedeDate = false
      let idArray = []
      this.checkIndexes.forEach(index => {
        let voucher = this.voucherData[index]
        if (hasPrecedeDate === false && this.loginDate < voucher.zdrq) {
          hasPrecedeDate = true
        }
        idArray.push(voucher.id)
      })

      let doAudit = (mode) => {
        this.$api.Voucher.audit({
          ids: idArray.join(','),
          mode
        }).then(res => {
          if (res.success) {
            let userName = this.$store.getters.getLoginUserName
            this.updateVoucherStatus('audit', res.data, 1, userName)
            if (res.status === 2) {
              this.$message.warning(res.msg)
            } else {
              this.$message.success(res.msg)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      if (hasPrecedeDate) {
        this.$confirm('审核日期早于凭证日期，是否延用凭证日期作为审核日期？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          doAudit(0)
        }).catch(() => {
          doAudit(1)
        })
      } else {
        doAudit(1)
      }
    },
    unAudit () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要反审核的数据')
        return
      }
      let idArray = this.getSelections()
      this.$api.Voucher.unAudit({
        ids: idArray.join(',')
      }).then(res => {
        if (res.success) {
          this.updateVoucherStatus('audit', res.data, 8, '')
          this.checkAll = false
          if (res.status === 2) {
            this.$message.warning(res.msg)
          } else {
            this.$message.success(res.msg)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    account () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要记账的数据')
        return
      }
      let hasPrecedeDate = false
      let idArray = []
      this.checkIndexes.forEach(index => {
        let voucher = this.voucherData[index]
        if (hasPrecedeDate === false && voucher.pzzt === 1 && this.loginDate < voucher.zdrq) {
          hasPrecedeDate = true
        }
        idArray.push(voucher.id)
      })

      let doAccount = (mode) => {
        this.$api.Voucher.account({
          ids: idArray.join(','),
          mode
        }).then(res => {
          if (res.success) {
            let userName = this.$store.getters.getLoginUserName
            this.updateVoucherStatus('account', res.data, '是', userName)
            if (res.status === 2) {
              this.$message.warning(res.msg)
            } else {
              this.$message.success(res.msg)
            }
            this.checkAll = false
          } else {
            this.$message.error(res.msg)
          }
        })
      }
      if (hasPrecedeDate) {
        this.$confirm('记账日期早于审核日期，是否延用审核日期作为记账日期？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          doAccount(0)
        }).catch(() => {
          doAccount(1)
        })
      } else {
        doAccount(1)
      }
    },
    unAccount () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要反记账的数据')
        return
      }
      let idArray = this.getSelections()
      this.$api.Voucher.unAccount({
        ids: idArray.join(',')
      }).then(res => {
        if (res.success) {
          this.updateVoucherStatus('account', res.data, '否', '')
          if (res.status === 2) {
            this.$message.warning(res.msg)
          } else {
            this.$message.success(res.msg)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateVoucherStatus (type, ids, status, userName) {
      if (ids === undefined || Object.entries(ids).length === 0) {
        return
      }
      this.checkIndexes.forEach(index => {
        let voucher = this.voucherData[index]
        if (ids[voucher.id]) {
          if (type === 'audit') {
            if (voucher.zdrq > this.loginDate) {
              voucher.shrq = voucher.zdrq
            } else {
              voucher.shrq = this.loginDate
            }
            voucher.pzzt = status
            voucher.shr = userName
          } else if (type === 'account') {
            voucher.sfjz = status
            voucher.jzr = userName
          }
        }
      })
    },
    handleCorpSelect (corps) {
      let corpNames = []
      let corpIds = []
      corps.forEach(corp => {
        corpNames.push(corp.uname)
        corpIds.push(corp.pk_gs)
      })
      let corpName = corpNames.join(',')
      if (this.autoSortVisible === true) {
        this.autoSortParam.corpName = corpName
        this.autoSortParam.companys = corpIds.join(',')
      }
    },
    openAutoSortDialog () {
      let beginPeriod = this.queryParam.beginPeriod || this.queryParam.begindate.substring(0, 7)
      let endPeriod = this.queryParam.endPeriod || this.queryParam.enddate.substring(0, 7)
      this.autoSortParam.periodRange = [beginPeriod, endPeriod]
      if (!this.autoSortParam.corpName) {
        this.autoSortParam.corpName = this.loginCorp.uname
      }
      this.autoSortVisible = true
    },
    openManualSortDialog () {
      let corpName = this.loginCorp.uname
      let period = this.queryParam.begindate ? this.queryParam.begindate.substring(0, 7)
        : this.queryParam.beginPeriod
      this.$confirm(`将手工整理<span style="color:red;">${corpName}</span>${period}期间的所有凭证，已打印凭证请勿整理。确定要整理吗？`,
        '提示', {
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
        this.manualSortPeriod = period
        if (this.queryParam.pk_corp) {
          this.manualSortCorp = this.queryParam.pk_corp.split(',')[0]
        } else {
          this.manualSortCorp = this.loginCorp.pk_gs
        }
        this.manualSortVisible = true
      })
    },
    sortVoucher () {
      this.$confirm('将自动整理全部所选凭证，已打印凭证请勿整理。确定要整理吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.saveSortSetting()
        this.sortLoading = true
        this.$api.Voucher.sort({
          companys: this.autoSortParam.companys,
          begindate: this.autoSortParam.periodRange[0],
          enddate: this.autoSortParam.periodRange[1],
          sort_type: this.autoSortParam.sort_type
        }).then(res => {
          this.sortLoading = false
          if (res.success) {
            this.autoSortVisible = false
            if (res.msg.indexOf('已经关账') > -1) {
              this.$message.warning(res.msg)
            } else {
              this.$message.success(res.msg)
            }
            this.reFetchData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch(() => {
          this.sortLoading = false
        })
      })
    },
    deleteVoucher () {
      let total = this.checkIndexes.length
      if (total === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      let hasCostTransfer = false
      let costNumber = ''
      let corpSet = new Set()
      let delData = []
      this.checkIndexes.forEach(index => {
        let voucher = this.voucherData[index]
        corpSet.add(voucher.corpId)
        delData.push({
          id: voucher.id,
          pzh: voucher.pzh,
          corpId: voucher.corpId,
          vdef4: voucher.vdef4,
          qj: voucher.qj
        })
        if (hasCostTransfer === false && voucher.lydjlx === 'HP34') {
          hasCostTransfer = true
          costNumber = voucher.pzh
        }
      })
      this.$api.Voucher.checkChannelContract({
        pk_corp: [...corpSet].join(',')
      }).then(res => {
        let contractMsg = res.success && res.msg ? res.msg : ''
        let confirmMsg
        if (hasCostTransfer) {
          confirmMsg = '<span style="color: red">您确认删除已勾选的' +
            total + '张凭证吗？' + contractMsg + '（该操作不可逆，其中凭证号为:记' +
            costNumber + '的凭证，删除该凭证会执行反成本结转动作，请谨慎操作）</span>'
        } else {
          confirmMsg = '<span style="color: red">您确认删除已勾选的' +
            total + '张凭证吗？' + contractMsg + '（该操作不可逆）</span>'
        }
        this.$confirm(confirmMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.showLoading('删除中，请稍候...')
          return this.$api.Voucher.deleteVoucher(delData)
        }).then(res => {
          this.closeLoading()
          if (res.success) {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success',
              dangerouslyUseHTMLString: true
            })
          } else {
            /* this.$alert(res.msg, '提示', {
              confirmButtonText: '确定',
              dangerouslyUseHTMLString: true
            }) */
            this.$message.error(res.msg)
          }
          this.reFetchData()
        }).catch(() => {
          this.closeLoading()
        })
      })
    },
    openCreatorModifyDialog () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要修改的数据')
        return
      }
      if (this.powerUser === null) {
        this.fetchPowerUser()
      }
      this.newCreator = null
      this.creatorModifyVisible = true
    },
    fetchPowerUser () {
      this.$api.Voucher.queryPowerUser().then(res => {
        if (res.success) {
          this.powerUser = res.rows
        }
      })
    },
    modifyCreator () {
      let vouchers = []
      this.checkIndexes.forEach(index => {
        let voucher = this.voucherData[index]
        vouchers.push({
          id: voucher.id,
          pzh: voucher.pzh,
          qj: voucher.qj
        })
      })
      this.creatorModifyLoading = true
      this.$api.Voucher.modifyCreator({
        vouchers: JSON.stringify(vouchers),
        creator: this.newCreator
      }).then(res => {
        this.creatorModifyLoading = false
        if (res.success) {
          this.creatorModifyVisible = false
          this.$message.success('修改成功')
          this.reFetchData()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.creatorModifyLoading = false
      })
    },
    queryMergeSetting () {
      this.$api.Voucher.queryMergeSetting().then(res => {
        if (res.success && res.data) {
          this.mergeSetting = Object.assign({}, this.mergeSetting, res.data)
        }
      })
    },
    saveMergeSetting () {
      this.$api.Voucher.saveMergeSetting(this.mergeSetting).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.mergeSettingVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    mergeVoucher () {
      if (this.checkIndexes.length < 2) {
        this.$message.warning('请选择要合并的凭证')
        return
      }
      let firstVoucher = this.voucherData[this.checkIndexes[0]]
      let corpId = firstVoucher.corpId
      let period = firstVoucher.qj
      for (let i = 1; i < this.checkIndexes.length; i++) {
        let voucher = this.voucherData[this.checkIndexes[i]]
        if (corpId !== voucher.corpId) {
          this.$message.warning('公司不同，请检查')
          return
        }
        if (period !== voucher.qj) {
          this.$message.warning('期间不同，请检查')
          return
        }
      }

      if (this.mergeSetting.abstract_type === 2 && this.mergeAbstractVisible === false) {
        // 手工录入摘要
        this.mergeAbstract = ''
        this.mergeAbstractVisible = true
        return
      }
      this.$confirm('确定要按所选的合并规则合并勾选的' +
        this.checkIndexes.length + '张凭证吗，合并后生成的凭证无法拆分，请慎重操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.doMergeVoucher()
      })
    },
    doMergeVoucher () {
      if (this.mergeAbstractVisible === true && this.mergeAbstract === '') {
        this.$message.warning('请输入摘要')
        return
      }
      let idArray = this.getSelections()
      let voucher = this.voucherData[this.checkIndexes[0]]
      let param = {
        pk_corp: voucher.corpId,
        ids: idArray.join(','),
        iscutzy: 'Y',
        zy: this.mergeAbstract
      }
      this.showLoading('合并中...')
      this.$api.Voucher.mergeVoucher(param).then(res => {
        this.closeLoading()
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
            dangerouslyUseHTMLString: true
          })
          if (this.mergeAbstractVisible === true) {
            this.mergeAbstractVisible = false
          }
          // let destVch = res.data
          this.reFetchData()
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    exportVoucher () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请选择要导出的数据')
        return
      }
      let idArray = this.getSelections()
      this.$api.Voucher.exportVoucher({
        ids: idArray.join(',')
      })
    },
    importVoucher (formData) {
      this.$api.Voucher.importVoucher(formData).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.importVisible = false
          this.reFetchData()
        } else if (res.status === -150) {
          this.$confirm('导入凭证号与系统凭证号重复，是否按系统凭证号顺序顺延？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            formData.append('checkNum', 'N')
            this.importVoucher(formData)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    downloadTemplate () {
      this.$api.Voucher.downloadTemplate()
    },
    printInventory () {
      if (this.checkIndexes.length === 0) {
        this.$message.warning('请至少选择一行数据')
        return
      }
      let ids = this.getSelections().join(',')
      this.$api.Voucher.checkInventoryExist({ids}).then(res => {
        if (res.success) {
          this.$api.Voucher.printInventory({ids})
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .voucher-list {
    height: 100%;
  }

  .voucher-list-head {
    position: absolute;
    top: 0;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #DFE5F4;
  }

  .head-table {
    text-align: center;
  }

  .col_resize {
    position: absolute;
    top: 0px;
    width: 2px;
    background-color: #C1C1C1;
    z-index: 100;
    cursor: e-resize;
    height: 40px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .voucher-list-body {
    margin-top: 40px;
    height: calc(100% - 70px);
    overflow: auto;
  }

  .nav-query-period {
    float: left;
    margin-right: 5px;
  }

  .query-date-picker {
    width: auto;
  }

  .period-nav {
    padding: 9px 5px;
  }

  .query-date-picker >>> .el-range-input {
    display: none;
  }

  .query-date-picker >>> .el-range-separator {
    width: auto;
  }

  .query-date-picker >>> .el-input__icon {
    display: none;
  }

  .kj-button-group >>> .el-button + .el-button {
    margin-left: 0;
  }

  .kj-button-group >>> .el-button {
    padding-left: 7px;
    padding-right: 7px;
  }
</style>
