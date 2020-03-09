<!--汇兑损益模板-->
<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             @open="onDialogOpen"
             @close="onDialogClose"
             @closed="onDialogClosed"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             width="450px">
    <el-form :model="formData" :rules="rules" ref="exrateForm" :label-width="formLabelWidth">
      <el-form-item label="币种" prop="pk_cur">
        <el-select v-model="formData.pk_cur"
                   :filter-method="filterdata"
                   filterable placeholder="请选择币种"
                   no-data-text="加载中"
                   @change="selectCurrency"
                   style="width: 100%">
          <el-option
            v-for="curr in allCurrList"
            :key="curr.id"
            :label="curr.name"
            :value="curr.id">
            <span style="float: left">{{ curr.code }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ curr.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="折算模式" prop="cmode">
        <el-select v-model="formData.cmode"
                   placeholder="请选择"
                   @change="selectCMode"
                   style="width: 100%">
          <el-option
            v-for="cmode in cmodeList"
            :key="cmode.value"
            :label="cmode.name"
            :value="cmode.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇率" prop="erate">
        <span class="prepend">1 {{ fromCurr }} ＝</span>
        <el-input-number :precision="huilvprecision" v-model="formData.erate" :controls="false"></el-input-number>
        <span class="append">{{ toCurr }}</span>
      </el-form-item>
      <el-form-item label="备注" prop="momo">
        <el-input v-model.trim="formData.momo" maxlength="100" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onDialogClose">取 消</el-button>
        <el-button type="primary" @click="saveExRate">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
  .prepend {
    padding-left: 7px;
    padding-right: 5px;
  }
  .append {
    padding-left: 5px;
    padding-right: 35px;
  }
</style>

<script>

export default {
  name: 'ExRateDialog',
  props: ['visible', 'erData', 'allRows'],
  data () {
    let verifyCurrency = (rule, currKey, callback) => {
      if (!currKey) {
        callback() // 非空校验可以由required去做
        return
      }
      const currName = this.formData.encyname
      if (currName === '人民币') { // 最好用currKey === '00000100AA10000000008YJ6'
        callback(new Error('无需设置本币汇率'))
        return
      }
      // 检查要新增或要改为的币种是否已存在
      if (this.allRows) {
        let isExist = false
        for (let row of this.allRows) {
          if (row.id_rate !== this.formData.id_rate && row.pk_cur === currKey) { // 在"除了自己的其他汇率行"中找
            isExist = true
            break
          }
        }
        if (isExist) { // 已存在该币种汇率
          callback(new Error(`${currName}的汇率已存在，不能重复添加`))
          return
        }
      }
      callback()
    }
    let checkRate = (rule, value, callback) => {
      if (!value) {
        callback() // 非空校验可以由required去做
        return
      }
      if (!/^-?(\d+|\d+\.\d*|\d*\.\d+)$/.test(value)) { // 允许 0., .1, 0.1, 01、2等，不允许空、光一个点(.)
        callback(new Error('请输入有效的数值'))
        return
      }
      callback()
    }
    return {
      formData: {},
      formLabelWidth: '90px',
      // 币种List
      allCurrList: [],
      allCurrListbak: [],
      // 折算模式List
      cmodeList: [
        {
          value: 0,
          name: '原币×汇率＝本位币'
        },
        {
          value: 1,
          name: '原币÷汇率＝本位币'
        }
      ],
      fromCurr: '',
      toCurr: '',
      huilvprecision: this.$store.getters.huilvPre,
      rules: {
        pk_cur: [
          { validator: verifyCurrency, trigger: 'change' },
          { required: true, message: '请输入币种', trigger: 'change' }
        ],
        cmode: [
          { required: true, message: '请输入折算模式', trigger: 'change' }
        ],
        erate: [
          { validator: checkRate, trigger: 'blur' },
          { required: true, message: '请输入汇率', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    isEdit () {
      return this.erData && this.erData.id_rate
    },
    title () {
      return this.isEdit ? '修改汇率' : '新增汇率'
    }
  },
  mounted () {
    // 准备币种列表
    this.getCurrRefData()
  },
  methods: {
    filterdata (val) {
      if (val) {
        this.allCurrList = this.allCurrListbak.filter((item) => {
          if (item.code.toLowerCase().indexOf(val.toLowerCase()) >= 0 || item.name.toLowerCase().indexOf(val.toLowerCase()) >= 0) {
            return true
          }
        })
      } else {
        this.allCurrList = this.allCurrListbak
      }
    },
    getCurrRefData () {
      // return this.$store.getters.currencyRef
      this.$api.BasicSettingApi.ExchangeRate.queryCurrency().then(result => {
        if (result.success) {
          this.allCurrList = result.rows
          this.allCurrListbak = result.rows
        }
      })
    },
    handleRowSelect (val) {
      this.selectedRow = val
    },
    selectCurrency (val) {
      // 设置币种名称(encyname)，回头刷新主界面时用
      if (this.allCurrList.length > 0) {
        this.formData.encyname = this.allCurrList.find(curr => curr.id === val).name
      }
      this.changeRateLabel()
    },
    selectCMode (val) {
      this.changeRateLabel()
    },
    editRow () {
      if (this.selectedRow) {
        this.dialogTitle = '修改'
        this.formData = JSON.parse(JSON.stringify(this.selectedRow))
        this.dialogVisible = true
      } else {
        this.showMsg('请选择要编辑的数据', 'warning')
      }
    },
    saveExRate () {
      this.$refs.exrateForm.validate((valid) => {
        if (valid) {
          // 保存汇率
          this.$api.BasicSettingApi.ExchangeRate.saveExRate(this.formData).then(result => {
            if (result.success) {
              this.dialogVisible = false
              // 对话框保存后，后台刷新或UI端刷新均可
              // this.fetchData()
              this.$emit('save', result.rows)
              this.onDialogClose()
            } else {
              this.showMsg(result.msg, result.success ? 'success' : 'error')
            }
          })
        }
      })
    },
    showMsg (msg, type) {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      })
    },
    onDialogOpen () {
      if (this.isEdit) {
        const formData = Object.assign({}, this.erData)
        this.formData = formData
        // this.showMsg(this.formData.encyname)
      } else {
        this.formData = {}
        // 设置默认值（默认值只在没值的时候起作用，所以要写在dialogOpen中）
        // 折算模式默认值：0-原币×汇率＝本位币
        this.formData.cmode = 0
      }
      this.changeRateLabel()
    },
    changeRateLabel () {
      let ocName = this.formData.pk_cur ? this.formData.encyname : '原币'
      if (this.formData.cmode === 0) {
        this.fromCurr = ocName
        this.toCurr = '人民币'
      } else {
        this.fromCurr = '人民币'
        this.toCurr = ocName
      }
    },
    onDialogClose () {
      this.dialogVisible = false
      // this.formData = {}
      // this.$refs.exrateForm.resetFields()
    },
    onDialogClosed () {
      this.formData = {}
      this.$refs.exrateForm.resetFields()
    }
  }
}
</script>
