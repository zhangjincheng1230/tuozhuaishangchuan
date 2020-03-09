<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">日期：
            <el-popover
              placement="bottom-start"
              title="资产卡片查询"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="queryFormRef"  :model="queryForm">
                <el-form-item prop="date" size="mini" label="入账日期:" label-width="100"
                              style="border-bottom: 1px dashed #dadada;padding-bottom: 5px;"
                >
                  <el-date-picker
                    v-model="queryForm.date"
                    type="daterange"
                    unlink-panels
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    style="width: 333px"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item  prop="ascode" size="mini" label="卡片编码:" label-width="100">
                  <el-input v-model="queryForm.ascode" style="width: 333px"></el-input>
                </el-form-item>
                <el-form-item prop="asname" size="mini" label="资产名称:" label-width="100">
                  <el-input v-model="queryForm.asname" style="width: 333px"></el-input>
                </el-form-item>
                <el-form-item  prop="assetcategory" label="资产类别:" label-width="75" size="mini">
                  <el-input
                    placeholder
                    suffix-icon="el-icon-search"
                    readonly
                    v-model="queryForm.assetcategory"
                    @click.native="selectAssetsType"
                    style="width: 333px"
                  ></el-input>
                  <AssetsTypeSelect ref="assetsTypeSelect"  @findinde="zclbQryConfirm"></AssetsTypeSelect>
                </el-form-item>
                <el-form-item  prop="pk_assetcategory" label="资产类别id:" label-width="75" size="mini" style="display: none">
                  <el-input
                    v-model="queryForm.pk_assetcategory"
                    style="width: 333px;display: none"
                  ></el-input>
<!--                  <AssetsTypeSelect ref="assetsTypeSelect"  @findinde="zclbQryConfirm"></AssetsTypeSelect>-->
                </el-form-item>
                <div>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item  prop="isclear" label="是否清理:" label-width="100" size="mini">
                        <el-select v-model="queryForm.isclear" placeholder style="width: 100px">
                          <el-option label="是" value="Y"></el-option>
                          <el-option label="否" value="N"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="13">
                      <el-form-item   prop="isqc" class="longStyle" label="录入前已生成凭证:" label-width="100" size="mini">
                        <el-select v-model="queryForm.isqc" placeholder style="width: 100px">
                          <el-option label="是" value="Y"></el-option>
                          <el-option label="否" value="N"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-form-item  prop="istogl"  label="已转总账:" label-width="100" size="mini">
                  <el-select v-model="queryForm.istogl" placeholder style="width: 100px">
                    <el-option label="是" value="Y"></el-option>
                    <el-option label="否" value="N"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small" @click="clearPose" >取消</el-button>
                  <el-button size="small"  @click="clearCondition" >清除</el-button>
                  <el-button size="small" type="primary" @click="confirm">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{qrydate}}
              </span>
            </el-popover>
          </div>
<!--          <span class="query-corp">公司: {{corpname}}</span>-->
        </div>
        <div class="kj-button-group">
          <!--引用header组件中的HeadRight-->
          <el-button size="mini" @click="refreshTable">刷新</el-button>
          <el-dropdown style="margin: 0 0px" @command="addCommand">
            <el-button size="mini" @click="addCardInfo">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="copy">复制</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" @click="editTableRow">修改</el-button>
          <el-dropdown style="margin: 0 0px" @command="onBotoGLCommand">
            <el-button size="mini" @click="onBoToGL('N')">
              转总账
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  command = "merge">合并制证</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" @click="linkzjmx">折旧明细</el-button>
          <el-button size="mini" @click="dateAdjust">年限调整</el-button>
          <el-button size="mini" @click="asseClear">资产清理</el-button>
          <el-button size="mini" @click="tidyCard">卡片整理</el-button>
          <el-button size="mini" @click="deleteTableRows">删除</el-button>
          <el-dropdown style="margin: 0 0px" @command="impCommand">
            <el-button size="mini" @click="zcdr">
              导入
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="0">导出(仅支持查看)</el-dropdown-item>
              <el-dropdown-item command="1">导出(支持导入)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" @click="columnSet">显示列设置</el-button>
        </div>
      </div>
      <div class="kj-main">
