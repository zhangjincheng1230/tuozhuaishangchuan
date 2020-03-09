<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="500px"
    height="500px"
  >
    <div slot="title" class="header-title">
      <span class="el-dialog__title" style="margin-top:-5px">{{ dialogTitle }}</span>
      <el-tooltip style="z-index: 9999;margin-top:10px" effect="light" popper-class="titleclass" content placement="right">
        <div
          slot="content"
          class="content"
          style="width:355px"
        >操作说明：选择多个存货合并，系统自动根据编码大小默认一个合并后的存货(可修改)，其他被合并存货会批量替换成合并后的存货(例：选择存货001_富士苹果，004_红富士苹果进行合并，合并后的存货为001_富士苹果，004_红富士苹果替换为001_富士苹果)</div>
        <i class="el-icon-warning-outline"></i>
      </el-tooltip>
    </div>
    <el-main>
      <el-row style="margin-top:-20px;">
        <span>合并后存货：</span>
        <el-select v-model="formData.id"  default-first-option  placeholder="请选择" filterable @change="bmHandleChange" style="width:325px">
          <el-option v-for="item in rowfmData" :key="item.id" :label="item.fullname" :value="item.id" :disabled="item.disabled" style="width:325px">
            <span style="float: left">{{ item.fullname }}</span>
          </el-option>
        </el-select>
      </el-row>
      <span>被合并存货：</span>
      <el-table :data="sortedData" stripe border max-height="200" style="margin-top:5px;width:415px">
        <el-table-column label="序号" type="index" align="center"  width="50"></el-table-column>
        <el-table-column  key="spmc"  prop="spmc" label="名称"  header-align="center"  align="left"  width="150" show-overflow-tooltip></el-table-column>
        <el-table-column  key="gg" prop="gg"  label="规格(型号)"  header-align="center" align="left"  width="120"  show-overflow-tooltip ></el-table-column>
        <el-table-column  key="jldw"  prop="jldw"  label="单位"  header-align="center"  align="left" width="80" ></el-table-column>
      </el-table>
      <div id="msg" style="width:95%;font-size:14px;margin-top:5px;">
        <p>
          <b>
            <br />数据处理：
            <br />
          </b>
          1、存货期初：被合并存货替换为合并后存货名称
        </p>
        <p>2、科目期初：引用被合并存货替换为合并后存货名称</p>
        <p>3、年结表：引用被合并存货替换为合并后存货名称</p>
        <p>4、凭证：引用被合并存货替换为合并后存货名称</p>
      </div>
    </el-main>
    <template #footer>
      <div class="dialog-footer">
        <span style="color: red;float: left; font-size: 13px;margin-top: 10px;;margin-left: 10px;">提示:存货合并后无法撤销合并,请谨慎操作!</span>
        <el-button size="small" @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size="small" @click="merge">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import * as MsgUtil from '../../../msg-util'
import { orderBy } from 'natural-orderby'
import * as IcbillManageConst from '../../icbill-manage-const'
export default {
  name: 'MergeDataDialog',
  props: ['visible', 'title', 'isDetailjz'],
  data () {
    return {
      formData: {
      },
      rows: [],
      rules: {
        jldw: [{ required: true, message: '请输入计量单位', trigger: 'blur' }]
      }
    }
  },
  mounted: function mounted () {
  },
  computed: {
    sortedData () {
      return orderBy(this.rows, v => v.spbm)
    },
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
    rowfmData () {
      const rows = this.parentData
      if (rows) {
        return IcbillManageConst.invDataFullName(rows, true)
      } else {
        return rows
      }
    },
    parentData () {
      return orderBy(this.$parent.listSelectedRows, v => v.index)
    }
  },
  methods: {
    merge () {
      const rows1 = this.parentData
      if (!rows1 || rows1.length === 0 || rows1.length === 1) {
        MsgUtil.warnMsg(this, '请选择要合并的数据！')
        return
      }
      const loading = MsgUtil.loading(this, '正在合并...')
      this.$confirm('确定要合并勾选的' + (rows1.length) + '条存货吗，合并后生成的存货无法撤销合并，请慎重操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const rowdata = this.parentData.find(item => item.id === this.formData.id)
        const codename = rowdata.spbm + rowdata.spmc
        this.$api.InventoryManageApi.IcsetInventory.mergeData({
          body: JSON.stringify(this.rows),
          spid: this.formData.id,
          codename: codename,
          pk_corp: this.$store.getters.currentCorp.pk_gs
        }).then(result => {
          loading.close()
          if (result.success) {
            if (result.msg.indexOf('失败') > -1) {
              MsgUtil.errorMsg(this, result.msg)
            } else {
              MsgUtil.successMsg(this, '合并成功!')
            }
            this.$parent.fetchData()
            this.dialogVisible = false
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
        }).catch(e => {
          loading.close()
        })
      }).catch(e => {
        loading.close()
      })
    },
    filterdata (id) {
      return this.parentData.filter(item => item.id !== id)
    },
    bmHandleChange (newValue) {
      this.formData.id = newValue
      this.rows = this.filterdata(this.formData.id)
    },
    onDialogOpen () {
      this.formData.id = this.parentData[0].id
      this.rows = this.filterdata(this.formData.id)
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
    },
    closeDialog () {
      this.dialogVisible = false
    }
  },
  created () {
  }
}
</script>
<style scoped>
  .titleclass {
    margin-top:15px
  }
</style>
