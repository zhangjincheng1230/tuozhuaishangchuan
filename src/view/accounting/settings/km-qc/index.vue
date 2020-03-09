<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div style="position: absolute; top: 0px; left: 20px; z-index: 1">
          币种:
          <el-select v-model="rmb" style="width: 100px" @change="onrefresh" :disabled ="edit === true" @focus="rmbSelectFocus">
            <el-option v-for="item in currencyarray"
              :key="item.id" :value="item.id" :label="item.name">
            </el-option>
          </el-select>
          汇率: {{exrate | forThousands(huilvPre)}}
          <el-select v-model="selectcodeorname" filterable  clearable  :default-first-option="true" @change="setCurrenct" style="width: 200px">
            <el-option v-for="item in currTabTableNoChildData"
                       :key="item.qcid" :value="item.qcid" :label="item.kminfo">
            </el-option>
          </el-select>
        </div>
        <div class="kj-button-group">
          <el-button v-show = "!edit" @click="onEdit" >修改</el-button>
          <el-button @click="bshownum = !bshownum" >{{bshownum ? '隐藏数量' : '显示数量'}}</el-button>
          <el-button v-show = "!edit"  @click="showfzqc(null)">辅助期初</el-button>
          <el-button v-show = "!edit" @click="ssph">试算平衡</el-button>
          <el-button v-show = "!edit" @click="onrefresh">刷新</el-button>
          <el-button v-show = "!edit" @click="print">打印</el-button>
          <el-dropdown v-show = "!edit" @command="clearSelect" >
            <el-button >
              清除数据<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="clearfs">清除发生</el-dropdown-item>
              <el-dropdown-item command="clearall">清除全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown v-show = "!edit" @command="otherHander" >
            <el-button >
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="qcdr">科目期初导入</el-dropdown-item>
              <el-dropdown-item command="whxqc">未核销期初</el-dropdown-item>
              <el-dropdown-item command="syngdzc">固定资产期初同步</el-dropdown-item>
              <el-dropdown-item command="synkcqc">库存期初同步</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-if = "edit" @click="save">保存</el-button>
          <el-button v-if = "edit" @click="cancel">取消</el-button>
        </div>
      </div>
      <div class="kj-main"
           v-loading="loading"
           element-loading-text="数据加载中，请稍候..."
           element-loading-spinner="el-icon-loading">
        <div style="position: absolute; top: 10px; right: 20px; z-index: 1">
          <a href="#" v-if="ssphresult.yearlrce !==0" id="lrce" style="color: blue;text-decoration: none" @click="showLrce" >
            <span style="font-size: 14px;line-height: 19px">利润存在差额</span></a>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-checkbox v-model="showSealedData" @change="query">显示封存科目</el-checkbox>
        </div>
        <el-tabs v-model="activeName" style="height: 100%" @tab-click="tabclick">
          <el-tab-pane
            v-for="category in categories"
            :label="category.label"
            :name="'category' + category.value"
            :key="category.value"
            lazy
            style="height: 100%">
            <SubjectTable
              ref="tableRef"
              :tableData="subjectCategoryData(category.value)"
              @select="updateSealButton" :currency ="selectbz" :bshownum = "bshownum"
              :edit="edit" :exrate="exrate" @showfzqc="showfzqc" :tabName="'category' + category.value"></SubjectTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--打印对话框-->
    <print-dialog ref="printdialog"   :bshowDir="false"  :nodename="nodename" @confirmPrint="confirmPrint"></print-dialog>
    <!--试算平衡对话框-->
    <SsphDialog ref="ssphdialog" :result = "ssphresult"></SsphDialog>
    <!--利润差额对话框-->
    <LrceDialog ref="lrcedialog" :result = "ssphresult"></LrceDialog>
    <!--辅助期初对话框-->
    <fzqcdialog ref="fzqcdialog" :fztabledata = "currfzqcdata" :currFirstrowdata="currFirstrowdata" :verifyBeginAccounts="verifyBeginAccounts"
                :currkmqc="currrowdata" @onrefresh="onrefresh" :currency="selectbz"></fzqcdialog>
    <!--未核销期初对话框-->
    <whxqcdialog ref="whxdialog" :whxtabledata="whxtabledata" :currkmqc="currrowdata" :fztabledata = "currfzqcdata" ></whxqcdialog>
    <!--文件导入-->
    <UploaderDialog
      :visible.sync="impDialogVisible"
      name="impfile"
      :title="importTitle"
      @submit="importExcel"
      :param="uploadParam">
      <template #description>
        <div class="import-description">支持标准模板导入,没有导入模板<el-link type="primary"  @click="expExcel()">点击下载</el-link></div>
      </template>
    </UploaderDialog>
  </div>
