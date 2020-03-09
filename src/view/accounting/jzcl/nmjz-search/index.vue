<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-select v-model="queryForm.beginYear" placeholder="请选择" @change="changeYear">
              <el-option
                v-for="item in yearRange"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              property="period"
              label="期间"
              header-align="center"
              align="left"
              width="150"
            ></el-table-column>
            <el-table-column
              property="accode"
              label="科目编码"
              header-align="center"
              align="left"
              width="150"
            ></el-table-column>
            <el-table-column
              property="acname"
              label="科目名称"
              header-align="center"
              align="left"
              width="150"
            ></el-table-column>
            <el-table-column
              property="tmqc"
              label="本月期初"
              header-align="center"
              align="right"
              width="150"
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="jfse"
              label="借方金额"
              header-align="center"
              align="right"
              width="150"
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="dfse"
              label="贷方金额"
              header-align="center"
              align="right"
              width="150"
              :formatter="repformny"
            ></el-table-column>
            <el-table-column
              property="tmqm"
              label="本月期末"
              header-align="center"
              align="right"
              width="150"
              :formatter="repformny"
            ></el-table-column>
            <el-table-column label></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nmjz-search',
  data () {
    return {
      queryVisible: false,
      loading: false,
      queryForm: {
        beginYear: this.$store.getters.getLoginDate.substring(0, 4),
        corpIds: this.$store.getters.currentCorp.pk_gs
      },
      queryParam: {
        startYear: '',
        begindate: '',
        enddate: ''
      },
      tableData: []
    }
  },
  created () {
    this.query()
  },
  computed: {
    // 期间范围
    yearRange () {
      let range = []
      for (let beginRange = parseInt(this.$store.getters.currentCorp.bdate.substring(0, 4)); beginRange <= new Date().getFullYear(); beginRange++) {
        range.push({value: beginRange, label: beginRange})
      }
      return range
    }
  },
  methods: {
    // 查询
    query () {
      this.$api.nmjz.search(this.getQueryParam()).then(result => {
        this.queryVisible = false
        if (result.success === true) {
          console.log(result.rows)
          this.loading = false
          this.tableData = result.rows
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    // 获取查询参数
    getQueryParam () {
      this.queryParam.startYear = this.queryForm.beginYear
      this.queryParam.begindate = this.queryForm.beginYear + '-12-01'
      this.queryParam.enddate = this.queryForm.beginYear + '-12-01'
      return this.queryParam
    },
    // 改变查询年份
    changeYear (val) {
      this.query()
    },
    // 格式化金额
    repformny (row, column, cellValue) {
      return this.$options.filters.forThousands(cellValue)
    }
  }
}
</script>

<style scoped>

</style>
