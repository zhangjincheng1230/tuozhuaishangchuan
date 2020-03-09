<template>
  <div>
    <el-dialog
      id="addDialog"
      :title="buttonOpe === 'edit' ? '修改': '新增'"
      :visible.sync="visible"
      width="1120px"
      :close-on-click-modal="false"
      :modal="false"
      @close="closeDialog()">
      <div  class="form-container" :style="'max-height: ' + maxHeight +'px'">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="160px" :inline="true">
          <div class="titleBoxInfo">
            <span class="fontStyle">资产信息</span>
          </div>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="8">
              <el-form-item size="mini" label="卡片编号"  prop="ascode"  class="row-child">
                <el-input v-model="form.ascode" style="width: 182px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="资产编码"  prop="zcbm"  class="row-child">
                <el-input v-model="form.zcbm" style="width: 182px;"  maxlength="15" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="资产名称" prop="asname" class="row-child">
                <el-input v-model="form.asname" style="width: 182px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="8">
              <el-form-item size="mini" label="资产类别" prop="assetcate" class="row-child">
                <el-input
                  placeholder
                  suffix-icon="el-icon-search"
                  readonly
                  v-model="form.assetcate"
                  @click.native="openZclb"
                  style="width: 182px"
                ></el-input>
              </el-form-item>
              <el-form-item size="mini" label="资产类别id" prop="assetcate_id" class="row-child" style = "display: none">
                <el-input
                  v-model="form.assetcate_id"
                  style="width: 182px;display: none"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="资产属性"  prop="assetproperty"  class="row-child">
                <el-select v-model="form.assetproperty" style="width: 182px" disabled>
                  <el-option v-for="item in zcxss" :key="item.value" :value="item.value" :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="入账日期"   prop="dperiod" class="row-child" required>
                <el-date-picker type="date" v-model="form.dperiod" value-format="yyyy-MM-dd" style="width: 182px"></el-date-picker>
              </el-form-item>
              <el-form-item size="mini" label="开始使用日期"   prop="adate" class="row-child" required style = "display: none">
                <el-date-picker type="date" v-model="form.adate" value-format="yyyy-MM-dd" style="width: 182px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="8">
              <el-form-item size="mini" label="原值" prop="atmny" class="row-child">
                <el-input-number v-model="form.atmny" style="width: 182px;" :precision="2"  :controls = "false" @change="yzChange"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="进项税额" v-if="isYbr"  prop="jxsf"  class="row-child">
                <el-input-number v-model="form.jxsf" style="width: 182px;" :precision="2"  :controls = "false" @change="calAssetSumRes" ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="合计" prop="sumres" v-if="isYbr" class="row-child">
                <el-input-number v-model="form.sumres" :precision="2"  :controls = "false" style="width: 182px;" readonly></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around" style="margin-bottom: 5px;">
            <el-col :span="24">
              <el-form-item size="mini" prop="memo" label="备注">
                <el-input v-model="form.memo" type="textarea"
                          resize="none" :rows="3" style="width: 400%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="titleBoxInfo">
            <span class="fontStyle">折旧信息</span>
          </div>
          <el-row type="flex" class="row-bg" justify="start">
            <el-col :span="8">
              <el-form-item size="mini" label="折旧方式" prop="zjtype" class="row-child">
                <el-select v-model="form.zjtype" style="width: 182px">
                  <el-option v-for="item in zjType" :key="item.value" :value="item.value" :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if = "!isGzl">
              <el-form-item  size="mini" label="预计使用年限" prop="ulimit" class="row-child">
                <el-input-number v-model="form.ulimit" :controls = "false" style="width: 176px" @change="ulimitChange"></el-input-number> 月
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if = "!isGzl && !isNszh">
              <el-form-item  size="mini" label="月折旧额" prop="nmzj"  class="row-child">
                <el-input-number v-model="form.nmzj" style="width: 182px;"  :precision="2"  :controls = "false"  disabled></el-input-number>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if = "isGzl">
              <el-form-item  size="mini" label="总工作量"  prop="gzzl" class="row-child">
                <el-input-number v-model="form.gzzl" :precision="2"  :controls = "false"  style="width: 182px" @change="gzzlChange"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8"  v-if = "isGzl">
              <el-form-item size="mini" label="工作量单位" prop="gzldw" class="row-child">
                <el-input v-model="form.gzldw" :controls = "false" style="width: 182px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="start">
            <el-col :span="8">
              <el-form-item size="mini" label="残值率" prop="sratio"   class="row-child">
                <el-input-number v-model="form.sratio" style="width: 182px;" @change="czlChange"  :min="0" :max="0.99" :precision="2"  :controls = "false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="预计残值" prop="ygcz"  class="row-child">
                <el-input-number v-model="form.ygcz" style="width: 182px;" @change="ygczChange" :precision="2"  :controls = "false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" label="资产净值" prop="asvalue"   class="row-child">
                <el-input-number v-model="form.asvalue" style="width: 182px;" :precision="2"  :controls = "false" disabled></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="start">
            <el-col :span="8" v-if = "buttonOpe === 'view'">
              <el-form-item  size="mini" label="已计提折旧期间" prop="depperiod" class="row-child">
                <el-input-number v-model="form.depperiod" :precision="2"  :controls = "false" style="width: 182px;" disabled></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if = "isGzl">
              <el-form-item size="mini" label="单位折旧"  prop="dwzj"  class="row-child">
                <el-input-number v-model="form.dwzj" :precision="2"  :controls = "false" style="width: 182px;" disabled></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if = "isGzl">
              <el-form-item size="mini" label="累计工作量"  prop="ljgzl"  class="row-child">
                <el-input-number v-model="form.ljgzl" :precision="2"  :controls = "false" style="width: 182px;" disabled></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item  size="mini" label="总累计折旧" prop="depation"  class="row-child">
                <el-input-number v-model="form.depation" :precision="2"  :controls = "false" style="width: 182px;" disabled></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if = "!isGzl">
              <el-form-item  prop="onetimezj"
                             size="mini" label-width="160px"
                             label="录入当期一次提足折旧" class="row-child">
                <el-select v-model="form.onetimezj" style="width: 182px">
                  <el-option label="否" value="N"></el-option>
                  <el-option label="是" value="Y"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg"  justify="start">
            <el-col :span="8">
              <el-form-item size="mini" label-width="160px" prop="periodbegin" label="录入前已生成凭证" @change="periodbeginChange">
                <el-select v-model="form.periodbegin" style="width: 182px">
                  <el-option label="否" value="N"></el-option>
                  <el-option label="是" value="Y"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if = "isGzl && isqc">
              <el-form-item size="mini" label="录入前累计工作量" prop="qcljgzl"  class="row-child">
                <el-input-number v-model="form.qcljgzl"  :controls = "false"  style="width: 182px;" @change="qcljgzlChange" ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if = "!isGzl && isqc">
              <el-form-item size="mini" label="录入前已提期间(月)" prop="initciation" class="row-child">
                <el-input-number v-model="form.initciation"  :controls = "false"  style="width: 182px;" @change="initciationChange" ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8"  v-if="isqc" >
              <el-form-item size="mini" label="录入前已提折旧"  prop="inittion" class="row-child">
                <el-input-number v-model="form.inittion" :precision="2"  :controls = "false"  style="width: 182px;" @change="inittionChange"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="titleBoxInfo">
            <span class="fontStyle">科目信息</span>
          </div>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="12">
              <el-form-item size="mini" label="固定(无形)资产科目" prop="zckm_id" class="row-child">
                <el-select
                  filterable
                  v-model="form.zckm_id"
                  :clearable = "true"
                  style="width: 300px">
                  <el-option
                    v-for="item in subjectRef"
                    :key="item.id"
                    :value="item.id"
                    :label="item.codename">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item size="mini" label="结算科目" prop="jskm_id" class="row-child" style="margin-right: 0px" >
                <el-select ref="jskmref" filterable @change="jskmIdChange(true)" @visible-change="jsvisiblechange"
                           v-model="form.jskm_id"
                           :clearable = "true" style="width: 300px"  v-popover:popoverfzxm :size="'mini'" no-match-text="  ">
                  <el-option v-for="item in subjectRef" :key="item.id" :value="item.id" :label="item.codename"></el-option>
                </el-select>
              </el-form-item>
              <el-popover v-model="jspopovershow" ref="popoverfzxm" trigger="click" transition="fade-in-linear" :visible-arrow="false"
                          width="300" @show="jspopovershowEvent" @hide="jspopoverHideEvent" >
                <el-form label-width="70px">
                  <el-form-item :label="itemfzlb.name" :key="'itemjsfzhs'+ itemfzlb.code" v-for="itemfzlb in jsfzlbarray">
                    <el-select v-model="form['jsfzhs'+ itemfzlb.code]" >
                      <el-option v-for="itemfzxm in fzxmmap[itemfzlb.id]" :key="itemfzxm.id" :value="itemfzxm.id" :label="itemfzxm.code + ' '+ itemfzxm.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-popover>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="12">
              <el-form-item size="mini" label="折旧(摊销)科目" prop="jtzjkm_id" class="row-child">
                <el-select
                  filterable
                  v-model="form.jtzjkm_id"
                  :clearable = "true"
                  style="width: 300px">
                  <el-option
                    v-for="item in subjectRef"
                    :key="item.id"
                    :value="item.id"
                    :label="item.codename">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item size="mini" label="折旧(摊销)费用科目"  @visible-change="zjfyvisiblechange" style="margin-right: 0px"
                            prop="zjfykm_id" class="row-child">
                <el-select ref="zjfykmref"
                           filterable v-model="form.zjfykm_id"
                           @change ="zjfykmIdChange(true)" @visible-change="zjfyvisiblechange"
                           no-match-text="  " :clearable = "true"  v-popover:zjfypopoverfzxm :size="'mini'" style="width: 300px">
                  <el-option
                    v-for="item in subjectRef"
                    :key="item.id"
                    :value="item.id"
                    :label="item.codename">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-popover v-model="zjfypopovershow" ref="zjfypopoverfzxm"  trigger="click" transition="fade-in-linear" :visible-arrow="false"
                          width="300" @show="zjfypopovershowEvent" @hide="zjfypopoverHideEvent"  >
                <el-form label-width="70px">
                  <el-form-item :label="itemfzlb.name" :key="'itemzjfyfzhs'+ itemfzlb.code" v-for="itemfzlb in zjfyfzlbarray">
                    <el-select v-model="form['zjfyfzhs'+ itemfzlb.code]"  >
                      <el-option v-for="itemfzxm in fzxmmap[itemfzlb.id]" :key="itemfzxm.id" :value="itemfzxm.id" :label="itemfzxm.code + ' '+ itemfzxm.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-popover>
            </el-col>
          </el-row>
          <!--结算辅助项目-->
          <el-form-item v-for="count11 in jsfznum" :key="'jsfzhs'+count11" :label="'jsfzhs'+count11" :prop="'jsfzhs'+count11" style = "display:none" >
            <el-input v-model="form['jsfzhs'+count11]" style="width: 220px;"></el-input>
          </el-form-item>
          <!--折旧费用辅助项目-->
          <el-form-item v-for="count11 in jsfznum" :key="'zjfyfzhs'+count11" :label="'zjfyfzhs'+count11" :prop="'zjfyfzhs'+count11"  style = "display:none">
            <el-input v-model="form['zjfyfzhs'+count11]" style="width: 182px;"></el-input>
          </el-form-item>
          <el-form-item prop="id_assetcard" style="display:none">
            <el-input v-model="form.id_assetcard" style="width: 182px;"></el-input>
          </el-form-item>
          <el-form-item prop="updatets" style="display:none">
            <el-input v-model="form.updatets" style="width: 182px;"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="saveForm" >保 存</el-button>
        </div>
      </template>
    </el-dialog>
    <AssetsTypeSelect ref="assetsTypeSelect" @findinde="zclbConfirm"></AssetsTypeSelect>
  </div>
