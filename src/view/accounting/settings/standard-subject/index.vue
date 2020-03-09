<template>
  <div class="app-main">
    <div class="kj-container"
         v-loading="loading"
         element-loading-text="加载中，请稍候..."
         element-loading-spinner="el-icon-loading">
      <div class="kj-head">
        <span><span class = "kj-black">左侧标记蓝色的是需要同步的科目</span>&nbsp;&nbsp;<el-checkbox v-model="checked" @change="checkBoxSelect">隐藏已匹配科目</el-checkbox></span>
        <div class="kj-button-group">
          <el-button @click="cancel" v-if = "!btnVisible">取消</el-button>
          <el-button @click="save" v-if = "!btnVisible">确定</el-button>
          <el-button @click="nextStep" v-if = "btnVisible">下一步</el-button>
          <el-button @click="refresh" v-if = "btnVisible">刷新</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-row style="height: 100%">
          <el-col :span="7" style="height: 100%">
            <el-table
              ref="leftmultipleTable"
              :data="tableDataleft"
              highlight-current-row
              border
              height="100%"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              :row-class-name="tableRowClassName1">
              <el-table-column label="系统科目" header-align="center">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  property="kmbm"
                  label="科目编码"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="80">
                </el-table-column>
                <el-table-column
                  property="kmmc"
                  label="科目名称"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="100">
                </el-table-column>
                <el-table-column
                  property="v1"
                  label="同步信息"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="92">
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="17" style="height: 100%">
            <el-table
              :data="tableDataright"
              highlight-current-row
              border
              height="100%"
              style="width: 100%"
              :row-class-name="tableRowClassName2">
              <el-table-column label="公司原科目" header-align="center">
                <el-table-column
                  property="kmbm"
                  label="科目编码"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="80">
                </el-table-column>
                <el-table-column
                  property="kmmc"
                  label="科目名称"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="150">
                </el-table-column>
                <el-table-column
                  property="v2"
                  label="预制信息"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="80">
                </el-table-column>
                <el-table-column
                  property="yz"
                  label="是否末级"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="80">
                </el-table-column>
                <el-table-column
                  property="v3"
                  label="同步类型"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="80"
                  :formatter = "forMatterdata1">
                </el-table-column>
              </el-table-column>
              <el-table-column label="对应同步后科目" header-align="center">
                <el-table-column
                  property="v4"
                  label="科目编码"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="150">
                  <template #default="scope">
                    <el-select v-if="scope.row.v3 === '1' || scope.row.v3 === '2' || scope.row.v3 === '4'" v-model="scope.row.v4" placeholder="请选择科目" height="100%" style="width:100%" @change="((val)=> {selectkm(val,scope.row)})" @visible-change="loadkms($event,scope.row)">
                      <el-option
                        v-for="item in kmbmmcs"
                        :key="item.subjcode"
                        :label="item.subjcode"
                        :value="item">
                      </el-option>
                    </el-select>
                    <span v-else >{{scope.row.v4}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  property="synkmmc"
                  label="科目名称"
                  header-align="center"
                  :show-overflow-tooltip="true"
                  width="150"
                  :formatter = "forMatterdata2">
                </el-table-column>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'standard-subject',
  data () {
    return {
      checked: true,
      kmbmmcs: [],
      btnVisible: true,
      leftloadingsumdata: [],
      rightloadingsumdata: [],
      loading: true,
      tableDataleft: [],
      tableDataright: [],
      // 取消前，右边 table 数据备份
      cancelPreDataBak: [],
      multipleSelection: [],
      currentRow: null,
      resvalue: [{ id: '0', name: '不同步' }, { id: '1', name: '增加下级' }, { id: '2', name: '科目占用' }, { id: '3', name: '新增科目' }, { id: '4', name: '科目占用' }]
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.StandardSubject.queryHy().then(result => {
        this.loading = false
        if (result.rows && result.rows.length > 0) {
          this.leftloadingsumdata = result.rows
          if (this.checked) {
            this.tableDataleft = result.rows.filter((item) => {
              if (item.v1 === '未同步') {
                return item
              }
            })
          } else {
            this.tableDataleft = result.rows
          }
        } else {
          this.leftloadingsumdata = []
        }
      }).catch(e => {
        this.loading = false
      })
      this.loading = true
      const gsparam = { addlist: [] }
      this.$api.BasicSettingApi.StandardSubject.queryGs(gsparam).then(result => {
        this.loading = false
        if (result.rows && result.rows.length > 0) {
          this.rightloadingsumdata = result.rows
          this.filterTableDataright(this.rightloadingsumdata)
        } else {
          this.rightloadingsumdata = []
        }
      }).catch(e => {
        this.loading = false
      })
    },
    tableRowClassName1 ({ row, rowIndex }) {
      if (row.v1 && row.v1 !== '已同步') {
        return 'sync-row'
      }
      return ''
    },
    tableRowClassName2 ({ row, rowIndex }) {
      if (row.v3 && (row.v3 === '1' || row.v3 === '2' || row.v3 === '3' || row.v3 === '4')) {
        return 'sync-row'
      }
      return ''
    },
    handleSelectLoad (val) {
      // 计算增加下级和科目占用的值
      this.currentRow = val
      if (this.currentRow && this.currentRow.v3 === '1') { // 增加下级
        this.calcChildKms()
      } else if (this.currentRow && this.currentRow.v3 === '2') { // 科目占用
        this.calcSameLevelKms()
      } else if (this.currentRow && this.currentRow.v3 === '4') { // 增加下级和科目占用都存在

      }
    },
    calcChildKms () {
      const kmbm = this.currentRow.kmbm
      this.kmbmmcs = this.tableDataright.filter((item) => {
        if (item.kmbm.startsWith(kmbm) && item.kmbm !== kmbm) {
          return item
        }
      }).map((item) => {
        return { subjcode: item.kmbm, subjname: item.kmmc }
      })
    },
    calcSameLevelKms () {
      const kmbm = this.currentRow.kmbm
      const pix = kmbm.substring(0, 4)
      this.kmbmmcs = this.tableDataright.filter((item) => {
        if (item.kmbm.startsWith(pix) && item.kmbm.length === kmbm.length && item.kmbm !== kmbm) {
          return item
        }
      }).map((item) => {
        return { subjcode: item.kmbm, subjname: item.kmmc }
      })
    },
    calcSameLevelChildLevelkms () {

    },
    nextStep () {
      if (this.multipleSelection.length === 0) {
        this.errorMsg('请选择左侧需要同步的科目!')
      } else {
        const addlist = this.multipleSelection.map(item => {
          return { kmbm: item.kmbm, kmmc: item.kmmc }
        })
        const param = { addlist: JSON.stringify(addlist) }
        this.loading = true
        this.$api.BasicSettingApi.StandardSubject.queryGs(param).then(result => {
          this.loading = false
          // 右边数据备份
          this.cancelPreDataBak = this.rightloadingsumdata
          if (result.rows && result.rows.length > 0) {
            this.rightloadingsumdata = result.rows
            this.filterTableDataright(this.rightloadingsumdata)
            this.btnVisible = false
          } else {
            this.rightloadingsumdata = []
          }
        }).catch(e => {
          this.loading = false
        })
      }
    },
    forMatterdata1 (row, column, cellValue, index) {
      if (cellValue === '' || undefined === cellValue) {
        return '不同步'
      } else {
        const name = this.resvalue.map(item => {
          if (item.id === cellValue) {
            return item.name
          }
        })
        return name
      }
    },
    forMatterdata2 (row, column, cellValue, index) {
      if (row.v3 === '3') {
        return row.v5
      } else {
        return cellValue
      }
    },
    selectkm (item, row) {
      row.synkmmc = item.subjname
      row.v4 = item.subjcode
    },
    checkBoxSelect: function (ischecked) {
      if (ischecked) {
        this.tableDataleft = this.leftloadingsumdata.filter((item) => {
          if (item.v1 === '未同步') {
            return item
          }
        })
        this.tableDataright = this.rightloadingsumdata.filter((item) => {
          if (item.v3 === '1' || item.v3 === '2' || item.v3 === '3' || item.v3 === '4') {
            return item
          }
        })
      } else {
        this.tableDataleft = this.leftloadingsumdata
        this.tableDataright = this.rightloadingsumdata
      }
      // 行选中
      if (this.multipleSelection.length > 0) {
        this.toggleSelection(this.multipleSelection)
      } else {
        this.toggleSelection()
      }
    },
    toggleSelection (rows) {
      if (rows) {
        this.$nextTick(() => {
          rows.forEach(row => {
            this.$refs.leftmultipleTable.toggleRowSelection(row)
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs.leftmultipleTable.clearSelection()
        })
      }
    },
    loadkms (callback, row) {
      if (callback) {
        this.handleSelectLoad(row)
      }
    },
    refresh () {
      this.fetchData()
      this.btnVisible = true
    },

    checkValidate () {
      let checktips
      let tips = ''
      let tips2 = ''
      const rows = this.tableDataright
      // 存在非末级科目没对应的下级科目
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].v3 === '1' && rows[i].yz === '是' && (rows[i].v4 === undefined || rows[i].v4 === '')) {
          tips += rows[i].kmbm + ','
        }
      }
      if (tips.length > 0) {
        checktips = '存在非末级科目没对应的下级科目:' + tips.substring(0, tips.length - 1)
      }
      // 新增科目必须存在下级科目
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].v3 === '1' && rows[i].v4 != null) {
          let iscon = false
          for (let j = 0; j < rows.length; j++) {
            if (rows[j].v3 === '3' && rows[j].v4 != null && rows[j].v4 === rows[i].v4) {
              iscon = true
              break
            }
          }
          if (!iscon) {
            tips2 += rows[i].kmbm + ','
          }
        }
      }
      if (tips2.length > 0) {
        if (checktips !== undefined) {
          checktips += '新增科目必须存在下级对应科目:' + tips2.substring(0, tips2.length - 1)
        } else {
          checktips = '新增科目必须存在下级对应科目:' + tips2.substring(0, tips2.length - 1)
        }
      }
      return checktips
    },
    save () {
      // 校验
      const checktips = this.checkValidate()
      if (checktips !== undefined) {
        this.errorMsg(checktips)
        return
      }
      this.$confirm('同步科目的流程不可逆，您是否要继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.loading = true
        // 得到右边树的结果集
        const _list = this.tableDataright.map((item) => {
          return { kmbm: item.kmbm, kmmc: item.kmmc, id: item.id, v2: item.v2, v3: this.getSynctypeFor4(item.v3, item.kmbm, item.v4), v4: item.v4 }
        })
        const param = { list: JSON.stringify(_list) }
        this.$api.BasicSettingApi.StandardSubject.saveCpacountVOS(param).then(result => {
          this.loading = false
          if (result.success) {
            this.refresh()
            this.successMsg(result.msg)
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      })
    },
    getSynctypeFor4 (v3, kmbm, v4) {
      if (v3 === '4') {
        if (kmbm.length === v4.length) {
          return '2' // 科目被占用
        } else {
          return '1' // 新增下级1
        }
      } else {
        return v3
      }
    },
    cancel () {
      // 左边保持不动
      // 右边回到上一次的状态
      this.rightloadingsumdata = this.cancelPreDataBak
      // 加载右边的数据
      this.filterTableDataright(this.rightloadingsumdata)
      this.cancelPreDataBak = []
      this.btnVisible = true
    },
    filterTableDataright (rows) {
      if (this.checked) {
        this.tableDataright = rows.filter((item) => {
          if (item.v3 === '1' || item.v3 === '2' || item.v3 === '3' || item.v3 === '4') {
            return item
          }
        })
      } else {
        this.tableDataright = rows
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      })
    }
  }
}
</script>

<style scoped>
  >>> .el-table .sync-row {
    background: #59d5fd;
  }
  .kj-black {
    font-family: Microsoft YaHei;
    font: 13px/1.5 \5b8b\4f53;
    font-weight: bold;
  }
</style>
