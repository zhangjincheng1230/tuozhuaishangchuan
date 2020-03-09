<template>
  <el-dialog
    title="现金流量"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onOpenDialog"
    width="550px">
    <div>
      <span class="voucher-info">凭证号 {{ voucherData ? voucherData.pzh : '' }}</span>
      <span class="voucher-info">方向 {{ voucherMntDirection }} </span>
      <span class="voucher-info">金额 {{ voucherCashMnyDisplay | forThousands }}</span>
    </div>
    <div>
      <el-table
        ref="table"
        :data="tableData"
        row-key="key"
        highlight-current-row
        border
        height="175"
        class="edit-table">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50">
          <template #default="{ row, $index }">
            <div class="row-operate">
              <i class="el-icon-circle-plus-outline" title="增行"  @click="addRow($index)"></i>
              <i class="el-icon-remove-outline" title="删行" @click="delRow($index)"></i>
            </div>
            {{ ($index + 1) }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          label="现金流量项目">
          <template #default="{ row, $index }">
            <el-select
              v-model="row.xjll_id"
              @change="onSelectCashFlow($event, $index)"
              filterable
              clearable
              style="width: 100%">
              <el-option
                v-for="item in cashFlowItemData"
                :key="item.id"
                :label="item.xjlxmmc"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="vdirect"
          :formatter="formatDirection"
          align="center"
          width="70"
          label="方向">
        </el-table-column>
        <el-table-column
          header-align="center"
          width="110"
          label="金额">
          <template #default="{ row }">
            <el-input-number
              v-model="row.nmny"
              @change="onMnyChange"
              :controls="false"
              :precision="2"
              style="width: 100%">
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="clearfix">
      <div style="float: right">
        <span>合计: </span>
        <span style="margin: 0 10px;">{{ sumMny | forThousands(2, true) }}</span>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="deleteVoucherCashFlow">删除</el-button>
        <el-button @click="saveVoucherCashFlow" type="primary">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Big from 'big.js'

const uuidv4 = require('uuid/v4')

export default {
  name: 'VoucherCashFlowDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    voucherData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      tableData: [{}, {}, {}, {}],
      selectedIndex: -1,
      sumMny: 0
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
    cashFlowItemData () {
      let archives = this.$store.getters.cashFlowArchive
      if (archives === null) {
        archives = []
      }
      return archives
    },
    voucherCashMny () {
      let mny = new Big(0)
      if (this.voucherData && this.voucherData.id && this.voucherData.children) {
        this.voucherData.children.forEach(child => {
          let subjectCode = child.kmcode
          let subject = this.subjectMap.get(child.kmid)
          if (this.cashSubject.has(subjectCode.substring(0, 4)) &&
            subject && (!subject.unxjkm || subject.unxjkm === '否')) {
            let childMny = Number(child.jfmny)
            if (childMny === 0) {
              childMny = Number(child.dfmny)
              mny = mny.sub(childMny)
            } else {
              mny = mny.add(childMny)
            }
          }
        })
      }
      return Number(mny.toFixed(2))
    },
    voucherCashMnyDisplay () {
      return Math.abs(this.voucherCashMny)
    },
    voucherMntDirection () {
      return this.voucherCashMny < 0 ? '贷方' : '借方'
    },
    subjectMap () {
      return this.$store.getters.subjectMap
    },
    cashSubject () {
      return this.$store.getters.cashSubjectSet
    }
  },
  created () {
    this.$store.dispatch('fetchCashFlowArchive')
  },
  methods: {
    onOpenDialog () {
      this.$api.Voucher.getVoucherCashFlow({
        id: this.voucherData.id
      }).then(res => {
        this.loadTableData(res.rows)
      })
    },
    loadTableData (rows) {
      let tableData = []
      if (rows) {
        rows.forEach(row => {
          let cashFlow = this.cashFlowItemData.find(item => item.id === row.xjll_id)
          tableData.push({
            xjll_id: row.xjll_id,
            key: uuidv4(),
            vdirect: cashFlow.fx,
            nmny: row.nmny
          })
        })
      } else {
        tableData.push({
          key: uuidv4(),
          nmny: this.voucherCashMnyDisplay,
          vdirect: this.voucherCashMny < 0 ? 1 : 0
        })
      }
      for (let i = tableData.length; i < 4; i++) {
        tableData.push({
          key: uuidv4()
        })
      }
      this.tableData = tableData
      this.calculateSum()
    },
    onSelectCashFlow (id, index) {
      let cashFlow = this.cashFlowItemData.find(item => item.id === id)
      this.tableData[index].vdirect = cashFlow.fx
      this.calculateSum()
    },
    onMnyChange () {
      this.calculateSum()
    },
    addRow (index) {
      this.tableData.splice(index + 1, 0, {
        key: uuidv4()
      })
    },
    delRow (index) {
      if (this.tableData.length === 1) {
        return
      }
      this.tableData.splice(index, 1)
    },
    calculateSum () {
      let sum = new Big(0)
      this.tableData.forEach(row => {
        if (row.nmny) {
          if (row.vdirect === 1) {
            sum = sum.sub(row.nmny)
          } else {
            sum = sum.add(row.nmny)
          }
        }
      })
      if (this.voucherCashMny < 0) {
        sum = sum.mul(-1)
      }
      this.sumMny = Number(sum.toFixed(2))
    },
    formatDirection (row, column, cellValue) {
      let formatted = ''
      if (cellValue === 0) {
        formatted = '流入'
      } else if (cellValue === 1) {
        formatted = '流出'
      }
      return formatted
    },
    saveVoucherCashFlow () {
      let postData = []
      for (let i = 0; i < this.tableData.length; i++) {
        let row = this.tableData[i]
        if (!row.nmny && !row.xjll_id) {
          continue
        }
        if (row.nmny && !row.xjll_id) {
          this.$message.warning('请选择现金流量项目')
          return
        }
        if (!row.nmny && row.xjll_id) {
          this.$message.warning('请录入金额')
          return
        }
        row.pz_id = this.voucherData.id
        postData.push(row)
      }
      if (postData.length === 0) {
        this.$message.warning('请现金流量项目')
        return
      }
      this.$api.Voucher.saveVoucherCashFlow(postData).then(res => {
        if (res.success) {
          this.$message.success('保存成功')
          this.$emit('save')
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteVoucherCashFlow () {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.Voucher.deleteVoucherCashFlow({
          id: this.voucherData.id
        }).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.dialogVisible = false
            this.$emit('delete')
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .voucher-info {
    display: inline-block;
    line-height: 30px;
  }

  .voucher-info + .voucher-info {
    margin-left: 20px;
  }

  >>> .el-input-number .el-input__inner {
    text-align: right;
  }
</style>
