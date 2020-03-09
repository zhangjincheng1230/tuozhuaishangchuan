<template>
  <div
    style="position:relative;border:1px #ddd solid;background:rgba(255,255,255,1);"
    class="tableOf"
  >
    <el-container>
      <Header>
        <el-row slot="HeadRight">
          <el-button @click="refreshTableList">刷新</el-button>
          <el-button>联查凭证</el-button>
          <el-button @click="printTableList">打印</el-button>
          <el-button @click="exportTableList">导出</el-button>
        </el-row>
        <el-container slot="SelectCondition">
          <el-main style="padding: 0">
            <el-form-item>
              <h4>折旧明细帐查询</h4>
            </el-form-item>
            <el-form-item
              label="日  期:"
              label-width="75"
              size="mini"
              style="border-bottom: 1px dashed #dadada;padding-bottom: 5px;padding-left: 23px;"
            >
              <el-date-picker
                v-model="date"
                type="monthrange"
                unlink-panels
                range-separator="至"
                value-format="yyyy-MM"
                style="width: 315px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="公  司:" label-width="75" size="mini" style="padding-left: 23px">
              <el-select v-model="corpobj" style="width:315px" value-key="pk_gs">
                <el-option v-for="item in corpIds"
                           :key="item.pk_gs"
                           :value="item"
                           :label="item.uname"
                           style = "width:315px">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资产编码:" label-width="75" size="mini">
              <el-input placeholder v-model="assetsCode" style="width: 315px"></el-input>
            </el-form-item>
            <el-form-item label="资产类别:" label-width="75" size="mini">
              <el-input
                id="zclb"
                placeholder
                suffix-icon="el-icon-search"
                readonly
                v-model="assetsType"
                @focus="selectAssetsType"
                style="width: 315px"
              ></el-input>
              <AssetsTypeSelect v-if="openAssetsType"></AssetsTypeSelect>
            </el-form-item>
            <el-form-item label="资产属性:" label-width="75" size="mini">
              <el-select v-model="assetsPrperty" placeholder style="width: 315px">
                <el-option
                  v-for="item in assetsDate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div style="text-align: right;margin-top: 12px">
              <el-button size="small" type="primary" @click="addpose">确定</el-button>
              <el-button size="small" type="primary" @click="getDateToReturn" plain>取消</el-button>
            </div>
          </el-main>
        </el-container>
      </Header>
    </el-container>
    <el-container>
      <el-main>
        <el-table
          id="table_list"
          :data="tableList"
          :header-cell-style="headerCellStyle"
          ref="tableCorpRef"
          stripe
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          :height="height"
          style="width: 100%"
        >
          <el-table-column type="index" align="center" label width="50"></el-table-column>
          <el-table-column prop="catename" label="类别" width="120" align="center"></el-table-column>
          <el-table-column prop="assetproperty" label="类型属性" width="100" align="center"></el-table-column>
          <el-table-column prop="assetcode" label="资产编码" width="110" sortable align="center"></el-table-column>
          <el-table-column prop="assetname" :show-overflow-tooltip="true" label="资产名称" width="160" align="center"></el-table-column>
          <el-table-column prop="accountdate" label="入账日期" width="100" align="center"></el-table-column>
          <el-table-column label="预计使用年限" width="110" align="center">
            <template slot-scope="scope">{{scope.row.uselimit !== undefined ? (parseInt(scope.row.uselimit) / 12) : ''}}</template>
          </el-table-column>
          <el-table-column prop="salvageratio  " label="净残值率(%)" width="100" align="center"></el-table-column>
          <el-table-column prop="doperatedate" label="折旧日期" width="100" align="center"></el-table-column>
          <el-table-column label="资产原值" width="100" align="right">
            <template slot-scope="scope">{{scope.row.assetmny !== undefined ? parseInt(scope.row.assetmny).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="本期折旧" width="100" align="right">
            <template slot-scope="scope">{{scope.row.originalvalue !== undefined ? parseInt(scope.row.originalvalue).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="累计折旧" width="100" align="right">
            <template slot-scope="scope">{{scope.row.depreciationmny !== undefined ? parseInt(scope.row.depreciationmny).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column prop="" label="期末净值" width="100" align="center">
<!--            <template slot-scope="scope">{{scope.row.zcje.toFixed(2)}}</template>-->
          </el-table-column>
          <el-table-column prop="istogl" label="转总账" width="70" align="center"></el-table-column>
          <el-table-column prop="pzh" label="凭证号" width="80" align="center"></el-table-column>
          <el-table-column prop="status" label="已结账" width="70" align="center">
            <template slot-scope="scope">
              {{scope.row.status == '' ? '否' : '是'}}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <printForm :isShowType="{isShowPrintType}" v-if="isShowPrint"></printForm>
  </div>
</template>

<script>
import Header from '../components/Header'
import printForm from '../components/printForm'
import AssetsTypeSelect from '../components/AssetsTypeSelect'
import { getMonthEnd } from '@/utils'
export default {
  name: 'zjmxz',
  components: {
    Header,
    printForm,
    AssetsTypeSelect
  },
  data () {
    return {
      isShowPrint: false,
      isShowPrintType: true,
      loading: false,
      tableList: [],
      height: 0,
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      date: [this.$store.getters.getLoginDate.substring(0, 7), this.$store.getters.getLoginDate.substring(0, 7)],
      pk_assets: '',
      corpobj: this.$store.getters.currentCorp,
      corpIds: this.$store.getters.corps,
      pk_gs: '',
      assetsCode: '',
      assetsType: '',
      assetsPrperty: '0',
      assetsDate: [{
        value: '0',
        label: '固定资产'
      }, {
        value: '1',
        label: '无形资产'
      }, {
        value: '2',
        label: '待摊费用'
      }],
      logins: 1,
      openAssetsType: false,
      list: [],
      message: ''
    }
  },
  methods: {
    selectAssetsType: function () {
      this.openAssetsType = true
    },
    addpose: function () {
      this.loadtableList(1)
      this.getDateToReturn()
    },
    getDateToReturn: function () {
      let retParam = {
        times: this.date !== '' ? this.date[0] + '~' + this.date[1] : '',
        visiblePopover: false
      }
      this.$bus.$emit('date', retParam)
    },
    printTableList: function () {
      if (this.tableList.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      this.isShowPrint = true
    },
    print: function (data) {
      let param = {
        type: data.printInfo.type,
        pageOrt: data.printInfo.pageOrt,
        left: data.printInfo.left,
        top: data.printInfo.top,
        font: data.printInfo.font,
        xjtotal: data.printInfo.xjtotal,
        lb: data.printInfo.lb,
        hjtotal: data.printInfo.hjtotal,
        zcbm: data.printInfo.zcbm,
        zjrq: data.printInfo.zjrq,
        zjnx: data.printInfo.zjnx,
        isPaging: data.printInfo.isPaging,
        printdate: this.formatDate(data.printInfo.printdate),
        corpName: this.$store.getters.currentCorp.uname,
        period: this.date !== '' ? this.date[0] + '~' + this.date[1] : '',
        data: JSON.stringify(this.tableList)
      }
      this.$api.tableOfContents.printData('折旧明细账', param)
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
        corpName: this.$store.getters.currentCorp.uname,
        qj: this.date !== '' ? this.date[0] + '~' + this.date[1] : ''
      }
      this.$api.tableOfContents.exportData('折旧明细账', param)
    },
    refreshTableList: function () {
      this.addpose()
    },
    loadtableList: function (val) {
      let param = {
        begindate: this.date[0] + '-01',
        enddate: this.date[1] + '-30',
        corpIds: this.corpobj.pk_gs,
        pk_assetcategory: this.pk_assets,
        zccode: this.assetsCode.toString(),
        zcsx: this.assetsPrperty.toString()
      }
      this.loading = true
      this.$api.tableOfContents.queryTableList(param).then(result => {
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
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    formatDate: function (date) {
      date.setTime(date.getTime())
      return date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1) + '-' + this.checkTime(date.getDate())
    }
  },
  created () {
    this.$bus.$off('openAssetsType')
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
    })
    this.$bus.$off('assetsType')
    this.$bus.$on('assetsType', (assetsType) => {
      this.assetsType = assetsType.text
      this.pk_assets = assetsType.id
    })
    this.height = window.innerHeight - 175
  },
  mounted () {
    this.getDateToReturn()
    this.loadtableList()
    this.$bus.$off('printinfo')
    this.$bus.$on('printinfo', (data) => {
      this.isShowPrint = data.printForm
      if (data.printInfo !== undefined) {
        this.print(data)
      }
    })
  }
}
</script>

<style lang="less">
.tableOf {
  .el-main {
    padding: 0;
  }
  .hMargin .el-form-item__label {
    margin-left: 23px;
  }
  /deep/ #zclb{
    cursor:pointer;
  }
}
</style>
