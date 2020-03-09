<template>
  <div style = "display: inline-flex;">
    <div  style = "margin-right: 10px">期间：
      <el-popover
        placement="bottom-start"
        title="现金/银行日记账查询"
        width="450"
        popper-class="query-popover"
        v-model="queryVisible">
        <el-form ref="form" :model="formParam" label-width="auto">
          <el-form-item label="期间：">
            <el-date-picker
              v-model="formParam.periodRange"
              type="monthrange"
              unlink-panels
              range-separator="-"
              :picker-options="monthPickerOptions"
              value-format="yyyy-MM"
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
          <el-collapse-transition>
            <div v-show="showFullParam" style="max-height: 210px">
              <el-form-item label="币种：">
                <el-select
                  v-model="formParam.pk_currency"
                  style="width: 315px">
                  <el-option v-for="item in subjectCurrency"
                             :key="item.id"
                             :value="item.id"
                             :label="item.name"
                             style = "width:315px">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-checkbox
                  label="包含未记账凭证"
                  v-model="formParam.ishasjz"
                  true-label="N" false-label="Y"
                  style="width: 150px"></el-checkbox>
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
import { SUBJECT_LEVEL, SUBJECT_ATTR } from '@/constants'
import { getMonthEnd, getMonthBegin } from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
import currencyMixin from '@/mixins/report-currency'
export default {
  name: 'head',
  mixins: [datePickerMixin, currencyMixin],
  data () {
    return {
      queryVisible: null,
      subjectRef: this.$store.getters.subSubjectRef,
      showFullParam: false,
      formParam: {
        periodRange: [this.$store.getters.getLoginDate.substr(0, 7), this.$store.getters.getLoginDate.substr(0, 7)],
        begindate: '',
        enddate: '',
        corpobj: this.$store.getters.currentCorp,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        kms_first: '',
        kms_last: '',
        pk_currency: '',
        ishasjz: 'N'
      },
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      qrydate: this.$store.getters.getLoginDate.substr(0, 7) + '-' + this.$store.getters.getLoginDate.substr(0, 7)
    }
  },
  computed: {
  },
  props: {
    pageInfo: {}
  },
  watch: {
    'formParam.corpobj': function (val, oldval) {
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.querybz()
      this.querySubjectRef()
    }
  },
  created () {
    this.query()
  },
  methods: {
    // 报表查询
    query () {
      this.formParam.begindate = getMonthBegin(this.formParam.periodRange[0])
      this.formParam.enddate = getMonthEnd(this.formParam.periodRange[1])
      this.qrydate = this.formParam.periodRange[0] + '-' + this.formParam.periodRange[1]
      this.corpName = this.formParam.corpobj.uname
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.$emit('query', this.formParam)
      this.queryVisible = false
    },
    // 查询科目
    querySubjectRef () {
      this.subjectRef = []
      this.$api.kmzzReport.getSubjectRef(this.formParam.corpIds).then(
        result => {
          if (result.success) {
            this.subjectRef = result.rows
          }
        }
      ).catch(e => {
      })
    }
  }
}
</script>

<style scoped>

</style>