</template>

<script>
import SubjectTable from './components/SubjectTable'
import PrintDialog from '@/components/Report/PrintDialog'
import SsphDialog from '@/view/accounting/settings/km-qc/components/SsphDialog'
import LrceDialog from '@/view/accounting/settings/km-qc/components/LrceDialog'
import { CATEGORY, ACCOUNT_FZHS_DEFAULT } from '@/constants/subject'
import Fzqcdialog from '@/view/accounting/settings/km-qc/components/FzQcDialog'
import Whxqcdialog from '@/view/accounting/settings/km-qc/components/WhxQcDialog'
import UploaderDialog from '@/components/UploaderDialog'
export default {
  name: 'km-qc',
  data () {
    return {
      nodename: '科目期初',
      showSealedData: false,
      loading: false,
      categories: CATEGORY,
      activeName: 'category0',
      subjectData: [],
      currrowdata: {}, // 当前选中行
      currFirstrowdata: {}, // 当前选中行的顶级科目
      fzqcData: [], // 辅助期初
      rmb: '00000100AA10000000000BKT', // 币种
      currencyarray: [],
      bshownum: false,
      ssphresult: {},
      edit: false,
      selectcodeorname: '',
      currTabTableNoChildData: [],
      allTabTableNoChildData: [],
      fzlbarray: {},
      whxtabledata: {},
      verifyBeginAccounts: {},
      impDialogVisible: false,
      importTitle: '科目期初导入',
      huilvPre: this.$store.getters.huilvPre, // 汇率精度
      uploadParam: {} // 上传参数
    }
  },
  computed: {
    subjectCategoryData () {
      return function (category) {
        return this.subjectData[category]
      }
    },
    selectbz () {
      for (const tt of this.currencyarray) {
        if (tt.id === this.rmb) {
          return tt
        }
      }
    },
    exrate () {
      return this.selectbz ? this.selectbz.exrate : 0
    },
    mode () { // 折算模式[0---原币 乘  1 -----原币 除]
      return this.selectbz.convmode
    },
    currencyname () {
      for (const tt of this.currencyarray) {
        if (tt.id === this.rmb) {
          return tt.name
        }
      }
    },
    currfzqcdata () {
      console.log('计算属性变化')
      if (this.currrowdata) {
        return this.fzqcData[this.currrowdata.pk_km] ? this.fzqcData[this.currrowdata.pk_km].slice(0) : []
      }
      return []
    }
  },
  watch: {
    activeName: function () {
      if (this.allTabTableNoChildData && this.allTabTableNoChildData.length > 0 && this.activeName && this.activeName.length > 0) {
        this.currTabTableNoChildData = this.allTabTableNoChildData[this.activeName.substring(8)]
      } else {
        this.currTabTableNoChildData = null
      }
    }
  },
  components: {
    Whxqcdialog,
    Fzqcdialog,
    SubjectTable,
    SsphDialog,
    PrintDialog,
    LrceDialog,
    UploaderDialog
  },
  created () {
    this.query()
    this.querybz()
    this.qryssph()
    this.queryfzlb()
    this.queryVerifyBeginAccounts()
  },
  methods: {
    // 币种选择事件
    rmbSelectFocus (e) {
      if (this.edit === true) {
        e.target.blur()
      }
    },
    // 页签切换
    tabclick (currtab) {
      this.selectcodeorname = ''
    },
    // 选中
    setCurrenct (id) {
      for (let i = 0; i < this.currTabTableNoChildData.length; i++) {
        const tt = this.currTabTableNoChildData[i]
        if (tt.qcid === id) {
          const curractivename = this.activeName
          let tab = this.$refs.tableRef.find(item => item.tabName === curractivename)
          tab.selectRow(tt)
          const targetTop = tab.$el.querySelectorAll('.el-table__body tr')[(i - 5) < 0 ? 0 : (i - 5) ].getBoundingClientRect().top
          const containerTop = tab.$el.querySelector('.el-table__body').getBoundingClientRect().top
          const scrollParent = tab.$el.querySelector('.el-table__body-wrapper')
          scrollParent.scrollTop = targetTop - containerTop
          // this.$refs.tableRef.find(item => this._inactive === false).bodyWrapper.scrollTop = i
          break
        }
      }
    },
    // 下拉科目使用
    getTabTableNoChildData (data) {
      let json = []
      if (data) {
        this.getSubJson(data, json, false)
      }
      // this.currTabTableNoChildData = json
      return json
    },
    onrefresh () {
      this.query()
      this.querybz()
      this.qryssph()
      this.queryVerifyBeginAccounts()
    },
    // 查询币种
    querybz () {
      this.$api.KmQc.querybz().then((rs) => {
        if (rs.success) {
          this.currencyarray = rs.rows
        }
      }).catch(e => {
      })
    },
    // 查询未核销期初是否存在
    queryVerifyBeginAccounts () {
      this.$api.KmQc.queryVerifyBeginAccounts().then((rs) => {
        if (rs.success) {
          const accounts = eval('[' + rs.rows + ']')
          const len = accounts.length
          this.verifyBeginAccounts = {}
          for (var i = 0; i < len; i++) {
            this.verifyBeginAccounts[accounts[i]] = true
          }
          console.log(this.verifyBeginAccounts)
        }
      }).catch(e => {
      })
    },
    // 查询辅助类别
    queryfzlb () {
      const param = {
        isfull: 'Y',
        unjl: 'Y'
      }
      this.$api.KmQc.queryFzlb(param).then((rs) => {
        if (rs && rs.success && rs.rows) {
          for (const t of rs.rows) {
            this.fzlbarray[t.code] = t
          }
        }
      }).catch(e => {
      })
    },
    // 数据查询
    query () {
      this.loading = true
      const param = {
        rmb: this.rmb,
        isShowFc: this.showSealedData
      }
      this.subjectData = []
      this.allTabTableNoChildData = []
      this.$api.KmQc.query(param).then((rs) => {
        if (rs.success) {
          for (let i = 0; i < CATEGORY.length; i++) {
            this.subjectData[i] = rs['o' + i]
            this.allTabTableNoChildData[i] = this.getTabTableNoChildData(rs['o' + i])
          }
          this.currTabTableNoChildData = this.allTabTableNoChildData[this.activeName.substring(8)]
          // this.getTabTableNoChildData(this.subjectData[this.activeName.substring(8)])
          this.createFzData(rs.fzqc)
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },
    updateSealButton (row, firstrow) {
      this.currrowdata = row
      this.currFirstrowdata = firstrow
    },
    onEdit () {
      if (this.rmb === 'zhbwb') {
        this.$message({showClose: true, message: '综合本位币不允许修改!', type: 'warning'})
        return
      }
      this.edit = true
    },
    cancel () {
      this.edit = false
      this.onrefresh()
    },
    // 保存
    save () {
      var postdata = []
      for (let i = 0; i < this.subjectData.length; i++) {
        // postdata['kmdata' + i] = JSON.stringify((this.subjectData[i]))
        if (this.subjectData[i]) {
          postdata = postdata.concat(this.subjectData[i])
        }
      }
      const param = {
        bodyvos: JSON.stringify(postdata),
        rmb: this.rmb
      }
      this.$api.KmQc.save(param).then((rs) => {
        if (rs.success) {
          this.$message({showClose: true, message: rs.msg, type: 'success'})
          this.edit = false
          this.onrefresh()
        } else {
          this.$message({showClose: true, message: rs.msg, type: 'warning'})
        }
      }).catch(e => {
      })
    },
    // 试算平衡
    ssph () {
      this.qryssph()
      this.$refs.ssphdialog.show()
    },
    showLrce () {
      this.$refs.lrcedialog.show()
    },
    // 试算平衡查询
    qryssph () {
      this.$api.KmQc.ssph().then((rs) => {
        if (rs.success) {
          this.ssphresult = rs
        }
      }).catch(e => {
      })
    },
    // 清除数据
    clearSelect (val) {
      this.$confirm('您确认清除发生 数据？清除后不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          'atype': val === 'clearall' ? '1' : '0'
        }
        this.$api.KmQc.clearSelect(param).then((rs) => {
          if (rs.success) {
            this.$message({showClose: true, message: rs.msg, type: 'success'})
          } else {
            this.$message({showClose: true, message: rs.msg, type: 'warning'})
          }
          this.onrefresh()
        }).catch(e => {
        })
      }).catch(() => { // 取消操作
      })
    },
    otherHander (val) {
      switch (val) {
        case 'qcdr': // 期初导入
          this.qcdr()
          break
        case 'whxqc': // 未核销期初
          this.whxqc()
          break
        case 'syngdzc': // 固定资产期初同步
          this.syngdzc()
          break
        case 'synkcqc': // 库存期初同步
          this.synkcqc()
          break
        default:
          break
      }
    },
    // 辅助期初
    showfzqc (datat) {
      if (datat && datat.kmcode) {
        this.currrowdata = datat
      }
      if (!this.currrowdata || !this.currrowdata.kmcode) {
        this.$message({showClose: true, message: '请选择一条数据', type: 'warning'})
        return
      }
      if (this.currrowdata.isfzhs === ACCOUNT_FZHS_DEFAULT) {
        this.$message({showClose: true, message: '该科目未绑定辅助核算', type: 'warning'})
        return
      }
      let fzxmmap = {}
      let fzlbmap = {}
      this.putFzlbAndFzxm(fzxmmap, fzlbmap)
      this.$refs.fzqcdialog.show(fzlbmap, fzxmmap)
    },
    putFzlbAndFzxm (fzxmmap, fzlbmap) {
      for (let i = 0; i < this.currrowdata.isfzhs.length; i++) {
        if (this.currrowdata.isfzhs[i] === '1') {
          const param = {
            id: this.fzlbarray[i + 1].id,
            kmid: this.currrowdata.pk_km
          }
          fzlbmap[this.fzlbarray[i + 1].id] = this.fzlbarray[i + 1]
          this.$api.KmQc.queryFzXm(param).then((rs) => {
            if (rs.success) {
              fzxmmap[this.fzlbarray[i + 1].id] = rs.rows
            } else {
            }
          }).catch(e => {
          })
        }
      }
    },
    // 期初导入
    qcdr () {
      this.impDialogVisible = true
    },
    // 期初数据下载
    expExcel () {
      const excelparam = {
        showQuantity: this.bshownum
      }
      this.$api.KmQc.expExcel(this.nodename, excelparam)
    },
    // 期初导入
    importExcel (formData) {
      this.$api.KmQc.importExcel(formData).then(res => {
        if (res.success) {
          this.impDialogVisible = false
          this.$message({
            dangerouslyUseHTMLString: true,
            message: res.msg,
            type: 'success'
          })
          this.onrefresh()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 未核销期初
    whxqc () {
      if (this.currrowdata && this.currrowdata.isleaf === '是') {
        if (this.currrowdata.wlhx !== '是') {
          this.$message({showClose: true, message: '该科目未启用往来核销', type: 'warning'})
          return
        }
        if (this.edit) {
          this.$message({showClose: true, message: '请先结束编辑状态', type: 'warning'})
          return
        }
        if (!this.currrowdata.monthqc) {
          this.$message({showClose: true, message: '请先维护' + this.currrowdata.kminfo + '期初金额', type: 'warning'})
          return
        }

        // 未核销数据查询
        const param = {
          pk_km: this.currrowdata.pk_km
        }
        this.$api.KmQc.whxqcquery(param).then((rs) => {
          if (rs.success) {
            this.whxtabledata = rs.rows
          } else {
          }
        }).catch(e => {
        })
        let fzxmmap = {}
        let fzlbmap = {}
        this.putFzlbAndFzxm(fzxmmap, fzlbmap)
        this.$refs.whxdialog.show(fzlbmap, fzxmmap)
      } else {
        this.$message({showClose: true, message: '请先选择一个末级科目', type: 'warning'})
      }
    },
    // 固定资产期初同步
    syngdzc () {
      this.$confirm('您确定要固定资产期初同步？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.KmQc.syngdzc().then((rs) => {
          if (rs.success) {
            this.$message({showClose: true, message: rs.msg, type: 'success'})
          } else {
            this.$message({showClose: true, message: rs.msg, type: 'warning'})
          }
          this.onrefresh()
        }).catch(e => {
        })
      }).catch(() => { // 取消操作
      })
    },
    // 库存期初同步
    synkcqc () {
      this.$confirm('您确定要同步库存期初？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        const param = {
          pk_corp: this.$store.getters.currentCorp.pk_gs
        }
        this.$api.KmQc.synkc(param).then((rs) => {
          if (rs.success) {
            this.$message({showClose: true, message: rs.msg, type: 'success'})
          } else {
            this.$message({showClose: true, message: rs.msg, type: 'warning'})
          }
          this.onrefresh()
        }).catch(e => {
        })
      }).catch(() => { // 取消操作
      })
    },
    // 打印
    print () {
      this.$refs.printdialog.show()
    },
    confirmPrint (val) {
      let postdata = []
      let json = []
      for (let i = 0; i < this.subjectData.length; i++) {
        postdata = postdata.concat(this.subjectData[i])
      }
      this.getSubJson(postdata, json, true)
      const otherprintparam = {
        titleperiod: this.$store.getters.getLoginDate,
        corpName: this.$store.getters.currentCorp.uname,
        showAmount: this.bshownum,
        list: JSON.stringify(json),
        extra: this.$options.filters.forThousands(this.exrate, this.huilvPre),
        currencyname: this.currencyname
      }
      this.$api.KmQc.printPdf(this.nodename, Object.assign(val, otherprintparam))
    },
    createFzData (fzqc) {
      if (fzqc) {
        console.log(fzqc)
        this.fzqcData = []
        for (const tt of fzqc) {
          if (this.fzqcData[tt.pk_km]) {
            this.fzqcData[tt.pk_km].push(tt)
          } else {
            this.fzqcData[tt.pk_km] = [tt]
          }
        }
      }
    },
    getSubJson (jsonData, json, bconfz) {
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i]) {
          json.push(jsonData[i])
        }
        if (jsonData[i] && jsonData[i].hasOwnProperty('children')) { // 递归方法循环子节点的数据并加入json中
          this.getSubJson(jsonData[i].children, json)
        } else if (bconfz && jsonData[i] && jsonData[i].isfzhs !== ACCOUNT_FZHS_DEFAULT) {
          let fzArray = this.fzqcData[jsonData[i].pk_km]
          if (fzArray) {
            for (var j = 0, len = fzArray.length; j < len; j++) {
              json.push(fzArray[j])
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  >>> .el-tabs__header {
    height: 40px;
    margin-bottom: 10px;
  }
  >>> .el-tabs__content {
    height: calc(100% - 50px);
  }
  .import-description {
    text-align: center;
  }
</style>
