<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="450px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="160px">
      <el-form-item label="存货分类" prop="splxidbatch">
        <el-select  v-model="formData.splxidbatch"  default-first-option  placeholder="请选择" filterable  style="width:174px"  >
          <el-option  v-for="item in chflData"  :key="item.invcls_id" :label="item.cd ? item.cd + ' / ' + item.nm : item.nm" :value="item.invcls_id"  :disabled="item.disabled"  style="width:174px">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格(型号)" prop="specbatch">
        <el-input v-model.trim="formData.specbatch" autocomplete="off" style="width:174px"></el-input>
      </el-form-item>
      <el-form-item label="计量单位" prop="jldwidbatch">
        <el-select  v-model="formData.jldwidbatch" default-first-option  placeholder="请选择" filterable style="width:174px">
          <el-option  v-for="item in jldwData"  :key="item.id" :label="item.jldwbm ? item.jldwbm + ' / ' + item.jldwmc : item.jldwmc" :value="item.id" :disabled="item.disabled"  style="width:174px">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogSave">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import * as MsgUtil from '../../../msg-util'
export default {
  name: 'BatchEditDialog',
  props: ['visible', 'title'],
  data () {
    return {
      formData: {splxidbatch: '', specbatch: '', jldwidbatch: ''},
      rules: {
        specbatch: [{ min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }]
      },
      chflData: [],
      jldwData: []
    }
  },
  mounted: function mounted () {
    this.fetchChfl()
    this.fetchJldw()
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
    }
  },
  methods: {
    fetchChfl () {
      this.$api.InventoryManageApi.IcsetClassfy.query({}).then(res => {
        if (res.rows) {
          this.chflData = res.rows
        }
      })
    },
    fetchJldw () {
      this.$api.InventoryManageApi.IcsetMesunit.queryInfo({}).then(res => {
        if (res.rows) {
          this.jldwData = res.rows
        }
      })
    },
    dialogSave () {
      let pass = false
      this.$refs.formRef.validate(function (valid) {
        pass = valid
      })
      if (!pass) {
        return
      }
      const rows = this.$parent.listSelectedRows
      if (rows === null || rows.length === 0) {
        MsgUtil.warnMsg(this, '请选择至少一行数据!')
      }
      const ids = rows.reduce((id, row) => id + ',' + row.id, '')
      if (!ids) {
        MsgUtil.warnMsg(this, '请选择至少一行数据!')
      }
      const codes = rows.reduce((spbm, row) => spbm + ',' + row.spbm, '')
      const names = rows.reduce((spmc, row) => spmc + ',' + row.spmc, '')

      if (this.formData.splxidbatch || this.formData.specbatch || this.formData.jldwidbatch) {

      } else {
        MsgUtil.errorMsg(this, '请填写要修改的数据!')
        return
      }

      const loading = MsgUtil.loading(this, '批改保存...')
      let temp = {
        ids: ids,
        codes: codes,
        names: names,
        pk_corp: this.$parent.pk_corp
      }
      temp = Object.assign(temp, this.formData)
      this.$api.InventoryManageApi.IcsetInventory.batchSave(temp).then(result => {
        loading.close()
        this.onDialogClose()
        if (result.success) {
          MsgUtil.successMsg(this, '批量修改成功!')
          this.$parent.fetchData()
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        loading.close()
      })
    },
    onDialogOpen () {
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
