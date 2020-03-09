<template>
  <div style="position: relative;border: 1px solid #ddd;background:rgba(255,255,255,1)">
    <el-container>
      <Header :isShow="{isShowCompany}">
        <el-row slot="HeadRight">
          <el-button size="mini" @click="add">新增</el-button>
          <el-button size="mini" @click="del">删除</el-button>
          <el-button size="mini" @click="refresh(1)">刷新</el-button>
          <el-button size="mini" @click="onBoToGL">转总账</el-button>
          <el-button size="mini" @click="linkPz">联查凭证</el-button>
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
                range-separator="-"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                style="width: 315px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item size="mini" label="资产卡片:" label-width="100">
              <el-select
                v-model="queryForm.pk_assetcard"
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
              <el-button size="small"  @click="clearPose" >取消</el-button>
              <el-button size="small" type="primary" @click="query('查询')">确定</el-button>
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
          ref="tableCorpRef"
          stripe
          border
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :height="height"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="pk_assetcard_name" label="资产卡片" width="130"
                           show-overflow-tooltip  header-align="center" align="left">
            <template slot-scope="scope">
              <el-link  type="primary"  @click.stop.prevent="linkzc(scope.row.id_assetcard)">{{scope.row.pk_assetcard_name}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="assetcard_name" label="资产名称" width="130"
                           show-overflow-tooltip header-align="center" align="left"></el-table-column>
          <el-table-column prop="bdate" label="变更日期" width="130"  sortable header-align="center" align="left"></el-table-column>
          <el-table-column prop="ovalue" label="变更前原值" width="130"  header-align="center" align="right" :formatter="repformny">
          </el-table-column>
          <el-table-column  prop="nvalue" label="变更后原值" width="130" header-align="center"
                            align="right"  :formatter="repformny">
          </el-table-column>
          <el-table-column prop="togl" label="转总账" width="100" align="center"></el-table-column>
          <el-table-column prop="voucherno" label="凭证" width="100" show-overflow-tooltip sortable align="center">
            <template slot-scope="scope" v-if="scope.row.id_voucher != null">
              记<el-link  type="primary"  @click.stop.prevent="linkPzById(scope.row.id_voucher)">{{scope.row.voucherno}}</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog
      title="新增"
      :visible.sync="addDialog"
      width="25%"
      :close-on-click-modal="false"
      :modal="false"
      @closed="closeDialog"
    >
      <el-container style="margin-top: 18px;">
        <el-form ref="ruleForm" label-width="145px" :inline="true" :model="form" >
          <el-form-item size="mini" label="资产卡片:"  prop="id_assetcard"
                        :rules="[
                          { required: true, message: '资产卡片不能为空'},
                        ]">
            <el-select
              v-model="form.id_assetcard"
              @change="zcSelectChange"
              :clearable = "true"
              style="width: 200px">
              <el-option
                v-for="item in assetsCardOption"
                :key="item.id_assetcard"
                :value="item.id_assetcard"
                :label="item.ascode + '   '+ item.asname">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" label="变更日期:">
            <el-date-picker v-model="form.bdate" type="date" value-format="yyyy-MM-dd" style="width: 200px"></el-date-picker>
          </el-form-item>
          <el-form-item size="mini" label="变更前原值:" prop="ovalue">
            <el-input-number v-model="form.ovalue"  :precision="2"  :controls = "false"  :disabled="true" style="width: 200px"></el-input-number>
          </el-form-item>
          <el-form-item size="mini" label="变更后原值:" prop="nvalue"
                        :rules="[
                          { required: true, message: '变更后原值不能为空'},
                        ]">
            <el-input-number v-model="form.nvalue"  :precision="2"  :controls = "false"  style="width: 200px"></el-input-number>
          </el-form-item>
          <el-form-item size="mini" label="固定(无形)资产科目:">
            <el-input v-model="form.zckm" readonly style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="结算科目:" prop="bgkm_id"
                        :rules="[
                          { required: true, message: '结算科目不能为空'},
                        ]">
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
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveForm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from '../../components/Header'
import {getMonthBegin, getMonthEnd, accSubtr, accMul} from '@/utils'
import { CURRENCY_RMB} from '@/constants'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'yzbg',
  mixins: [datePickerMixin],
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
      date: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      assetsCard: '',
      assetsCardOption: [],
      subjectRef: this.$store.getters.subSubjectRef,
      currentRow: '', // table选中行
      queryForm: { // 查询参数
        begindate: '',
        enddate: '',
        pk_assetcard: '',
        ascode: ''
      },
      form: { // 表单参数
        id_assetcard: '', // 资产卡片id
        bdate: this.$store.getters.getLoginDate, // 变更日期
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
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    // 新增
    add: function () {
      this.addDialog = true
    },
    // 保存
    saveForm: function () {
      this.$refs.ruleForm.validate((rs) => {
        if (rs) {
          this.$api.originalChange.addRows(this.form).then(result => {
            this.successMsg(result)
            if (result.success) {
              this.addDialog = false
              this.refresh(-1)
            }
          })
        }
      })
    },
    // 联查资产
    linkzc (assetid) {
      this.$router.push({
        name: 'zckp',
        params: {
          zcid: assetid
        }
      })
    },
    // 查询
    query: function () {
      this.getDateToReturn()
      this.loadTableList(1)
    },
    // 删除
    del: function () {
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.$confirm('确认删除?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.originalChange.deleteRows(this.currentRow).then(result => {
          this.successMsg(result)
          this.refresh(-1)
        }).catch(e => {
        })
      })
    },
    // 刷新
    refresh: function (val) {
      this.loadTableList(val)
    },
    getKmData: function (val) {
      return this.subjectRef.filter(item => item.id === val)
    },
    // 转总账
    onBoToGL: function () {
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      if (this.currentRow.togl === '是') {
        this.$message({showClose: true, message: '已转总账，不允许再次转总账！', type: 'warning'})
        return
      }
      const zy = '资产卡片' + this.currentRow.assetcard_name + '原值变更'
      const ce = accSubtr(this.currentRow.ovalue, this.currentRow.nvalue)
      // 根据id 找到对应的科目vo
      this.$router.push({
        name: 'voucher-edit',
        params: {
          data: {
            corpId: this.currentRow.id_corp,
            pzlb: 0,
            sfjz: 'N',
            coperatorid: this.$store.getters.getUserId,
            zdrq: this.$store.getters.getLoginDate,
            lydjlx: 'HP60', // 原值变更
            lydjid: this.currentRow.id_assetvaluemodify,
            children: [{
              kmid: this.currentRow.bgkm_id,
              zy: zy,
              pk_currency: CURRENCY_RMB,
              dfmny: ce < 0 ? accMul(ce, -1) : 0,
              ybdfmny: ce < 0 ? accMul(ce, -1) : 0,
              jfmny: ce >= 0 ? ce : 0,
              ybjfmny: ce >= 0 ? ce : 0,
              pk_corp: this.currentRow.id_corp,
              rowno: 0
            }, {
              kmid: this.currentRow.zckm_id,
              zy: zy,
              pk_currency: CURRENCY_RMB,
              jfmny: ce < 0 ? accMul(ce, -1) : 0,
              ybjfmny: ce < 0 ? accMul(ce, -1) : 0,
              dfmny: ce >= 0 ? ce : 0,
              ybdfmny: ce >= 0 ? ce : 0,
              pk_corp: this.currentRow.id_corp,
              rowno: 1
            }]
          }
        }
      })
    },
    // 根据id联查凭证
    linkPzById: function (id_voucher) {
      if (!id_voucher) {
        this.$message({showClose: true, message: '尚未转总账,无凭证！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: this.currentRow.id_voucher
        }
      })
    },
    // 联查凭证
    linkPz: function () {
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.linkPzById(this.currentRow.id_voucher)
    },
    closeDialog: function () {
      this.$refs.ruleForm.resetFields()
    },
    // 资产选择变化
    zcSelectChange: function (row) {
      let zcobj = null
      for (const t of this.assetsCardOption) {
        if (t.id_assetcard === row) {
          zcobj = t
          break
        }
      }
      // 赋值
      this.form.ovalue = zcobj.atmny
      this.form.zckm_id = zcobj.zckm_id
      this.form.zckm = zcobj.zckm
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
    // 行选择
    handleCurrentChange: function (val) {
      this.currentRow = val
    },
    clearPose: function () {
      this.getDateToReturn()
    },
    getDateToReturn: function () {
      let retParam = {
        times: this.date[0] + '-' + this.date[1],
        visiblePopover: false
      }
      this.$bus.$emit('date', retParam)
    },
    successMsg (data) {
      if (data.success) {
        this.$message({showClose: true, message: data.msg, type: 'success'})
      } else {
        this.$message({showClose: true, message: data.msg, type: 'error'})
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
