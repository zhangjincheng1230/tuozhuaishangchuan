<template>
  <div class="app-main" v-cloak>
    <div class="kj-container kj-card">
      <div class="kj-head">
        <div class="query-info">
          <div class=" mod-crumb warning_tip" v-if="warnShow">
            <div class="warning_tips">
              <span><img src="../../../../assets/img/warning.png"></span>
              <p><a href="javascript:void(0)" @click ="addOpenKm()" style = "padding-right:8px" >{{warnMsg}}</a> </p>
            </div>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button  @click="saveGroup">默认设置</el-button>
          <el-button  @click="saveInfo">保存</el-button>
          <el-button  @click="cancelEdit">取消</el-button>
          <el-button  @click="showdept">部门费用设置</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-main >
          <el-row id = "row1">
            <el-row >
              <span style="font-size:15px;font-weight: bold;">计提工资</span>
            </el-row>
            <el-row style = "margin-top:5px">
              <el-table id="table1" :data=tableData.tableData1  style = "width:892px">
                <el-table-column key="xh" prop="xh" label="序号" header-align ="center" align ="center" width="50"> </el-table-column>
                <el-table-column key="zy" prop="zy" label="摘要" header-align ="center" align ="center" width="155"> </el-table-column>
                <el-table-column key="fx" prop="fx" label="方向" header-align ="center" align ="center" width="50"> </el-table-column>
                <el-table-column key="kmsz" prop="kmsz" label="科目设置" header-align ="center" align ="center" width="150">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kmsz" filterable placeholder="请选择" disabled size="small" style = "width:140px">
                      <el-option v-for="item in options1" :key="item.value" :label="item.label"  :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{    item.fx }}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column key="kjkm" prop="kjkm" label="会计科目" header-align ="center" align ="center" width="485">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kjkm" filterable default-first-option placeholder="请选择" size="small" style = "width:475px">
                      <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                        <span style="float: left">{{ item.codefullname }}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>

          <el-row id = "row2">
            <el-row style = "margin-top:10px">
              <span style="font-size:15px;font-weight: bold;margin-top:15px">计提发放</span>
            </el-row>
            <el-row style = "margin-top:5px">
              <el-table id="table2" :data=tableData.tableData2  style = "width:892px">
                <el-table-column key="xh" prop="xh" label="序号" header-align ="center" align ="center" width="50"> </el-table-column>
                <el-table-column key="zy" prop="zy" label="摘要" header-align ="center" align ="center" width="155"> </el-table-column>
                <el-table-column key="fx" prop="fx" label="方向" header-align ="center" align ="center" width="50"> </el-table-column>
                <el-table-column key="kmsz" prop="kmsz" label="科目设置" header-align ="center" align ="center" width="150">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kmsz" filterable placeholder="请选择" disabled size="small" style = "width:140px">
                      <el-option v-for="item in options2" :key="item.value" :label="item.label"  :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{    item.fx }}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column key="kjkm" prop="kjkm" label="会计科目" header-align ="center" align ="center" width="485">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kjkm" filterable placeholder="请选择" default-first-option size="small" style = "width:475px">
                      <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                        <span style="float: left">{{ item.codefullname }}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
          <el-row id = "row5" style = "margin-top:5px" >
            <div class="setsection">
              <div class="title">
                <span class="settriangle-left"></span>
                <span class="showMore title-name">
                  <a  v-if="showMore" href="javascript:void(0)" @click="showMoreF" style="display:block;color:#fff;text-decoration:none;text-align:center;">隐藏企业部分<img  src="../../../../assets/img/menu_show_less.gif" />
                  </a>
                   <a  v-else href="javascript:void(0)" @click="showMoreF" style="display:block;color:#fff;text-decoration:none;text-align:center;">显示企业部分<img src="../../../../assets/img/menu_show_more.gif" />
                  </a>
                </span>
                <span class="settriangle-right"></span>
              </div>
            </div>
          </el-row>
          <el-row id = "row3"  v-if='showMore'>
            <el-row >
              <span style="font-size:15px;font-weight: bold;margin-top:5px">计提企业部分</span>
              <el-checkbox style="margin-left:25px" v-model=tableData.jtqybf true-label ='是' false-label='否 ' >计提社保/公积金(企业部分)</el-checkbox>
            </el-row>
            <el-row style = "margin-top:5px">
              <el-table id="table3" :data=tableData.tableData3 style = "width:892px">
                <el-table-column key="xh" prop="xh" label="序号" header-align ="center" align ="center" width="50">
                  <template #default="{ row, $index }">
                    <div class="row-operate">
                      <i title="增行" class="el-icon-circle-plus-outline" @click="addKmRow($index)"></i>
                      <i title="删行" class="el-icon-remove-outline" @click="delKmRow($index)"></i>
                    </div>
                    {{ ($index + 1) }}
                  </template>
                </el-table-column>
                <el-table-column key="zy" prop="zy" label="摘要" header-align ="center" align ="center" width="155"> </el-table-column>
                <el-table-column key="fx" prop="fx" label="方向" header-align ="center" align ="center" width="50"></el-table-column>
                <el-table-column key="kmsz" prop="kmsz" label="科目设置" header-align ="center"  align ="center" width="150">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kmsz" filterable placeholder="请选择" size="small" default-first-option style = "width:140px" @change="kmSzHandleChange(scope.$index,scope)">
                      <el-option v-for="item in options3" :key="item.value" :label="item.label"  :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{    item.fx }}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column key="kjkm" prop="kjkm" label="会计科目" header-align ="center" align ="center" width="485">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.kjkm" filterable placeholder="请选择" default-first-option size="small" style = "width:475px">
                      <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                        <span style="float: left">{{ item.codefullname }}</span>
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-row>
        </el-main>
      </div>
      <DeptAccountDialog :visible.sync="dialogDeptFormVisible" :title="dialogFormTitle" :data="dialogFormData" @save="onDeptSaved" ></DeptAccountDialog>
    </div>
  </div>
