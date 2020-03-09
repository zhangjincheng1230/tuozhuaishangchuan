<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>
            <div class="nav-query-period">
              <el-button
                @click="prevPeriod"
                type="primary"
                class="period-nav"
                icon="el-icon-caret-left"></el-button>
              <el-date-picker
                v-model="navPeriodRange"
                @change="onNavPeriodChange"
                :clearable="false"
                value-format="yyyy-MM"
                type="monthrange"
                unlink-panels
                :range-separator="queryPeriodDisplay"
                class="query-date-picker">
              </el-date-picker>
              <el-button
                @click="nextPeriod"
                type="primary"
                class="period-nav"
                icon="el-icon-caret-right"></el-button>
            </div>
            <el-input v-model="zy" placeholder="请输入摘要" style="width: 125px;">
              <template #suffix>
                <i class="el-input__icon el-icon-search" style="cursor: pointer" @click="query"></i>
              </template>
            </el-input>
            <el-popover
              placement="bottom"
              title="凭证查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <VoucherQueryForm
                ref="queryForm"
                :period-range="navPeriodRange">
              </VoucherQueryForm>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button @click="clearQueryForm">清除</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <template slot="reference">
                <el-button>更多<i class="el-icon-s-operation el-icon--right"></i></el-button>
              </template>
            </el-popover>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="cnqz">出纳签字</el-button>
          <el-button @click="cancelqz">取消签字</el-button>
        </div>
      </div>
      <div
        class="kj-main"
        v-loading="loading"
        :element-loading-text="loadingText"
        :element-loading-spinner="loadingSpinner">
        <div class="voucher-list">
          <div class="voucher-list-head">
            <div class="col-resize-wrapper">
              <div
                class="col_resize" :style="{left: tdIndexWidth + 'px'}"
                @mousedown="handleMouseDown($event, 'tdIndexWidth')"></div>
              <div
                class="col_resize" :style="{left: (tdIndexWidth + tdZyWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdZyWidth')"></div>
              <div
                class="col_resize" :style="{left: (tdIndexWidth + tdZyWidth + tdKmWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdKmWidth')"></div>
              <div
                class="col_resize" :style="{left: (tdIndexWidth + tdZyWidth + tdKmWidth + tdJfWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdJfWidth')"></div>
              <div
                class="col_resize"
                :style="{left: (tdIndexWidth + tdZyWidth + tdKmWidth + tdJfWidth + tdDfWidth) + 'px'}"
                @mousedown="handleMouseDown($event, 'tdDfWidth')"></div>
            </div>
            <table class="head-table" border="0" cellspacing="0" cellpadding="0"
                   :style="{width: (tdIndexWidth + tdZyWidth + tdKmWidth + tdJfWidth + tdDfWidth) + 'px'}">
              <tr>
                <td :style="{width: tdIndexWidth + 'px',textAlign: 'left'}">
                  <div style="padding-left: 8px;">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                                 @change="checkAllChange"></el-checkbox>
                    全选
                  </div>
                </td>
                <td id="tdHeaderZy" :style="{width: tdZyWidth + 'px'}">摘要</td>
                <td :style="{width: tdKmWidth + 'px'}">会计科目</td>
                <td :style="{width: tdJfWidth + 'px'}">借方金额</td>
                <td :style="{width: tdDfWidth + 'px'}">贷方金额</td>
              </tr>
            </table>
          </div>
          <div class="voucher-list-body">
            <el-checkbox-group v-model="checkIndexes" @change="checkedIndexChange">
              <div v-for="(item, index) in voucherData" :key="item.id" style="position: relative">
                <div style="position: absolute; left: 0; top: 9px;">
                  <el-checkbox :label="index" style="margin: 0 5px;"><span></span></el-checkbox>
                </div>
                <VoucherListTable
                  :voucher-data="item"
                  @click.native="checkItem($event, index)"
                  @delete="reFetchData"
                  :index-width="tdIndexWidth"
                  :abstract-width="tdZyWidth"
                  :subject-width="tdKmWidth"
                  :debit-width="tdJfWidth"
                  :credit-width="tdDfWidth">
                </VoucherListTable>
              </div>
            </el-checkbox-group>
          </div>
          <Pagination
            :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows"
            :page-sizes="[50, 100, 300, 500, 1000]"
            @pagination="paginationQuery"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VoucherListTable from '@/components/Voucher/VoucherListTable'
