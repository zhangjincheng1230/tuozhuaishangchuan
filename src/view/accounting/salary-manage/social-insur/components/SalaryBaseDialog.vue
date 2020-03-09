<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="650px">
    <el-form ref="formRef" :model="formData"  label-width="210px" style="margin-left: 15px;" >
      <el-row>
        <span style="font-size:15px;font-weight: bold;margin-left:80px">社保/公积金</span>
        <span style="font-size:15px;font-weight: bold;margin-left:110px">个人承担部分</span>
        <span style="font-size:15px;font-weight: bold;margin-left:110px">企业承担部分</span>
      </el-row>
      <el-row>
        <span style="margin-left:220px">缴纳基数</span>
        <span style="margin-left:30px">缴纳比例</span>
        <span style="margin-left:45px">固定金额</span>
        <span style="margin-left:35px">缴纳比例</span>
      </el-row>
      <el-row style="margin-top:10px;">
        养老保险基数/比例/固定金额：
        <el-input-number :precision="2" v-model="formData.yfbx_js" :controls =false :min="0" size="mini" style="width:100px;" :max="999999999" ></el-input-number>
        <el-input-number :precision="2" v-model="formData.yfbx_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999" ></el-input-number><span>%</span>
        <el-input-number :precision="2" v-model="formData.yfbx_mny" :controls =false :min="0" size="mini" style="width:100px;margin-left: 5px;" :max="999999999"></el-input-number>
        <el-input-number :precision="2" v-model="formData.qyyfbx_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999"></el-input-number><span>%</span>
      </el-row>
      <el-row style="margin-top:5px;">
        医疗保险基数/比例/固定金额：
        <el-input-number :precision="2" v-model="formData.ylbx_js" :controls =false :min="0" size="mini" style="width:100px;" :max="999999999" ></el-input-number>
        <el-input-number :precision="2" v-model="formData.ylbx_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999" ></el-input-number><span>%</span>
        <el-input-number :precision="2" v-model="formData.ylbx_mny" :controls =false :min="0" size="mini" style="width:100px;margin-left: 5px;" :max="999999999"></el-input-number>
        <el-input-number :precision="2" v-model="formData.qyylbx_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999"></el-input-number><span>%</span>
      </el-row>
      <el-row style="margin-top:5px;">
        失业保险基数/比例/固定金额：
        <el-input-number :precision="2" v-model="formData.sybx_js" :controls =false :min="0" size="mini" style="width:100px;" :max="999999999" ></el-input-number>
        <el-input-number :precision="2" v-model="formData.sybx_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999" ></el-input-number><span>%</span>
        <el-input-number :precision="2" v-model="formData.sybx_mny" :controls =false :min="0" size="mini" style="width:100px;margin-left: 5px;" :max="999999999"></el-input-number>
        <el-input-number :precision="2" v-model="formData.qysybx_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999"></el-input-number><span>%</span>
      </el-row>
      <el-row style="margin-top:5px;margin-left:14px;">
        公积金基数/比例/固定金额：
        <el-input-number :precision="2" v-model="formData.gjj_js" :controls =false :min="0" size="mini" style="width:100px;" :max="999999999" ></el-input-number>
        <el-input-number :precision="2" v-model="formData.gjj_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999" ></el-input-number><span>%</span>
        <el-input-number :precision="2" v-model="formData.gjj_mny" :controls =false :min="0" size="mini" style="width:100px;margin-left: 5px;" :max="999999999"></el-input-number>
        <el-input-number :precision="2" v-model="formData.qygjj_bl" :controls =false :min="0" size="mini" style="width:70px;margin-left: 5px;" :max="999"></el-input-number><span>%</span>
      </el-row>
      <el-row style="margin-top:5px;margin-left:60px;">
        工伤保险基数/比例：
        <el-input-number :precision="2" v-model="formData.gsbx_js" :controls =false :min="0" size="mini" style="width:100px;" :max="999999999" ></el-input-number>
        <el-input-number :precision="2" v-model="formData.qygsbx_bl" :controls =false :min="0" size="mini" style="margin-left:205px;width:70px;" :max="999"></el-input-number><span>%</span>
      </el-row>
      <el-row style="margin-top:5px;margin-left:60px;">
        生育保险基数/比例：
        <el-input-number :precision="2" v-model="formData.shybx_js" :controls =false :min="0" size="mini" style="width:100px;" :max="999999999" ></el-input-number>
        <el-input-number :precision="2" v-model="formData.qyshybx_bl" :controls =false :min="0" size="mini" style="margin-left:205px;width:70px;" :max="999"></el-input-number><span>%</span>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size ="small" @click="dialogSave">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'SalaryBaseDialog',
  mixins: [MessageUtil, Loading],
  props: ['visible', 'title', 'data'],
  data () {
    return {
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
    dialogTitle: {
      get () {
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    },
    formData: {
      get () {
        return this.data
      },
      set () {
        this.$emit('update:data', false)
      }
    }
  },
  methods: {
    dialogSave () {
      if (this.dialogTitle === '批量调整') {
        this.onBatchchgNum()
      } else if (this.dialogTitle === '统一基数设置') {
        this.onchgNum()
      } else {
        this.errorMsg('调整出错，不存在该调整类型')
      }
    },
    onBatchchgNum () {
      const optdate = this.formData.qj
      const rows = this.$parent.listSelectedRows
      if (rows === null || rows.length === 0) {
        this.errorMsg('请选择至少一行数据!')
      }
      const ids = rows.reduce((id, row) => id + ',' + row.cpersonid, '')
      if (!ids) {
        this.errorMsg('请选择至少一行数据!')
      }
      const tempData = {
        ids: ids,
        opdate: optdate,
        chgdata: JSON.stringify(this.formData)
      }
      this.showLoading('正在调整...')
      this.$api.SalaryManageApi.SocialInsur.changeNumBatch(tempData).then(result => {
        this.closeLoading()
        this.onDialogClose()
        if (result.success) {
          this.successMsg('批量调整成功!')
          this.$parent.fetchData()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    onchgNum () {
      const tempData = { chgdata: JSON.stringify(this.formData) }
      this.showLoading('正在调整...')
      this.$api.SalaryManageApi.SocialInsur.changeNumGroup(tempData).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg('统一基数设置成功!')
          this.onDialogClose()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>

</style>
