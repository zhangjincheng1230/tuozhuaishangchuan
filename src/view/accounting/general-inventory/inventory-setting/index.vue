<template>
  <div class="app-main" v-cloak>
    <div class="kj-container kj-card">
      <div class="kj-head">
        <div class="query-info">
        </div>
        <div class="kj-button-group">
          <el-button  @click="saveGroup">默认设置</el-button>
          <el-button  @click="onSave">保存</el-button>
          <el-button v-if="false"  @click="cancelEdit">取消</el-button>
          <el-button  @click="fetchData(true)">取消</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-form
          :inline="true"
          :model="formData"
          ref="formRef"
          size="mini"
          label-width="130px"
          style="margin: 0 auto; width: 700px"
        >
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">存货核算设置</div>
          <el-row style="margin-top:10px;">
            <el-form-item label="存货成本核算方式"  prop="chcbjzfs">
              <el-radio v-model="formData.chcbjzfs" :label="0" >辅助明细</el-radio>
              <el-radio v-if="!this.ischannel" v-model="formData.chcbjzfs" :label="1" >存货大类</el-radio>
              <el-radio v-model="formData.chcbjzfs" :label="2" >不核算明细</el-radio>
            </el-form-item>
            <el-tooltip  style="margin-left:-8px;margin-top:5px" effect="light" content="点击查看详细内容！" placement="right">
              <el-image @click="showSM" :src=srcList[0]></el-image>
            </el-tooltip>
          </el-row>
          <el-row >
            <el-form-item label="存货匹配规则"  prop="chppjscgz">
              <el-radio v-model="formData.chppjscgz" :label="0" >存货名称+规格（型号）+计量单位</el-radio>
              <el-radio v-model="formData.chppjscgz" :label="2" >存货名称+计量单位</el-radio>
            </el-form-item>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item label="暂估入库贷方科目"  prop="zgrkdfkm">
                <el-select   v-model="formData.zgrkdfkm"
                             default-first-option placeholder="请选择" filterable style= "width:174px" @change="bmHandleChange" >
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商辅助核算"  prop="zgkhfz" v-if="iszg">
                <el-select   v-model="formData.zgkhfz"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in fzData" :key="item.id" :label="item.code ? item.code + '_' + item.name : item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-tooltip v-if="iszg" style="margin-left:-8px;margin-top:5px" effect="light" content="请在会计科目中增加“应付账款-暂估入库”下级科目或辅助核算科目！" placement="bottom">
                <el-image :src=srcList[0]></el-image>
              </el-tooltip>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">库存商品生成凭证设置</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="入库科目"  prop="kcsprkkm">
                <el-select   v-model="formData.kcsprkkm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出库科目"  prop="kcspckkm">
                <el-select   v-model="formData.kcspckkm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">增值税设置</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="进项税额"  prop="jxshuiekm">
                <el-select   v-model="formData.jxshuiekm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销项税额"  prop="xxshuiekm">
                <el-select   v-model="formData.xxshuiekm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">结算方式设置</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="应收"  prop="yingshoukm">
                <el-select   v-model="formData.yingshoukm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应付"  prop="yingfukm">
                <el-select   v-model="formData.yingfukm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="12">
              <el-form-item label="银行"  prop="yinhangkm">
                <el-select   v-model="formData.yinhangkm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现金"  prop="xianjinkm">
                <el-select   v-model="formData.xianjinkm"
                             default-first-option placeholder="请选择" filterable style= "width:174px">
                  <el-option v-for="item in kmdata" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <SmDialog :visible.sync="dialogVisible" :title="dialogTitle"></SmDialog>
    </div>
  </div>
</template>

<script>
import SmDialog from './components/SmDialog'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import refreshDataMixin from '@/mixins/refresh-data'
import MessageUtil from '@/mixins/message-util'
import Loading from '@/mixins/loading'
export default {
  name: 'inventory-setting',
  mixins: [refreshDataMixin, MessageUtil, Loading],
  components: {
    SmDialog
  },
  data () {
    return {
      dialogVisible: false,
      dialogTitle: '说明',
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      formData: {},
      fzData: []
    }
  },
  computed: {
    ischannel () {
      if (this.$store.getters.currentCorp.ischannel) {
        if (this.$store.getters.currentCorp.ischannel === 'Y') {
          return true
        }
      }
      return false
    },
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
    },
    iszg () {
      const item = this.kmdata.find(item => item.id === this.formData.zgrkdfkm)
      if (item && item.isfzhs) {
        return item.isfzhs.substring(1, 2) === '1'
      }
      return false
    }
  },
  created () {
  },
  mounted: function mounted () {
    this.fetchData()
    this.initfz()
  },
  watch: {
  },
  methods: {
    refreshData () {
      this.initfz()
    },
    initfz () {
      this.loading = true
      this.$api.BasicSettingApi.Auxiliary.queryArchive({
        id: AUXILIARY_CONST.AUXILIARY_TYPE.SUPPLIER
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.fzData = result.rows
        }
      }).catch(e => {
        this.loading = false
      })
    },
    fetchData (flag) {
      this.showLoading('数据处理中，请稍候...')
      this.$api.GeneralInventoryApi.InventorySetting.query().then(result => {
        this.closeLoading()
        if (result.success) {
          this.formData = result.rows
          if (flag) { this.successMsg('取消成功') }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    onSave () {
      if (!this.ischannel && this.formData.chcbjzfs !== 1) { // 选中非大类的情况
        const tips = '成本核算方式为<font color="blue">非存货大类</font>核算方式，存货档案中的[<font color="blue">存货分类</font>]数据会自动清空，是否继续保存？'
        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true
        }).then(() => {
          this.saveInfo('N')
        }).catch(e => {
        })
      } else {
        this.saveInfo('N')
      }
    },
    saveInfo (isqzsave) {
      this.showLoading('正在保存...')
      this.formData.isqzsave = isqzsave
      this.$api.GeneralInventoryApi.InventorySetting.save(this.formData).then(result => {
        this.closeLoading()
        if (result.success) {
          if (!result.rows.errorinfo) {
            this.successMsg(result.msg)
            // this.fetchData()
          } else {
            const errors = result.rows.errorinfo.split('<br>')
            let errinfo = '<ul class="warning-list">'
            for (const err of errors) {
              if (err) {
                if (err.includes('启用存货大类') || err.includes('启用明细核算')) {
                  errinfo = errinfo + '<li style ="list-style:none">' + err + '</li>'
                } else {
                  errinfo = errinfo + '<li style ="margin-left:20px">' + err + '</li>'
                }
              }
            }
            errinfo = errinfo + '<li style ="margin-left:20px">请到[ <font color ="blue">会计科目</font> ]节点修改以上科目，否则会产生未知错误。</li></ul>'
            this.$confirm(errinfo, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              iconClass: 'el-icon-warning-outline',
              center: true,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              customClass: 'custom-message-box',
              dangerouslyUseHTMLString: true
            }).then(() => {
              this.saveInfo('Y')
            }).catch(e => {
            })
          }
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.closeLoading()
      })
    },
    cancelEdit () {
      this.fetchData(true)
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
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(result1 => {
        this.showLoading('正在设置...')
        this.initfz()
        this.$api.GeneralInventoryApi.InventorySetting.setdefaultvalue().then(result => {
          this.closeLoading()
          if (result.success) {
            this.successMsg(result.msg)
            this.formData = result.rows
          }
        }).catch(e => {
        })
      }).catch(e => {
      })
    },
    bmHandleChange (newValue) {
    },

    showSM () {
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped>
  [v-cloak] {
    display: none;
  }
</style>