import VoucherQueryForm from './components/VoucherQueryForm'
import Pagination from '@/components/Pagination'
import loading from '@/mixins/loading'
import {getPreviousPeriod, getNextPeriod, formatDate} from '@/utils'

export default {
  name: 'voucher-cnqz',
  data () {
    let loginDate = this.$store.getters.getLoginDate
    let loginPeriod = loginDate.substring(0, 7)
    return {
      total: 0,
      // 摘要
      zy: '',
      navPeriodRange: [loginPeriod, loginPeriod],
      pageInfo: {
        page: 1,
        rows: 50
      },
      queryVisible: false,
      queryParam: {},
      voucherData: [],
      checkIndexes: [],
      allIndex: [],
      checkAll: false,
      tdIndexWidth: 80,
      tdZyWidth: 250,
      tdKmWidth: 400,
      tdJfWidth: 200,
      tdDfWidth: 200,
      dragging: false,
      draggingElement: null,
      draggingColumnName: null,
      dragState: {}
    }
  },
  computed: {
    queryPeriodDisplay () {
      let displayText
      if (this.queryParam.begindate) {
        displayText = this.queryParam.begindate
        if (this.queryParam.begindate !== this.queryParam.enddate) {
          displayText += '~' + this.queryParam.enddate
        }
      } else {
        displayText = this.queryParam.beginPeriod
        if (this.queryParam.beginPeriod !== this.queryParam.endPeriod) {
          displayText += '~' + this.queryParam.endPeriod
        }
      }
      return displayText
    },
    loginCorp () {
      return this.$store.getters.getLoginCorp
    },
    isIndeterminate () {
      return this.checkIndexes.length > 0 && this.allIndex.length !== this.checkIndexes.length
    }
  },
  mixins: [loading],
  components: {
    VoucherListTable,
    VoucherQueryForm,
    Pagination
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    cnqz () {
      if (this.checkIndexes.length > 0) {
        if (this.checkIndexes.length === 1 &&
          this.voucherData.length === 1 &&
          this.voucherData[0].bqz) {
          this.$message.warning('已签字，不能重复签字！')
          return
        }

        let ids = []
        let checkdate = false
        this.checkIndexes.forEach(index => {
          let voucher = this.voucherData[index]
          ids.push(voucher.id)
          if (this.checkDate(voucher)) {
            checkdate = true
          }
        })

        if (checkdate) {
          this.$confirm('签字日期早于凭证日期，是否延用凭证日期作为签字日期？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
            iconClass: 'el-icon-warning-outline',
            center: true,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }).then(() => {
            this.docnqz(ids, 0)
          }).catch(() => {
            this.docnqz(ids, 1)
          })
        } else {
          this.docnqz(ids, 1)
        }
      } else {
        this.$message.warning('至少选择一行数据')
      }
    },
    checkDate (voucher) {
      let zddate = formatDate(voucher.zdrq)
      let lgdate = formatDate(this.$store.getters.getLoginDate)

      return lgdate < zddate
    },
    docnqz (ids, mode) {
      this.loading = true
      this.$api.Voucher.sign({
        ids: ids.join(','),
        mode: mode
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.query()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    cancelqz () {
      if (this.checkIndexes.length > 0) {
        let ids = []
        this.checkIndexes.forEach(index => {
          let voucher = this.voucherData[index]
          ids.push(voucher.id)
        })
        this.loading = true
        this.$api.Voucher.cancelSign({
          ids: ids.join(',')
        }).then(res => {
          this.loading = false
          if (res.success) {
            this.query()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('至少选择一行数据')
      }
    },
    fetchData (param) {
      if (param === undefined || param === null) {
        param = this.getQueryParam()
        if (param === false) {
          return
        }
      }
      this.queryParam = param
      this.showLoading('数据加载中，请稍候...')
      this.$api.Voucher.queryVoucher(param).then(res => {
        this.closeLoading()
        this.checkIndexes = []
        this.checkAll = false
        this.voucherData = res.rows
        this.total = res.total
        let allIndex = []
        for (let i = 0; i < res.rows.length; i++) {
          allIndex.push(i)
        }
        this.allIndex = allIndex
      }).catch(() => {
        this.closeLoading()
      })
    },
    query () {
      this.fetchData()
      this.queryVisible = false
    },
    reFetchData () {
      this.pageInfo.page = 1
      this.fetchData()
    },
    paginationQuery () {
      this.fetchData()
    },
    onNavPeriodChange () {
      this.$nextTick(() => {
        this.reFetchData()
      })
    },
    prevPeriod () {
      let period = getPreviousPeriod(this.navPeriodRange[0])
      this.navPeriodRange = [period, period]
      this.onNavPeriodChange()
    },
    nextPeriod () {
      let period = getNextPeriod(this.navPeriodRange[0])
      this.navPeriodRange = [period, period]
      this.onNavPeriodChange()
    },
    clearQueryForm () {
      return this.$refs.queryForm.resetForm()
    },
    getQueryParam () {
      let param = this.$refs.queryForm.getQueryParam()
      if (param !== false) {
        param.zy = this.zy
        Object.assign(param, this.pageInfo)
      }
      // 出纳签字
      param.cnqz = 'Y'
      return param
    },
    checkAllChange (val) {
      this.checkIndexes = val ? this.allIndex.slice(0) : []
    },
    checkedIndexChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.allIndex.length
    },
    checkItem: function (event, index) {
      for (let r = 0; r < this.checkIndexes.length; r++) {
        if (this.checkIndexes[r] === index) {
          this.checkIndexes.splice(r, 1)
          this.checkedIndexChange(this.checkIndexes)
          return false
        }
      }
      this.checkIndexes.push(index)
      this.checkedIndexChange(this.checkIndexes)
    },
    handleMouseDown (event, name) {
      this.draggingElement = event.target
      this.dragging = true
      this.draggingColumnName = name
      this.dragState = {
        startMouseLeft: event.clientX,
        startLeft: this.draggingElement.offsetLeft,
        originWidth: this[name]
      }
      const handleMouseMove = (event) => {
        if (this.dragging) {
          const deltaLeft = event.clientX - this.dragState.startMouseLeft
          let newWidth = this.dragState.originWidth + deltaLeft
          if (newWidth > 60) {
            this.draggingElement.style.left = (this.dragState.startLeft + deltaLeft) + 'px'
            this[this.draggingColumnName] = newWidth
          }
        }
      }
      const handleMouseUp = () => {
        if (this.dragging) {
          this.dragging = false
          this.draggingElement = null
          this.draggingColumnName = null
          this.dragState = {}
          this.saveColumnSettingDelay()
        }
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    saveColumnSettingDelay () {
    },
    getSelections () {
      let idArray = []
      this.checkIndexes.forEach(index => idArray.push(this.voucherData[index].id))
      return idArray
    }
  }
}
</script>

<style scoped>
  .voucher-list {
    height: 100%;
  }

  .voucher-list-head {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #DFE5F4;
  }

  .head-table {
    text-align: center;
  }

  .col_resize {
    position: absolute;
    top: 0px;
    width: 2px;
    background-color: #C1C1C1;
    z-index: 100;
    cursor: e-resize;
    height: 40px;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .voucher-list-body {
    height: calc(100% - 70px);
    overflow: auto;
  }

  .nav-query-period {
    float: left;
    margin-right: 5px;
  }

  .query-date-picker {
    width: auto;
  }

  .period-nav {
    padding: 9px 5px;
  }

  .query-date-picker >>> .el-range-input {
    display: none;
  }

  .query-date-picker >>> .el-range-separator {
    width: auto;
  }

  .query-date-picker >>> .el-input__icon {
    display: none;
  }
</style>
