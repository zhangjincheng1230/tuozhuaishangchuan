<template>
  <div class="kj-container" >
    <div class="kj-head">
      <div class="query-info">期间
        <QueryPeriod :qj.sync="period" @query="onQueryD" ></QueryPeriod>
            <el-switch v-if="showSwitchBtn"  style="margin-left: 10px;margin-top:4px" v-model="showqybf"
                       inactive-value=false active-value=true active-text="显示企业承担部分" @change="saveSetting"></el-switch>
            <el-switch v-if="showSwitchBtn" style="margin-left: 10px;margin-top:4px" v-model="showZxfj"
                       inactive-value=false active-value=true active-text="显示专项附加扣除" @change="saveSetting"></el-switch>
      </div>
      <div class="kj-button-group">
        <el-dropdown v-if='!isgz' >
          <el-button  @click="copyByMonth"> 按月复制<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px;margin-right:0px">
            <div  style="width:90px;height:25px;margin-left:5px" >
              <el-switch v-model="isopen" inactive-value=false active-value=true active-text="自动" @change="saveSetting"></el-switch>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if='!isgz' style="margin-left:10px">
          <el-button   @click="addInfo">新增<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px">
            <div @click="impDialog" style="width:70px;height:25px">
              <el-dropdown-item >导入</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button  style="margin-left:10px" v-if='!isgz' @click="onDelete">删除</el-button>

        <el-dropdown v-if='!isgz&&showbtn' style="margin-left:10px">
          <el-button >生成凭证<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px">
            <div @click="salaryJT"  style="width:95px">
              <el-dropdown-item  >工资计提</el-dropdown-item>
            </div>
            <div @click="salaryFF" style="width:95px">
              <el-dropdown-item  >工资发放</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown v-if='!isgz' style="margin-left:10px">
          <el-button >更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown" style="margin-top:0px">
            <div @click="expNSSBB">
              <el-dropdown-item  >导出纳税申报表</el-dropdown-item>
            </div>
            <div @click="expPerson">
              <el-dropdown-item  >导出人员信息</el-dropdown-item>
            </div>
            <div @click="judgeHasPZ">
              <el-dropdown-item   v-if='showbtn'>关账</el-dropdown-item>
            </div>
            <div @click="print">
              <el-dropdown-item  v-if='showbtn' >打印</el-dropdown-item>
            </div>
            <div @click="searchTzpz">
              <el-dropdown-item  v-if='showbtn' >联查凭证</el-dropdown-item>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-if='isgz' @click="expExcel('1')">导出模板</el-button>
        <el-button v-if='isgz' @click="expNSSBB">导出纳税申报表</el-button>
        <el-button v-if='isgz' @click="expPerson">导出人员信息</el-button>
        <el-button v-if='isgz&&showbtn' @click="isNotGZ">取消关账</el-button>
        <el-button v-if='isgz&&showbtn' @click="print">打印</el-button>
      </div>
    </div>
    <div class="kj-main">
      <div class="table-container">
        <el-tabs type="border-card" v-model="activeName"  @tab-click="handleClick">
          <el-tab-pane label="正常薪金" name="01">
            <div v-if="this.period >= '2019-01'">
              <SalarayReportListNew></SalarayReportListNew>
            </div>
            <div v-else>
              <SalarayReportListOld :billtype ="billtype" ></SalarayReportListOld>
            </div>
          </el-tab-pane>
          <el-tab-pane label="劳务报酬" name="02" >
            <SalarayReportListOld :billtype ="billtype" ></SalarayReportListOld>
          </el-tab-pane>
          <el-tab-pane label="外籍薪资" name="03" >
            <SalarayReportListOld :billtype ="billtype" ></SalarayReportListOld>
          </el-tab-pane>
        </el-tabs>
      </div>
      <CopyPeroidDialog v-show="dialogFormTitle==='复制工资表'" :visible.sync="dialogCopyFormVisible" :title="dialogFormTitle" :data="corpPeroidData" ></CopyPeroidDialog>
      <PrintDataDialog ref="printdialog"  v-show="dialogFormTitle==='打印选项'" :visible.sync="dialogPrintFormVisible" :title="dialogFormTitle" :nodename="nodename" @getPrint="setPrint"  @save="onPrint" ></PrintDataDialog>
      <SmDialog  v-show="dialogFormTitle==='操作说明'"  :visible.sync="dialogSmVisible" :title="dialogFormTitle"></SmDialog>
      <UploaderDialog
        v-show="dialogFormTitle==='导入工资表'"
        :visible.sync="dialogImpFormVisible"
        name="impfile"
        :title="dialogFormTitle"
        @submit="onUpload"
        :param="fileData">
        <template #description>
          <div class="import-description">
            支持标准模板导入,没有导入模板
            <a  href="javascript:void(0)" @click="expExcel('1')">点击下载</a>
          </div>
          <div class="import-description" style="margin-top:10px">
            支持自然人扣缴客户端个税申报表直接导入,无需修改
            <a href="javascript:void(0)" @click="showYhzc()">操作说明</a>
          </div>
        </template>
      </UploaderDialog>
      <SalarayReportDialogNew  :visible.sync="dialogNewVisible" :qybf="showqybf" :zxfj="showZxfj" :data="this.$parent.formData"  @fetchData="fetchData" ></SalarayReportDialogNew>
      <SalarayReportDialogOld  :visible.sync="dialogOldVisible" :data="this.$parent.formData" @fetchData="fetchData" ></SalarayReportDialogOld>
    </div>
  </div>
