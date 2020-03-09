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
              v-model="dateTime"
            ></el-input>
          </el-form-item>
          <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
            <h4>图片查询</h4>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span style="margin-left:14px;">公司：</span>
              <div
                class="demo-input-suffix"
                @click="CompeData"
                style="width:70%; margin-right:15px;"
              >
                <el-select
                  v-model="valueda"
                  filterable
                  placeholder="请选择公司"
                  style="width:100%; margin-right:15px;"
                >
                  <el-option
                    v-for="item in optionsval"
                    :key="item.pk_gs"
                    :label="item.uname"
                    :value="item.pk_gs"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span style="margin-left:14px;">状态：</span>
              <el-select
                v-model="optionsVal"
                placeholder="请选择"
                style="width:70%; margin-right:15px;"
              >
                <el-option
                  v-for="item in optionsValue"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span>
                <el-radio v-model="radios" label="serSc">入账日期</el-radio>：
              </span>
              <el-date-picker
                v-model="valueDate"
                type="daterange"
                unlink-panels
                :clearable="false"
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                value-format="yyyy-MM-dd"
                :picker-options="monthPickerOptions"
                style="width:70%; margin-right:15px;"
                @change="ase"
              >></el-date-picker>
            </div>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span>
                <el-radio v-model="radios" label="serRz">上传日期：</el-radio>
              </span>
              <el-date-picker
                v-model="valueDates"
                :clearable="false"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                value-format="yyyy-MM-dd"
                :picker-options="monthPickerOptions"
                style="width:70%; margin-right:15px;"
                 @change="ases"
              >></el-date-picker>
            </div>
            <div style="text-align: right;margin-top: 12px">
              <el-button @click="openold">取 消</el-button>
              <el-button type="primary" @click="addpacruse">确 定</el-button>
            </div>
          </el-popover>
          <el-form-item label="公司:" size="small" label-width="50px" style="float: left">
            <span>{{pknames.uname}}</span>
          </el-form-item>
          <!-- </el-form-item> -->
          <el-row style="float:right;margin-right:14px" size="small">
            <el-button @click="setback">返回票据统计</el-button>
            <el-button @click="refash">刷新</el-button>
            <el-button id="clase" @click="handleCheckAllChange">
              全选
              <!-- <el-checkbox v-model="checkAll" >全选</el-checkbox> -->
            </el-button>
            <el-button @click="quanxiao">全消</el-button>
            <el-button @click="zuofei">作废</el-button>
          </el-row>
        </el-form>
      </header>

    <div class="contents">
      <div class="contes-left" style="display:flex;width:100%;height:100%;flex-wrap:wrap;">
        <div v-for="(item,index) in listDatas" :key="index" style="margin:5px 5px 5px 5px">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox :label="item">
              <div style="height:150px;width:210px;">
                <img
                  :src="imgurl + '/zncs/gl_imgview/search?id=' + item.bid + '&name=' + item.imgname + '&pk_corp=' + item.corpId + '&isSmall=Y&X-Login-Corp='+usercorp+'&X-Login-Date='+userdata+'&X-Login-User='+user+'&X-ACCESS-TOKEN='+usertoken"
                  alt
                  style="width:200px;height:140px"
                />
                <p style="height:40px;line-height:45px;text-align:center">{{item.imgname}}</p>
              </div>

              <div>
                <img
                  style="position: absolute; display: block; top: 60px; left: 51px;"
                  v-if="item.istate === 18"
                  src="@/assets/img/sbz.png"
                  alt
                />
                <img
                  style="position: absolute; display: block; top: 60px; left: 51px;"
                  v-if="item.istate === 205"
                  src="@/assets/img/yzf.png"
                  alt
                />
                <img
                  style="position: absolute; display: block; top: 60px; left: 51px;"
                  v-if="item.istate === 0"
                  src="@/assets/img/wzz.png"
                  alt
                />
                <img
                  style="position: absolute; display: block; top: 60px; left: 51px;"
                  v-if="item.istate === 100||item.istate === 101"
                  src="@/assets/img/yzz.png"
                  alt
                />

              </div>
              <a href="#" v-if="item.istate === 100||item.istate === 101" style=" width:200px;height:45px;position: absolute;top: 120px; left: 0px; width:100%;height:40px;text-align:center;background:rgba(0,0,0,.3);line-height:45px;color:#000;font-size:18px" @click="jumppz(item.bid)">联查凭证</a>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="contes-right">
        <p @click="openif">图片信息</p>
        <ul
          style="list-style: none; margin-left:24px;margin-top:15px;height:80%;overflow: hidden;overflow-y:auto;"
          v-if="openshow"
        >
          <li v-if="selec.corpcode">
            <b>公司编码：</b>
            {{selec.corpcode||''}}
          </li>
          <li v-if="selec.imgname">
            <b>图片名称：</b>
            {{selec.imgname||''}}
          </li>
          <li v-if="moren.webid">
            <b>图片ID：</b>
            {{moren.webid||''}}
          </li>
          <li v-if="openas">
            <b>图片状态：</b>
            {{morenae.istate==0?'未做账':morenae.istate===80?'已退回':morenae.istate===100 ||morenae.istate===101?'已做账':morenae.istate===205?'已作废':morenae.istate===18?'识别中':'处理中'}}
          </li>
           <li v-if="moren.mny">
            <b>金额：</b>
            {{moren.mny||''}}
          </li>
          <li v-if="showis">
            <b>银行名称：</b>
            {{moren.vsaleopenacc||''}}
          </li>
           <li v-if="moren.invoicetype">
            <b>票据类型：</b>
            {{moren.invoicetype||''}}
          </li>
          <li v-if="moren.keywords">
            <b>关键字：</b>
            {{moren.keywords||''}}
          </li>
          <li v-if="showisa">
            <b>发票号码：</b>
            {{moren.vinvoiceno||''}}
          </li>
          <li v-if="showisa">
            <b>发票代码：</b>
            {{moren.vinvoicecode||''}}
          </li>
          <li v-if="moren.dinvoicedate">
            <b>开票日期：</b>
            {{moren.dinvoicedate||''}}
          </li>
          <li v-if="showisa">
            <b>销售方名称：</b>
            {{moren.vsalename||''}}
          </li>
          <li v-if="showisa">
            <b>销售方纳税号：</b>
            {{moren.vsaletaxno||''}}
          </li>
          <li v-if="showisa">
            <b>购买方名称</b>
            {{moren.vpurchname||''}}
          </li>
          <li v-if="showisa">
            <b>购买方纳税号：</b>
            {{moren.vpurchtaxno||''}}
          </li>
           <li v-if="showisa">
            <b>备注：</b>
            {{moren.vmemo||''}}
          </li>
          <li v-if="showisa">
            <b >货物或应税劳务名称：<span v-for="(item,index) in moren.children" :key='index' style=" font-weight:500;font-size:14px;">{{item.invname||''}}</span></b>
          </li>
           <li v-if="moren.invtype">
            <b>规格型号：</b>
            {{moren.invtype||''}}
          </li>
           <li v-if="showisa">
            <b>单位：<span v-for="(item,index) in moren.children" :key='index' style=" font-weight:500;font-size:14px;">{{item.itemunit||''}},</span></b>
          </li>
           <li v-if="showis">
            <b>金额：<span v-for="(item,index) in moren.children" :key='index' style=" font-weight:500;font-size:14px;">{{item.itemmny||''}},</span></b>
            {{moren.itemmny||''}}
          </li>
           <li v-if="showisa">
            <b>税率：<span v-for="(item,index) in moren.children" :key='index' style=" font-weight:500;font-size:14px;">{{item.itemtaxrate||''}},</span> </b>
            {{moren.itemtaxrate||''}}
          </li>
              <li v-if="showisa">
            <b>税额：<span v-for="(item,index) in moren.children" :key='index' style=" font-weight:500;font-size:14px;">{{item.itemtaxmny||''}},</span> </b>
            {{moren.itemtaxmny||''}}
          </li>
           <li v-if="showisa">
            <b>价税合计：</b>
            {{moren.ntotaltax||''}}
          </li>
           <li v-if="showis">
            <b>付款方名称：</b>
            {{moren.vpurchname||''}}
          </li>
           <li v-if="showis">
            <b>付款行名称：</b>
            {{moren.vpurbankname||''}}
          </li>
          <li v-if="showis">
            <b>付款方账号：</b>
            {{moren.vpurchtaxno||''}}
          </li>
           <li v-if="showis">
            <b>收款方名称：</b>
            {{moren.vsalename||''}}
          </li>
          <li v-if="showis">
            <b>收款行名称：</b>
            {{moren.vsalebankname||''}}
          </li>
          <li v-if="showis">
            <b>收款方账号：</b>
            {{moren.vsaletaxno||''}}
          </li>
           <li v-if="showis">
            <b>金额：</b>
            {{moren.ntotaltax||''}}
          </li>
          <li v-if="vmemos">
            <b>税项明细：</b>
            {{moren.vmemo||''}}
          </li>
            <li v-if="showis">
            <b>备注：</b>
            {{moren.vsalephoneaddr||''}}
          </li>
            <li v-if="moren.memo">
            <b>摘要：</b>
            {{moren.memo||''}}
          </li>
           <li v-if="moren.smode">
            <b>结算方式：</b>
            {{moren.smode||''}}
          </li>
           <li v-if="moren.coperatorname">
            <b>上 传 者：</b>
            {{moren.coperatorname||''}}
          </li>
           <li v-if="moren.doperatedate">
            <b>上传时间：</b>
            {{moren.doperatedate||''}}
          </li>
             <li v-if="moren.corpname">
            <b>所属公司：</b>
            {{moren.corpname||''}}
          </li>
        </ul>
        <div v-if="ksshow">
          <p @click="openis">快速制单</p>
          <el-form :model="rulesForm" ref="refname" class="el-item" size="mini" v-if="ksshows">
            <el-form-item label="业务类型" :label-width="formLabelWidth" prop>
              <el-select v-model="rulesForm.businessType" placeholder="请选择" @change="tabse" style="position: relative;width:90%" >
                <el-option
                  v-for="item in optionsyewu"
                  :key="item.pk_model_h"
                  :label="item.busitempname"
                  :value="item.pk_model_h"
                ></el-option>
              </el-select>
            <i class="el-icon-plus" style='position: absolute;top:7px;right:23%;' @click="jumplink"></i>
            </el-form-item>
            <el-form-item label="票据类型" :label-width="formLabelWidth" prop>
              <el-select v-model="rulesForm.billType" placeholder="请选择" style="width:90%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算类型" :label-width="formLabelWidth" prop>
              <el-select v-model="rulesForm.settleMethod" placeholder="请选择" style="width:90%">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="总金额" :label-width="formLabelWidth" prop>
              <el-input v-model="rulesForm.totalmny" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="摘要" :label-width="formLabelWidth" prop>
              <el-input v-model="rulesForm.summary" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop>
              <el-input v-model="rulesForm.remark" style="width:90%"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="dialog-footer" style="text-align:right">
                <el-button type="primary" @click="openDialog('refname')">制 单</el-button>
                <el-button @click="closeDialog('refname')">取 消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
     <el-dialog title="提示" :visible.sync="imgdalog" width="30%" :before-close="handleClose" style>
     <div>
       确定要作废{{num.length}}张图片吗？作废后不可恢复。
     </div>
      <div slot="footer" class="dialog__footer" >
        <el-button @click="imgdalog = false">取 消</el-button>
        <el-button type="primary" @click="saveMergezuofei">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { prefix } from '@/libs/axios'
