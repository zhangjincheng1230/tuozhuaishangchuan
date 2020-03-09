<template>
  <div class="app-main" style="overflow-y: hidden">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
              placement="bottom-start"
              title="查询"
              width="550"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：" v-show="!isSingleCorp">
                  <el-date-picker
                    v-model="queryForm.period"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="期间：" v-show="isSingleCorp">
                  <el-date-picker
                    v-model="queryForm.year"
                    value-format="yyyy"
                    type="year"
                    placeholder="选择年">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="客户：">
                  <el-select
                    v-model="queryForm.corpIds"
                    clearable
                    filterable
                    style="width: 415px">
                    <el-option v-for="item in corps"
                               :key="item.pk_gs"
                               :value="item.pk_gs"
                               :label="item.uname"
                               style="width:315px">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="纳税人资格：">
                  <el-select
                    v-model="queryForm.corptype"
                    placeholder="选择主办会计"
                    style="width: 415px">
                    <el-option v-for="item in corptypeRange"
                               :key="item.value"
                               :value="item.value"
                               :label="item.label"
                               style="width:315px">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="主办会计：">
                  <el-select
                    v-model="queryForm.userid"
                    clearable
                    filterable
                    style="width: 415px">
                    <el-option v-for="item in user"
                               :key="item.uid"
                               :value="item.uid"
                               :label="item.uname"
                               style="width:315px">
                    </el-option>
                  </el-select>
                </el-form-item>