</template>

<script>
import QueryPeriod from '../../components/QueryPeriod'
import { orderBy } from 'natural-orderby'
import { formatDate } from '@/utils'
import SalarayReportListNew from './SalarayReportListNew'
import SalarayReportListOld from './SalarayReportListOld'
import CopyPeroidDialog from '../components/CopyPeroidDialog'
import UploaderDialog from '@/components/UploaderDialog'
import PrintDataDialog from '../components/PrintDataDialog'
import SalarayReportDialogNew from '../Dialog/SalarayReportDialogNew'
import SalarayReportDialogOld from '../Dialog/SalarayReportDialogOld'
import SmDialog from '../components/SmDialog'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SalarayReportList',
  mixins: [MessageUtil, Loading],
  components: {
    QueryPeriod,
    SalarayReportListNew,
    SalarayReportListOld,
    CopyPeroidDialog,
    SalarayReportDialogNew,
    SalarayReportDialogOld,
    UploaderDialog,
    PrintDataDialog,
    SmDialog
  },
  data () {
    return {
      loading: false,
      height: 0, // 表格自适应高度
      pageInfo: {
        page: 1,
        rows: 100,
        pageSizes: [100, 200, 300, 400, 500]
      },
      total: 0,
      nodename: '工资表',
      tableData: [],
      period: this.$parent.period,
      billtype: '01',
      activeName: '01', // 表体业签默认显示
      showbtn: true, // 报税客户端打开节点 按钮控制
      showqybf: 'false',
      showZxfj: 'false',
      isopen: 'true',
      filters: { ygname: [] }, // 列表数据过滤
      isgz: false,
      corpPeroidData: {},
      listCurrentRow: null,
      listSelectedRows: null,
      dialogFormTitle: '',
      dialogImpFormVisible: false,
      fileData: { isOld: true },
      dialogCopyFormVisible: false,
      dialogPrintFormVisible: false,
      dialogSmVisible: false,
      dialogNewVisible: false,
      dialogOldVisible: false,
      printData: {
        type: '1',
        left: 5,
        top: 5,
        font: '9',
        printdate: formatDate(new Date()),
        hiddenphone: true,
        zbr: true
      }
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.ygbm)
    },
    showSwitchBtn () {
      if (this.period >= '2019-01' && this.billtype === '01') {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.height = window.innerHeight - 270
  },
  mounted () {
    this.fetchData()
    this.onAutoCopy()
  },
  methods: {
    fetchData () {
      this.loading = true
      const params = {
        opdate: this.period,
        pk_corp: this.$parent.pk_corp,
        billtype: this.billtype,
        isfenye: 'Y',
        ...this.pageInfo
      }
      delete params.pageSizes
      this.$api.SalaryManageApi.SalaryReport.query(params).then(result => {
        this.loading = false
        if (result.success) {
          if (result.msg.indexOf('500') >= 0) {
            this.isgz = true
          }
          if (result.msg.indexOf('-600') >= 0) {
            this.isgz = false
          }
          this.tableData = result.rows
          this.total = result.total
          this.initFilter(this.tableData, 'ygname')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    onQueryD () {
      this.fetchData()
      this.onAutoCopy()
    },
    // 业签切换事件
    handleClick: function handleClick (tab, event) {
      const tablecode = event.target.id.substring(4, 6)
      this.billtype = tablecode
      this.tableData = []
      this.total = 0
      this.fetchData()
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
    copyByMonth () {
      this.corpPeroidData.from = this.period
      const date = new Date(this.corpPeroidData.from + '-01')
      date.setMonth(date.getMonth() + 1)
      this.corpPeroidData.to = formatDate(date, 'YYYY-MM')
      this.dialogFormTitle = '复制工资表'
      this.dialogCopyFormVisible = true
    },
    // 复制上月数据到本月
    onAutoCopy () {
      if (this.period < '2019-01') { return }
      if (this.isopen === 'true' || this.isopen === true) {
        this.showLoading('自动复制...')
        this.$api.SalaryManageApi.SalaryReport.getCopyMonth({
          copyTodate: this.period,
          pk_corp: this.$parent.pk_corp
        }).then(result => {
          this.closeLoading()
          if (!result.success) {
            this.errorMsg(result.msg)
          } else {
            if (result.data) {
              this.$confirm('是否复制期间' + result.data + '工资数据到当前月?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                iconClass: 'el-icon-warning-outline',
                center: true,
                closeOnClickModal: false,
                closeOnPressEscape: false
              }).then(() => {
                const param = {
                  copyTodate: this.period,
                  copyFromdate: result.data,
                  auto: 'Y',
                  billtype: this.billtype,
                  pk_corp: this.$parent.pk_corp
                }
                this.$api.SalaryManageApi.SalaryReport.copyByMonth(param).then(result => {
                  this.closeLoading()
                  if (result.success) {
                    this.fetchData()
                  } else {
                    this.errorMsg(result.msg)
                  }
                }).catch(e => {
                  this.closeLoading()
                })
              }).catch(e => {
                this.closeLoading()
              })
            }
          }
        }).catch(e => {
          this.closeLoading()
        })
      }
    },
    addInfo () {
      if (this.isgz) {
        this.warnMsg('已关账，不能新增！')
        return
      }
      const formData = {curOptType: 'new', qj: this.period, billtype: this.billtype, pk_corp: this.$parent.pk_corp}
      this.openCard(formData)
    },
    editRow (rowData) {
      if (this.isgz) {
        this.warnMsg('已关账，不能修改！')
        return
      }
      if (rowData) {
        const formData = JSON.parse(JSON.stringify(rowData))
        formData.billtype = this.billtype
        this.openCard(formData)
      } else {
        this.warnMsg('请选中要编辑行数据！')
      }
    },
    openCard (formData) {
      this.$parent.formData = formData
      if (this.period >= '2019-01' && this.billtype === '01') {
        this.dialogNewVisible = true
      } else {
        this.dialogOldVisible = true
      }
      this.$parent.zxfj = this.showZxfj
      this.$parent.qybf = this.showqybf
    },
    impDialog () {
      if (this.isgz) {
        this.warnMsg('已关账，无法导入数据！')
        return
      }
      this.dialogFormTitle = '导入工资表'
      this.dialogImpFormVisible = true
    },
    onUpload (fileParam) {
      if (!fileParam) {
        this.warnMsg('请先选择导入文件!')
        return
      }
      this.showLoading('正在导入...')
      // 下面append的东西就会到form表单数据的fields中；
      fileParam.append('billtype', this.billtype)
      fileParam.append('pk_corp', this.$parent.pk_corp)
      fileParam.append('period', this.period)
      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.SalaryManageApi.SalaryReport.importB(fileParam).then(result => {
        this.closeLoading()
        if (result.success) {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.successMsg('导入成功!')
          }
          this.fetchData()
          this.dialogImpFormVisible = false
        } else {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            this.errorMsg('导入失败!')
          }
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    onDelete () {
      let ids = ''
      let tips = ''

      if (this.isgz) {
        this.warnMsg('已关账，不能删除数据！')
        return
      }
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        tips = '确定要删除选中的数据？'
        ids = this.listSelectedRows.reduce((id, row) => id + ',' + row.pk_salaryreport, '')
      } else {
        this.warnMsg('请选择要删除的数据！')
        return
      }
      this.showLoading('正在删除...')
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          pks: ids,
          ops: this.listSelectedRows[0].pk_corp,
          opdate: this.period,
          billtype: this.billtype,
          pk_corp: this.$parent.pk_corp
        }
        this.$api.SalaryManageApi.SalaryReport.deleteRows(param).then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg('删除成功!')
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      }).catch(e => {
        this.closeLoading()
      })
    },
    salaryJT () {
      if (this.isgz) {
        this.warnMsg('已关账，不能生成凭证！')
        return
      }
      if (!this.checkData()) {
        return
      }
      const opdate = this.period
      const pk_corp = this.$parent.pk_corp
      let param = {
        opdate: opdate,
        operate: 'gzjt',
        pk_corp: pk_corp
      }
      this.$api.SalaryManageApi.SalaryReport.check(param).then(result => {
        if (result.success) {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            const sourcebilltype = pk_corp + opdate + 'gzjt'
            param = {
              opdate: opdate,
              sourcebilltype: sourcebilltype,
              pk_corp: pk_corp
            }
            this.$api.SalaryManageApi.SalaryReport.gzjt(param).then(result => {
              if (!result.success) {
                this.errorMsg(result.msg)
              } else {
                if (!this.$hasPermission('voucher-edit')) {
                  return
                }
                this.$router.push({
                  name: 'voucher-edit',
                  params: {
                    data: result.data
                  }
                })
              }
            }).catch(e => {
            })
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    salaryFF () {
      if (this.isgz) {
        this.warnMsg('已关账，不能生成凭证！')
        return
      }
      if (!this.checkData()) {
        return
      }
      const opdate = this.period
      const pk_corp = this.$parent.pk_corp
      let param = {
        opdate: opdate,
        operate: 'gzff',
        pk_corp: pk_corp
      }
      this.$api.SalaryManageApi.SalaryReport.check(param).then(result => {
        if (result.success) {
          if (result.msg) {
            this.errorMsg(result.msg)
          } else {
            const sourcebilltype = pk_corp + opdate + 'gzff'
            param = {
              opdate: opdate,
              sourcebilltype: sourcebilltype,
              pk_corp: pk_corp
            }
            this.$api.SalaryManageApi.SalaryReport.gzff(param).then(result => {
              if (!result.success) {
                this.errorMsg(result.msg)
              } else {
                if (!this.$hasPermission('voucher-edit')) {
                  return
                }
                this.$router.push({
                  name: 'voucher-edit',
                  params: {
                    data: result.data
                  }
                })
              }
            }).catch(e => {
            })
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    expNSSBB () {
      if (!this.checkData()) {
        return
      }
      const param = {billtype: this.billtype, period: this.period, pk_corp: this.$parent.pk_corp}
      this.$api.SalaryManageApi.SalaryReport.expNSSBB(param)
    },
    expPerson () {
      if (!this.checkData()) {
        return
      }
      const param = {billtype: this.billtype, period: this.period, pk_corp: this.$parent.pk_corp}
      const param1 = {billtype: this.billtype, period: this.period, pk_corp: this.$parent.pk_corp, isexp: 'Y'}
      this.$api.SalaryManageApi.SalaryReport.expPersonp(param).then(result => {
        if (result.success) {
          this.$api.SalaryManageApi.SalaryReport.expPerson(param1)
        } else {
          this.$confirm('请到辅助核算-职员档案中填写其他信息，否则无法导入到自然人扣缴客户端!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            this.$api.SalaryManageApi.SalaryReport.expPerson(param1)
          }).catch(e => {
          })
        }
      }).catch(e => {
      })
    },
    checkData () {
      let datarows = null
      const checkrows = this.listSelectedRows
      if (checkrows != null && checkrows.length > 0) {
        datarows = checkrows
      } else {
        datarows = this.tableData
      }
      if (datarows == null || datarows.length === 0) {
        this.warnMsg('当前界面数据为空！')
        return false
      }
      return true
    },
    judgeHasPZ () {
      this.showLoading('关账检查中...')
      const self = this
      this.$confirm('关账后工资表将无法修改，确认要关账吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          opdate: this.period,
          pk_corp: this.$parent.pk_corp
        }
        this.$api.SalaryManageApi.SalaryReport.judgeHasPZ(param).then(result => {
          this.closeLoading()
          if (result.success) {
            if (!result.msg) {
              self.isGZ('true')
            } else {
              this.$confirm(result.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                iconClass: 'el-icon-warning-outline',
                center: true,
                closeOnClickModal: false,
                closeOnPressEscape: false
              }).then(function () {
                self.isGZ('true')
              }).catch(function (e) {
              })
            }
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      }).catch(e => {
        this.closeLoading()
      })
    },
    isGZ (isgz) {
      const param = {
        opdate: this.period,
        isgz: isgz,
        pk_corp: this.$parent.pk_corp
      }
      this.showLoading('关账中...')
      this.$api.SalaryManageApi.SalaryReport.isGZ(param).then(result => {
        this.closeLoading()
        if (result.success) {
          if (result.msg.indexOf('600') >= 0) {
            this.isgz = true
            this.successMsg('关账成功！')
          }
          if (result.msg.indexOf('700') >= 0) {
            this.isgz = false
            this.successMsg('取消关账成功！')
          }
          if (result.msg.indexOf('500') >= 0) {
            this.isgz = false
            this.errorMsg('当月无是否关账信息，请检查！')
          }
        } else {
          this.isgz = false
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    // 取消关账
    isNotGZ: function isNotGZ () {
      this.isGZ('false')
    },
    print () {
      if (!this.checkData()) {
        return
      }
      this.dialogFormTitle = '打印选项'
      this.dialogPrintFormVisible = true
    },
    // 打印
    onPrint (param, printData) {
      if (!this.checkData()) {
        return
      }
      printData.billtype = this.billtype
      printData.opdate = this.period
      printData.pk_corp = this.$parent.pk_corp
      if (param === '1') {
        this.$api.SalaryManageApi.SalaryReport.expExcelData(printData)
      } else if (param === '2') {
        this.$api.SalaryManageApi.SalaryReport.printPdf(printData)
      }
      this.dialogPrintFormVisible = false
    },
    setPrint (param) {
      this.printParam = param
      this.showqybf = this.printParam.isshow
      this.showZxfj = this.printParam.showZxfj
      this.isopen = this.printParam.isopen
    },
    // 保存设置
    saveSetting () {
      this.$refs.printdialog.saveSettingMsg(this.showZxfj, this.showqybf, this.isopen)
    },
    searchTzpz () {
      if (!this.checkData()) {
        return
      }
      const pk_corp = this.$parent.pk_corp
      const opdate = this.period
      const srcbilltype = pk_corp + opdate + 'gzjt,' + pk_corp + opdate + 'gzff'

      let param = {
        period: opdate,
        sourcebilltype: 'gz',
        pk_corp: pk_corp
      }
      this.$api.SalaryManageApi.SalaryReport.queryGlpz(param).then(result => {
        if (!result.success) {
          this.errorMsg(result.msg)
        } else {
          if (result.total === 0) {
            this.warnMsg('没有生成凭证！')
          } else if (result.total === 1) {
            if (!this.$hasPermission('voucher-edit')) {
              return
            }
            this.$router.push({
              name: 'voucher-edit',
              params: {id: result.data[0].id}
            })
          } else {
            if (!this.$hasPermission('voucher-manage')) {
              return
            }
            let begindate = result.data[0].zdrq
            let enddate = result.data[1].zdrq
            if (begindate > enddate) {
              begindate = result.data[1].zdrq
              enddate = result.data[0].zdrq
            }
            let routeParam = {routeParam: {source: 'gz', dateType: '1', begindate: begindate, enddate: enddate, gsname: this.$store.getters.currentCorp.uname, corpIds: this.$store.getters.currentCorp.pk_gs, sourcebilltype: srcbilltype}}
            this.$router.push({name: 'voucher-manage', params: routeParam})
          }
        }
      }).catch(e => {
      })
    },
    showYhzc () {
      this.dialogSmVisible = true
      this.dialogImpFormVisible = false
      this.dialogFormTitle = '操作说明'
    },
    expExcel (type) {
      const param = {billtype: this.billtype, type: type, pk_corp: this.$parent.pk_corp}
      this.$api.SalaryManageApi.SalaryReport.expExcel(param)
    },
    filterHandler (value, row, column) {
      return row[column.property] && row[column.property].indexOf(value) !== -1
    },
    initFilter: function (list, field) {
      this.filters[field] = []
      const tempObj = {}
      for (const idx in list) {
        if (list[idx][field] && !tempObj[list[idx][field]]) {
          if (list[idx][field].indexOf(';') !== -1) {
            const arrayinds = list[idx][field].split(';')
            for (const ics in arrayinds) {
              if (!tempObj[arrayinds[ics]]) {
                this.filters[field].push({text: arrayinds[ics], value: arrayinds[ics]})
                tempObj[arrayinds[ics]] = arrayinds[ics]
              }
            }
          } else if (list[idx][field].indexOf(',') !== -1) {
            const arrayinds = list[idx][field].split(',')
            for (const ics in arrayinds) {
              if (!tempObj[arrayinds[ics]]) {
                this.filters[field].push({text: arrayinds[ics], value: arrayinds[ics]})
                tempObj[arrayinds[ics]] = arrayinds[ics]
              }
            }
          } else {
            this.filters[field].push({text: list[idx][field], value: list[idx][field]})
            list[idx][field] && (tempObj[list[idx][field]] = list[idx][field])
          }
        }
      }
    },
    getSummaries (param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0 || index === 1 || index === 2) {
          return
        }
        if (index === 3) {
          sums[index] = '合计'
          return
        }
        if (column.label === '税率%') {
          sums[index] = ''
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        }
      })
      sums.forEach((sum, index) => {
        if (typeof sum === 'number') {
          sums[index] = this.$options.filters.forThousands(sum)
        }
      })
      return sums
    },
    nmnyformatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 2, true)
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
