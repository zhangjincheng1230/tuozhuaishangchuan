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
            v-model="datevalue"
          ></el-input>
        </el-form-item>
        <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
          <h4>折旧汇总表查询</h4>
          <div
            style="width: 96%; height: 50px; margin: 0 auto; border-bottom:1px dashed #ccc; line-height:45px;display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">日期：</span>
            <el-date-picker
              v-model="datevalues"
              type="month"
              placeholder="选择月"
              style="width:72%; margin-right:15px;"
            ></el-date-picker>
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
                v-for="item in optionsval"
                :key="item.pk_gs"
                :label="item.uname"
                :value="item.pk_gs"
              ></el-option>
            </el-select>
          </div>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">资产属性：</span>
            <el-select v-model="zcsx" clearable placeholder="请选择" style="width:72%; margin-right:15px;">
              <el-option
                v-for="item in optionsvalue"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">资产类别：</span>
            <div
              class="demo-input-suffix"
              style="width:72%; margin-right:15px; cursor: pointer;"
              @click="addTabl"
            >
              <el-input placeholder="请选择类别" suffix-icon="el-icon-search" v-model="assetsTypeval"></el-input>
            </div>
          </div>
          <AssetsType v-if="openAssetsType" @findinde="asettab"></AssetsType>
          <div
            style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
          >
            <span style="margin-left:14px;">类别级次：</span>
            <div style="width:74% ; display:flex; justify-content: space-between">
              <div style="width:48%">
                <el-select
                  v-model="opsitionsdataVal"
                  placeholder="请选择"
                  style="width:90%; margin-right:15px;margin-left:-7px;"
                  @change="levifu"
                >
                  <el-option
                    v-for="item in opsitionsdata"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </div>
              <div style="width:48%">
                <el-select
                  v-model="opsitionsdataVals"
                  placeholder="请选择"
                  style="width:90%; margin-right:15px;text-aling:right"
                  @change="levizu"
                >
                  <el-option
                    v-for="item in opsitionsdata"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div style="text-align: right;margin-top: 12px">
            <el-button size="small" type="primary" @click="addpose">确定</el-button>
            <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
          </div>
        </el-popover>
        <el-form-item label="公司:" size="small" label-width="50px" style="float: left">
          <span>{{unam.uname===undefined?valcop:unam.uname}}</span>
        </el-form-item>
        <el-form-item label="资产属性:" size="small" label-width="100px" style="float: left ">
          <span>{{zcsx | formatZcSx}}</span>
        </el-form-item>
        <el-row style="float:right;margin-right:14px" size="small">
          <el-button @click="holdtime">刷新</el-button>
          <el-button>联查明细</el-button>
          <el-button @click="perfo">打印</el-button>
          <el-button @click="exportTableList">导出</el-button>
        </el-row>
      </el-form>
    </header>

    <div class="contents">
      <el-table
        :data="tableData"
        style="width: 100%;height:100%"
        border
        v-loading="loading"
        element-loading-text="数据处理中，请稍候..."
        element-loading-spinner="el-icon-loading"
        size="small"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column
          prop="assetproperty"
          label="资产属性"
          sortable
          header-align="center"
          align="left"
          width="180"
        >
          <template slot-scope="sope">
            <span>{{sope.row.assetproperty|fomrzjfs}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="catename"
          align="left"
          label="资产类别"
          sortable
          width="240"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="assetmny"
          label="资产原值"
          header-align="center"
          align="right"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="originalvalue"
          label="本期折旧额"
          header-align="center"
          align="right"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="depreciationmny"
          header-align="center"
          align="right"
          label="累计折旧额"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="assetnetmny"
          header-align="center"
          align="right"
          label="资产净值"
          width="180"
        ></el-table-column>
      </el-table>
    </div>
    <printForm v-if="isShowPrint"></printForm>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import AssetsType from '../components/AssetsTypeSelect'
import printForm from '../components/printForm'
import {ASSET_PROP} from '@/constants/asset'
import assetMixin from '@/filters/asset'

export default {
  mixins: [assetMixin],
  name: 'zjhzb',
  components: {
    CorpDialog,
    AssetsType,
    printForm
  },
  data () {
    return {
      datevalue: this.$store.getters.currentCorp.bdate.slice(0, this.$store.getters.currentCorp.bdate.length - 3),
      datevalues: this.$store.getters.currentCorp.bdate.slice(0, this.$store.getters.currentCorp.bdate.length - 3),
      opsitionsdataVal: '',
      opsitionsdataVals: '',
      dialogVisible: false,
      isShowPrint: false,
      visiblePopover: false,
      IsShowDate: true,
      cop: '',
      loading: false,
      tableData: [],
      optionsVal: '全部',
      optionsval: this.$store.getters.corps,
      valcop: this.$store.getters.currentCorp.uname,
      valueda: this.$store.getters.currentCorp.uname,
      // open:false,
      optionsvalue: ASSET_PROP,
      opsitionsdata: [
        {
          value: 1,
          label: '1级'
        }, {
          value: 2,
          label: '2级'
        }, {
          value: 3,
          label: '3级'
        }, {
          value: 4,
          label: '4级'
        }, {
          value: 5,
          label: '5级'
        }],
      value: '',
      openCompe: false,
      input1: '',
      logins: 1,
      lists: [],
      openAssetsType: false,
      assetsTypeval: '',
      Lbprop: 0,
      levelq: {},
      levelz: {},
      unam: {},
      zcsx: null // 资产属性
    }
  },
  methods: {
    formatter (row, column) {
      return row.address
    },
    getdatatab () {
      this.$api.linkAssets.tableofcontents({
        period: this.datevalues === String ? this.datevalues : this.formatDate(this.datevalues), // 查询日期
        corpIds: this.valueda, // 公司主键
        pk_assetcategory: this.Lbprop.id, // 资产属性
        zcsx: this.zcsx // 资产属性
      }).then(res => {
        if (res.success) {
          this.tableData = res.rows
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
          this.tableData = []
        }
      })
    },
    holdtime () {
      this.getdatatab()
    },
    Xcompe () {
      this.dialogVisible = true
    },
    addTabl () {
      this.openAssetsType = true
    },
    addpose () {
      this.loading = true
      this.$api.linkAssets.tableofcontents({
        period: this.datevalues === String ? this.datevalues : this.formatDate(this.datevalues), // 查询日期
        corpIds: this.valueda, // 公司主键
        pk_assetcategory: this.Lbprop.id, // 资产属性
        zcsx: this.Lbprop.prop, // 资产类别主键
        levelq: this.levelq.value,
        levelz: this.levelz.value
      }).then(res => {
        if (res.success) {
          this.loading = false
          this.tableData = res.rows
          this.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          this.loading = false
          this.$message({
            type: 'error',
            message: res.msg
          })
          this.tableData = []
        }
      })

      this.datevalue = this.formatDate(this.datevalues)
      // console.log(this.datevalue)
      this.visiblePopover = false
      this.unam = this.optionsval.find(item => {
        return item.pk_gs === this.valueda
      }) || {}
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    levifu (val) {
      this.levelq = this.opsitionsdata.find(item => {
        return val === item.label
      })
    },
    levizu (val) {
      this.levelz = this.opsitionsdata.find(item => {
        return val === item.label
      })
    },
    formatDate (date) {
      if (date.length < 8) {
        return date
      } else {
        date.setTime(date.getTime())
        return date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1)
      }
    },
    clearPose: function () {
      this.visiblePopover = false
    },
    asettab (val) {
      this.Lbprop = val
      if (val.prop === 0) {
        this.optionsVal = '固定资产'
      } else if (val.prop === 1) {
        this.optionsVal = '无形资产'
      } else if (val.prop === 3) {
        this.optionsVal = '待摊费用'
      }
    },
    printTableList: function (data) {
      let param = {
        type: data.printInfo.type,
        pageOrt: data.printInfo.pageOrt,
        left: data.printInfo.left,
        top: data.printInfo.top,
        font: data.printInfo.font,
        printdate: this.formatDate(data.printInfo.printdate),
        corpName: this.$store.getters.currentCorp.uname,
        data: JSON.stringify(this.tableData)
      }
      this.$api.linkAssets.contable('折旧汇总表', param)
    },
    perfo () {
      this.isShowPrint = true
    },
    exportTableList: function () {
      if (this.tableData.length === 0) {
        this.$message({
          showClose: true,
          message: '当前界面数据为空！',
          type: 'warning'
        })
        return
      }
      let param = {
        strlist: JSON.stringify(this.tableData),
        corpName: this.$store.getters.currentCorp.uname,
        qj: this.formatDate(this.datevalue)
      }
      this.$api.linkAssets.exportData('折旧明细账', param)
    }
  },
  filters: {
    fomrzjfs (val) {
      return val === 0 ? '固定资产' : val === 1 ? '无形资产' : val === 3 ? '待摊费用' : '全部'
    }
  },
  created () {
    this.height = window.innerHeight - 175
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
    })

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