</template>

<script>
import * as SalaryManageConst from '../salary-manage-const'
import DeptAccountDialog from './components/DeptAccountDialog'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'account-setting',
  mixins: [MessageUtil, Loading],
  components: {
    DeptAccountDialog
  },
  data () {
    return {
      showMore: false,
      warnMsg: '',
      warnShow: false,
      tableData: {},
      dialogDeptFormVisible: false,
      dialogFormTitle: '部门费用设置',
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      period: this.$store.getters.getLoginDate.substring(0, 7),
      options1: SalaryManageConst.fxsz1,
      options2: SalaryManageConst.fxsz2,
      options3: SalaryManageConst.fxsz3,
      dialogFormData: []
    }
  },
  computed: {
    kmdata () {
      const kmRefData = this.$store.state.accounting.subjectRefData
      for (const data of kmRefData) {
        if (data) {
          if (data.yz !== '是') {
            data.disabled = true
          } else {
            data.disabled = false
          }
        }
      }
      return kmRefData
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
  },
  methods: {
    fetchData () {
      this.showLoading('数据处理中，请稍候...')
      this.$api.SalaryManageApi.AccountSetting.query().then(result => {
        this.closeLoading()
        if (result.success) {
          this.tableData = result.rows
          this.initShowMore()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    saveInfo () {
      this.showLoading('正在保存...')
      const temp = { szdata: JSON.stringify(this.tableData) }
      this.$api.SalaryManageApi.AccountSetting.saveInfo(temp).then(result => {
        this.closeLoading()
        if (result.success) {
          this.successMsg(result.msg)
          this.fetchData()
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    cancelEdit () {
      this.fetchData()
    },
    addKmRow (index) {
      this.tableData.tableData3.splice(index + 1, 0, { zy: '社保计提(企业部分)', fx: '', kmsz: '', kjkm: '', jfje: '-', dfje: '-' })
      this.$nextTick(() => {
        const scrollDom = document.getElementsByClassName('kj-main')[0]
        scrollDom.scrollTop = scrollDom.scrollHeight
      })
    },
    delKmRow (index) {
      if (this.tableData.tableData3.length === 1) {
        return
      }
      this.tableData.tableData3.splice(index, 1)
    },
    kmSzHandleChange (index, scope) {
      const newvalue = scope.row.kmsz
      const row = this.options3.find(item => item.value === newvalue)
      if (row) { this.tableData.tableData3[index].fx = row.fx }
    },
    showMoreF () {
      if (this.showMore) {
        this.showMore = false
        this.tableData.showmore = 'N'
      } else {
        this.showMore = true
        this.tableData.showmore = 'Y'
        this.$nextTick(() => {
          const scrollDom = document.getElementsByClassName('kj-main')[0]
          scrollDom.scrollTop = scrollDom.scrollTop + 350
        })
      }
    },
    initShowMore () {
      if (this.tableData.showmore && this.tableData.showmore === '是') {
        this.showMore = true
        this.tableData.showmore = 'N'
      } else {
        this.showMore = false
        this.tableData.showmore = 'Y'
      }
    },
    saveGroup () {
      this.$prompt('请确认是否获取默认入账科目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'el-button--right',
        showInput: false,
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(result1 => {
        this.showLoading('正在设置...')
        this.$api.SalaryManageApi.AccountSetting.saveGroup().then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg(result.msg)
          } else {
            if (result.msg.indexOf('请到数据维护-标准科目节点') > 0) {
              this.warnMsg = result.msg
              this.warnShow = true
              window.setTimeout(this.hidebalance, 3000)
            } else {
              this.hidebalance()
              this.errorMsg(result.msg)
            }
          }
          this.kmdata()
        }).catch(e => {
        })
      }).catch(e => {
      })
    },
    hidebalance () {
      this.warnShow = false
    },
    showdept () {
      this.queryFYkm()
    },
    queryFYkm () {
      this.$api.SalaryManageApi.AccountSetting.queryFyKm({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.DEPARTMENT,
        pk_corp: this.$parent.pk_corp
      }).then(result => {
        if (result.success) {
          if (result.rows && result.rows.length > 0) {
            this.dialogFormData = result.rows
          } else {
            this.dialogFormData = []
          }
          this.dialogDeptFormVisible = true
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    onDeptSaved () {

    },
    addOpenKm () {
      this.hidebalance()
    }
  }
}
</script>
<style scoped>
  .setsection .title {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    color: #fff;
    font-size: 12px;
  }
  .setsection .title-name {
    float: left;
    padding-left: 3px;
    display: inline-block;
    background-color: #2c9dd8;
    height: 32px;
  }
  .settriangle-right {
    float: left;
    display: inline-block;
    width: 0px;
    height: 0px;
    line-height: 0px;
    border-right: 32px solid ;
    border-bottom: 32px solid transparent;
    background-color: #2c9dd8;
  }
  .settriangle-left {
    float: left;
    display: inline-block;
    width: 0px;
    height: 0px;
    line-height: 0px;
    border-left: 32px solid;
    border-bottom: 32px solid transparent;
    background-color: #2c9dd8;
  }

  #row1{
    margin-left: calc(100vh - 550px)
  }
  #row2{
   margin-left: calc(100vh - 550px)
  }
  #row3{
    margin-left: calc(100vh - 550px)
  }
  #row5{
    margin-left: calc(100vh - 192px)
  }
  .warning_tip {
    margin-top:8px;
    border-radius: 0.4em;
    margin-left: calc(100vh - 500px);
    background: #fff;
    color: #ff525f;
    border: 1px solid #ff525f;
    padding-left: 10px;
  }

  .warning_tips {
    overflow: hidden;
  }

  .warning_tip span {
    float: left;
    padding-top: 2px;
  }

  .warning_tip img {
    margin: 4px 10px 4px 0;
  }

  .warning_tip p {
    float: left;
    line-height: 30px;
    font-size: 14px;
  }

  .warning_tip a {
    line-height: 30px;
    font-size: 14px;
    color: #ff525f;
    text-decoration:none;
  }

  .warning_tip a:hover {
    text-decoration: none;
    color: #ff525f;
  }
  .row-operate {
    top: 10px;
  }
  [v-cloak] {
    display: none;
  }
</style>
