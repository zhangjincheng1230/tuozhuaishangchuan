<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"
  >
    <header
      style="width:100%;height:60px;display:flex;justify-content: space-between; align-items:center;"
    >
      <div></div>
      <div style="margin-right:15px;">
        <el-button @click="addtable">新增</el-button>
        <el-button @click="btnModify">修改</el-button>
        <el-button @click="open">删除</el-button>
      </div>
    </header>
    <div class="contents">
      <el-table
        ref="multipleTable"
        :data="tableData"
        highlight-current-row
        :row-class-name="tableRowClassName"
        @row-click="remove"
        border
        v-loading="loading"
        element-loading-text="数据处理中，请稍候..."
        element-loading-spinner="el-icon-loading"
        tooltip-effect="dark"
        style="width: 100%;height:100%"
      >
        <el-table-column type="index" label="序号" align="center" width="40"></el-table-column>
        <el-table-column label="资产属性" align="center" width="110" show-overflow-tooltip>
          <template slot-scope="sope">
            <span>{{sope.row.zcsx|fomrzjfs}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zclbmc"
          label="资产类别"
          align="center"
          width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="科目属性" align="center" show-overflow-tooltip width="140">
          <template slot-scope="sope">
            <span>{{sope.row.zckm|getSubjec}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="zzkmmc"
          label="资产科目"
          align="center"
          show-overflow-tooltip
          width="140"
        ></el-table-column>
        <el-table-column
          prop="zjfykmmc"
          align="center"
          label="折旧费用科目"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="jskmmc"
          label="结算科目"
          align="center"
          show-overflow-tooltip
          width="140"
        ></el-table-column>
      </el-table>
    </div>
    <div
      class="mark"
      style="width:100%;height:100%; background:rgba(0,0,0,0.3); position: absolute; left:0; top:0; z-index:900;"
      v-if="openForm"
    ></div>
    <AddTable v-if="openForm">
      <span slot="addHead" style="margin-left:14px;">{{btn}}</span>
      <span slot="opendown" @click="openForm=false" style="padding-right:14px;cursor:pointer">X</span>
      <div slot="addMain">
        <div
          style="width:100%; height:55px; display:flex; justify-content: space-around; line-height:55px"
        >
          <span style="width:23%;margin-left:20px;text-align:right;">
            <b style="color:red;margin-right:8px; font-size:20px;">*</b>资产属性
          </span>
          <el-select v-model="zichanshuxing" placeholder="请选择" style="width:45%;margin-right:40px;">
            <el-option
              v-for="item in optionsvalue"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div
          style="width:100%; height:55px; display:flex; justify-content: space-around; line-height:55px"
        >
          <span style="width:23%;margin-left:20px;text-align:right;">资产类别</span>
          <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="zichanleibie"
            style="width:45%;margin-right:40px;"
            @focus="zichanval"
          ></el-input>
        </div>
        <AssetsType v-if="openAssetsType" @findinde="asettab"></AssetsType>
        <div
          style="width:100%; height:55px; display:flex; justify-content: space-around; line-height:55px"
        >
          <span style="width:23%;margin-left:20px;text-align:right;">
            <b style="color:red;margin-right:8px; font-size:20px;">*</b>科目属性
          </span>
          <el-select v-model="kemushuxing" placeholder="请选择" style="width:45%;margin-right:40px;">
            <el-option
              v-for="item in optionskemushuxing"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div
          style="width:100%; height:55px; display:flex; justify-content: space-around; line-height:55px;position: relative;"
        >
          <span style="width:23%;margin-left:20px;text-align:right;">
            <b style="color:red;margin-right:8px; font-size:20px;">*</b>资产科目
          </span>
          <el-select
            v-model="zichankemu"
            placeholder="请选择"
            filterable
            style="width:45%;margin-right:40px;"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.codefullname"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div
          style="width:100%; height:55px; display:flex; justify-content: space-around; line-height:55px;position: relative;"
        >
          <span style="width:23%;margin-left:20px;text-align:right;">
            <b style="color:red;margin-right:8px; font-size:20px;">*</b>折旧费用科目
          </span>
          <el-select
            v-model="zhejiu"
            placeholder="请选择"
            filterable
            style="width:45%;margin-right:40px;"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.codefullname"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div
          style="width:100%; height:55px; display:flex; justify-content: space-around; line-height:55px;position: relative;"
        >
          <span style="width:23%;margin-left:20px;text-align:right;">
            <b style="color:red;margin-right:8px; font-size:20px;">*</b>结算科目
          </span>
          <el-select
            v-model="jiesuan"
            placeholder="请选择"
            filterable
            style="width:45%;margin-right:40px; "
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.codefullname"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div slot="addFoot">
        <el-button type="primary" @click="Determine(zichankemu, zhejiu, jiesuan)">确定</el-button>
        <el-button type="primary" @click="quxiao ">取消</el-button>
      </div>
    </AddTable>
    <div class="mark" v-if="isShowSubjectInfo">
      <div class="mark-sub">
        <div class="heads">
          <span style="margin-left:14px;">选择科目</span>
          <span style="margin-right:14px;" @click="isShowSubjectInfo=false;openForm = true">X</span>
        </div>
        <div class="secon">
          <el-tabs type="card" @tab-click="handleClick">
            <el-tab-pane label="资产" name="first">
              <kctable :data="tabdata" @kcitem="selecval" />
            </el-tab-pane>
            <el-tab-pane label="负债" name="second">
              <kctable :data="tabdata" @kcitem="selecval" />
            </el-tab-pane>
            <el-tab-pane label="共同" name="third">
              <kctable :data="tabdata" @kcitem="selecval" />
            </el-tab-pane>
            <el-tab-pane label="权益" name="fourth">
              <kctable :data="tabdata" @kcitem="selecval" />
            </el-tab-pane>
            <el-tab-pane label="成本" name="five">
              <kctable :data="tabdata" @kcitem="selecval" />
            </el-tab-pane>
            <el-tab-pane label="损益" name="six">
              <kctable :data="tabdata" @kcitem="selecval" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="foter">
          <div></div>
          <div style="margin-right:14px">
            <el-button type="primary" @click="kcItems">确定</el-button>
            <el-button type="primary" @click="isShowSubjectInfo=false;openForm = true">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import AddTable from '../components/AddTable'
import kctable from './component/kctable'
import AssetsType from '../components/AssetsTypeSelect'
export default {
  name: 'zckmdz',
  data () {
    return {
      value: '',
      values: '',
      lists: [],
      logins: 1,
      options: [],
      openAssetsType: false,
      loading: false,
      optionskemushuxing: [
        { value: '资产原值' },
        { value: '累计折旧' },
        { value: '资产净值' },
        { value: '待摊费用' }
      ],
      optionsvalue: [{
        value: '选项1',
        label: '固定资产'
      }, {
        value: '选项2',
        label: '无形资产'
      }, {
        value: '选项3',
        label: '待摊费用'
      }],
      tableData: [],
      openCompe: false,
      openForm: false,
      jiesuan: '', // 结算科目
      jiesuanid: '', // 结算科目id
      zichankemu: '', // 资产科目
      zichankemuid: '', // 资产科目id
      zichanleibie: '', // 资产类别
      zichanshuxing: '', // 资产属性
      zhejiu: '', // 折旧费用科目
      zhejiuid: '', // 折旧费用科目id
      kemushuxing: '', // 科目属性，
      isShowSubjectInfo: false,
      subjectInfo: false,
      ind: 0,
      btn: '',
      tabdata: [],
      vals: '',
      Lbprop: {},
      zichanid: '',
      Indx: 0,
      Assets: '',
      getSubject: '',
      selection: {},
      Inds: 0,
      jisusanid: '',
      zjfykmids: '',
      zzkmid: '',
      lace: false
    }
  },
  components: {
    Header,
    AddTable,
    kctable,
    AssetsType

  },
  filters: {
    fomrzjfs (val) {
      return val === 0 ? '固定资产' : val === 1 ? '无形资产' : val === 3 ? '待摊费用' : '全部'
    },
    getSubjec (vas) {
      return vas === 0 ? '资产原值' : vas === 1 ? '累计折旧' : vas === 2 ? '资产净值' : '长期摊销'
    }
  },
  methods: {
    ShowSubjectInfo: function (val) {
      this.isShowSubjectInfo = true
      this.openForm = false
      this.vals = val
    },
    kcItems () {
      this.isShowSubjectInfo = false
      this.openForm = true
    },
    addtable () {
      this.btn = '新增'
      this.openForm = true
    },
    addTabl () {
      this.openAssetsType = true
    },
    Determine (zichankemu, zhejiu, jiesuan) { // 确定按钮
      this.openForm = false
      this.lace = false
      if (this.kemushuxing === '资产原值') {
        this.Indx = 0
      } else if (this.kemushuxing === '累计折旧') {
        this.Indx = 1
      } else if (this.kemushuxing === '资产净值') {
        this.Indx = 2
      } else if (this.kemushuxing === '长期摊销') {
        this.Indx = 3
      }
      if (this.zichanleibie === '固定资产') {
        this.Inds = 0
      } else if (this.zichanleibie === '无形资产') {
        this.Inds = 1
      } else if (this.zichanleibie === '待摊费用') {
        this.Inds = 3
      }
      if (this.zichanshuxing === '') {
        this.openForm = true
        this.$message({
          type: 'error',
          message: '资产属性不能为空'
        })
      } else if (this.kemushuxing === '') {
        this.openForm = true
        this.$message({
          type: 'error',
          message: '科目属性不能为空'
        })
      } else if (this.zichankemu === '') {
        this.openForm = true
        this.$message({
          type: 'error',
          message: '资产科目不能为空'
        })
      } else if (this.zhejiu === '') {
        this.openForm = true
        this.$message({
          type: 'error',
          message: '折旧费用不能为空'
        })
      } else if (this.jiesuan === '') {
        this.openForm = true
        this.$message({
          type: 'error',
          message: '折旧费用不能为空'
        })
      } else {
        if (this.btn === '修改') {
          this.$api.linkAssets.controlledxiu({
            zcsx: this.Lbprop.prop,
            zclbid: this.zichanid,
            zckm: this.Indx,
            zzkmid: this.zzkmid === '' ? zichankemu : this.zzkmid,
            zjfykmid: this.zjfykmids === '' ? zhejiu : this.zjfykmids,
            jskmid: this.jisusanid === '' ? jiesuan : this.jisusanid,
            gsid: this.$store.getters.currentCorp.copid,
            id: this.selection.id
          }).then(res => {
            if (res.success) {
              this.gettablist('')
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }

            console.log(res)
          })
        } else if (this.btn === '新增') {
          this.$api.linkAssets.controlled({
            zcsx: this.Lbprop.prop,
            zclbid: this.zichanid,
            zckm: this.Indx,
            zzkmid: this.zichankemu,
            zjfykmid: this.zhejiu,
            jskmid: this.jiesuan,
            gsid: this.$store.getters.currentCorp.copid
          }).then(res => {
            if (res.success) {
              this.gettablist('')
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }
      }
      this.jiesuan = ''// 结算科目
      this.zichankemu = ''// 资产科目
      this.zichanleibie = ''// 资产类别
      this.zichanshuxing = ''// 资产属性
      this.zhejiu = ''// 折旧费用科目
      this.kemushuxing = ''// 科目属性
    },
    btnModify () { // 修改
      if (!this.lace) {
        this.$message({
          type: 'error',
          message: '请选择数据'
        })
      } else {
        if (this.selection.zckm === 0) {
          this.getSubject = '资产原值'
        } else if (this.selection.zckm === 1) {
          this.getSubject = '累计折旧'
        } else if (this.selection.zckm === 2) {
          this.getSubject = '资产净值'
        } else if (this.selection.zckm === 3) {
          this.getSubject = '长期摊销'
        }
        if (this.selection.zcsx === 0) {
          this.Assets = '固定资产'
        } else if (this.selection.zcsx === 1) {
          this.Assets = '无形资产'
        } else if (this.selection.zcsx === 3) {
          this.Assets = '待摊费用'
        }
        this.btn = '修改'
        this.openForm = true
        this.jiesuan = this.selection.jskmmc// 结算科目
        this.zichankemu = this.selection.zzkmmc// 资产科目
        this.zichanleibie = this.selection.zclbmc// 资产类别
        this.zichanshuxing = this.Assets// 资产属性
        this.zhejiu = this.selection.zjfykmmc// 折旧费用科目
        this.kemushuxing = this.getSubject// 科目属性
        this.jisusanid = this.selection.jskmid
        this.zjfykmids = this.selection.zjfykmid
        this.zzkmid = this.selection.zzkmid
      }
    },
    remove (row, column, event) {
      if (row != null) {
        this.selection = row
        this.lace = true
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      console.log(row)
      row.index = rowIndex
    },
    open () { // 删除
      if (!this.lace) {
        this.$message({
          type: 'error',
          message: '请选择数据'
        })
      } else {
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.lace = false
          this.$api.linkAssets.BankAccount({
            id: this.selection.id,
            gsid: this.selection.gsid
          }).then(res => {
            this.gettablist('')
            if (res.success) {
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
      }
    },
    gettablist (id) {
      this.loading = true
      this.$api.linkAssets.Accounts({
        kmfaid: id === '' ? '' : id
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.tableData = res.rows

          this.tableData.map((item, ind) => {
            if (item.zckm === 0) {
              this.getSubject = '资产原值'
            } else if (item.zckm === 1) {
              this.getSubject = '累计折旧'
            } else if (item.zckm === 2) {
              this.getSubject = '资产净值'
            } else if (item.zckm === 3) {
              this.getSubject = '长期摊销'
            }
            if (item.zcsx === 0) {
              this.Assets = '固定资产'
            } else if (item.zcsx === 1) {
              this.Assets = '无形资产'
            } else if (item.zcsx === 3) {
              this.Assets = '待摊费用'
            }
          })
        }
      })
    },
    handleClick (tab, event) {
      this.$api.linkAssets.IMyMoneyStorage({
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        accindex: tab.index
      }).then(res => {
        // console.log(res.rows)

        this.tabdata = res.rows
      })
    },
    quxiao () {
      this.openForm = false
      this.selection = {}
      this.jiesuan = ''// 结算科目
      this.zichankemu = ''// 资产科目
      this.zichanleibie = ''// 资产类别
      this.zichanshuxing = ''// 资产属性
      this.zhejiu = ''// 折旧费用科目
      this.kemushuxing = ''// 科目属性
    },
    selecval (data) {
      console.log(data)
      if (this.vals === 'a') {
        this.jiesuan = data.kmmc
        this.jiesuanid = data.id
      } else if (this.vals === 'b') {
        this.zhejiu = data.kmmc
        this.zhejiuid = data.id
      } else if (this.vals === 'c') {
        this.zichankemu = data.kmmc
        this.zichankemuid = data.id
      }
    },
    asettab (val) {
      console.log(val)

      this.Lbprop = val
      if (val.prop === 0) {
        this.zichanshuxing = '固定资产'
      } else if (val.prop === 1) {
        this.zichanshuxing = '无形资产'
      } else if (val.prop === 3) {
        this.zichanshuxing = '待摊费用'
      }
    },
    zichanval () {
      this.openAssetsType = true
    }
  },
  created () {
    this.$bus.$on('openForm', (data) => {
      this.openForm = data
    })
    this.gettablist()
    this.$api.linkAssets.IMyMoneyStorageAll().then(res => {
      this.options = res.rows
    })
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
    })

    this.$bus.$on('assetsType', (data) => {
      this.zichanid = data.id
      this.zichanleibie = data.name
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
  position: relative;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.mark {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.4);
  left: 0;
  top: 0;
  .mark-sub {
    width: 600px;
    height: 500px;
    margin: 100px auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;

    .heads {
      width: 100%;
      height: 50px;
      background: #2c9dd8;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      color: #ffffff;
    }
    .secon {
      width: 100%;
      flex: 1;
      margin-top: 15px;
      overflow: hidden;
      overflow-y: auto;
      /deep/.el-tabs__nav {
        border: none;
      }
      /deep/.el-tabs__item {
        width: 80px;
        height: 45px;
        border: solid 1px #ccc;
        border-radius: 6px;
        margin-left: 8px;
        background: #f4f4f4;
        cursor: pointer;
      }
      /deep/.el-tabs__item.is-active {
        background: #ffffff;
        color: #000;
      }
      /deep/.el-tabs__item:hover {
        color: #000;
      }
    }
    .foter {
      width: 100%;
      height: 50px;
      background: #d4d4d4;
      display: flex;
      justify-content: space-between;
      line-height: 50px;
    }
  }
}
/deep/.el-input__inner {
  cursor: pointer;
}
</style>
