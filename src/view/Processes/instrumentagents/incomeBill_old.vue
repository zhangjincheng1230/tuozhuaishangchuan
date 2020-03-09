<template>
  <div style="position: relative;border: 1px solid #ddd;background:rgba(255,255,255,1)" class="oldBill">
    <el-container>
      <el-form
        :inline="true"
        @submit.native.prevent
        class="form-inline"
        label-width="100px"
        style="min-height:45px;padding-top: 12px;width: 100%"
      >
        <el-form-item label="期间:" size="small" label-width="50px" style="float: left; margin:0 0 13px 14px;">
          <el-input style="width: 192px;" placeholder="请选择日期" v-popover:popover suffix-icon="el-icon-arrow-down" v-model="dateTime"></el-input>

          <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
            <el-main style="padding: 0 20px">
              <el-form-item style="margin-left: -20px;">
                <h4>进项发票查询</h4>
              </el-form-item>
              <el-form-item size="mini" style="margin: 0 -20px 18px;">
                <el-radio v-model="QueryRadio" label="serDay" style="margin: 0 5px">认证日期:</el-radio>
                <el-date-picker
                  v-model="rzdate"
                  unlink-panels
                  type="daterange"
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :picker-options="monthPickerOptions"
                  @change="selectDate('serDay')"
                  style="width: 280px">
                </el-date-picker>
              </el-form-item>
              <el-form-item size="mini" style="margin: 0 -20px 18px;">
                <el-radio v-model="QueryRadio" label="serDay1" style="margin: 0 5px">开票日期:</el-radio>
                <el-date-picker
                  v-model="kpdate"
                  unlink-panels
                  type="daterange"
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :picker-options="monthPickerOptions"
                  @change="selectDate('serDay1')"
                  style="width: 280px">
                </el-date-picker>
              </el-form-item>
              <el-form-item size="mini" style="border-bottom: 1px dashed #dadada;padding-bottom: 5px;margin: 0 -20px 18px;">
                <el-radio v-model="QueryRadio" label="serPer" style="margin: 0 5px">入账期间:</el-radio>
                <el-date-picker
                  v-model="rdate"
                  type="month"
                  unlink-panels
                  value-format="yyyy-MM"
                  :clearable="false"
                  :picker-options="monthPickerOptions"
                  @change="selectDate('serPer')"
                  style="width: 280px">
                </el-date-picker>
              </el-form-item>
              <el-form-item size="mini" label="类型:" label-width="100" style="margin-left: 37px;">
                <el-select v-model="ioperatetype" style="width: 280px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="存货" value="21"></el-option>
                  <el-option label="费用" value="22"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="mini" label="发票性质:" label-width="100" style="margin-left: 10px;">
                <el-select v-model="billNature" style="width: 280px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="普票" value="N"></el-option>
                  <el-option label="专票" value="Y"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="mini" label="生成凭证:" label-width="100" style="margin-left: 10px;">
                <el-select v-model="proof" style="width: 280px">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="已生成凭证" value="Y"></el-option>
                  <el-option label="未生成凭证" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="mini" label="发票号码:" label-width="100" style="margin-left: 10px;">
                <el-input v-model="billNumber" style="width: 280px"></el-input>
              </el-form-item>
              <el-form-item size="mini" label="发票代码:" label-width="100" style="margin-left: 10px;">
                <el-input v-model="billCode" style="width: 280px"></el-input>
              </el-form-item>
              <div style="text-align: right;margin-top: 12px">
                <el-button size="small" @click="getDateToReturn(1)">取 消</el-button>
                <el-button size="small" @click="clearCondition">清 除</el-button>
                <el-button size="small" type="primary" @click="confirm">确 定</el-button>
              </div>
            </el-main>
          </el-popover>
        </el-form-item>
        <el-form-item style="float:right;margin-bottom: 13px" size="small">
          <el-button v-if="isShowYbr" size="mini" @click="openToPick">一键取票</el-button>
          <el-button size="mini" @click="addData">新增</el-button>
          <el-button size="mini" @click="editRow">修改</el-button>
          <el-button size="mini" @click="deleteRows">删除</el-button>
          <el-button size="mini" @click="handleCommand('export')">导出</el-button>
          <el-button size="mini" @click="impExcel">导入</el-button>
          <el-button size="mini" @click="confirm">刷新</el-button>
          <el-button size="mini" @click="enterSetting">入账设置</el-button>
          <el-button size="mini" @click="DateTidy">期间调整</el-button>
          <el-button v-if="isOnce" @click="createIncome" size="mini">生成入库</el-button>
          <el-button v-if="isZeroAndOnce" size="mini" @click="queryCreate">生成凭证</el-button>
          <el-button v-if="isTwice" @click="createProof" size="mini">存货</el-button>
          <el-tooltip v-if="isTwice" class="item" effect="dark" content="除存货以外的数据，点此按钮生成凭证" placement="bottom">
            <el-button size="mini" @click="queryCreate">费用<i style="margin-left: 2px" class="el-icon-warning-outline"></i></el-button>
          </el-tooltip>
          <el-button size="mini" @click="handleCommand('rule')">合并规则</el-button>
        </el-form-item>
      </el-form>
    </el-container>
    <el-container>
      <el-main style="padding: 0;overflow-y: hidden">
        <el-table
          :data="tableList"
          class="maintable"
          ref="jxfpTableRef"
          highlight-current-row
          @row-click="tableCurrentChange"
          @row-dblclick="tableDbClick"
          @selection-change="handleCheckChang"
          v-loading="loading"
          element-loading-text="数据处理中，请稍候..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)"
          stripe
          border
          :header-cell-style="headerCellStyle"
          :height="tableHeight"
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            fixed
            label=" "
            width="35">
          </el-table-column>
          <el-table-column
            type="selection"
            fixed
            align="center"
            width="30">
          </el-table-column>
          <el-table-column
            label="认证"
            align="center"
            width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.srzjg === 1" disabled/>
            </template>
          </el-table-column>
          <el-table-column
            prop="srzrj"
            label="认证日期"
            width="102"
            sortable
            header-align="center"
            align="left">
          </el-table-column>
          <el-table-column
            prop="skprj"
            label="开票日期"
            sortable
            width="102"
            header-align="center"
            align="left">
          </el-table-column>
          <el-table-column
            prop="inqj"
            label="入账期间"
            width="102"
            header-align="center"
            sortable
            align="left">
          </el-table-column>
          <el-table-column
            label="发票号码"
            width="100"
            show-overflow-tooltip
            header-align="center"
            align="left">
            <template slot-scope="scope" v-if="scope.row.fphm">
              <span v-if="scope.row.iszh === '是'"><img src="@/assets/img/zhuanpiao.png" style="margin: 0 3px -2px 0"><a style="color: #2C9DD8;cursor: pointer;" @click="preview(scope.row)">{{scope.row.fphm}}</a></span>
              <span v-else><img src="@/assets/img/pupiao.png" style="margin: 0 3px -2px 0"><a style="color: #2C9DD8;cursor: pointer;" @click="preview(scope.row)">{{scope.row.fphm}}</a></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ipath"
            label="查看原图"
            width="80"
            align="center">
            <template slot-scope="scope" v-if="scope.row.ipath">
              <el-button @click="lookImg(scope.row.ipath)" type="text" style="color: #2C9DD8;">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="fpdm"
            label="发票代码"
            width="100"
            show-overflow-tooltip
            header-align="center"
            align="left">
          </el-table-column>
          <el-table-column
            prop="sspmc"
            label="货物或应税劳务"
            sortable
            show-overflow-tooltip
            min-width="145"
            header-align="center"
            align="left">
          </el-table-column>
          <el-table-column
            prop="shjje"
            label="金额"
            width="100"
            header-align="center"
            :formatter="repformny"
            align="right">
          </el-table-column>
          <el-table-column
            prop="se"
            label="税额"
            width="100"
            :formatter="repformny"
            header-align="center"
            align="right">
          </el-table-column>
          <el-table-column
            prop="sl"
            label="税率"
            sortable
            width="75"
            header-align="center"
            align="right">
            <template slot-scope="scope" v-if="scope.row.sl">
              {{scope.row.sl}}%
            </template>
          </el-table-column>
          <el-table-column
            prop="sjshj"
            label="价税合计"
            width="100"
            :formatter="repformny"
            header-align="center"
            align="right">
          </el-table-column>
          <el-table-column
            prop="busitempname"
            label="业务类型"
            sortable
            show-overflow-tooltip
            width="120"
            header-align="center"
            align="left">
          </el-table-column>
          <el-table-column
            prop="sxhfmc"
            label="销货方名称"
            sortable
            show-overflow-tooltip
            min-width="115"
            header-align="center"
            align="left">
          </el-table-column>
          <el-table-column
            label="凭证号"
            width="70"
            align="center">
            <template slot-scope="scope" v-if="scope.row.pzh">
              记<router-link :to="{name: 'voucher-edit', params: {id: scope.row.tzpzid}}" style="color: #2C9DD8;text-decoration: none">{{scope.row.pzh}}</router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="入库单号"
            show-overflow-tooltip
            v-if="isShowCrkNo"
            min-width="100"
            align="center">
            <template slot-scope="scope" v-if="() => this.showRkd">
              <a v-if="() => this.showDid" style="color: #2C9DD8;cursor: pointer;" @click="jupeComebill(scope.row)">{{scope.row.did}}</a>
              <a v-if="() => !this.showDid" style="color: #2C9DD8;cursor: pointer;" @click="jupeComebill(scope.row)">{{scope.row.vicbillno}}</a>
            </template>
          </el-table-column>
          <el-table-column
            label="发票状态"
            min-width="85"
            align="center">
            <template slot-scope="scope">
              {{scope.row.kplx === '1' ? '正常发票' : scope.row.kplx === '2' ? '负数发票' : scope.row.kplx === '3' ? '空白废票' : scope.row.kplx === '4' ? '填开作废' : ''}}
            </template>
          </el-table-column>
          <el-table-column
          label="类型"
          width="80"
          v-if="!isKc"
          align="center">
            <template slot-scope="scope">
              {{scope.row.ioperatetype === 21 ? '存货' : scope.row.ioperatetype === 22 ? '费用' : ''}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sourcetype"
            label="单据来源"
            show-overflow-tooltip
            width="95"
            :formatter="formatter"
            header-align="center"
            align="left">
          </el-table-column>
        </el-table>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="page" :limit.sync="rows"
                      @pagination="pageData"></Pagination>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="一键取票" :visible.sync="dialogToPick" width="760px"
               :close-on-click-modal="false"
               @close="dialogToPick = false">
      <el-form
        ref="ruleForm"
        :model="toPickForm"
        @submit.native.prevent
        label-width="100px"
        :inline="true">
        <el-row>
          <el-col :span="12">
            <el-form-item size="mini" label="发票提取月份:">
              <el-date-picker
                v-model="toPickForm.period"
                type="month"
                value-format="yyyy-MM"
                :picker-options="monthPickerOptions"
                :clearable="false"
                style="width: 195px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="mini" label-width="120px" label="纳税人识别号:">
              <el-input v-model="toPickForm.ccrecode" style="width: 195px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="mini" label-width="120px" label="发票绑定码:">
              <el-input v-model="toPickForm.f2" style="width: 195px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="首次使用一键取票:" label-width="130"></el-form-item>
        </el-row>
        <el-row style="margin-top: -10px;">
          <el-form-item style="margin-left: 50px">
            下载<el-link type="primary" href="https://jxdownload.vpiaotong.com/进项税发票管理软件-正式版.rar">【进项税发票管理软件】</el-link>发票提取插件<br/>
            发送【进项税发票管理软件】给当前公司增值税税控开票软件所在电脑<br/>
            双击安装【进项税发票管理软件】，插上税控盘，自动同步增值税进项发票数据<br/>
            记账会计在当前界面输入纳税人识别号、绑定码后，获取的发票数据<br/>
            查看<el-link type="primary" href="http://download.dazhangfang.com/files/YJQP_JXsmsysc.pdf">【大账房一键取票-进项操作说明】</el-link>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button @click="dialogToPick = false">取 消</el-button>
        <el-button type="primary" @click="saveForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog id="billDialog" title="进项发票" :visible.sync="dialogBill" width="1090px"
               :close-on-click-modal="false"
               @close="colseBill('ruleForm')">
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="adddoc"
        @submit.native.prevent
        label-width="100px"
        :inline="true"
        style="width: 98%;float: right">
        <el-form-item size="mini" style="text-align: center;width: 97.5%;margin-bottom: 10px" prop="iszh">
          <el-select v-model="adddoc.header.iszh" :disabled="isEidt" style="width: 200px;">
            <el-option
              v-for="item in addedbillOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col>
            <el-form-item size="mini" style="margin-bottom: 0" label-width="90px" label="发票代码:" required>
              <el-input oninput="value=value.replace(/[^0-9.]/g,'');" :disabled="isEidt" v-model="adddoc.header.fpdm" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item size="mini" style="margin-bottom: 0" label-width="90px" label="发票号码:" required>
              <el-input oninput="value=value.replace(/[^0-9.]/g,'');" :disabled="isEidt" v-model="adddoc.header.fphm" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item size="mini" style="margin-bottom: 0" label-width="90px" label="开票日期:" required>
              <el-date-picker
                type="date"
                v-model="adddoc.header.skprj"
                value-format="yyyy-MM-dd"
                :picker-options="monthPickerOptions"
                :disabled="isEidt"
                :clearable="false"
                style="width: 150px">
              </el-date-picker>
            </el-form-item>
            <el-form-item size="mini" style="margin-bottom: 0" label-width="90px" label="认证日期:" prop="srzrj">
              <el-date-picker
                type="date"
                v-model="adddoc.header.srzrj"
                value-format="yyyy-MM-dd"
                :picker-options="monthPickerOptions"
                :disabled="isEidt"
                :clearable="false"
                style="width: 150px">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 购买方 -->
        <div class="invoice_opening_form">
          <el-row class="form-row">
            <el-col :span="1" class="font-itme">
              <p>购</p>
              <p>买</p>
              <p>方</p>
            </el-col>
            <el-col :span="10" class="item">
              <el-form-item label="名称" prop="ghfmc">
                <el-input v-model="adddoc.header.ghfmc" :disabled="isEidt" style="width: 295px" size="mini" placeholder="企业名称" />
              </el-form-item>
              <el-form-item label="纳税人识别号" prop="ghfsbh">
                <el-input v-model="adddoc.header.ghfsbh" :disabled="isEidt" style="width: 295px" size="mini" placeholder="纳税人识别号" />
              </el-form-item>
              <el-form-item label="地 址、 电 话" prop="ghfdzdh">
                <el-col>
                  <el-input v-model="adddoc.header.ghfdzdh" :disabled="isEidt" style="width: 295px" size="mini" placeholder="地 址、 电 话" />
                </el-col>
              </el-form-item>
              <el-form-item label="开户行及账号" style="margin-bottom: 5px" prop="ghfyhzh">
                <el-col>
                  <el-input v-model="adddoc.header.ghfyhzh" :disabled="isEidt" style="width: 295px" size="mini" placeholder="开户行及账号" />
                </el-col>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="font-itme" style="border-right: 1px solid #ddd;">
              <p>业</p>
              <p>务</p>
              <p>类</p>
              <p>型</p>
            </el-col>
            <el-col :span="12">
              <el-form-item style="width: 100%" prop="ghfdzdh">
                <el-input v-model="adddoc.header.busitempname" :disabled="isEidt" style="width: 507px;" size="mini" placeholder="请选择业务类型" />
                <i class="el-icon-search"
                   @click="openBusinessType"
                   style="position: absolute;
                            right: 0px;
                            top: 3px;
                            width: 28px;
                            height: 28px;
                            cursor: pointer;
                            line-height: 28px;"></i>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 货物表格 -->
        <div class="invoice_opening_table">
          <el-table :data="adddoc.body" ref="goodsTable" style="width: 100%" border class="table" highlight-current-row
                    @current-change="getSelectList">
            <el-table-column width="60" align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="medium" :disabled="isEidt"  @click="addGoods">
                  <i class="el-icon-plus"></i>
                </el-button>
                <el-button style="margin-left: 0;" type="text" size="medium" :disabled="isEidt" circle @click="delGoods(scope.$index)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="货物或应税劳务名称" width="150px" align="center">
              <template slot-scope="scope">
                <el-select
                  size="mini"
                  @change="goodChange(scope.row)"
                  filterable
                  allow-create
                  default-first-option
                  :disabled="isEidt"
                  v-model="scope.row.bspmc">
                  <el-option
                    v-for="item in bspmcOption"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name">
                    <span style="float: left;width:300px;">{{ item.spec !== undefined ? item.name + ' ' + item.spec : item.name }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" show-overflow-tooltip min-width="100px" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.gg" :disabled="isEidt" size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="danwei" label="单位" width="95px" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.jldw" :disabled="isEidt" size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="num" label="数量" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bnum" :disabled="isEidt" :controls =false :precision="4" @change="inpValueChange(scope.row)" size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="danjia" label="单价" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bdj" :disabled="isEidt" :controls =false :precision="4" @change="inpValueChange(scope.row)" size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="jine" label="金额" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bje" :disabled="isEidt" :controls =false :precision="2" @change="JeChange(scope.row)" size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="shuil" label="税率(%)" width="70px" align="center">
              <template slot-scope="scope">
                <el-input oninput="value=value.replace(/[^0-9.]/g,'');" class="slstyle" size="mini" v-model="scope.row.bsl" :disabled="isEidt" @change="SlChange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="shuie" label="税额" min-width="100px" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.bse" :disabled="isEidt" :controls =false :precision="2" size="mini" />
              </template>
            </el-table-column>
          </el-table>
          <el-row class="row-item" style="padding: 5px 0">
            <el-col :span="17">
              <strong>合计</strong>
            </el-col>
            <el-col :span="3" style="margin-left: -32px;text-align:right">
              <strong>￥：{{adddoc.header.shjje !== '' ? adddoc.header.shjje.toFixed(2) : ''}}</strong>
            </el-col>
            <el-col :span="4" style="padding-left: 10px;margin-left: 32px;text-align:right">
              <strong>￥：{{adddoc.header.se !== '' ? adddoc.header.se.toFixed(2) : ''}}</strong>
            </el-col>
          </el-row>
          <el-row class="row-item" style=" border-top: 1px solid #ddd;">
            <el-col :span="16" style="padding-left: 60px">
              <strong>价税合计（大写）：{{trunDX}}</strong>
            </el-col>
            <el-col :span="8" style="padding-left: 4px">
              <strong>（小写）￥：{{adddoc.header.totalmny !== '' ? adddoc.header.totalmny.toFixed(2) : ''}}</strong>
            </el-col>
          </el-row>
        </div>
        <!-- 销售方 -->
        <div class="invoice_opening_Saleform">
          <el-row class="form-row">
            <el-col :span="1" class="font-itme">
              <p>销</p>
              <p>售</p>
              <p>方</p>
            </el-col>
            <el-col :span="10" class="item">
              <el-form-item label="名    称" size="mini" prop="id">
                <el-input v-model="adddoc.header.sxhfmc" :disabled="isEidt" style="width: 295px" size="mini" placeholder="企业名称" />
              </el-form-item>
              <el-form-item label="纳税人识别号" prop="xhfsbh">
                <el-input v-model="adddoc.header.xhfsbh" :disabled="isEidt" style="width: 295px" size="mini" placeholder="纳税人识别号" />
              </el-form-item>
              <el-form-item label="地 址、 电 话" prop="xhfdzdh">
                <el-input v-model="adddoc.header.xhfdzdh" :disabled="isEidt" style="width: 295px" size="mini" placeholder="地 址、 电 话" />
              </el-form-item>
              <el-form-item label="开户行及账号" prop="xhfyhzh">
                <el-input v-model="adddoc.header.xhfyhzh" :disabled="isEidt" style="width: 295px" size="mini" placeholder="开户行及账号" />
              </el-form-item>
            </el-col>
            <el-col :span="1" class="font-itme" style="border-right: 1px solid #ddd;">
              <p>备</p>
              <p>注</p>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="demo">
                <textarea v-model="adddoc.header.demo" :readonly="isEidt" style="width:507px;height:150px;resize: none; border:none; outline:none;" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button @click="colseBill('ruleForm')">取 消</el-button>
        <el-button v-if="!isEidt" type="primary" @click="saveAndBillForm('ruleForm')">保 存</el-button>
        <el-button v-if="!isAdd" type="primary" @click="saveAndBillForm('ruleForm', 1)">保存并新增</el-button>
      </div>
    </el-dialog>
    <el-dialog title="入账期间" :visible.sync="dialogDateTidy" width="400px"
               :close-on-click-modal="false"
               @close="dialogDateTidy = false">
      <el-form
        ref="tidyForm"
        :model="tidyForm"
        @submit.native.prevent
        label-width="120px"
        :inline="true">
        <el-form-item size="mini">
          <el-checkbox v-model="isEnterCheck" style="margin-left: 15px;">入账期间:</el-checkbox>
          <el-date-picker
            v-model="tidyForm.ruzper"
            type="month"
            value-format="yyyy-MM"
            :clearable="false"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item size="mini">
          <el-checkbox v-model="isRzCheck" style="margin-left: 15px;">认证期间:</el-checkbox>
          <el-date-picker
            v-model="tidyForm.rezper"
            type="month"
            value-format="yyyy-MM"
            :clearable="false"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button @click="dialogDateTidy = false">取 消</el-button>
        <el-button type="primary" @click="saveDateTidy('tidyForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog id="matchStock" title="入库匹配存货" :visible.sync="dialogMatchStock" width="1100px"
               :close-on-click-modal="false"
               @close="dialogMatchStock = false">
      <el-main style="padding: 0">
        <el-form :inline="true" style="width: 100%;margin-top: 10px" v-if="isShowZzForm">
          <el-form-item label="入账期间:" label-width="100" style="margin: 0 20px 10px">
            <el-date-picker
              v-model="stockRzDate"
              type="month"
              value-formar="yyyy-MM"
              disabled
              style="width: 150px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结算方式:" label-width="100" style="margin-right: 20px">
            <el-select v-model="jsfs" style="width: 100px">
              <el-option label="往来科目" value="01"></el-option>
              <el-option label="银行科目" value="02"></el-option>
              <el-option label="现金结算" value="03"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-tooltip style="margin-left:-8px;margin-top:5px" effect="light" content="红色标识为新存货" placement="bottom">
              <el-image :src=srcList[0]></el-image>
            </el-tooltip>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px">
            <el-switch
              v-model="isShowyppch"
              @change="switchChange"
              active-text="显示已匹配存货">
            </el-switch>
          </el-form-item>
        </el-form>
        <el-table
          :data="matStockList"
          ref="matStockRef"
          highlight-current-row
          @row-click="matStockCurrentChange"
          @selection-change="matStockCheckChang"
          stripe
          border
          :header-cell-style="headerCellStyle"
          :height="matStockHeight"
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label=" "
            width="35">
          </el-table-column>
          <el-table-column
            type="selection"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            label="发票号码">
            <template slot-scope="scope">
              <span v-if="scope.row.isAdd === '是'" style="color: red">{{scope.row.fphm}}</span>
              <span v-else-if="isKc && !scope.row.chid" style="color: red">{{scope.row.fphm}}</span>
              <span v-else>{{scope.row.fphm}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :show-overflow-tooltip="true"
            width="160"
            label="货物或劳务名称">
            <template slot-scope="scope">
              <span v-if="scope.row.isAdd === '是'" style="color: red">{{scope.row.aliasname}}</span>
              <span v-else-if="isKc && !scope.row.chid" style="color: red">{{scope.row.spmc}}</span>
              <span v-else-if="isKc">{{scope.row.spmc}}</span>
              <span v-else>{{scope.row.aliasname}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="85"
            label="规格型号">
            <template slot-scope="scope">
              <span v-if="scope.row.isAdd === '是'" style="color: red">{{scope.row.spec}}</span>
              <span v-else-if="isKc && !scope.row.chid" style="color: red">{{scope.row.ggxh}}</span>
              <span v-else-if="isKc">{{scope.row.ggxh}}</span>
              <span v-else>{{scope.row.spec}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="80"
            label="计量单位">
            <template slot-scope="scope">
              <span v-if="scope.row.isAdd === '是'" style="color: red">{{scope.row.unit}}</span>
              <span v-else-if="isKc && !scope.row.chid" style="color: red">{{scope.row.unit}}</span>
              <span v-else>{{scope.row.unit}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="120"
            v-if="!isZzdl"
            :show-overflow-tooltip="true"
            label="科目名称">
            <template #default="{ row, $index }">
              <el-select v-if="row.isShowSelect !== undefined ? row.isShowSelect : false"  v-model="row.pk_subj"
                         default-first-option :disabled="row.name !== undefined && row.name !== ''" filterable style= "width:120px">
                <el-option v-for="item in subData" :key="item.kmid" :label="item.kmmc" :value="item.kmid" style="width:300px">
                  <span style="float: left;width:300px">{{ item.kmmc }}</span>
                </el-option>
              </el-select>
              <span v-else-if="row.isAdd === '是'" style="color: red">{{row.subjname}}</span>
              <span v-else-if="isKc && !row.chid" style="color: red">{{row.subjname}}</span>
              <i v-else>{{row.subjname}}</i>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="120"
            label="存货名称">
            <template #default="{ row, $index }">
              <el-row v-if="row.isShowSelect !== undefined ? row.isShowSelect : false">
                <el-select v-model="row.pk_inventory" class="hidden-suffix"
                           allow-create default-first-option placeholder="请选择存货" filterable @change="invNameChange" style= "width:120px">
                  <el-option v-for="item in batchGoodsOption" :key="item.id" :label="item.fullName" :value="item.id" style="width:300px">
                    <span style="float: left;width:300px">{{ item.code + '_' + item.fullName}}</span>
                  </el-option>
                </el-select>
                <i class="el-icon-search"
                   @click="isShowInventory = true"
                   style="position: absolute;
                        right: 0px;
                        top: 2px;
                        width: 28px;
                        height: 28px;
                        cursor: pointer;
                        line-height: 28px;"></i>
              </el-row>
              <span v-else-if="row.isAdd === '是'" style="color: red">{{row.name}}</span>
              <span v-else-if="isKc && !row.chid" style="color: red">{{row.name}}</span>
              <i v-else>{{row.name}}</i>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            label="计算模式">
            <template #default="{ row, $index }">
              <el-select v-if="row.isShowSelect !== undefined ? row.isShowSelect : false" v-model="row.calcmode"
                         default-first-option placeholder="请选择" filterable style= "width:180px">
                <el-option v-for="item in countData" :key="item.value" :label="item.label" :value="item.value" style="width:300px">
                  <span style="float: left;width:300px">{{ item.label }}</span>
                </el-option>
              </el-select>
              <span v-else-if="row.isAdd === '是'" style="color: red">{{row.calcmode === '0' ? '别名单位*换算关系=原单位' : '别名单位/换算关系=原单位'}}</span>
              <span v-else-if="isKc && !row.chid" style="color: red">{{row.calcmode === '0' ? '别名单位*换算关系=原单位' : '别名单位/换算关系=原单位'}}</span>
              <span v-else>{{row.calcmode === '0' ? '别名单位*换算关系=原单位' : '别名单位/换算关系=原单位'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="102"
            label="换算关系">
            <template #default="{ row, $index }">
              <el-input-number v-if="row.isShowSelect !== undefined ? row.isShowSelect : false" v-model="row.hsl" :precision="idxCount" :controls =false :min="-99999999" :max="999999999" ></el-input-number>
              <span v-else-if="row.isAdd === '是'" style="color: red">{{row.hsl.toFixed(idxCount)}}</span>
              <span v-else-if="isKc && !row.chid" style="color: red">{{row.hsl.toFixed(idxCount)}}</span>
              <i v-else>{{row.hsl.toFixed(idxCount)}}</i>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="110"
            v-if="!isFzmx"
            label="类别(科目)">
            <template #default="{ row, $index }">
              <el-select v-if="row.isShowSelect !== undefined ? row.isShowSelect : false"  v-model="row.kmclassify"
                         default-first-option :disabled="row.isAdd !== '是'" filterable @change="tableLbKmChange" style= "width:120px">
                <el-option v-for="item in kmclassdata" :key="item.id" :label="item.kmmc" :value="item.id" style="width:300px">
                  <span style="float: left;width:300px">{{ item.kmmc }}</span>
                </el-option>
              </el-select>
              <span v-else-if="row.isAdd === '是'" style="color: red">{{row.kmmc_invcl}}</span>
              <span v-else-if="isKc && !row.chid" style="color: red">{{row.kmmc_invcl}}</span>
              <i v-else>{{row.kmmc_invcl}}</i>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="120"
            v-if="!isFzmx"
            label="销售(科目)">
            <template #default="{ row, $index }">
              <el-select v-if="row.isShowSelect !== undefined ? row.isShowSelect : false"  v-model="row.chukukmid"
                         default-first-option :disabled="row.isAdd !== '是'" filterable @change="tableXsKmChange" style= "width:120px">
                <el-option v-for="item in chukukmdata" :key="item.id" :label="item.kmmc" :value="item.id" style="width:300px">
                  <span style="float: left;width:300px">{{ item.kmmc }}</span>
                </el-option>
              </el-select>
              <span v-else-if="row.isAdd === '是'" style="color: red">{{row.kmmc_sale}}</span>
              <span v-else-if="isKc && !row.chid" style="color: red">{{row.kmmc_sale}}</span>
              <i v-else>{{row.kmmc_sale}}</i>
            </template>
          </el-table-column>
          <el-table-column
            min-width="0">
          </el-table-column>
        </el-table>
      </el-main>
      <div slot="footer" class="dialog__footer">
        <el-button @click="dialogMatchStock = false">取 消</el-button>
        <el-button type="primary" v-if="isZzdl" @click="batchOperation">批操作</el-button>
        <el-button type="primary" v-if="isZzdl" @click="savaInventory">匹 配</el-button>
        <el-button type="primary" v-if="isZzdl" @click="queryMatStock(1)">入 账</el-button>
        <el-button type="primary" v-if="!isZzdl" @click="queryMatStock">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog id="MergeDialog" title="合并规则设置" :visible.sync="dialogMerge" width="400px"
               :close-on-click-modal="false"
               @close="dialogMerge = false">
      <el-form
        ref="mergeForm"
        :model="mergeForm"
        @submit.native.prevent
        label-width="120px"
        :inline="true">
        <el-row style="border-bottom: 1px solid #ddd">
          <el-form-item label="凭证合并规则：" class="mergeSet">
            <h4>按所选规则合并凭证</h4>
            <el-row><el-radio v-model="mergeForm.pzrule" label="1">不合并</el-radio></el-row>
            <el-row><el-radio v-model="mergeForm.pzrule" label="2">按往来单位生成凭证</el-radio></el-row>
            <el-row><el-radio v-model="mergeForm.pzrule" label="3">勾选清单生成一张凭证</el-radio></el-row>
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #ddd">
          <el-form-item label="分录合并规则：" class="mergeSet">
            <el-row><el-radio v-model="mergeForm.flrule" label="2">同方向分录合并</el-radio></el-row>
            <el-row><el-checkbox style="margin-left: 25px;" v-model="bankSub">银行科目不合并</el-checkbox></el-row>
            <el-row><el-radio v-model="mergeForm.flrule" label="3">分录不合并</el-radio></el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="摘要生成规则：" class="mergeSet">
            <h4>按所选规则生成摘要</h4>
            <el-tooltip style="position: absolute;margin:-25px 0 0 130px" effect="light" placement="right-start">
              <div slot="content">
                根据系统默认值，生成摘要“
                <span style="color: #FFA300">向{往来单位}大账房演示公司{采购}采购{扫描<br/>仪}扫描仪{发票号}发票号8778987</span>
                ”，可根据业务需要进行勾选或自定义
              </div>
              <el-image :src=srcList[0]></el-image>
            </el-tooltip>
            <el-row>
              <el-checkbox v-model="createRule.selectQjZy">入账期间</el-checkbox>
              <el-checkbox v-model="createRule.selectWlZy">往来单位</el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox v-model="createRule.selectLxZy">发票类型</el-checkbox>
              <el-checkbox v-model="createRule.selectXmZy">开票项目</el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox v-model="createRule.selectHmZy">发票号码</el-checkbox>
              <el-checkbox v-model="createRule.selectZdyZy">自定义摘要</el-checkbox>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row v-if="createRule.selectZdyZy">
          <el-input type="textarea" :rows="2" v-model="zyContent">
          </el-input>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button @click="dialogMerge = false">取 消</el-button>
        <el-button type="primary" @click="saveMerge">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="批量处理" :visible.sync="dialogBatch" width="400px"
               :close-on-click-modal="false"
               @close="dialogBatch = false">
      <el-form ref="ruleForm"
               @submit.native.prevent
               label-width="100px"
               :inline="true">
        <el-form-item label="存货名称:" size="mini">
          <el-select
            v-model="batchForm.pk_inventory"
            :clearable = "true"
            allow-create
            default-first-option
            filterable
            @change="goodsNameChange"
            style="width: 200px">
            <el-option
              v-for="item in batchGoodsOption"
              :key="item.id"
              :value="item.id"
              :label="item.spec !== undefined ? item.name + ' (' + item.spec + ') ' + item.unit : item.name + ' ' + item.unit">
              <span style="float: left;width:300px;">{{item.spec !== undefined ? item.code + '_' + item.name + '(' + item.spec + ')' : item.code + '_' + item.name}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计算模式:" size="mini">
          <el-select
            v-model="batchForm.calcmode"
            style="width: 200px">
            <el-option
              v-for="item in countData"
              :key="item.label"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换算关系:" size="mini">
          <el-input v-model="batchForm.hsl" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="类别(科目):" v-if="!isFzmx" size="mini">
          <el-select
            v-model="batchForm.kmclassify"
            :disabled="isdisable"
            @change="kmclassChange"
            :clearable = "true"
            style="width: 200px">
            <el-option
              v-for="item in kmclassdata"
              :key="item.id"
              :value="item.id"
              :label="item.codefullname">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售(科目):" v-if="!isFzmx" size="mini">
          <el-select
            v-model="batchForm.chukukmid"
            :disabled="isdisable"
            @change="chukukmChange"
            :clearable = "true"
            style="width: 200px">
            <el-option
              v-for="item in chukukmdata"
              :key="item.id"
              :value="item.id"
              :label="item.codefullname">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button @click="dialogBatch = false">取 消</el-button>
        <el-button type="primary" @click="saveBatchForm">确 定</el-button>
      </div>
    </el-dialog>
    <BusinessType v-if="isShowBusinessType" :busiTypeList="busiTypeList" @getBusiTypeData="getBusiTypeData"></BusinessType>
    <lookImage v-if="isShowImage" :url="url" @closeImg="closeImg"></lookImage>
    <InventoryFile v-if="isShowInventory" :isShowKm="isShowKm" @InventoryRow="InventoryRow"></InventoryFile>
    <UploaderDialog :visible.sync="dialogImpFormVisible"  name="file" :title="dialogImpFormTitle"  @submit="onUpload" :param="uploadParam" >
      <template #description>
        <div  class="import-description" style="color: #999"> 支持标准模板导入,没有导入模板 <a href="javascript:void(0)" @click="expExcel()">点击下载</a></div>
        <div  class="import-description" style="margin:2px 0">支持增值税发票选择确认平台、中兴通、发票查验客户端系统</div>
        <div  class="import-description">导出的文件直接导入</div>
      </template>
    </UploaderDialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import UploaderDialog from '@/components/UploaderDialog'
import { getMonthBegin, getMonthEnd } from '@/utils'
import BusinessType from '../components/BusinessType'
import * as MsgUtil from '../msg-util'
import lookImage from '../components/lookImage'
import InventoryFile from '../components/InventoryFile'
import datePickerMixin from '@/mixins/date-picker'
const billInfo = {
  bspmc: '',
  pk_billcategory: '',
  billcategoryname: '',
  gg: '',
  jldw: '',
  bsl: '',
  id: ''
}
const headInfo = {
  iszh: 'Y',
  fpdm: '',
  fphm: '',
  skprj: '',
  srzrj: null,
  ghfmc: '',
  ghfsbh: '',
  ghfdzdh: '',
  ghfyhzh: '',
  pk_category_keyword: '',
  pk_basecategory: '',
  busitypetempid: '',
  busitempname: '',
  busisztypecode: '',
  inqj: '',
  sxhfmc: '',
  xhfsbh: '',
  xhfdzdh: '',
  xhfyhzh: '',
  demo: '',
  shjje: 0,
  se: 0,
  totalmny: 0
}
export default {
  name: 'incomeBill_old',
  mixins: [datePickerMixin],
  components: {
    Pagination,
    BusinessType,
    lookImage,
    InventoryFile,
    UploaderDialog
  },
  data () {
    return {
      isShowBusinessType: false,
      dialogToPick: false,
      dialogBill: false,
      dialogDateTidy: false,
      dialogMatchStock: false,
      dialogMerge: false,
      loading: false,
      dialogImpFormVisible: false,
      dialogBatch: false,
      isShowyppch: true,
      isZzdl: false,
      isFzmx: true,
      isShowImage: false,
      isShowInventory: false,
      isShowKm: false,
      isKc: false,
      isOnce: false,
      isZeroAndOnce: false,
      isTwice: false,
      isShowZzForm: false,
      isShowYbr: false,
      isRzSet: false,
      visiblePopover: false,
      url: '',
      dateTime: '',
      dialogImpFormTitle: '导入发票清单',
      stockRzDate: '',
      jsfs: '01',
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      tableList: [],
      matStockList: [],
      matStockHeight: 400,
      tableHeight: 0,
      total: 0,
      page: 1,
      rows: 100,
      idxCount: 8,
      currentRow: '',
      tableSelection: '',
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      QueryRadio: 'serPer',
      rzdate: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      kpdate: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      rdate: this.$store.getters.getLoginDate.substring(0, 7),
      ioperatetype: '',
      billNature: '',
      proof: '',
      billNumber: '',
      billCode: '',
      dialogDrawerDate: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      toPickForm: {
        ccrecode: '',
        period: this.$store.getters.getLoginDate.substring(0, 7),
        f2: ''
      },
      tidyForm: {
        ruzper: this.$store.getters.getLoginDate.substring(0, 7),
        rezper: this.$store.getters.getLoginDate.substring(0, 7),
        rows: []
      },
      mergeForm: {
        pzrule: '2',
        flrule: '2',
        bk: '',
        zy: '',
        setid: ''
      },
      createRule: {
        selectQjZy: false,
        selectWlZy: false,
        selectLxZy: false,
        selectXmZy: false,
        selectHmZy: false,
        selectZdyZy: false
      },
      adddoc: {
        header: {...headInfo},
        body: [{...billInfo}, {...billInfo}, {...billInfo}, {...billInfo}]
      },
      rules: {
        // fpdm: [{required: true, message: '发票代码为必输项', trigger: 'blur'}],
        // fphm: [{required: true, message: '发票号码为必输项', trigger: 'blur'}]
        // skprj: [{type: 'date', required: true, message: '开票日期为必输项', trigger: 'blur'}]
      },
      isEidt: false,
      isAdd: false,
      trunDX: '',
      selectList: '',
      bankSub: false,
      zyContent: '',
      isEnterCheck: true,
      isRzCheck: false,
      businessOption: [],
      bspmcOption: [],
      subData: [],
      chData: [],
      countData: [
        {label: '别名单位*换算关系=原单位', value: '0'},
        {label: '别名单位/换算关系=原单位', value: '1'}
      ],
      subjectRef: this.$store.getters.subSubjectRef,
      subjectRefAll: [],
      addedbill: '',
      addedbillOptions: [
        {value: 'Y', label: '增值税专用发票'},
        {value: 'N', label: '增值税普通发票'}
      ],
      busiTypeList: [],
      time: '',
      stockSelectedRow: '',
      stockCurrentRow: '',
      batchGoodsOption: [],
      batchForm: {
        name: '',
        kmmc_invcl: '',
        kmmc_sale: '',
        pk_inventory: '',
        calcmode: '0',
        hsl: '1.00',
        kmclassify: '',
        chukukmid: ''
      },
      isdisable: false,
      kmRefData: this.$store.state.accounting.subjectRefData,
      kmclassdata: [],
      chukukmdata: [],
      zje: '',
      zse: '',
      zjshj: '',
      showRkd: true,
      showDid: true,
      isShowCrkNo: false
    }
  },
  computed: {
    uploadParam () {
      return {
        pk_corp: this.$store.getters.getLoginCorpId,
        sourcename: '进项发票(旧)'
      }
    }
  },
  methods: {
    lookImg: function (src) {
      this.url = src
      this.isShowImage = true
    },
    closeImg: function (val) {
      this.isShowImage = val
    },
    jupeComebill: function (row) {
      if (!this.showDid) {
        let ids = row.tzpzid
        this.$api.Voucher.checkInventoryExist({ids}).then(res => {
          if (res.success) {
            this.$api.Voucher.printInventory({ids})
          }
        })
      } else {
        let routeParam = {routeParam: {id: row.id_ictrade_h, source: 'HP95'}}
        this.$router.push({name: 'icbill-purchin', params: routeParam})
      }
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    InventoryRow: function (param) {
      if (param.dataRow !== undefined) {
        let fullname = param.dataRow.name !== undefined ? param.dataRow.name : param.dataRow.spmc
        fullname += param.dataRow.unit !== undefined ? ' ' + param.dataRow.unit : ''
        this.stockCurrentRow.name = fullname
        this.$set(this.stockCurrentRow, 'pk_inventory', param.dataRow.id)
        this.stockCurrentRow.kmclassify = param.dataRow.kmclassify
        this.stockCurrentRow.chukukmid = param.dataRow.chukukmid
        if (!this.isZzdl) {
          this.stockCurrentRow.pk_subj = param.dataRow.kmid
          this.stockCurrentRow.chid = param.dataRow.id
        }
      }
      this.isShowInventory = param.isShowsFile
    },
    selectDate: function (val) {
      this.QueryRadio = val
    },
    confirm: function () {
      this.loadTableList()
      this.getDateToReturn()
    },
    toPickSelChange: function (val) {
      this.toPickForm.serType = val
    },
    onUpload (formData) {
      if (!formData) {
        MsgUtil.errorMsg(this, '请先选择导入文件!')
        return
      }
      const loading = MsgUtil.loading(this, '正在导入...')
      this.$api.oldInComeBill.impExcel(formData).then(result => {
        loading.close()
        if (result.success) {
          MsgUtil.successMsg(this, result.msg)
          this.dialogImpFormVisible = false
          this.kpdate = result.head !== undefined ? [result.head.beginrq, result.head.endrq] : this.kpdate
          this.QueryRadio = result.head !== undefined ? 'serDay1' : this.QueryRadio
          this.getDateToReturn()
          this.loadTableList()
        } else {
          if (result.msg === '') {
            MsgUtil.errorMsg(this, '导入失败!')
          } else {
            MsgUtil.errorMsg(this, result.msg)
          }
        }
      }).catch(e => {
        loading.close()
      })
    },
    expExcel () {
      this.$api.oldInComeBill.exportExcelData('进项发票(旧)', {})
    },
    clearCondition: function () {
      this.QueryRadio = 'serPer'
      this.rzdate = [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)]
      this.kpdate = [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)]
      this.rdate = this.$store.getters.getLoginDate.substring(0, 7)
      this.billNature = ''
      this.proof = ''
      this.billNumber = ''
      this.billCode = ''
    },
    clearPose: function () {
      let retParam = {
        visiblePopover: false
      }
      this.$bus.$emit('date', retParam)
    },
    addData: function () {
      this.$nextTick(() => {
        this.adddoc.header.iszh = this.$store.getters.getLoginCorp.chname === '一般纳税人' ? 'Y' : 'N'
        this.getGoodsInfo()
        this.$api.oldInComeBill.queryCorpReference({id: this.$store.getters.getLoginCorpId}).then(result => {
          if (result.success && result.rows !== undefined && result.rows.length > 0) {
            this.adddoc.header.ghfmc = result.rows[0].uname !== undefined ? result.rows[0].uname : ''
            this.adddoc.header.ghfsbh = result.rows[0].ccrecode !== undefined ? result.rows[0].ccrecode : ''
            this.adddoc.header.ghfdzdh = result.rows[0].addressphone !== undefined ? result.rows[0].addressphone : ''
            let bankNameAndNo = result.rows[0].nkname !== undefined ? result.rows[0].nkname + ' ' : ''
            bankNameAndNo += result.rows[0].nkcode !== undefined ? result.rows[0].nkcode : ''
            this.adddoc.header.ghfyhzh = bankNameAndNo
          }
        })
      })
      this.dialogBill = true
      this.isRzSet = false
    },
    // 新增中值计算
    inpValueChange: function (row) {
      const bnum = parseFloat(row.bnum) > 0 ? parseFloat(row.bnum) : '0'
      const bdj = parseFloat(row.bdj) > 0 ? parseFloat(row.bdj) : '0'
      if (bnum === '0' || bdj === '0') {
        row.bnum = bnum
        row.bdj = bdj
        return
      }
      row.bje = bnum * bdj
      this.countTotalSum()
    },
    JeChange: function (row) {
      const bnum = parseFloat(row.bnum) > 0 ? parseFloat(row.bnum) : '0'
      const bje = parseFloat(row.bje) > 0 ? parseFloat(row.bje) : '0'
      const bsl = row.bsl !== '' ? parseFloat(row.bsl) : '0'
      if (bje !== '0' && bnum !== '0') {
        row.bdj = bje / bnum
      }
      if (bsl !== '0') {
        row.bse = bje * bsl / 100
      }
      this.countTotalSum()
    },
    SlChange: function (row) {
      const bje = parseFloat(row.bje) > 0 ? parseFloat(row.bje) : '0'
      const bsl = row.bsl !== '' ? parseFloat(row.bsl) : '0'
      row.bse = bje * bsl / 100
      this.countTotalSum()
    },
    countTotalSum: function () {
      this.adddoc.header.shjje = 0
      this.adddoc.header.se = 0
      this.adddoc.body.forEach(item => {
        this.adddoc.header.shjje += parseFloat(item.bje !== undefined ? item.bje : 0)
        this.adddoc.header.se += parseFloat(item.bse !== undefined ? item.bse : 0)
      })
      this.adddoc.header.totalmny = parseFloat(this.adddoc.header.shjje) + parseFloat(this.adddoc.header.se)
      this.trunDX = this.adddoc.header.totalmny > 0 ? this.trunDx(this.adddoc.header.totalmny) : ''
    },
    editRow: function () {
      if (this.IsSelectCurrentRow()) {
        if (this.tableSelection.length > 1) {
          MsgUtil.warnMsg(this, '不支持批量修改，请选中一行进行修改！')
          return
        }
        if (this.tableSelection[0].sourcetype === 15) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
          return
        }
        if (this.currentRow.pzh !== undefined && this.currentRow.pzh !== '') {
          MsgUtil.warnMsg(this, '单据已生成凭证，不可修改！')
          return
        }
        const loading = MsgUtil.loading(this)
        this.isAdd = true
        this.getGoodsInfo()
        this.$api.oldInComeBill.queryInfoByID({id: this.tableSelection[0].id}).then(result => {
          loading.close()
          if (result.success) {
            this.dialogBill = true
            this.adddoc.body = result.data.children
            this.adddoc.header = result.data
            this.adddoc.header.iszh = result.data.iszh === '是' ? 'Y' : 'N'
            delete this.adddoc.header.children
            this.trunDX = this.trunDx(result.data.totalmny)
          }
        }).catch(e => {
          loading.close()
        })
      }
    },
    preview: function (row) {
      const loading = MsgUtil.loading(this)
      this.getGoodsInfo()
      this.$api.oldInComeBill.queryInfoByID({id: row.id}).then(result => {
        loading.close()
        if (result.success) {
          this.$nextTick(() => {
            this.dialogBill = true
            this.isEidt = true
            this.isAdd = true
            this.adddoc.body = result.data.children
            this.adddoc.header = result.data
            this.adddoc.header.iszh = result.data.iszh === '是' ? 'Y' : 'N'
            delete this.adddoc.header.children
            this.trunDX = this.trunDx(result.data.totalmny)
          })
        }
      }).catch(e => {
        loading.close()
      })
    },
    deleteRows: function () {
      if (this.IsSelectCurrentRow()) {
        if (this.znsbMsg()) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
          return
        }
        this.$confirm('你确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.oldInComeBill.onDelete({head: JSON.stringify(this.tableSelection)}).then(result => {
            this.successMsg(result)
            if (result.success) {
              this.loadTableList()
            }
          })
        })
      }
    },
    impExcel: function () {
      this.dialogImpFormTitle = '导入发票清单'
      this.dialogImpFormVisible = true
    },
    // 入账设置
    enterSetting: function () {
      if (this.IsSelectCurrentRow()) {
        if (this.znsbMsg()) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
          return
        }
        if (this.tableSelection[0].pzh !== undefined && this.tableSelection[0].pzh !== '') {
          MsgUtil.warnMsg(this, '所选票据已存在后续单据！')
          return
        }
        this.isRzSet = true
        this.selectBusiTypeInfo(this.tableSelection[0].inqj)
      }
    },
    // 获取业务类型信息
    getBusinessType: function (param) {
      this.$api.oldInComeBill.queryCategoryRef({period: param}).then(result => {
        if (result.success) {
          this.businessOption = result.rows
        }
      })
    },
    DateTidy: function () {
      if (this.IsSelectCurrentRow()) {
        if (this.znsbMsg()) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
          return
        }
        if (this.tableSelection[0].pzh !== undefined && this.tableSelection[0].pzh !== '') {
          MsgUtil.warnMsg(this, '所选票据已存在后续单据！')
          return
        }
        this.dialogDateTidy = true
        this.tidyForm.rezper = this.currentRow.srzrj.substring(0, 7)
        this.tidyForm.ruzper = this.currentRow.inqj
        this.dialogDateTidy = true
      }
    },
    // 期间调整
    saveDateTidy: function () {
      let param = {
        rows: JSON.stringify(this.tableSelection),
        ruzper: this.isEnterCheck ? this.tidyForm.ruzper : '',
        rezper: this.isRzCheck ? this.tidyForm.rezper : ''
      }
      const loading = MsgUtil.loading(this)
      this.$api.oldInComeBill.setBusPeriod(param).then(result => {
        loading.close()
        if (result.success) {
          this.dialogDateTidy = false
          this.loadTableList()
        }
      }).catch(e => {
        loading.close()
      })
    },
    // 无匹配存货时，掉生成凭证接口
    queryCreate: function () {
      this.$confirm('你确定要生成凭证吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        let param = {
          head: JSON.stringify(this.tableSelection),
          goods: '',
          lwstr: ''
        }
        const loading = MsgUtil.loading(this)
        this.$api.oldInComeBill.combinePZ(param).then(result => {
          loading.close()
          this.successMsg(result)
          if (result.success) {
            this.loadTableList()
          }
        }).catch(e => {
          loading.close()
        })
      })
    },
    // 生成入库
    createIncome: function () {
      const loading = MsgUtil.loading(this)
      this.$api.oldInComeBill.createIC({head: JSON.stringify(this.tableSelection)}).then(result => {
        loading.close()
        this.successMsg(result)
        if (result.success) {
          this.loadTableList()
        }
      }).catch(e => {
        loading.close()
      })
    },
    // 存货
    createProof: function () {
      if (this.IsSelectCurrentRow()) {
        if (this.znsbMsg()) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
          return
        }
        const loginCorp = this.$store.getters.getLoginCorp
        if (loginCorp.buildic === '0') {
          this.queryCreate()
        } else if (loginCorp.buildic === '1' && loginCorp.buildicstyle === 1) {
          const loading = MsgUtil.loading(this)
          this.$api.oldInComeBill.getGoodsInvenRela({head: JSON.stringify(this.tableSelection)}).then(result => {
            loading.close()
            if (result.success && result.rows !== undefined && result.rows.length > 0) {
              this.dialogMatchStock = true
              this.getSubAndStockInfo()
              result.rows.forEach(item => {
                item.calcmode = item.calcmode.toString()
              })
              this.matStockList = result.rows
            } else {
              this.queryCreate()
            }
          }).catch(e => {
            loading.close()
          })
        } else if (loginCorp.buildic === '2') {
          this.$api.oldInComeBill.cbhsTypeQuery({}).then(result => {
            if (result.success) {
              if (result.rows.chcbjzfs === -1) {
                MsgUtil.warnMsg(this, '启用总账核算存货，请先设置存货成本核算方式！')
              } else if (result.rows.chcbjzfs === 0 || result.rows.chcbjzfs === 1) {
                this.matchData(1, result.rows.chcbjzfs)
                this.getInventoryInfo(result.rows.chcbjzfs)
              } else if (result.rows.chcbjzfs === 2) {
                let param = {
                  sourcename: '进项发票',
                  head: JSON.stringify(this.tableSelection),
                  jsfs: this.jsfs,
                  inPeriod: this.rdate,
                  goods: ''
                }
                const loading = MsgUtil.loading(this)
                this.$api.oldInComeBill.createPZData(param).then(result1 => {
                  loading.close()
                  this.successMsg(result1)
                  if (result.success) {
                    this.loadTableList()
                  }
                }).catch(e => {
                  loading.close()
                })
              }
            } else {
              this.successMsg(result)
            }
          })
        }
      }
    },
    // 总账辅助明显和总账大类
    matchData: function (val, chcbjzfs) {
      const loading = MsgUtil.loading(this)
      this.$api.oldInComeBill.matchInventoryData({head: JSON.stringify(this.tableSelection), ishow: this.isShowyppch ? 'Y' : 'N'}).then(result => {
        loading.close()
        if (result.success) {
          if (result.rows !== undefined && result.rows.length > 0) {
            this.$nextTick(() => {
              if (val === 1) {
                this.dialogMatchStock = true
                this.isZzdl = true
                this.isFzmx = chcbjzfs !== 1
                this.stockRzDate = this.currentRow.inqj
                this.kmclassifydata()
                this.chukukmiddata()
                this.getSubAndStockInfo()
              }
              result.rows.forEach(item => {
                item.calcmode = item.calcmode.toString()
              })
              this.getSubAndStockInfo()
              this.matStockList = result.rows
            })
          } else {
            this.queryCreate()
          }
        } else {
          this.successMsg(result)
        }
      }).catch(e => {
        loading.close()
      })
    },
    getInventoryInfo: function (val) {
      if (val === 1) {
        this.isShowKm = true
      } else {
        this.isShowKm = false
      }
    },
    switchChange: function () {
      this.$nextTick(() => {
        this.$api.oldInComeBill.matchInventoryData({head: JSON.stringify(this.tableSelection), ishow: this.isShowyppch ? 'Y' : 'N'}).then(result => {
          if (result.success && result.rows.length > 0) {
            result.rows.forEach(item => {
              item.calcmode = item.calcmode.toString()
            })
            this.matStockList = result.rows
          }
        })
      })
    },
    // 批操作
    batchOperation: function () {
      if (this.stockSelectedRow === '' || this.stockSelectedRow.length < 1) {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return
      }
      this.dialogBatch = true
      this.isdisable = false
      this.batchForm.chukukmid = ''
      this.batchForm.kmclassify = ''
      this.batchForm.pk_inventory = ''
      this.batchForm.hsl = this.idxCount > 2 ? '1.00000000' : '1.00'
    },
    // 批处理存货名称change
    goodsNameChange: function (val) {
      if (val !== '') {
        let item = this.batchGoodsOption.find(p => p.id === val)
        if (item !== '' && item !== undefined) {
          this.isdisable = true
          this.batchForm.chukukmid = item.chukukmid
          this.batchForm.kmclassify = item.kmclassify
          this.batchForm.name = item.name
          this.batchForm.kmmc_invcl = (this.kmclassdata.find(p => p.id === item.kmclassify)).kmmc
          this.batchForm.kmmc_sale = (this.chukukmdata.find(p => p.id === item.chukukmid)).kmmc
        } else {
          this.batchForm.name = val
        }
      } else {
        this.batchForm.chukukmid = ''
        this.batchForm.kmclassify = ''
        this.batchForm.name = ''
        this.isdisable = false
      }
    },
    kmclassChange: function (id) { // 批处理选择类别科目
      this.batchForm.kmmc_invcl = this.kmclassdata.find(p => p.id === id).kmmc
    },
    chukukmChange: function (id) { // 批处理选择销售科目
      this.batchForm.kmmc_sale = this.chukukmdata.find(p => p.id === id).kmmc
    },
    invNameChange: function (val) { // table选择存货名称
      this.batchGoodsOption.forEach(item => {
        if (item.id === val) {
          this.stockCurrentRow.name = item.fullName
          this.stockCurrentRow.kmclassify = item.kmclassify
          this.stockCurrentRow.chukukmid = item.chukukmid
          if (!this.isZzdl) {
            this.stockCurrentRow.pk_subj = item.pk_accsubj
            // this.stockCurrentRow.chid = item.id
          }
        }
      })
    },
    tableLbKmChange: function (val) { // table选择类别科目
      this.stockCurrentRow.kmmc_invcl = this.kmclassdata.find(p => p.id === val).kmmc
    },
    tableXsKmChange: function (val) { // table选择销售科目
      this.stockCurrentRow.kmmc_sale = this.chukukmdata.find(p => p.id === val).kmmc
    },
    // 批操作确定
    saveBatchForm: function () {
      let row = this.stockSelectedRow.find(p => p.isAdd !== '是')
      if (row !== undefined && row !== '' && this.batchForm.pk_inventory === '') {
        MsgUtil.warnMsg(this, '已匹配存货，请在【存货档案】节点处理！')
        return
      }
      this.stockSelectedRow.forEach(item => {
        item.chukukmid = this.batchForm.chukukmid
        item.kmclassify = this.batchForm.kmclassify
        this.$set(item, 'name', item.unit !== undefined ? this.batchForm.name + ' ' + item.unit : this.batchForm.name)
        item.kmmc_invcl = this.batchForm.kmmc_invcl
        item.kmmc_sale = this.batchForm.kmmc_sale
        item.calcmode = this.batchForm.calcmode
        item.hsl = parseInt(this.batchForm.hsl)
        this.$set(item, 'pk_inventory', this.batchForm.pk_inventory)
      })
      this.dialogBatch = false
    },
    // 匹配
    savaInventory: function () {
      if (this.stockSelectedRow === '' || this.stockSelectedRow.length < 1) {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return
      }
      const loading = MsgUtil.loading(this)
      this.$api.oldInComeBill.saveInventoryData({goods: JSON.stringify(this.stockSelectedRow)}).then(result => {
        loading.close()
        if (result.success) {
          this.matchData()
          this.successMsg(result)
        } else {
          this.successMsg(result)
        }
      }).catch(e => {
        loading.close()
      })
    },
    // 获取科目类别
    kmclassifydata () {
      this.kmRefData = this.$store.state.accounting.subjectRefData
      this.$api.GeneralInventoryApi.InventoryDoc.getKmclassify().then(result => {
        if (result.success) {
          this.$nextTick(() => {
            this.kmclassdata = this.kmRefData.filter(item => result.rows.includes(item.kmbm))
          })
        }
      }).catch(e => {
      })
      return null
    },
    // 获取销售科目
    async chukukmiddata () {
      this.kmRefData = this.$store.state.accounting.subjectRefData
      this.$nextTick(() => {
        this.$api.GeneralInventoryApi.InventoryDoc.getChukuKm().then(result => {
          if (result.success) {
            this.chukukmdata = this.kmRefData.filter(item => result.rows.includes(item.kmbm))
          }
        }).catch(e => {
        })
      })
      return null
    },
    // 确认入库匹配存货->生成凭证
    queryMatStock: function (val) {
      const loading = MsgUtil.loading(this)
      if (val === 1) {
        let param = {
          sourcename: '进项发票',
          head: JSON.stringify(this.tableSelection),
          jsfs: this.jsfs,
          inPeriod: this.stockRzDate,
          goods: JSON.stringify(this.matStockList)
        }
        this.$nextTick(() => {
          this.$api.oldInComeBill.createPZData(param).then(result => {
            loading.close()
            this.successMsg(result)
            if (result.success) {
              this.dialogMatchStock = false
              this.loadTableList()
            }
          }).catch(e => {
            loading.close()
          })
        })
      } else {
        let param = {
          head: JSON.stringify(this.tableSelection),
          goods: JSON.stringify(this.matStockList),
          lwstr: ''
        }
        this.$api.oldInComeBill.combinePZ(param).then(result => {
          loading.close()
          this.successMsg(result)
          this.dialogMatchStock = false
          if (result.success) {
            this.loadTableList()
          }
        }).catch(e => {
          loading.close()
        })
      }
    },
    // 合并规则保存
    saveMerge: function () {
      this.mergeForm.zy = ''
      this.mergeForm.bk = this.bankSub ? 'Y' : ''
      for (let item in this.createRule) {
        if (this.createRule[item]) {
          if (item === 'selectZdyZy') {
            this.mergeForm.zy += item + ':' + this.zyContent + '$'
          } else {
            this.mergeForm.zy += item + '$'
          }
        } else {
          this.mergeForm.zy += '$'
        }
      }
      this.$api.oldInComeBill.combineRule(this.mergeForm).then(result => {
        this.successMsg(result)
        if (result.success) {
          this.dialogMerge = false
        }
      })
    },
    handleCommand: function (command) {
      if (command === 'rule') {
        this.dialogMerge = true
        this.$api.oldInComeBill.queryRule({}).then(result => {
          if (result.success) {
            if (result.rows !== undefined) {
              this.mergeForm.pzrq = result.rows.pzrq.toString()
              this.bankSub = result.rows.isbank !== undefined
              this.mergeForm.pzrule = result.rows.value.toString()
              this.mergeForm.flrule = result.rows.entry_type.toString()
              this.mergeForm.setid = result.rows.setid
              let list = result.rows.zy.split('$')
              this.createRule.selectQjZy = list[0] !== ''
              this.createRule.selectWlZy = list[1] !== ''
              this.createRule.selectLxZy = list[2] !== ''
              this.createRule.selectXmZy = list[3] !== ''
              this.createRule.selectHmZy = list[4] !== ''
              this.createRule.selectZdyZy = list[5] !== '' ? list[5].split(':')[0] !== '' : false
              this.zyContent = list[5] !== '' ? list[5].split(':')[1] : ''
            } else {
              this.createRule.selectWlZy = true
              this.createRule.selectLxZy = true
              this.createRule.selectXmZy = true
            }
          }
        })
      } else {
        if (this.IsSelectCurrentRow()) {
          this.$api.oldInComeBill.exportExcelData('进项发票(旧)', {daterows: JSON.stringify(this.tableSelection)}).then(result => {
            if (result.success) {
              this.successMsg(result)
            }
          })
        }
      }
    },
    // 新增保存
    saveAndBillForm: function (formName, val) {
      if (this.adddoc.header.fpdm === '') {
        MsgUtil.warnMsg(this, '发票代码不能为空')
        return
      }
      if (this.adddoc.header.fphm === '') {
        MsgUtil.warnMsg(this, '发票号码不能为空')
        return
      }
      if (this.adddoc.header.skprj === '') {
        MsgUtil.warnMsg(this, '开票日期不能为空')
        return
      }
      let isEmpty = true
      // let isEquality = true
      this.adddoc.body.forEach(item => {
        if ((item.bspmc !== undefined && item.bspmc !== '') || (item.pk_billcategory !== undefined && item.pk_billcategory !== '')) {
          isEmpty = false
          // if (this.adddoc.header.busitypetempid !== item.pk_billcategory) {
          //   isEquality = false
          // }
          // if (item.pk_billcategory === '') {
          //   item.pk_billcategory = this.businessOption[0].id
          //   item.billcategoryname = this.businessOption[0].categoryname
          // }
        }
      })
      if (isEmpty) {
        MsgUtil.warnMsg(this, '表体至少录入一条数据')
        return
      }
      // if (!isEquality) {
      //   // MsgUtil.warnMsg(this, '第' + idx + '行,金额、税额不能为空,请检查')
      //   MsgUtil.warnMsg(this, '明细行业务类型与发票业务类型均不一致，请修改')
      //   return
      // }
      this.querySaveBillForm(formName, val)
    },
    querySaveBillForm: function (formName, val) {
      const loading = MsgUtil.loading(this)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            header: JSON.stringify(this.adddoc.header),
            body: JSON.stringify(this.adddoc.body)
          }
          this.$api.oldInComeBill.saveOrUpdate(param).then(result => {
            loading.close()
            this.successMsg(result)
            if (result.success) {
              if (val !== 1) { this.dialogBill = false }
              this.clearForm()
              this.loadTableList()
            }
          }).catch(e => {
            loading.close()
          })
        }
      })
    },
    openBusinessType: function () {
      let period = this.isAdd ? this.tableSelection[0].inqj : this.$store.getters.getLoginDate.substring(0, 7)
      this.selectBusiTypeInfo(period)
    },
    selectBusiTypeInfo: function (period) {
      let loading = MsgUtil.loading(this)
      this.$api.oldInComeBill.getBusiType().then(result => {
        loading.close()
        if (result.success) {
          this.isShowBusinessType = true
          if (result.rows !== undefined && result.rows.length > 0) { // this.isAdd &&
            result.rows.forEach(item => {
              item['isold'] = true
              item['radio'] = item.selectvalue === '02' ? '1' : item.selectvalue === '04' ? '2' : '0'
            })
          } else {
            result.rows['isold'] = true
          }
          this.busiTypeList = result.rows
        }
      }).catch(e => {
        loading.close()
      })
    },
    getBusiTypeData: function (data) {
      if (data.CurrentBusiType !== undefined && data.CurrentBusiType !== '') {
        if (!this.isRzSet) {
          this.adddoc.header.busisztypecode = data.CurrentBusiType.radio === '0' ? '06' : data.CurrentBusiType.radio === '1' ? '02' : '04'
          this.adddoc.header.busitypetempid = ''
          this.adddoc.header.busitempname = data.CurrentBusiType.businame
        } else {
          this.setBusiTypeData(data)
        }
      }
      this.isShowBusinessType = data.isShowBusiType
    },
    setBusiTypeData: function (data) {
      let param = {
        rows: JSON.stringify(this.tableSelection),
        busiid: data.CurrentBusiType.id,
        businame: data.CurrentBusiType.businame,
        selvalue: data.CurrentBusiType.radio === '0' ? '06' : data.CurrentBusiType.radio === '1' ? '02' : '04'
      }
      this.$api.oldInComeBill.setBusiType(param).then(result => {
        if (result.success) {
          this.successMsg(result)
          this.tableSelection.forEach(row => {
            row.busitempname = data.CurrentBusiType.businame
            row.busitypetempid = data.CurrentBusiType.id
          })
        } else {
          MsgUtil.warnMsg(this, result.msg)
        }
      })
    },
    goodChange: function (row) {
      this.bspmcOption.forEach(item => {
        if (item.id === row.bspmc) {
          row.gg = item.spec
          row.bspmc = item.name
          row.jldw = item.unit
          row.pk_billcategory = this.adddoc.header.busitypetempid !== '' ? this.adddoc.header.busitypetempid : row.pk_billcategory
        }
      })
    },
    typeChanges: function (row) {
      this.businessOption.forEach(item => {
        if (item.id === row.pk_billcategory) {
          row.billcategoryname = item.categoryname
        }
      })
    },
    colseBill: function () {
      this.dialogBill = false
      this.clearForm()
    },
    openToPick: function () {
      this.dialogToPick = true
      this.$api.oldInComeBill.chooseTicketWay({}).then(result => {
        if (result.success) {
          this.toPickForm.ccrecode = result.head.ccrecode !== undefined ? result.head.ccrecode : ''
          this.toPickForm.f2 = result.head.f2 !== undefined ? result.head.f2 : ''
        }
      })
    },
    znsbMsg: function () {
      let isZnsb = false
      this.tableSelection.forEach(item => {
        if (item.sourcetype === 15) {
          isZnsb = true
        }
      })
      return isZnsb
    },
    clearForm: function () {
      this.adddoc.header = {...headInfo}
      this.adddoc.body = []
      this.adddoc.body.push({...billInfo}, {...billInfo}, {...billInfo}, {...billInfo})
      this.isEidt = false
      this.isAdd = false
    },
    // 一键取票查询
    saveForm: function () {
      this.toPickForm['begindate3'] = this.dialogDrawerDate[0]
      this.toPickForm['enddate3'] = this.dialogDrawerDate[1]
      const loading = MsgUtil.loading(this)
      this.$api.oldInComeBill.queryOnTicket(this.toPickForm).then(result => {
        loading.close()
        this.successMsg(result)
        if (result.success) {
          this.dialogToPick = false
          this.loadTableList()
        }
      }).catch(e => {
        loading.close()
      })
    },
    addGoods: function () {
      this.adddoc.body.push({...billInfo})
    },
    delGoods: function (index) {
      if (this.adddoc.body.length > 1) {
        this.adddoc.body.splice(index, 1)
      }
      this.countTotalSum()
    },
    // 获取选择商品行
    getSelectList: function (sel, row) {
      this.selectList = sel
    },
    pageData: function (param) {
      this.page = param.page
      this.rows = param.limit
      this.loadTableList()
    },
    tableCurrentChange: function (row) {
      this.currentRow = row
      this.$refs.jxfpTableRef.toggleRowSelection(row)
    },
    tableDbClick: function (row) {
      this.preview(row)
    },
    // 生成凭证 -> 入库匹配存货选中行
    matStockCurrentChange: function (row) {
      this.matStockList.forEach(item => {
        item.isShowSelect = false
      })
      row['isShowSelect'] = true
      if (row.pk_inventory === undefined && row.chid !== undefined) {
        row['pk_inventory'] = row.chid
      }
      this.stockCurrentRow = row
      this.$refs.matStockRef.toggleRowSelection(row)
    },
    matStockCheckChang: function (selection) {
      this.stockSelectedRow = selection
    },
    getSubAndStockInfo: function () {
      this.$api.oldInComeBill.queryBySpecialKM({}).then(result => {
        if (result.success) {
          this.subData = result.rows
        }
      })
      this.$api.oldInComeBill.queryB({id: '000001000000000000000006'}).then(result => {
        if (!result.success) {
          this.successMsg(result)
        }
        result.rows.forEach(item => {
          item['fullName'] = item.spec !== undefined ? item.name + ' (' + item.spec + ')' : item.name
          item['fullName'] += item.unit !== undefined ? ' ' + item.unit : ''
        })
        this.batchGoodsOption = result.rows
      })
    },
    handleCheckChang: function (selection) {
      this.tableSelection = selection
    },
    IsSelectCurrentRow: function () {
      if (this.tableSelection === '' || this.tableSelection.length === 0) {
        this.$message({
          showClose: true,
          message: '请先选择数据！',
          type: 'warning'
        })
        return false
      }
      return true
    },
    successMsg (data) {
      if (data.success) {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg,
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: data.msg,
          type: 'error'
        })
      }
    },
    getPattern: function () {
      const loginCorp = this.$store.getters.getLoginCorp
      this.isShowYbr = loginCorp.chname === '一般纳税人'
      if (loginCorp.buildic === '2' || (loginCorp.buildic === '1' && loginCorp.buildicstyle === 1)) {
        if (loginCorp.buildic === '2') {
          this.isShowZzForm = true
          this.isZeroAndOnce = false
          this.isOnce = false
          this.isTwice = true
          this.isKc = false
          this.$api.oldInComeBill.cbhsTypeQuery({}).then(result => {
            if (result.rows.chcbjzfs === 0 || result.rows.chcbjzfs === 1) {
              this.showDid = false
              this.isShowCrkNo = true
            } else {
              this.showRkd = false
              this.isShowCrkNo = false
            }
          })
        } else {
          this.isShowZzForm = false
          this.isZeroAndOnce = true
          this.isOnce = true
          this.isTwice = false
          this.showDid = true
          this.isShowCrkNo = true
          this.isZzdl = false
          this.isKc = true
          this.idxCount = 2
        }
      } else {
        this.isZeroAndOnce = true
        this.isOnce = false
        this.isTwice = false
        this.showRkd = false
        this.isShowCrkNo = false
      }
    },
    loadTableList: function () {
      let param = {
        page: this.page,
        rows: this.rows,
        sort: 'id',
        order: 'asc',
        serdate: this.QueryRadio,
        startYear2: this.rdate.substring(0, 4),
        startMonth2: this.rdate.substring(5),
        begindate: this.rzdate[0],
        enddate: this.rzdate[1],
        begindate2: this.kpdate[0],
        enddate2: this.kpdate[1],
        ioperatetype: this.ioperatetype,
        iszh: this.billNature,
        ispz: this.proof,
        fphm: this.billNumber,
        fpdm: this.billCode
      }
      this.loading = true
      this.$api.oldInComeBill.queryDataInfo(param).then(result => {
        this.loading = false
        if (result.success) {
          this.tableList = result.rows
          this.total = result.total
          this.zje = result.head.zje !== undefined ? this.$options.filters.forThousands(result.head.zje.toFixed(2)) : ''
          this.zse = result.head.zse !== undefined ? this.$options.filters.forThousands(result.head.zse.toFixed(2)) : ''
          this.zjshj = result.head.zjshj !== undefined ? this.$options.filters.forThousands(result.head.zjshj.toFixed(2)) : ''
        }
      }).catch(e => {
        this.loading = false
      })
    },
    // 货物或应税劳务参照
    getGoodsInfo: function () {
      let param = {
        id: '000001000000000000000006',
        isfenye: '',
        page: '',
        rows: '',
        kmid: '',
        type: '',
        pk_corp: ''
      }
      this.$api.oldInComeBill.queryB(param).then(result => {
        if (result.success) {
          this.bspmcOption = result.rows
        }
      })
    },
    getDateToReturn: function (val) {
      this.dateTime = ''
      if (this.QueryRadio === 'serDay') {
        this.dateTime = this.rzdate[0] + ' - ' + this.rzdate[1]
      } else if (this.QueryRadio === 'serDay1') {
        this.dateTime = this.kpdate[0] + ' - ' + this.kpdate[1]
      } else {
        this.dateTime = this.rdate + ' - ' + this.rdate
      }
      this.visiblePopover = false
    },
    formatter: function (row, column) {
      if (row.sourcetype === 0) {
        return '通用模板导入'
      } else if (row.sourcetype === 1) {
        return '手工录入'
      } else if (row.sourcetype === 2) {
        return '财税助手导入'
      } else if (row.sourcetype === 3) {
        return '中兴通导入'
      } else if (row.sourcetype === 5) {
        return '增值税发票选择确认平台导入'
      } else if (row.sourcetype === 8) {
        return '一键取票'
      } else if (row.sourcetype === 10) {
        return '财税助手导入'
      } else {
        return '智能识别'
      }
    },
    trunDx: function (n) {
      let unit = '千百拾亿千百拾万千百拾元角分'
      let str = ''
      n += '.00'
      const p = n.indexOf('.')
      if (p >= 0) {
        n = n.substring(0, p) + n.substr(p + 1, 2)
        unit = unit.substr(unit.length - n.length)
        for (let i = 0; i < n.length; i++) { str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i) }
        var concatM = str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
      }
      if (n > 0) {
        return concatM
      } else if (n < 0) {
        return '(负数)' + concatM
      } else {
        return '零' + concatM
      }
    },
    getKmInfo: function () {
      this.$api.oldInComeBill.queryByPkcorpAll({pk_corp: this.$store.getters.getLoginCorpId}).then(result => {
        if (result.success) {
          this.subjectRefAll = result.rows
        }
      })
    }
  },
  created () {
    this.tableHeight = window.innerHeight - 205
  },
  mounted () {
    if (this.$route.params.routerParam !== undefined) {
      this.QueryRadio = 'serPer'
      this.rdate = this.$route.params.routerParam.period
    }
    this.getDateToReturn()
    this.getPattern()
    this.loadTableList()
    this.getKmInfo()
  }
}
</script>

