<template>
  <div class="app-main">
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
      <div class="kj-main" >
        <el-form
          :inline="true"
          :model="formData"
          ref="formRef"
          size="mini"
          label-width="130px"
          style="margin: 0 auto; width: 700px">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">采购业务科目</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-radio v-model="formData.cgfkfs" :label="0">
                <el-form-item  style="margin-left: -25px;" label="现金付款科目" prop="xjfk">
                  <el-select  v-model="formData.xjfk" default-first-option  placeholder="请选择"  filterable  style="width:174px">
                    <el-option v-for="item in options"  :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                      <span style="float: left">{{ item.codefullname }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio v-model="formData.cgfkfs" :label="1">
                <el-form-item  style="margin-left: -25px;" label="应付账款科目" prop="yfzk">
                  <el-select v-model="formData.yfzk" default-first-option placeholder="请选择" filterable  style="width:174px">
                    <el-option v-for="item in options" :key="item.id" :label="item.codefullname"  :value="item.id" :disabled="item.disabled">
                      <span style="float: left">{{ item.codefullname }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-radio>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">暂估入库科目</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="暂估入库贷方科目" prop="zgrkdfkm">
                <el-select  v-model="formData.zgrkdfkm" default-first-option placeholder="请选择" filterable style="width:174px"  @change="bmHandleChange(formData.zgrkdfkm)" >
                  <el-option  v-for="item in options" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled" >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商辅助核算" prop="zgkhfz" v-if="iszg">
                <el-select v-model="formData.zgkhfz"  default-first-option placeholder="请选择" filterable style="width:174px" >
                  <el-option  v-for="item in opsitionfuzhu" :key="item.id"  :label="item.code ? item.code + ' / ' + item.name : item.name" :value="item.id"  :disabled="item.disabled"  style="width:174px" >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-tooltip style="margin-left:-8px;margin-top:5px"  v-if="iszg"  effect="light" content="请在会计科目中增加“应付账款-暂估入库”下级科目或者辅助核算科目" placement="bottom">
                <el-image :src="srcList[0]"></el-image>
              </el-tooltip>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">其他入库科目</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="其他入库科目" prop="v1">
                <el-select  v-model="formData.v1"  default-first-option placeholder="请选择" filterable  style="width:174px"  >
                  <el-option  v-for="item in options" :key="item.id"  :label="item.codefullname" :value="item.id" :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他入库对方科目" prop="v2">
                <el-select  v-model="formData.v2"   default-first-option  placeholder="请选择"  filterable style="width:174px" >
                  <el-option v-for="item in options"  :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">销售业务科目</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-radio v-model="formData.xsfkfs" :label="0">
                <el-form-item  style="margin-left: -25px;" label="现金收款科目" prop="xjsk">
                  <el-select  v-model="formData.xjsk" default-first-option  placeholder="请选择"  filterable  style="width:174px"  >
                    <el-option  v-for="item in options" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled"  >
                      <span style="float: left">{{ item.codefullname }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-radio>
            </el-col>
            <el-col :span="12">
              <el-radio v-model="formData.xsfkfs" :label="1">
                <el-form-item  style="margin-left: -25px;" label="应收账款科目" prop="yszk" id="come">
                  <el-select  v-model="formData.yszk" default-first-option  placeholder="请选择" filterable  style="width:174px"  >
                    <el-option  v-for="item in options" :key="item.id"  :label="item.codefullname"  :value="item.id"  :disabled="item.disabled" >
                      <span style="float: left">{{ item.codefullname }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-radio>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品销售收入科目" prop="yysr">
                <el-select  v-model="formData.yysr"  default-first-option  placeholder="请选择"  filterable  style="width:174px"  >
                  <el-option v-for="item in options"  :key="item.id" :label="item.codefullname" :value="item.id"  :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="材料销售收入科目" prop="clsr">
                <el-select  v-model="formData.clsr"  default-first-option  placeholder="请选择"  filterable  style="width:174px"  >
                  <el-option  v-for="item in options" :key="item.id" :label="item.codefullname" :value="item.id" :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应交销项税科目" prop="yjxxs">
                <el-select  v-model="formData.yjxxs"  default-first-option   placeholder="请选择"  filterable   style="width:174px" >
                  <el-option  v-for="item in options" :key="item.id"  :label="item.codefullname" :value="item.id"  :disabled="item.disabled">
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">生产领用材料</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="材料成本科目" prop="clcb">
                <el-select  v-model="formData.clcb" default-first-option  placeholder="请选择"  filterable  style="width:174px" >
                  <el-option  v-for="item in options" :key="item.id"  :label="item.codefullname" :value="item.id" :disabled="item.disabled" >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原材料科目" prop="ycl">
                <el-select  v-model="formData.ycl"  default-first-option placeholder="请选择"  filterable  style="width:174px"  >
                  <el-option v-for="item in options"  :key="item.id"  :label="item.codefullname" :value="item.id" :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">其他出库科目</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="其他出库对方科目" prop="v4">
                <el-select   v-model="formData.v4"  default-first-option  placeholder="请选择"  filterable  style="width:174px" >
                  <el-option  v-for="item in options" :key="item.id" :label="item.codefullname" :value="item.id"  :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他出库科目" prop="v3">
                <el-select  v-model="formData.v3" default-first-option  placeholder="请选择"  filterable  style="width:174px" >
                  <el-option  v-for="item in options"  :key="item.id"  :label="item.codefullname"  :value="item.id"  :disabled="item.disabled" >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">成本调整科目</div>
          <el-row style="margin-top:10px;">
            <el-col :span="12">
              <el-form-item label="成本科目" prop="v5">
                <el-select  v-model="formData.v5"  default-first-option  placeholder="请选择"  filterable  style="width:174px" >
                  <el-option  v-for="item in options" :key="item.id"  :label="item.codefullname"  :value="item.id" :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="存货科目" prop="v6">
                <el-select  v-model="formData.v6"  default-first-option  placeholder="请选择" filterable  style="width:174px"  >
                  <el-option  v-for="item in options"  :key="item.id" :label="item.codefullname" :value="item.id"  :disabled="item.disabled"  >
                    <span style="float: left">{{ item.codefullname }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import * as MsgUtil from '../../msg-util'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
import refreshDataMixin from '@/mixins/refresh-data'
export default {
  name: 'icset-setting',
  mixins: [refreshDataMixin],
  data () {
    return {
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      pk_corp: this.$store.getters.currentCorp.pk_gs,
      formData: {},
      opsitionfuzhu: []
    }
  },
  computed: {
    options () {
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
      const item = this.options.find(item => item.id === this.formData.zgrkdfkm)
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
          this.opsitionfuzhu = result.rows
        }
      }).catch(e => {
        this.loading = false
      })
    },
    fetchData (flag) {
      const loading = MsgUtil.loading(this, '数据处理中，请稍候...')
      this.$api.InventoryManageApi.IcsetSetting.query().then(result => {
        loading.close()
        if (result.success) {
          this.formData = result.rows
          if (flag) { MsgUtil.successMsg(this, '取消成功') }
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        loading.close()
      })
    },
    onSave () {
      const loading = MsgUtil.loading(this, '正在保存...')
      this.$api.InventoryManageApi.IcsetSetting.save(this.formData).then(result => {
        loading.close()
        if (result.success) {
          MsgUtil.successMsg(this, result.msg)
        } else {
          MsgUtil.errorMsg(this, result.msg)
        }
      }).catch(e => {
        loading.close()
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
        closeOnPressEscape: false
      }).then(result1 => {
        const loading = MsgUtil.loading(this, '正在设置...')
        this.$api.InventoryManageApi.IcsetSetting.saveGroup().then(result => {
          loading.close()
          if (result.success) {
            MsgUtil.successMsg(this, result.msg)
            this.formData = result.rows
          }
        }).catch(e => {
        })
      }).catch(e => {
      })
    },
    bmHandleChange (newValue) {
    }
  }
}
</script>
<style scoped>
  >>>.el-radio__inner {
    display: inline-block;
    margin-top: 6px;
  }
</style>
