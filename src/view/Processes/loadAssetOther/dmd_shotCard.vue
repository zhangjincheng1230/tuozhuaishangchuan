<template>
  <div style="position: relative;border: 1px solid #ddd;background:rgba(255,255,255,1)">
    <el-container>
      <Header :isShow="{isShowCompany}">
        <el-row slot="HeadRight">
          <!--引用header组件中的HeadRight-->
          <el-button size="mini" @click="refreshTable">刷新</el-button>
          <el-dropdown style="margin: 0 10px" @command="handleCommand">
            <el-button size="mini" @click="addCardInfo">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="cope">复制</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" @click="editTableRow">修改</el-button>
          <el-dropdown style="margin: 0 10px">
            <el-button size="mini" @click="trunZz('N')">
              转总账
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="trunZz('Y')">合并制证</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button size="mini" @click="detail">折旧明细</el-button>
          <el-button size="mini" @click="dateAdjust">年限调整</el-button>
          <el-button size="mini" @click="asseClear">资产清理</el-button>
          <el-button size="mini" @click="tidyCard">卡片整理</el-button>
          <el-button size="mini" @click="deleteTableRows">删除</el-button>
          <el-dropdown style="margin-left: 10px" @command="handleCommand">
            <el-button size="mini">
              导入
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="export">导出(仅支持查看)</el-dropdown-item>
              <el-dropdown-item command="expAndimp">导出(支持导入)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-container slot="SelectCondition">
          <el-main>
            <el-form-item>
              <h4>资产卡片查询</h4>
            </el-form-item>
            <el-form-item
              size="mini"
              label="入账日期:"
              label-width="100"
              style="border-bottom: 1px dashed #dadada;padding-bottom: 5px;"
            >
              <el-date-picker
                v-model="date"
                type="daterange"
                unlink-panels
                range-separator="至"
                value-format="yyyy-MM-dd"
                style="width: 333px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item size="mini" label="卡片编码:" label-width="100">
              <el-input v-model="cardCode" style="width: 333px"></el-input>
            </el-form-item>
            <el-form-item size="mini" label="资产名称:" label-width="100">
              <el-input v-model="assetsName" style="width: 333px"></el-input>
            </el-form-item>
            <el-form-item label="资产类别:" label-width="75" size="mini">
              <el-input
                placeholder
                suffix-icon="el-icon-search"
                readonly
                v-model="assetsType"
                @focus="selectAssetsType"
                style="width: 333px"
              ></el-input>
              <AssetsTypeSelect v-if="openAssetsType"></AssetsTypeSelect>
            </el-form-item>
            <div>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="是否清理:" label-width="100" size="mini">
                    <el-select v-model="IsDel" placeholder style="width: 100px">
                      <el-option label="是" value="Y"></el-option>
                      <el-option label="否" value="N"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item class="longStyle" label="录入前已生成凭证:" label-width="100" size="mini">
                    <el-select v-model="producePrrof" placeholder style="width: 100px">
                      <el-option label="是" value="Y"></el-option>
                      <el-option label="否" value="N"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-form-item label="已转总账:" label-width="100" size="mini">
              <el-select v-model="turnZz" placeholder style="width: 100px">
                <el-option label="是" value="Y"></el-option>
                <el-option label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
            <div style="text-align: right;margin-top: 12px">
              <el-button size="small" type="primary" @click="confirm">确定</el-button>
              <el-button size="small" type="primary" @click="clearCondition">清除</el-button>
              <el-button size="small" type="primary" @click="clearPose" plain>取消</el-button>
            </div>
          </el-main>
        </el-container>
      </Header>
    </el-container>
    <el-container>
      <el-main style="overflow-y: hidden">
        <el-table
          id="table_list"
          :data="tableList"
          :header-cell-style="headerCellStyle"
          ref="tableCorpRef"
          stripe
          :height="height"
          highlight-current-row
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          @row-click="handleCurrentChange"
          @selection-change="handleCheckChang"
          style="width: 100%;overflow-y: hidden"
        >
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <el-table-column label="卡片编号" width="90" align="center">
            <template slot-scope="scope"><el-link style="color: rgb(64, 158, 255);">{{scope.row.ascode}}</el-link></template>
          </el-table-column>
          <el-table-column prop="dperiod" label="入账日期" width="100" align="center"></el-table-column>
          <el-table-column prop="zcbm" label="资产编码" width="90" align="center"></el-table-column>
          <el-table-column prop="asname" label="资产名称" :show-overflow-tooltip="true" min-width="100" align="center"></el-table-column>
          <el-table-column prop="assetcate" label="资产类别" :show-overflow-tooltip="true" max-width="100" align="center"></el-table-column>
          <el-table-column prop="" label="折旧方式" max-width="100" align="center">
            <template slot-scope="scope">
              {{scope.row.zjtype === '0' ? '平均年限法' : scope.row.zjtype === '1' ? '工作量法' : scope.row.zjtype === '2' ? ':双倍余额递减法' : '年数总和法'}}
            </template>
          </el-table-column>
          <el-table-column label="预计使用年限" min-width="110" align="center">
            <template slot-scope="scope">{{scope.row.ulimit !== undefined ? (parseInt(scope.row.ulimit) / 12) : ''}}</template>
          </el-table-column>
          <el-table-column label="月折旧额" max-width="100" align="right">
            <template slot-scope="scope">{{scope.row.nmzj !== undefined ? parseInt(scope.row.nmzj).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="单位折旧" max-width="100" align="right">
            <template slot-scope="scope">{{scope.row.dwzj !== undefined ? parseInt(scope.row.dwzj).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="原值" max-width="100" align="right">
            <template slot-scope="scope">{{scope.row.atmny !== undefined ? parseInt(scope.row.atmny).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="总累计折旧" width="100" align="right">
            <template slot-scope="scope">{{scope.row.depation !== undefined ? parseInt(scope.row.depation).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="残值率" max-width="100" align="right">
            <template slot-scope="scope">{{scope.row.sratio !== undefined ? parseInt(scope.row.sratio).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="资产净值" max-width="100" align="right">
            <template slot-scope="scope">{{scope.row.asvalue !== undefined ? parseInt(scope.row.asvalue).toFixed(2) : '0.00'}}</template>
          </el-table-column>
          <el-table-column label="凭证号" max-width="100" align="center">
            <template slot-scope="scope"><el-link style="color: rgb(64, 158, 255);">{{scope.row.pzh}}</el-link></template>
          </el-table-column>
        </el-table>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="page" :limit.sync="rows"
                      @pagination="pageData"></Pagination>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      id="addDialog"
      title="新增"
      :visible.sync="dialogAssetsCard"
      width="1120px"
      :close-on-click-modal="false"
      :modal="false"
      @close="closeDialog('form')">
      <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent label-width="160px" :inline="true">
        <div class="titleBoxInfo">
          <span class="fontStyle">资产信息</span>
        </div>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-form-item size="mini" label="卡片编号" class="row-child">
              <el-input v-model="form.ascode" style="width: 182px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="资产编号" class="row-child">
              <el-input v-model="form.zcbm" style="width: 182px;"></el-input>
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
                @focus="selectAssetsTypes"
                style="width: 182px"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="资产属性" class="row-child">
              <el-input v-model="form.assetproperty" style="width: 182px;" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="入账日期" class="row-child" required>
              <el-date-picker type="date" v-model="form.dperiod" value-format="yyyy-MM-dd" style="width: 182px"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-form-item size="mini" label="原值" prop="atmny" class="row-child">
              <el-input v-model="form.atmny" style="width: 182px;" oninput="value=value.replace(/[^0-9.]/g,'');" @change="valueChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="进项税额" v-if="isYbr" class="row-child">
              <el-input v-model="form.jxsf" style="width: 182px;" oninput="value=value.replace(/[^0-9.]/g,'');" @change="valueChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="合计" v-if="isYbr" class="row-child">
              <el-input v-model="form.sumres" style="width: 182px;" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around" style="margin-bottom: 5px;">
          <el-col :span="24">
            <el-form-item size="mini" label="备注">
              <el-input
                v-model="form.memo"
                type="textarea"
                resize="none"
                :rows="3"
                style="width: 400%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="titleBoxInfo">
          <span class="fontStyle">折旧信息</span>
        </div>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-form-item class="row-child">
              <el-form-item size="mini" label="折旧方式" class="row-child">
                <el-select v-model="form.zjtype" @change="selectChange" style="width: 182px">
                  <el-option label="平均年限法" value="0"></el-option>
                  <el-option label="工作量法" value="1"></el-option>
                  <el-option label="双倍余额递减法" value="2"></el-option>
                  <el-option label="年数总和法" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="isavg" size="mini" label="预计使用年限" prop="ulimit" class="row-child">
              <el-input v-model="form.ulimit" @change="zjeValueChange" oninput="value=value.replace(/[^0-9.]/g,'');" style="width: 182px"></el-input> 月
            </el-form-item>
            <el-form-item v-else size="mini" label="总工作量" prop="zgzl" class="row-child">
              <el-input v-model="form.zgzl" oninput="value=value.replace(/[^0-9.]/g,'');" style="width: 182px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="isHide" class="row-child">
              <el-form-item v-if="isavg" size="mini" label="月折旧额" class="row-child">
                <el-input v-model="form.nmzj" style="width: 182px;" readonly></el-input>
              </el-form-item>
              <el-form-item v-else size="mini" label="工作量单位" prop="gzldw" class="row-child">
                <el-input v-model="form.gzldw" style="width: 182px;"></el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-form-item size="mini" label="残值率" class="row-child">
              <el-input v-model="form.sratio" style="width: 182px;" @change="czlChange" oninput="value=value.replace(/[^0-9.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="预计残值" class="row-child">
              <el-input v-model="form.ygcz" style="width: 182px;" @change="zjeValueChange" oninput="value=value.replace(/[^0-9.]/g,'');"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" label="资产净值" class="row-child">
              <el-input v-model="form.asvalue" style="width: 182px;" @change="zjeValueChange" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="8">
            <el-form-item v-if="isavg" size="mini" label="总累计折旧" class="row-child">
              <el-input v-model="form.depation" style="width: 182px;" readonly></el-input>
            </el-form-item>
            <el-form-item v-else size="mini" label="单位折旧" class="row-child">
              <el-input v-model="form.dwzj" style="width: 182px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              size="mini"
              v-if="isavg"
              label-width="160px"
              label="录入当期一次提足折旧"
              class="row-child">
              <el-select v-model="form.onetimezj" style="width: 182px">
                <el-option label="是" value="Y"></el-option>
                <el-option label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-else size="mini" label="累计工作量" class="row-child">
              <el-input v-model="form.ljgzl" style="width: 182px;" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="!isavg" size="mini" label="总累计折旧" class="row-child">
              <el-input v-model="form.depation" style="width: 182px;" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg">
          <el-col :span="8">
            <el-form-item
              size="mini"
              label-width="160px"
              label="录入前已生成凭证"
            >
              <el-select v-model="form.periodbegin" style="width: 182px">
                <el-option label="是" value="Y"></el-option>
                <el-option label="否" value="N"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" v-if="form.periodbegin === 'Y'" label="录入前已提期间(月)" class="row-child">
              <el-input v-model="form.initciation" style="width: 182px;" @change="zjeValueChange"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="mini" v-if="form.periodbegin === 'Y'" label="录入前已提折旧" class="row-child">
              <el-input v-model="form.inittion" style="width: 182px;" @change="valueChange"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="titleBoxInfo">
          <span class="fontStyle">科目信息</span>
        </div>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="12">
            <el-form-item size="mini" label="固定(无形)资产科目" prop="zckm" class="row-child">
              <el-select
                v-model="form.zckm"
                @change="getSubjectZckm"
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
            <el-form-item size="mini" label="结算科目" prop="jskm" class="row-child">
              <el-select
                v-model="form.jskm"
                @change="getSubjectJskm"
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
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="12">
            <el-form-item size="mini" label="折旧(摊销)科目" prop="jtzjkm" class="row-child">
              <el-select
                v-model="form.jtzjkm"
                @change="getSubjectJtzjkm"
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
            <el-form-item size="mini" label="折旧(摊销)费用科目" prop="zjfykm" class="row-child">
              <el-select
                v-model="form.zjfykm"
                @change="getSubjectZjfykm"
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
        </el-row>
      </el-form>

      <div slot="footer" class="dialog__footer">
        <el-button type="primary" @click="saveForm">保 存</el-button>
        <el-button @click="closeDialog('form')">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="adjust"
      title="使用年限调整"
      :visible.sync="dialogDateAdjust"
      width="20%"
      :close-on-click-modal="false"
      :modal="false"
      @close="closeDateTidy">
      <el-form @submit.native.prevent :inline="true">
        <el-row>
          <el-form-item size="mini" label="原预计使用年限:" label-width="150">
            {{yjUserDate}} 月
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="月折旧:" label-width="80">
            {{yzj}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="已使用年限:" label-width="110">
            {{yUserDate}} 月
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="调整使用年限为:" label-width="140">
            <el-input v-model="adjustMonth" value="number" style="width: 120px"></el-input> 月
            <el-button size="mini" type="primary" @click="count">计算</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="月折旧:" label-width="80">
            {{newYzj}}
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button type="primary" @click="queryTidy">确 定</el-button>
      </div>
    </el-dialog>
    <AssetsTypeSelect v-if="openAssetsTypes"></AssetsTypeSelect>
    <subjectInfo v-if="openSubjectInfo"></subjectInfo>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import Header from '../components/Header'
import subjectInfo from '../components/subjectInfo'
import AssetsTypeSelect from '../components/AssetsTypeSelect'
import { getMonthBegin, getMonthEnd } from '@/utils'
export default {
  name: 'zckp',
  components: {
    Header,
    subjectInfo,
    AssetsTypeSelect,
    Pagination
  },
  data () {
    return {
      tableList: [],
      height: 0,
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      date: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      assetsType: '',
      openAssetsType: false,
      openAssetsTypes: false,
      openSubjectInfo: false,
      dialogDateAdjust: false,
      loading: false,
      yjUserDate: '',
      yzj: '',
      newYzj: '',
      yUserDate: '',
      adjustMonth: '',
      assetsId: '', // 资产类别id
      cardCode: '',
      assetsName: '',
      producePrrof: '',
      IsDel: '',
      turnZz: '',
      isShowCompany: false,
      dialogAssetsCard: false,
      subjectInfo: '',
      subjectoptions: [],
      gdzckm_id: '',
      jskm: '',
      jskm_id: '',
      zjkm: '',
      zjkm_id: '',
      zjfykm: '',
      zjfykm_id: '',
      currentRow: '',
      selectRow: '',
      tableSelection: '',
      ids: '', // 资产id
      zjid: '', // 主键id
      isavg: true,
      isHide: true,
      isYbr: true,
      isEnter: false,
      subjectRef: this.$store.getters.subSubjectRef,
      form: {
        adate: this.formatDate(new Date()),
        amny: null,
        ascode: null,
        asname: null,
        assetcate: null,
        assetcate_id: null,
        assetproperty: null,
        asvalue: null,
        atmny: null,
        clear: null,
        coid: null,
        ddate: null,
        depdate: null,
        dperiod: null,
        fpid: null,
        fpmxid: null,
        groupid: null,
        zgzl: null,
        gzldw: null,
        depation: null,
        dwzj: null,
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
        jxsf: null,
        memo: null,
        nmzj: null,
        onetimezj: 'Y',
        ljgzl: null,
        page: 1,
        rows: 500,
        togl: null,
        parent_id: null,
        periodbegin: 'N',
        initciation: '',
        inittion: '',
        primaryKey: null,
        qcvalue: null,
        sourtype: null,
        sratio: null,
        status: null,
        sumres: null,
        ts: null,
        ulimit: null,
        updatets: null,
        uperiod: null,
        usedperiod: null,
        voucherno: null,
        ygcz: null,
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
        zjtype: '0'
      },
      rules: {
        asname: [{required: true, message: '资产名称为必输项', trigger: 'blur'}],
        assetcate: [{required: true, message: '资产类别为必输项', trigger: 'change'}],
        atmny: [{required: true, message: '原值为必输项', trigger: 'change'}],
        ulimit: [{required: true, message: '预计使用年限为必输项', trigger: 'change'}],
        zckm: [{required: true, message: '固定(无形)资产科目为必输项', trigger: 'change'}],
        jskm: [{required: true, message: '结算科目为必输项', trigger: 'change'}],
        jtzjkm: [{required: true, message: '折旧(摊销)科目为必输项', trigger: 'change'}],
        zjfykm: [{required: true, message: '折旧(摊销)费用科目为必输项', trigger: 'change'}],
        zgzl: [{required: true, message: '总工作量为必输项', trigger: 'change'}],
        gzldw: [{required: true, message: '工作量单位为必输项', trigger: 'change'}]
      },
      total: 0,
      page: 1,
      rows: 50
    }
  },
  methods: {
    selectChange: function (val) {
      if (val === '1') {
        this.isavg = false
      } else {
        this.isavg = true
      }
      if (val === '3') {
        this.isHide = false
      } else {
        this.isHide = true
      }
    },
    czlChange: function (val) {
      this.form.sratio = val !== '' ? Number(val) >= 1 ? 0.99 : parseFloat(val).toFixed(2) : '0.00'
      this.form.ygcz = (parseFloat(this.form.sratio) * (this.form.atmny === null || this.form.atmny === '' ? 0 : parseFloat(this.form.atmny))).toFixed(2)
    },
    pageData: function (param) {
      this.page = param.page
      this.rows = param.rows
      this.loadtableList()
    },
    valueChange: function () {
      let lrqytzj = 0
      this.form.atmny = this.form.atmny !== null && this.form.atmny !== '' ? parseInt(this.form.atmny).toFixed(2) : '0.00'
      this.form.jxsf = this.form.jxsf !== null && this.form.jxsf !== '' ? parseInt(this.form.jxsf).toFixed(2) : '0.00'
      this.form.sumres = (parseInt(this.form.atmny) + parseInt(this.form.jxsf)).toFixed(2)
      this.form.ygcz = (parseFloat(this.form.atmny) * (this.form.sratio !== null && this.form.sratio !== '' ? parseFloat(this.form.sratio) : 0)).toFixed(2)
      if (this.periodbegin === 'Y') {
        lrqytzj = this.form.inittion !== null && this.form.inittion !== '' ? parseFloat(this.form.inittion) : 0
      }
      this.form.asvalue = this.form.atmny - lrqytzj
    },
    zjeValueChange: function () {
      const yjcz = this.form.ygcz !== null && this.form.ygcz !== '' ? parseFloat(this.form.ygcz) : 0
      const zcjz = this.form.asvalue !== null && this.form.asvalue !== '' ? parseFloat(this.form.asvalue) : 0
      const usetime = this.form.ulimit !== null && this.form.ulimit !== '' ? parseFloat(this.form.ulimit) : 0
      let ytDate = 0
      if (this.periodbegin === 'Y') {
        ytDate = this.form.initciation !== null && this.form.initciation !== '' ? parseFloat(this.form.initciation) : 0
      }
      this.form.nmzj = ((zcjz - yjcz) / (usetime - ytDate)).toFixed(2)
    },
    refreshTable: function () {
      this.confirm()
    },
    confirm: function () { // 确认查询
      this.getDateToReturn()
      this.loadtableList(1)
    },
    clearCondition: function () { // 查询清理
      this.cardCode = ''
      this.assetsName = ''
      this.assetsType = ''
      this.IsDel = ''
      this.producePrrof = ''
      this.turnZz = ''
      this.getDateToReturn()
    },
    clearPose: function () { // 查询取消
      this.getDateToReturn()
    },
    selectAssetsType: function () {
      this.openAssetsType = true
      this.$bus.$off('assetsType')
      this.$bus.$on('assetsType', (assetsType) => {
        this.assetsType = assetsType.text
      })
    },
    selectAssetsTypes: function () {
      this.openAssetsTypes = true
    },
    setSub: function () {
      this.$api.assetsCard.queryFromZclb({zclbid: this.form.assetcate_id}).then(result => {
        if (result.success) {
          this.form.zckm = result.data[0].zzkmmc
          this.form.zckm_id = result.data[0].zzkmid
          this.form.jskm = result.data[0].jskmmc
          this.form.jskm_id = result.data[0].jskmid
          if (result.data.length > 1) {
            this.form.jtzjkm = result.data[1].zzkmmc
            this.form.jtzjkm_id = result.data[1].zzkmid
            this.form.zjfykm = result.data[1].zjfykmmc
            this.form.zjfykm_id = result.data[1].zjfykmid
          }
        }
      })
    },
    getSubjectZckm: function (val) {
      this.form.zckm_id = val
    },
    getSubjectJskm: function (val) {
      this.form.jskm_id = val
    },
    getSubjectJtzjkm: function (val) {
      this.form.jtzjkm_id = val
    },
    getSubjectZjfykm: function (val) {
      this.form.zjfykm_id = val
    },
    getSubjectRow: function () {
      this.$bus.$off('selectSubject')
      this.$bus.$on('selectSubject', (row) => {
        this.selectRow = row
      })
    },
    addCardInfo: function () {
      this.dialogAssetsCard = true
      this.$api.assetsCard.add().then(result => {
        if (result.success) {
          this.form.ascode = result.rows
        }
      })
      this.isYbr = this.$store.getters.getLoginCorp.chname === '一般纳税人'
      // 当前月最后一天时间
      const year = this.$store.getters.getLoginDate.substring(0, 4)
      const month = this.$store.getters.getLoginDate.substring(5, 7)
      let timeDate = new Date((new Date(year, month, 1)).getTime() - 1000 * 60 * 60 * 24).getDate()
      this.form.dperiod = year + '-' + month + '-' + timeDate
    },
    handleCommand: function (command) {
      if (command === 'copy') {
        this.editTableRow()
      }
    },
    editTableRow: function () { // 修改
      this.IsSelectCurrentRow()
      if (this.currentRow !== '') {
        this.dialogAssetsCard = true
        this.form = this.currentRow
        this.form.zjtype = this.currentRow.zjtype.toString()
        this.selectChange(this.currentRow.zjtype.toString())
      }
    },
    trunZz: function (isMerge) { // 转总账
      this.IsSelectCurrentRow()
      this.ids = ''
      if (this.tableSelection !== '') {
        this.tableSelection.forEach(row => {
          this.ids += row.id_assetcard + ','
        })

        let param = {
          assetids: this.ids !== '' ? this.ids.toString().substring(0, this.ids.length - 1) : '',
          merge: isMerge
        }
        this.$api.assetsCard.trunLedger(param).then(result => {
          this.successMsg(result)
        })
      }
    },
    tidyCard: function () { // 卡片整理
      this.$confirm('全部卡片编码会重新排序，确认继续?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.assetsCard.cardTidy().then(result => {
          this.successMsg(result)
        })
      })
    },
    deleteTableRows: function () { // 删除
      this.IsSelectCurrentRow()
      this.message = '删除'
      if (this.tableSelection !== '') {
        this.$api.assetsCard.deleteDataRow({list: JSON.stringify(this.tableSelection)}).then(result => {
          this.successMsg(result)
          if (result.success) {
            this.loadtableList()
          }
        })
      }
    },
    detail: function () { // 折旧明细
      this.IsSelectCurrentRow()
    },
    dateAdjust: function () { // 年限调整
      this.IsSelectCurrentRow()
      if (this.currentRow !== '') {
        this.dialogDateAdjust = true
        this.yjUserDate = this.currentRow.ulimit
        this.yzj = this.currentRow.nmzj
        this.yUserDate = this.currentRow.useDperiod
      }
    },
    asseClear: function () { // 资产清理
      this.IsSelectCurrentRow()
      if (this.tableSelection !== '') {
        this.$api.assetsCard.asstesClear({list: JSON.stringify(this.tableSelection)}).then(result => {
          this.successMsg(result)
        })
      }
    },
    saveForm: function () { // 新增保存
      let param = {
        zcbm: this.form.ascode,
        asname: this.form.asname,
        id_assetcard: this.form.assetcate_id,
        atmny: this.form.atmny
      }
      this.$api.assetsCard.checkBefSave(param).then(result => {
        if (result.success) {
          this.querySave()
        }
      })
    },
    querySave: function () { // 确认新增保存
      this.$api.assetsCard.saveDataRow(this.form).then(result => {
        this.successMsg(result)
        if (result.success) {
          this.dialogAssetsCard = false
          this.loadtableList()
        }
      })
    },
    closeDialog: function (formName) { // 新增关闭
      this.$refs[formName].resetFields()
      this.dialogAssetsCard = false
    },
    closeDateTidy: function () { // 关闭年限调整
      this.dialogDateAdjust = false
      this.newYzj = ''
      this.adjustMonth = ''
    },
    count: function () { // 年限调整计算
      this.newYzj = (parseFloat(this.currentRow.asvalue) / parseFloat(this.adjustMonth.toString())).toFixed(2)
    },
    queryTidy: function () { // 年限调整确定
      if (this.adjustMonth.toString() === '' || this.adjustMonth.toString() === '0') {
        this.$message({
          showClose: true,
          message: '调整年限不能小于等于0！',
          type: 'warning'
        })
        return
      }
      let param = {
        id: this.currentRow.id_assetcard,
        assetcode: this.currentRow.ascode,
        newlimit: parseInt(this.adjustMonth.toString())
      }
      this.message = '调整'
      this.$api.assetsCard.adjusts(param).then(result => {
        this.successMsg(result)
      })
      this.dialogDateAdjust = false
    },
    loadtableList: function (val) { // 加载查询
      let param = {
        begindate: this.date[0],
        enddate: this.date[1],
        pk_assetcategory: this.assetsType.toString(),
        ascode: this.cardCode.toString(),
        asname: this.assetsName.toString(),
        isqc: this.producePrrof.toString() !== '' ? this.producePrrof.toString() : null,
        istogl: this.turnZz.toString(),
        isclear: this.IsDel.toString(),
        page: this.page,
        rows: this.rows
      }
      this.loading = true
      this.$api.assetsCard.queryData(param).then(result => {
        this.loading = false
        if (result.success) {
          this.tableList = result.rows
          this.total = result.total
        }
        if (val === 1) {
          this.successMsg(result)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    IsSelectCurrentRow: function () {
      if (this.currentRow === '' && this.tableSelection === '') {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return
      }
      return ''
    },
    handleCurrentChange: function (row) {
      this.currentRow = row
      this.$refs.tableCorpRef.toggleRowSelection(row)
    },
    handleCheckChang: function (selection) {
      this.tableSelection = selection
    },
    getAssetType: function (code) {
      if (code === '01') {
        return '固定资产'
      } else if (code === '02') {
        return '无形资产'
      } else {
        return '待摊费用'
      }
    },
    getDateToReturn: function () {
      let retParam = {
        times: this.date[0] + '~' + this.date[1],
        visiblePopover: false
      }
      this.$bus.$emit('date', retParam)
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
          type: 'error'
        })
      }
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    formatDate: function (date) {
      date.setTime(date.getTime())
      return date.getFullYear() + '-' + this.checkTime(date.getMonth() + 1) + '-' + this.checkTime(date.getDate())
    }
  },
  created () {
    this.height = window.innerHeight - 205
    this.$bus.$off('openAssetsType')
    this.$bus.$on('openAssetsType', (openAssetsType) => {
      this.openAssetsType = openAssetsType
      this.openAssetsTypes = openAssetsType
    })
  },
  mounted () {
    this.getDateToReturn()
    this.loadtableList()
    this.$bus.$off('assetsType')
    this.$bus.$on('assetsType', (assetsType) => {
      this.form.assetproperty = this.getAssetType(assetsType.code.substring(0, 2))
      this.form.ulimit = assetsType.ulimit
      // this.form.zcbm = assetsType.code
      this.form.assetcate = assetsType.text
      this.form.assetcate_id = assetsType.id
      this.form.sratio = assetsType.czl !== undefined ? assetsType.czl : '0.00'
      this.form.ygcz = assetsType.ygcz !== undefined ? assetsType.ygcz : '0.00'
      this.setSub()
    })
  }
}
</script>

<style scoped>
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
</style>
