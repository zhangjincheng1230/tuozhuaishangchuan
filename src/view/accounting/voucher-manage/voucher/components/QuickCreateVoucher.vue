<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="业务类型">
        <el-select
          v-model="formData.businessName"
          @change="handleTemplateChange"
          filterable style="width: 150px;">
          <el-option
            v-for="temp in templateRef"
            :key="temp.name"
            :value="temp.name"
            :label="temp.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="票据类型">
        <el-select
          v-model="formData.billType"
          filterable
          @change="mathTemplate"
          style="width: 140px;">
          <el-option
            v-for="item in billTypeRef"
            :key="item.code"
            :value="item.code"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式">
        <el-select
          v-model="formData.settleMethod"
          @change="mathTemplate"
          filterable
          style="width: 100px;">
          <el-option
            v-for="item in settleMethodRef"
            :key="item.code"
            :value="item.code"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input
          v-model="formData.summary"
          @change="createVoucherByTemplate"
          style="width: 110px;"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.remark"
          @change="createVoucherByTemplate"
          style="width: 110px;"></el-input>
      </el-form-item>
      <div>
        <el-form-item v-if="showNumber" label="数量" key="numberInput">
          <el-input-number
            v-model="formData.number"
            :controls="false"
            :precision="4"
            style="width: 110px;" @change="createVoucherByTemplate"></el-input-number>
        </el-form-item>
        <el-form-item :label="mnyInput.label" v-for="mnyInput in mnyInputs" :key="mnyInput.value">
          <el-input-number
            v-model="formData[mnyInput.value]"
            :controls="false"
            :precision="2"
            style="width: 110px;" @change="onMnyChange"></el-input-number>
        </el-form-item>
        <el-form-item :label="auxiliaryInput.name" v-for="auxiliaryInput in auxiliaryInputs" :key="auxiliaryInput.code">
          <el-select
            v-model="formData['fzhs' + auxiliaryInput.code]"
            style="width: 110px;" @change="createVoucherByTemplate">
            <el-option
              v-for="item in auxiliaryArchive[auxiliaryInput.code]"
              :key="item.id"
              :value="item.id"
              :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>

