<template>
  <el-dialog
    title="税表表项"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal="false"
    @open="onDialogOpen"
    class="kj-nested-dialog"
    width="96%">
    <div style="height: 40px; line-height: 40px;">
      <div style="float: left">
        <span>凭证号：{{pzh}}</span>
        <span>日期：{{date}}</span>
        <span>类型：{{formatFpStyle(fp_style)}}</span>
      </div>
      <div style="float: right;margin-right: 30px;">
        <el-button type="primary" class="ui-btn" size="small" @click="saveTaxItems">保存</el-button>
        <el-button type="primary" class="ui-btn" v-if="savedVoucherTaxItem.length > 0"
                   size="small" @click="deleteConfirm">删除
        </el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        :span-method="entrySpanMethod"
        style="width: 100%"
        :max-height="maxHeight">
        <el-table-column
          prop="zy"
          label="摘要"
          width="150"
          header-align="center">
          <template #default="{row}">
            <div :title="row.zy">{{ row.zy }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="km"
          label="科目"
          header-align="center"
          width="180">
          <template #default="{row}">
            <div :title="row.km">{{ row.km }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="direction"
          label="方向"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="pzmny"
          label="金额"
          header-align="center"
          align="right"
          width="120"
          :formatter="formatMny">
        </el-table-column>
        <el-table-column
          prop="taxname"
          header-align="center"
          min-width="180"
          label="税表表项">
          <template v-if="scope.row.isAnalyse" slot-scope="scope">
            <div class="row-operate">
              <i class="el-icon-circle-plus-outline" title="增行" @click="addRow(scope.$index)"></i>
              <i class="el-icon-remove-outline" title="删行" @click="delRow(scope.$index)"></i>
            </div>
            <el-select v-model="scope.row.pk_taxitem"
                       placeholder="请选择"
                       style="width: 100%;"
                       @change="onTaxSelect($event, scope.$index)">
              <el-option
                v-for="item in getTaxItems(scope.row)"
                :key="item.itemid"
                :label="item.name"
                :value="item.itemid">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="mny"
          header-align="center"
          align="right"
          width="150"
          label="金额">
          <template #default="{row, $index}">
            <el-input
              v-if="row.isAnalyse" v-model="row.mny"
              @change="onInputMny($event, $index)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="taxratio"
          header-align="center"
          align="center"
          :formatter="formatTaxRate"
          width="50"
          label="税率">
        </el-table-column>
        <el-table-column
          prop="taxmny"
          header-align="center"
          align="right"
          width="110"
          label="税额">
          <template #default="{row, $index}">
            <el-input
              v-if="row.isAnalyse" v-model="row.taxmny"
              @change="onInputTaxMny($event, $index)"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'VoucherTaxItemDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    voucherData: {
      type: Object,
      default: null
    },
    taxItems: {
      type: Array,
      default () {
        return []
      }
    },
    subjectRules: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      pk_voucher: '',
      pzh: '',
      date: '',
      fp_style: '',
      tableData: [],
      savedVoucherTaxItem: []
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
    maxHeight () {
      return this.$store.getters.maxDialogBodyHeight
    },
    corpTaxType () {
      return this.$store.getters.getLoginCorp.chname
    }
  },
  methods: {
    onDialogOpen: function () {
      this.pk_voucher = this.voucherData.id
      this.pzh = this.voucherData.pzh
      this.date = this.voucherData.zdrq
      this.fp_style = this.voucherData.fp_style ? this.voucherData.fp_style : this.corpTaxType === '一般纳税人' ? 2 : 1
      let tableData = []
      for (let i = 0; i < this.voucherData.children.length; i++) {
        let voucherEntry = this.voucherData.children[i]
        let taxEntry = {
          pk_tzpz_h: voucherEntry.pid,
          pk_tzpz_b: voucherEntry.bid,
          zy: voucherEntry.zy,
          subjCode: voucherEntry.kmcode,
          km: voucherEntry.subjectDisplay,
          period: this.voucherData.qj
        }
        if (voucherEntry.kmcode.match(this.subjectRules.cargo) ||
          voucherEntry.kmcode.match(this.subjectRules.service)) {
          taxEntry.isAnalyse = true
          taxEntry.isOuttax = true
          taxEntry.vdirect = 1
        } else {
          taxEntry.isAnalyse = false
        }
        if (this.corpTaxType === '一般纳税人') {
          if ((this.voucherData.zdrq >= '2019-04-01' && this.subjectRules.traffic && voucherEntry.kmcode.match(this.subjectRules.traffic)) ||
            (this.fp_style === 1 && voucherEntry.kmcode.match(this.subjectRules.purchase))) {
            taxEntry.isAnalyse = true
            taxEntry.vdirect = 0
            taxEntry.isIntax = true
          }
        }
        taxEntry.fp_style = this.fp_style

        if (voucherEntry.jfmny) {
          taxEntry.direction = '借'
          taxEntry.pzmny = voucherEntry.jfmny
        } else {
          taxEntry.direction = '贷'
          taxEntry.pzmny = voucherEntry.dfmny
        }
        if (taxEntry.isOuttax) {
          if (taxEntry.direction === '借') {
            taxEntry.mny = taxEntry.pzmny * -1
          } else {
            taxEntry.mny = taxEntry.pzmny
          }
          taxEntry.mny = Number(taxEntry.mny).toFixed(2)
        }
        if (taxEntry.isIntax) {
          if (taxEntry.direction === '贷') {
            taxEntry.mny = taxEntry.pzmny * -1
          } else {
            taxEntry.mny = taxEntry.pzmny
          }
          taxEntry.mny = Number(taxEntry.mny).toFixed(2)
        }
        taxEntry.pk_taxitem = null
        taxEntry.taxratio = null
        taxEntry.taxmny = null
        tableData.push(taxEntry)
      }
      this.tableData = tableData
      this.loadSavedData()
    },
    loadSavedData: function () {
      this.$api.Voucher.getVoucherTaxItem({
        voucherId: this.voucherData.id
      }).then(rs => {
        if (rs.success && rs.rows.length > 0) {
          let rows = rs.rows
          this.savedVoucherTaxItem = rows
          let newTableData = []
          for (let i = 0; i < this.tableData.length; i++) {
            let entry = this.tableData[i]
            if (entry.isAnalyse) {
              let hasSavedItem = false
              for (let j = 0; j < rows.length; j++) {
                if (rows[j].pk_tzpz_b === entry.pk_tzpz_b) {
                  hasSavedItem = true
                  let newData = this.cloneRow(entry)
                  this.syncRemoteData(newData, rows[j])
                  newTableData.push(newData)
                }
              }
              if (!hasSavedItem) {
                newTableData.push(entry)
              }
            } else {
              newTableData.push(entry)
            }
          }
          this.tableData = newTableData
        } else {
          this.savedVoucherTaxItem = []
        }
      })
    },
    syncRemoteData: function (data, remoteData) {
      data.pk_taxitem = remoteData.pk_taxitem
      data.taxratio = remoteData.taxratio
      data.taxcode = remoteData.taxcode
      data.taxname = remoteData.taxname
      data.mny = remoteData.mny.toFixed(2)
      data.taxmny = remoteData.taxmny.toFixed(2)
    },
    addRow: function (index) {
      let row = this.tableData[index]
      let newRow = this.cloneRow(row)
      this.tableData.splice(index + 1, 0, newRow)
    },
    cloneRow: function (row) {
      let newRow = {}
      for (let field in row) {
        if (field !== 'pk_taxitem' &&
          field !== 'mny' &&
          field !== 'taxratio' &&
          field !== 'taxmny' &&
          row.hasOwnProperty(field)) {
          newRow[field] = row[field]
        }
      }
      return newRow
    },
    delRow: function (index) {
      let count = 1
      let entryId = this.tableData[index].pk_tzpz_b
      for (let i = 0; i < this.tableData.length; i++) {
        if (i !== index && entryId === this.tableData[i].pk_tzpz_b) {
          count++
        }
      }
      if (count > 1) {
        this.tableData.splice(index, 1)
      }
    },
    entrySpanMethod: function (info) {
      let row = info.row
      if (row.isAnalyse && info.columnIndex < 4) {
        let entryID = row.pk_tzpz_b
        let sameEntryCount = 0
        let firstIndex = null
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].pk_tzpz_b === entryID) {
            if (firstIndex === null) {
              firstIndex = i
            }
            sameEntryCount++
          }
        }
        if (sameEntryCount > 1) {
          return info.rowIndex === firstIndex ? [sameEntryCount, 1] : [0, 0]
        }
      }
    },
    onTaxSelect: function (value, rowIndex) {
      for (let i = 0; i < this.taxItems.length; i++) {
        if (this.taxItems[i].itemid === value) {
          this.tableData[rowIndex].taxratio = this.taxItems[i].shuilv
          this.tableData[rowIndex].taxcode = this.taxItems[i].code
          this.tableData[rowIndex].taxname = this.taxItems[i].name
          if (this.tableData[rowIndex].mny) {
            this.calTaxRate(rowIndex)
            this.calculateTaxMny(rowIndex)
          }
          break
        }
      }
    },
    formatFpStyle: function (fpStyle) {
      fpStyle = String(fpStyle)
      let text = ''
      switch (fpStyle) {
        case '1':
          text = '普票和其他'
          break
        case '2':
          text = '专票'
          break
        case '3':
          text = this.corpTaxType === '一般纳税人' ? '未开票' : '未开票和其他'
          break
        default:
          break
      }
      return text
    },
    formatMny: function (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    },
    formatTaxRate: function (row, column, cellValue) {
      if (cellValue !== null && cellValue !== undefined) {
        let pRate = (cellValue * 100).toFixed(2).replace(/\.00$/, '')
        return pRate + '%'
      }
    },
    onInputMny: function (val, rowIndex) {
      val = Number(val.replace(/[^0-9.-]/g, ''))
      this.tableData[rowIndex].mny = val.toFixed(2)
      if (this.tableData[rowIndex].taxratio === undefined ||
        this.tableData[rowIndex].taxratio === null) {
        this.calTaxRate(rowIndex)
      }
      if (this.tableData[rowIndex].pk_taxitem) {
        this.calculateTaxMny(rowIndex)
      }
    },
    onInputTaxMny: function (val, rowIndex) {
      val = Number(val.replace(/[^0-9.-]/g, ''))
      this.tableData[rowIndex].taxmny = val.toFixed(2)
      this.calTaxRate(rowIndex)
    },
    calTaxRate: function (rowIndex) {
      let taxcode = this.tableData[rowIndex].taxcode
      if (taxcode === '143' || taxcode === '144') {
        let taxRate = this.tableData[rowIndex].taxratio
        let mny = this.tableData[rowIndex].mny
        let taxMny = this.tableData[rowIndex].taxmny
        if (mny && taxMny !== null && taxMny !== undefined) {
          taxRate = taxMny / mny
          this.tableData[rowIndex].taxratio = taxRate.toFixed(2)
        }
      }
    },
    calculateTaxMny: function (rowIndex) {
      let taxRate = this.tableData[rowIndex].taxratio
      let taxMny
      if (taxRate) {
        let taxcode = this.tableData[rowIndex].taxcode
        if (this.tableData[rowIndex].isIntax && taxcode !== '143' && taxcode !== '144') {
          taxMny = this.tableData[rowIndex].mny / (1 - taxRate) * taxRate
        } else {
          taxMny = this.tableData[rowIndex].mny * taxRate
        }
        this.tableData[rowIndex].taxmny = taxMny.toFixed(2)
      }
    },
    getTaxItems: function (row) {
      let taxItems = []
      if (this.corpTaxType !== '一般纳税人') {
        for (let i = 0; i < this.taxItems.length; i++) {
          if (row.pk_taxitem === this.taxItems[i].itemid ||
            (this.taxItems[i].def1 !== 'Y' && this.taxItems[i].fp_style === this.fp_style)) {
            taxItems.push(this.taxItems[i])
          }
        }
      } else {
        for (let i = 0; i < this.taxItems.length; i++) {
          if (row.pk_taxitem === this.taxItems[i].itemid ||
            ((this.taxItems[i].fp_style === undefined ||
              this.taxItems[i].fp_style === row.fp_style) &&
              this.taxItems[i].def1 !== 'Y' &&
              ((this.taxItems[i].taxstyle === '2' && row.isIntax) ||
                (this.taxItems[i].taxstyle === '1' && row.isOuttax)))) {
            if (row.isIntax) {
              if ((this.taxItems[i].code === '143' || this.taxItems[i].code === '144')) {
                if (this.subjectRules.traffic && row.subjCode.match(this.subjectRules.traffic) &&
                  this.date >= '2019-04-01') {
                  taxItems.push(this.taxItems[i])
                }
              } else if (this.subjectRules.purchase && row.subjCode.match(this.subjectRules.purchase)) {
                taxItems.push(this.taxItems[i])
              }
            } else {
              taxItems.push(this.taxItems[i])
            }
          }
        }
      }
      return taxItems
    },
    saveTaxItems: function () {
      if (this.checkTaxItemInput()) {
        let taxItems = this.getVoucherTaxItems()
        if (taxItems.length > 0) {
          this.$api.Voucher.saveVoucherTaxItem(taxItems).then(rs => {
            if (rs.success) {
              this.$message.success('保存成功')
              this.dialogVisible = false
            } else {
              this.$message.error(rs.msg)
            }
          })
        }
      }
    },
    deleteConfirm: function () {
      this.$confirm('确认删除税表表项吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.deleteTaxItems()
      })
    },
    deleteTaxItems: function () {
      let taxItems = this.getVoucherTaxItems()
      if (taxItems.length > 0) {
        this.$api.Voucher.deleteVoucherTaxItem({
          voucherId: this.voucherData.id
        }).then(rs => {
          if (rs.success) {
            this.$message.success('删除成功')
            this.dialogVisible = false
          } else {
            this.$message.error(rs.msg)
          }
        })
      }
    },
    checkTaxItemInput: function () {
      for (let i = 0; i < this.tableData.length; i++) {
        let entry = this.tableData[i]
        if (entry.isAnalyse) {
          let msg = null
          if (!entry.pk_taxitem) {
            msg = '第' + (i + 1) + '行税表表项为空'
          } else if (!entry.mny) {
            msg = '第' + (i + 1) + '行税表金额为空'
          } else if (entry.taxmny === null ||
            entry.taxmny === undefined) {
            msg = '第' + (i + 1) + '行税表税额为空'
          }
          if (msg) {
            this.$message.warning(msg)
            return false
          }
        }
      }
      return true
    },
    getVoucherTaxItems: function () {
      let taxItems = []
      for (let i = 0; i < this.tableData.length; i++) {
        let entry = this.tableData[i]
        if (entry.pk_taxitem) {
          entry.tax_style = entry.isOuttax ? '1' : '2'
          taxItems.push(entry)
        }
      }
      return taxItems
    }
  }
}
</script>

<style scoped>
  .row-operate {
    top: 12px;
    left: -8px;
  }
  >>> .el-table__row td:nth-child(1) .cell, >>> .el-table__row td:nth-child(2) .cell {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
  }
</style>
