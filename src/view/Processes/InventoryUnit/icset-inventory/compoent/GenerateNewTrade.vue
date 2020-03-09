<template>
  <div>
    <el-dialog title="生成结算价"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @open="onDialogOpen"
               @close="onDialogClose"
               @closed="onDialogClosed"
               width="425px">
      <el-form ref="formRef" :model="formData" label-width="160px" @submit.native.prevent>
        <div style="font-size: 14px;font-weight: bold;margin-top:2px;">按如下规则生成结算价：</div>
        <el-row style="margin-top:10px;">
          <el-radio v-model="formData.priceway" :label="1">结存单价</el-radio>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-radio v-model="formData.priceway" :label="2">销售平均单价 X
            <el-input-number v-model="formData.bili" :precision="4" :controls="false" :max=1.0000 :min=0.0001 ></el-input-number>
          </el-radio>
          <el-tooltip style="margin-left:-30px;" effect="light" content="请输入0-1的数据" placement="right">
            <el-image :src="srcList[0]"></el-image>
          </el-tooltip>
        </el-row>
        <el-row style="margin-top:10px;">说明：点击【确定】后按所选算法生成结算价并覆盖历史数据</el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="svaetab">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['visible'],
  data () {
    return {
      formData: {priceway: 1, bili: 0.0001},
      srcList: [
        require('@/assets/img/helptool.png')
      ]
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
    }
  },
  methods: {
    svaetab () {
      this.dialogVisible = false
      const rows = this.$parent.listSelectedRows
      let temp = {
        body: JSON.stringify(rows),
        vdate: this.$store.getters.getLoginDate,
        pk_corp: this.$parent.pk_corp
      }
      temp = Object.assign(temp, this.formData)
      this.$api.InventoryManageApi.IcsetInventory.fTradePrice(temp).then(res => {
        if (res.success) {
          this.$parent.fetchData()
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
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
<style scoped>
  >>>.el-input-number .el-input__inner {
    text-align: right;
  }
</style>