const mnyFields = [
  {
    label: '金额',
    value: 'mny'
  },
  {
    label: '无税金额',
    value: 'wsmny'
  },
  {
    label: '含税金额',
    value: 'hsmny'
  },
  {
    label: '税额',
    value: 'smny'
  },
  {
    label: '总金额',
    value: 'totalmny'
  }
]
export default {
  name: 'QuickCreateVoucher',
  data () {
    return {
      formData: {
        businessName: null,
        billType: null,
        settleMethod: null
      },
      templateMap: null,
      templateId: null,
      templateRef: [],
      billTypeRef: [],
      settleMethodRef: [],
      templateEntryCache: {},
      mnyInputs: [],
      auxiliaryInputs: [],
      showNumber: false,
      auxiliaryArchive: {}
    }
  },
  computed: {
    subjectData () {
      return this.$store.getters.subjectRef
    },
    subSubjectData () {
      return this.$store.getters.subSubjectRef
    },
    auxiliaryTypes () {
      return this.$store.getters.auxiliaryTypes
    },
    inventoryModuleEnabled () {
      return this.$store.getters.inventoryModuleEnabled
    }
  },
  created () {
    this.fetchTemplate()
  },
  methods: {
    fetchTemplate () {
      this.$api.BasicSettingApi.BusinessTypeTemplate.queryTemp({
        isquickcreate: 'Y'
      }).then(res => {
        if (res.success) {
          this.processTemplate(res.rows)
        }
      })
    },
    processTemplate (temps) {
      let tempMap = new Map()
      let tempRef = []
      temps.forEach(temp => {
        let name = temp.busitempname
        if (tempMap.has(name)) {
          tempMap.get(name).push(temp)
        } else {
          tempMap.set(name, [temp])
          tempRef.push({
            name: temp.busitempname,
            label: temp.busitempcode + ' ' + temp.busitempname,
            pinyin: temp.shortpinyin
          })
        }
      })
      this.templateRef = tempRef
      this.templateMap = tempMap
    },
    handleTemplateChange (tempName) {
      this.clearForm()
      let temps = this.templateMap.get(tempName)
      let billTypeSet = new Set()
      let billTypeArray = []
      let settleMethodSet = new Set()
      let settleMethodArray = []
      temps.forEach(temp => {
        if (!billTypeSet.has(temp.vspstylecode)) {
          billTypeArray.push({
            code: temp.vspstylecode,
            name: temp.vspstylename
          })
          billTypeSet.add(temp.vspstylecode)
        }
        if (!settleMethodSet.has(temp.szstylecode)) {
          settleMethodArray.push({
            code: temp.szstylecode,
            name: temp.szstylename
          })
          settleMethodSet.add(temp.szstylecode)
        }
      })
      this.billTypeRef = billTypeArray
      this.settleMethodRef = settleMethodArray
      this.formData.billType = billTypeArray[0].code
      this.formData.settleMethod = settleMethodArray[0].code
      this.mathTemplate()
    },
    mathTemplate () {
      if (this.formData.businessName && this.formData.billType && this.formData.settleMethod) {
        let temps = this.templateMap.get(this.formData.businessName)
        let temp = temps.find(item => item.vspstylecode === this.formData.billType &&
          item.szstylecode === this.formData.settleMethod)

        let tempId = temp.pk_model_h
        this.templateId = tempId
        if (this.templateEntryCache[tempId]) {
          this.processTemplateChildren(this.templateEntryCache[tempId])
        } else {
          this.$api.BasicSettingApi.BusinessTypeTemplate.queryB({
            pk_model_h: tempId
          }).then(res => {
            if (res.success) {
              this.templateEntryCache[tempId] = res.rows
              this.processTemplateChildren(res.rows)
            }
          })
        }
      }
    },
    processTemplateChildren (children) {
      let mnyTypeSet = new Set()
      let auxiliarySet = new Set()
      let containsNumber = false
      children.forEach(child => {
        mnyTypeSet.add(child.vfield)
        let subject = this.findSubjectById(child.pk_accsubj)
        if (subject) {
          let isfzhs = subject.isfzhs
          let fzArray = [...isfzhs]
          fzArray.forEach((flag, index) => {
            if (flag === '1') {
              auxiliarySet.add(index + 1)
            }
          })
          if (containsNumber === false && subject.sfsz === '是') {
            containsNumber = true
          }
        } else {
          console.log('模板科目不存在')
        }
      })
      let mnyInputs = mnyFields.filter(field => mnyTypeSet.has(field.value))
      this.mnyInputs = mnyInputs
      let auxiliaryInputs = []
      auxiliarySet.forEach(code => {
        let auxiliaryType = this.auxiliaryTypes.find(type => type.code === code)
        this.fetchAuxiliaryArchive(auxiliaryType.code)
        auxiliaryInputs.push({
          name: auxiliaryType.name,
          code: auxiliaryType.code
        })
      })
      this.auxiliaryInputs = auxiliaryInputs
      this.showNumber = containsNumber
      this.createVoucherByTemplate()
    },
    clearForm () {
      for (let key in this.formData) {
        if (this.formData.hasOwnProperty(key)) {
          if (key !== 'businessName') {
            this.formData[key] = undefined
          }
        }
      }
    },
    findSubjectById (id) {
      let subject = this.subjectData.find(subj => subj.id === id)
      if (subject) {
        if (subject.yz !== '是') {
          subject = this.subSubjectData.find(subj => subj.kmbm.indexOf(subject.kmbm) === 0 && subj.yz !== '是')
        }
      }
      return subject
    },
    onMnyChange () {
      this.createVoucherByTemplate()
    },
    createVoucherByTemplate () {
      let voucher = {}
      let billType = this.formData.billType
      if (billType === '01') {
        voucher.fp_style = 2
      } else if (billType === '02') {
        voucher.fp_style = 1
      }
      voucher.children = this.getVoucherEntriesByTemplate()
      this.$emit('create-voucher', voucher)
    },
    getVoucherEntriesByTemplate () {
      let templateId = this.templateId
      if (!templateId) {
        return false
      }
      let entries = this.templateEntryCache[templateId]
      let vchEntries = []
      let summary = this.formData.summary
      let remark = this.formData.remark
      for (let i = 0; i < entries.length; i++) {
        let vchEntry = {}
        let entry = entries[i]
        let subject = this.findSubjectById(entry.pk_accsubj)
        if (subject) {
          vchEntry.kmid = subject.id
          vchEntry.kmcode = subject.kmbm
          if (subject.sfsz === '是') {
            let number = this.formData.number
            if (number) {
              number = Number(number)
              vchEntry.chnum = number
              let mny = this.formData[entry.vfield]
              if (mny && number !== 0) {
                vchEntry.chdj = (mny / number).toFixed(4)
              }
            }
          }

          for (let fzIndex = 0; fzIndex < subject.isfzhs.length; fzIndex++) {
            if (subject.isfzhs[fzIndex] === '1') {
              let fzKey = 'fzhs' + (fzIndex + 1)
              let voucherKey = fzKey
              if (this.inventoryModuleEnabled && fzIndex === 5) {
                voucherKey = 'chid'
              }
              let fzId = this.formData[fzKey]
              vchEntry[voucherKey] = fzId
            }
          }
        }
        let dfmny = 0
        let jfmny = 0
        vchEntry.zy = (summary === '' || summary === undefined ? entry.zy : summary) +
          (remark === undefined ? '' : remark)
        if (entry.direction === 0) {
          jfmny = this.formData[entry.vfield]
        } else {
          dfmny = this.formData[entry.vfield]
        }
        vchEntry.dfmny = dfmny
        vchEntry.jfmny = jfmny
        vchEntries.push(vchEntry)
      }
      return vchEntries
    },
    fetchAuxiliaryArchive (type, subjectId) {
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: this.auxiliaryTypes.find(item => item.code === type).id,
        kmid: subjectId,
        unjl: 'Y'
      }).then(res => {
        if (res.rows) {
          this.$set(this.auxiliaryArchive, type, res.rows)
        } else {
          this.$set(this.auxiliaryArchive, type, [])
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