<style lang="less">
  .oldBill{
    .el-pagination__jump{
      margin-left: 0!important;
    }
    .el-link--inner{
      text-decoration: none;
    }
    .el-input-number.is-without-controls .el-input__inner {
      padding-left: 0;
      padding-right: 3px;
    }
    .el-dialog__body{
      padding: 13px 20px 0;
    }
    #billDialog .el-dialog__body{
      padding: 10px 10px 0;
      height: 450px;
      overflow-y: auto;
    }
    .table_formItem{
      margin-bottom: 5px;
    }
    #optionType_dialog .el-dialog__body{
      padding: 5px 20px 0;
    }
    #matchStock .el-dialog__body{
      padding: 0;
    }
    #matchStock .el-table--small td, #matchStock .el-table .cell{
      padding: 0;
      height: 32px;
      line-height: 32px;
    }
    #matchStock tr td:last-child {
      display: none;
    }
    #matchStock .el-input-number.is-without-controls .el-input__inner{
      padding-right: 30px;
    }
    #MergeDialog .el-dialog__body{
      padding: 0 20px;
      height: 420px;
      overflow-y: auto;
    }
    .mergeSet{
      margin-bottom: 0;
    }
    // 购买方
    .invoice_opening_form {
      margin-top: 10px;
      border: 1px solid #ddd;

      .el-form-item {
        margin: 3px;
      }
      .form-row {
        height: 165px;
        .font-itme {
          text-align: center;
          height: 100%;
        }
        .item {
          padding: 10px;
          height: 100%;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
        }
      }
    }
    // 货物表格
    .invoice_opening_table {
      border: 1px solid #ddd;
      border-top: none;
      .table /deep/ .el-table__header-wrapper {
        padding: 0;
        border-bottom: 1px solid #ddd;
        /deep/ .is-leaf {
          padding: 10px 0;
        }
      }
      /deep/ .el-table--small td, .el-table .cell{
        padding: 0;
      }
      .table::before {
        background-color: #eeebf500;
      }
      .el-input__inner{
        border: 0;
        padding-left: 5px;
      }
      .slstyle .el-input__inner {
        padding-right: 2px;
        text-align: right;
      }
      .row-item {
        padding: 5px 10px;
      }
    }
    // 销售方
    .invoice_opening_Saleform {
      border: 1px solid #ddd;
      border-top: none;

      .el-form-item {
        margin: 3px;
      }
      .form-row {
        height: 160px;
        .font-itme {
          text-align: center;
          height: 100%;
        }
        .item {
          padding: 10px;
          height: 100%;
          border-left: 1px solid #ddd;
          border-right: 1px solid #ddd;
        }
      }
    }
    .import-description {
      text-align: center;
    }
    .import-description a {
      text-decoration: none;
      color: #2C9DD8;
      cursor: pointer;
    }
    .maintable .el-table-column--selection .cell, .maintable tr td:first-child .cell{
      padding: 0;
    }
    .hidden-suffix .el-input__suffix {
      display: none;
    }
  }
</style>
