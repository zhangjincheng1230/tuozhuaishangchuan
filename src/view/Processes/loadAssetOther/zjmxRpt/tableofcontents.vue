<!--折旧明细账-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">日期：
            <el-popover
              placement="bottom-start"
              title="折旧明细帐查询"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="日  期:">
                  <el-date-picker
                    v-model="queryForm.date"
                    type="monthrange"
                    unlink-panels
                    range-separator="至"
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="公  司:">
                  <el-select  v-model="queryForm.corpobj"  filterable style="width:315px" value-key="pk_gs">
                    <el-option v-for="item in corpIds"
                               :key="item.pk_gs"
                               :value="item"
                               :label="item.uname"
                               style = "width:315px">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="资产编码:" size="mini">
                  <el-input placeholder v-model="queryForm.zccode" style="width: 315px"></el-input>
                </el-form-item>
                <el-form-item label="资产类别:" size="mini">
                  <el-input  placeholder
                             clearable
                             suffix-icon="el-icon-search"
                             v-model="queryForm.assetsType" @click.native="selectAssetsType"
                             style="width: 315px"
                  ></el-input>
                  <AssetsTypeSelect ref="assetsTypeSelect" @findinde="confirmZclb"></AssetsTypeSelect>
                </el-form-item>
                <el-form-item label="资产属性:"  size="mini">
                  <el-select v-model="queryForm.zcsx" placeholder style="width: 315px">
                    <el-option
                      v-for="item in assetsProp"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small" @click="cancel" >取消</el-button>
                  <el-button size="small" type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{qrydate}}
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{queryForm.corpobj.uname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="refreshTableList">刷新</el-button>
          <el-button @click="linkPz">联查凭证</el-button>
          <el-button @click="print">打印</el-button>
          <el-button @click="exportTableList">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          highlight-current-row
          id="table_list"
          :data="tableList"
          ref="tableCorpRef"
          @current-change="handleCurrentChange"
          border
          stripe
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :height="height"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" header-align="center" align="left" width="50"></el-table-column>
          <el-table-column prop="catename" label="类别" width="120" show-overflow-tooltip
                           header-align="center" align="left" ></el-table-column>
          <el-table-column prop="assetproperty" label="类型属性" width="100" show-overflow-tooltip
                           header-align="center" align="left" :formatter="formatzcsx"></el-table-column>
          <el-table-column prop="assetcode" label="资产编码" width="110" sortable
                           header-align="center" align="left">
            <template slot-scope="scope" v-if="scope.row.assetcode != null && scope.row.assetcode.length > 0">
              <el-link  type="primary"  @click.stop.prevent="linkZcByid(scope.row.pk_assetcard)">{{scope.row.assetcode}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="assetname" :show-overflow-tooltip="true" label="资产名称" width="160"
                           header-align="center" align="left" ></el-table-column>
          <el-table-column prop="accountdate" label="入账日期" width="100"
                           header-align="center" align="left"></el-table-column>
          <el-table-column prop="uselimit" label="预计使用年限" width="110" header-align="center" align="right">
          </el-table-column>
          <el-table-column prop="salvageratio" label="净残值率(%)" width="100"
                           header-align="center" align="left"></el-table-column>
          <el-table-column prop="doperatedate" label="折旧日期" width="100"
                           header-align="center" align="left"></el-table-column>
          <el-table-column prop="assetmny" label="资产原值" width="100" align="right"  header-align="center"  :formatter="repformny">
          </el-table-column>
          <el-table-column prop="originalvalue" label="本期折旧" width="100" align="right"  header-align="center" :formatter="repformny">
          </el-table-column>
          <el-table-column prop="depreciationmny" label="累计折旧" width="100" align="right"  header-align="center" :formatter="repformny" >
          </el-table-column>
          <el-table-column prop="assetnetmny" label="期末净值" width="100"  align="right"  header-align="center"></el-table-column>
          <el-table-column prop="istogl" label="转总账" width="70" align="center"></el-table-column>
          <el-table-column prop="pzh" label="凭证号" width="80" header-align="center" align="left">
            <template slot-scope="scope" v-if="scope.row.pzh != null && scope.row.pzh.length > 0">
              记<el-link  type="primary"  @click.stop.prevent="linkpzByid(scope.row.id_voucher)">{{scope.row.pzh}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="已结账" width="70" align="center">
            <template slot-scope="scope">
              {{scope.row.status == '' ? '否' : '是'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <!--打印对话框-->
    <print-dialog ref="printdialog" :enddate ="queryForm.enddate" :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import Header from '../../components/Header'
import AssetsTypeSelect from '../../components/AssetsTypeSelect'
import {getMonthEnd, formatDate, getMonthBegin} from '@/utils'
import {ASSET_PROP} from '@/constants/asset'
import assetMixin from '@/filters/asset'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  mixins: [assetMixin, datePickerMixin],
  name: 'zjmxz',
  components: {
    Header,
    AssetsTypeSelect,
    PrintDialog
  },
  props: {
    // 联查传递的数据
    linkdata: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      nodename: '折旧明细账',
      visiblePopover: false,
      loading: false,
      tableList: [],
      height: 0,
      corpIds: this.$store.getters.corps,
      assetsProp: ASSET_PROP,
      list: [],
      message: '',
      currentRow: '', // table选中行
      qrydate: '',
      queryForm: {
        date: [this.$store.getters.getLoginDate.substring(0, 7), this.$store.getters.getLoginDate.substring(0, 7)],
        corpobj: this.$store.getters.currentCorp,
        begindate: getMonthBegin(this.$store.getters.getLoginDate.substring(0, 7)),
        enddate: getMonthEnd(this.$store.getters.getLoginDate.substring(0, 7)),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        assetsType: '', // 资产类别名称
        pk_assetcategory: '', // 资产类别id
        zccode: '', // 资产编码
        zcsx: 0 // 资产属性
      }
    }
  },
  watch: {
    'queryForm.corpobj': function (val, oldvalue) {
      this.queryForm.corpIds = val.pk_gs
    },
    'queryForm.date': function (val, oldvalue) {
      this.queryForm.begindate = getMonthBegin(this.queryForm.date[0])
      this.queryForm.enddate = getMonthEnd(this.queryForm.date[1])
    },
    linkdata: {
      handler (data) {
        if (data) {
          this.loadtableList(1, data)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 行选择
    handleCurrentChange: function (val) {
      this.currentRow = val
    },
    // 清除资产类别
    clearzclb () {
      this.queryForm.assetsType = ''
      this.queryForm.pk_assetcategory = ''
    },
    // 选中资产类别
    confirmZclb (val) {
      console.log(val)
      this.queryForm.assetsType = val.name
      this.queryForm.pk_assetcategory = val.id
    },
    formatzcsx (row, column, cellValue) {
      return this.getZcsxName(cellValue)
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    selectAssetsType: function (e) {
      if (e.target.className.indexOf('el-input__clear') === -1) {
        this.$refs.assetsTypeSelect.show()
      } else {
        this.clearzclb()
      }
    },
    query: function () {
      this.loadtableList(1)
      this.visiblePopover = false
    },
    // 联查资产
    linkZcByid (id_assetcard) {
      if (!id_assetcard) {
        this.$message({showClose: true, message: '资产不存在！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'zckp',
        params: {
          zcid: id_assetcard
        }
      })
    },
    // 联查凭证
    linkPz: function () {
      if (!this.currentRow) {
        this.$message({showClose: true, message: '请先选择数据！', type: 'warning'})
        return
      }
      this.linkpzByid(this.currentRow.id_voucher)
    },
    // 联查凭证
    linkpzByid (id_voucher) {
      if (!id_voucher) {
        this.$message({showClose: true, message: '无凭证！', type: 'warning'})
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: id_voucher
        }
      })
    },
    cancel: function () {
      this.visiblePopover = false
    },
    print: function () {
      if (this.tableList.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        data: JSON.stringify(this.tableList),
        corpName: this.queryForm.corpobj.uname,
        period: this.qrydate
      }
      this.$api.tableOfContents.printData(this.nodename, Object.assign({}, val, otherprintparam))
    },
    exportTableList: function () {
      if (this.tableList.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      let param = {
        strlist: JSON.stringify(this.tableList),
        corpName: this.queryForm.corpobj.uname,
        qj: this.qrydate
      }
      this.$api.tableOfContents.exportData(this.nodename + this.qrydate, param)
    },
    refreshTableList: function () {
      this.addpose()
    },
    loadtableList: function (val, queryParam) {
      this.loading = true
      this.qrydate = this.queryForm.date[0] + '-' + this.queryForm.date[1]
      this.$api.tableOfContents.queryTableList((queryParam != null ? queryParam : this.queryForm)).then(result => {
        this.loading = false
        if (result.success && (result.data !== undefined || result.rows !== undefined)) {
          this.tableList = result.rows
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          message: data.msg, // this.message !== '' ? this.message + '成功' : '查询成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: data.msg,
          type: 'error'
        })
      }
    }
  },
  created () {
    this.height = window.innerHeight - 175
  },
  mounted () {
    this.loadtableList(1)
  }
}
</script>

<style lang="less">
</style>
