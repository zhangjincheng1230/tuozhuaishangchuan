<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-date-picker
              v-model="queryForm.beginDate"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择月">
            </el-date-picker>
            纳税人资格：
            <el-select v-model="queryForm.corptype" placeholder="请选择">
              <el-option
                v-for="item in corptypeRange"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input
              placeholder="录入客户编码或名称，按Enter键过滤 "
              v-model="queryForm.corpname"
              size="mini"
              style="width: 250px"
              @keyup.enter.native="query"
              clearable>
            </el-input>
            <el-tooltip style="cursor: pointer" class="item" effect="dark" placement="right">
              <div slot="content" class="content"  style="width:345px">
                <b>记账状态：</b><br>
                &emsp;&loz;未完成：当月损益未结转<br>
                &emsp;&loz;已完成：当月损益已结转<br>
                &emsp;<b>关账状态：</b><br>
                &emsp;&loz;已关账：当月客户已关账<br>
                &emsp;&loz;显示为空：当月客户未关账<br>
                &emsp;<b>凭证审核状态</b><br>
                &emsp;&loz;未完成：当月客户有未审核凭证<br>
                &emsp;&loz;已完成：当月客户有凭证且未审核数为 0<br>
              </div>
              <img  src="@/assets/img/helptool.png">
            </el-tooltip>
            <el-button @click="query">查询</el-button>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="query">刷新</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            highlight-current-row
            stripe
            border
            v-loading="loading"
            element-loading-text="数据加载中"
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod"
              width="50">
            </el-table-column>
            <el-table-column
              property="khCode"
              label="客户编码"
              header-align="center"
              align="center"
              width="150"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              property="khName"
              label="客户名称"
              header-align="center"
              align="center"
              show-overflow-tooltip
              width="300"
            ></el-table-column>
            <el-table-column
              property="khTaxType"
              label="纳税人性质"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="pcount"
              label="主办会计"
              header-align="center"
              align="center"
              show-overflow-tooltip
              width="150"
            ></el-table-column>
            <el-table-column
              property="period"
              label="建账日期"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="jzstatus"
              label="记账状态 "
              :filters="jzstatusRange"
              :filter-method="filterJzstatus"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              property="ckstatus"
              label="关账状态"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              label="预警"
              header-align="center"
              align="center"
              width="150"
            >
              <template slot-scope="scope" v-if="scope.row.hasOwnProperty('yjxx')">
                <el-tooltip style="cursor: pointer" class="item" effect="dark" placement="right">
                  <div slot="content">
                    <span v-html="formatYjxx(scope.row.yjxx)"></span>
                  </div>
                  <div>
                    <img src="@/assets/yjxx.png">
                    <span style="color: #45A7DA; vertical-align: center; line-height: 23px">详情</span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              property="austatus"
              label="凭证审核状态"
              header-align="center"
              align="center"
              width="150"
            ></el-table-column>
            <el-table-column label></el-table-column>
            <div slot="empty"></div>
          </el-table>
        </div>
        <div class="table-pagination">
          <Pagination
            :total="total"
            :page.sync="pageInfo.page"
            :limit.sync="pageInfo.rows"
            @pagination="query"
            :page-sizes="[10, 20, 30, 40, 50]"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'kjjz-search',
  components: {
    Pagination
  },
  data () {
    return {
      pageInfo: {
        page: 1,
        rows: 20
      },
      queryForm: {
        corpname: '',
        corptype: '-1',
        beginDate: this.$store.getters.currentCorp.bdate.substring(0, 7),
        corpIds: this.$store.getters.currentCorp.pk_gs
      },
      queryqj: '',
      loading: false,
      queryParam: {
        qjq: '',
        year: '',
        levelq: '',
        qrytype: 100,
        corpname: ''
      },
      total: 0,
      tableData: []
    }
  },
  created () {
    this.query()
  },
  computed: {
    nodename () {
      return '会计记账查询'
    },
    corptypeRange () {
      return [{label: '全部', value: '-1'}, {label: '一般纳税人', value: '0'}, {label: '小规模纳税人', value: '1'}]
    },
    jzstatusRange () {
      return [{text: '已完成', value: '已完成'}, {text: '未完成', value: '未完成'}]
    }
  },
  methods: {
    indexMethod (index) {
      return (this.pageInfo.page - 1) * this.pageInfo.rows + index + 1
    },
    formatYjxx (cellValue) {
      let yjxx = cellValue.split('#')
      let yjxxTip = ''
      for (var i = 0; i < yjxx.length; i++) {
        yjxxTip += (i + 1) + '.' + yjxx[i] + '<br/>'
      }
      return yjxxTip
    },
    query () {
      this.loading = true
      this.tableData = []
      this.$api.kjjzSearch.query(this.getQueryPram()).then(result => {
        this.queryVisible = false
        if (result.success === true) {
          this.tableData = result.rows
          this.total = result.total
        } else {
          this.$message.error(result.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getQueryPram () {
      this.queryParam.qjq = this.queryForm.beginDate
      this.queryParam.year = this.queryForm.beginDate.substring(0, 4)
      this.queryParam.levelq = this.queryForm.corptype
      this.queryParam.corpname = this.queryForm.corpname
      return Object.assign(this.queryParam, this.pageInfo)
    },
    reflesh () {

    },
    filterJzstatus (value, row, column) {
      return row.jzstatus != undefined &&
        row.jzstatus.indexOf(value) != -1
    }
  }
}
</script>

<style scoped>
  >>> .el-table__column-filter-trigger i {
    color: #060606;
  }
</style>
