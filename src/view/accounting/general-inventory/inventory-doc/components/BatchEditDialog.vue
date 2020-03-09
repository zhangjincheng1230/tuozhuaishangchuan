<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="450px">
    <el-form ref="formRef" :model="formData"  :rules="rules" label-width="160px">
      <el-tooltip v-if="showDetail" style="margin-right:52px;margin-top:7px;float:right;z-index: 9999;" effect="light" content="只更新[存货类别]为空的数据" placement="bottom">
        <el-image :src=srcList[0]></el-image>
      </el-tooltip>
      <el-form-item label="存货类别" prop="kmclassify" v-if="showDetail">
        <el-select   v-model="formData.kmclassify"
                     default-first-option placeholder="请选择" filterable style= "width:174px">
          <el-option v-for="item in kmclassdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
            <span style="float: left">{{ item.codefullname }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出库科目" prop="chukukmid" v-if="showDetail">
        <el-select   v-model="formData.chukukmid"
                     default-first-option placeholder="请选择" filterable style= "width:174px">
          <el-option v-for="item in chukukmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
            <span style="float: left">{{ item.codefullname }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格(型号)" prop="spec">
        <el-input v-model.trim="formData.spec" autocomplete="off" style="width:174px"></el-input>
      </el-form-item>
      <el-form-item label="计量单位" prop="unit">
        <el-input v-model.trim="formData.unit" autocomplete="off" style="width:174px"></el-input>
      </el-form-item>
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
  name: 'BatchEditDialog',
  mixins: [MessageUtil, Loading],
  props: ['visible', 'title', 'isDetailjz'],
  data () {
    return {
      formData: { kmclassify: '', chukukmid: '', spec: '', unit: '' },
      kmclassdata: [],
      chukukmdata: [],
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      rules: {
        unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }]
      }
    }
  },
  mounted: function mounted () {
    this.kmclassifydata()
    this.chukukmiddata()
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
    showDetail: {
      get () {
        return this.isDetailjz
        // return true
      },
      set () {
        this.$emit('update:isDetailjz', false)
      }
    },
    kmdata () {
      const kmRefData = this.$store.state.accounting.subjectRefData
      for (const data of kmRefData) {
        if (data) {
          if (data.yz !== '是') {
            data.disabled = true
          } else {
            data.disabled = false
          }
        }
      }
      return kmRefData
    }
  },
  methods: {
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
        this.warnMsg('请选择至少一行数据!')
      }
      const ids = rows.reduce((id, row) => id + ',' + row.id, '')
      if (!ids) {
        this.warnMsg('请选择至少一行数据!')
      }
      const codes = rows.reduce((code, row) => code + ',' + row.code, '')
      const names = rows.reduce((name, row) => name + ',' + row.name, '')

      this.showLoading('批改保存...')
      const temp = {
        ids: ids,
        codes: codes,
        names: names,
        kmclassifybatch: this.formData.kmclassify,
        chukukmidbatch: this.formData.chukukmid,
        unitbatch: this.formData.unit,
        specbatch: this.formData.spec,
        pk_corp: this.$parent.pk_corp
      }
      this.$api.GeneralInventoryApi.InventoryDoc.batchSaveB(temp).then(result => {
        this.closeLoading()
        this.onDialogClose()
        if (result.success) {
          this.successMsg('批量修改成功!')
          this.$parent.fetchData()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    kmclassifydata () {
      this.$api.GeneralInventoryApi.InventoryDoc.getKmclassify().then(result => {
        if (result.success) {
          this.kmclassdata = this.kmdata.filter(item => result.rows.includes(item.kmbm))
        }
      }).catch(e => {
      })
      return null
    },
    chukukmiddata () {
      this.$api.GeneralInventoryApi.InventoryDoc.getChukuKm().then(result => {
        if (result.success) {
          this.chukukmdata = this.kmdata.filter(item => result.rows.includes(item.kmbm))
        }
      }).catch(e => {
      })
      return null
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
