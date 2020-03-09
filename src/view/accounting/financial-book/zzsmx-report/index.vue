<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div
          class="kj-button-group"
          style="float: left; white-space: nowrap"
        >
          日期:
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
              property="xm"
              label="项目"
              header-align="center"
              width="320"
            ></el-table-column>
            <el-table-column
              property="hc"
              label="行数"
              header-align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              property="sq_je"
              label="上年数"
              header-align="center"
              align="right"
              width="180"
            ></el-table-column>
            <el-table-column
              property="bn_je"
              label="本年数"
              header-align="center"
              align="right"
              width="180"
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
  name: 'zzsmx-report',
  data () {
    return {
      tableData: []
    }
  }
}
</script>

<style scoped>

</style>
