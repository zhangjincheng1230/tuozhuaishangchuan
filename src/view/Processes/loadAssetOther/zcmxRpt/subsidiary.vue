<!-- 资产明细账 -->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">日期：
            <el-popover
              placement="bottom-start"
              title="资产明细账查询"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="日期：">
                  <el-date-picker
                    v-model="queryForm.periodRange"
                    type="daterange"
                    unlink-panels
                    range-separator="-"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select filterable
                             v-model="queryForm.corpIds"
                             style="width: 315px">
                    <el-option
                      v-for="item in optionsvals"
                      :key="item.pk_gs"
                      :label="item.uname"
                      :value="item.pk_gs"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="资产名称：">
                  <el-input
                    v-model="queryForm.asname"
                    placeholder="请输入内容"
                    style="width: 315px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="资产类别：">
                  <el-input placeholder="请选择类别" suffix-icon="el-icon-search"
                            v-model="assetsTypeval" @click.native="addTabl"  style="width: 315px"></el-input>
                </el-form-item>
                <AssetsType ref="assetsTypeSelect" @findinde="asettab"></AssetsType>
                <el-form-item label="资产属性：">
                  <el-select v-model="queryForm.zcsx" placeholder="请选择"  style="width: 315px">
                    <el-option
                      v-for="item in optionsvalue"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small"   @click="clearPose" >取消</el-button>
                  <el-button size="small" type="primary" @click="query()">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{tabdate}}
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{unam.uname===undefined?valcop:unam.uname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button @click="print">打印</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-table
          :data="tableData"
          style="width: 100%;height:100%"
          height="100%"
          border
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :default-sort="{prop: 'date', order: 'descending'}"
        >
          <el-table-column prop="rq" label="日期" width="110" header-align="center"
                           align="left" sortable></el-table-column>
          <el-table-column prop="zcbh" header-align="center"
                           align="left" label="资产编码" width="110" sortable>
            <template slot-scope="scope" v-if="scope.row.zcbh != null && scope.row.zcbh.length > 0">
              <el-link  type="primary"  @click.stop.prevent="linkZcByid(scope.row.id_assetcard)">{{scope.row.zcbh}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="zcmc"
            label="资产名称"
            width="110"
            sortable
            show-overflow-tooltip
            header-align="center"
            align="left"
          ></el-table-column>
          <el-table-column
            prop="zclb"
            header-align="center"
            align="left"
            label="资产类别"
            width="110"
            sortable
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="zcsx"
            header-align="center"
            align="left"
            label="资产属性"
            width="110"
            sortable
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="pzzh"
            header-align="center"
            align="left"
            label="凭证号"
            width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope" v-if="scope.row.pzzh != null && scope.row.pzzh.length > 0">
              记<el-link  type="primary"  @click.stop.prevent="linkpzByid(scope.row.pzpk)">{{scope.row.pzzh}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="zy"
            label="摘要"
            header-align="center"
            align="left"
            width="110"
            sortable
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column :label="title1" align="center">
            <el-table-column prop="yzjf" align="right"  header-align="center" label="借方" width="120"  :formatter="repformny"></el-table-column>
            <el-table-column prop="yzdf" label="贷方" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
            <el-table-column prop="yzye" label="余额" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
          </el-table-column>

          <el-table-column :label="title2" align="center">
            <el-table-column prop="ljjf" align="right"  header-align="center" label="借方" width="120"  :formatter="repformny"></el-table-column>
            <el-table-column prop="ljdf" label="贷方" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
            <el-table-column prop="ljye" label="余额" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
          </el-table-column>
          <el-table-column prop="jzye" label="净值余额" align="right"  header-align="center" width="100" :formatter="repformny"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top/>
    </el-tooltip>
    <!--打印对话框-->
    <print-dialog ref="printdialog" :enddate ="queryForm.enddate"
                  :bshowDir="false"
                  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import BackToTop from '@/components/BackToTop/index'
import AssetsType from '../../components/AssetsTypeSelect'
import {ASSET_PROP} from '@/constants/asset'
import { getExportColumns, formatDate, getMonthBegin, getMonthEnd } from '@/utils'
import PrintDialog from '@/components/Report/PrintDialog'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'zcmxz',
  mixins: [datePickerMixin],
  components: {
    CorpDialog,
    AssetsType,
    BackToTop,
    PrintDialog
  },
  data () {
    return {
      nodename: '资产明细账',
      queryForm: {
        periodRange: [getMonthBegin(this.$store.getters.getLoginDate.substring(0, 7)), getMonthEnd(this.$store.getters.getLoginDate.substring(0, 7))],
        begindate: getMonthBegin(this.$store.getters.getLoginDate.substring(0, 7)),
        enddate: getMonthEnd(this.$store.getters.getLoginDate.substring(0, 7)),
        corpIds: this.$store.getters.currentCorp.pk_gs,
        pk_assetcategory: '', // 资产属性
        zcsx: 0, // 资产属性
        asname: '' // 资产名称
      },
      optionsVal: '',
      visiblePopover: false,
      unam: {},
      IsShowDate: true,
      valcop: this.$store.getters.currentCorp.uname,
      options: [{
        value: '选项1',
        label: '2017'
      }, {
        value: '选项2',
        label: '2018'
      }, {
        value: '选项3',
        label: '2019'
      }],
      optionsvalue: ASSET_PROP,
      value: '',
      dialogVisible: false,
      logins: 1,

      lists: [],
      tableData: [],
      openAssetsType: false,
      assetsTypeval: '',
      Lbprop: {},
      tabdat: '',
      optionsvals: this.$store.getters.corps,
      loading: false,
      tabdate: this.$store.getters.currentCorp.bdate + '-' + this.$store.getters.currentCorp.accountProgressDate,
      title1: '固定资产',
      title2: '累计折旧'
    }
  },
  methods: {
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    formatter (row, column) {
      return row.address
    },
    holdtime () {
      this.getList()
    },
    // 显示资产类别
    addTabl () {
      this.$refs.assetsTypeSelect.show()
    },
    Xcompe () {
      this.dialogVisible = true
    },
    clearPose: function () {
      this.visiblePopover = false
    },
    query () {
      this.loading = true
      this.visiblePopover = false
      this.queryForm.begindate = this.queryForm.periodRange[0]
      this.queryForm.enddate = this.queryForm.periodRange[1]
      // 根据属性判断
      if (this.queryForm.zcsx === 0 || this.queryForm.zcsx === 2) {
        this.title1 = '固定资产'
        this.title2 = '累计折旧'
      } else if (this.queryForm.zcsx === 1) {
        this.title1 = '无形资产'
        this.title2 = '累计摊销'
      } else if (this.queryForm.zcsx === 3) {
        this.title1 = '待摊费用'
        this.title2 = '累计摊销'
      }
      this.$api.zcmxReport.query(this.queryForm).then(res => {
        this.loading = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.tableData = res.rows
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
      this.visiblePopover = false
      this.tabdate = formatDate(this.queryForm.begindate) + '-' + formatDate(this.queryForm.enddate)
      this.unam = this.optionsvals.find(item => {
        return item.pk_gs === this.queryForm.corpIds
      }) || {}
    },
    // 资产类别确认
    asettab (val) {
      this.Lbprop = val
      this.queryForm.pk_assetcategory = val.id // 资产属性
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
    print: function () {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message({showClose: true, message: '当前界面数据为空！', type: 'warning'})
        return
      }
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      const otherprintparam = {
        list: JSON.stringify(this.tableData),
        corpName: this.unam.uname,
        period: this.tabdate
      }
      this.$api.zcmxReport.printPdf(this.nodename, Object.assign({}, val, otherprintparam))
    }
  },
  created () {
    this.query()
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
    })
    this.height = window.innerHeight - 175
    this.$bus.$on('assetsType', (data) => {
      this.assetsTypeval = data.name
    })
  },
  mounted () {
  }

}
</script>

<style scoped lang="less">
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}
.cell {
  text-align: center;
}
.marks {
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0, 0.3);
  position: absolute;
  left: 0;
  top: 0;
}
.content {
  width: 500px;
  height: 450px;
  position: absolute;
  left: 35%;
  top: 25%;
  background: #ffffff;
}
.coontent-top {
  width: 100%;
  height: 55px;
  background: #2462be;
  font-size: 22px;
  line-height: 55px;
  display: flex;
  justify-content: space-between;
}
.coontent-top span:nth-child(1) {
  padding-left: 20px;
  color: #ffffff;
}
.coontent-top span:nth-child(2) {
  padding-right: 20px;
}
.jumpmark {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.heade {
  width: 100%;
  height: 45px;
}
.dataList {
  width: 100%;
  flex: 1;
}
.dataListon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
}
.dataList span {
  height: 45px;
  white-space: nowrap;
  overflow: hidden;
  line-height: 45px;

  /* */
}
.dataListon span:nth-child(1) {
  width: 20px;
}
.dataListon span:nth-child(2) {
  width: 100px;
}
.dataListon span:nth-child(3) {
  width: 180px;
}
.dataListon span:nth-child(4) {
  width: 80px;
}
/* .dataList:hover{
         background:cadetblue;
      }  */
.active {
  width: 100%;
  height: 45px;
  background: cadetblue;
  display: flex;
  justify-content: space-around;
  white-space: nowrap;
  overflow: hidden;
}
/deep/.el-input__inner {
  cursor: pointer;
}
</style>
