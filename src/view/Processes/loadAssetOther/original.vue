<template>
  <div style="position: relative;border: 1px solid #ddd;background:rgba(255,255,255,1)">
    <el-container>
      <Header :isShow="{isShowCompany}">
        <el-row slot="HeadRight">
          <el-button size="mini" @click="addSouce">新增</el-button>
          <el-button size="mini" @click="deleteDataRow">删除</el-button>
          <el-button size="mini" @click="refreshTableList">刷新</el-button>
          <el-button size="mini" @click="turnZz">转总账</el-button>
          <el-button size="mini" @click="withPz">联查凭证</el-button>
        </el-row>
        <el-container slot="SelectCondition">
          <el-main>
            <el-form-item>
              <h4>原值变更查询</h4>
            </el-form-item>
            <el-form-item
              size="mini"
              label="日期:"
              label-width="100"
              style="border-bottom: 1px dashed #dadada;padding-bottom: 5px;padding-left: 28px"
            >
              <el-date-picker
                v-model="date"
                type="daterange"
                unlink-panels
                range-separator="至"
                value-format="yyyy-MM-dd"
                style="width: 315px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item size="mini" label="资产卡片:" label-width="100">
              <el-select
                v-model="queryForm.qryassetcard_id"
                @change="getassetsID"
                :clearable = "true"
                style="width: 315px">
                <el-option
                  v-for="item in assetsCardOption"
                  :key="item.id_assetcard"
                  :value="item.id_assetcard"
                  :label="item.ascode + '   '+ item.asname">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="mini" label="卡片编码:" label-width="100">
              <el-input placeholder v-model="queryForm.qryascode" style="width: 315px"></el-input>
            </el-form-item>
            <div style="text-align: right;margin-top: 12px">
              <el-button size="small" type="primary" @click="query('查询')">确定</el-button>
              <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
            </div>
          </el-main>
        </el-container>
      </Header>
    </el-container>
    <el-container>
      <el-main>
        <el-table
          id="table_list"
          :data="tableList"
          highlight-current-row
          @current-change="handleCurrentChange"
          :header-cell-style="headerCellStyle"
          ref="tableCorpRef"
          stripe
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :height="height"
          style="width: 100%"
        >
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="zckm" label="资产卡片" min-width="100" align="center"></el-table-column>
          <el-table-column prop="bdate" label="变更日期" min-width="100" sortable align="center"></el-table-column>
          <el-table-column label="变更前原值" min-width="100" align="center">
            <template slot-scope="scope">{{scope.row.ovalue.toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="变更后原值" min-width="100" align="center">
            <template slot-scope="scope">{{scope.row.nvalue.toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="togl" label="总转账" min-width="100" align="center"></el-table-column>
          <el-table-column prop="" label="凭证" min-width="100" sortable align="center"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog
      title="新增"
      :visible.sync="addDialog"
      width="25%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      @close="closeDialog"
    >
      <el-container style="margin-top: 18px;">
        <el-form ref="ruleForm" @submit.native.prevent label-width="145px" :inline="true">
          <el-form-item size="mini" label="资产卡片:" required>
            <el-select
              v-model="form.assetCard"
              @change="getAddAssetsID"
              :clearable = "true"
              style="width: 200px">
              <el-option
                v-for="item in assetCardOption"
                :key="item.id_assetcard"
                :value="item.id_assetcard"
                :label="item.ascode + '   '+ item.asname">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" label="变更日期:">
            <el-date-picker v-model="form.bdate" type="date" value-format="yyyy-MM-dd" style="width: 200px"></el-date-picker>
          </el-form-item>
          <el-form-item size="mini" label="变更前原值:">
            <el-input v-model="form.ovalue" @change="afterChange" readonly style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="变更后原值:" required>
            <el-input v-model="form.nvalue" oninput="value=value.replace(/[^0-9.]/g,'');" @change="beforeChange" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="固定(无形)资产科目:">
            <el-input v-model="form.zckm" readonly style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="结算科目:">
            <el-select
              v-model="form.bgkm_id"
              :clearable = "true"
              style="width: 200px">
              <el-option
                v-for="item in subjectRef"
                :key="item.id"
                :value="item.id"
                :label="item.codename">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-container>
      <div slot="footer" class="dialog__footer">
        <el-button type="primary" @click="saveForm">保 存</el-button>
        <el-button @click="colseCreateGroup">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from '../components/Header'
import { getMonthBegin, getMonthEnd } from '@/utils'
export default {
  name: 'yzbg',
  components: {
    Header
  },
  data () {
    return {
      isShowCompany: false,
      addDialog: false,
      loading: false,
      tableList: [],
      height: 0,
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      date: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      assetsCard: '',
      assetsCardOption: [],
      cardNo: '',
      assetCardOption: [],
      subjectRef: this.$store.getters.subSubjectRef,
      currentRow: '', // table选中行
      assetsCurrentRow: '', // 资产卡片选中行
      subjectCurrentRow: '', // 结算科目选中行
      queryForm: { // 查询参数
        startDate: '',
        endDate: '',
        qryassetcard_id: '',
        qryascode: ''
      },
      form: { // 表单参数
        assetCard: '', // 资产卡片id
        bdate: '', // 变更日期
        ovalue: '', // 变更前原值
        nvalue: '', // 变更后原值
        zckm: '', // 固定(无形)资产科目
        zckm_id: '', // 固定(无形)资产科目
        bgkm: '', // 结算科目
        bgkm_id: '' // 结算科目
      }
    }
  },
  methods: {
    addSouce: function () {
      this.addDialog = true
      this.assetCardOption = this.assetsCardOption
      this.querySubjectRef()
    },
    saveForm: function () {
      if (this.assetCard === '' || this.beforeValue === '') {
        this.$message({
          showClose: true,
          message: '资产卡片，变更后原值为必输项，请重新输入',
          type: 'error'
        })
        return
      }
      // let param = {
      //   pk_assetcard_name: this.assetsCurrentRow.pk_assetcard_name,
      //   id_assetcard: this.assetsCurrentRow.id_assetcard,
      //   bdate: this.changDate,
      //   ovalue: this.afterValue.toString(),
      //   nvalue: this.beforeValue.toString(),
      //   zckm: this.assetsCurrentRow.zckm,
      //   zckm_id: this.assetsCurrentRow.zckm_id,
      //   bgkm: this.kms_first,
      //   bgkm_id: this.bgkm_id,
      //   togl: this.assetsCurrentRow.togl,
      //   id_assetvaluemodify: this.assetsCurrentRow.id_assetvaluemodify,
      //   chgvalue: this.assetsCurrentRow.chgvalue,
      //   id_corp: this.assetsCurrentRow.id_corp,
      //   id_voucher: '',
      //   vno: ''
      // }
      this.$api.originalChange.addRows(this.form).then(result => {
        this.successMsg(result)
        if (result.success) {
          this.tableList.push(result.rows)
          this.addDialog = false
        }
      })
    },
    query: function () { // 查询
      this.getDateToReturn()
      this.loadTableList(1)
    },
    deleteDataRow: function () {
      if (this.currentRow === '') {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return
      }
      this.$api.originalChange.deleteRows(this.currentRow).then(result => {
        this.successMsg(result)
        this.loadTableList(1)
      })
    },
    refreshTableList: function () {
      this.confirm('刷新')
    },
    turnZz: function () {
      if (this.currentRow === '') {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return
      }
      this.loadTableList(1)
    },
    withPz: function () {
      if (this.currentRow === '') {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return
      }
      this.loadTableList(1)
    },
    closeDialog: function () {
      this.addDialog = false
    },
    colseCreateGroup: function () {
      this.addDialog = false
    },
    getassetsID: function (val) {
      this.cardNo = val
    },
    getAddAssetsID: function (row) {
      this.assetsCurrentRow = row
      // this.assetCard = row.asname
      // this.afterValue = row.atmny
      // this.assetSubject = row.zckm
    },
    loadTableList: function (val) {
      this.getDateToReturn()
      this.queryForm.begindate = this.date[0]
      this.queryForm.enddate = this.date[1]
      this.loading = true
      this.$api.originalChange.queryData(this.queryForm).then(result => {
        this.loading = false
        if (result.success) {
          this.tableList = result.rows
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    handleCurrentChange: function (val) {
      this.currentRow = val
    },
    clearPose: function () {
      this.getDateToReturn()
    },
    getDateToReturn: function () {
      let retParam = {
        times: this.date[0] + '~' + this.date[1],
        visiblePopover: false
      }
      this.$bus.$emit('date', retParam)
    },
    afterChange: function (val) {
      this.afterValue = parseInt(val).toFixed(2)
    },
    beforeChange: function (val) {
      this.beforeValue = parseInt(val).toFixed(2)
    },
    querySubjectRef: function () {
      this.subjectRef = []
      this.$api.kmmxReport.getSubjectRef(this.$store.getters.currentCorp.pk_gs).then(
        result => {
          if (result.success) {
            this.subjectRef = result.rows
          }
        }
      ).catch(e => {
      })
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          message: data.msg, // this.message !== '' ? this.message + '成功' : '查询成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: data.msg,
          type: 'error'
        })
      }
    }
  },
  created () {
    this.height = window.innerHeight - 175
  },
  mounted () {
    this.loadTableList()
    this.$api.assetsCard.loadData('Y').then(result => {
      if (result.success) {
        this.assetsCardOption = result.rows
      }
    })
  }
}
</script>

<style scoped>
.el-main {
  padding: 0px;
}
.el-range-editor--mini.el-input__inner {
  width: 75%;
}
</style>
