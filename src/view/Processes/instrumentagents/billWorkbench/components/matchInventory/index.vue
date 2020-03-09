<template>
  <div class="match-inventory">
    <div v-if="companyType == 1">
      <el-table
        ref="multipleTable1"
        v-loading="loading"
        element-loading-background="rgba(255, 255, 255, 1)"
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="tableData1"
        border
        stripe
        :height="tableHeight"

        :header-row-style="{fontSize: '15px', color: '#3d3d3d', fontWeight: '600'}"
        :row-style="{fontSize: '13px', color: '#3d3d3d'}"
        tooltip-effect="dark"
        size="mini"
        @selection-change="selectionChange"
        style="width: 100%; margin-top: 20px">
        <el-table-column
          type="selection"
          align="center"
          width="55">
        </el-table-column>
        <el-table-column
          type=index
          label="序号"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          width="100"
          prop="spmc"
          label="发票号码"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.chid ? 'red' : ''">{{scope.row.fphm}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          prop="spmc"
          label="货物或劳务名称"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.chid ? 'red' : ''">{{scope.row.spmc}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          prop="ggxh"
          label="规格型号"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.chid ? 'red' : ''">{{scope.row.ggxh}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          prop="unit"
          label="计量单位"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.chid ? 'red' : ''">{{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="135"
          prop="saleNumber"
          label="本期销售数量"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.chid ? 'red' : ''">{{getThousands(scope.row.saleNumber, 0)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="135"
          prop="salePrice"
          label="本期销售单价"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.chid ? 'red' : ''">{{getThousands(scope.row.salePrice, 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="chid"
          label="科目名称"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData1[scope.$index].clickTableRow">
              <el-col :span='24'>
                <el-select :disabled="!!scope.row.chid" @clear="clearSelect(tableData1[scope.$index])"
                           @change="(ev) => {tableData1[scope.$index].subjname = SpecialKM.filter((KMItem) => {return KMItem.kmid == ev})[0].kmmc}"
                           size="mini" v-model="tableData1[scope.$index].pk_subj" >
                  <el-option v-for="item in SpecialKM" :key="item.kmid" :label="item.kmmc" :value="item.kmid">{{item.kmmc}}</el-option>
                </el-select>
              </el-col>
            </el-row>
            <span :class="!scope.row.chid ? 'red' : ''" v-if="!tableData1[scope.$index].clickTableRow">{{tableData1[scope.$index].subjname}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="chid"
          label="存货名称"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData1[scope.$index].clickTableRow">
              <el-col :span='24'>
                <el-select class="hidden-suffix" filterable @clear="clearSelect(tableData1[scope.$index])"
                           @change="selectChange(tableData1[scope.$index].chid, tableData1[scope.$index])"
                           size="mini" v-model="tableData1[scope.$index].chid" >
                  <el-option v-for="item in optionList" :key="item.id" :label="item.fullName" :value="item.id"></el-option>
                </el-select>
                <i class="el-icon-search"
                   @click="dialogShow = true"
                   style="position: absolute;
                          right: 0px;
                          top: 0px;
                          width: 28px;
                          height: 28px;
                          cursor: pointer;
                          line-height: 28px;"></i>
              </el-col>
            </el-row>
            <span :class="!scope.row.chid ? 'red' : ''" v-if="!tableData1[scope.$index].clickTableRow">{{tableData1[scope.$index].name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="200"
          prop="calcmode"
          label="计算模式"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData1[scope.$index].clickTableRow">
              <el-select size="mini" v-model="tableData1[scope.$index].calcmode" placeholder="请选择">
                <el-option
                  v-for="item in options22"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-row>
            <span :class="!scope.row.chid ? 'red' : ''" v-if="!tableData1[scope.$index].clickTableRow">{{tableData1[scope.$index].calcmode == '0' ? '别名单位*换算关系=原单位': '别名单位/换算关系=原单位'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="155"
          prop="hsl"
          label="换算关系"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData1[scope.$index].clickTableRow">
              <el-input size="mini" @change="hslChange(tableData1, scope.$index)" v-model="tableData1[scope.$index].hsl" placeholder="请输入内容"></el-input>
            </el-row>
            <span :class="!scope.row.chid ? 'red' : ''" v-if="!tableData1[scope.$index].clickTableRow">{{Number(tableData1[scope.$index].hsl || 0).toFixed(8)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;">

        <el-button @click="sendStatus">取消</el-button>
        <el-button type="primary" @click="matchinventory1">确定</el-button>
      </div>
    </div>
    <div v-if="companyType == 3 || companyType == 2">
      <el-row style="text-align:left;" v-if="companyType !== 1">
        <el-switch
          v-model="switchValue"
          @change="switchChange">
        </el-switch>
        <label style="display:inline-block;vertical-align:middle;font-size: 14px; font-weight: 600">显示已匹配存货</label>
      </el-row>
      <el-table
        v-loading="loading"
        element-loading-background="rgba(255, 255, 255, 1)"
        ref="multipleTable2"
        :data="tableData2"
        border
        stripe
        :height="tableHeight"
        tooltip-effect="dark"
        @row-click="switchTableRow"
        @selection-change="changeFun"
        :row-class-name="tableRowClassName"
        :header-row-style="{fontSize: '15px', color: '#3d3d3d', fontWeight: '600'}"
        :row-style="{fontSize: '13px', color: '#3d3d3d'}"
        size="mini"
        style="width: 100%; margin-top: 20px">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          type=index
          label="序号"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="fphm"
          label="发票号码"
          width="105"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.pk_inventory ? 'red' : ''">{{scope.row.fphm}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="135"
          prop="aliasname"
          label="货物或劳务名称"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.pk_inventory ? 'red' : ''">{{scope.row.aliasname}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="spec"
          width="105"
          label="规格型号"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.pk_inventory ? 'red' : ''">{{scope.row.spec}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="85"
          prop="unit"
          label="计量单位"
          align="center">
          <template slot-scope="scope">
            <span :class="!scope.row.pk_inventory ? 'red' : ''">{{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="135"
          prop="saleNumber"
          label="本期销售数量"
          align="center"
          >
          <template slot-scope="scope">
            <span :class="!scope.row.pk_inventory ? 'red' : ''">{{getThousands(scope.row.saleNumber, 0)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="135"
          prop="salePrice"
          label="本期销售单价"
          align="center"
          >
          <template slot-scope="scope">
            <span :class="!scope.row.pk_inventory ? 'red' : ''">{{getThousands(scope.row.salePrice, 1)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="存货名称"
          prop="name"
          width="200"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData2[scope.$index].clickTableRow">
              <el-col :span='24'>
                <el-select class="hidden-suffix" style="width: 100%" @change="selectChange1" size="mini" v-model="tableData2[scope.$index].pk_inventory" >
                  <el-option v-for="item in optionList" :key="item.id" :label="item.fullName" :value="item.id"></el-option>
                </el-select>
                <i class="el-icon-search"
                   @click="dialogShow = true"
                   style="position: absolute;
                          right: 0px;
                          top: 0px;
                          width: 28px;
                          height: 28px;
                          cursor: pointer;
                          line-height: 28px;"></i>
              </el-col>
            </el-row>
            <span :class="!scope.row.pk_inventory ? 'red' : ''" v-if="!tableData2[scope.$index].clickTableRow">{{tableData2[scope.$index].name}}</span>
          </template>
        </el-table-column>
        <el-table-column

          width="155"
          prop="hsl"
          label="换算关系"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData2[scope.$index].clickTableRow">
              <el-input size="mini" v-model="tableData2[scope.$index].hsl" @change="hslChange(tableData2, scope.$index)" placeholder="请输入内容"></el-input>
            </el-row>
            <span :class="!scope.row.pk_inventory ? 'red' : ''" v-if="!tableData2[scope.$index].clickTableRow">{{Number(tableData2[scope.$index].hsl || 0).toFixed(8)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="200"
          prop="calcmode"
          label="计算模式"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData2[scope.$index].clickTableRow">
              <el-select size="mini" v-model="tableData2[scope.$index].calcmode" placeholder="请选择">
                <el-option
                  v-for="item in options22"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-row>
            <span :class="!scope.row.pk_inventory ? 'red' : ''" v-if="!tableData2[scope.$index].clickTableRow">{{tableData2[scope.$index].calcmode == '0' ? '别名单位*换算关系=原单位': '别名单位/换算关系=原单位'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="155"
          v-if="companyType == 3"
          prop="kmmc_invcl"
          label="类别（科目）"
          align="center">
          <template slot-scope="scope">
            <el-row v-if="tableData2[scope.$index].clickTableRow">
              <el-select :disabled="!!tableData2[scope.$index].name" size="mini" @change="selectChange2" v-model="tableData2[scope.$index].kmclassify" placeholder="请选择">
                <el-option
                  v-for="item in batchCategorylist"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-row>
            <span :class="!scope.row.pk_inventory ? 'red' : ''" v-if="!tableData2[scope.$index].clickTableRow">{{tableData2[scope.$index].kmmc_invcl}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          width="155"
          v-if="companyType == 3"
          prop="kmmc_sale"
          label="销售（科目）"
          align="center"
          >
          <template slot-scope="scope">
            <el-row v-if="tableData2[scope.$index].clickTableRow">
              <el-select :disabled="!!tableData2[scope.$index].name" size="mini" @change="selectChange3" v-model="tableData2[scope.$index].chukukmid" placeholder="请选择">
                <el-option
                  v-for="item in batchSaleslist"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-row>
            <span :class="!scope.row.pk_inventory ? 'red' : ''" v-if="!tableData2[scope.$index].clickTableRow">{{tableData2[scope.$index].kmmc_sale}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:right;margin-top:10px;">

        <el-button style="background: #339ed7" type="primary" @click="sendStatus">取消</el-button>
        <el-button style="background: #339ed7" type="primary" @click="batch">批处理</el-button>
        <el-button style="background: #339ed7" type="primary" @click="matching">匹配</el-button>

      </div>
    </div>
    <el-dialog top="0" v-dialogDrag @close="closeInventory" :close-on-click-modal="false" title="存货档案" :visible.sync="dialogShow" width="800px" height="400px" :modal="false">
      <el-row style="margin-top: -20px; margin-bottom: -10px">
        <el-col :span="12" >
          <!--按存货编码、存货名称、规格或型号查询-->
          <el-input @keyup.enter.native="filterData" v-model="filterInput" style="width: 100%" :placeholder=" $parent.$parent.companyType === 1 ? '按存货编码、存货名称、规格或型号查询' : '支持编码,名称，规格型号'">
            <el-button slot="append" icon="el-icon-search"  @click="filterData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6" >
          <!--<el-button @click="filterData">筛选</el-button>-->
        </el-col>
      </el-row>
      <el-table
        v-if="$parent.$parent.companyType === 1"
        ref="multipleTable3"
        highlight-current-row
        @current-change="handleCurrentChange2"
        :data="dialogData"
        border
        stripe
        height="300"
        tooltip-effect="dark"

        :header-row-style="{fontSize: '15px', color: '#3d3d3d', fontWeight: '600'}"
        :row-style="{fontSize: '13px', color: '#3d3d3d'}"
        size="mini"
        @row-dblclick="getInventoryid"
        style="width: 100%; margin-top: 20px">
        <el-table-column
          type=index
          label="序号"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          width="135"
          prop="kmmc"
          label="科目名称"
          align="center">

        </el-table-column>
        <el-table-column
          width="105"
          prop="spbm"
          label="存货编码"
          align="center">
        </el-table-column>
        <el-table-column
          width="135"
          prop="spmc"
          label="存货名称"
          align="center">
        </el-table-column>
        <el-table-column
          width="105"
          prop="splxmc"
          label="存货分类"
          align="center">
        </el-table-column>
        <el-table-column
          width="105"
          prop="gg"
          label="规格"
          align="center">
        </el-table-column>
        <el-table-column
          width="105"
          prop="xh"
          label="型号"
          align="center">
        </el-table-column>
        <el-table-column
          width="105"
          prop="jldw"
          label="计量单位"
          align="center">
        </el-table-column>
        <el-table-column
          width="105"
          prop="njznum"
          label="结存数量"
          align="right">
          <template slot-scope="scope">
            <span>{{ getThousandsal(scope.row.njznum || '',0) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="105"
          label="结算单价"
          prop="jsprice"
          align="right">
          <template slot-scope="scope">
            <span>{{ getThousandsal(scope.row.jsprice,1)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="105"
          prop="jc"
          label="简称"
          align="center">
        </el-table-column>
      </el-table>
      <el-table
        v-if="$parent.$parent.companyType !== 1"
        ref="multipleTable3"
        highlight-current-row
        @current-change="handleCurrentChange2"
        :data="dialogData"
        border
        stripe
        height="300"
        tooltip-effect="dark"
        :header-row-style="{fontSize: '15px', color: '#3d3d3d', fontWeight: '600'}"
        :row-style="{fontSize: '13px', color: '#3d3d3d'}"
        size="mini"
        @row-dblclick="getInventoryid"
        style="width: 100%; margin-top: 20px">
        <el-table-column
          v-if="$parent.$parent.companyType !== 2"
          width="165"
          prop="kmclassifyname"
          label="类别（科目）"
          align="center">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="kmbm"-->
          <!--label="科目编码"-->
          <!--align="center">-->
        <!--</el-table-column>-->
        <el-table-column
          width="105"
          prop="code"
          label="存货编码"
          align="center">
        </el-table-column>
        <el-table-column
          width="185"
          prop="name"
          label="存货名称"
          align="center">
        </el-table-column>
        <el-table-column
          width="185"
          prop="spec"
          label="规格型号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="unit"
          width="125"
          label="计量单位"
          align="center">
           <template slot-scope="scope">
            <span> {{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="135"
          prop="njznum"
          label="结存数量"
          align="center">
          <template slot-scope="scope">
            <span style="display: block; width: 100%; text-align: right"> {{getThousandsal(scope.row.njznum,0)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="105"
          prop="jsjg"
          label="结算单价"
          align="right">
          <template slot-scope="scope">
            <span>{{getThousandsal(scope.row.jsprice,1)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary" @click="getInventoryid(currentChangerow2)">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批处理" :visible.sync="batchShow" width="600px" height="300px" vop="5" :modal-append-to-body='false' :modal="false">
      <el-row style="text-align:left;line-height:40px;">
        <label style="width:100px;display:inline-block;">存货名称 ：</label>
        <el-select size="mini" style="width:250px;" @change="batchGoodsChange" v-model="batchGoodsItem" >
          <el-option v-for="item in optionList" :key="item.id" :label="item.code+'_'+item.fullName" :value="item.id"></el-option>
        </el-select>
      </el-row>
      <el-row style="text-align:left;line-height:40px;">
        <label style="width:100px;display:inline-block;">计算模式 ：</label>
        <el-select size="mini" style="width:250px;" v-model="batchCalcmode" >
          <el-option v-for="item in options22" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-row>
      <el-row style="text-align:left;line-height:40px;">
        <label style="width:100px;display:inline-block;">换算关系 ：</label>
        <el-input size="mini" style="width:250px;" v-model="batchRelation" @change="ev => { batchRelation && (batchRelation = Number(ev || 0).toFixed(8))}"  placeholder="请输入内容"></el-input>
      </el-row>
      <el-row style="text-align:left;line-height:40px;" v-if="companyType == 3">
        <label style="width:100px;display:inline-block;">类别（科目）：</label>
        <el-select :disabled="batchGoodsItem !== ''" size="mini" style="width:250px;" v-model="batchCategory.kmclassify" >
          <el-option v-for="item in batchCategorylist" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
        </el-select>
      </el-row>
      <el-row style="text-align:left;line-height:40px;" v-if="companyType == 3">
        <label style="width:100px;display:inline-block;">销售（科目）：</label>
        <el-select :disabled="batchGoodsItem !== ''" size="mini" style="width:250px;" v-model="batchSales.chukukmid" >
          <el-option v-for="item in batchSaleslist" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
        </el-select>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchShow = false">取消</el-button>
        <el-button type="primary" @click="batchSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {postAxios, getAxios} from '@/libs/axios'
import * as AUXILIARY_CONST from '@/constants/auxiliary-accounting'
export default {
  data  () {
    const self = this
    return {
      CSSZValue: 2, // Number(window.top.getCSSZValue && window.top.getCSSZValue('dzf009')),
      dzf010: 2, // Number(window.top.getCSSZValue && window.top.getCSSZValue('dzf010')),
      window: window,
      SpecialKM: [],
      filterInput: '',
      dialogData: [],
      tableHeight: self.$parent.$refs.dialog.clientHeight - 180,
      BroadTableRow: {},
      loading: true,
      batchGoodsname: '',
      batchGoodsId: '',
      batchGoodsItem: '',
      batchCalcmode: 0,
      batchRelation: '1.000000',
      batchCategory: {
        kmclassify: '',
        kmmc_invcl: '',
        kmclasscode: ''
      },
      batchSales: {
        chukukmid: '',
        kmmc_sale: '',
        chukukmcode: ''
      },
      switchValue: true,
      tableData1: [],
      tableData2: [],
      optionList: [],
      clickTableRow: false,
      dialogShow: false,
      rowIndex: -1,
      multipleSelection: [],
      batchCategorylist: [],
      batchSaleslist: [],
      batchShow: false,
      revealAll: true,
      options22: [{
        value: 0,
        label: '别名单位*换算 关系 = 原单位'
      }, {
        value: 1,
        label: '别名单位/换算关系 = 原单位'
      }],
      currentChangerow: '',
      currentChangerow2: '',
      selectList: []
    }
  },
  props: [
    'companyType'
  ],
  methods: {
    getThousands: function (value, index) {
      if (index === 1) {
        return this.$options.filters.forThousands(value, this.$store.getters.pricePre, true)
      } else {
        return this.$options.filters.forThousands(value, this.$store.getters.numPre, true)
      }
    },
    getThousandsal: function (value, index) {
      if (index === 1) {
        return this.$options.filters.forThousands(value, this.$store.getters.pricePre, true)
      } else {
        return this.$options.filters.forThousands(value, this.$store.getters.numPre, true)
      }
    },
    // formatter (row, column, cellValue, index) {
    //   if (!Number.isFinite(cellValue) || cellValue === 0) {
    //     return ''
    //   }
    //   if (column.property === 'salePrice') {
    //     return this.$options.filters.forThousands(cellValue, this.$store.getters.pricePre, true)
    //   } else if (column.property === 'saleNumber') {
    //     return this.$options.filters.forThousands(cellValue, this.$store.getters.numPre, true)
    //   } else {
    //     return this.$options.filters.forThousands(cellValue, 2, true)
    //   }
    // },
    batchGoodsChange (item) {
      this.optionList.forEach(value => {
        if (value.id === item) {
          this.batchGoodsname = value.name || value.spmc
          this.batchGoodsId = value.id
          this.batchCategory.kmclassify = value.kmclassify
          this.batchSales.chukukmid = value.chukukmid
        }
      })
    },
    closeInventory () {
      this.dialogData = this.optionList
      this.filterInput = ''
    },
    filterData () {
      if (this.$parent.$parent.companyType === 1) {
        this.dialogData = this.optionList.filter(ev => {
          return ev.spmc.indexOf(this.filterInput) !== -1 || ev.spbm.indexOf(this.filterInput) !== -1 || (ev.gg && ev.gg.indexOf(this.filterInput) !== -1) || (ev.xh && ev.xh.indexOf(this.filterInput) !== -1)
        })
      } else {
        this.dialogData = this.optionList.filter(ev => {
          return ev.code.indexOf(this.filterInput) !== -1 || ev.name.indexOf(this.filterInput) !== -1 || (ev.spec && ev.spec.indexOf(this.filterInput) !== -1)
        })
      }
    },
    selectionChange (e) {
      this.selectList = e
    },
    clearSelect (item) {
      item.name = ''
      // this.$refs.multipleTable1.toggleRowSelection(item)
    },
    hslChange (data, idx) {
      data[idx].hsl = Number(data[idx].hsl || 0).toFixed(8)
    },
    selectChange (id, row) {
      this.$refs.multipleTable1.toggleRowSelection(row, true)
      this.optionList.forEach((val) => {
        if (val.id === id) {
          debugger
          this.currentChangerow.name = val.fullName
          this.$nextTick(() => {
            // this.currentChangerow.subjname = val.kmmc
            this.currentChangerow.pk_subj = val.kmid
          })
        }
      })
    },
    selectChange1 (id) {
      this.optionList.forEach((val) => {
        if (val.id === id) {
          this.BroadTableRow.name = val.fullName
          this.tableData2[this.BroadTableRow.index].kmclassify = val.kmclassify
          this.tableData2[this.BroadTableRow.index].chukukmid = val.chukukmid
          if (this.$parent.$parent.companyType !== 3) {
            this.tableData2[this.BroadTableRow.index].name = val.fullName
          } else {
            this.tableData2[this.BroadTableRow.index].name = val.fullName
          }
        }
      })
    },
    selectChange2 (id) {
      this.batchCategorylist.forEach((val) => {
        if (val.id === id) {
          this.BroadTableRow.kmmc_invcl = val.kmmc
          this.BroadTableRow.kmclassify = val.id
          this.BroadTableRow.kmclasscode = val.kmbm
        }
      })
    },
    selectChange3 (id) {
      this.batchSaleslist.forEach((val) => {
        if (val.id === id) {
          this.BroadTableRow.kmmc_sale = val.kmmc
          this.BroadTableRow.chukukmid = val.id
          this.BroadTableRow.chukukmcode = val.kmbm
        }
      })
    },
    handleCurrentChange (val) {
      this.tableData1.forEach((val) => {
        if (val.clickTableRow === true) {
          val.clickTableRow = false
        }
      })
      this.currentChangerow = val
      if (val.clickTableRow === false) {
        val.clickTableRow = true
      }
    },
    handleCurrentChange2 (val) {
      this.currentChangerow2 = val
    },
    sendStatus () {
      this.$emit('listenStatus', false)
    },
    batch () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择数据!')
      } else {
        this.batchShow = true
        this.batchGoodsItem = ''
        this.batchRelation = '1.00000000'
        this.batchGoodsname = ''
        this.batchGoodsId = ''
        this.batchCalcmode = 0
        this.batchCategory.kmclassify = ''
        this.batchCategory.kmmc_invcl = ''
        this.batchCategory.kmclasscode = ''
        this.batchSales.chukukmid = ''
        this.batchSales.kmmc_sale = ''
        this.batchSales.chukukmcode = ''
      }
    },
    getCategorySales (val) {
      const getForKMBM = (row, tempData) => {
        for (let idx in row) {
          if (
            (row[idx].kmbm.substring(0, 6) === '500101' ||
            row[idx].kmbm.substring(0, 6) === '505101' ||
            row[idx].kmbm.substring(0, 6) === '510101' ||
            row[idx].kmbm.substring(0, 6) === '510201' ||
            row[idx].kmbm.substring(0, 6) === '450101' ||
            row[idx].kmbm.substring(0, 6) === '490101' ||
            row[idx].kmbm.substring(0, 6) === '600101' ||
            row[idx].kmbm.substring(0, 6) === '605101') && row[idx].yz === '是'
          ) {
            tempData.push(row[idx])
          }
          if (row[idx].children) {
            getForKMBM(row[idx].children, tempData)
          }
        }
      }
      getAxios('/bdset/gl_cpacckmact/queryByPkcorp2', {accindex: val}).then(res => {
        if (res.success) {
          if (val === 0) {
            let rowTemp = []
            res.rows.forEach(row => {
              if (row.children &&
                (
                  row.kmbm.substring(0, 4) === '1403' ||
                  row.kmbm.substring(0, 4) === '1243' ||
                  row.kmbm.substring(0, 4) === '1211' ||
                  row.kmbm.substring(0, 4) === '1201' ||
                  row.kmbm.substring(0, 4) === '1405'
                )) {
                row.children.forEach(chi => {
                  rowTemp.push(chi)
                })
              }
            })
            this.batchCategorylist = rowTemp
          } else {
            let rowTemp = []
            getForKMBM(res.rows, rowTemp)
            // res.rows.forEach(row => {
            //   if (row.children) {
            //     row.children.forEach(chi => {
            //       if (chi.kmbm.substring(0, 6) === '500101' || chi.kmbm.substring(0, 6) === '505101' || chi.kmbm.substring(0, 6) === '600101' || chi.kmbm.substring(0, 6) === '605101') {
            //         rowTemp.push(chi)
            //       }
            //       if (chi.children) {
            //         chi.children.forEach(chiChi => {
            //           if (chiChi.kmbm.substring(0, 6) === '500101' || chiChi.kmbm.substring(0, 6) === '505101' || chiChi.kmbm.substring(0, 6) === '600101' || chiChi.kmbm.substring(0, 6) === '605101') {
            //             rowTemp.push(chiChi)
            //           }
            //         })
            //       }
            //     })
            //   }
            // })
            this.batchSaleslist = rowTemp
          }
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg,
            duration: 3000
          })
        }
      }).catch((error) => {
        this.$message.error({
          showClose: true,
          message: error,
          duration: 3000
        })
      })
    },
    // 批处理保存
    batchSave () {
      // if (!this.batchGoodsId) {
      //   this.$message.warning('请选择存货!')
      //   return
      // }
      // if (this.batchCalcmode === '') {
      //   this.$message.warning('请选择计算模式!')
      //   return
      // }
      if (!this.batchRelation) {
        this.batchRelation = 1.00000000
      }
      this.batchCategorylist.forEach((val) => {
        if (val.id === this.batchCategory.kmclassify) {
          this.batchCategory.kmmc_invcl = val.kmmc
          this.batchCategory.kmclasscode = val.kmbm
        }
      })
      this.batchSaleslist.forEach((val) => {
        if (val.id === this.batchSales.chukukmid) {
          this.batchSales.kmmc_sale = val.kmmc
          this.batchSales.chukukmcode = val.kmbm
        }
      })
      this.batchShow = false
      this.multipleSelection.forEach((val, index) => {
        val.hsl = this.batchRelation
        val.spmc = this.batchGoodsname
        val.name = this.batchGoodsname
        val.pk_inventory = this.batchGoodsId
        val.calcmode = this.batchCalcmode
        val.kmclassify = this.batchCategory.kmclassify
        val.kmmc_invcl = this.batchCategory.kmmc_invcl
        val.kmclasscode = this.batchCategory.kmclasscode
        val.chukukmid = this.batchSales.chukukmid
        val.kmmc_sale = this.batchSales.kmmc_sale
        val.chukukmcode = this.batchSales.chukukmcode
      })
    },
    switchChange (val) {
      this.revealAll = val
      this.getInventoryList()
    },
    matching () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择数据!')
        return
      }
      for (let idxMul = 0; idxMul < this.multipleSelection.length; idxMul++) {
        if (!this.multipleSelection[idxMul].aliasname) {
          let warnIdx = ''
          for (let ListIdx = 0; ListIdx < this.tableData2.length; ListIdx++) {
            if (this.multipleSelection[idxMul].mid === this.tableData2[ListIdx].mid) {
              warnIdx = ListIdx + 1
              break
            }
          }
          this.$message.warning(`请检查第 ${warnIdx} 行货物及劳务名称不能为空！`)
          return
        }
      }
      const loading = this.$loading({
        lock: true,
        text: '正在处理',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.multipleSelection.forEach((val) => {
        this.$set(val, 'matchname', val.aliasname + val.unit ? val.unit : '')
      })
      postAxios('/zncs/workbench/saveInventoryData_long', { goods: JSON.stringify(this.multipleSelection) }).then(res => {
        loading.close()
        if (res.success) {
          this.$message.success({
            message: res.msg,
            duration: 3000
          })
          this.getInventoryList()
          this.getOptionsList()
          this.$parent.$parent.matchInventoryShow = false
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg,
            duration: 3000
          })
        }
      }).catch((error) => {
        loading.close()
        this.$message.error({
          showClose: true,
          message: error,
          duration: 3000
        })
      })
    },
    changeFun (val) {
      this.multipleSelection = val
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
      if (!row.pk_inventory) {
        this.$set(row, 'pk_inventory', '')
      }
    },
    getInventoryid (row) {
      console.log(row)
      this.dialogShow = false
      if (this.companyType === 1) {
        this.currentChangerow.chid = row.id
        this.currentChangerow.name = row.spmc
        this.currentChangerow.pk_subj = row.kmid
      } else {
        this.tableData2[this.rowIndex].pk_inventory = row.id
        this.tableData2[this.rowIndex].name = row.spmc || row.name
        this.tableData2[this.BroadTableRow.index].kmclassify = row.kmclassify
        this.tableData2[this.BroadTableRow.index].chukukmid = row.chukukmid
      }
    },
    switchTableRow (row, event, column) {
      // this.$refs.multipleTable1.toggleRowSelection(row, true)
      this.$refs.multipleTable2.toggleRowSelection(row, true)
      // this.$refs.multipleTable3.toggleRowSelection(row, true)
      if (row.clickTableRow === false) {
        row.clickTableRow = true
        this.BroadTableRow = row
        if (this.rowIndex !== -1) {
          this.tableData2[this.rowIndex].clickTableRow = false
        }
      }
      this.rowIndex = row.index
    },
    // 参照查询
    getOptionsList () {
      let paramsQueryB = {
        id: AUXILIARY_CONST.AUXILIARY_TYPE.INVENTORY,
        kmid: 'null',
        sort: 'code',
        order: 'asc'
      }
      let paramQueryInfo = {
        isshow: 'Y',
        sort: 'spbm',
        order: 'asc',
        pk_invclassify: 'null'
      }
      if (this.$parent.$parent.companyType !== 1) {
        postAxios('/zncs/workbench/queryB', paramsQueryB).then(res => {
          if (res.success) {
            if (this.$parent.$parent.companyType === 2) {
              res.rows.forEach(fe => {
                fe.fullName = (fe.spmc || fe.name) + (fe.spec || '') + (fe.unit ? '(' + fe.unit + ')' : '')
              })
            } else {
              res.rows.forEach(fe => {
                fe.fullName = (fe.spmc || fe.name) + (fe.gg || '') + (fe.jldw ? '(' + fe.jldw + ')' : '')
              })
            }
            this.optionList = res.rows
            this.dialogData = res.rows
          } else {
            this.$message.error({
              showClose: true,
              message: res.msg,
              duration: 3000
            })
          }
        }).catch((error) => {
          this.$message.error({
            showClose: true,
            message: error,
            duration: 3000
          })
        })
      } else {
        getAxios('/icset/inventoryact/queryInfo', paramQueryInfo).then(res => {
          if (res.success) {
            if (this.$parent.$parent.companyType === 2) {
              res.rows.forEach(fe => {
                fe.fullName = (fe.spmc || fe.name) + (fe.spec || '') + (fe.unit ? '(' + fe.unit + ')' : '')
              })
            } else {
              res.rows.forEach(fe => {
                fe.fullName = (fe.spmc || fe.name) + (fe.gg || '') + (fe.jldw ? '(' + fe.jldw + ')' : '')
              })
            }
            this.optionList = res.rows
            this.dialogData = res.rows
          } else {
            this.$message.error({
              showClose: true,
              message: res.msg,
              duration: 3000
            })
          }
        }).catch((error) => {
          this.$message.error({
            showClose: true,
            message: error,
            duration: 3000
          })
        })
      }
      // postAxios(this.$parent.$parent.companyType !== 1 ? '/zncs/workbench/queryB' : '/icset/inventoryact/queryInfo',
      //   this.$parent.$parent.companyType !== 1 ? paramsQueryB : paramQueryInfo
      // ).then(res => {
      //   if (res.success) {
      //       if (this.$parent.$parent.companyType === 2) {
      //           res.rows.forEach(fe => {
      //               fe.fullName = (fe.spmc || fe.name) + (fe.spec || '') + (fe.unit ? '(' + fe.unit + ')' : '')
      //           })
      //       } else {
      //           res.rows.forEach(fe => {
      //               fe.fullName = (fe.spmc || fe.name) + (fe.gg || '' ) + (fe.jldw ? '(' + fe.jldw + ')' : '')
      //           })
      //       }
      //     this.optionList = res.rows
      //     this.dialogData = res.rows
      //   } else {
      //     this.$message.error({
      //       showClose: true,
      //       message: res.msg,
      //       duration: 3000
      //     })
      //   }
      // }).catch((error) => {
      //   this.$message.error({
      //     showClose: true,
      //     message: error,
      //     duration: 3000
      //   })
      // })
    },
    // 启用总账存货列表查询
    getInventoryList () {
      let params = {
        ids: this.$parent.$parent.curFolder.ids,
        period: this.$parent.$parent.searchData.period,
        isshow: this.revealAll ? 'Y' : 'N'
      }
      this.loading = true
      postAxios('/zncs/workbench/matchInventoryData_long', params).then(res => {
        this.loading = false
        if (res.success) {
          this.tableData2 = res.rows
          this.tableData2.forEach((value) => {
            this.$set(value, 'clickTableRow', false)
            value.hsl = Number(value.hsl || 0).toFixed(8)
          })
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg,
            duration: 3000
          })
          // this.$parent.$parent.matchInventoryShow = false
        }
      }).catch((error) => {
        this.$parent.$parent.matchInventoryShow = false
        this.$message.error({
          showClose: true,
          message: error,
          duration: 3000
        })
      })
    },
    // 启用总账存货列表查询
    getInventoryList2 () {
      let params = {
        period: this.$parent.$parent.searchData.period,
        ids: this.$parent.$parent.curFolder.ids
      }
      postAxios('/zncs/workbench/getGoodsInvenRela_long', params).then(res => {
        if (res.success) {
          this.tableData1 = res.rows
          this.tableData1.forEach((value) => {
            this.$set(value, 'clickTableRow', false)
            if (!value.name) {
              this.$set(value, 'chid', '')
              this.$set(value, 'name', '')
            }
            value.hsl = Number(value.hsl || 0).toFixed(8)
          })
        } else {
          // this.$parent.$parent.matchInventoryShow = false
          this.$message.error({
            showClose: true,
            message: res.msg,
            duration: 3000
          })
        }
        this.loading = false
      }).catch((error) => {
        this.$parent.$parent.matchInventoryShow = false
        this.$message.error({
          showClose: true,
          message: error,
          duration: 3000
        })
      })
    },
    // 匹配启用总账存货
    matchinventory1 () {
      // let params = []
      // this.tableData1.forEach(item => {
      //   if (item.name) {
      //     params.push(item)
      //   }
      // })
      for (let idxMul = 0; idxMul < this.selectList.length; idxMul++) {
        if (!this.selectList[idxMul].spmc) {
          let warnIdx = ''
          for (let ListIdx = 0; ListIdx < this.tableData1.length; ListIdx++) {
            if (this.selectList[idxMul].mid === this.tableData1[ListIdx].mid) {
              warnIdx = ListIdx + 1
              break
            }
          }
          this.$message.warning(`请检查第 ${warnIdx} 行货物及劳务名称不能为空！`)
          return
        }
      }
      const loading = this.$loading({
        lock: true,
        text: '正在处理',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      console.log(this.selectList)
      postAxios('/zncs/workbench/saveVatGoosInventory_long', {goods: JSON.stringify(this.selectList)}).then(res => {
        loading.close()
        if (res.success) {
          this.$message.success({
            message: res.msg,
            duration: 3000
          })
          this.$emit('listenStatus', false)
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg,
            duration: 3000
          })
        }
        this.loading = false
      }).catch((error) => {
        loading.close()
        this.$message.error({
          showClose: true,
          message: error,
          duration: 3000
        })
      })
    },
    queryBySpecialKM () {
      getAxios('/icset/inventoryact/queryBySpecialKM', {}).then(res => {
        if (res.success) {
          // this.SpecialKM = res.rows
          this.$set(this, 'SpecialKM', res.rows)
        } else {
          this.$message.error({
            showClose: true,
            message: res.msg,
            duration: 3000
          })
        }
      }).catch((error) => {
        this.$message.error({
          showClose: true,
          message: error,
          duration: 3000
        })
      })
    }
  },
  mounted () {
    // this.tableHeight = this.$parent.$refs.dialog.clientHeight - 180
    this.getOptionsList()
    this.queryBySpecialKM()
    this.tableHeight = this.$parent.$refs.dialog.clientHeight - 180
  },
  created () {
    if (this.companyType === -1) {
      top.Public.tips({
        type: 1,
        content: '启用总账核算存货，请先设置存货成本核算方式！'
      })
      this.$parent.$parent.matchInventoryShow = false
      return
    }
    if (this.companyType === 1) {
      this.getInventoryList2()
    } else {
      this.getInventoryList()
    }
    this.getCategorySales(0)
    this.getCategorySales(5)
  }

}
</script>
<style lang="less">
  /*.match-inventory .el-table--border, .match-inventory .el-table--group {*/
  /*  border: 1px solid #303133!important;*/
  /*}*/
  /*.match-inventory .el-table td, .match-inventory .el-table th.is-leaf {*/
  /*  border-bottom: 1px solid #303133!important;*/
  /*}*/
  /*.match-inventory .el-table--border td, .match-inventory .el-table--border th, .match-inventory .el-table__body-wrapper .match-inventory .el-table--border.is-scrolling-left~.el-table__fixed {*/
  /*  border-right: 1px solid #303133!important;*/
  /*}*/
  /*.match-inventory .el-table--border td, .match-inventory .el-table--border th, .match-inventory .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {*/
  /*  border-right: 1px solid #303133!important;*/
  /*}*/

  /*.match-inventory .el-table td, .match-inventory .el-table th.is-leaf {*/
  /*  border-bottom: 1px solid #303133!important;*/
  /*}*/
  .red {
    color: red;
  }
  .match-inventory {
    height: 360px;
    margin-top: -15px;
    /deep/ .el-table__body {
      .el-select {
        .el-input__suffix {
          display: none!important;
        }
      }
    }
  }

</style>