<!--                <el-row>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="税种">-->
<!--                      <el-select-->
<!--                        v-model="queryForm.taxtype"-->
<!--                        style="width: 150px">-->
<!--                        <el-option v-for="item in taxtypeRange"-->
<!--                                   :key="item.value"-->
<!--                                   :value="item.value"-->
<!--                                   :label="item.label">-->
<!--                        </el-option>-->
<!--                      </el-select>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="12">-->
<!--                    <el-form-item label="申报状态">-->
<!--                      <el-select-->
<!--                        v-model="queryForm.nsstatus"-->
<!--                        style="width: 152px">-->
<!--                        <el-option v-for="item in nsstatusRange"-->
<!--                                   :key="item.value"-->
<!--                                   :value="item.value"-->
<!--                                   :label="item.label">-->
<!--                        </el-option>-->
<!--                      </el-select>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
                <el-form-item label="包含停用客户：">
                  <el-checkbox v-model="queryForm.checked"></el-checkbox>
                </el-form-item>
                <el-form-item label="地区：">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label-width="20px" label="省">
                        <el-select
                          v-model="queryForm.province_id"
                          clearable
                          filterable
                          style="width: 100px">
                          <el-option v-for="item in provinceRange"
                                     :key="item.region_id"
                                     :value="item.region_id"
                                     :label="item.region_name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label-width="20px" label="市">
                        <el-select
                          v-model="queryForm.city_id"
                          clearable
                          filterable
                          style="width: 100px">
                          <el-option v-for="item in cityRange"
                                     :key="item.region_id"
                                     :value="item.region_id"
                                     :label="item.region_name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label-width="20px" label="区">
                        <el-select
                          v-model="queryForm.district_id"
                          clearable
                          filterable
                          style="width: 100px">
                          <el-option v-for="item in districtRange"
                                     :key="item.region_id"
                                     :value="item.region_id"
                                     :label="item.region_name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="clear">清除</el-button>
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                             {{queryParam.qjq}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
          <span style="display:inline-block;margin-left: 20px" v-if="currentRow === null">
            <el-switch
              v-model="fshcwjd"
              active-text="财务进度">
            </el-switch>
            </span>
          <span style="display:inline-block;margin-left: 20px" v-if="currentRow === null">
            <el-switch
              v-model="fshsbqk"
              active-text="申报情况">
            </el-switch>
          </span>
          <span v-show="fshsbqk" style="display:inline-block;margin-left: 20px" v-if="currentRow === null">
            <el-switch
              v-model="fshyjl"
              active-text="应缴列">
            </el-switch>
          </span>
          <span v-show="fshsbqk" style="display:inline-block;margin-left: 20px" v-if="currentRow === null">
            <el-switch
              v-model="fshsjl"
              active-text="实缴列">
            </el-switch>
          </span>
        </div>
        <div class="kj-button-group" v-if="currentRow !== null">
          <el-button @click="cancel()">取消</el-button>
          <el-button @click="save">保存</el-button>
        </div>
        <div class="kj-button-group" v-if="currentRow === null">
          <el-dropdown :hide-on-click="false" v-show="fshsbqk && (fshsjl || fshyjl)">
            <el-button>
              显示列<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item><el-checkbox v-model="hb1">增值税</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb5">附加税合计</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb6">城建税</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb7">教育费附加</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb8">地方教育费附加</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb3">企业所得税</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="erstat">财报</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb2">消费税</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb4">文化事业建设费</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb10">印花税</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="hb9">个人所得税</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="paymny">应缴合计</el-checkbox></el-dropdown-item>
                <el-dropdown-item><el-checkbox v-model="paidmny">实缴合计</el-checkbox></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button @click="reflesh" v-show="!isSingleCorp">刷新</el-button>
          <el-button @click="fetchData" v-show="!isSingleCorp">取数</el-button>
          <el-button @click="excelexport">导出</el-button>
          <el-button @click="back" v-show="isSingleCorp">返回</el-button>
          <el-dropdown v-show="!isSingleCorp">
            <el-button>
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="fileupload">上传附件</el-dropdown-item>
                <el-dropdown-item @click.native="filePreview">查看附件</el-dropdown-item>
                <el-dropdown-item @click.native="remindMsg">提醒</el-dropdown-item>
                <el-dropdown-item @click.native="remindSet">提醒设置</el-dropdown-item>
                <el-dropdown-item @click.native="queryRemindSet">查看设置</el-dropdown-item>
                <el-dropdown-item @click.native="queryHistory">提醒历史</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <vxe-table
            ref="xTable"
            border
            resizable
            :data="tableData"
            height="100%"
            @edit-actived="editActivedEvent"
            :header-cell-style="headerCellStyle"
            :row-style="rowStyle"
            :customs.sync="customColumns"
            :edit-config="{trigger: 'click', mode: 'cell', showIcon: false}">
            <vxe-table-column type="index" label=" " fixed="left" width="40"></vxe-table-column>
            <vxe-table-column type="checkbox" fixed="left" width="40"></vxe-table-column>
            <vxe-table-column show-overflow width="120px" header-align="center" align="left" fixed="left" field="khbm" title="客户编码"></vxe-table-column>
            <vxe-table-column show-overflow width="240px" header-align="center" align="left" fixed="left" field="khmc" title="客户名称">
              <template slot-scope="{row}">
                <span class="link-type" @click="search(row)">{{row.khmc}}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column width="220px" header-align="center" align="left" fixed="left" field="period" title="月份"></vxe-table-column>
            <vxe-table-column width="100px" header-align="center" align="left" field="chname" title="纳税人资格"></vxe-table-column>
            <vxe-table-column show-overflow width="100px" header-align="center" align="left" v-if="ischannel !== 'Y'" field="pcount" title="主办会计"></vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="spzt" title="送票">
              <template  slot-scope="scope">
                <a style="cursor: pointer" @click="scope.row.spzt = 1 - scope.row.spzt, currentRow = scope.row">{{formatterZt(scope.row.spzt)}}</a>
              </template>
            </vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="accheck" title="关账">
            </vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="cszt"  title="抄税">
              <template  slot-scope="scope">
                <a style="cursor: pointer" @click="scope.row.cszt = 1 - scope.row.cszt, currentRow = scope.row">{{formatterZt(scope.row.cszt)}}</a>
              </template>
            </vxe-table-column>
            <vxe-table-column width="100px" header-align="center" align="center" :formatter="staformatter" field="taxconsta" title="税款确认状态"></vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="wczt"  title="申报状态">
              <template  slot-scope="scope">
                <a style="cursor: pointer" @click="scope.row.wczt = 1 - scope.row.wczt, currentRow = scope.row">{{formatterZt(scope.row.wczt)}}</a>
              </template>
            </vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="qkzt"  title="可清卡">
              <template  slot-scope="scope">
                <a style="cursor: pointer" @click="scope.row.qkzt = 1 - scope.row.qkzt, currentRow = scope.row">{{formatterZt(scope.row.qkzt)}}</a>
              </template>
            </vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="pzjjzt" title="凭证交接">
              <template  slot-scope="scope">
                <a style="cursor: pointer" @click="scope.row.pzjjzt = 1 - scope.row.pzjjzt, currentRow = scope.row">{{formatterZt(scope.row.pzjjzt)}}</a>
              </template>
            </vxe-table-column>
            <vxe-table-column width="80px" header-align="center" align="center" :formatter="iformatter" field="iszerodec"  title="零申报">
              <template  slot-scope="scope">
                <a style="cursor: pointer" @click="scope.row.iszerodec = scope.row.iszerodec === '是' ? '否':'是', currentRow = scope.row">{{formatterZt(scope.row.iszerodec)}}</a>
              </template>
            </vxe-table-column>
            <vxe-table-column width="90px" header-align="center" align="right" :formatter="formatMny" field="income" show-overflow  title="收入" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column width="270px" header-align="center" field="hb1" title="增值税">
              <vxe-table-column width="90px"  header-align="center" align="right" :formatter="formatMny" field="zzs" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="right" :formatter="formatMny" field="zzspaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="zzsstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.zzsstat = 1 - scope.row.zzsstat, currentRow = scope.row">{{formatterZt(scope.row.zzsstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column width="270px" header-align="center" title="附加税合计">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="addittax" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="addittaxpaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="addittaxstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.addittaxstat = 1 - scope.row.addittaxstat, currentRow = scope.row">{{formatterZt(scope.row.addittaxstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="城建税">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny"  field="cjs" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="cjspaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="cjsstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.cjsstat = 1 - scope.row.cjsstat, currentRow = scope.row">{{formatterZt(scope.row.cjsstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="教育费附加">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="jyffj" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="jyffjpaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="jyffjstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.jyffjstat = 1 - scope.row.jyffjstat, currentRow = scope.row">{{formatterZt(scope.row.jyffjstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px"  header-align="center" title="地方教育费附加">
              <vxe-table-column show-overflow width="90px"  header-align="center" align="right" :formatter="formatMny" field="dfjyf" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="dfjyfpaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="dfjyfstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.dfjyfstat = 1 - scope.row.dfjyfstat, currentRow = scope.row">{{formatterZt(scope.row.dfjyfstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="企业所得税">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="sds" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="sdspaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="sdsstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.sdsstat = 1 - scope.row.sdsstat, currentRow = scope.row">{{formatterZt(scope.row.sdsstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="90px" header-align="center" align="right" :formatter="iformatter" field="erstat" title="财报" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="消费税">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="xfs" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="xfspaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="xfsstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.xfsstat = 1 - scope.row.xfsstat, currentRow = scope.row">{{formatterZt(scope.row.xfsstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="文化事业建设费">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="cultax" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="cultaxpaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="cultaxstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.cultaxstat = 1 - scope.row.cultaxstat, currentRow = scope.row">{{formatterZt(scope.row.cultaxstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="印花税">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="stamptax" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="stamppaidtax" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="stampstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.stampstat = 1 - scope.row.stampstat, currentRow = scope.row">{{formatterZt(scope.row.stampstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>

            <vxe-table-column width="270px" header-align="center" title="个人所得税">
              <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="grsds" title="应缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column show-overflow width="90px"  header-align="center" align="right" :formatter="formatMny" field="grsdspaid" title="实缴" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
              <vxe-table-column width="90px" header-align="center" align="center" :formatter="iformatter" field="grsdsstat" title="申报状态">
                <template  slot-scope="scope">
                  <a style="cursor: pointer" @click="scope.row.grsdsstat = 1 - scope.row.grsdsstat, currentRow = scope.row">{{formatterZt(scope.row.grsdsstat)}}</a>
                </template>
              </vxe-table-column>
            </vxe-table-column>
            <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="paymny" title="应缴合计" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column show-overflow width="90px" header-align="center" align="right" :formatter="formatMny" field="paidmny" title="实缴合计" :edit-render="{name: 'ElInputNumber', props: {controls: false, precision: 2}}"></vxe-table-column>
            <vxe-table-column show-overflow width="90px" header-align="center" align="left" field="memo" title="备注" :edit-render="{name: 'input'}"></vxe-table-column>
          </vxe-table>
          <div v-show="!isSingleCorp">
            <Pagination :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.rows" @pagination="query"></Pagination>
          </div>
        </div>
      </div>
    </div>
    <remind-dialog :visible="visible" @save="saveRemind" @cancel="closeDialog"></remind-dialog>
    <remind-set :visible="remindSetVisible" :remindSet="remindSetForm" @save="saveRemindSet" @cancel="cancelRemindSet"></remind-set>
    <remind-history :visible="remindHistoryVisible" :historyData="remindHistoryData" @cancel="cancelHistory"></remind-history>
    <fileuploaddialog ref="fileuploaddialog"> </fileuploaddialog>
    <filePreview ref="filePreview"> </filePreview>

  </div>
</template>

<script>
import App from '../../../../App'
import Pagination from '@/components/Pagination'
import {mapGetters} from 'vuex'
import { deepClone } from '@/utils'
import remindDialog from './remind-dialog'
import remindSet from './remind-set'
import remindHistory from './remind-history'
import fileuploaddialog from './file-up-dialog'
import filePreview from './file-preview'
export default {
  name: 'tax-workbench',
  components: {App, Pagination, remindDialog, remindSet, remindHistory, fileuploaddialog, filePreview},
  data () {
    // 自定义校验方法
    return {
      isSingleCorp: false,
      remindSetForm: [],
      remindHistoryData: [],
      remindHistoryVisible: false,
      visible: false,
      remindSetVisible: false,
      queryVisible: false,
      isSingle: false,
      customColumns: [
        {
          field: 'period',
          visible: false
        }
      ],
      pageInfo: {
        page: 1,
        rows: 100
      },
      currentRow: null,
      total: 20,
      queryForm: {
        period: this.$store.getters.getLoginDate.substring(0, 7),
        year: this.$store.getters.getLoginDate.substring(0, 4),
        corpIds: '',
        userid: '',
        corptype: '-1',
        taxtype: '-1',
        nsstatus: '-1',
        checked: true,
        province_id: '',
        city_id: '',
        district_id: ''
      },
      loading: false,
      corps: this.$store.getters.corps,
      corpName: this.$store.getters.currentCorp.uname,
      queryParam: {
        qjq: this.$store.getters.getLoginDate.substring(0, 7),
        year: ''
      },
      corptypeRange: [{label: '全部', value: '-1'}, {label: '一般纳税人', value: '0'}, {label: '小规模纳税人', value: '1'}],
      taxtypeRange: [
        {value: '-1', label: '全部'},
        {value: '1', label: '增值税'},
        {value: '2', label: '消费税'},
        {value: '3', label: '企业所得税'},
        {value: '4', label: '文化事业建设费'},
        {value: '5', label: '附加税合计'},
        {value: '6', label: '城建税'},
        {value: '7', label: '教育费附加'},
        {value: '8', label: '地方教育费附加'},
        {value: '9', label: '个人所得税'},
        {value: '10', label: '印花税'}
      ],
      areaRange: [],
      nsstatusRange: [
        {label: '全部', value: '-1'},
        {label: '✔', value: '1'},
        {label: '×', value: '0'}
      ],
      user: [],
      tableData: [],
      oldTableData: [],
      buttonColsetup: {},
      showColsetup: {},
      validRules: {
        income: [
          {type: 'number', message: '必须填数字', required: false, trigger: 'change' }
        ],
        zzs: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        zzspaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        xfs: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        xfspaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        sds: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        sdspaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        cultax: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        cultaxpaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        addittax: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        addittaxpaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        cjs: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        cjspaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        jyffj: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        jyffjpaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        dfjyf: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        dfjyfpaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        grsds: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        grsdspaid: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        stamptax: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        stamppaidtax: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        erstat: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        paymny: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ],
        paidmny: [
          {type: 'number', message: '必须填数字', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    isSingleCorp: function (val) {
      this.customColumns.find(v => v.property === 'khbm').visible = !val
      this.customColumns.find(v => v.property === 'khmc').visible = !val
      this.customColumns.find(v => v.property === 'period').visible = val
      this.$refs.xTable.refreshColumn()
    }
  },
  computed: {
    // 旗舰版
    ...mapGetters(['ischannel']),
    // 增值税
    hb1: {
      get () {
        return this.checkedShowCol('hb1')
      },
      set (newval) {
        this.hideColumn('zzs', this.fshyjl && newval)
        this.hideColumn('zzspaid', this.fshsjl && newval)
        // this.hideColumn('zzsstat', this.fshsjl && newval)
        this.setShowCol('hb1', newval)
        this.saveShowCol()
      }
    },
    // 消费税
    hb2: {
      get () {
        return this.checkedShowCol('hb2')
      },
      set (newval) {
        this.hideColumn('xfs', this.fshyjl && newval)
        this.hideColumn('xfspaid', this.fshsjl && newval)
        // this.hideColumn('xfsstat', this.fshsjl && newval)
        this.setShowCol('hb2', newval)
        this.saveShowCol()
      }
    },
    // 企业所得税
    hb3: {
      get () {
        return this.checkedShowCol('hb3')
      },
      set (newval) {
        this.hideColumn('sds', this.fshyjl && newval)
        this.hideColumn('sdspaid', this.fshsjl && newval)
        // this.hideColumn('sdsstat', this.fshsjl && newval)
        this.setShowCol('hb3', newval)
        this.saveShowCol()
      }
    },
    // 文化事业建设费
    hb4: {
      get () {
        return this.checkedShowCol('hb4')
      },
      set (newval) {
        this.hideColumn('cultax', this.fshyjl && newval)
        this.hideColumn('cultaxpaid', this.fshsjl && newval)
        // this.hideColumn('cultaxstat', this.fshsjl && newval)
        this.setShowCol('hb4', newval)
        this.saveShowCol()
      }
    },
    // 附加税合计
    hb5: {
      get () {
        return this.checkedShowCol('hb5')
      },
      set (newval) {
        this.hideColumn('addittax', this.fshyjl && newval)
        this.hideColumn('addittaxpaid', this.fshsjl && newval)
        // this.hideColumn('addittaxstat', this.fshsjl && newval)
        this.setShowCol('hb5', newval)
        this.saveShowCol()
      }
    },
    // 城建税
    hb6: {
      get () {
        return this.checkedShowCol('hb6')
      },
      set (newval) {
        this.hideColumn('cjs', this.fshyjl && newval)
        this.hideColumn('cjspaid', this.fshsjl && newval)
        // this.hideColumn('cjsstat', this.fshsjl && newval)
        this.setShowCol('hb6', newval)
        this.saveShowCol()
      }
    },
    // 教育费附加
    hb7: {
      get () {
        return this.checkedShowCol('hb7')
      },
      set (newval) {
        this.hideColumn('jyffj', this.fshyjl && newval)
        this.hideColumn('jyffjpaid', this.fshsjl && newval)
        // this.hideColumn('jyffjstat', this.fshsjl && newval)
        this.setShowCol('hb7', newval)
        this.saveShowCol()
      }
    },
    // 地方教育费附加
    hb8: {
      get () {
        return this.checkedShowCol('hb8')
      },
      set (newval) {
        this.hideColumn('dfjyf', this.fshyjl && newval)
        this.hideColumn('dfjyfpaid', this.fshsjl && newval)
        // this.hideColumn('dfjyfstat', this.fshsjl && newval)
        this.setShowCol('hb8', newval)
        this.saveShowCol()
      }
    },
    // 个人所得税
    hb9: {
      get () {
        return this.checkedShowCol('hb9')
      },
      set (newval) {
        this.hideColumn('grsds', this.fshyjl && newval)
        this.hideColumn('grsdspaid', this.fshsjl && newval)
        // this.hideColumn('grsdsstat', this.fshsjl && newval)
        this.setShowCol('hb9', newval)
        this.saveShowCol()
      }
    },
    // 印花税
    hb10: {
      get () {
        return this.checkedShowCol('hb10')
      },
      set (newval) {
        this.hideColumn('stamptax', this.fshyjl && newval)
        this.hideColumn('stamppaidtax', this.fshsjl && newval)
        // this.hideColumn('stampstat', this.fshsjl && newval)
        this.setShowCol('hb10', newval)
        this.saveShowCol()
      }
    },
    // 财报
    erstat: {
      get () {
        return this.checkedShowCol('erstat')
      },
      set (newval) {
        this.hideColumn('erstat', newval)
        this.setShowCol('erstat', newval)
        this.saveShowCol()
      }
    },
    // 应缴合计
    paymny: {
      get () {
        return this.checkedShowCol('paymny')
      },
      set (newval) {
        this.setShowCol('paymny', newval)
        this.hideColumn('paymny', newval)
        this.saveShowCol()
      }
    },
    fshcwjd: {
      get () {
        return this.checkedButtonCol('fshcwjd')
      },
      set (newval) {
        this.setButtonCol('fshcwjd', newval)
        this.hideColumn('spzt', newval)
        this.hideColumn('accheck', newval)
        this.hideColumn('cszt', newval)
        this.hideColumn('taxconsta', newval)
        this.hideColumn('wczt', newval)
        this.hideColumn('qkzt', newval)
        this.hideColumn('pzjjzt', newval)
        this.hideColumn('iszerodec', newval)
        this.saveButtonCol()
      }
    },
    fshsbqk: {
      get () {
        return this.checkedButtonCol('fshsbqk')
      },
      set (newval) {
        this.hideColumn('zzs', this.fshyjl && this.hb1 && newval)
        this.hideColumn('zzspaid', this.fshsjl && this.hb1 && newval)
        this.hideColumn('zzsstat', this.hb1 && newval)
        this.hideColumn('xfs', this.fshyjl && this.hb2 && newval)
        this.hideColumn('xfspaid', this.fshsjl && this.hb2 && newval)
        this.hideColumn('xfsstat', this.hb2 && newval)
        this.hideColumn('sds', this.fshyjl && this.hb3 && newval)
        this.hideColumn('sdspaid', this.fshsjl && this.hb3 && newval)
        this.hideColumn('sdsstat', this.hb3 && newval)
        this.hideColumn('cultax', this.fshyjl && this.hb4 && newval)
        this.hideColumn('cultaxpaid', this.fshsjl && this.hb4 && newval)
        this.hideColumn('cultaxstat', this.hb4 && newval)
        this.hideColumn('addittax', this.fshyjl && this.hb5 && newval)
        this.hideColumn('addittaxpaid', this.fshsjl && this.hb5 && newval)
        this.hideColumn('addittaxstat', this.hb5 && newval)
        this.hideColumn('cjs', this.fshyjl && this.hb6 && newval)
        this.hideColumn('cjspaid', this.fshsjl && this.hb6 && newval)
        this.hideColumn('cjsstat', this.hb6 && newval)
        this.hideColumn('jyffj', this.fshyjl && this.hb7 && newval)
        this.hideColumn('jyffjpaid', this.fshsjl && this.hb7 && newval)
        this.hideColumn('jyffjstat', this.hb7 && newval)
        this.hideColumn('dfjyf', this.fshyjl && this.hb8 && newval)
        this.hideColumn('dfjyfpaid', this.fshsjl && this.hb8 && newval)
        this.hideColumn('dfjyfstat', this.hb8 && newval)
        this.hideColumn('grsds', this.fshyjl && this.hb9 && newval)
        this.hideColumn('grsdspaid', this.fshsjl && this.hb9 && newval)
        this.hideColumn('grsdsstat', this.hb9 && newval)
        this.hideColumn('stamptax', this.fshyjl && this.hb10 && newval)
        this.hideColumn('stamppaidtax', this.fshsjl && this.hb10 && newval)
        this.hideColumn('stampstat', this.hb10 && newval)
        this.hideColumn('erstat', newval)
        this.hideColumn('paymny', newval)
        this.hideColumn('paidmny', newval)

        this.setButtonCol('fshsbqk', newval)
        this.saveButtonCol()
      }
    },
    fshsjl: {
      get () {
        return this.checkedButtonCol('fshsjl')
      },
      set (newval) {
        this.hideColumn('zzspaid', this.hb1 && newval)
        // this.hideColumn('zzsstat', this.hb1 && newval)
        this.hideColumn('xfspaid', this.hb2 && newval)
        // this.hideColumn('xfsstat', this.hb2 && newval)
        this.hideColumn('sdspaid', this.hb3 && newval)
        // this.hideColumn('sdsstat', this.hb3 && newval)
        this.hideColumn('cultaxpaid', this.hb4 && newval)
        // this.hideColumn('cultaxstat', this.hb4 && newval)
        this.hideColumn('addittaxpaid', this.hb5 && newval)
        // this.hideColumn('addittaxstat', this.hb5 && newval)
        this.hideColumn('cjspaid', this.hb6 && newval)
        // this.hideColumn('cjsstat', this.hb6 && newval)
        this.hideColumn('jyffjpaid', this.hb7 && newval)
        // this.hideColumn('jyffjstat', this.hb7 && newval)
        this.hideColumn('dfjyfpaid', this.hb8 && newval)
        // this.hideColumn('dfjyfstat', this.hb8 && newval)
        this.hideColumn('grsdspaid', this.hb9 && newval)
        // this.hideColumn('grsdsstat', this.hb9 && newval)
        this.hideColumn('stamppaidtax', this.hb10 && newval)
        // this.hideColumn('stampstat', this.hb10 && newval)
        this.setButtonCol('fshsjl', newval)
        this.saveButtonCol()
      }
    },
    fshyjl: {
      get () {
        return this.checkedButtonCol('fshyjl')
      },
      set (newval) {
        this.hideColumn('zzs', this.hb1 && newval)
        this.hideColumn('xfs', this.hb2 && newval)
        this.hideColumn('sds', this.hb3 && newval)
        this.hideColumn('cultax', this.hb4 && newval)
        this.hideColumn('addittax', this.hb5 && newval)
        this.hideColumn('cjs', this.hb6 && newval)
        this.hideColumn('jyffj', this.hb7 && newval)
        this.hideColumn('dfjyf', this.hb8 && newval)
        this.hideColumn('grsds', this.hb9 && newval)
        this.hideColumn('stamptax', this.hb10 && newval)
        this.setButtonCol('fshyjl', newval)
        this.saveButtonCol()
      }
    },
    // 实缴合计
    paidmny: {
      get () {
        return this.checkedShowCol('paidmny')
      },
      set (newval) {
        this.hideColumn('paidmny', newval)
        this.setShowCol('paidmny', newval)
        this.saveShowCol()
      }
    },
    nodename () {
      return '纳税工作台'
    },
    provinceRange () {
      return this.areaRange.filter(v => v.parenter_id === 1)
    },
    cityRange () {
      return (this.queryForm.province_id != null && this.queryForm.province_id !== '') ? this.areaRange.filter(v => v.parenter_id === this.queryForm.province_id) : []
    },
    districtRange () {
      return (this.queryForm.city_id != null && this.queryForm.city_id !== '') ? this.areaRange.filter(v => v.parenter_id === this.queryForm.city_id) : []
    }
  },
  methods: {
    clear () {
      this.queryForm = {
        period: this.$store.getters.getLoginDate.substring(0, 7),
        year: this.$store.getters.getLoginDate.substring(0, 4),
        corpIds: '',
        userid: '',
        corptype: '-1',
        taxtype: '-1',
        nsstatus: '-1',
        checked: true,
        province_id: '',
        city_id: '',
        district_id: ''
      }
    },
    search (row) {
      if (this.currentRow !== null) {
        this.$message({
          message: '请保存当前页面，以免造成当前修改数据丢失',
          type: 'warning'
        })
        return
      }
      this.isSingleCorp = true
      this.queryForm.corpIds = row.khid
      this.queryForm.year = this.queryForm.period.substring(0, 4)
      this.queryForm.corpname = row.khmc
      this.queryByCorp()
    },
    keydownEvent ({rowIndex, columnIndex, column, data}, event) {
      console.log(rowIndex)
      console.log(columnIndex)
      console.log(column)
      console.log(data)
    },
    queryByCorp () {
      this.$api.TaxRptApi.Workbench.queryByCorp(this.getQueryPram()).then(result => {
        if (result.success) {
          this.total = result.total
          this.tableData = result.rows
          this.queryVisible = false
        } else {
          this.tableData = []
        }
      }).catch(e => {
        this.tableData = []
      })
    },
    back () {
      this.isSingleCorp = false
      this.queryForm.corpIds = ''
      this.queryForm.corpname = ''
      this.queryForm.period = this.queryForm.year + '-' + this.queryForm.period.substring(5, 7)
      this.query()
    },
    editActivedEvent ({ row, column }, event) {
      this.currentRow = row
    },
    queryHistory () {
      let selectedRows = this.getSelectedRows()
      if (selectedRows.length === 0) {
        this.$message({
          message: '请先选择需要查询的数据',
          type: 'warning'
        })
        return
      }
      if (selectedRows.length > 1) {
        this.$message({
          message: '选择一条需要查看设置的数据',
          type: 'warning'
        })
        return
      }
      this.$api.TaxRptApi.Workbench.queryHistory({qj: this.queryParam.qjq, corpid: this.getSelectedRows()[0].khid}).then(result => {
        if (result.success) {
          this.remindHistoryData = result.rows
          this.remindHistoryVisible = true
        } else {
          this.$message.error(result.msg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    queryRemindSet () {
      let selectedRows = this.getSelectedRows()
      if (selectedRows.length === 0) {
        this.$message({
          message: '请先选择需要处理的数据',
          type: 'warning'
        })
        return
      }
      if (selectedRows.length > 1) {
        this.$message({
          message: '选择一条需要查看设置的数据',
          type: 'warning'
        })
        return
      }
      this.$api.TaxRptApi.Workbench.qryRemindSet({bsVOs: this.getSelectedRows()}).then(result => {
        if (result.success) {
          this.remindSetForm = result.rows
          this.remindSetVisible = true
        } else {
          this.$message.error(result.msg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    filePreview () {
      let selectedRows = this.getSelectedRows()
      if (selectedRows && selectedRows.length !== 1) {
        this.$message({
          message: '请选择一行数据进行查看',
          type: 'warning'
        })
        return
      }
      console.log(selectedRows)
      const khid = selectedRows[0].khid
      const period = this.queryParam.qjq
      const corpid = selectedRows[0].fcorp
      const cpperiod = selectedRows[0].khid + '' + period
      this.$refs.filePreview.show(true, khid, corpid, cpperiod)
    },
    fileupload () {
      let selectedRows = this.getSelectedRows()
      if (selectedRows && selectedRows.length !== 1) {
        this.$message({
          message: '请选择一行数据进行上传',
          type: 'warning'
        })
        return
      }
      const corpkna = selectedRows[0].khmc
      const period = this.queryParam.qjq
      const cpperiod = selectedRows[0].khid + '' + period
      this.$refs.fileuploaddialog.show(corpkna, selectedRows[0].khid, period, cpperiod)
    },
    remindSet () {
      let selectedRows = this.getSelectedRows()
      if (selectedRows.length === 0) {
        this.$message({
          message: '请先选择需要处理的数据',
          type: 'warning'
        })
        return
      }
      this.remindSetVisible = true
    },
    remindMsg () {
      let selectedRows = this.getSelectedRows()
      if (selectedRows.length === 0) {
        this.$message({
          message: '请先选择需发送提醒的客户',
          type: 'warning'
        })
        return
      }
      this.visible = true
    },
    cancelRemindSet () {
      this.remindSetForm = []
      this.remindSetVisible = false
    },
    closeDialog () {
      this.visible = false
    },

    saveRemindSet (remindSet) {
      this.remindSetVisible = false
      this.$api.TaxRptApi.Workbench.sendReminSet({remVOs: remindSet, bsVOs: this.getSelectedRows()}).then(result => {
        if (result.success) {
          this.$message({
            message: result.msg,
            dangerouslyUseHTMLString: true,
            type: (result.status === -1 ? 'warning' : 'success')
          })
          this.cancelRemindSet()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    saveRemind (value) {
      this.visible = false
      this.$api.TaxRptApi.Workbench.saveRemind({msgtype: value, qj: this.queryParam.qjq, bsVOs: this.getSelectedRows()}).then(result => {
        if (result.success) {
          this.$message({
            message: result.msg,
            dangerouslyUseHTMLString: true,
            type: (result.status === -1 ? 'warning' : 'success')
          })
          this.closeDialog()
        } else {
          this.$message.error(result.msg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    hideColumn (property, isshow) {
      this.customColumns.find(v => v.property === property).visible = isshow
    },
    checkedShowCol (colName) {
      return this.showColsetup.hasOwnProperty(colName) && this.showColsetup[colName] === 'Y'
    },
    checkedButtonCol (colName) {
      return this.buttonColsetup.hasOwnProperty(colName) && this.buttonColsetup[colName] === 'Y'
    },
    setShowCol (colName, newVal) {
      this.showColsetup[colName] = newVal ? 'Y' : 'N'
    },
    setButtonCol (colName, newVal) {
      this.buttonColsetup[colName] = newVal ? 'Y' : 'N'
    },
    saveShowCol () {
      this.$refs.xTable.refreshColumn()
      this.$api.TaxRptApi.Workbench.saveCol({nodecode: 'admin109', colsetup: JSON.stringify(this.showColsetup), settype: '1'}).catch(e => {
        console.log(e)
      })
    },
    saveButtonCol () {
      this.$refs.xTable.refreshColumn()
      this.$api.TaxRptApi.Workbench.saveCol({nodecode: 'admin109', colsetup: JSON.stringify(this.buttonColsetup), settype: '2'}).catch(e => {
        console.log(e)
      })
    },
    getSelectedRows () {
      return this.$refs.xTable.getSelectRecords()
    },
    init () {
      this.loading = true
      this.queryUser()
      this.queryArea()
      this.query()
      this.queryButtonColsetup()
      this.queryShowColsetup()
    },
    validEvent () {
      this.$refs.xTable.validate(valid => {
        if (valid) {
          return true
        } else {
          return false
        }
      })
    },
    save () {
      let changRows = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.isObjectValueEqual(this.tableData[i], this.oldTableData[i])) {
          let d = this.tableData[i]
          if (!d.hasOwnProperty('period') || d.period === null || d.period === '') {
            d.period = this.queryParam.qjq
          }
          changRows.push(this.tableData[i])
        }
      }
      if (changRows.length > 0) {
        this.$api.TaxRptApi.Workbench.save({bsVOs: changRows}).then(result => {
          if (result.success) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.oldTableData = deepClone(this.tableData)
            this.cancel()
          } else {
            this.$message.error(result.msg)
          }
        }).catch(e => {
          console.log(e)
        })
      } else {
        this.cancel()
      }
    },
    cancel (row) {
      this.currentRow = null
      this.tableData = deepClone(this.oldTableData)
    },
    cancelHistory () {
      this.remindHistoryVisible = false
    },
    query () {
      if (this.isSingleCorp) {
        this.queryByCorp()
        return
      }
      this.$api.TaxRptApi.Workbench.query(this.getQueryPram()).then(result => {
        if (result.success) {
          this.queryVisible = false
          this.total = result.total
          this.tableData = result.rows
          this.oldTableData = deepClone(this.tableData)
        } else {
          this.tableData = []
          this.oldTableData = []
        }
      }).catch(e => {
        this.tableData = []
        this.oldTableData = []
      })
    },
    getQueryPram () {
      let queryParam = {}
      if (!this.isSingleCorp) {
        queryParam.qjq = this.queryForm.period // 查询区间
      } else {
        queryParam.qjq = this.queryForm.year // 查询区间
      }

      queryParam.corpIds = this.queryForm.corpIds // 客户
      queryParam.userid = this.queryForm.userid // 主办会计id
      queryParam.levelq = this.queryForm.corptype // 纳税人资格
      queryParam.isleaf = this.queryForm.checked ? 'Y' : 'N'// 包含停用客户
      queryParam.isywskp = this.queryForm.taxtype // 税种
      queryParam.ifwgs = this.queryForm.nsstatus // 申报状态
      queryParam.corpname = this.queryForm.corpname

      queryParam.cjq = this.queryForm.province_id === '' ? '-1' : this.queryForm.province_id // 省
      queryParam.cjz = this.queryForm.city_id === '' ? '-1' : this.queryForm.city_id // 市
      queryParam.levelz = this.queryForm.district_id === '' ? '-1' : this.queryForm.district_id // 区
      queryParam.page = this.pageInfo.page
      queryParam.rows = this.pageInfo.rows
      this.queryParam = queryParam
      return queryParam
    },
    queryButtonColsetup () {
      this.$api.TaxRptApi.Workbench.queryCol({nodecode: 'admin109', settype: '2'}).then(result => {
        if (result.success && result.hasOwnProperty('rows') && result.rows.hasOwnProperty('colsetup') && Object.keys(result.rows.colsetup) !== 1) {
          this.buttonColsetup = JSON.parse(result.rows.colsetup)
          this.initButtonIsShow()
        } else {
          this.buttonColsetup = {}
        }
      }).catch(e => {
        this.buttonColsetup = {}
      })
    },
    queryShowColsetup () {
      this.$api.TaxRptApi.Workbench.queryCol({nodecode: 'admin109', settype: '1'}).then(result => {
        if (result.success && result.hasOwnProperty('rows') && result.rows.hasOwnProperty('colsetup') && Object.keys(result.rows.colsetup) !== 1) {
          this.showColsetup = JSON.parse(result.rows.colsetup)
          this.initColumnIsShow()
        } else {
          this.showColsetup = {}
        }
      }).catch(e => {
        this.showColsetup = {}
      })
    },
    initButtonIsShow () {
      for (let key in this.buttonColsetup) {
        let newval = this.buttonColsetup[key] === 'Y'
        switch (key) {
          case 'fshcwjd' :
            this.hideColumn('spzt', newval)
            this.hideColumn('accheck', newval)
            this.hideColumn('cszt', newval)
            this.hideColumn('taxconsta', newval)
            this.hideColumn('wczt', newval)
            this.hideColumn('qkzt', newval)
            this.hideColumn('pzjjzt', newval)
            this.hideColumn('iszerodec', newval)
            break
          case 'fshsbqk':
            this.hideColumn('zzs', newval)
            this.hideColumn('zzspaid', newval)
            this.hideColumn('zzsstat', newval)
            this.hideColumn('xfs', newval)
            this.hideColumn('xfspaid', newval)
            this.hideColumn('xfsstat', newval)
            this.hideColumn('sds', newval)
            this.hideColumn('sdspaid', newval)
            this.hideColumn('sdsstat', newval)
            this.hideColumn('cultax', newval)
            this.hideColumn('cultaxpaid', newval)
            this.hideColumn('cultaxstat', newval)
            this.hideColumn('addittax', newval)
            this.hideColumn('addittaxpaid', newval)
            this.hideColumn('addittaxstat', newval)
            this.hideColumn('cjs', newval)
            this.hideColumn('cjspaid', newval)
            this.hideColumn('cjsstat', newval)
            this.hideColumn('jyffj', newval)
            this.hideColumn('jyffjpaid', newval)
            this.hideColumn('jyffjstat', newval)
            this.hideColumn('dfjyf', newval)
            this.hideColumn('dfjyfpaid', newval)
            this.hideColumn('dfjyfstat', newval)
            this.hideColumn('grsds', newval)
            this.hideColumn('grsdspaid', newval)
            this.hideColumn('grsdsstat', newval)
            this.hideColumn('stamptax', newval)
            this.hideColumn('stamppaidtax', newval)
            this.hideColumn('stampstat', newval)
            this.hideColumn('erstat', newval)
            this.hideColumn('paymny', newval)
            this.hideColumn('paidmny', newval)
            break
          case 'fshsjl' :
            this.hideColumn('zzspaid', newval)
            // this.hideColumn('zzsstat', newval)
            this.hideColumn('xfspaid', newval)
            // this.hideColumn('xfsstat', newval)
            this.hideColumn('sdspaid', newval)
            // this.hideColumn('sdsstat', newval)
            this.hideColumn('cultaxpaid', newval)
            // this.hideColumn('cultaxstat', newval)
            this.hideColumn('addittaxpaid', newval)
            // this.hideColumn('addittaxstat', newval)
            this.hideColumn('cjspaid', newval)
            // this.hideColumn('cjsstat', newval)
            this.hideColumn('jyffjpaid', newval)
            // this.hideColumn('jyffjstat', newval)
            this.hideColumn('dfjyfpaid', newval)
            // this.hideColumn('dfjyfstat', newval)
            this.hideColumn('grsdspaid', newval)
            // this.hideColumn('grsdsstat', newval)
            this.hideColumn('stamppaidtax', newval)
            // this.hideColumn('stampstat', newval)
            break
          case 'fshyjl' :
            this.hideColumn('zzs', newval)
            this.hideColumn('xfs', newval)
            this.hideColumn('sds', newval)
            this.hideColumn('cultax', newval)
            this.hideColumn('addittax', newval)
            this.hideColumn('cjs', newval)
            this.hideColumn('jyffj', newval)
            this.hideColumn('dfjyf', newval)
            this.hideColumn('grsds', newval)
            this.hideColumn('stamptax', newval)
            break
        }
      }
      this.$refs.xTable.refreshColumn()
    },
    initColumnIsShow () {
      for (let key in this.showColsetup) {
        switch (key) {
          case 'hb1':
            this.hideColumn('zzs', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('zzspaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('zzsstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
          case 'hb2' :
            this.hideColumn('xfs', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('xfspaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('xfsstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
          case 'hb3' :
            this.hideColumn('sds', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('sdspaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('sdsstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break

          case 'hb4' :
            this.hideColumn('cultax', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('cultaxpaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('cultaxstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break

          case 'hb5' :
            this.hideColumn('addittax', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('addittaxpaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('addittaxstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break

          case 'hb6' :
            this.hideColumn('cjs', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('cjspaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('cjsstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break

          case 'hb7' :
            this.hideColumn('jyffj', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('jyffjpaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('jyffjstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break

          case 'hb8' :
            this.hideColumn('dfjyf', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('dfjyfpaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('dfjyfstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break

          case 'hb9' :
            this.hideColumn('grsds', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('grsdspaid', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('grsdsstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
          case 'hb10' :
            this.hideColumn('stamptax', this.fshsbqk && this.showColsetup[key] === 'Y')
            this.hideColumn('stamppaidtax', this.fshsbqk && this.fshsjl && this.showColsetup[key] === 'Y')
            this.hideColumn('stampstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
          case 'erstat' :
            this.hideColumn('erstat', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
          case 'paymny' :
            this.hideColumn('paymny', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
          case 'paidmny' :
            this.hideColumn('paidmny', this.fshsbqk && this.showColsetup[key] === 'Y')
            break
        }
      }
      this.$refs.xTable.refreshColumn()
    },
    queryArea () {
      this.$api.TaxRptApi.Workbench.queryAllArea().then(result => {
        if (result.success) {
          this.areaRange = result.rows
        } else {
          this.areaRange = []
        }
      }).catch(e => {
        this.areaRange = []
      })
    },
    queryUser () {
      this.$api.TaxRptApi.Workbench.queryUser().then(result => {
        if (result.success) {
          this.user = result.rows
        } else {
          this.user = []
        }
      }).catch(e => {
        this.user = []
      })
    },
    reflesh () {
      this.query()
    },
    fetchData () {
      this.$api.TaxRptApi.Workbench.fetchData(this.getFetchDataQueryParam()).then(result => {
        if (result.success) {
          this.query()
          this.$message({
            message: '取数成功',
            type: 'success'
          })
        } else {
          if (result.msg) {
            this.$message.error()
          }
        }
      }).catch(e => {

      })
    },
    getFetchDataQueryParam () {
      return {pk_corpks: this.tableData.map(v => v.khid).join(','), period: this.queryParam.qjq}
    },
    excelexport () {
      this.$api.TaxRptApi.Workbench.exportData('纳税工作台_' + this.queryParam.qjq, this.getExportParam())
    },
    getExportParam () {
      return {
        isSingle: this.isSingleCorp,
        strlist: JSON.stringify(this.tableData),
        period: this.queryParam.qjq,
        corpname: this.isSingleCorp ? this.queryParam.corpname : ''
      }
    },
    formatMny ({ cellValue }) {
      return this.$options.filters.forThousands(cellValue)
    },
    iformatter ({ cellValue }) {
      if (cellValue === '0' || cellValue === 0 || cellValue === '否') {
        return '×'
      } else if (cellValue === '1' || cellValue === 1 || cellValue === '是') {
        return '✔'
      }
    },
    formatterZt (cellValue) {
      if (cellValue === '0' || cellValue === 0 || cellValue === '否') {
        return '×'
      } else if (cellValue === '1' || cellValue === 1 || cellValue === '是') {
        return '✔'
      }
    },
    staformatter ({ cellValue }) {
      if (cellValue === 0) {
        return '待确认'
      } else if (cellValue === 1) {
        return '已确认'
      } else if (cellValue === 2) {
        return '有异议'
      }
    },
    selectGet (vId) {
      let obj = {}
      obj = this.$store.getters.corps.find((item) => {
        return item.pk_gs === vId
      })
      return obj.uname
    },
    handleCurrentChange (val) {
      this.currentRow = val
    },
    isObjectValueEqual (a, b) {
      return JSON.stringify(a, this.replacer) === JSON.stringify(b)
    },
    replacer (key, value) {
      if (key === '_XID') return undefined
      else return value
    },
    headerCellStyle () {
      return {
        backgroundColor: '#ccc',
        height: '30px',
        'font-size': '12px'
      }
    },
    rowStyle () {
      return {
        height: '20px',
        'font-size': '12px'
      }
    }
  }
}
</script>

<style scoped>
  .link-type, .link-type:focus {
    color: #66b1ff;
    cursor: pointer;
  }
  >>>.el-input-number--small {
    width: 65px;
    line-height: 30px;
  }
  >>>.el-input-number.is-without-controls .el-input__inner {
    padding-left: 0px;
    padding-right: 0px;
  }
  /*>>>.vxe-table .vxe-body--column.col--ellipsis, .vxe-table.vxe-editable .vxe-body--column, .vxe-table .vxe-footer--column.col--ellipsis, .vxe-table .vxe-header--column.col--ellipsis {*/
  /*  height: 32px;*/
  /*}*/
</style>
