<template>
  <div >
    <div class="query-info">
      <div  style = "margin-right: 10px">期间：
        <el-popover
          placement="bottom-start"
          title="发生额及余额表查询"
          width="480"
          popper-class="query-popover"
          v-model="queryVisible">
          <el-form ref="form" :model="formParam" label-width="auto">
            <el-form-item label="期间：">
              <el-date-picker
                v-model="formParam.periodRange"
                type="monthrange"
                unlink-panels
                range-separator="-"
                value-format="yyyy-MM"
                :picker-options="monthPickerOptions"
                style="width: 370px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="科目类型：">
              <el-select
                v-model="formParam.kmsx"
                style="width: 370px">
                <el-option
                  v-for="item in subjectattr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="科目：">
              <el-select
                filterable
                v-model="formParam.kms_first"
                :clearable = "true"
                style="width: 178px">
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
                style="width: 178px">
                <el-option
                  v-for="item in subjectRef"
                  :key="item.id"
                  :value="item.kmbm"
                  :label="item.codename">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="级次：">
              <el-select
                v-model="formParam.cjq"
                style="width: 178px">
                <el-option
                  v-for="item in subjectLevel"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
              -
              <el-select
                v-model="formParam.cjz"
                style="width: 178px">
                <el-option
                  v-for="item in subjectLevel"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
            <el-collapse-transition>
              <div v-show="showFullParam" style="max-height: 210px">
                <el-form-item label="币种：">
                  <el-select
                    v-model="formParam.pk_currency"
                    style="width: 370px">
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
                  <el-checkbox
                    label="本期无余额无发生不显示"
                    true-label="Y" false-label="N"
                    v-model="formParam.xswyewfs"
                    style="width: 150px"></el-checkbox>
                </el-form-item>
                <el-form-item label="">
                  <el-checkbox
                    label="本期有余额无发生不显示"
                    true-label="N" false-label="Y"
                    v-model="formParam.ishowfs"
                    style="width: 150px"></el-checkbox>
                  <el-checkbox
                    label="本年无余额无发生不显示"
                    true-label="Y" false-label="N"
                    v-model="formParam.xswyewfs_bn"
                    style="width: 150px"></el-checkbox>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select
                    filterable
                    v-model="formParam.corpobj" value-key = "pk_gs"
                    style="width: 370px">
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
      <span class="query-corp" :title="corpName">公司: {{ corpName }}</span>
    </div>
    <div class="kj-button-group">
      <el-switch v-model="formParam.sfzxm" @change="switchSfzxm" active-value="Y" inactive-value="N"></el-switch>
      <span v-show="formParam.sfzxm === 'N'">显示辅助</span>
      <a v-show="formParam.sfzxm === 'Y'" href="javascript:void(0)" style="text-decoration: none;color: #2c9dd8"  v-popover:popoverfzxm>显示辅助</a>
      <span>&nbsp;&nbsp;</span>
      <el-button @click="$emit('print')">打印</el-button>
      <el-button @click="$emit('exportReport')">导出</el-button>
    </div>

    <el-popover :disabled="formParam.sfzxm === 'N'"  ref="popoverfzxm" trigger="click"
                transition="fade-in-linear">
      <el-checkbox-group v-model="checkList" @change="filterFzlb">
        <el-checkbox :key="index" v-for="(item, index) in fzlbarray" :label="item.code"> {{item.name}}</el-checkbox>
      </el-checkbox-group>
    </el-popover>
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
      subjectRef: [],
      subjectLevel: SUBJECT_LEVEL,
      subjectattr: SUBJECT_ATTR,
      showFullParam: false,
      formParam: {
        periodRange: [this.$store.getters.getLoginDate.substr(0, 7), this.$store.getters.getLoginDate.substr(0, 7)],
        begindate: '',
        enddate: '',
        cjq: 1,
        cjz: 5,
        corpobj: this.$store.getters.currentCorp,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        kms_first: '',
        kms_last: '',
        pk_currency: '',
        kmsx: null,
        ishasjz: 'N',
        sfzxm: 'N',
        isleaf: 'N',
        ishowfs: 'Y',
        xswyewfs: 'Y',
        xswyewfs_bn: 'N'
      },
      corpIds: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      qrydate: this.$store.getters.getLoginDate.substr(0, 7) + '-' + this.$store.getters.getLoginDate.substr(0, 7),
      fzlbarray: [],
      checkList: []
    }
  },
  computed: {
  },
  props: {
    pageInfo: {},
    routerParam: {},
    nodename: {}
  },
  watch: {
    'formParam.corpobj': function (val, oldval) {
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.querybz()
      this.querySubjectRef()
      this.queryFzLb()
    },
    routerParam: {
      handler (val) {
        if (val) {
          // 来源期末关账报告
          if (val.id === 'qmgzbg') {
            this.formParam.periodRange = [val.qj, val.qj]
            const otherparam = {
              kms_first: val.kms_first,
              kms_last: val.kms_last
            }
            this.query(otherparam)
          } else {
            Object.entries(val).forEach(([key, value]) => {
              if (this.formParam.hasOwnProperty(key)) {
                this.formParam[key] = value
              }
            })
            // this.query()
            this.init()
          }
        }
      },
      immediate: true
    }
  },
  created () {
    this.queryFzLb()
    this.querySubjectRef()
    if (!this.routerParam) {
      // this.query()
      this.init()
    }
  },
  methods: {
    switchSfzxm (val) {
      this.saveSettingMsg(val)
      this.query()
    },
    async init () {
      await this.querySettingMsg()
      this.query()
    },
    // 报表查询
    query (otherparam) {
      this.formParam.begindate = getMonthBegin(this.formParam.periodRange[0])
      this.formParam.enddate = getMonthEnd(this.formParam.periodRange[1])
      this.qrydate = this.formParam.periodRange[0] + '-' + this.formParam.periodRange[1]
      this.corpName = this.formParam.corpobj.uname
      this.formParam.corpIds = this.formParam.corpobj.pk_gs
      this.$emit('query', otherparam ? Object.assign(this.formParam, otherparam) : this.formParam, this.qrydate)
      this.queryVisible = false
    },
    // 保存设置
    saveSettingMsg (val) {
      // 保存设置的时候，和nodename 不为空的时候，
      const param = {
        nodename: this.nodename,
        print_setting1: JSON.stringify({'km_showfzxm_val': val}),
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        corpids: this.$store.getters.currentCorp.pk_gs,
        updatecolumn: 'print_setting1'
      }
      this.$api.printSetting.saveMulColumn(param).then(result => {
      }).catch(e => {
      })
    },
    // 查询报表设置
    async querySettingMsg () {
      // 保存设置的时候，和nodename 不为空的时候，
      await this.$api.printSetting.printQuerySetting(this.nodename, this.$store.getters.currentCorp.pk_gs).then(result => {
        if (result.success) {
          let printsetting = null
          let printsetting1 = null
          if (result.rows) {
            if (result.rows.print_setting) {
              printsetting = JSON.parse(result.rows.print_setting)
            }
            if (result.rows.print_setting1) {
              printsetting1 = JSON.parse(result.rows.print_setting1)
            }
          }
          if (printsetting1) {
            this.formParam.sfzxm = printsetting1['km_showfzxm_val'] === 'Y' ? 'Y' : 'N'
          } else if (printsetting) { // 处理历史数据
            this.formParam.sfzxm = printsetting['km_showfzxm_val'] === 'Y' ? 'Y' : 'N'
          }
        } else {
        }
      }).catch(e => {
      })
    },
    // 过滤辅助类别
    filterFzlb () {
      this.$emit('filterFzlb', this.checkList)
    },
    getCheckList () {
      let codelist = []
      for (const t of this.checkList) {
        codelist[codelist.length] = t + ''
      }
      return codelist
    },
    queryFzLb () {
      this.checkList = []
      this.$api.LrbCenterReport.getFzLb(this.formParam.corpIds).then(
        result => {
          if (result.success) {
            this.fzlbarray = result.rows
            for (const tt of this.fzlbarray) {
              this.checkList[this.checkList.length] = tt.code
            }
          }
        }
      ).catch(e => {
      })
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
