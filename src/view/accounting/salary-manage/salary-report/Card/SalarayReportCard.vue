<template>
  <div class="kj-container kj-card" >
    <template v-if="this.formData.billtype === '01'">
      <template v-if="this.formData.qj >= '2019-01'">
        <SalarayReportCardNew :qybf="this.showqybf" :zxfj="this.showzxfj"  :data="formData"></SalarayReportCardNew>
      </template>
      <template v-else>
        <SalarayReportCardOld :data="formData"></SalarayReportCardOld>
      </template>
    </template>
    <template v-else-if="this.formData.billtype === '02'">
      <SalarayReportCardRemn :data="formData"></SalarayReportCardRemn>
    </template>
    <template v-else-if="this.formData.billtype === '03'">
      <SalarayReportCardForn :data="formData"></SalarayReportCardForn>
    </template>
  </div>
</template>

<script>
import SalarayReportCardNew from './SalarayReportCardNew'
import SalarayReportCardOld from './SalarayReportCardOld'
import SalarayReportCardForn from './SalarayReportCardForn'
import SalarayReportCardRemn from './SalarayReportCardRemn'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SalarayReportCard',
  mixins: [MessageUtil, Loading],
  components: {
    SalarayReportCardNew,
    SalarayReportCardOld,
    SalarayReportCardForn,
    SalarayReportCardRemn
  },
  props: ['data', 'qybf', 'zxfj'],
  data () {
    return {
      formData: {}
    }
  },
  computed: {
    formInfo: {
      get () {
        return this.data
      },
      set (data) {
        this.$emit('update:data', data)
      }
    },
    showqybf: {
      get () {
        return this.qybf
      },
      set (flag) {
        this.$emit('update:qybf', flag)
      }
    },
    showzxfj: {
      get () {
        return this.zxfj
      },
      set (flag) {
        this.$emit('update:zxfj', flag)
      }
    }
  },
  mounted () {
    const formData = Object.assign({}, this.formInfo)
    if (formData.curOptType === 'new') {
      this.formData = { qj: formData.qj, billtype: formData.billtype }
    } else {
      this.formData = formData
    }
  },
  methods: {
    addByDouble (dous) {
      let temp = 0
      if (dous === null || dous.length === 0) { return temp }
      for (const dou of dous) {
        temp = Number(temp) + Number(dou)
      }
      return temp
    },
    subByDouble (dous) {
      let temp = 0
      if (dous === null || dous.length === 0) { return temp }
      const len = dous.length
      for (let i = 0; i < len; i++) {
        if (i === 0) {
          temp = dous[i]
        } else {
          temp = temp - dous[i]
        }
      }
      return temp
    },
    getTax (salaryBeforeTax, kcnum) {
      const dous = []
      const qj = this.period
      if (salaryBeforeTax) {
        // （3W-3.5K）*25%-1005
        // 扣税公式是：
        // （扣除社保医保公积金后薪水-个税起征点）*税率-速算扣除数
        let taxbase = salaryBeforeTax - kcnum
        let Taxrate = 0// 这里税率没有除以百分比；
        let Quickdeduction = 0
        if (qj >= '2018-10') {
          if (taxbase <= 0) { // 低于个税起征点
            Taxrate = 0
            Quickdeduction = 0
          } else if (taxbase <= 3000) {
            Taxrate = 3
            Quickdeduction = 0
          } else if (taxbase <= 12000) {
            Taxrate = 10
            Quickdeduction = 210
          } else if (taxbase <= 25000) {
            Taxrate = 20
            Quickdeduction = 1410
          } else if (taxbase <= 35000) {
            Taxrate = 25
            Quickdeduction = 2660
          } else if (taxbase <= 55000) {
            Taxrate = 30
            Quickdeduction = 4410
          } else if (taxbase <= 80000) {
            Taxrate = 35
            Quickdeduction = 7160
          } else {
            Taxrate = 45
            Quickdeduction = 15160
          }
        } else {
          if (taxbase <= 0) { // 低于个税起征点
            Taxrate = 0
            Quickdeduction = 0
          } else if (taxbase <= 1500) {
            Taxrate = 3
            Quickdeduction = 0
          } else if (taxbase <= 4500) {
            Taxrate = 10
            Quickdeduction = 105
          } else if (taxbase <= 9000) {
            Taxrate = 20
            Quickdeduction = 555
          } else if (taxbase <= 35000) {
            Taxrate = 25
            Quickdeduction = 1005
          } else if (taxbase <= 55000) {
            Taxrate = 30
            Quickdeduction = 2755
          } else if (taxbase <= 80000) {
            Taxrate = 35
            Quickdeduction = 5505
          } else {
            Taxrate = 45
            Quickdeduction = 13505
          }
        }
        dous[0] = Taxrate
        dous[1] = Quickdeduction
      }
      return dous
    },
    getkcnum (vbilltype, qj) {
      var kcnum = 0

      if (vbilltype === '01') {
        kcnum = 3500
        if (qj >= '2018-10') {
          kcnum = 5000
        } else {
          kcnum = 3500
        }
      } else if (vbilltype === '03') {
        kcnum = 4800
        if (qj >= '2018-10') {
          kcnum = 5000
        } else {
          kcnum = 4800
        }
      }
      return kcnum
    },
    saveInfo (formCardData) {
      const saveHead = Object.assign({}, formCardData)
      const temp = {
        strArr: JSON.stringify(saveHead),
        opdate: formCardData.qj,
        pk_corp: this.$parent.pk_corp,
        billtype: formCardData.billtype
      }
      this.showLoading('正在保存...')
      this.$api.SalaryManageApi.SalaryReport.saveInfo(temp).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg(result.msg)
          this.$parent.editStatus = false
          this.$parent.cardShow = false
          this.$parent.period = formCardData.qj
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    cancelEdit () {
      this.$parent.editStatus = false
      this.$parent.cardShow = false
      this.$parent.period = this.formData.qj
    }
  }
}
</script>

<style scoped>
  >>>.el-input-number .el-input__inner {
    text-align: right;
  }
</style>
