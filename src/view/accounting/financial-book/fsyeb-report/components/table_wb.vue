<template>
    <div class="table-container"  style = "height:100%">
        <vxe-table
                ref="xTree"
                resizable
                :data="tabledata"
                border
                height="100%"
                show-overflow
                :size="'small'"
                :tree-config="{children: 'children',expandAll: true}"
                style="width: 100%"
        >
          <vxe-table-column
            title="序号"
            field="index"
            align="center"
            width="50">
          </vxe-table-column>
          <vxe-table-column
            field="kmlb"
            title="科目类别"
            header-align="center"
            :formatter="formatterkmlb"
            width="80"
            show-overflow-tooltip
          ></vxe-table-column>
          <vxe-table-column
            field="kmbm"
            title="科目编码"
            header-align="center"
            width="130"
            show-overflow-tooltip
            tree-node
          ></vxe-table-column>
          <vxe-table-column
            title="科目名称"
            header-align="center"
            width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
<!--              <span v-html="getKmmc(scope.row)"></span>-->
              <el-link type="primary"  @click.stop.prevent="linkKmmx(scope.row)">
                {{scope.row.kmmc}}
              </el-link>
            </template>
          </vxe-table-column>
            <vxe-table-column title="期初余额"   header-align="center">
                <vxe-table-column
                        field="ybqcjf"
                        title="借方(原币)"
                        header-align="center"
                        align="right"
                        width="100"
                        show-overflow-tooltip
                        :formatter="repformny"
                ></vxe-table-column>
                <vxe-table-column
                        field="qcjf"
                        title="借方(本位币)"
                        header-align="center"
                        align="right"
                        width="100"
                        show-overflow-tooltip
                        :formatter="repformny"
                ></vxe-table-column>
              <vxe-table-column
                field="ybqcdf"
                title="贷方(原币)"
                header-align="center"
                align="right"
                width="100"
                show-overflow-tooltip
                :formatter="repformny"
              ></vxe-table-column>
              <vxe-table-column
                field="qcdf"
                title="贷方(本位币)"
                header-align="center"
                align="right"
                width="100"
                show-overflow-tooltip
                :formatter="repformny"
              ></vxe-table-column>
            </vxe-table-column>
          <vxe-table-column title="本期发生额"   header-align="center">
            <vxe-table-column
              field="ybfsjf"
              title="借方(原币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="fsjf"
              title="借方(本位币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="ybfsdf"
              title="贷方(原币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="fsdf"
              title="贷方(本位币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="本年累计发生额"   header-align="center">
            <template #header>
              本年累计发生额
              <el-tooltip v-if="showToolTip">
                <div
                  slot="content"
                  style="width: 200px">
                  勾选"有余额无发生不显示"或"无余额无发生不显示"可能会导致非查询期间数据不纳入本年累计统计范围.
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </template>
            <vxe-table-column
              field="ybjftotal"
              title="借方(原币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="jftotal"
              title="借方(本位币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="ybdftotal"
              title="贷方(原币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="dftotal"
              title="贷方(本位币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="期末余额"   header-align="center">
            <vxe-table-column
              field="ybqmjf"
              title="借方(原币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="qmjf"
              title="借方(本位币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="ybqmdf"
              title="贷方(原币)"
              header-align="center"
              align="right"
              width="100"
              :formatter="repformny"
            ></vxe-table-column>
            <vxe-table-column
              field="qmdf"
              title="贷方(本位币)"
              header-align="center"
              align="right"
              width="100"
              show-overflow-tooltip
              :formatter="repformny"
            ></vxe-table-column>
          </vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>
export default {
  name: 'table_wb',
  props: {
    tabledata: {
      type: Array
    },
    queryParam: {
      type: Object
    }
  },
  data () {
    return {
      expandkeys: ['kmbm']
    }
  },
  computed: {
    showToolTip () {
      if (this.tabledata && this.tabledata.length > 0) {
        let jftotal = this.tabledata[this.tabledata.length - 1].jftotal
        let dftotal = this.tabledata[this.tabledata.length - 1].dftotal
        if (jftotal === dftotal) {
          return false
        } else {
          return true
        }
      }
      return false
    }
  },
  watch: {
    tabledata: function (val) {
      if (val !== null && val.length > 0) {
        let $tree = this.$refs.xTree
        setTimeout(function () {
          $tree.setAllTreeExpansion(true)
        }, 100)
      }
    }
  },
  methods: {
    // 科目名称格式化
    getKmmc (row) {
      let sb = ''
      let pk_km = row.pk_km
      let level = row.alevel
      let str = row.kmmc
      if (pk_km !== null && pk_km.length > 24) {
        level = level + 1
      }
      for (let i = 1; i < level; i++) {
        sb = sb + '&nbsp;&nbsp;&nbsp;&nbsp;'
      }
      if (str) {
        return sb
      } else {
        return ''
      }
    },
    linkKmmx (row) {
      if (!this.$hasPermission('kmmx-report')) {
        return
      }
      this.$router.push({
        name: 'kmmx-report',
        params: {
          routerParam: {
            id: 'fsyeb',
            kmbm: row.kmbm,
            pk_km: row.pk_km,
            queryParam: this.queryParam
          }
        }
      })
    },
    repformny ({cellValue}) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    getTableData () {
    },
    formatterkmlb (row, column, cellValue) {
      let x
      switch (parseInt(cellValue)) {
        case 0:
          x = '资产'
          break
        case 1:
          x = '负债'
          break
        case 2:
          x = '共同'
          break
        case 3:
          x = '所有者权益'
          break
        case 4:
          x = '成本'
          break
        case 5:
          x = '损益'
          break
        default:
          x = '合计:'
          break
      }
      return x
    }
  }
}
</script>

<style scoped>
</style>
