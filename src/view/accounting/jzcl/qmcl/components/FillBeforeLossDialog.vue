<template>
  <el-dialog :title="title"
             :visible.sync="dialogVisible"
             @open="onDialogOpen"
             @close="onDialogClose"
             @closed="onDialogClosed"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             v-loading="loading"
             element-loading-text="请稍候..."
             element-loading-background="rgba(0, 0, 0, 0)"
             element-loading-spinner="el-icon-loading"
             width="450px">
    <el-form :model="formData" :rules="rules" label-position="right" ref="formData">
      <el-form-item label="弥补年度" prop="lossyear" :label-width="formLabelWidth">
        <el-select v-model="formData.lossyear" placeholder="请选择弥补的年度" style="width: 100%;">
          <el-option
            v-for="item in lossYears"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可弥补亏损额" prop="loss" :label-width="formLabelWidth">
        <el-input-number type = 'loss' size="mini" v-model.number="formData.loss" :controls="false" :precision="2"  class = "loss"></el-input-number>
      </el-form-item>
    </el-form>
    <p style="margin-top: 10px;text-align: left; font-size: 15px;">
      举例说明：【弥补年度】为 2018 年度，【可弥补亏损额】的录入值为 2017 年度汇算清缴后，税务核定的可用于以后年度利润弥补的亏损额（2013-2017）。
    </p>
    <p style="margin-top: 10px;color: red; text-align: left; font-size: 15px;">
      有关政策：<br>
      《企业所得税法》第十八条规定：企业纳税年度发生的亏损，准予向以后年度结转，用以后年度的所得弥
      补，但结转年限最长不得超过五年（例如 2018 年允许弥补 2013-2017 年度亏损）。<br>
      财税[2018]76 号:自 2018 年 1 月 1 日起，当年具备高新技术企业或科技型中小企业资格的企业，其具备
      资格年度之前 5 个年度发生的尚未弥补完的亏损，准予结转以后年度弥补，最长结转年限由 5 年延长至 10 年。
    </p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveLoss">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'FillBeforeLossDialog',
  props: ['visible', 'lossdata'],
  data () {
    return {
      formData: {},
      formLabelWidth: '120px',
      rules: {
        lossyear: [
          { required: true, message: '请录入弥补年度', trigger: 'blur' }
        ],
        loss: [
          { required: true, message: '请录入可弥补亏损额', trigger: 'blur' }
        ]
      },
      loading: false
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
    title () {
      return '录入可弥补亏损额'
    },
    lossYears () {
      return [{label: this.lossdata.lossyear, value: this.lossdata.lossyear}]
    }
  },
  methods: {
    saveLoss () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.loading = true
          const paramters = {begindate: this.formData.lossyear + '-01-01', lossvalue: this.formData.loss, pk_corp: this.formData.pk_corp}
          this.$api.qmcl.updateqmLoss(paramters).then(result => {
            this.loading = false
            if (result.success) {
              this.closeDialog()
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'success',
                dangerouslyUseHTMLString: true
              })
            } else {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'error',
                dangerouslyUseHTMLString: true
              })
            }
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    onDialogOpen () {
      const formData1 = Object.assign({}, this.lossdata)
      this.formData = formData1
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formData.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.loss{
  width: 100%;
}
.loss >>> .el-input .el-input__inner {
  text-align: right;
}
</style>
