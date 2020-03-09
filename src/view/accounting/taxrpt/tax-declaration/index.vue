<template>
  <div class="app-main"
       v-loading="loading"
       :element-loading-text="loadingText"
       :element-loading-spinner="loadingSpinner">
    <div class="kj-container"
         v-show="!cardShow">
      <div class="kj-head">
        <div class="query-info">公司:
          <el-select
            v-model="formParam.corpId"
            @change="setDeclarValue"
            style="width: 315px">
            <el-option
              v-for="item in this.corpRef()"
              :key="item.pk_gs"
              :value="item.pk_gs"
              :label="item.incode + '_' + item.uname">
            </el-option>
          </el-select>
        </div>
        <div class="kj-button-group">
          <el-button @click="setDeclarValue">刷新</el-button>
          <el-button @click="editRow">修改</el-button>
          <el-button @click="delTemp">删除</el-button>
          <!--<el-button @click="batWrite">批量填写</el-button>-->
          <el-button v-if="shangbShowVisible" @click="upReport">上报</el-button>
          <el-button v-if="hqqcShowVisible" @click="getQc">获取期初</el-button>
          <el-button v-if="qslyShowVisible" @click="setResource">取数来源</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
            <el-table
              :data="sortedData"
              highlight-current-row
              @current-change="handleListRowSelect"
              @selection-change="handleListRowSelection"

              stripe
              border
              height="100%"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                property="sbcode"
                label="编码"
                show-overflow-tooltip
                header-align="center"
                width="70">
              </el-table-column>
              <el-table-column
                property="sbname"
                label="名称"
                show-overflow-tooltip
                header-align="center"
                width="250">
              </el-table-column>
              <el-table-column
                property="periodtype"
                label="申报类型"
                header-align="center"
                show-overflow-tooltip
                width="75">
                <template #default="scope">
                  {{ scope.row.periodtype == 0 ? "月报"
                            : scope.row.periodtype == 1 ? "季报"
                            : scope.row.periodtype == 2 ? "年报" : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column
                property="period"
                label="申报所属期间"
                show-overflow-tooltip
                header-align="center"
                width="100">
              </el-table-column>
              <el-table-column
                property="spreadfile"
                label="填写状态"
                show-overflow-tooltip
                header-align="center"
                width="70">
                <template #default="scope">
                  {{ scope.row.spreadfile ? '已填写' : '未填写' }}
                </template>
              </el-table-column>
              <el-table-column
                property="sbzt_dm"
                label="申报状态"
                v-if="sbztShowVisible"
                show-overflow-tooltip
                header-align="center"
                width="80">
                <template #default="scope">
                  {{ scope.row.sbzt_dm === "0" ? "已提交"
                  : scope.row.sbzt_dm === "1" ? "受理失败"
                  : scope.row.sbzt_dm === "2" ? "受理成功"
                  : scope.row.sbzt_dm === "3" ? "申报失败"
                  : scope.row.sbzt_dm === "4" ? "申报成功"
                  : scope.row.sbzt_dm === "5" ? "作废"
                  : scope.row.sbzt_dm === "6" ? "缴款失败"
                  : scope.row.sbzt_dm === "7" ? "缴款成功"
                  : scope.row.sbzt_dm === "101" ? "未提交" : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column
                property="remark"
                label="备注"
                v-if="remarkShowVisible"
                show-overflow-tooltip
                header-align="center"
                width="150">
              </el-table-column>
              <!--<el-table-column
                property="taxmny"
                label="实缴额"
                :formatter="formatMny"
                show-overflow-tooltip
                header-align="center"
                align="right"
                width="100">
              </el-table-column>-->

            </el-table>
        </div>
      </div>
    </div>
    <div class="kj-container kj-card" v-show="cardShow">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="onRecal">单页重算</el-button>
          <el-button @click="onRecalAll">全表重算</el-button>
          <el-button @click="checkSheet">保存</el-button>
          <el-button @click="cancelEdit">列表显示</el-button>
        </div>
      </div>
      <div class="kj-main">
          <iframe id="iframeId" src="/static/spreadjs/spread.html?t=111" style="border: none;width: 98%;height: 98%"></iframe>
      </div>
    </div>
    <el-dialog
      title="增值税申报表取数来源"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="resourceDialogVisible"
      width="350px">
      <el-form :model="reForm" ref="reFormData">
        <el-form-item label="" style="margin-left: 30px;">
          <el-radio-group v-model="reForm.resourceValue">
            <ul >
              <li style="line-height: 36px">
                <el-radio label="0">从发票清单取数</el-radio>
              </li>
              <li style="line-height: 36px" >
                <el-radio label="1">从财务报表取数</el-radio>
              </li>
            </ul>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resourceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveResource">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { orderBy } from 'natural-orderby'
import loadingMixin from '@/mixins/loading'
export default {
  name: 'tax-declaration',
  mixins: [loadingMixin],
  components: {
  },
  data () {
    return {
      loading: true,
      queryVisible: false,
      cardShow: false,
      editStatus: false,
      total: 0,
      tableData: [],
      listCurrentRow: null,
      listSelectedRows: null,
      cardSelectedRows: null,
      currentCorp: this.$store.getters.currentCorp,
      formParam: {
        corpId: this.$store.getters.currentCorp.pk_gs
      },

      reForm: {
        resourceValue: '0'
      },
      resourceDialogVisible: false,
      qslyShowVisible: true, // 取数来源
      shangbShowVisible: false, // 上报
      hqqcShowVisible: false,
      sbztShowVisible: false,
      remarkShowVisible: false
    }
  },
  computed: {
    sortedData () {
      return orderBy(this.tableData, v => v.mbbm)
    }
  },
  created () {
    this.setBtnVisible()
    this.fetchData()
    window.addEventListener('message', this.receiveMsg, false)
  },
  watch: {
    cardShow (newValue) {
      if (!newValue) {
        // 切到列表界面时，清空表单
        // this.$refs.formRef.resetFields()
      }
    }
  },
  methods: {
    corpRef () {
      return this.$store.getters.corps
    },
    receiveMsg (event) {
      let data = event.data
      let type = data.type
      if (type == 'recal') {
        data.data.calall = null
        this.recalPost(data.data)
      } else if (type == 'recalall') {
        data.data.calall = 'Y'
        this.recalPost(data.data)
      } else if (type == 'check') {
        this.doPreSave(data.data)
      }
    },
    doPreSave (data) {
      if (data.errormsg) {
        let tips = '是否继续保存？<br><br>' + data.errormsg
        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.doSave(data.jsonString)
        })
      } else {
        this.doSave(data.jsonString)
      }
    },
    setResource () {
      this.resourceDialogVisible = true
      let param = this.$store.getters.paramSettingMap.get('dzf004')
      let value = param && param.pdvalue == 0 ? '0' : '1'
      this.reForm.resourceValue = value
    },
    saveResource () {
      let newvalue = this.reForm.resourceValue
      let param = this.$store.getters.paramSettingMap.get('dzf004')
      let oldvalue = param && param.pdvalue == 0 ? '0' : '1'
      if (newvalue != oldvalue) {
        param.pdvalue = newvalue
        this.$api.BasicSettingApi.ParamSetting.onSave({setvo: param}).then(result => {
          if (result.success) {
            this.successMsg(result.msg)
            this.$store.dispatch('fetchParamSet')
          } else {
            this.errorMsg(result.msg)
          }
        })
      }
      this.resourceDialogVisible = false
    },
    doSave (jsonString) {
      const temp = {
        pk_corp: this.formParam.corpId,
        jsonString: jsonString,
        pk_taxreport: this.listCurrentRow.pk_taxreport,
        sbname: this.listCurrentRow.sbname,
        period: this.listCurrentRow.period
      }
      this.showLoading()
      this.$api.TaxRptApi.TaxDeclaration.saveReport(temp).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg('保存成功')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    recalPost (data) {
      this.loading = true
      const temp = {
        pk_taxreport: this.listCurrentRow.pk_taxreport,
        pk_corp: this.formParam.corpId,
        jsonString: data.jsonString,
        reportname: data.stname,
        calall: data.calall
      }
      this.$api.TaxRptApi.TaxDeclaration.recal(temp).then(result => {
        this.loading = false
        if (result.success) {
          this.postMessage(result.data, 'open')
          this.successMsg(result.msg)
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    setDeclarValue (val) {
      this.setCurrentCorp()
      this.setBtnVisible(val)
      this.fetchData()
    },
    setCurrentCorp () {
      let corp = this.corpRef().find(corp => corp.pk_gs === this.formParam.corpId)
      if (corp) {
        (
          this.currentCorp = corp
        )
      }
    },
    getQc () {
      this.$confirm('该操作将会更新申报列表的数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.loading = true

        this.$api.TaxRptApi.TaxDeclaration.getQc({
          pk_corp: this.formParam.corpId
        }).then(result => {
          this.loading = false
          if (result.success) {
            this.successMsg(result.msg)
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      })
    },
    setBtnVisible () {
      if (this.isJS()) {
        this.hqqcShowVisible = false
        this.shangbShowVisible = false

        this.sbztShowVisible = true
        this.remarkShowVisible = true
      } else if (this.isBJ()) {
        this.hqqcShowVisible = false
        this.shangbShowVisible = false

        this.sbztShowVisible = true
        this.remarkShowVisible = true
      } else if (this.isSD()) {
        this.hqqcShowVisible = false
        this.shangbShowVisible = true

        this.sbztShowVisible = true
        this.remarkShowVisible = true
      } else if (this.isCQ()) {
        this.hqqcShowVisible = true
        this.shangbShowVisible = false

        this.sbztShowVisible = true
        this.remarkShowVisible = true
      } else {
        this.hqqcShowVisible = false
        this.shangbShowVisible = false

        this.sbztShowVisible = false
        this.remarkShowVisible = false
      }
    },
    isJS () {
      let ccounty = this.currentCorp.tax_area + ''
      return ccounty === '11'
    },
    isBJ () {
      let ccounty = this.currentCorp.tax_area + ''
      return ccounty === '2'
    },
    isSD () {
      let ccounty = this.currentCorp.tax_area + ''
      return ccounty === '16'
    },
    isCQ () {
      let ccounty = this.currentCorp.tax_area + ''
      return ccounty === '23'
    },
    isHubei () {
      let ccounty = this.currentCorp.tax_area + ''
      return ccounty === '18'
    },
    isXM () {
      let ccounty = this.currentCorp.tax_area + ''
      return ccounty === '151'
    },
    fetchData () {
      this.loading = true
      const queryParam = this.getQueryParam()
      this.$api.TaxRptApi.TaxDeclaration.queryTypeList({
        ...queryParam
      }).then(result => {
        this.loading = false
        if (result.rows) {
          this.tableData = result.rows
          this.total = result.rows.length
          this.successMsg(result.msg)
        } else {
          this.errorMsg(result.msg)
          this.clearData()
        }
      }).catch(e => {
        this.loading = false
        this.errorMsg('加载失败')
        this.clearData()
      })
    },
    clearData () {
      this.tableData = []
    },
    formatMny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    getQueryParam () {
      const param = {}
      if (this.formParam.corpId) {
        param.pk_corp = this.formParam.corpId
      }
      return param
    },
    handleListRowSelect (val) {
      this.listCurrentRow = val
      if (val && val.sbname && val.sbname.indexOf('增值税') != -1) {
        this.qslyShowVisible = true
      } else {
        this.qslyShowVisible = false
      }
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val
    },
    handleCardRowSelection (val) {
      this.cardSelectedRows = val
    },
    upReport () {
      if (this.listCurrentRow) {
        this.loading = true
        this.$api.TaxRptApi.TaxDeclaration.sendTaxReport({
          pk_corp: this.formParam.corpId,
          pk_taxreport: this.listCurrentRow.pk_taxreport
        }).then(result => {
          this.loading = false
          if (result.success) {
            this.setDeclarValue()
            this.successMsg(result.msg)
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.warningMsg('请选一行数据上报!')
      }
    },
    batWrite () {
      this.loading = true

      this.$api.TaxRptApi.TaxDeclaration.batWrite({
        pk_corp: this.formParam.corpId
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.successMsg(result.msg)
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    delTemp () {
      if (this.listCurrentRow) {
        this.$confirm('确认删除当前报表吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.loading = true

          this.$api.TaxRptApi.TaxDeclaration.del({
            pk_taxreport: this.listCurrentRow.pk_taxreport,
            pk_corp: this.formParam.corpId,
            period: this.listCurrentRow.period,
            sbname: this.listCurrentRow.sbname
          }).then(result => {
            this.loading = false
            if (result.success) {
              let index = this.tableData.findIndex(item => {
                if (item.id == this.listCurrentRow.pk_taxreport) {
                  return true
                }
              })

              this.tableData.splice(index, 1)
            } else {
              this.errorMsg(result.msg)
            }
          }).catch(e => {
            this.loading = false
          })
        })
      } else {
        this.warningMsg('请选择报表!')
      }
    },
    editRow () {
      if (this.listCurrentRow) {
        this.loading = true
        this.$api.TaxRptApi.TaxDeclaration.edit({
          pk_taxreport: this.listCurrentRow.pk_taxreport,
          pk_corp: this.formParam.corpId
        }).then(result => {
          this.loading = false
          if (result.success) {
            this.cardShow = true
            this.editStatus = true
            this.postMessage(result.data, 'open')
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.warningMsg('请选择报表!')
      }
    },
    onRecal () {
      this.postMessage('', 'recal')
    },
    onRecalAll () {
      this.postMessage('', 'recalall')
    },
    checkSheet () {
      this.$api.TaxRptApi.TaxDeclaration.getCondition({
        pk_taxreport: this.listCurrentRow.pk_taxreport
      }).then(result => {
        if (result.success) {
          this.postMessage(result.data, 'check')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    cancelEdit () {
      this.editStatus = false
      this.cardShow = false
      this.qslyShowVisible = true
      this.setDeclarValue()
    },
    postMessage (obj, type) {
      let frame = document.getElementById('iframeId')
      let data = {}
      data.type = type
      data.data = obj
      frame.contentWindow.postMessage(data, '*')
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
    warningMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'warning'
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