</template>

<script>
import AssetsTypeSelect from '../../../components/AssetsTypeSelect'
import {accAdd, accDiv, accMul, accSubtr} from '@/utils'
import { ASSET_PROP, ZJ_TYPE } from '@/constants/asset'
import fzxmMixin from '@/mixins/report-fzxm'
import auxiliaryTypeMixin from '@/mixins/report-auxiliary-type'
export default {
  name: 'addDialog',
  mixins: [fzxmMixin, auxiliaryTypeMixin],
  data () {
    return {
      visible: false,
      buttonOpe: 'add', // 按钮来源 add 新增, edit 编辑, copy 复制
      openAssetsTypes: false, // 是否显示资产类别
      zjType: ZJ_TYPE, // 折旧信息
      zcxss: ASSET_PROP, // 资产属性
      subjectRef: [], // 科目信息
      rules: {
        asname: [{required: true, message: '资产名称为必输项', trigger: 'change'}],
        zcbm: [{ min: 0, max: 15, message: '长度在 0 到 15 个字符', trigger: 'blur' }],
        assetcate: [{required: true, message: '资产类别为必输项', trigger: 'change'}],
        atmny: [{required: true, message: '原值为必输项', trigger: 'change'}],
        dperiod: [{required: true, message: '入账日期为必输项', trigger: 'change'}],
        ulimit: [{required: true, message: '预计使用年限为必输项', trigger: 'change'}],
        zckm_id: [{required: true, message: '固定(无形)资产科目为必输项', trigger: 'change'}],
        jskm_id: [{required: true, message: '结算科目为必输项', trigger: 'change'}],
        jtzjkm_id: [{required: true, message: '折旧(摊销)科目为必输项', trigger: 'change'}],
        zjfykm_id: [{required: true, message: '折旧(摊销)费用科目为必输项', trigger: 'change'}],
        gzzl: [{required: true, message: '总工作量为必输项', trigger: 'change'}],
        gzldw: [{required: true, message: '工作量单位为必输项', trigger: 'change'}],
        memo: [{ max: 200, message: '输入内容介于0到200之间', trigger: 'change' }]
      },
      fzlbarray: [], // 辅助类别
      jsfznum: 10, // 结算辅助项的个数
      jsfzlbarray: null, // 结算辅助类别
      zjfyfzlbarray: null, // 折旧费用辅助类别
      // fzxmmap: {}, // 辅助项目
      jspopovershow: false, // 是否显示结算辅助项目
      zjfypopovershow: false, // 折旧费用是否显示
      form: this.getDefaultForm(),
      currrow: {} // 编辑传递的当前值
    }
  },
  props: {
    corpid: {}
  },
  watch: {
    // 'form.jskm_id': function () {
    //   this.jskmIdChange()
    // },
    // 'form.zjfykm_id': function () {
    //   this.zjfykmIdChange()
    // }
  },
  created () {
    this.queryfzlb()
    this.querySubjectRef()
  },
  components: {
    AssetsTypeSelect
  },
  computed: {
    maxHeight () {
      return this.$store.getters.maxDialogBodyHeight
    },
    // 是否是一般人
    isYbr () {
      return this.$store.getters.getLoginCorp.chname === '一般纳税人'
    },
    // 是否"工作量"折旧方式
    isGzl () {
      return this.form.zjtype === 1
    },
    // 是否"年数总和"折旧方式
    isNszh () {
      return this.form.zjtype === 3
    },
    // 是否期初资产
    isqc () {
      return this.form.periodbegin === 'Y'
    }
  },
  methods: {
    onSubjectInputKeyDown (e) {
      let keyCode = e.keyCode
      switch (keyCode) {
        case 9:
        case 13:
          e.stopPropagation()
          break
      }
    },
    // 结算框显示
    jsvisiblechange (val) {
      if (val) {
        setTimeout(s => {
          this.jspopovershow = true
        }, 300)
      }
    },
    zjfyvisiblechange (val) {
      if (val) {
        setTimeout(s => {
          this.zjfypopovershow = true
        }, 300)
      }
    },
    getDefaultForm () {
      return {
        adate: this.$store.getters.getLoginDate,
        dperiod: this.$store.getters.getLoginDate, // 入账日期
        amny: null,
        ascode: null,
        asname: null,
        assetcate: null,
        assetcate_id: null,
        assetproperty: null,
        asvalue: undefined, // 资产净值
        dwzj: undefined, // 单位折旧
        sratio: undefined, // 残值率
        ygcz: undefined, // 预计残值
        ljgzl: undefined, // 累计工作量
        initciation: undefined, // 录入前已提期间(月)
        inittion: undefined, // 录入前已提折旧
        nmzj: undefined, // 月折旧额
        periodbegin: 'N', // 录入前已生成凭证
        onetimezj: 'N', // 录入当期一次提足折旧
        ulimit: undefined, // 预计使用年限
        atmny: undefined, // 原值
        clear: null, // 是否清理资产
        jxsf: undefined, // 进项税额
        coid: null,
        ddate: null,
        depdate: null,
        fpid: null,
        fpmxid: null,
        groupid: null,
        gzzl: undefined,
        gzldw: undefined,
        depation: null,
        id_assetcard: null,
        id_corp: null,
        jsfzhs1: null,
        jsfzhs10: null,
        jsfzhs2: null,
        jsfzhs3: null,
        jsfzhs4: null,
        jsfzhs5: null,
        jsfzhs6: null,
        jsfzhs7: null,
        jsfzhs8: null,
        jsfzhs9: null,
        jskm: '',
        jskm_id: null,
        jtzjkm: '',
        jtzjkm_id: null,
        memo: null,
        page: 1,
        rows: 500,
        togl: null,
        parent_id: null,
        primaryKey: null,
        qcvalue: null,
        sourtype: null,
        status: null,
        sumres: null,
        ts: null,
        updatets: null,
        uperiod: null,
        usedperiod: null,
        voucherno: null,
        zcbm: null,
        zckm: '',
        zckm_id: null,
        zjfyfzhs1: null,
        zjfyfzhs10: null,
        zjfyfzhs2: null,
        zjfyfzhs3: null,
        zjfyfzhs4: null,
        zjfyfzhs5: null,
        zjfyfzhs6: null,
        zjfyfzhs7: null,
        zjfyfzhs8: null,
        zjfyfzhs9: null,
        zjfykm: '',
        zjfykm_id: null,
        zjtype: 0,
        qcljgzl: null,
        depperiod: undefined // 已计提折旧期间
      }
    },
    querySubjectRef () {
      this.$api.BasicSettingApi.Subject.getSubjectRefByPkCorp(this.corpid).then(result => {
        if (result.success === true) {
          this.subjectRef = result.rows
        }
      })
    },
    // 结算辅助项目显示
    jspopovershowEvent () {
      if (this.jsfzlbarray === null) {
        this.jspopovershow = false
      }
    },
    // 结算辅助项目显示
    zjfypopovershowEvent () {
      if (this.zjfyfzlbarray === null) {
        this.zjfypopovershow = false
      }
    },
    // 结算辅助项目隐藏
    jspopoverHideEvent () {
      // 找到对应的辅助项目
      // 找到对应的科目名称
      let name = ''
      for (const t of this.subjectRef) {
        if (t.id === this.form.jskm_id) {
          name = t.codename
          break
        }
      }
      for (let i = 1; i <= 10; i++) {
        if (this.form['jsfzhs' + i] && this.form['jsfzhs' + i].length > 0) {
          for (const fztemp of this.fzxmmap[this.fzlbarray[i].id]) {
            if (fztemp.id === this.form['jsfzhs' + i]) {
              name = name + '_' + fztemp.name
            }
          }
        }
      }
      this.$refs.jskmref.selectedLabel = name
    },
    // 结算辅助项目隐藏
    zjfypopoverHideEvent () {
      // 找到对应的辅助项目
      // 找到对应的科目名称
      let name = ''
      for (const t of this.subjectRef) {
        if (t.id === this.form.zjfykm_id) {
          name = t.codename
          break
        }
      }
      for (let i = 1; i <= 10; i++) {
        if (this.form['zjfyfzhs' + i] && this.form['zjfyfzhs' + i].length > 0) {
          for (const fztemp of this.fzxmmap[this.fzlbarray[i].id]) {
            if (fztemp.id === this.form['zjfyfzhs' + i]) {
              name = name + '_' + fztemp.name
            }
          }
        }
      }
      this.$refs.zjfykmref.selectedLabel = name
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
    // 隐藏辅助项目
    hidepopover () {
    },
    // 计算科目
    zjfykmIdChange (bshow) {
      const jskmid = this.form.zjfykm_id
      this.zjfyfzlbarray = null
      // 从类别找到相关的项目
      for (const t of this.subjectRef) {
        if (jskmid === t.id) {
          for (let i = 0; i < t.isfzhs.length; i++) {
            if (t.isfzhs[i] === '1') {
              if (!this.zjfyfzlbarray) {
                this.zjfyfzlbarray = []
              }
              this.zjfyfzlbarray.push(this.fzlbarray[i + 1])
              this.zjfypopovershow = bshow
            }
          }
          if (this.zjfyfzlbarray === null || this.zjfyfzlbarray.length === 0) {
            this.zjfypopovershow = false
          }
          break
        }
      }
      // 全部的辅助项目清空
      if (bshow) {
        for (let i = 1; i < 11; i++) {
          this.form['zjfyfzhs' + i] = ''
        }
      }
    },
    // 计算科目
    jskmIdChange (bshow) {
      const jskmid = this.form.jskm_id
      this.jsfzlbarray = null
      // 从类别找到相关的项目
      for (const t of this.subjectRef) {
        if (jskmid === t.id) {
          for (let i = 0; i < t.isfzhs.length; i++) {
            if (t.isfzhs[i] === '1') {
              if (!this.jsfzlbarray) {
                this.jsfzlbarray = []
              }
              this.jsfzlbarray.push(this.fzlbarray[i + 1])
              this.jspopovershow = bshow
            }
          }
          if (this.jsfzlbarray === null || this.jsfzlbarray.length === 0) {
            this.jspopovershow = false
          }
          break
        }
      }
      // 全部的辅助项目清空
      if (bshow) {
        for (let i = 1; i < 11; i++) {
          this.form['jsfzhs' + i] = ''
        }
      }
    },
    // 显示
    show (buttonOpe, data) {
      this.visible = true
      this.buttonOpe = buttonOpe
      if (buttonOpe === 'add' || buttonOpe === 'copy') {
        if (buttonOpe === 'copy') {
          this.currrow = this.copyData(data)
          this.form = this.copyData(data)
          this.form.assetcate_id = ''
          this.cleanCopyValue()
          this.jskmIdChange(false)
          this.zjfykmIdChange(false)
          this.$nextTick(() => {
            this.$refs.jskmref.selectedLabel = this.currrow.jskm
            this.$refs.zjfykmref.selectedLabel = this.currrow.zjfykm
          })
        }
        this.$api.assetsCard.add().then(result => {
          if (result.success) {
            this.form.ascode = result.rows
          }
        })
      } else if (buttonOpe === 'edit') {
        this.currrow = this.copyData(data)
        this.form = this.copyData(data)
        this.jskmIdChange(false)
        this.zjfykmIdChange(false)
        this.$nextTick(() => {
          this.$refs.jskmref.selectedLabel = this.currrow.jskm
          this.$refs.zjfykmref.selectedLabel = this.currrow.zjfykm
        })
      }
    },
    copyData (data) {
      if (data) {
        let tt = JSON.stringify(data)
        return Object.assign(this.getDefaultForm(), JSON.parse(tt))
      }
      return this.getDefaultForm()
    },
    // 保存
    saveForm () {
      let param = {
        zcbm: this.form.zcbm,
        asname: this.form.asname,
        id_assetcard: this.form.assetcate_id,
        atmny: this.form.atmny
      }
      // 计算辅助项目必输
      if (this.jsfzlbarray) {
        for (let i = 0; i < this.jsfzlbarray.length; i++) {
          if (!this.form['jsfzhs' + this.jsfzlbarray[i].code]) {
            this.$message({showClose: true, message: '结算辅助项目不能为空!', type: 'warning'})
            return
          }
        }
      }
      if (this.zjfyfzlbarray) {
        for (let i = 0; i < this.zjfyfzlbarray.length; i++) {
          if (!this.form['zjfyfzhs' + this.zjfyfzlbarray[i].code]) {
            this.$message({showClose: true, message: '折旧费用辅助项目不能为空!', type: 'warning'})
            return
          }
        }
      }
      this.$refs.formRef.validate((rs) => {
        if (rs) {
          this.form.adate = this.form.dperiod // 开始使用日期 = 录入日期
          this.$api.assetsCard.checkBefSave(param).then(result => {
            if (result.success) {
              this.$api.assetsCard.saveDataRow(this.form).then(result => {
                this.successMsg(result)
                if (result.success) {
                  this.visible = false
                  this.$emit('loadtableList', -1)
                }
              })
            } else {
              this.$confirm(result.msg + '是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$api.assetsCard.saveDataRow(this.form).then(result => {
                  this.successMsg(result)
                  if (result.success) {
                    this.visible = false
                    this.$emit('loadtableList', -1)
                  }
                })
              }).catch(() => {

              })
            }
          })
        }
      })
    },
    // 复制清除数据
    cleanCopyValue () {
      this.form.dperiod = this.$store.getters.getLoginDate // 录入期间
      this.form.togl = 'N' // 转总账
      this.form.clear = 'N' // 已清理
      this.form.ascode = '' // 卡片编号
      // 期初设置为N，期初值清空
      // 期初数据为空
      this.form.qcljgzl = ''
      this.form.inittion = ''
      this.form.initciation = ''
      this.form.initperiod = ''

      // 原值、净值、累计折旧-----------信息
      this.form.depation = '' // 总累计折旧
      this.form.depperiod = '' // 已计提折旧期间
      this.form.uperiod = '' // 总累计使用期间月(数)
      this.form.ljgzl = '' // 累计工作量
      // 状态信息中三项--------------信息
      this.form.accounttion = ''
      this.form.accperiod = ''
      this.form.usedperiod = ''
      // 资产净值和期初净值 设为原值
      var yuanzhi = this.form.atmny
      this.form.asvalue = yuanzhi
      this.form.qcvalue = yuanzhi

      this.form.voucherno = ''
      this.form.depdate = ''
      this.form.id_voucher = ''
      this.form.id_assetcard = ''
    },
    // 打开资产类别
    openZclb () {
      // openAssetsTypes = true
      this.$refs.assetsTypeSelect.show()
    },
    // 资产类别编辑事件
    zclbConfirm (zclbobj) {
      // 资产类别信息
      this.form.assetcate = zclbobj.name
      this.form.assetcate_id = zclbobj.id
      // 资产属性
      this.form.assetproperty = zclbobj.prop

      // 折旧信息
      this.form.zjtype = zclbobj.zjfs
      this.form.ulimit = zclbobj.ulimit
      this.form.sratio = zclbobj.czl

      // 科目信息
      const param = {
        zclbid: zclbobj.id
      }
      this.$api.assetsCard.queryFromZclb(param).then(result => {
        if (result.success) {
          const datas = result.data
          const zcsx = this.form.assetproperty
          let zckm = null
          let zckmId = null // 资产科目id
          let jskm = null
          let jskmId = null // 结算科目id
          let jtzjkm = null
          let jtzjkmId = null // 折旧摊销科目
          let zjfykm = null
          let zjfykmId = null // 折旧(摊销)费用科目
          // 赋值科目属性值
          for (let i = 0; i < datas.length; i++) {
            if (zcsx === 0 || zcsx === 2 || zcsx === 1) { // 0,2固定资产,1无形资产
              if (datas[i].zckm === 0) {
                zckm = datas[i].zzkmmc
                zckmId = datas[i].zzkmid
              } else if (datas[i].zckm === 1) {
                // 结算
                jskm = datas[i].jskmmc
                jskmId = datas[i].jskmid
                // 计提折旧科目
                jtzjkm = datas[i].zzkmmc
                jtzjkmId = datas[i].zzkmid
                // 折旧费用科目
                zjfykm = datas[i].zjfykmmc
                zjfykmId = datas[i].zjfykmid
              }
            } else {
              zckm = datas[i].zzkmmc
              zckmId = datas[i].zzkmid
              // 结算
              jskm = datas[i].jskmmc
              jskmId = datas[i].jskmid
              // 计提折旧科目
              jtzjkm = datas[i].zzkmmc
              jtzjkmId = datas[i].zzkmid
              // 折旧费用科目
              zjfykm = datas[i].zjfykmmc
              zjfykmId = datas[i].zjfykmid
            }
          }
          this.form.zckm = zckm
          this.form.zckm_id = zckmId
          this.form.jskm = jskm
          this.form.jskm_id = jskmId
          this.form.jtzjkm = jtzjkm
          this.form.jtzjkm_id = jtzjkmId
          this.form.zjfykm = zjfykm
          this.form.zjfykm_id = zjfykmId
          this.jskmIdChange(true)
          this.zjfykmIdChange(true)
        }
      })
    },
    // 原值计算
    yzChange: function () {
      this.caljxsf() // 计算进项税额
      this.calAssetSumRes() // 计算合计值
      this.calcAssetSalvage() // 计算资产残值
      this.calcAssetNetValue() // 计算资产净值
      this.calcZjMny()
    },
    // 使用年限计算
    ulimitChange () {
      this.calcZjMny()
    },
    // 工作总量
    gzzlChange () {
      this.calcDwzj()
      this.calcLjgzl()
    },
    // 期初累计工作量
    qcljgzlChange () {
      this.calcLjgzl()
    },
    // 残值率计算
    czlChange: function () {
      this.calcAssetSalvage()
      this.calcZjMny()
    },
    // 预估残值计算
    ygczChange: function () {
      this.calSratio()
      this.calcZjMny()
    },
    // 录入前已提折旧
    inittionChange: function () {
      this.calcDepreciation()
      this.calcAssetNetValue()
      this.calcZjMny()
    },
    // 录入前已提期间(月)
    initciationChange () {
      this.calcDepreciationPeriod()
      this.calcZjMny()
    },
    // 录入前计提折旧
    periodbeginChange () {
      this.calcZjMny()
    },
    // 关闭对话框
    closeDialog () {
      this.$refs.formRef.resetFields()
      this.jsfzlbarray = []
      this.zjfyfzlbarray = []
      this.form = this.getDefaultForm()
    },
    // 根据不同的折旧方式计算折旧金额
    calcZjMny () {
      if (this.form.zjtype === 1) { // 工作量
        this.calcDwzj()
      } else if (this.form.zjtype === 2) {
        this.calcYzj2()
      } else {
        this.calcYzj()
      }
    },
    // 计算进项税额
    caljxsf () {
      this.form.jxsf = accMul(this.form.sl, this.form.atmny)
    },
    // 计算合计值
    calAssetSumRes () {
      this.form.sumres = accAdd(this.form.atmny, this.form.jxsf)
    },
    // 计算资产残值
    calcAssetSalvage () {
      this.form.ygcz = accMul(this.form.atmny, this.form.sratio)
    },
    // 反算残值率
    calSratio () {
      this.form.sratio = accDiv(this.form.ygcz, this.form.atmny)
    },
    // 计算资产净值
    calcAssetNetValue () {
      // 资产净值=资产原值-累计折旧(期初累计折旧+建账后累计折旧)
      this.form.asvalue = accSubtr(this.form.atmny, accAdd(this.form.inittion, this.form.accounttion))
      // 期初净值= 资产原值-累计折旧
      this.form.qcvalue = accSubtr(this.form.atmny, accAdd(this.form.inittion, this.form.accounttion))
    },
    // 计算月折旧
    calcYzj () {
      let sub = accSubtr(this.form.ulimit, this.form.depperiod)
      if (this.form.ulimit === 0 || sub === 0) {
        this.form.nmzj = 0
      }
      // 原值- 预估残值
      let submny = accSubtr(this.form.atmny, this.form.ygcz)
      // submny - 总累计折旧
      let submny1 = accSubtr(submny, this.form.depation)
      // 原值- 预估残值 - 期初折旧值 / 预计使用年限 - 期初月份
      this.form.nmzj = accDiv(submny1, sub)
    },
    // 双倍余额计算
    calcYzj2 () {
      let atmny = this.form.atmny
      let ulimit = this.form.ulimit
      let ygcz = this.form.ygcz
      let HalfUlimit = accDiv(2, ulimit)
      // 还是以原先的10位有效数字进行运算
      let depation = this.form.depation
      let depperiod = this.form.depperiod
      let sss = accSubtr(ulimit, depperiod)
      let submny = accSubtr(atmny, depation)
      if (ulimit === 0 || sss <= 0) {
        this.form.nmzj = 0
        return
      }
      if (sss > 24) {
        let nmzj = accMul(submny, HalfUlimit)
        this.form.nmzj = nmzj
      } else {
        let subresult = accSubtr(submny, ygcz)
        let nmzj1 = accDiv(subresult, sss)
        this.form.nmzj = nmzj1
      }
    },
    // 计算单位折旧
    calcDwzj () {
      let submny1 = accSubtr(this.form.atmny, this.form.ygcz)
      let submny2 = accSubtr(submny1, this.form.depation)
      let submny3 = accSubtr(this.form.gzzl, this.form.ljgzl)
      if (submny3 <= 0) {
        this.form.dwzj = 0
      }
      this.form.dwzj = accDiv(submny2, submny3)
    },
    // 计算累计工作量
    calcLjgzl () {
      this.form.ljgzl = this.form.qcljgzl
    },
    // 计算总累计折旧
    calcDepreciation () {
      this.form.depation = accAdd(this.form.inittion, this.accounttion)
    },
    // 计算总累计折旧期间数
    calcDepreciationPeriod () {
      // 总累计折旧期间数=期初折旧期间数+建账折旧期间数
      this.form.depperiod = accAdd(this.form.initciation, this.form.accperiod)
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg, // this.message !== '' ? this.message + '成功' : '查询成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: data.msg,
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
  /*>>> .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {*/
  /*  margin-bottom: 10px;*/
  /*}*/
  .el-main {
    padding: 0px;
  }
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 7px 10px;
  }
  .el-range-editor--mini.el-input__inner {
    width: 75%;
  }
  .titleBoxInfo {
    background: #e7eaf4;
    width: 100%;
    line-height: 30px;
  }
  .fontStyle {
    margin-left: 25px;
  }
  .row-bg {
    padding-top: 10px;
  }
  .row-child {
    margin-bottom: 2px;
  }
  #addDialog /deep/ .el-dialog__body{
    padding: 10px 0;
  }
  .adjust /deep/ .el-dialog__header {
    padding: 20px 20px 10px 10px;
  }
  .adjust /deep/ .el-dialog__body{
    padding: 10px 0 0 20px;
  }
  /deep/ .el-link--inner {
    font-size: 12px;
  }
  li {
    list-style: none
  }
  .form-container {
    /*padding: 10px 15px;*/
    overflow: auto;
  }
</style>
