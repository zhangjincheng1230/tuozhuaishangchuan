<template>
  <el-dialog
    title="手工整理"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onOpenDialog"
    @close="onCloseDialog"
    width="700px">
    <div class="clearfix">
      <div style="float:left; width: 600px">
        <el-table
          :data="tableData"
          row-key="id"
          @row-click="onRowClick"
          :height="250"
          highlight-current-row
          @current-change="handleCurrentChange"
          border>
          <el-table-column
            property="pzh"
            label="原凭证号"
            width="75"
            header-align="center">
          </el-table-column>
          <el-table-column
            property="newpzh"
            label="新凭证号"
            width="75"
            header-align="center">
          </el-table-column>
          <el-table-column
            property="zdrq"
            label="日期"
            width="85"
            show-overflow-tooltip
            header-align="center">
          </el-table-column>
          <el-table-column
            property="newDate"
            label="新日期"
            width="160"
            header-align="center">
            <template #default="{row}">
              <el-date-picker
                v-model="row.newDate"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd" style="width: 130px;">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            property="jfhj"
            label="借方金额"
            show-overflow-tooltip
            width="95"
            align="right"
            header-align="center">
            <template #default="{row}">
              {{row.jfhj|forThousands}}
            </template>
          </el-table-column>
          <el-table-column
            property="dfhj"
            label="贷方金额"
            show-overflow-tooltip
            width="95"
            align="right"
            header-align="center">
            <template #default="{row}">
              {{row.dfhj|forThousands}}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="childTableData"
          row-key="id"
          :height="150"
          border>
          <el-table-column
            property="zy"
            label="摘要"
            width="160"
            show-overflow-tooltip
            header-align="center">
          </el-table-column>
          <el-table-column
            property="kmcode"
            label="科目编码"
            width="95"
            show-overflow-tooltip
            header-align="center">
          </el-table-column>
          <el-table-column
            property="kmname"
            label="科目"
            width="140"
            show-overflow-tooltip
            header-align="center">
          </el-table-column>
          <el-table-column
            property="jfmny"
            label="借方"
            width="90"
            show-overflow-tooltip
            align="right"
            header-align="center">
            <template #default="{row}">
              {{row.jfmny|forThousands}}
            </template>
          </el-table-column>
          <el-table-column
            property="dfmny"
            label="贷方"
            width="90"
            show-overflow-tooltip
            align="right"
            header-align="center">
            <template #default="{row}">
              {{row.dfmny|forThousands}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float: left; margin-left: 10px; margin-top: 10px;" class="operate_div">
        <a href="javascript:void(0)" class="operate_top" @click="moveTop" title="顶端"></a><br>
        <a href="javascript:void(0)" class="operate_top1" @click="moveUp" title="上移"></a><br>
        <a href="javascript:void(0)" @click="moveDown" class="operate_footer" title="下移"></a><br>
        <a href="javascript:void(0)" @click="moveBottom" class="operate_footer1" title="底端"></a>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="sortByUploadDate">上传时间排序</el-button>
        <el-button @click="saveSortData" type="primary">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {formatVoucherNumber, getMonthEnd} from '@/utils'

export default {
  name: 'VoucherManualSort',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    corpId: {
      type: String,
      default: null
    },
    period: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      tableData: [],
      childTableData: [],
      selectedRow: null,
      pickerOptions: {
        disabledDate: (date) => {
          let time = date.getTime()
          return time < this.minDateTime || time > this.maxDateTime
        }
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
    minDateTime () {
      let date
      if (this.period) {
        date = new Date(this.period + '-01')
        date.setHours(0, 0, 0, 0)
      } else {
        date = new Date()
      }
      return date.getTime()
    },
    maxDateTime () {
      let date
      if (this.period) {
        date = new Date(getMonthEnd(this.period))
        date.setHours(0, 0, 0, 0)
      } else {
        date = new Date()
      }
      return date.getTime()
    }
  },
  methods: {
    onOpenDialog () {
      this.$api.Voucher.queryHeadByPeriod({
        period: this.period
      }).then(res => {
        if (res.rows) {
          this.updateVoucherNumber(res.rows)
          this.tableData = res.rows
        }
      })
    },
    onCloseDialog () {
      this.tableData = []
      this.childTableData = []
      this.selectedRow = null
    },
    fetchChildrenData (voucher) {
      this.$api.Voucher.queryChildren({
        voucherId: voucher.id,
        corpId: voucher.corpId
      }).then(res => {
        if (res.rows) {
          this.childTableData = res.rows
        }
      })
    },
    onRowClick (row) {
      this.fetchChildrenData(row)
    },
    handleCurrentChange (row) {
      this.selectedRow = row
    },
    moveTop () {
      let index = this.getCurrentRowIndex()
      if (index > 0) {
        let row = this.tableData[index]
        this.tableData.splice(index, 1)
        this.tableData.splice(0, 0, row)
        this.updateVoucherNumber()
      }
    },
    moveUp () {
      let index = this.getCurrentRowIndex()
      if (index > 0) {
        let row = this.tableData[index]
        this.swapVoucherNumber(row, this.tableData[index - 1])
        this.tableData.splice(index, 1)
        this.tableData.splice(index - 1, 0, row)
      }
    },
    moveDown () {
      let index = this.getCurrentRowIndex()
      if (index < this.tableData.length - 1) {
        let row = this.tableData[index]
        let downIndex = index + 1
        let downRow = this.tableData[downIndex]
        this.swapVoucherNumber(row, this.tableData[index + 1])
        this.tableData.splice(downIndex, 1)
        this.tableData.splice(index, 0, downRow)
      }
    },
    moveBottom () {
      let index = this.getCurrentRowIndex()
      if (index < this.tableData.length - 1) {
        let row = this.tableData[index]
        this.tableData.splice(index, 1)
        this.tableData.push(row)
        this.updateVoucherNumber()
      }
      this.updateVoucherNumber()
    },
    swapVoucherNumber (v1, v2) {
      let num = v1.newpzh
      v1.newpzh = v2.newpzh
      v2.newpzh = num
    },
    getCurrentRowIndex () {
      if (this.selectedRow) {
        return this.tableData.findIndex(row => row.id === this.selectedRow.id)
      } else {
        return -1
      }
    },
    updateVoucherNumber (rows) {
      if (rows) {
        rows.forEach(row => {
          row.newDate = row.zdrq
        })
      } else {
        rows = this.tableData
      }
      rows.forEach((data, index) => {
        data.newpzh = formatVoucherNumber(index + 1)
      })
    },
    sortByUploadDate () {
      this.tableData = this.tableData.sort((r1, r2) => {
        return r1.zdrq.localeCompare(r2.zdrq)
      })
      this.updateVoucherNumber()
    },
    saveSortData () {
      this.$api.Voucher.manualSort({
        data: JSON.stringify(this.tableData),
        corpId: this.corpId
      }).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          this.$emit('sort')
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .operate_div a {
    width: 39px;
    display: block;
    height: 38px;
    background: url(~@/assets/voucher/op_ico.png) no-repeat;
  }

  .operate_div a.operate_top {
    background-position: -57px -3px
  }

  .operate_div a.operate_top:hover {
    background-position: -9px -3px
  }

  .operate_div a.operate_top1 {
    background-position: -57px -57px
  }

  .operate_div a.operate_top1:hover {
    background-position: -9px -57px
  }

  .operate_div a.operate_footer {
    background-position: -57px -110px
  }

  .operate_div a.operate_footer:hover {
    background-position: -9px -110px
  }

  .operate_div a.operate_footer1 {
    background-position: -57px -164px
  }

  .operate_div a.operate_footer1:hover {
    background-position: -9px -164px
  }
</style>
