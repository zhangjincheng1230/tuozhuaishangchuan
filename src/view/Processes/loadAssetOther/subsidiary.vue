<!-- 资产明细账 -->
<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"
  >
    <header style="position: relative;width: 100%">
      <el-form
        :inline="true"
        @submit.native.prevent
        class="form-inline"
        label-width="100px"
        style="height:45px;padding-top: 12px;"
      >
        <el-form-item
          v-if="IsShowDate"
          label="期间:"
          size="small"
          label-width="50px"
          style="float: left; margin-left:14px; "
        >
          <el-input
            placeholder="请选择日期"
            v-popover:popover
            suffix-icon="el-icon-arrow-down"
            v-model="tabdate"
          ></el-input>
        </el-form-item>
        <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
          <h4>资产明细账查询</h4>
          <div
            style="width: 96%; height: 50px; margin: 0 auto; border-bottom:1px dashed #ccc; line-height:45px; display:flex;justify-content: space-between"
          >
            <span style="margin-left:14px;">日期：</span>
            <div
              class="block"
              style="width:72%; margin-right:15px; display:flex;justify-content: space-between"
            >
              <el-date-picker v-model="datevalue" type="date" placeholder="选择日期" style="width:48%;"></el-date-picker>
              <el-date-picker
                v-model="datevalueon"
                type="date"
                placeholder="选择日期"
                style="width:48%; margin-left:24px"
              ></el-date-picker>
            </div>
          </div>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">公司：</span>
            <el-select
              v-model="valueda"
              filterable
              placeholder="请选择公司"
              style="width:72%; margin-right:15px;"
            >
              <el-option
                v-for="item in optionsvals"
                :key="item.pk_gs"
                :label="item.uname"
                :value="item.pk_gs"
              ></el-option>
            </el-select>
          </div>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">资产名称：</span>
            <el-input
              v-model="zichanname"
              placeholder="请输入内容"
              style="width:72%; margin-right:15px;"
            ></el-input>
          </div>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">资产类别：</span>
            <div class="demo-input-suffix" style="width:72%; margin-right:15px;">
              <el-input placeholder="请选择类别" suffix-icon="el-icon-search"
                        v-model="assetsTypeval" @click.native="addTabl"></el-input>
            </div>
          </div>
          <AssetsType ref="assetsTypeSelect" @findinde="asettab"></AssetsType>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">资产属性：</span>
            <el-select v-model="zcsx" placeholder="请选择" style="width:72%; margin-right:15px;">
              <el-option
                v-for="item in optionsvalue"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="text-align: right;margin-top: 12px">
            <el-button size="small" type="primary" @click="query(zichanname)">确定</el-button>
            <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
          </div>
        </el-popover>

        <el-form-item label="公司:" size="small" label-width="50px" style="float: left">
          <span>{{unam.uname===undefined?valcop:unam.uname}}</span>
        </el-form-item>
        <el-row style="float:right;margin-right:14px" size="small">
          <el-button @click="print">打印</el-button>
        </el-row>
      </el-form>
    </header>

    <div class="contents">
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
        <el-table-column prop="rq" label="日期" width="110" align="center" sortable></el-table-column>
        <el-table-column prop="zcbh" align="center" label="资产编码" width="110" sortable></el-table-column>
        <el-table-column
          prop="zcmc"
          align="center"
          label="资产名称"
          width="110"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="zclb"
          align="center"
          label="资产类别"
          width="110"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="zcsx"
          align="center"
          label="资产属性"
          width="110"
          sortable
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="pzzh" align="center" label="凭证号" width="110" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="zy"
          label="摘要"
          align="center"
          width="110"
          sortable
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="固定资产" align="center">
          <el-table-column prop="yzjf" align="right"  header-align="center" label="借方" width="120"  :formatter="repformny"></el-table-column>
          <el-table-column prop="yzdf" label="贷方" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
          <el-table-column prop="yzye" label="余额" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
        </el-table-column>

        <el-table-column label="累计折旧" align="center">
          <el-table-column prop="ljjf" align="right"  header-align="center" label="借方" width="120"  :formatter="repformny"></el-table-column>
          <el-table-column prop="ljdf" label="贷方" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
          <el-table-column prop="ljye" label="余额" align="right"  header-align="center" width="120"  :formatter="repformny"></el-table-column>
        </el-table-column>
        <el-table-column prop="jzye" label="净值余额" align="right"  header-align="center" width="100" :formatter="repformny"></el-table-column>
      </el-table>
    </div>
    <printForm v-if="isShowPrint"></printForm>
  </div>
</template>

<script>
import Header from '../components/Header'
import CorpDialog from '@/components/reference/CorpDialog'
import AssetsType from '../components/AssetsTypeSelect'
import printForm from '../components/printForm'
import {ASSET_PROP} from '@/constants/asset'
import { getExportColumns, formatDate, getMonthEnd } from '@/utils'
export default {
  name: 'zcmxz',
  components: {
    Header,
    CorpDialog,
    AssetsType,
    printForm
  },
  data () {
    return {
      isShowPrint: false,
      datevalue: this.$store.getters.currentCorp.bdate,
      datevalueon: getMonthEnd(this.$store.getters.currentCorp.accountProgressDate),
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
      zichanname: '',
      lists: [],
      tableData: [],
      openAssetsType: false,
      assetsTypeval: '',
      Lbprop: {},
      tabdat: '',
      optionsvals: this.$store.getters.corps,
      valueda: this.$store.getters.currentCorp.pk_gs,
      loading: false,
      tabdate: this.$store.getters.currentCorp.bdate + '--' + this.$store.getters.currentCorp.accountProgressDate,
      zcsx: null // 资产属性
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
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    query (zichanname) {
      this.loading = true
      this.visiblePopover = false
      this.$api.linkAssets.subsidiaryfortune({
        begindate: formatDate(this.datevalue), // 开始时间
        enddate: formatDate(this.datevalueon), // 结束时间
        corpIds: this.valueda, // 公司主键
        pk_assetcategory: this.Lbprop.id, // 资产属性
        zcsx: this.zcsx, // 资产类别主键
        asname: zichanname// 资产名称
      }).then(res => {
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
      this.tabdate = formatDate(this.datevalue) + '--' + formatDate(this.datevalueon)
      this.unam = this.optionsvals.find(item => {
        return item.pk_gs === this.valueda
      }) || {}
    },
    // 资产类别确认
    asettab (val) {
      this.Lbprop = val
    },
    print: function () {
      this.isShowPrint = true
    },
    printTableList: function (data) {
      let param = {
        type: data.printInfo.type,
        pageOrt: data.printInfo.pageOrt,
        period: formatDate(data.printInfo.printdate),
        left: data.printInfo.left,
        top: data.printInfo.top,
        font: data.printInfo.font,
        printdate: formatDate(data.printInfo.printdate),
        corpName: this.$store.getters.currentCorp.uname,
        list: JSON.stringify(this.tableData)
      }
      this.$api.linkAssets.subsidiaryfortunepdf('资产明细账', param)
    }

  },
  created () {
    // this.gettabs()
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
    this.$bus.$off('printinfo')
    this.$bus.$on('printinfo', (data) => {
      this.isShowPrint = data.printForm
      if (data.printInfo !== undefined) {
        this.printTableList(data)
      }
    })
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