<!--        <el-container style = "height:calc(100% - 30px)">-->
          <div class="table-container">
          <el-table
            id="table_list"
            row-key="qcid"
            :data="tableList"
            ref="tableCorpRef"
            stripe
            border
            highlight-current-row
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
            @row-click="handleCurrentChange"
            @selection-change="handleCheckChang"
            height="100%"
            style="width: 100%"
          >
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="卡片编号" key="ascode" width="90"  header-align="center" align="left">
              <template slot-scope="scope"><el-link type="primary" @click.stop.prevent="linkZc(scope.row)">{{scope.row.ascode}}</el-link></template>
            </el-table-column>
            <el-table-column prop="dperiod" key="dperiod"  label="入账日期" width="100"  header-align="center" align="left"></el-table-column>
            <el-table-column prop="zcbm"  key="zcbm"  label="资产编码" show-overflow-tooltip width="90"  header-align="center" align="left"></el-table-column>
            <el-table-column prop="asname" key="asname"   label="资产名称" show-overflow-tooltip width="100"  header-align="center" align="left"></el-table-column>
            <el-table-column prop="assetcate"  key="assetcate" label="资产类别" show-overflow-tooltip width="100"  header-align="center" align="left"></el-table-column>
            <el-table-column prop="zjtype" key="zjtype" label="折旧方式" width="100"  header-align="center" align="left" >
              <template slot-scope="sope">
                <span style="text-align:right">{{sope.row.zjtype| formatZjfs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ulimit" key="ulimit"  label="预计使用年限" width="110"  align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column  prop="nmzj" key="nmzj"  label="月折旧额" width="100"  align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column  prop="dwzj"  key="dwzj"    label="单位折旧" width="100"  align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column  prop="atmny" key="atmny"    label="原值" width="100"  align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column prop="depation" key="depation"   label="总累计折旧" width="100"   align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column prop="sratio" key="sratio"   label="残值率" width="100"  align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column prop="ygcz" key="ygcz"   label="预计残值" width="100"  align="right" header-align="center" :formatter="repformny" v-if="showColumn('ygcz')">
            </el-table-column>
            <el-table-column prop="asvalue" key="asvalue"    label="资产净值" width="100"  align="right" header-align="center" :formatter="repformny" >
            </el-table-column>
            <el-table-column prop="depperiod"  key="depperiod"  label="已计提折旧期间" width="120"  align="left" header-align="center"   v-if="showColumn('depperiod')" >
            </el-table-column>
            <el-table-column prop="periodbegin"  key="periodbegin" label="录入前已生成凭证" width="120"  align="left" header-align="center"  v-if="showColumn('periodbegin')"   >
            </el-table-column>
            <el-table-column prop="inittion" key="inittion"  label="录入前已提折旧" width="120"  align="left" header-align="center"  v-if="showColumn('inittion')"  >
            </el-table-column>
            <el-table-column prop="initperiod" key="initperiod"   label="期初已使用期间数(月)" width="150"  align="left" header-align="center"  v-if="showColumn('initperiod')"  >
            </el-table-column>
            <el-table-column prop="togl"  key="togl"  label="已转总账" width="100"  align="left" header-align="center"  v-if="showColumn('togl')" >
            </el-table-column>
            <el-table-column prop="clear" key="clear"    label="已清理" width="100"  align="left" header-align="center"  v-if="showColumn('clear')">
            </el-table-column>
            <el-table-column prop="depdate"  key="depdate"  label="最后折旧月" width="100"  align="left" header-align="center" v-if="showColumn('depdate')"  >
            </el-table-column>
            <el-table-column prop="voucherno"  key="voucherno"  label="凭证号" width="100" header-align="center" align="left">
              <template slot-scope="scope" v-if="scope.row.voucherno != null">记<el-link  type="primary"  @click.stop.prevent="linkpz(scope.row)">{{scope.row.voucherno}}</el-link></template>
            </el-table-column>
            <el-table-column prop="memo"  key="memo"  label="备注" width="100"  align="left" header-align="center"  v-if="showColumn('memo')" >
            </el-table-column>
          </el-table>
<!--        </el-container>-->
          </div>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="page" :limit.sync="rows" @pagination="pageData"></Pagination>
        </div>
      </div>
    </div>
    <!--显示列设置-->
    <column-set-dialog  ref="columnSetDialog" @updatecolumnsetdata="updatecolumnsetdata"></column-set-dialog>
    <!--新增对话框-->
    <add-dialog  ref="addDialog" @loadtableList="loadtableList" :corpid="queryForm.corpid"></add-dialog>
    <!--年限调整对话框-->
    <adjust-dialog ref = "adjustDialog" :currrow="corpytableSelection" @loadtableList="loadtableList"></adjust-dialog>
    <!--文件导入-->
    <UploaderDialog
      :visible.sync="impDialogVisible"
      name="impfile"
      :title="importTitle"
      @submit="importExcel"
      :param="uploadParam">
      <template #description>
        <div class="import-description">支持标准模板导入,没有导入模板<el-link type="primary"  @click="exportExcel('1')">点击下载</el-link></div>
      </template>
    </UploaderDialog>
    <!--文件导入确定框-->
    <el-dialog title="导入结果"  :visible.sync="impresvisible"  width="540px">
      <div v-html="impresmsg" style="height: 100%;overflow-y: auto">
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="impresvisible = false">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import subjectInfo from '../../components/subjectInfo'
import AssetsTypeSelect from '../../components/AssetsTypeSelect'
import assetMixin from '@/filters/asset'
import addDialog from '@/view/Processes/loadAssetOther/zckp/components/addDialog'
import adjustDialog from '@/view/Processes/loadAssetOther/zckp/components/adjustDialog'
import {formatDate, getMonthBegin, getMonthEnd} from '@/utils'
import UploaderDialog from '@/components/UploaderDialog'
import ColumnSetDialog from '@/view/Processes/loadAssetOther/zckp/components/columnSetDialog'
import datePickerMixin from '@/mixins/date-picker'

export default {
  name: 'zckp',
  mixins: [assetMixin, datePickerMixin],
  components: {
    ColumnSetDialog,
    subjectInfo,
    AssetsTypeSelect,
    Pagination,
    addDialog,
    adjustDialog,
    UploaderDialog,
    datePickerMixin
  },
  data () {
    return {
      nodename: '资产卡片',
      tableList: [],
      height: 0,
      queryForm: {
        date: this.getQryPeriod(),
        ascode: '',
        asname: '',
        assetcategory: '', // 资产类别名称
        pk_assetcategory: '', // 资产类别
        isclear: undefined, // 是否清理
        isqc: undefined, // 录入前已生成凭证
        istogl: undefined, // 已转总账
        corpid: this.$store.getters.currentCorp.pk_gs
      },
      visiblePopover: false,
      corpname: this.$store.getters.currentCorp.uname,
      qrydate: this.getQryPeriod(),
      openSubjectInfo: false,
      loading: false,
      assetsId: '', // 资产类别id
      isShowCompany: false,
      subjectInfo: '',
      subjectoptions: [],
      currentRow: '',
      selectRow: '',
      tableSelection: '', // 选中的数据
      zjid: '', // 主键id
      isavg: true,
      isHide: true,
      isYbr: true,
      isEnter: false,
      subjectRef: this.$store.getters.subSubjectRef,
      total: 0,
      page: 1,
      rows: 50,
      impDialogVisible: false,
      importTitle: '资产导入',
      uploadParam: {}, // 上传参数
      impresmsg: '', // 导入结果
      impresvisible: false, // 导入结果是否显示
      columnsetdata: null // 显示列设置
    }
  },
  props: {
    zcid: { // 资产id
      type: String,
      default: null
    }
  },
  watch: {
    zcid: {
      handler (data) {
        if (data) {
          const param = {
            'pk_assetcard': data
          }
          this.loadtableList(1, param)
        }
      },
      immediate: true
    }
  },
  computed: {
    ids () { // 资产ids
      let ids = []
      if (this.tableSelection && this.tableSelection.length > 0) {
        for (const t of this.tableSelection) {
          ids[ids.length] = t.id_assetcard
        }
      }
      return ids.join(',')
    },
    // 选中的资产复制
    corpytableSelection () {
      if (this.tableSelection && this.tableSelection.length > 0) {
        let tt = JSON.stringify(this.tableSelection[0])
        return JSON.parse(tt)
      }
      return ''
    }
  },
  beforeUpdate () {
  },
  methods: {
    getQryPeriod () {
      if (formatDate(this.$store.getters.currentCorp.bb_date) > getMonthEnd(this.$store.getters.getLoginDate)) {
        return [formatDate(this.$store.getters.currentCorp.bb_date), formatDate(this.$store.getters.currentCorp.bb_date)]
      } else {
        return [formatDate(this.$store.getters.currentCorp.bb_date), getMonthEnd(this.$store.getters.getLoginDate)]
      }
    },
    updatecolumnsetdata (data) {
      this.columnsetdata = data
      this.$nextTick(() => {
        this.$refs.tableCorpRef.doLayout()
      })
    },
    // 是否显示列
    showColumn (columnstr) {
      if (this.columnsetdata && this.columnsetdata[columnstr] && this.columnsetdata[columnstr] === 'Y') {
        return true
      }
      return false
    },
    // 显示列设置
    columnSet () {
      this.$refs.columnSetDialog.show()
    },
    // 格式化金额
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    // 分页查询
    pageData: function (param) {
      this.page = param.page
      this.loadtableList(1)
    },
    // 刷新
    refreshTable: function () {
      this.confirm()
    },
    // 确认查询
    confirm: function () {
      this.getDateToReturn()
      this.loadtableList(1)
    },
    // 查询清理
    clearCondition: function () {
      this.$refs.queryFormRef.resetFields()
    },
    // 查询取消
    clearPose: function () {
      this.getDateToReturn()
    },
    // 查询显示资产类别
    selectAssetsType: function () {
      this.$refs.assetsTypeSelect.show()
    },
    // 新增
    addCardInfo: function () {
      this.$refs.addDialog.show('add')
    },
    // 复制
    addCommand: function (command) {
      if (command === 'copy') {
        this.copy()
      }
    },
    // 链接资产
    linkZc (row) {
      this.$refs.addDialog.show('edit', row)
    },
    // 联查凭证
    linkpz (row) {
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: row.id_voucher
        }
      })
    },
    // 复制
    copy () {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.$refs.addDialog.show('copy', this.currentRow)
    },
    // 修改
    editTableRow: function () {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (this.tableSelection.length > 1) {
        this.$message({showClose: true, message: '请选择一条数据！', type: 'warning'})
        return
      }
      const editrow = this.tableSelection[0]
      if (editrow.togl === '是') {
        this.$message({showClose: true, message: '已转总账，不允许修改！', type: 'warning'})
        return
      }
      if (editrow.clear === '是') {
        this.$message({showClose: true, message: '已清理，不允许修改！', type: 'warning'})
        return
      }
      const param = {
        id_assetcard: editrow.id_assetcard,
        updatets: editrow.updatets,
        periodbegin: editrow.periodbegin
      }
      this.$api.assetsCard.editData(param).then(result => {
        if (result.success) {
          this.$refs.addDialog.show('edit', editrow)
        } else {
          this.$message({showClose: true, message: result.msg, type: 'warning'})
        }
      }).catch(e => {
      })
    },
    // 合并制证
    onBotoGLCommand (command) {
      if (command === 'merge') {
        this.onBoToGL('Y')
      }
    },
    // 转总账
    onBoToGL: function (isMerge) {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.ids = ''
      if (this.tableSelection !== '' && this.tableSelection.length > 0) {
        let param = {
          assetids: this.ids,
          merge: isMerge
        }
        this.$api.assetsCard.trunLedger(param).then(result => {
          this.successMsg(result)
          this.loadtableList(-1)
        }).catch(e => {
        })
      }
    },
    // 卡片整理
    tidyCard: function () {
      this.$confirm('全部卡片编码会重新排序，确认继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.assetsCard.cardTidy().then(result => {
          this.successMsg(result)
          this.loadtableList(-1)
        }).catch(e => {
        })
      })
    },
    // 删除
    deleteTableRows: function () {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      for (const row of this.tableSelection) {
        if (row.togl === '是') {
          this.$message({showClose: true, message: '资产卡片' + row.ascode + '已转总账，不允许删除！', type: 'warning'})
          return
        }
        if (row.clear === '是') {
          this.$message({showClose: true, message: '资产卡片' + row.ascode + '已经清理，不允许删除！', type: 'warning'})
          return
        }
      }

      this.message = '删除'
      if (this.tableSelection !== '' && this.tableSelection.length > 0) {
        this.$confirm('确认删除?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.assetsCard.deleteDataRow({list: JSON.stringify(this.tableSelection)}).then(result => {
            this.successMsg(result)
            if (result.success) {
              this.loadtableList(-1)
            }
          }).catch(e => {
          })
        })
      }
    },
    // 联查折旧明细
    linkzjmx: function () {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (this.tableSelection.length > 1) {
        this.$message({showClose: true, message: '请选择一条数据！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'zjmxz',
        params: {
          linkdata: {
            asset_id: this.tableSelection[0].id_assetcard,
            begindate: getMonthBegin(this.tableSelection[0].adate),
            enddate: getMonthEnd(this.tableSelection[0].depdate),
            corpIds: this.tableSelection[0].id_corp
          }
        }
      })
    },
    // 年限调整
    dateAdjust: function () {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (this.tableSelection.length > 1) {
        this.$message({showClose: true, message: '请选择一条数据！', type: 'warning'})
        return
      }
      let row = this.tableSelection[0]
      if (row.zjtype != null && row.zjtype === 1) {
        this.$message({showClose: true, message: '工作量算法不支持年限调整！', type: 'warning'})
        return
      }
      this.$refs.adjustDialog.show()
    },
    // 资产清理
    asseClear: function () {
      const list = []
      if (this.tableSelection !== '' && this.tableSelection.length > 0) {
        for (const row of this.tableSelection) {
          // 非期初资产，未转总账
          if ((!row.periodbegin || row.periodbegin === '否') && (!row.togl || row.togl === '否')) {
            this.$message({showClose: true, message: '资产卡片' + row.ascode + '未转总账，不允许生成资产清理单！', type: 'warning'})
            return
          }
          if (row.clear === '是') {
            this.$message({showClose: true, message: '资产卡片' + row.ascode + '已经清理，不允许生成资产清理单！', type: 'warning'})
            return
          }
          list.push(row)
        }
      } else {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.$api.assetsCard.asstesClear({list: JSON.stringify(list)}).then(result => {
        this.successMsg(result)
      }).catch(e => {
      })
    },
    // 资产类别确认
    zclbQryConfirm (zclbobj) {
      this.queryForm.assetcategory = zclbobj.name
      this.queryForm.pk_assetcategory = zclbobj.id
    },
    // 新增关闭
    closeDialog: function (formName) {
      this.$refs[formName].resetFields()
    },
    // 加载查询
    loadtableList: function (val, queryParam) {
      // 查询默认值
      let param = Object.assign({}, this.queryForm, {
        begindate: this.queryForm.date[0],
        enddate: this.queryForm.date[1],
        page: this.page,
        rows: this.rows
      })
      this.loading = true
      this.$api.assetsCard.queryData(queryParam != null ? queryParam : param).then(result => {
        this.loading = false
        if (result.success) {
          this.tableList = result.rows
          this.total = result.total
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 导出
    impCommand (value) {
      if (!this.tableSelection || this.tableSelection.length === 0) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (value === '0') { // 导出(仅支持查看)
        this.exportExcel(value)
      } else if (value === '1') { // 导出(支持导入)
        this.exportExcel(value)
      }
    },
    // 资产导入
    zcdr () {
      this.impDialogVisible = true
    },
    // 资产确认导入
    importExcel (formData) {
      this.$api.assetsCard.importExcel(formData).then(res => {
        if (res.success) {
          this.loadtableList(-1)
          if (res.msg) {
            this.impresvisible = true
            this.impresmsg = res.msg
          } else {
            this.impDialogVisible = false
            this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: '导入成功', // this.message !== '' ? this.message + '成功' : '查询成功',
              type: 'success'
            })
          }
        } else {
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    exportExcel (lx) {
      let idstr = ''
      if (this.tableSelection && this.tableSelection.length > 0) {
        for (const tt of this.tableSelection) {
          idstr ? idstr += ",'" + tt.id_assetcard + "'" : idstr = "'" + tt.id_assetcard + "'"
        }
      }
      const formdata = new FormData()
      formdata.append('lx', lx)
      formdata.append('id', idstr)
      this.$api.assetsCard.expExcel(this.nodename + formatDate(new Date()), formdata)
    },
    handleCurrentChange: function (row) {
      this.currentRow = row
      this.$refs.tableCorpRef.toggleRowSelection(row)
    },
    handleCheckChang: function (selection) {
      this.tableSelection = selection
    },
    getDateToReturn: function () {
      this.qrydate = this.queryForm.date[0] + '-' + this.queryForm.date[1]
      this.visiblePopover = false
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg, // this.message !== '' ? this.message + '成功' : '查询成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg,
          type: 'warning'
        })
      }
    }
  },
  created () {
    if (!this.zcid) { // 如果没有传递属性，则查询
      this.getDateToReturn()
      this.loadtableList(1)
    }
    this.height = window.innerHeight - 205
  },
  mounted () {
  }
}
</script>

<style scoped>
  >>> .el-button+.el-button{
    margin-left: 0px
  }
</style>
