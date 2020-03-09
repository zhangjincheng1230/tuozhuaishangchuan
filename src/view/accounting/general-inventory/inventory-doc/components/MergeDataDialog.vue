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
    height="500px">
    <div slot="title" class="header-title">
      <span class="el-dialog__title" style="margin-top:-5px" >{{ dialogTitle }}</span>
      <el-tooltip style="z-index: 9999;margin-top:10px" effect="light" content="" placement="right" >
        <div slot="content" class="content"  style="width:355px">
          操作说明：选择多个存货合并，系统自动根据编码大小默认一个合并后的存货(可修改)，其他被合并存货会批量替换成合并后的存货(例：选择存货001_富士苹果，004_红富士苹果进行合并，合并后的存货为001_富士苹果，004_红富士苹果替换为001_富士苹果)</div>
        <i class="el-icon-warning-outline"></i>
      </el-tooltip>
    </div>
    <el-main>
      <el-row style="margin-top:-20px;">
        <span>合并后存货：</span>
        <el-select   v-model="formData.spid"
                     default-first-option placeholder="请选择"  filterable  @change="bmHandleChange"  style="width:325px">
          <el-option v-for="item in rowfmData" :key="item.id" :label="item.fullname" :value="item.id" :disabled="item.disabled" style="width:325px">
            <span style="float: left">{{ item.fullname }}</span>
          </el-option>
        </el-select>
      </el-row>
      <span>被合并存货：</span>
      <el-table :data="sortedData" stripe border max-height="200"  style = "margin-top:5px;width:415px">
        <el-table-column label="序号" type="index" align="center"  width="50"></el-table-column>
        <el-table-column key="name" prop="name" label="名称" header-align ="center" align ="left" width="150" show-overflow-tooltip> </el-table-column>
        <el-table-column key="spec" prop="spec" label="规格(型号)" header-align ="center" align ="left" width="120" show-overflow-tooltip> </el-table-column>
        <el-table-column key="unit" prop="unit" label="单位" header-align ="center" align ="left" width="80"></el-table-column>
      </el-table>
      <div id="msg" style="width:95%;font-size:14px;margin-top:5px;" >
        <p>
          <b><br>数据处理：<br></b>
          1、存货期初：被合并存货替换为合并后存货名称
        </p>
        <p>
          2、科目期初：引用被合并存货替换为合并后存货名称
        </p>
        <p>
          3、年结表：引用被合并存货替换为合并后存货名称
        </p>
        <p>
          4、凭证：引用被合并存货替换为合并后存货名称
        </p>
      </div>
    </el-main>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size ="small" @click="merge">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { orderBy } from 'natural-orderby'
import * as InventoryManageConst from '../../general-inventory-const'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'BatchEditDialog',
  mixins: [MessageUtil, Loading],
  props: ['visible', 'title', 'isDetailjz'],
  data () {
    return {
      formData: {},
      rows: [],
      rules: {
        unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }]
      }
    }
  },
  mounted: function mounted () {
  },
  computed: {
    sortedData () {
      return orderBy(this.rows, v => v.code)
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
      let rows = this.parentData
      if (rows) {
        return InventoryManageConst.invDataFullName(rows)
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
        this.warnMsg('请选择要合并的数据！')
        return
      }
      this.showLoading('正在合并...')
      this.$confirm('确定要合并勾选的' + (rows1.length) + '条存货吗，合并后生成的存货无法撤销合并，请慎重操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const temp = {
          body: JSON.stringify(this.rows),
          spid: this.formData.spid,
          pk_corp: this.$parent.pk_corp
        }
        this.$api.GeneralInventoryApi.InventoryDoc.mergeData(temp).then(result => {
          this.closeLoading()
          if (result.success) {
            if (result.msg.indexOf('失败') > -1) {
              this.errorMsg(result.msg)
            } else {
              this.successMsg('合并成功!')
            }
            this.$parent.fetchData()
            this.dialogVisible = false
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      }).catch(e => {
        this.closeLoading()
      })
    },
    filterdata (id) {
      return this.parentData.filter(item => item.id !== id)
    },
    bmHandleChange (newValue) {
      this.formData.spid = newValue
      this.rows = this.filterdata(this.formData.spid)
    },
    onDialogOpen () {
      this.formData.spid = this.parentData[0].id
      this.rows = this.filterdata(this.formData.spid)
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
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