import { getMonthBegin, getMonthEnd } from '@/utils'
import Header from '../../components/Header'
import Compe from '../../components/Mycompe'
import * as MsgUtil from '../../msg-util'
import datePickerMixin from '@/mixins/date-picker'
export default {
  mixins: [datePickerMixin],
  props: {
    listData: {
      type: Array
    },
    numa: {
      type: Number,
      default: 0
    },
    timedata: {
      type: String,
      default: ''
    },
    radio: {
      type: String,
      default: 'serSc'
    },
    pkname: {
      type: Object,
      required: true
    }
  },
  name: 'tpyls',
  components: {
    Header,
    Compe
  },
  data () {
    // const loginPeriod = this.$store.getters.getLoginDate
    return {
      imgdalog: false,
      pknames: {},
      visiblePopover: false,
      dateTime: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      IsShowDate: true,
      imgurl: prefix,
      user: this.$store.getters.getUserId,
      userdata: this.$store.getters.getLoginDate,
      usercorp: this.$store.getters.getLoginCorpId,
      usertoken: this.$store.getters.getToken,
      optionsyewu: [],
      options: [],
      formLabelWidth: '120px',
      openshow: true,
      openkuaizhi: false,
      selec: {},
      checkedCities: [],
      checkAll: false,
      isIndeterminate: true,
      openCompe: false,
      openImg: false,
      logins: 1,
      lists: [],
      optionsVal: 0,
      radios: 'serSc',
      startDate: '',
      valueDate: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      valueDates: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      begindate2: '',
      enddate2: '',
      endDate: '',
      optionsValue: [
        {
          value: 0,
          label: '全部'
        }, {
          value: 4,
          label: '已做账'
        }, {
          value: 10,
          label: '未做帐'
        }, {
          value: 16,
          label: '已作废'
        }, {
          value: 18,
          label: '识别中'
        }],
      serDays: {},
      headform: true,
      listDatas: [],
      listphoto: null,
      nums: '',
      optionsval: this.$store.getters.corps,
      valueda: this.$store.getters.currentCorp.pk_gs,
      ksshow: false,
      rulesForm: {
        businessType: '费用报销单',
        billType: '其他票据',
        settleMethod: '银行支出',
        summary: '办公费'
      },
      listase: {},
      arr: [],
      pickerOptions: this.datePicker(),
      arrsy: [],
      moren: {},
      showis: false,
      showisa: false,
      vmemos: false,
      openas: false,
      morenae: {},
      strarr: [],
      stryar: [],
      num: [],
      zuofies: false,
      numas: 0,
      ars: false
    }
  },
  mounted () {
    this.numas = this.numa
    // this.addpacruse(this.numas)
    // console.log(this.$route.params.businessTypep)
    if (this.$route.params.businessTypep !== undefined) {
      this.rulesForm.businessTypep = this.$route.params.businessTypep
    }
    // 监听
    this.$bus.$off('updateBusiInfo')
    this.$bus.$on('updateBusiInfo', (data) => {
      this.$api.linkAssets.getyewu({
        isquickcreate: 'Y'
      }).then(res => {
        console.log(res)
        this.optionsyewu = res.rows
      })
      this.rulesForm.businessType = data.pk_model_h
      this.$api.linkAssets.photozy({pk_model_h: this.rulesForm.businessType}).then(res => {
        if (res.success) {
          res.rows.forEach(vals => {
            this.rulesForm.summary = vals.zy
          })
        }
      })
      this.rulesForm.billType = data.vspstylename
      this.rulesForm.settleMethod = data.szstylename
    })

    this.listDatas = this.listData
    this.radios = this.radio
    if (this.timedata) {
      if (this.radio === 'serSc') {
        this.valueDate = this.timedata.split('~')
      } else if (this.radio === 'serRz') {
        this.valueDates = this.timedata.split('~')
      }
    }
    this.dateTime = this.timedata
    this.pknames = this.pkname
  },
  methods: {
    handleClose () {
      this.imgdalog = false
    },
    ase () {
      this.radios = 'serSc'
    },
    ases () {
      this.radios = 'serRz'
    },
    jumppz (bid) {
      let datas = []
      let id = ''
      this.$api.linkAssets.photopz({pk_tzpz_h: bid}).then(res => {
        if (res.success) {
          datas = res.rows
          datas.map(item => {
            id = item.id
          })
          this.$router.push({
            name: 'voucher-edit',
            params: {
              id: id
            }
          })
        }
      })
    },
    jumplink () {
      this.$router.push({
        name: 'business-type-template',
        params: {
          routerParam: {
            seq: 6,
            action: 'add'
          }
        }
      })
      // this.$router.push({
      //   name: 'business-type-template',
      //   query: {
      //     action: 'action'
      //   }
      // })
      // this.$router.push({
      //   name: 'business-type-template',
      //   params: {
      //     action: 'add'
      //   }
      // })
    },
    gettime () {
      if (this.radios === 'serSc') {
        this.dateTime = this.valueDate[0] + '~' + this.valueDate[1]
      } else if (this.radios === 'serRz') {
        this.dateTime = this.valueDates[0] + '~' + this.valueDates[1]
      } else {
        this.dateTime = this.rdate
      }
    },
    tabse (val) {
      this.$api.linkAssets.photozy({pk_model_h: val}).then(res => {
        if (res.success) {
          this.rulesForm.summary = ''
          res.rows.forEach(vals => {
            this.rulesForm.summary = vals.zy
          })
        }
      })
      this.listase = this.optionsyewu.find(item => {
        return this.rulesForm.businessType === item.pk_model_h
      })
      this.rulesForm.billType = this.listase.vspstylename
      this.rulesForm.settleMethod = this.listase.szstylename
    },
    openDialog () {
      this.arr.push(this.selec.pid)
      this.rulesForm.pk_model_h = this.listase.pk_model_h || this.rulesForm.businessType
      this.rulesForm.businessType = this.listase.busitempname
      this.rulesForm.pk_image_group = this.selec.invoice_info.pk_image_group
      this.rulesForm.mergeGroup = this.unique(this.arr)
      this.rulesForm.vch_date = this.selec.cvoucherdate
      const loading = MsgUtil.loading(this, '正在制单...')
      this.$api.linkAssets.getzhidan({ data: JSON.stringify(this.rulesForm) }).then(res => {
        loading.close()
        if (res.success) {
          this.refash()
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
    },
    openis () {
      this.ksshows = true
      this.openshow = false
    },
    openif () {
      this.ksshows = false
      this.openshow = true
    },
    openold () {
      this.visiblePopover = false
    },

    quanxiao () {
      this.num = []
      this.arrsy = []
      this.stryar = []
      this.arrsy = []
      this.checkedCities = []
      this.isIndeterminate = false
    },
    CompeData () {
      this.openCompe = true
    },
    setback () {
      this.gettime()
      console.log(this.list, 'qweq')
      this.$bus.$emit('openset', false)
    },
    handleCheckAllChange () {
      this.isIndeterminate = true
      this.checkedCities = this.listDatas
      this.num = this.listDatas
      this.listDatas.forEach(item => {
        if (item.sourcemode === 1) {
          this.strarr.push(item.pid)
        } else {
          this.stryar.push(item.bid)
        }
        this.arrsy.push(item.pid)
      })
    },
    handleCheckedCitiesChange (value) {
      this.ars = false
      this.num = value
      console.log(this.num)
      this.openas = true
      this.selec = {}
      value.forEach(item => {
        this.selec = item
        if (item.istate === 0) {
          this.ksshow = true
          this.ksshows = true
          this.openshow = false
          this.$api.linkAssets.getyewu({
            isquickcreate: 'Y'
          }).then(res => {
            this.optionsyewu = res.rows
            // this.$api.linkAssets.photozy({pk_model_h: this.rulesForm.businessType}).then(res => {
            //   if (res.success) {
            //     res.rows.forEach(vals => {
            //       this.rulesForm.summary = vals.zy
            //     })
            //   }
            // })
          })
        } else {
          this.ksshow = false
        }
      })
      this.moren = JSON.parse(JSON.stringify(this.selec))
      this.morenae = JSON.parse(JSON.stringify(this.selec))
      if (this.selec.invoice_info != undefined) {
        const type = this.selec.invoice_info.istate
        if (type && (type.indexOf('增值税') > -1 || type.indexOf('机动车') > -1 || type.indexOf('农产品') > -1)) {
          this.showis = false
          this.showisa = true
          this.moren = JSON.parse(JSON.stringify(this.selec.invoice_info))
        } else if (type && (type.indexOf('b') > -1)) {
          this.showisa = false
          this.showis = true
          this.moren = JSON.parse(JSON.stringify(this.selec.invoice_info))
          if (type.indexOf('b电子缴税付款凭证') > -1 || type.indexOf('b社保') > -1) {
            this.vmemos = true
          }
        }
      }
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    zuofei () {
      this.imgdalog = true
    },
    saveMergezuofei () {
      this.unique(this.num).map(item => {
        if (item.sourcemode === 1) {
          this.strarr.push(item.pid)
        } else {
          this.stryar.push(item.bid)
        }
        this.arrsy.push(item.pid)
      })
      const loading = MsgUtil.loading(this, '正在作废...')
      this.$api.linkAssets.zuofeiphoto({
        desc: '退回图片',
        delTelData: this.unique(this.strarr).join(','),
        delOthData: this.unique(this.stryar).join(','),
        clzBidDate: this.unique(this.arrsy).join(',')
      }).then(res => {
        loading.close()
        this.handleClose()
        if (res.success) {
          this.ars = true
          this.arrsy = []
          this.stryar = []
          this.arrsy = []
          this.checkedCities = []
          if (this.numas === 0) {
            this.addpacruse(0)
          } else if (this.numas === 18) {
            this.addpacruse(18)
          } else {
            this.addpacruse(10)
          }
          if (res.msg) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
        } else {
          if (res.msg) {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }
      })
    },
    addpacruse (alse) {
      this.pknames = this.optionsval.find(item => {
        return item.pk_gs === this.valueda
      })
      this.headform = false
      this.visiblePopover = false
      if (this.radios === 'serSc') {
        this.serDays = JSON.parse(JSON.stringify({
          begindate: this.valueDate[0],
          enddate: this.valueDate[1]
        }))
      } else if (this.radios === 'serRz') {
        // this.dateTime = this.startyear2 + '-' + this.startmonth2 + '--' + this.endyear2 + '-' + this.endmonth2
        this.serDays = JSON.parse(JSON.stringify({
          begindate2: this.valueDates[0],
          enddate2: this.valueDates[1]
        }))
      }
      const loading = MsgUtil.loading(this, '正在查询...')
      this.$api.linkAssets.getphoto({
        serdate: this.radios,
        pk_corp: this.valueda,
        pic_status: alse || this.optionsVal === 0 ? 0 : this.optionsVal,
        ...this.serDays

      }).then(res => {
        loading.close()
        this.headform = true
        this.openold()
        if (res.success) {
          this.listDatas = res.rows
          if (res.msg) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
        } else {
          if (res.msg) {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }
      })
    },
    refash () {
      if (this.radios === 'serSc') {
        this.serDays = JSON.parse(JSON.stringify({
          begindate: this.valueDate[0],
          enddate: this.valueDate[1]
        }))
      } else if (this.radios === 'serRz') {
        // this.dateTime = this.startyear2 + '-' + this.startmonth2 + '--' + this.endyear2 + '-' + this.endmonth2
        this.serDays = JSON.parse(JSON.stringify({
          begindate2: this.valueDates[0],
          enddate2: this.valueDates[1]
        }))
      }
      const loading = MsgUtil.loading(this, '正在刷新...')
      this.$api.linkAssets.getphoto({
        serdate: this.radios,
        pk_corp: this.$store.getters.currentCorp.pk_gs,
        pic_status: this.numa || this.optionsVal,
        ...this.serDays
      }).then(res => {
        loading.close()
        if (res.success) {
          this.listDatas = res.rows
          if (res.msg) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
        } else {
          if (res.msg) {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }
      })
    }, //
    datePicker () {
      const self = this
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.qcdate
          if (jzDate) {
            return period < jzDate.substring(0, 7)
          } else {
            return false
          }
        }
      }
    }
  },
  created () {
    this.$api.linkAssets.photozy({pk_model_h: this.rulesForm.businessType}).then(res => {
      if (res.success) {
        res.rows.forEach(vals => {
          this.rulesForm.summary = vals.zy
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
.section {
  width: 100%;
}
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  display: flex;
  background: #f4f4f4;

  .contes-left {
    width: 70%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    overflow-y: auto;
  }
  .contes-right {
    width: 30%;
    height: 100%;
    p {
      width: 98%;
      height: 45px;
      font-size: 14px;
      text-align: center;
      line-height: 45px;
      background: #eeeff1;
      border-bottom: 1px #ddd solid;
      cursor: pointer ;
      margin-left: 2%;
    }
    ul {
      height: 400px;
      li {
        padding-top: 10px;
        b {
          font-size: 16px;
        }
      }
    }
  }
}
/deep/.el-checkbox__input {
  position: absolute;
  left: 0;
  top: 0;
}
#clase {
  /deep/.el-checkbox__inner {
    display: none;

  }
}
</style>
