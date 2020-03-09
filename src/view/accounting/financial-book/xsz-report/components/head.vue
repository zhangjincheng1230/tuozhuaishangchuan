<template>
  <div style = "display: inline-flex;">
    <div  style = "margin-right: 10px">期间：
      <el-popover
        placement="bottom-start"
        title="序时账查询"
        width="450"
        popper-class="query-popover"
        v-model="queryVisible">
        <el-form ref="form" :model="formParam" label-width="auto">
          <el-form-item label="期间：">
            <el-date-picker
              v-model="formParam.periodRange"
              type="daterange"
              range-separator="-"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              style="width: 315px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="科目：">
            <el-select
              filterable
              v-model="formParam.kms_first"
              :clearable = "true"
              style="width: 150px">
              <el-option
                v-for="item in subjectRef"
                :key="item.id"
                :value="item.kmbm"
                :label="item.codename">
              </el-option>
            </el-select>
            -
            <el-select
              filterable
              v-model="formParam.kms_last"
              :clearable = "true"
              style="width: 150px">
              <el-option
                v-for="item in subjectRef"
                :key="item.id"
                :value="item.kmbm"
                :label="item.codename">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额：">
            <el-input-number  v-model="formParam.minmny"  :precision="2"  :controls = "false" style="width: 150px;text-align:right"></el-input-number>
            -
            <el-input-number   v-model="formParam.maxmny" :precision="2"  :controls = "false" style="width: 150px;text-align:right"></el-input-number>
          </el-form-item>
          <el-form-item label="摘要：" >
            <el-input   v-model="formParam.zy" style="width: 315px"></el-input>
          </el-form-item>
          <el-collapse-transition>
            <div v-show="showFullParam" style="max-height: 210px">
              <el-form-item label="">
                <el-checkbox
                  label="包含未记账凭证"
                  v-model="formParam.ishasjz"
                  style="width: 150px"></el-checkbox>
                <el-checkbox
                  label="显示汇率"
                  v-model="formParam.isxshl"></el-checkbox>
              </el-form-item>
              <el-form-item label="公司：">
                <el-select
                  filterable
                  v-model="formParam.corpobj" value-key = "pk_gs"
                  style="width: 315px">
                  <el-option v-for="item in corpIds"
                             :key="item.pk_gs"
                             :value="item"
                             :label="item.uname"
                             style = "width:315px">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-collapse-transition>
        </el-form>
        <div class="query-footer">
          <div class="condition-control">
            <el-link v-if="showFullParam" type="primary" :underline="false" @click="showFullParam=false">
              收起更多<i class="el-icon-arrow-up el-icon--right"></i>
            </el-link>
            <el-link v-else type="primary" :underline="false" @click="showFullParam=true">
              更多条件<i class="el-icon-arrow-down el-icon--right"></i>
            </el-link>
          </div>
          <div class="kj-button-group">
            <el-button @click="queryVisible = false">取消</el-button>
            <el-button type="primary" @click="query">确定</el-button>
          </div>
        </div>
        <span class="query-period" slot="reference">
                  {{qrydate}}
            <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
          </span>
      </el-popover>
    </div>
    <span class="query-corp">公司: {{ corpName }}</span>
  </div>
</template>

<script>
import { SUBJECT_LEVEL } from '@/constants'
import { getMonthEnd, getMonthBegin } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'xszhead',
  mixins: [datePickerMixin],
  data () {
    return {
      queryVisible: null,
      subjectRef: this.$store.getters.subSubjectRef,
      subjectLevel: SUBJECT_LEVEL,
      showFullParam: false,
      formParam: {
        periodRange: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
        begindate: '',
        enddate: '',
        ishasjz: true,
        corpobj: this.$store.getters.currentCorp,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        kms_first: '',
        kms_last: '',
        minmny: undefined,
        maxmny: undefined,
        isxshl: false,
        zy: ''
      },
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      qrydate: ''
    }
  },
  computed: {

  },
  props: {
    pageInfo: {}
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      this.$emit('updateloading', true)
      this.qrydate = this.formParam.periodRange[0] + '-' + this.formParam.periodRange[1]
      this.corpName = this.formParam.corpobj.uname
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.$api.xszReport.query(Object.assign(this.getQueryPram(), this.pageInfo)).then(result => {
        if (result.success) {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'success'
          })
          this.$emit('updatetabledata', result.rows)
          this.$emit('updatetotal', result.total)
        } else {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'warning'
          })
          this.$emit('updatetabledata', [])
          this.$emit('updatetotal', 0)
        }
        this.queryVisible = false
      }).catch(e => {
      })
      this.$emit('updateloading', false)
      this.$emit('updatequeryparam', this.getQueryPram())
    },
    getQueryPram () {
      this.formParam.begindate = this.formParam.periodRange[0]
      this.formParam.enddate = this.formParam.periodRange[1]
      this.formParam.corpName = this.corpName
      return this.formParam
    }
  }
}
</script>

<style scoped>

</style>
