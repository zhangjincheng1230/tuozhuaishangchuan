<template>
  <div class="kj-container kj-card"
       v-loading="loading"
       :element-loading-text="loadingText"
       :element-loading-spinner="loadingSpinner">
    <div class="kj-head">
      <div class="query-info">
        <ul class="nav nav-tabs">
          <li :class="activeNavIndex === 0 ? 'active' : ''" @click="navTax(0, $event)">
            <a href="javascript:void(0);">基本信息</a>
          </li>
          <li :class="activeNavIndex === 1 ? 'active' : ''" @click="navTax(1, $event)">
            <a href="javascript:void(0);">账套信息</a>
          </li>
          <li :class="activeNavIndex === 2 ? 'active' : ''" @click="navTax(2, $event)">
            <a href="javascript:void(0);">电子税局登录信息</a>
          </li>
          <li :class="activeNavIndex === 3 ? 'active' : ''" @click="navTax(3, $event)">
            <a href="javascript:void(0);">纳税信息</a>
          </li>
          <li :class="activeNavIndex === 4 ? 'active' : ''" @click="navTax(4, $event)">
            <a href="javascript:void(0);">联系人信息</a>
          </li>
          <li :class="activeNavIndex === 5 ? 'active' : ''" @click="navTax(5, $event)">
            <a href="javascript:void(0);">纳税申报表</a>
          </li>
        </ul>
      </div>
      <div class="kj-button-group">
        <el-button  @click="cancelEdit">取消</el-button>
        <el-button  @click="saveInfo">保存</el-button>
      </div>
    </div>
    <div class="kj-main">
      <el-form
        class="form-view"
        :inline="true"
        :model="formData"
        :rules="rules"
        ref="formRef"
        size="mini"
        label-width="170px"
        style="width: 100%">
        <div class="form-section">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">基本信息</div>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="公司名称" prop="uname" >
                <el-input ref="uname_attr"  v-model.trim="formData.uname" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="报税地区" prop="tax_area">
                <el-select v-model="formData.tax_area" filterable :disabled="ischannel" clearable @change="tax_areaSelect" style="width:174px">
                  <el-option v-for="item in tax_areas" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="纳税人资格" prop="chname">
                <el-select  v-model="formData.chname" :disabled="ischannel" @change="chnameSelect($event)" style="width:174px">
                  <el-option v-for="item in chnames" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="纳税人识别号" prop="ccrecode" >
                <el-input ref="ccrecode_attr"  v-model="formData.ccrecode" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="公司类型" prop="comptype">
                <el-select  v-model="formData.comptype" @change="comptypeSelect($event)" style="width:174px">
                  <el-option v-for="item in comptypes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="国家标准行业" prop="indus">
                <el-select  v-model="formData.indus" style="width:174px">
                  <el-option v-for="item in this.induss" :key="item.id" :label="item.code + '_' + item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-collapse-transition>
            <div v-show="showDetail">
              <el-row >
                <el-col :span="5.5">
                  <el-form-item label="一般人认定日期" v-show="chname_status" prop="rdsj">
                    <el-date-picker v-model="formData.rdsj" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="一般人生效日期" v-show="chname_status" prop="sxrq">
                    <el-select  v-model="formData.sxrq" default-first-option clearable placeholder="请选择" style="width:174px">
                      <el-option v-for="item in sxrqs" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="辅导期" v-show="chname_status" prop="coachbdate">
                    <el-date-picker v-model="formData.coachbdate" value-format="yyyy-MM-dd" style= "width:150px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
                    <el-date-picker v-model="formData.coachedate" value-format="yyyy-MM-dd" style= "width:150px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="5.5">
                  <el-form-item label="计算机代码" prop="mpcode" >
                    <el-input  v-model="formData.mpcode" style="width:174px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="档案号" prop="lecode" >
                    <el-input  v-model="formData.lecode" style="width:174px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="企业社保编号" prop="lecode" >
                    <el-input  v-model="formData.qysbbh" style="width:174px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="5.5">
                  <el-form-item label="主管税务局" prop="zgswj" >
                    <el-input  v-model="formData.zgswj" style="width:174px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="主管税务人员" prop="zgswry" >
                    <el-input  v-model="formData.zgswry" style="width:174px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="主管税务人员联系方式" prop="zgswlxfs" >
                    <el-input  v-model="formData.zgswlxfs" style="width:174px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="5.5">
                  <el-form-item label="是否有税控机" prop="zgswj" >
                    <el-checkbox true-label ="是" false-label = "否" v-model="formData.xtype" style="width: 174px"></el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="是否有税控盘" prop="zgswry" >
                    <el-checkbox true-label ="是" false-label = "否" v-model="formData.ywskp" style="width: 174px"></el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="5.5">
                  <el-form-item label="是否签约税库银三方协议" prop="skysfxy" >
                    <el-checkbox true-label ="是" false-label = "否" v-model="formData.skysfxy" style="width: 174px"></el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="8.8">
                  <el-form-item label="公司可享受的企业所得税优惠政策"
                                prop="zgswj" label-width="260px" width="100%">
                    <el-select  v-model="formData.yhzc" default-first-option style="width:174px">
                      <el-option v-for="item in yhzcs" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <a href="javascript:void(0);" @click="showYhzc"
                       style="text-decoration:underline;color:#2828FF;font-size: 10px;">
                      {{ formData.yhzc == null || formData.yhzc == '0' ? "查看小型微利企业判定条件"
                      : formData.yhzc == '1' ? "查看政策依据及认定条件等"
                      : formData.yhzc == '2' ? "查看软件企业条件" : ""
                      }}
                    </a>
                  </el-form-item>
                </el-col>
                <el-col style="width:251px">
                  <el-form-item label="认证时间" v-show="formData.yhzc == '2'" label-width="80px" prop="ksjyscdate">
                    <el-date-picker v-model="formData.rzsj" value-format="yyyy-MM-dd" style= "width:160px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col style="width:270px">
                  <el-form-item label="首次获利年度" v-show="formData.yhzc == '2'" label-width="96px" prop="indus">
                    <el-select  v-model="formData.schlnd" style="width:160px">
                      <el-option v-for="item in this.schlnds" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col :span="24">
                  <el-form-item size="mini" label="备注" prop="demo">
                    <el-input  v-model="formData.demo" type="textarea"
                               resize="none" :rows="3" style="width: 400%"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
          <el-row >
            <el-col :span="5.5">
              <el-form-item style="width:448px">
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item style="width:174px">
                <el-link v-if="showDetail" type="primary" :underline="false" @click="showDetail=false">
                  收起<i class="el-icon-arrow-up el-icon--right"></i>
                </el-link>
                <el-link v-else type="primary" :underline="false" @click="showDetail=true">
                  展开<i class="el-icon-arrow-down el-icon--right"></i>
                </el-link>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
        <div class="form-section">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">账套信息</div>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="成本结转类型" prop="costforwardstyle" >
                <el-select ref="costforwardstyle_attr" v-model="formData.costforwardstyle" style="width:174px">
                  <el-option v-for="item in costforwardstyles" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="库存启用日期" prop="icbegindate">
                <el-date-picker v-model="formData.icbegindate" disabled value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder=""></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="固定资产启用日期" prop="bb_date">
                <el-date-picker v-model="formData.bb_date" disabled value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder=""></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="存货核算方式" prop="buildic" >
                <el-select ref="buildic_attr" v-model="formData.buildic" disabled style="width:174px">
                  <el-option v-for="item in buildics" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-section">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">电子税局登录信息</div>
          <el-row style="width: 1099px">
            <el-col :span="5.5">
              <el-form-item label="登录方式" prop="d16" >
                <el-select v-model="formData.d16" style="width:174px">
                  <el-option v-for="item in d16s" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item v-show="dlfs_status" label="用户名" prop="vsuname">
                <el-input  v-model="formData.vsuname" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="密码" prop="atetaxpwd">
                <el-input  v-model.trim="formData.atetaxpwd" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="个税密码" prop="vperpwd">
                <el-input  v-model="formData.vperpwd" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <div class="form-section">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">纳税信息</div>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="城建税税率" prop="cbtax" >
                <el-select ref="cbtax_attr" v-model="formData.cbtax" style="width:174px">
                  <el-option v-for="item in cbtaxs" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="地方教育费附加" prop="leatax">
                <el-select ref="leatax_attr" v-model="formData.leatax" style="width:174px">
                  <el-option v-for="item in leataxs" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="教育费附加" prop="edutax">
                <el-select ref="edutax_attr" v-model="formData.edutax" disabled style="width:174px">
                  <el-option v-for="item in edutaxs" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="所得税类型" prop="sdslx" >
                <el-select v-model="formData.sdslx" :disabled="sdslxStatus" style="width:174px">
                  <el-option v-for="item in sdslxs" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="季初从业人数" prop="ifirdnum">
                <el-input-number v-model="formData.ifirdnum" :controls =false style= "width:174px" ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="季末从业人数" prop="idnum">
                <el-input-number v-model="formData.idnum" :controls =false style= "width:174px" ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="征收方式" prop="zsfs">
                <el-select v-model="formData.zsfs" @change="zsfsSelect($event)" :disabled="!isQYkjzz" style="width:174px">
                  <el-option v-for="item in zsfss" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="有生产经营所得无综合收入所得" label-width="220px"
                            v-show="isscjy_czzf_status" prop="begincom">
                <el-checkbox v-model="formData.begincom" true-label="是" false-label="否" style="width: 24px"></el-checkbox>
                <el-tooltip style="cursor: pointer" class="item" effect="dark" placement="right">
                  <div slot="content" class="content" style="width:350px">
                    &emsp;不勾选表示个体户经营者不仅有生产所得且有综合收入所得<br>
                    &emsp;不需要再录入“开始经营日期”和“专项扣除”，<br>
                    &emsp;在工资表中扣除个体户经营者本人的累计减除费用和专项扣除；<br>
                    &emsp;勾选表示个体户经营者仅有生产经营所得无综合收入所得，<br>
                    &emsp;需录入“开始经营日期”和“专项扣除”，<br>
                    &emsp;用于在期末计提所得税时扣除投资者减除费用和专项扣除。<br>
                  </div>
                  <img src="@/assets/img/helptool.png">
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="核定征收方式" v-show="zsfs_status" prop="hcff">
                <el-select v-model="formData.hcff" :disabled="hcffStatus" style="width:174px">
                  <el-option v-for="item in hcffss" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="应税所得率" v-show="zsfs_status" prop="sdssl">
                <el-input-number v-model="formData.sdssl" :precision="4" :controls =false :min="0" :max="999" style="width:174px"></el-input-number>
                <span>%</span>
                <el-tooltip class="item" effect="dark" content="请根据税务机关核定的应税所得率填写" placement="right-start">
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="生效开始期间" v-show="zsfs_status" prop="zsksqj">
                <el-date-picker ref="zsksqj_attr" v-model="formData.zsksqj" type="month" :editable="false"
                                value-format="yyyy-MM" placeholder="选择期间" style="width:174px"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="生效结束期间" v-show="zsfs_status" prop="zsjsqj">
                <el-date-picker ref="zsjsqj_attr" v-model="formData.zsjsqj" type="month" :editable="false"
                                value-format="yyyy-MM" placeholder="选择期间" style="width:174px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="开始生产经营日期" v-show="scjy_czzf_status" prop="ksjyscdate">
                <el-date-picker ref="ksjyscdate_attr" v-model="formData.ksjyscdate" value-format="yyyy-MM-dd" style= "width:174px" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="专项扣除" v-show="czzf_status" prop="zxxj">
                <el-input-number v-model="formData.zxxj" :precision="2" :controls=false :disabled=true :min="0" :max="999999999" style="width:174px"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="变更日期" v-show="czzf_status" prop="bgqj">
                <el-date-picker v-model="formData.bgqj" type="month" :editable="false" :clearable="false"
                                value-format="yyyy-MM" placeholder="选择期间" style="width:174px"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="基本养老保险费" v-show="czzf_status" prop="ylao">
                <el-input-number @change="zxxjChandleChange" v-model="formData.ylao" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="基本医疗保险费" v-show="czzf_status" prop="yliao">
                <el-input-number @change="zxxjChandleChange" v-model="formData.yliao" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="失业保险费" v-show="czzf_status" prop="sye">
                <el-input-number @change="zxxjChandleChange" v-model="formData.sye" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="住房公积金" v-show="czzf_status" prop="gjj">
                <el-input-number @change="zxxjChandleChange" v-model="formData.gjj" :precision="2" :controls =false :min="0" :max="999999999" style="width:174px"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label=" " v-show="isQYkjzz"  prop="">
                <el-button @click="showHis">历史记录</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-section">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">联系人信息</div>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="法定代表人" prop="bodycode" >
                <el-input  v-model="formData.bodycode" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="法人电话" prop="corprhone">
                <el-input  v-model="formData.corprhone" style="width:174px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="财务负责人" prop="l1">
                <el-input  v-model="formData.l1" style="width:174px"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row >
            <el-col :span="5.5">
              <el-form-item label="办税人员" prop="taxerid" >
                <el-select v-model="formData.taxerid" style="width:174px">
                  <el-option v-for="item in this.taxerids" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="办税人员身份证件类型" prop="taxpertype">
                <el-select v-model="formData.taxpertype" style="width:174px">
                  <el-option v-for="item in taxpertypes" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5.5">
              <el-form-item label="办税人员身份证件号码" prop="taxpersid">
                <el-input  v-model="formData.taxpersid" style="width:174px"></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
        <div class="form-section">
          <div style="font-size: 14px;font-weight: bold;margin-top:2px;">纳税申报表</div>

          <vxe-table
            resizable
            row-id="pk_taxrpttemplet"
            :data="taxData"
            :tree-config="{children: 'children'}"
            :checkbox-config="taxFieldCheckConfig"
            @cell-click="taxCellClick"
            @select-change="selectChangeEvent">
            <vxe-table-column type="checkbox" title="报表名称" width="450" tree-node>
            </vxe-table-column>
            <vxe-table-column field="sbzq" title="申报周期" width="120">
              <template #default="scope">
                {{ scope.row.sbzq == 0 ? "月" : scope.row.sbzq == 1 ? "季"
                : scope.row.sbzq == 2 ? "年" : ""
                }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="ifrequired" title="编写要求" width="120">
              <template #default="scope">
                {{ scope.row.reportcode == scope.row.pk_taxrpttemplet ? ""
                : scope.row.ifrequired == 'Y' ? "必填" : "选填"
                }}
              </template>
            </vxe-table-column>

          </vxe-table>
        </div>

      </el-form>
    </div>
    <el-dialog :title="yhzcDilogTitle" :visible.sync="yhzcDilogVisible" width="805px">
      <Yhzc_XW v-if="this.formData.yhzc == null || this.formData.yhzc == '0' "></Yhzc_XW>
      <Yhzc_GX v-else-if="this.formData.yhzc == '1' "></Yhzc_GX>
      <Yhzc_RJ v-else-if="this.formData.yhzc == '2' "></Yhzc_RJ>
    </el-dialog>

    <el-dialog title="历史记录" :visible.sync="historyDialogVisible" width="950px">
      <div style="height: 504px;">
        <el-tabs v-model="activename" type="card" @tab-click="historyClick" ref="tabs">
          <el-tab-pane label="所得税历史记录" name="taxHis">
            <el-table
              ref="taxhistable"
              :data="taxHisData"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                property="sdslx"
                label="所得税类型"
                header-align="center"
                width="180">
                <template #default="scope">
                  {{ scope.row.sdslx == "0" ? "企业所得税" :
                  scope.row.sdslx == "1" ? "个人所得税生产经营所得" : "" }}
                </template>
              </el-table-column>
              <el-table-column
                property="zsfs"
                label="征收方式"
                header-align="center"
                width="110">
                <template #default="scope">
                  {{ scope.row.zsfs == "0" ? "核定征收" :
                  scope.row.zsfs == "1" ? "查账征收" : "" }}
                </template>
              </el-table-column>
              <el-table-column
                property="zsksqj"
                label="生效开始期间"
                header-align="center"
                width="140">
              </el-table-column>
              <el-table-column
                property="zsjsqj"
                label="生效结束期间"
                header-align="center"
                width="140">
              </el-table-column>
              <el-table-column
                property="sdssl"
                label="应税所得率(%)"
                header-align="center"
                align="right"
                :formatter="repforsl"
                width="110">
              </el-table-column>
              <el-table-column
                property="caozuo"
                label="操作"
                align="center"
                width="180">
                <template #default="scope">
                  <el-button @click="chargedel(scope.row.taxhisid, scope.$index, 'taxHis')"
                             type="small" style="color: #2acb42; border: 1px solid #2acb42;">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="专项扣除历史记录" name="specHis">
            <el-table
              ref="spechistable"
              :data="specHisData"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                property="bgqj"
                label="变更日期"
                header-align="center"
                width="110">
              </el-table-column>
              <el-table-column
                property="ylao"
                label="基本养老保险费"
                header-align="center"
                :formatter="repformny"
                align="right"
                width="140">
              </el-table-column>
              <el-table-column
                property="yliao"
                label="基本医疗保险费"
                header-align="center"
                :formatter="repformny"
                align="right"
                width="140">
              </el-table-column>
              <el-table-column
                property="sye"
                label="失业保险费"
                :formatter="repformny"
                header-align="center"
                align="right"
                width="140">
              </el-table-column>
              <el-table-column
                property="gjj"
                label="住房公积金"
                header-align="center"
                :formatter="repformny"
                align="right"
                width="140">
              </el-table-column>
              <el-table-column
                property="caozuo1"
                label="操作"
                align="center"
                width="180">
                <template #default="scope">
                  <el-button @click="chargedel(scope.row.spechisid, scope.$index, 'specHis')"
                             type="small" style="color: #2acb42; border: 1px solid #2acb42;">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { formatDate, getPreviousYear } from '@/utils'
import loadingMixin from '@/mixins/loading'
import Yhzc_XW from './yhzc_xw'
import Yhzc_GX from './yhzc_gx'
import Yhzc_RJ from './yhzc_rj'
export default {
  name: 'card',
  props: ['data', 'induss'],
  components: {
    Yhzc_XW,
    Yhzc_GX,
    Yhzc_RJ
  },
  mixins: [loadingMixin],
  data () {
    return {
      formData: {},
      taxData: [],
      taxFieldCheckConfig: {},
      taxSelectedRows: [],
      taxCurrentRow: null,
      rules: {
        uname: [{ required: true, message: '请录入公司名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        ccrecode: [{ required: true, message: '请录入纳税人识别号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }],
        costforwardstyle: [{ required: true, message: '请选择成本结转类型', trigger: 'blur' }],
        buildic: [{ required: true, message: '请选择存货核算方式', trigger: 'blur' }],
        cbtax: [{ required: true, message: '请选择城建税税率', trigger: 'blur' }],
        leatax: [{ required: true, message: '请选择地方教育费附加', trigger: 'blur' }],
        edutax: [{ required: true, message: '请选择教育费附加', trigger: 'blur' }],
        ksjyscdate: [{ required: true, message: '请选择开始生产经营日期', trigger: 'blur' }],
        zsksqj: [{ required: true, message: '请选择生效开始期间', trigger: 'blur' }],
        zsjsqj: [{ required: true, message: '请选择生效结束期间', trigger: 'blur' }]
      },
      taxerids: [],

      showDetail: false,
      activeNavIndex: 0,
      dlfs_status: true,
      isQYkjzz: false,

      sdslxStatus: true,
      hcffStatus: true,

      chname_status: true,
      isscjy_czzf_status: true,
      zsfs_status: true,
      scjy_czzf_status: true,
      czzf_status: true,

      yhzcDilogTitle: '',
      yhzcDilogVisible: false,

      historyDialogVisible: false,
      activename: '',
      taxHisData: [],
      specHisData: []
    }
  },
  computed: {
    formInfo: {
      get () {
        this.changeEstatus(this.data)
        return this.data
      },
      set () {
        this.$emit('update:data', false)
      }
    },

    ischannel () {
      if (this.formData.ischannel == '是') {
        return true
      } else {
        return false
      }
    },
    tax_areas () {
      return this.$parent.areaDatas
    },
    schlnds () {
      let date = new Date()
      let periods = []
      for (let i = 0; i < 20; i++) {
        let year = getPreviousYear(date, i)
        periods.push({
          label: year, value: year
        })
      }
      return periods
    },
    yhzcs () {
      return [
        {label: '小微企业', value: '0'},
        {label: '高新技术企业', value: '1'},
        {label: '软件企业', value: '2'},
        {label: '其他企业', value: '9'}
      ]
    },
    chnames () {
      return [
        {label: '小规模纳税人', value: '小规模纳税人'},
        {label: '一般纳税人', value: '一般纳税人'}
      ]
    },
    comptypes () {
      return [
        {label: '有限责任公司', value: 1}, {label: '个体工商户', value: 20},
        {label: '个人独资企业', value: 2}, {label: '有限合伙企业', value: 3},
        {label: '普通合伙企业', value: 22}, {label: '承包、承租经营者', value: 21},
        {label: '有限责任公司(自然人独资)', value: 4}, {label: '有限责任公司(国内合资)', value: 5},
        {label: '自然人有限责任公司', value: 6}, {label: '有限责任公司(自然人投资或控股)', value: 7},
        {label: '有限责任公司(外商投资企业法人独资)', value: 8}, {label: '有限责任公司(台港澳法人独资)', value: 9},
        {label: '有限责任公司(中外合资)', value: 10}, {label: '有限责任公司(国有独资)', value: 11},
        {label: '有限责任公司(非自然人投资或控股的法人独资)', value: 12}, {label: '其他股份有限公司(非上市)', value: 13},
        {label: '其他股份有限公司分公司(非上市)', value: 14}, {label: '一人有限责任公司', value: 15},
        {label: '其他有限责任公司', value: 16}, {label: '其他有限责任公司(分公司)', value: 17},
        {label: '全民所有制', value: 18}, {label: '集体经营单位(非法人)', value: 23},
        {label: '其他', value: 19}
      ]
    },
    costforwardstyles () {
      return [
        {label: '成本手工结转', value: 0},
        {label: '成本比例结转', value: 1},
        {label: '商贸成本结转', value: 2},
        {label: '工业成本结转', value: 3}
      ]
    },
    buildics () {
      return [
        {label: '不单独核算存货', value: '0'},
        {label: '启用库存模块', value: '1'},
        {label: '总账核算存货', value: '2'}
      ]
    },
    d16s () {
      return [
        {label: '用户名密码', value: '用户名密码'},
        {label: 'CFCA证书', value: 'CFCA证书'},
        {label: '法人一证通', value: '法人一证通'}
      ]
    },
    cbtaxs () {
      return [
        {label: '1%', value: 0.01},
        {label: '5%', value: 0.05},
        {label: '7%', value: 0.07}
      ]
    },
    leataxs () {
      return [
        {label: '1%', value: 0.01},
        {label: '1.5%', value: 0.015},
        {label: '2%', value: 0.02}
      ]
    },
    edutaxs () {
      return [
        {label: '3%', value: 0.03}
      ]
    },
    sdslxs () {
      return [
        {label: '企业所得税', value: 0},
        {label: '个人所得税生产经营所得', value: 1}
      ]
    },
    zsfss () {
      return [
        {label: '核定征收', value: 0},
        {label: '查账征收', value: 1}
      ]
    },
    hcffss () {
      return [
        {label: '核定应税所得率(能核算收入总额的)', value: 0}
      ]
    },
    taxpertypes () {
      return [
        {label: '居民身份证', value: '居民身份证'}, {label: '中国护照', value: '中国护照'},
        {label: '军官证', value: '军官证'}, {label: '士兵证', value: '士兵证'},
        {label: '驾驶证', value: '驾驶证'}, {label: '港澳居民来往内地通行证', value: '港澳居民来往内地通行证'},
        {label: '台湾居民来往大陆通行证', value: '台湾居民来往大陆通行证'}, {label: '其他证件', value: '其他证件'}
      ]
    },
    sxrqs () {
      return [
        {label: '当月', value: 0},
        {label: '下月', value: 1}
      ]
    }

  },
  watch: {
    'formData.begincom': function (val, oldval) {
      if (val === '是' &&
              this.formData.sdslx == 1 &&
              this.formData.zsfs == 1) {
        this.scjy_czzf_status = true

        if (this.is2019BefPeriod()) {
          this.czzf_status = false
        } else {
          this.czzf_status = true
        }
      } else {
        this.scjy_czzf_status = false
        this.czzf_status = false
      }
    },
    'formData.d16': function (val, oldval) {
      if (val === '用户名密码') {
        this.dlfs_status = true
      } else {
        this.dlfs_status = false
      }
    },
    zsfs_status: function (val) {
      if (val) {
        this.rules['zsksqj'][0].required = true
        this.rules['zsjsqj'][0].required = true
      } else {
        this.rules['zsksqj'][0].required = false
        this.rules['zsjsqj'][0].required = false
      }
    },
    czzf_status: function (val) {

    },
    scjy_czzf_status: function (val) {
      if (val) {
        this.rules['ksjyscdate'][0].required = true
      } else {
        this.rules['ksjyscdate'][0].required = false
      }
    }
  },
  mounted () {
    let scrollParent = this.$el.querySelector('.form-view')
    let updateNav = this.$_.debounce(() => {
      this.adjustNavActive()
    }, 100)
    scrollParent.addEventListener('scroll', updateNav)
    setTimeout(function () {
    }, 1000)
    if (!(this.data && this.data.pk_gs)) {
      this.query()
    } else {
      this.init(this.formInfo)
    }
  },
  methods: {
    navTax: function (index, e) {
      this.activeNavIndex = index
      let scrollParent = this.$el.querySelector('.form-view')
      let section = this.$el.querySelectorAll('.form-section')[index]
      scrollParent.scrollTop = scrollParent.scrollTop + section.getBoundingClientRect().top -
              scrollParent.getBoundingClientRect().top
    },
    adjustNavActive: function () {
      let scrollParent = this.$el.querySelector('.form-view')
      let parentTop = scrollParent.getBoundingClientRect().top
      let taxSections = this.$el.querySelectorAll('.form-section')
      let activeIndex = 0
      if (taxSections[0].getBoundingClientRect().top - parentTop === 10) {
        activeIndex = 0
      } else {
        for (let i = taxSections.length - 1; i >= 0; i--) {
          let taxSection = taxSections[i]
          let sectionTop = taxSection.getBoundingClientRect().top
          if (sectionTop - parentTop < 70) {
            activeIndex = i
            break
          }
        }
      }
      this.activeNavIndex = activeIndex
    },
    is2019BefPeriod () {
      let loginperiod = this.$store.getters.getLoginDate.substring(0, 7)
      return loginperiod < '2019-01'
    },
    changeEstatus (data, flag) {
      this.chnameSelect1(data.chname, flag)

      if (this.isEmpty(data.sdslx)) {
        data.sdslx = 0
      }
      if (this.isEmpty(data.zsfs)) {
        data.zsfs = 1
      } else {
        data.hcff = 0
        data.jsfs = 0
      }

      if (data.ctype === '00000100AA10000000000BMD') {
        this.isQYkjzz = true
      } else {
        this.isQYkjzz = false

        // 将不相关状态置为不显示
        this.zsfs_status = false
        this.czzf_status = false
        this.scjy_czzf_status = false
        this.isscjy_czzf_status = false

        return
      }

      if (data.zsfs == 0) {
        this.hdzsEvent(flag)
      } else if (data.sdslx == 1 && data.zsfs == 1) { // 个税+查账征收
        this.czzsOfGsEvent(flag)
      } else {
        this.czzsOfQyEvent(flag)
      }
    },
    init (data) {
      const formData = Object.assign({}, data)
      this.formData = formData
      this.changeEstatus(this.formData, true)
      // this.getHybz()
      this.getTaxerids()
      this.loadTaxRpt()
    },
    repforsl (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue, 4) + '%'
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    query () {
      this.$api.BasicSettingApi.CompanySetting.query({
        corpIds: this.$store.getters.currentCorp.pk_gs
      }).then(result => {
        if (result.success && result.rows.length > 0) {
          this.$emit('updateFormData', result.rows[0])
          this.init(result.rows[0])
        } else {
          this.$parent.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    isEmpty (val) {
      if (val == null || val == undefined || (val == '' && val != 0)) {
        return true
      }
      return false
    },
    tax_areaSelect (value) {
      if (value && value == 2) {
        this.formData.d16 = '法人一证通'
      } else {
        this.formData.d16 = '用户名密码'
      }

      this.loadTaxRpt()
    },
    chnameSelect (value) {
      this.loadTaxRpt()
      this.chnameSelect1(value)
    },
    chnameSelect1 (value, flag) {
      if (value == '一般纳税人') {
        this.chname_status = true

        if (!flag) {
          // this.formData.rdsj = formatDate(new Date())
          // this.formData.sxrq = 1
          delete this.formData.coachbdate
          delete this.formData.coachedate
        }
      } else {
        this.chname_status = false

        if (!flag) {
          // delete this.formData.rdsj
          // this.formData.sxrq = ''
          this.$set(this.formData, 'rdsj', null)
          this.$set(this.formData, 'sxrq', '')
          delete this.formData.coachbdate
          delete this.formData.coachedate
        }
      }
    },
    comptypeSelect (value) {
      if (this.formData.ctype != '00000100AA10000000000BMD') {
        return
      }

      this.sdslxStatus = true
      this.hcffStatus = true
      if (value == null ||
              value == '' ||
              (value != '20' &&
                  value != '21' && value != '2' &&
                  value != '22' && value != '3')) {
        this.formData.sdslx = 0
      } else {
        this.formData.sdslx = 1
      }

      this.linkageEvent()
    },
    zsfsSelect (value) {
      if (this.formData.ctype != '00000100AA10000000000BMD') {
        return
      }
      this.linkageEvent()
    },
    linkageEvent () {
      let sds = this.formData.sdslx
      let zsfsvv = this.formData.zsfs

      if (sds == '1' && zsfsvv == '1') { // 个税+查账
        this.czzsOfGsEvent()
      } else if (zsfsvv == '0') { // 核定
        this.hdzsEvent()
      } else {
        this.czzsOfQyEvent()
      }
    },
    czzsOfGsEvent (flag) {
      let ff = this.formData.begincom
      this.isscjy_czzf_status = true
      if (ff == '是') {
        this.zsfs_status = false
        this.scjy_czzf_status = true

        if (!flag) {
          this.formData.sdssl = 0
          this.$set(this.formData, 'zsksqj', '')
          this.$set(this.formData, 'zsjsqj', '')
          // this.formData.zsksqj = ''
          // this.formData.zsjsqj = ''
        }

        if (this.is2019BefPeriod()) {
          this.$set(this.formData, 'bgqj', '')
          this.czzf_status = false // 专项扣除
        } else {
          this.czzf_status = true
          let jzPeriod = this.$store.getters.getLoginCorp.bdate.substring(0, 7)
          let period = '2019-01'
          if (period < jzPeriod) {
            period = jzPeriod
          }

          if (!flag && this.isEmpty(this.formData.bgqj)) {
            this.$set(this.formData, 'bgqj', period)
          }
        }
      } else {
        this.zsfs_status = false
        this.scjy_czzf_status = false // 开始生产经营
        this.czzf_status = false // 专项扣除

        if (!flag) {
          this.formData.sdssl = 0
          // this.formData.zsksqj = ''
          // this.formData.zsjsqj = ''
          // this.formData.bgqj = ''
          this.$set(this.formData, 'zsksqj', '')
          this.$set(this.formData, 'zsjsqj', '')
          this.$set(this.formData, 'bgqj', '')
        }
      }
    },
    czzsOfQyEvent (flag) { // 企业所得税 查账征收
      this.zsfs_status = false
      this.czzf_status = false
      this.scjy_czzf_status = false
      this.isscjy_czzf_status = false

      if (!flag) {
        this.formData.sdssl = 0
        // this.formData.zsksqj = ''
        // this.formData.zsjsqj = ''
        this.$set(this.formData, 'zsksqj', '')
        this.$set(this.formData, 'zsjsqj', '')
        this.$set(this.formData, 'bgqj', '')
      }
    },
    hdzsEvent (flag) { // 核定征收
      this.zsfs_status = true
      this.czzf_status = false
      this.scjy_czzf_status = false
      this.isscjy_czzf_status = false

      if (!flag) {
        this.formData.hcff = 0
        this.formData.sdssl = 5
        this.$set(this.formData, 'bgqj', '')
      }
    },
    getTaxerids () {
      this.$api.BasicSettingApi.CompanySetting.queryUser({}).then(result => {
        if (result.success) {
          let rows = result.rows
          for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            this.taxerids.push({'id': row.uid, 'code': row.ucode, 'name': row.uname})
          }
        } else {
        }
      }).catch(e => {
      })
    },

    historyClick (tab, event) {
      this.chargeHis(this.activename)
    },
    chargedel (id, index, type) {
      this.$api.BasicSettingApi.CompanySetting.delchargHis({
        type: type,
        id: id,
        pk_gs: this.formData.pk_gs
      }).then(result => {
        if (result.success) {
          this.$parent.successMsg(result.msg)
          this.chargeHis(type)
          this.cascadeHis(type)
        } else {
          this.$parent.errorMsg(result.msg)
        }
      }).catch(e => {
      })
    },
    showYhzc () {
      this.yhzcDilogVisible = true
    },
    showHis () {
      this.historyDialogVisible = true
      this.activename = 'taxHis'

      let display = ''
      if (this.czzf_status) {
        display = 'inline-block'
      } else {
        display = 'none'
      }
      this.$nextTick(() => {
        this.$refs.tabs.$children[0].$refs.tabs[1].style.display = display
      })
      this.chargeHis()
    },
    cascadeHis (type) {
      this.$api.BasicSettingApi.CompanySetting.query({
        corpIds: this.formData.pk_gs
      }).then(result => {
        if (result.success && result.rows.length > 0) {
          let row = result.rows[0]
          if (type == 'specHis') {
            this.formData.bgqj = row.bgqj
            this.formData.ylao = row.ylao
            this.formData.yliao = row.yliao
            this.formData.sye = row.sye
            this.formData.gjj = row.gjj
            this.formData.zxxj = row.zxxj
          } else {
            this.formData.sdslx = row.sdslx
            this.formData.zsfs = row.zsfs
            this.formData.zsksqj = row.zsksqj
            this.formData.zsjsqj = row.zsjsqj
            this.formData.hcff = row.hcff
            this.formData.sdssl = row.sdssl
            this.linkageEvent(true)
          }
          this.loadTaxRpt()
        } else {
        }
      }).catch(e => {
      })
    },
    chargeHis (type) {
      this.$api.BasicSettingApi.CompanySetting.queryChargeHis({
        type: type,
        pk_gs: this.formData.pk_gs
      }).then(result => {
        if (result.success) {
          if (type == 'specHis') {
            this.specHisData = result.rows
          } else {
            this.taxHisData = result.rows
          }
        } else {
        }
      }).catch(e => {
      })
    },
    selectChangeEvent ({selection}) {
      this.taxSelectedRows = selection
      this.filterSelRows()
      this.taxCurrentRow = null
    },
    filterSelRows (rows) {
      if (this.taxCurrentRow != null && rows && rows.length > 0) {
        this.taxSelectedRows = this.taxSelectedRows.reduce((temp, row) => {

        }, [])
      }
    },
    taxCellClick ({ row, rowIndex, column, columnIndex }, event) {
      this.taxCurrentRow = row
    },
    switchCheck (row) {
      let sbzq = row.sbzq
      if (sbzq == 1 || sbzq == 0) {
        if (row.zsxm_dm == undefined) {
          this.switchCheck(row.children[0])
        } else {

        }
      }
    },
    cancelEdit () {
      this.$confirm('请确认是否取消？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$parent.editStatus = false
        this.$parent.cardShow = false
      })
    },
    loadTaxRpt () {
      let gs = this.formData.pk_gs
      let vprovince = this.$parent.areaMaps.get(this.formData.tax_area)
      if (gs && gs.length > 0 && vprovince) {
        this.$api.BasicSettingApi.CompanySetting.queryTaxRpt({
          corpIds: gs,
          vprovince: vprovince,
          zcsx: this.formData.chname
        }).then(result => {
          if (result.success) {
            this.taxData = result.rows
            let temp = []
            this.taxSelectedRows = []
            this.cyclicTra(this.taxData, temp)
            this.taxFieldCheckConfig = {
              labelField: 'reportname',
              checkRowKeys: temp
            }
          }
        }).catch(e => {
        })
      }
    },
    cyclicTra (data, temp) {
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let row = data[i]
          if (row.isselect) {
            temp.push(row.pk_taxrpttemplet)
            this.taxSelectedRows.push(row)
          }
          if (row.children && row.children.length > 0) {
            this.cyclicTra(row.children, temp)
          }
        }
      }
    },
    saveInfo () {
      this.$refs.formRef.validate((valid, n) => {
        if (!valid) {
          if (n) {
            let attrs = Object.keys(n)
            if (attrs && attrs.length > 0) {
              this.$refs[(attrs[0] + '_attr')].focus()
            }
          }

          return
        }
        const saveHead = Object.assign({}, this.formData)
        let data = JSON.stringify(saveHead)
        let selTaxReportIds = this.taxSelectedRows.reduce(
          (temp, row) => temp + ',' + row.pk_taxrpttemplet, '')
        let temp = {
          data,
          selTaxReportIds
        }
        this.showLoading()
        this.$api.BasicSettingApi.CompanySetting.saveInfo(temp).then(result => {
          this.closeLoading()
          if (result.success) {
            this.$parent.successMsg(result.msg)
            this.$parent.cardShow = false
            this.$parent.editStatus = false
            // this.$parent.$refs.queryparam.emit('click', true)
            // 更新store
            if (this.formData.pk_gs === this.$store.getters.currentCorp.pk_gs) {
              this.$store.commit('setCorpInfo', result.rows)
            }
          } else {
            this.$parent.errorMsg(result.msg)
          }
        }).catch(e => {
          this.closeLoading()
        })
      })
    },
    zxxjChandleChange (newValue, oldValue) {
      let columns = [ 'ylao', 'yliao', 'sye', 'gjj']
      let value = this.calAdd(columns)
      this.formData.zxxj = value
    },
    calAdd (columns) {
      let temp = 0
      if (columns == null || columns.length == 0) { return temp }

      let array = new Array()
      let len = columns.length
      for (let i = 0; i < len; i++) {
        array[i] = this.formData[columns[i]]
      }
      let zxdc = this.addByDouble(array)
      return zxdc
    },
    addByDouble (dous) {
      let temp = 0
      if (dous == null || dous.length == 0) { return temp }
      let len = dous.length
      for (let i = 0; i < len; i++) {
        temp = this.accAdd(temp, this.nvl(dous[i]))
      }
      return temp
    },
    nvl (value) {
      if (!value) {
        value = 0
      }
      return value
    },
    // 加法函数
    accAdd (arg1, arg2) {
      let t1 = 0, t2 = 0, m
      try {
        t1 = arg1.toString().split('.')[1].length
      } catch (e) {
        t1 = 0
      }
      try {
        t2 = arg2.toString().split('.')[1].length
      } catch (e) {
        t2 = 0
      }
      m = Math.pow(10, Math.max(t1, t2))
      return (arg1 * m + arg2 * m) / m
    }
  }
}
</script>

<style scoped>
  .query-info {
    margin: 11px 0px;
  }

  .nav-tabs {
    /*height: 30px;*/
    /*border-bottom: 1px solid #ddd;*/
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
  }

  .nav-tabs > li {
    float: left;
    margin-bottom: -1px;
  }

  .nav-tabs > li > a {
    text-decoration: none;
    padding: 10px 15px;
    color: #337ab7;
    margin-right: 2px;
    line-height: 1.42857143;
    border: 1px solid transparent;
    border-radius: 4px 4px 0 0;
  }

  .nav-tabs > li.active > a, .nav-tabs > li.active > a:focus, .nav-tabs > li.active > a:hover {
    color: #555;
    cursor: default;
    background-color: #fff;
    border: 1px solid #ddd;
    border-bottom-color: transparent;
  }
  .form-view {
    height: 100%;
    overflow: auto;
  }
</style>
