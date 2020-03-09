<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    @open="onDialogOpen"
    @close="onDialogClose"
    @closed="onDialogClosed"
    width="1050px">
    <div slot="title" class="header-title">
      <span class="title-name" style="margin-top:-5px" >{{ dialogTitle }}</span>
      <el-tooltip style="z-index: 9999;" effect="light" content="" placement="right" >
        <div slot="content" class="content"  style="width:345px">
          暂估单价仅供参考,用户可根据实际情况单击"暂估单价"列进行修改.
        </div>
        <i class="el-icon-warning-outline"></i>
      </el-tooltip>
    </div>
    <el-form
      :inline="true"
      :model="formData"
      :rules="rules"
      ref="formRef"
      size="mini"
      label-width="80px">
      <el-row style="margin-top:-15px">
        <el-col :span="12">
          <el-form-item label="公司" prop="zgcorpname">
            <el-input v-model.trim="formData.zgcorpname" autocomplete="off" style="width:274px" :disabled="true" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="期间" prop="zgqijianname">
            <el-input v-model.trim="formData.zgqijianname" autocomplete="off"  style="width:174px" :disabled="true" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
        :data="formData.rows"
        :height=height
        class="edit-table"
        highlight-current-row
        @current-change="handleListRowSelect"
        @selection-change="handleListRowSelection"
        :row-class-name="tableRowClassName"
        @row-click="dblclickRow"
        stripe
        border
        style="width: 100%;"
        ref="formRef">
        <el-table-column  label="序号" type="index" align="center"  width="50"></el-table-column>
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column v-if="this.$parent.classifFlag" label="存货类别"  prop="spfl" header-align ="center" align ="center" width="100" ></el-table-column>
        <el-table-column label="存货编码"  prop="spbm" header-align ="center" align ="left" width="100"></el-table-column>
        <el-table-column label="存货名称"  prop="invname" header-align ="center" show-overflow-tooltip align ="left" width="120"></el-table-column>
        <el-table-column label="规格(型号)"  prop="spgg" header-align ="center" show-overflow-tooltip  align ="left" width="120"></el-table-column>
        <el-table-column label="计量单位"  prop="jldw" header-align ="center" align ="left" width="70"></el-table-column>
        <el-table-column label="结存数量"  prop="oldnum" header-align ="center" align ="right" width="120" :formatter="numformatter"></el-table-column>
        <el-table-column label="暂估数量"  prop="newnum"  header-align ="center" align ="right" width="120">
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.newnum'" :rules="rules.newnum">
              <el-input-number @change="numChange($index,row)" v-model="row.newnum" :precision=numPre :controls =false :min="0" :max="999999999" style="width:120px"></el-input-number>
            </TableFormItem>
          </template>
        </el-table-column>
        <el-table-column label="暂估单价"  prop="price"  header-align ="center" align ="right" width="150" :formatter="nmnyformatter">
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.price'" :rules="rules.price">
              <el-input-number @change="numChange($index,row)" v-model="row.price" :precision=pricePre :controls =false :min="0" :max="999999999" style="width:150px"></el-input-number>
            </TableFormItem>
          </template>
        </el-table-column>
        <el-table-column label="暂估金额"  prop="mny"  header-align ="center" align ="right" width="150" :formatter="nmnyformatter">
          <template #default="{ row, $index }">
            <TableFormItem :prop="'rows.' + $index+'.mny'" :rules="rules.mny">
              <el-input-number @change="mnyChange($index,row)" v-model="row.mny" :precision="2" :controls =false :min="0" :max="999999999" style="width:150px"></el-input-number>
            </TableFormItem>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size ="small"  @click="onDialogClose">取 消</el-button>
        <el-button type="primary" size ="small" @click="zgsave">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import TableFormItem from '@/components/TableFormItem/index'
import { calculate } from '@/utils'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'ZgDialog',
  mixins: [MessageUtil, Loading],
  components: {
    TableFormItem
  },
  props: ['visible', 'title', 'data'],
  data () {
    return {
      height: 0,
      rules: {
        newnum: [
          { required: true, message: '暂估数量不能为空' }
        ],
        price: [
          { required: true, message: '暂估单价不能为空' }
        ],
        mny: [
          { required: true, message: '暂估金额不能为空' }
        ]
      },
      listCurrentRow: null,
      listSelectedRows: null,
      indexRow: -1,
      pricePre: this.$store.getters.pricePre,
      numPre: this.$store.getters.numPre
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
      }
    }
  },
  created () {
    this.height = window.innerHeight - 390
  },
  mounted () {
  },
  methods: {
    handleListRowSelect (val) {
      this.listCurrentRow = val
    },
    handleListRowSelection (val) {
      this.listSelectedRows = val
    },
    tableRowClassName (row, index) {
      row.row.index = row.rowIndex
    },
    dblclickRow (row) {
      this.$refs.formRef.toggleRowSelection(row)
    },
    zgsave () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return
        }
        let rows = []
        if (this.listSelectedRows && this.listSelectedRows.length > 0) {
          rows = this.listSelectedRows
        } else {
          this.warnMsg('请选择要暂估的数据！')
          return
        }
        const temp = {zg: JSON.stringify(rows)}
        this.showLoading('正在暂估保存...')
        this.$api.GeneralInventoryApi.InventoryCost.zgsave(temp).then(result => {
          this.closeLoading()
          if (result.success) {
            this.onDialogClose()
            this.successMsg('暂估成功!')
            this.$parent.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      })
    },
    onDialogOpen () {
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.closeDialog()
    },
    closeDialog () {
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    },
    nmnyformatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 2, true)
    },
    numformatter  (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, this.numPre, true)
    },
    numChange (index, row) {
      this.formData.rows[index].mny = calculate('mul', this.formData.rows[index].price, this.formData.rows[index].newnum, 2)
    },
    mnyChange (index, row) {
      this.formData.rows[index].price = calculate('div', this.formData.rows[index].mny, this.formData.rows[index].newnum, this.pricePre)
    }
  }
}
</script>
