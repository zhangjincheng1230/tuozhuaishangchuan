<template>
  <div style="position: relative">
    <el-dialog
      class="fileDialog"
      title="存货档案"
      :visible.sync="dialogFile"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="630px"
      @close="closeDialog"
    >
      <el-header style="padding: 0px; height: 38px">
        <div style="text-align: center">
          <el-input
            v-model="selectElement"
            placeholder="请输入存货编码、存货名称、规格(型号)按Enter键查询"
            style="width: 90%;"
            @change="selectInfo"
          ></el-input>
        </div>
      </el-header>
      <el-main style="padding: 0px;">
        <el-table
          :data="TableList"
          :header-cell-style="headerCellStyle"
          @row-dblclick="verifyForm"
          ref="verifyTableRef"
          stripe
          border
          highlight-current-row
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          @current-change="handleCurrentChange"
          :height="Height"
          style="width: 100%"
        >
          <el-table-column label=" " type="index" align="center" max-width="35"></el-table-column>
          <el-table-column v-if="isKcShow" prop="kmbm" label="科目编码" sortable header-align="center" align="left" width="102"></el-table-column>
          <el-table-column v-if="isKcShow" prop="kmmc" label="科目名称" header-align="center" align="left" width="90"></el-table-column>
          <el-table-column v-if="this.isShowKm" prop="kmclassifyname" label="类别(科目)" show-overflow-tooltip header-align="center" align="left" width="70"></el-table-column>
          <el-table-column prop="code" label="存货编码" sortable align="center" width="80">
            <template slot-scope="scope">
              <span v-if="!isKcShow">{{scope.row.code}}</span>
              <span v-else>{{scope.row.spbm}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="存货名称" show-overflow-tooltip header-align="center" align="left" width="90">
            <template slot-scope="scope">
              <span v-if="!isKcShow">{{scope.row.name}}</span>
              <span v-else>{{scope.row.spmc}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="isKcShow" prop="" label="存货分类" align="center" width="85"></el-table-column>
          <el-table-column prop="spec" label="规格(型号)" show-overflow-tooltip header-align="center" align="left" width="80">
            <template slot-scope="scope">
              <span v-if="!isKcShow">{{scope.row.spec}}</span>
              <span v-else>{{scope.row.gg}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="计量单位" align="center" width="70">
            <template slot-scope="scope">
              <span v-if="!isKcShow">{{scope.row.unit}}</span>
              <span v-else>{{scope.row.jldw}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="njznum" label="结存数量" align="center" min-width="85" show-overflow-tooltip :formatter="formatter"></el-table-column>
          <el-table-column prop="jsprice" label="结存单价" align="center" max-width="85" show-overflow-tooltip :formatter="formatter">
            <template slot-scope="scope">
              <span v-if="!isKcShow">{{formatter(scope.row, scope.column, scope.row.jsprice)}}</span>
              <span v-else>{{formatter(scope.row, scope.column, scope.row.ncbprice)}}</span>
            </template>
          </el-table-column>
          <el-table-column  v-if="isKcShow" prop="jc" label="简称" align="center" width="85"></el-table-column>
        </el-table>
      </el-main>
      <div slot="footer" class="dialog__footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="verifyForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InventoryFile',
  props: ['isShowKm'],
  data () {
    return {
      dialogFile: true,
      selectElement: '',
      TableList: [],
      Height: 350,
      loading: false,
      isShow: false,
      isKcShow: false,
      headerCellStyle: {
        background: '#E7EAF4',
        fontsize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      currentRow: ''
    }
  },
  methods: {
    handleCurrentChange: function (row) {
      this.currentRow = row
    },
    selectInfo: function (val) {
      this.TableList = this.batchGoodsOption.filter(ev => {
        if (!this.isKcShow) {
          return ev.name.indexOf(val) !== -1 || ev.code.indexOf(val) !== -1 || (ev.spec && ev.spec.indexOf(val) !== -1)
        } else {
          return (ev.spmc && ev.spmc.indexOf(val) !== -1) || (ev.spbm && ev.spbm.indexOf(val) !== -1) || (ev.gg && ev.gg.indexOf(val) !== -1)
        }
      })
    },
    verifyForm: function () {
      this.dialogIsShow()
    },
    closeDialog: function () {
      this.dialogIsShow(1)
    },
    dialogIsShow: function (val) {
      let param = null
      if (val !== 1) {
        param = {
          dataRow: this.currentRow !== '' ? this.currentRow : undefined,
          isShowsFile: false
        }
      } else {
        param = {
          isShowsFile: false
        }
      }
      this.$emit('InventoryRow', param)
      this.selectElement = ''
    },
    formatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      if (column.property === 'jsprice') {
        return this.$options.filters.forThousands(cellValue, this.$store.getters.pricePre, true)
      } else if (column.property === 'njznum') {
        return this.$options.filters.forThousands(cellValue, this.$store.getters.numPre, true)
      } else {
        return this.$options.filters.forThousands(cellValue, 2, true)
      }
    },
    loadTableList: function () {
      const loginCorp = this.$store.getters.getLoginCorp
      if (loginCorp.buildic === '2') {
        this.isKcShow = false
        let param = {
          id: '000001000000000000000006',
          kmid: null,
          pk_corp: '',
          isfenye: 'N',
          billtype: null
        }
        this.loading = true
        this.$api.inComeBill.workQueryB(param).then(result => {
          this.loading = false
          if (result.success) {
            this.TableList = result.rows
            this.batchGoodsOption = result.rows
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.isKcShow = true
        this.loading = true
        this.$api.inComeBill.inventoryQueryInfo({isshow: 'Y'}).then(result => {
          this.loading = false
          if (result.success) {
            this.TableList = result.rows
            this.batchGoodsOption = result.rows
          }
        })
      }
    }
  },
  mounted () {
    this.loadTableList()
    // if (this.batchGoodsOption !== undefined && this.batchGoodsOption !== '') {
    //   this.TableList = this.batchGoodsOption
    // }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .fileDialog .el-dialog__body {
    padding: 10px 0;
  }
</style>
