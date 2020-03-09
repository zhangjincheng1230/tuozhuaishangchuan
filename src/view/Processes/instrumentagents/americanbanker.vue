<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"
  >
    <header>
      <div class="headerleft">
        <el-form
          :inline="true"
          @submit.native.prevent
          class="form-inline"
          label-width="100px"
          style="height:50px;padding-top: 8px;"
        >
          <el-form-item
            label="期间:"
            size="small"
            label-width="44px"
            style="margin-left:14px; display:flex"
          >
            <el-input
              style="width:80%;"
              placeholder="请选择日期"
              v-popover:popover
              suffix-icon="el-icon-date"
              v-model="dateTime"
            ></el-input>

            <el-popover ref="popover" placement="bottom-start" width="400" v-model="visiblePopover">
              <h4 >银行对账单查询</h4>
              <div
                style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
              >
                <span>
                  <el-radio v-model="radio" label="serDay">交易时间：</el-radio>
                </span>
                <el-date-picker
                  v-model="startyearval"
                  type="monthrange"
                  unlink-panels
                  :clearable="false"
                  range-separator="-"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  value-format="yyyy-MM"
                  :picker-options="monthPickerOptions"
                  @change="clacke"
                >></el-date-picker>
              </div>
              <div
                style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
              >
                <span>
                  <el-radio v-model="radio" label="serDay1">入账期间：</el-radio>
                </span>
                <el-date-picker
                  v-model="startyearvals"
                  type="monthrange"
                  :clearable="false"
                  unlink-panels
                  range-separator="-"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  value-format="yyyy-MM"
                  :picker-options="monthPickerOptions"
                  @change="clacks"
                ></el-date-picker>
              </div>
              <div style="width:100%; height:45px; line-height:45px; display:flex;">
                <span style="padding-left:74px;">摘要：</span>
                <el-input v-model="zy" style="width:40%; padding-left:14px;"></el-input>
              </div>
              <div style="width:100%; height:45px; line-height:45px; display:flex;">
                <span style="padding-left:43px;">生成凭证：</span>
                <el-select v-model="ispz" placeholder="请选择" style="width:40%; padding-left:14px;">
                  <el-option
                    v-for="item in ispzoptions"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="width:100%; height:45px; line-height:45px; display:flex;">
                <span style="padding-left:43px;">收支类型：</span>
                <el-select
                  v-model="inoutflags"
                  placeholder="请选择"
                  style="width:40%; padding-left:14px;"
                >
                  <el-option
                    v-for="item in inoutflagoptions"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div style="width:100%; height:45px; line-height:45px; display:flex;">
                <span style="padding-left:10px;">业务类型名称：</span>
                <el-input v-model="busitempname" style="width:40%; padding-left:14px;"></el-input>
              </div>
              <div style="width:100%; height:45px; line-height:45px; display:flex;">
                <span style="padding-left:10px;">对方账户名称：</span>
                <el-input v-model="dfzhmc" style="width:40%; padding-left:14px;"></el-input>
              </div>
              <div style="text-align: right;margin-top: 12px">
                <el-button size="small" @click="visiblePopover = false" plain>取消</el-button>
                <el-button size="small" @click="qingchu">清除</el-button>
                <el-button size="small" type="primary" @click="addpose">确定</el-button>
              </div>
            </el-popover>
          </el-form-item>
        </el-form>
        <div style="line-height:50px; position: relative; margin-left:10px;">
        <span style="font-size:14px">银行账户:</span>
        <el-select
          v-model="inoutflag"
          placeholder="请选择"
          style="width:60%; padding-left:14px;"
         @change="accofes(inoutflag)"
        >
          <el-option
            v-for="item in embeddedquery"
            :key="item.id"
            :label="item.bkname"
            :value="item.id"
          ></el-option>
        </el-select>
        <i
          class="el-icon-plus"
          style=" position: absolute; right:24%;top:18px;cursor: pointer;"
          @click="addparkuser"
        ></i>
      </div>
      </div>

      <el-dialog title="新增银行账户" :visible.sync="dialogVisible"  width="25%">
        <el-form ref="formDaterm" :model="formDates" label-width="120px" :rules="rules">
          <el-form-item label="银行编码" prop="bkcode">
            <el-input v-model="formDates.bkcode" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="银行名称" prop="bkname">
            <el-input v-model="formDates.bkname" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="银行账号" prop="bkaccout">
            <el-input v-model="formDates.bkaccout" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="关联科目" prop="accname" style="position: relative;">
            <el-select v-model="formDates.accname" placeholder="请选择" style="width:80%;">
              <el-option
                v-for="(item,index) in accnameoptions"
                :key="index"
                :label="item.codename"
                :value="item.codename"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
            <i
          class="el-icon-plus"
          style=" position: absolute; right:28%;top:10px;cursor: pointer;"
          @click="jumpkemu"
        ></i>
          </el-form-item>
          <el-form-item style="text-align:right;">
            <el-button @click="openold('formDaterm')">取 消</el-button>
            <el-button type="primary" @click="addpacruse('formDaterm')">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div class="headerright">
        <el-button @click="refh">刷新</el-button>
        <el-button @click="addDemo">新增</el-button>
        <el-button @click="xiue">修改</el-button>
        <el-button @click="del">删除</el-button>
        <el-button @click="daoru">导入</el-button>
        <el-button @click="shezhidalog">入账设置</el-button>
        <el-button @click="qijiandalog">期间调整</el-button>
        <el-button @click="shengcheng">生成凭证</el-button>
        <el-dropdown style="margin-left: 5px;margin-right:5px" @command="handleCommand">
          <el-button size="mini" style="width:69px;height:31px">
            更多
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="goudui">勾对</el-dropdown-item>
            <el-dropdown-item command="export">导出</el-dropdown-item>
            <el-dropdown-item command="rule">合并规则</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <div class="contents" style="height:89%">
      <el-dialog
        :title="titlevals"
        :visible.sync="tabdalog"
        :modal-append-to-body="false"
        style="margin-top:50px"
        width="30%"
        :before-close="handleClose"
      >
        <el-form :model="tabdet" ref="refname" class="el-item" size="mini" :rules="rulese">
          <el-form-item label="交易日期" :label-width="formLabelWidth" prop="jyrq">
            <el-date-picker
              v-model="tabdet.jyrq"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              style="width:70%"
              @change="riqis"
              :picker-options="monthPickerOptions"
            ></el-date-picker>
            <!-- <el-date-picker v-model="tabdet.jyrq" type="date" style="width:70%" @change="riqis"></el-date-picker> -->
          </el-form-item>
          <el-form-item label="入账期间" :label-width="formLabelWidth" prop="inqj">
            <el-input
              v-model="tabdet.inqj"
              placeholder="请输入入账期间"
              style="width:70%"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="摘要" :label-width="formLabelWidth" prop="zy">
            <el-input v-model="tabdet.zy" placeholder="请输入摘要" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="收入金额" :label-width="formLabelWidth" prop="yhsyje">
            <el-input v-model="tabdet.yhsyje" placeholder="请输入收入金额" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="支出金额" :label-width="formLabelWidth" prop="yhzcje">
            <el-input v-model="tabdet.yhzcje" placeholder="请输入支出金额" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="对方账户名称" :label-width="formLabelWidth" prop="dfzhmc">
            <el-input v-model="tabdet.dfzhmc" placeholder="请输入对方账户名称" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="对方账户" :label-width="formLabelWidth" prop="dfzhbm">
            <el-input v-model="tabdet.dfzhbm" placeholder="请输入对方账户" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="余额" :label-width="formLabelWidth" prop="yfye">
            <el-input v-model="tabdet.yfye" placeholder="请输入余额" style="width:70%"></el-input>
          </el-form-item>
          <el-form-item label="业务类型" :label-width="formLabelWidth" prop="busitempname">
            <el-select v-model="tabdet.busitempname" placeholder="请选择业务类型" style="width:70%">
              <el-option
                v-for="(item,index) in  gridData||[]"
                :key="item.id + index"
                :label="item.categoryname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog__footer">
          <el-button @click="closeDialogs('refname')">取 消</el-button>
          <el-button type="primary" @click="baocun('refname')">保 存</el-button>
          <el-button type="primary" @click="xinzeng('refname')" v-if="isadds">新增并保存</el-button>
        </div>
      </el-dialog>
      <el-table
        ref="handSelectTest_multipleTable"
        size="mini"
        :data="tableDatas"
        v-loading="loading"
        :height="tableHeight"
        element-loading-text="数据处理中，请稍候..."
        element-loading-spinner="el-icon-loading"
        border
        tooltip-effect="dark"
        style="width: 100%;height:100%;overflow: hidden;
  overflow-y: auto"
        :row-class-name="tableRowClassNamese"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        type="index"
        @select="onTableSelect"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="交易日期" sortable prop="jyrq" align="center" width="125"></el-table-column>
        <el-table-column prop="inqj" align="center" label="入账期间" sortable width="120"></el-table-column>
        <el-table-column
          prop="zy"
          label="摘要"
          sortable
          show-overflow-tooltip
          header-align="center"
          align="left"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="yhsyje"
          label="收入金额"
          header-align="center"
          align="right"
           :formatter="repformny"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="yhzcje"
          label="支出金额"
          header-align="center"
          align="right"
           :formatter="repformny"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="dfzhmc"
          label="对方账户名称"
          header-align="center"
          align="left"
          sortable
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="dfzhbm"
          align="center"
          label="对方账户"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="yfye"
          header-align="center"
          align="right"
          label="余额"
           :formatter="repformny"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="busitempname"
          label="业务类型"
          header-align="center"
          align="left"
          sortable
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="pzh" label="凭证号" align="center" width="120" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.row.pzh">
            <span>
              记
              <a href="#" @click="pingzheng(scope.row.tzpzid)">{{scope.row.pzh}}</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ipath" label="银行回单" align="center" width="120" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.row.ipath">
            <span>
              <a href="#" @click="chakan(scope.row.ipath)">查看</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bankname"
          label="本地银行名称"
          align="center"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="bankaccount"
          label="本地银行账号"
          align="center"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sourcetype"
          align="center"
          label="单据来源"
          width="120"
          show-overflow-tooltip
        >
          <template slot-scope="sope">
            <span>{{sope.row.sourcetype|Bankcore}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="table-pagination"
        style="display:flex; justify-content: space-between ; align-items:center;
flex-flow: row-reverse;"
      >
        <Pagination
          :total="total"
          :page.sync="pageInfo.page"
          :limit.sync="pageInfo.rows"
          @pagination="addpose"
          style="margin-right:14px;"
        ></Pagination>
        <div style="margin-left:14px;">
          <span @click="yinhang" style="cursor: pointer;">银行对账单:{{tongji.yhdzdsl}}</span>
          <span @click="yinhangone" style="cursor: pointer;">银行回单:{{tongji.yhhdsl}}</span>
          <span @click="yinhangtwo" style="cursor: pointer;">未收到的回单:{{tongji.wsdhdsl}}</span>
          <span>显示{{pageInfo.page}}到{{tableDatas.length}},共{{total}}记录</span>
        </div>
      </div>
    </div>
    <el-dialog title="选择业务类型" :visible.sync="yewudelog" width="30%">
      <el-table
        :data="gridData"
        style="width:100%;overflow: hidden;height:400px;overflow-y:auto"
        v-loading="loading"
        element-loading-text="数据处理中，请稍候..."
        element-loading-spinner="el-icon-loading"
        highlight-current-row
        :row-class-name="tableRowClassNames"
        @row-click="removes"
        @row-dblclick="yewuxuanze"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="categoryname" label="业务类型名称"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="yewudelog = false">取 消</el-button>
        <el-button type="primary" @click="yewusele">确 定</el-button>
      </div>
    </el-dialog>
    <UploaderDialog
      ref="daoru"
      :visible.sync="dialogImpFormVisible"
      name="file"
      :param="uploadParam"
      title="导入"
      :on-change="calse"
      @submit="onUpload"
    >
      <template #description>
        <div class="import-description">
          支持标准模板导入,没有导入模板
          <a href="javascript:void(0)" @click="expExcel()">点击下载</a>
        </div>
        <div style="margin-top:10px;">
          <el-select v-model="daoruval" placeholder="请选择" @change="daorusele">
            <el-option v-for="item in daoruarr" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <ul
          style="height:280px; list-style:none;overflow: hidden;overflow-y:auto;display:flex;flex-wrap:wrap"
        >
          <li v-for="item in exporimgs" :key="item.id" style="width:33%;" @click="subtim(item.id)">
            <img :src="item.img" alt style="width:100%;height:auto;margin-top:10px;" />
          </li>
        </ul>
      </template>
    </UploaderDialog>
    <el-dialog title="期间调整" :visible.sync="qijiandialog" width="26%" :before-close="handleClose">
      <div style=" height:60px;display:flex;width:100%;line-height:60px;">
        <div style="width:30%;">入账期间：</div>
        <div style="width:66%">
          <el-date-picker
            style="margin-left:5px;width:205px"
            v-model="periods"
            type="month"
            :editable="false"
            :clearable="false"
            value-format="yyyy-MM"
            placeholder="选择期间"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qijiandialog = false">取 消</el-button>
        <el-button type="primary" @click="qijiancop">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="入账设置" :visible.sync="shezhidialog" width="28%" :before-close="handleClose">
      <div style="display:flex; height:45px;;line-height:45px;justify-content: center;">
        <span style="width:30%;">业务类型名称</span>
        <el-input
          style="width:45%;"
          v-model="categoryname"
          autocomplete="off"
          suffix-icon="el-icon-date"
          @focus="shezhiyewu"
        ></el-input>
      </div>
      <div style="display:flex;height:45px;;line-height:45px;justify-content: center;">
        <span style="width:30%;">入账科目</span>
        <el-select
          style="width:45%;"
          v-model="rzkm"
          default-first-option
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="item in optionsal"
            :key="item.id"
            :label="item.codefullname"
            :value="item.id"
            :disabled="item.disabled"
          >
            <span style="float: left">{{ item.codefullname }}</span>
          </el-option>
        </el-select>
      </div>
      <div style="display:flex;height:45px;;line-height:45px;justify-content: center;">
        <span style="width:30%;">自定义摘要</span>
        <el-input v-model="zdyzy" autocomplete="off" style="width:45%;"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="shezhidialog = false">取 消</el-button>
        <el-button type="primary" @click="shezhidal">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      id="MergeDialog"
      title="合并规则设置"
      :visible.sync="dialogMerge"
      width="400px"
      :close-on-click-modal="false"
      @close="dialogMerge = false"

    >
      <el-form
        ref="mergeForm"
        :model="mergeForm"
        @submit.native.prevent
        label-width="120px"
        :inline="true"
      >
        <el-row style="border-bottom: 1px solid #ddd">
          <el-form-item label="凭证日期：" class="mergeSet">
            <el-row>
              <el-radio v-model="mergeForm.pzrq" label="1">当前账期最后一天</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="mergeForm.pzrq" label="2">票据实际日期</el-radio>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #ddd">
          <el-form-item label="凭证合并规则：" class="mergeSet">
            <el-row>
              <el-radio v-model="mergeForm.pzrule" label="1">不合并</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="mergeForm.pzrule" label="2">按往来单位生成凭证</el-radio>
            </el-row>
            <el-row>
              <el-radio v-model="mergeForm.pzrule" label="3">勾选清单生成一张凭证</el-radio>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row style="border-bottom: 1px solid #ddd">
          <el-form-item label="分录合并规则：" class="mergeSet">
            <el-row>
              <el-radio v-model="mergeForm.flrule" label="2">同方向分录合并</el-radio>
            </el-row>
            <el-row>
              <el-checkbox style="margin-left: 25px;" v-model="bankSub">银行科目不合并</el-checkbox>
            </el-row>
            <el-row>
              <el-radio v-model="mergeForm.flrule" label="4">同方向、不同方向分录合并</el-radio>
            </el-row>
            <el-row>
              <el-checkbox style="margin-left: 25px;" v-model="bankSubs">银行科目不合并</el-checkbox>
            </el-row>
            <el-row>
              <el-radio v-model="mergeForm.flrule" label="3">分录不合并</el-radio>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="摘要生成规则：" class="mergeSet">
            <div style="display:flex">
            <h4>按所选规则生成摘要</h4>
            <el-tooltip style="margin-left:8px;margin-top:5px;width:20px;height:20px"    effect="light" content="根据系统默认值，生成摘要 “2019 年 05 月 04 日从{往来 单位}大帐房演示公司{业务类型}转入”可根据业务需求进行勾选或自定义" placement="right">
                <el-image :src="srcList[0]"></el-image>
              </el-tooltip>
              </div>
            <el-row>

              <el-checkbox v-model="createRule.selectQjZy">开票日期</el-checkbox>
              <el-checkbox v-model="createRule.selectWlZy">往来单位</el-checkbox>
            </el-row>
            <el-row>
              <el-checkbox v-model="createRule.selectLxZy">业务类型</el-checkbox>
              <el-checkbox v-model="createRule.selectZdyZy">自定义摘要</el-checkbox>
            </el-row>
            <el-row v-if="createRule.selectZdyZy">
              <el-input type="textarea" :rows="2" v-model="zyContent"></el-input>
            </el-row>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog__footer" >
        <el-button @click="dialogMerge = false">取 消</el-button>
        <el-button type="primary" @click="saveMerge">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="勾对"
      :visible.sync="gouduidailog"
      :modal-append-to-body="false"
      style="margin-top:50px"
    >
    <el-form
        :model="formObj"
        label-position="left"
        :inline="true"
        ref="refname"
        class="el-form3"
        size="mini"
      >
        <el-form-item label="期间：" label-width="60">
          <span>{{dateTime}}</span>
        </el-form-item>
        <el-form-item label="银行账户：" label-width="80">
          <el-select v-model="inoutflag" placeholder="请选择" style="width:60%; padding-left:14px;">
            <el-option
              v-for="item in embeddedquery"
              :key="item.id"
              :label="item.bkname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="totle">
        <p>银行回单</p>
      </div>
      <el-table
        :data="gridDataf"
        height="120"
        style="font-size:12px"
        :row-style="rowstyle"
        :cell-style="cellstyle"
        @row-click="huidans"
        highlight-current-row
        border
      >
        <el-table-column property="dfzhmc" label="对方账户名称" width="120"></el-table-column>
        <el-table-column property="dfzhbm" label="对方账户"></el-table-column>
        <el-table-column property="bfzhmc" label="本方账户名称" width="120"></el-table-column>
        <el-table-column property="bfzhbm" label="本方账户"></el-table-column>
        <el-table-column property="mony" label="金额"></el-table-column>
        <el-table-column property="jyrq" label="开票日期" width="120"></el-table-column>
        <el-table-column property="tradecode" label="交易流水号" width="120"></el-table-column>
      </el-table>
      <div class="totle">
        <p>银行对账单</p>
      </div>
      <el-table
        :data="gridDatas"
        height="120"
        style="font-size:12px"
        :row-style="rowstyle"
        :cell-style="cellstyle"
        @row-click="duizhanga"
        highlight-current-row
        border
      >
        <el-table-column property="dfzhmc" label="对方账户名称" width="120"></el-table-column>
        <el-table-column property="dfzhbm" label="对方账户"></el-table-column>
        <el-table-column property="bfzhmc" label="本方账户名称" width="120"></el-table-column>
        <el-table-column property="bfzhbm" label="本方账户"></el-table-column>
        <el-table-column property="mony" label="金额"></el-table-column>
        <el-table-column property="jyrq" label="交易日期" width="120"></el-table-column>
        <el-table-column property="busitempname" label="业务类型" width="120"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="openDialog">勾 对</el-button>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图片" :visible.sync="imgdalog" width="60%" :before-close="handleClose" style>
      <div style="overflow: hidden;overflow-y:auto; height:40%">
        <img :src="imgsrc+ ipathfor+'&X-Login-Corp='+usercorp+'&X-Login-Date='+userdata+'&X-Login-User='+user+'&X-ACCESS-TOKEN='+usertoken" alt style="width:100%;height:auto;" />
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { prefix } from '@/libs/axios'
import UploaderDialog from '@/components/UploaderDialog'
import Header from '../components/Header'
import { mapGetters } from 'vuex'
import * as MsgUtil from '../msg-util'
import Pagination from '@/components/Pagination/index'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'yhdzd',
  mixins: [datePickerMixin],
  components: {
    Header,
    UploaderDialog,
    Pagination

  },
  watch: {
    dialogImpFormVisible (newValue, oldValue) {
      if (newValue === false) {
        this.daoruval = ''
      }
    }
  },
  computed: {
    ...mapGetters(['currentCorp']),
    rules () {
      let rules = {
        bkname: [
          { required: true, message: '请输入银行名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        bkaccout: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        accname: [
          { required: true, message: '请输入关联科目名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]

      }
      return rules
    },
    uploadParam () {
      return {
        sourcetem: this.bankaccids,
        bankaccid: this.inoutflag === '默认账户' ? '' : this.inoutflag
      }
    },
    // 时间选择区间
    yearRange () {
      let range = []
      for (let beginRange = parseInt(this.$store.getters.getLoginDate.substring(0, 4)); beginRange <= new Date().getFullYear(); beginRange++) {
        range.push({ value: beginRange, label: beginRange })
      }
      return range
    },
    methodRange () {
      let ranges = []
      for (let beginRange = parseInt(this.$store.getters.getLoginDate.substring(5, 7)); beginRange <= new Date().getMonth() + 1; beginRange++) {
        ranges.push({ value: beginRange, label: beginRange })
      }
      return ranges
    },
    // 用于显示区间
    queryqj () {
      return this.queryForm.beginYear + '~' + this.queryForm.endYear
    }
  },
  created () {
    this.getopenAccount()
    this.addpose()
    this.tableHeight = window.innerHeight - 205
  },
  data () {
    const loginPeriod = this.$store.getters.getLoginDate.substring(0, 7)
    return {
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      imgsrc: prefix,
      isadds: true,
      user: this.$store.getters.getUserId,
      userdata: this.$store.getters.getLoginDate,
      usercorp: this.$store.getters.getLoginCorpId,
      usertoken: this.$store.getters.getToken,
      tableHeight: 0,
      tabdalog: false,
      formLabelWidth: '150px',
      titlevals: '',
      duizhang: {},
      huidan: {},
      formObj: {},
      gridDataf: [],
      gridDatas: [],
      gouduidailog: false,
      indse: '',
      periods: loginPeriod,
      exporimgs: [
        { img: require('../../../assets/img/dzdzgyhbjfh.png'), id: 2 },
        { img: require('../../../assets/img/dzdgsyhbjfh.png'), id: 3 },
        { img: require('../../../assets/img/zgnyyhcqfh.png'), id: 6 },
        { img: require('../../../assets/img/dzdnsyh.png'), id: 4 },
        { img: require('../../../assets/img/dzdjsmfnsyh.png'), id: 5 },
        { img: require('../../../assets/img/cqyh.png'), id: 7 },
        { img: require('../../../assets/img/cqncyh.png'), id: 8 },
        { img: require('../../../assets/img/zgnyyhszfh.png'), id: 9 },
        { img: require('../../../assets/img/dzdzgyhbjfh.png'), id: 10 },
        { img: require('../../../assets/img/zgjsyhxmfh.png'), id: 11 },
        { img: require('../../../assets/img/zgjsyhszfh.png'), id: 12 },
        { img: require('../../../assets/img/qdyh.png'), id: 13 },
        { img: require('../../../assets/img/xyyhqdfh.png'), id: 14 },
        { img: require('../../../assets/img/bohyhtjfh.png'), id: 15 },
        { img: require('../../../assets/img/jiaotyhqhfh.png'), id: 16 },
        { img: require('../../../assets/img/qdncsyyh.png'), id: 17 },
        { img: require('../../../assets/img/zsyhszfh.png'), id: 18 },
        { img: require('../../../assets/img/minsyh.png'), id: 19 },
        { img: require('../../../assets/img/zjmtsyyh.png'), id: 20 },
        { img: require('../../../assets/img/cdnsyh.png'), id: 21 },
        { img: require('../../../assets/img/kueleyh.png'), id: 22 },
        { img: require('../../../assets/img/kulunyh.png'), id: 23 },
        { img: require('../../../assets/img/beijingyh.png'), id: 24 },
        { img: require('../../../assets/img/huaxianyhbjfh.png'), id: 25 },
        { img: require('../../../assets/img/zgjsyhcdyh.png'), id: 26 },
        { img: require('../../../assets/img/lanzhouyh.png'), id: 27 },
        { img: require('../../../assets/img/jtyhshyh.png'), id: 28 },
        { img: require('../../../assets/img/njyhshyh.png'), id: 29 },
        { img: require('../../../assets/img/zggsyhshyh.png'), id: 30 },
        { img: require('../../../assets/img/shanghaiyh.png'), id: 31 },
        { img: require('../../../assets/img/zgmsyhcdfh.png'), id: 32 },
        { img: require('../../../assets/img/jtyhccfh.png'), id: 33 },
        { img: require('../../../assets/img/zggsyhcqfh.png'), id: 34 },
        { img: require('../../../assets/img/zggsyhjxfh.png'), id: 35 },
        { img: require('../../../assets/img/zggsyhszfh.png'), id: 36 },
        { img: require('../../../assets/img/zggsyhcdfh.png'), id: 37 },
        { img: require('../../../assets/img/zggsyhqzfh.png'), id: 38 },
        { img: require('../../../assets/img/zgyhshanghfh.png'), id: 39 },
        { img: require('../../../assets/img/zgyhsuqfh.png'), id: 40 },
        { img: require('../../../assets/img/jljtncsyyh.png'), id: 41 },
        { img: require('../../../assets/img/zgjsyhlhfh.png'), id: 42 },
        { img: require('../../../assets/img/zgnyyhlhfh.png'), id: 43 },
        { img: require('../../../assets/img/zgyhlhfh.png'), id: 44 },
        { img: require('../../../assets/img/zggsyhssfh.png'), id: 45 },
        { img: require('../../../assets/img/zgnyyhwlmqfh.png'), id: 46 },
        { img: require('../../../assets/img/zgmsyhtyfh.png'), id: 47 },
        { img: require('../../../assets/img/payhszfh.png'), id: 48 },
        { img: require('../../../assets/img/xingyyhszfh.png'), id: 49 },
        { img: require('../../../assets/img/shpdfzyhszfh.png'), id: 50 },
        { img: require('../../../assets/img/zgncsyyhszfh.png'), id: 51 },
        { img: require('../../../assets/img/zgyhnmgfh.png'), id: 52 },
        { img: require('../../../assets/img/changsyh.png'), id: 53 },
        { img: require('../../../assets/img/jiningyhtafh.png'), id: 54 },
        { img: require('../../../assets/img/zggsyhtafh.png'), id: 55 },
        { img: require('../../../assets/img/pinganyhcsfh.png'), id: 56 },
        { img: require('../../../assets/img/zhongyyhxxfh.png'), id: 57 },
        { img: require('../../../assets/img/changsnsyh.png'), id: 58 }
      ],
      daoruval: '',
      daoruarr: [
        { id: 999, name: '通用银行模板' },
        { id: 2, name: '中国银行-北京分行' },
        { id: 3, name: '中国工商银行-北京分行' },
        { id: 4, name: '北京农商银行' },
        { id: 5, name: '江苏民丰农商银行' },
        { id: 6, name: '中国农业银行-重庆分行' },
        { id: 7, name: '重庆银行' },
        { id: 8, name: '重庆农村商业银行' },
        { id: 9, name: '中国农业银行-苏州分行' },
        { id: 10, name: '苏州银行' },
        { id: 11, name: '中国建设银行-厦门分行' },
        { id: 12, name: '中国建设银行-苏州分行' },
        { id: 13, name: '青岛银行' },
        { id: 14, name: '兴业银行-青岛分行' },
        { id: 15, name: '渤海银行-天津分行' },
        { id: 16, name: '交通银行-青岛分行' },
        { id: 17, name: '青岛农商银行' },
        { id: 18, name: '招商银行-杭州分行' },
        { id: 19, name: '中国民生银行' },
        { id: 20, name: '浙江民泰商业银行' },
        { id: 21, name: '成都农商银行' },
        { id: 22, name: '库尔勒银行' },
        { id: 23, name: '昆仑银行' },
        { id: 24, name: '北京银行' },
        { id: 25, name: '华夏银行-北京分行' },
        { id: 26, name: '中国建设银行-成都分行' },
        { id: 27, name: '兰州银行' },
        { id: 28, name: '交通银行-上海分行' },
        { id: 29, name: '南京银行-上海分行' },
        { id: 30, name: '中国工商银行-上海分行' },
        { id: 31, name: '上海银行' },
        { id: 32, name: '中国民生银行-成都分行' },
        { id: 33, name: '交通银行-长春分行' },
        { id: 34, name: '中国工商银行-重庆分行' },
        { id: 35, name: '中国工商银行-江西分行' },
        { id: 36, name: '中国工商银行-苏州分行' },

        { id: 37, name: '中国工商银行-成都分行' },
        { id: 38, name: '中国工商银行-泉州分行' },
        { id: 39, name: '中国银行-上海分行' },
        { id: 40, name: '中国银行-宿迁分行' },
        { id: 41, name: '吉林九台农村商业银行' },
        { id: 42, name: '中国建设银行-临河分行' },
        { id: 43, name: '中国农业银行-临河分行' },
        { id: 44, name: '中国银行-临河分行' },
        { id: 45, name: '中国工商银行-石狮分行' },
        { id: 46, name: '中国农业银行-乌鲁木齐分行' },
        { id: 47, name: '中国民生银行-太原分行' },
        { id: 48, name: '平安银行-深圳分行' },
        { id: 49, name: '兴业银行-深圳分行' },
        { id: 50, name: '浦发银行-深圳分行' },
        { id: 51, name: '深圳农村商业银行' },
        { id: 52, name: '中国银行-内蒙古分行' },
        { id: 53, name: '长沙银行' },
        { id: 54, name: '济宁银行-泰安分行' },
        { id: 55, name: '中国工商银行-泰安分行' },
        { id: 56, name: '平安银行-长沙分行' },
        { id: 57, name: '中原银行-西峡支行' },
        { id: 58, name: '长沙农商银行' }
      ],
      createRule: {
        selectQjZy: false,
        selectWlZy: false,
        selectLxZy: false,
        selectZdyZy: false

      },

      zyContent: '',
      bankSub: false,
      bankSubs: false,
      mergeForm: {
        pzrq: '1',
        pzrule: '1',
        flrule: '2',
        bk: '',
        zy: '',
        setid: ''
      },
      dialogMerge: false,
      yewuopen: false,
      busitypetempid: '',
      period: '',
      zdyzy: '',
      categoryname: '',
      rzkm: '',
      optionsal: [],
      shezhidialog: false,
      pageInfo: {
        page: 1,
        rows: 100
      },
      total: 0,
      qijiandialog: false,
      dialogImpFormVisible: false,
      yewudelog: false,
      gridData: [],
      shows: true,
      showtab: false,
      dateTime: '',
      value: '',
      value1: '',
      open: false,
      visiblePopover: false,
      dialogVisible: false,
      isSet: false,
      pickerOptions: this.datePicker(),
      startyearval: [loginPeriod, loginPeriod],
      startyear1: '',
      startyear2: '',
      startmonth1: '',
      endyear1: '',
      endmonth1: '',
      startyearvals: [loginPeriod, loginPeriod],
      startmonth2: '',
      endyear2: '',
      endmonth2: '',
      busitempname: '',
      dfzhmc: '',
      input: '',
      ispz: '',
      inoutflags: '',
      inoutflag: '默认账户',
      radio: 'serDay',
      zy: '',
      bkcode: '',
      bkname: '',
      bkaccout: '',
      formDates: {},
      optionsYear: [
        {
          label: '2019'
        },
        {
          label: '2018'
        }],
      optionsDay: [
        {
          label: '01'
        }, {
          label: '02'
        }, {
          label: '03'
        }, {
          label: '04'
        }, {
          label: '05'
        }, {
          label: '06'
        }, {
          label: '07'
        }, {
          label: '08'
        }, {
          label: '09'
        }, {
          label: '10'
        }, {
          label: '11'
        }, {
          label: '12'
        }],
      ispzoptions: [
        {
          value: '全部',
          id: ''
        },
        {
          value: '已生成凭证',
          id: 'Y'
        },
        {
          value: '未生成凭证',
          id: 'N'
        }
      ],
      isbackna: '',
      embeddedquery: [
      ],
      guodiusel: {},
      gouduibanf: false,
      accnameoptions: [],
      inoutflagoptions: [
        {
          value: '全部',
          id: ''
        },
        {
          value: '支出',
          id: '1'
        },
        {
          value: '支出',
          id: '2'
        },
        {
          value: '无方向',
          id: '0'
        }
      ],
      tableData: [],
      selection: '',
      serDays: {},
      datas: '',
      tabdata: '',
      tabdet: {
        jyrq: this.$store.getters.getLoginDate,
        inqj: this.$store.getters.getLoginDate.substring(0, 7),
        zy: '',
        yhsyje: '',
        yhzcje: '',
        dfzhmc: '',
        dfzhbm: '',
        yfye: '',
        busitempname: '',
        busitypetempid: '',
        sourcetype: 0,
        cid: ''
      },
      loading: false,
      selections: {},
      index: null,
      arr: '',
      tableDatas: [],
      listSelectedRows: null,
      save: false,

      qijianmenth: this.$store.getters.getLoginDate.substring(6, 7),
      qijianyear: this.$store.getters.getLoginDate.substring(0, 4),
      yinhangid: '',
      pk_model_h: '',
      bankaccids: 1,
      imgdalog: false,
      ipthas: '',
      ispzh: '',
      rulese: {
        jyrq: [
          { required: true, message: '请选择交易日期', trigger: 'change' }
        ],
        busitempname: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ]
      },
      seaves: false,
      tongji: {},
      falgs: '',
      ipathfor: '',
      rowas: {},
      tabid: ''
    }
  },
  filters: {
    Bankcore (val) {
      let num = val
      let str = '手工录入;通用模板导入;中国银行北京分行模板导入;工商银行北京分行模板导入;北京农商银行模板导入;江苏民丰农商银行模板导入;中国农业银行重庆分行模板导入;重庆银行模板导入;重庆农村商业银行模板导入;中国农业银行苏州分行模板导入;苏州银行模板导入;中国建设银行厦门分行模板导入;中国建设银行苏州分行模板导入;青岛银行模板导入;兴业银行青岛分行模板导入;渤海银行天津分行模板导入;交通银行青岛分行模板导入;青岛农村商业银行模板导入;招商银行杭州分行模板导入;民生银行模板导入;浙江民泰商业银行模板导入;成都农商银行模板导入;库尔勒银行模板导入;昆仑银行模板导入;北京银行模板导入;华夏银行北京分行模板导入;中国建设银行成都分行模板导入;兰州银行模板导入;交通银行上海分行模板导入;南京银行上海分行模板导入;工商银行上海分行模板导入;上海银行模板导入;中国民生银行成都分行模板导入;交通银行长春分行模板导入;工商银行重庆分行模板导入;工商银行江西分行模板导入;工商银行苏州分行模板导入;工商银行成都分行模板导入;工商银行泉州分行模板导入;中国银行上海分行模板导入;中国银行宿迁分行模板导入;吉林九台农村商业银行模板导入;中国建设银行临河分行模板导入;中国农业银行临河分行模板导入;中国银行临河分行模板导入;工商银行石狮分行模板导入;中国农业银行乌鲁木齐分行模板导入;中国民生银行太原分行模板导入;平安银行深圳分行模板导入;兴业银行深圳分行模板导入;浦发银行深圳分行模板导入;深圳农村商业银行模板导入;中国银行内蒙古分行模板导入;长沙银行模板导入;济宁银行泰安分行模板导入;中国工商银行泰安分行模板导入;平安银行长沙分行模板导入;中原银行西峡支行模板导入;长沙农商银行模板导入;银行回单;通用银行模板导入'
      let arrList = str.split(';')
      let arrNewList = []
      arrList.map((item, index) => {
        if (index <= 58) {
          let ind = {
            code: index,
            name: item
          }
          arrNewList.push(ind)
        } else if (index === 59) {
          let ind = {
            code: 100,
            name: item
          }
          arrNewList.push(ind)
        } else if (index === 60) {
          let ind = {
            code: 999,
            name: item
          }
          arrNewList.push(ind)
        }
      })
      arrNewList.map((item, index) => {
        if (num === item.code) {
          val = item.name
        }
      })
      return val
    }

  },
  methods: {
    jumpkemu () {
      this.dialogVisible = false
      this.$router.push({
        name: 'subject'
      })
    },
    repformny (row, column, cellValue) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    calse (e) {
    },
    yewuxuanze (row) {
      this.categoryname = row.categoryname
      this.pk_model_h = row.id
      this.yewudelog = false
    },
    yinhang () {
      this.falgs = '2,0'
      this.addpose()
    },
    yinhangone () {
      this.falgs = '2,1'
      this.addpose()
    },
    yinhangtwo () {
      this.falgs = '0'
      this.addpose()
    },
    closeDialogs (formName) {
      this.tabdalog = false
      // this.listSelectedRows = [
      console.log(this.tabdet, 'asdas')
      this.tableDatas.find(item => {
        if (item.id === this.tabdetids) {
          item = this.tabdetas
        }
      })
      this.tabdet = {
        jyrq: this.$store.getters.getLoginDate,
        inqj: this.$store.getters.getLoginDate.substring(0, 7),
        zy: '',
        yhsyje: '',
        yhzcje: '',
        dfzhmc: '',
        dfzhbm: '',
        yfye: '',
        busitempname: '',
        busitypetempid: '',
        sourcetype: 0,
        cid: ''
      }
      this.$refs[formName].resetFields()
    },

    addDemo () {
      this.tabdet = {
        jyrq: this.$store.getters.getLoginDate,
        inqj: this.$store.getters.getLoginDate.substring(0, 7),
        zy: '',
        yhsyje: '',
        yhzcje: '',
        dfzhmc: '',
        dfzhbm: '',
        yfye: '',
        busitempname: '',
        busitypetempid: '',
        sourcetype: 0,
        cid: ''
      }
      this.titlevals = '新增'
      this.tabdalog = true
      this.seaves = true
      this.$api.linkAssets.Banking({
        period: this.$store.getters.getLoginDate.substring(0, 7)
      }).then(res => {
        if (res.success) {
          this.gridData = res.rows
        }
      })
    },
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
    },
    panduansl () {
      this.listSelectedRows.map(item => {
        this.ipthas = item.ipath
        this.ispzh = item.tzpzid
      })
    },

    clacke () {
      this.radio = 'serDay'
    },
    clacks () {
      this.radio = 'serDay1'
    },
    qingchu () {
      const loginPeriod = this.$store.getters.getLoginDate.substring(0, 7)
      this.busitempname = ''
      this.dfzhmc = ''
      this.zy = ''
      this.inoutflags = ''
      this.ispz = ''
      this.startyearval = [loginPeriod, loginPeriod]
      this.startyearvals = [loginPeriod, loginPeriod]
    },
    refh () {
      this.addpose()
    },
    accofes (val) {
      this.addpose()
      this.isbackna = val
    },
    quxiao () {
      this.shows = true
      this.showtab = false
      this.tableData = []
      this.listSelectedRows = null
      this.addpose()
    }, // 勾对
    rowstyle () {
      return 'height:35px;'
    },
    cellstyle () {
      return 'padding:0'
    },
    dialogForm () {
      this.gouduidailog = true
    },
    openDialog () {
      const loading = MsgUtil.loading(this, '正在勾对...')
      this.$api.linkAssets.getgouduitabsave({
        pk_bankhd: this.huidan.id,
        pk_bankdzd: this.duizhang.id
      }).then(res => {
        loading.close()
        this.gouduidailog = false
        if (res.success) {
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
    closeDialog () {
      this.gouduidailog = false
    },
    pingzheng (val) {
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: val
        }
      })
    },
    chakan (val) {
      this.imgdalog = true
    },
    // 生成凭证
    shengcheng () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        const arrs = JSON.stringify(this.listSelectedRows).substr(1)
        const tabstr = arrs.substr(0, arrs.length - 1)
        this.panduansl()
        if (this.ipthas) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
        } else if (this.ispzh) {
          MsgUtil.warnMsg(this, '银行对账单[' + this.listSelectedRows[0].jyrq + '],单据已生成凭证,请检查')
        } else {
          if (this.listSelectedRows.length === 1) {
            this.$api.linkAssets.getGoodsInvenRela({ row: tabstr }).then(result => {
              if (result.success) {
                this.$api.linkAssets.getonevoucher({
                  row: JSON.stringify(this.listSelectedRows)
                }).then(res => {
                  this.$router.push({
                    name: 'voucher-edit',
                    params: {
                      data: res.data
                    }
                  })
                })
              } else {
                this.$message({
                  type: 'error',
                  message: result.msg
                })
              }
            })
          } else {
            const loading = MsgUtil.loading(this, '正在生成...')
            this.$api.linkAssets.getGoodsInvenRelasa({ head: tabstr }).then(result => {
              loading.close()
              if (result.success) {
                // this.$router.push({ name: 'voucher-edit', params: this.listSelectedRows })
                this.addpose()
                MsgUtil.successMsg(this, "<div style='overflow-y:auto;width:auto'>" + result.msg + '</div>')
              } else {
                MsgUtil.errorMsg(this, "<div style='overflow-y:auto;width:auto'>" + result.msg + '</div>')
              }
            })
          }
        }
      } else {
        MsgUtil.warnMsg(this, '请选择要调整的数据！')
      }
    },
    // 合并规则
    saveMerge () {
      if (this.bankSub || this.bankSubs) {
        this.mergeForm.bk = 'Y'
      } else {
        this.mergeForm.bk = ''
      }

      //  this.bankSub ? 'Y' : 'N' || this.bankSubs ? 'Y' : 'N'
      console.log(this.mergeForm)
      for (let item in this.createRule) {
        if (item === 'selectZdyZy') {
          if (this.createRule['selectZdyZy']) {
            this.mergeForm.zy += item + ':' + this.zyContent + '$'
          } else {
            this.mergeForm.zy += '$'
          }
        } else if (this.createRule[item]) {
          this.mergeForm.zy += item + '$'
        } else {
          this.mergeForm.zy += '$'
        }
      }
      // this.mergeForm.zy = '$selectWlZy$selectLxZy$selectXmZy$$$'
      const loading = MsgUtil.loading(this, '正在设置...')
      this.$api.linkAssets.combineRule(this.mergeForm).then(result => {
        loading.close()
        this.dialogMerge = false
        if (result.success) {
          this.mergeForm.zy = ''
          this.$message({
            type: 'success',
            message: result.msg
          })
        } else {
          this.$message({
            type: 'error',
            message: result.msg
          })
        }
      })
    },
    clack (val) {
      this.tabdata = val === '' ? '' : val.substring(0, 7)
    },
    // 入账设置
    shezhidalog () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.panduansl()
        if (this.ipthas) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
        } else if (this.ispzh) {
          MsgUtil.warnMsg(this, '银行对账单[' + this.listSelectedRows[0].jyrq + '],单据已生成凭证,请检查')
        } else {
          this.yewuopen = false
          this.shezhidialog = true
          this.$api.linkAssets.IMyMoneyStorageAll().then(res => {
            this.optionsal = res.rows
          })
          this.listSelectedRows.map(item => {
            this.busitypetempid = item.busitypetempid
            this.period = item.inqj
            this.categoryname = item.busitempname
            this.yinhangid += item.id + ','
          })
          // console.log(this.yinhangid)
          this.$api.linkAssets.qijianyewu({
            id: this.busitypetempid,
            period: this.period
          }).then(res => {
            if (res.success) {

            }
          })
        }
      } else {
        MsgUtil.warnMsg(this, '请选择要调整的数据！')
      }
    },
    shezhidal () {
      const loading = MsgUtil.loading(this, '正在设置...')
      this.$api.linkAssets.qijianyewubaocun({
        pk_model_h: this.pk_model_h,
        busitypetempname: this.categoryname,
        rzkm: this.rzkm,
        zdyzy: this.zdyzy,
        id: this.yinhangid
      }).then(res => {
        loading.close()
        if (res.success) {
          this.shezhidialog = false
          this.getopenAccount()
          this.rzkm = ''
          this.zdyzy = ''
          this.yinhangid = ''
          debugger
          this.tableDatas.find(item => {
            this.listSelectedRows.forEach(val => {
              if (val.id === item.id) {
                console.log(this.selections.categoryname)
                item.busitempname = this.selections.categoryname ? this.selections.categoryname : item.busitempname
                item.busitypetempid = this.selections.id ? this.selections.id : item.busitypetempid
              }
            })
          })
          this.$message({
            type: 'success',
            message: res.msg
          })
          // this.addpose()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    shezhiyewu () {
      this.loading = true
      this.$api.linkAssets.Banking({
        period: this.period
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.yewudelog = true
          this.gridData = res.rows
        }
      })
    },
    // 期间调整
    qijiandalog () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
        this.panduansl()
        if (this.ipthas) {
          MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
        } else if (this.ispzh) {
          MsgUtil.warnMsg(this, '银行对账单[' + this.listSelectedRows[0].jyrq + '],单据已生成凭证,请检查')
        } else {
          this.qijiandialog = true
        }
      } else {
        MsgUtil.warnMsg(this, '请选择要调整的数据！')
      }
    },
    qijiancop () {
      const loading = MsgUtil.loading(this, '正在调整...')
      this.$api.linkAssets.qijiandailog({
        rows: JSON.stringify(this.listSelectedRows),
        period: this.periods
      }).then(res => {
        loading.close()
        this.qijiandialog = false
        this.qijianmenth = ''
        this.qijianyear = ''
        if (res.success) {
          this.addpose()
          MsgUtil.successMsg(this, "<div style=';overflow-y:auto;'>" + res.msg + '</div>')
        } else {
          MsgUtil.errorMsg(this, "<div style='overflow-y:auto;'>" + res.msg + '</div>')
        }
      })
    },
    handleClose () {
      this.qijiandialog = false
      this.imgdalog = false
      this.shezhidialog = false
      this.closeDialogs('refname')
    },
    // 合并规则
    handleCommand: function (command) {
      if (command === 'rule') {
        this.dialogMerge = true
        this.$api.linkAssets.queryRule({}).then(result => {
          if (result.success) {
            this.mergeForm.pzrq = result.rows.pzrq.toString()
            this.bankSub = result.rows.isbank !== undefined
            this.bankSubs = result.rows.isbank !== undefined
            this.mergeForm.pzrule = result.rows.value.toString()
            this.mergeForm.flrule = result.rows.entry_type.toString()
            this.mergeForm.setid = result.rows.setid

            let list = result.rows.zy.split('$')
            this.createRule.selectQjZy = list[0] !== ''
            this.createRule.selectWlZy = list[1] !== ''
            this.createRule.selectLxZy = list[2] !== ''
            this.createRule.selectZdyZy = list[3] !== ''
            this.zyContent = list[3].split(':')[1]
          }
        })
        // 导出
      } else if (command === 'export') {
        if (this.listSelectedRows && this.listSelectedRows.length > 0) {
          let param = {
            daterows: JSON.stringify(this.listSelectedRows)

          }
          this.$api.linkAssets.exportExcels('银行对账单', param)
        } else {
          MsgUtil.warnMsg(this, '请选择要导出的数据！')
        }
      } else if (command === 'goudui') {
        // debugger
        const loading = MsgUtil.loading(this, '正在载入...')
        this.gouduidailog = true
        this.guodiusel = this.embeddedquery.find(item => {
          return this.inoutflag === item.id
        })
        if (this.inoutflag === '默认账户') {
          this.gouduibanf = true
        } else {
          this.gouduibanf = false
        }
        let times = this.startyearval.join('')
        this.$api.linkAssets.getgouduitab({
          account: this.gouduibanf ? '' : this.guodiusel.bkaccout,
          accountcode: this.gouduibanf ? '' : this.guodiusel.bkname,
          type: 1,
          bperiod: times.substring(0, 7),
          eperiod: times.substring(7, 14),
          ismust: this.gouduibanf ? 'Y' : ''
        }).then(res => {
          // loading.close()
          if (res.success) {
            this.gridDataf = res.rows
          }
        })

        this.$api.linkAssets.getgouduitab({
          account: this.gouduibanf ? '' : this.guodiusel.bkaccout,
          accountcode: this.gouduibanf ? '' : this.guodiusel.bkname,
          type: 0,
          bperiod: times.substring(0, 7),
          eperiod: times.substring(7, 14),
          ismust: this.gouduibanf ? 'Y' : ''
        }).then(res => {
          loading.close()
          if (res.success) {
            this.gridDatas = res.rows
          }
        })
      }
    },
    huidans (row, column, event) {
      if (row != null) {
        this.huidan = row
        console.log(this.huidan)
      }
    },
    duizhanga (row, column, event) {
      if (row != null) {
        this.duizhang = row
        console.log(this.duizhang)
      }
    },
    RULESSome () {
      this.dialogMerge = true
    },
    templateUrl () {
      this.$api.linkAssets.Bankingperog().then(res => {

      })
    },
    daoru () {
      this.dialogImpFormVisible = true
    },
    expExcel () {
      this.$api.linkAssets.exportExcels('银行对账单', {})
    },
    daorusele (id) {
      this.$refs.daoru.$children[0].$children[2].$children[1].$el.children[1].click()
      this.bankaccids = id
    },
    subtim (id) {
      console.log(this.$refs.daoru)
      this.$refs.daoru.$children[0].$children[2].$children[1].$el.children[1].click()
      this.bankaccids = id
    },
    onUpload (formData) {
      if (!formData) {
        MsgUtil.errorMsg(this, '请先选择导入文件!')
        return
      }
      const loading = MsgUtil.loading(this, '正在导入...')

      // 然后通过下面的方式把内容通过axios来传到后台
      this.$api.linkAssets.Bankingperog(formData).then(result => {
        loading.close()
        if (result.success) {
          this.dialogImpFormVisible = false
          if (result.msg === '') {
            MsgUtil.successMsg(this, '导入成功!')
            this.addpose()
          } else {
            MsgUtil.successMsg(this, result.msg)
          }
          this.startyearval = [result.head.startyear1 + '-' + result.head.startmonth1, result.head.endyear1 + '-' + result.head.endmonth1]
          this.dateTime = result.head.startyear1 + '-' + result.head.startmonth1 + '-' + result.head.endyear1 + '-' + result.head.endmonth1
          this.$api.linkAssets.Contributors({
            serdate: this.radio,
            endmonth1: result.head.endmonth1,
            endyear1: result.head.endyear1,
            startmonth1: result.head.startmonth1,
            startyear1: result.head.startyear1,
            ...this.pageInfo,
            order: result.head.order,
            bankaccid: this.isbackna,
            sort: 'jyrq'
          }).then(res => {
            this.loading = false
            if (res.success) {
              this.total = res.total
              this.tableDatas = res.rows
              this.tongji = res.head
            } else {
              this.tableDatas = []
              this.total = res.total
            }
          })
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
    getopenAccount () {
      this.$api.linkAssets.Producator({
      }).then(res => {
        if (res.success) {
          res.rows.forEach(item => {
            if (item.bkname !== undefined) {
              this.embeddedquery.push(item)
            }
          })

          let ase = { bkname: '默认账户', id: '' }
          this.embeddedquery.unshift(ase)
        }
      })
    },
    addpacruse (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
        } else {
          return false
        }
      })
      // 新增银行账户
      console.log(this.accnameoptions.find(item => { return this.formDates.accname === item.codename }).id)
      debugger
      this.$api.linkAssets.openAccount({
        ...this.formDates,
        corpid: this.$store.getters.currentCorp.pk_gs,
        id: '',
        accname_id: this.accnameoptions.find(item => { return this.formDates.accname === item.codename }).id
      }).then(res => {
        if (res.success) {
          this.getopenAccount()
          this.embeddedquery = []
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
    openold (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    addparkuser () { // 获取银行账户增加条件
      this.accnameoptions = []
      this.$api.linkAssets.IMyMoneyStorageAll().then(res => {
        console.log(res)
        if (res.success) {
          res.rows.forEach(item => {
            if (item.codename.substring(0, 4) === '1002') {
              this.accnameoptions.push(item)
            }
          })
        }
      })
      this.$api.linkAssets.belastingcode().then(res => {
        if (res.success) {
          this.dialogVisible = true
          this.formDates.bkcode = res.data
        }
      })
    },

    removes (row, column, event) {
      if (row != null) {
        this.selections = row
        this.tabdet.busitypetempid = this.selections.id
      }
    },
    handleSelectionChange (val) {
      this.listSelectedRows = val
      this.listSelectedRows.map(item => {
        this.ipathfor = item.ipath
      })
    },
    tableRowClassNames ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },

    tableRowClassNamese ({ row, rowIndex }) {
      // let color = ''
      // this.listSelectedRows.forEach((r, i) => {
      //   if (rowIndex === r) {
      //     color = 'warning-row'
      //   }
      // })
      // return color
    },
    yewusele () {
      if (this.yewuopen) {
        this.tableData[this.index].busitempname = this.selections.categoryname
      } else {
        this.categoryname = this.selections.categoryname
        this.pk_model_h = this.selections.id
      }

      this.yewudelog = false
    },
    yewu (ind) {
      this.index = ind
      this.tableData[ind].inqj = this.tableData[ind].jyrq.substring(0, 7)

      if (this.tableData[ind].jyrq === '') {
        this.$message({
          type: 'error',
          message: '请选择日期'
        })
      } else {
        this.loading = true
        this.$api.linkAssets.Banking({
          period: this.tableData[ind].inqj || this.listSelectedRows[ind].inqj
        }).then(res => {
          this.loading = false
          if (res.success) {
            this.gridData = res.rows
          }
        })
        this.yewudelog = true
      }
    },
    addpose () { // 查询
      this.loading = true

      if (this.radio === 'serDay') {
        this.dateTime = this.startyearval.join('-')
        let item = this.startyearval.join('')
        this.serDays = JSON.parse(JSON.stringify({
          startyear1: this.$route.params.startyear1 ? this.$route.params.startyear1 : item.substring(0, 4),
          startmonth1: this.$route.params.startmonth1 ? this.$route.params.startmonth1 : item.substring(5, 7),
          endyear1: this.$route.params.endyear1 ? this.$route.params.endyear1 : item.substring(7, 11),
          endmonth1: this.$route.params.endmonth1 ? this.$route.params.endmonth1 : item.substring(12, 14)
        }))
      } else if (this.radio === 'serDay1') {
        this.dateTime = this.startyearvals.join('-')
        let item = this.startyearvals.join('')
        this.serDays = JSON.parse(JSON.stringify({
          startyear2: this.$route.params.startyear2 ? this.$route.params.startyear2 : item.substring(0, 4),
          startmonth2: this.$route.params.startmonth2 ? this.$route.params.startmonth2 : item.substring(5, 7),
          endyear2: this.$route.params.endyear2 ? this.$route.params.endyear2 : item.substring(7, 11),
          endmonth2: this.$route.params.endmonth2 ? this.$route.params.endmonth2 : item.substring(12, 14)
        }))
      }
      this.visiblePopover = false
      this.loading = true

      this.$api.linkAssets.Contributors({

        serdate: this.radio,
        ...this.serDays,
        zy: this.zy,
        busitempname: this.busitempname,
        dfzhmc: this.dfzhmc,
        ispz: this.ispz,
        inoutflag: this.inoutflags,
        bankaccid: this.inoutflag === '默认账户' ? '' : this.inoutflag,
        sort: 'jyrq',
        order: 'asc',
        flag: this.falgs,
        ...this.pageInfo

      }).then(res => {
        this.loading = false
        if (res.success) {
          this.total = res.total
          this.tableDatas = res.rows
          this.tongji = res.head
        } else {
          this.tableDatas = []
          this.total = res.total
        }
      })
    },
    // 点击行触发，选中或不选中复选框
    handleRowClick (row, column, event) {
      this.$refs.handSelectTest_multipleTable.toggleRowSelection(row)
      this.indse = row.index
    },

    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    del () { // 删除
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
      } else {
        MsgUtil.warnMsg(this, '请选择要删除的数据！')
        return
      }
      this.delRows(this.listSelectedRows)
    },
    delRows (rows) {
      const arrs = JSON.stringify(rows).substr(1)
      const tabstr = arrs.substr(0, arrs.length - 1)
      this.panduansl()

      if (this.ipthas) {
        MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
      } else if (this.ispzh) {
        MsgUtil.warnMsg(this, '银行对账单[' + this.listSelectedRows[0].jyrq + '],单据已生成凭证,请检查')
      } else {
        let tips = '删除后不可恢复！确定要删除选中的数据？'
        const loading = MsgUtil.loading(this, '正在删除...')
        this.$confirm(tips, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.linkAssets.Bankingdel({
            head: tabstr
          }).then(result => {
            loading.close()
            if (result.success) {
              MsgUtil.successMsg(this, "<div style='overflow-y:auto;'>" + result.msg + '</div>')
              this.addpose()
            } else {
              MsgUtil.errorMsg(this, "<div'style=';overflow-y:auto;'>" + result.msg + '</div>')
            }
          }).catch(e => {
            loading.close()
          })
        }).catch(e => {
          loading.close()
        })
      }
    },
    riqis () {
      this.tabdet.busitempname = ''
      this.tabdet.inqj = this.tabdet.jyrq.substring(0, 7)
      this.$api.linkAssets.Banking({
        period: this.tabdet.inqj
      }).then(res => {
        if (res.success) {
          this.gridData = res.rows
        }
      })
    },
    // 修改保存
    baocun (refname) {
      this.$refs[refname].validate((valid) => {
        if (valid) {
          if (this.seaves) {
            debugger
            const loading = MsgUtil.loading(this, '正在新增...')
            this.tabdet.busitypetempid = this.tabdet.busitempname
            const busitempnames = this.gridData.find(item => {
              return this.tabdet.busitempname === item.id
            })

            this.tabdet.busitempname = busitempnames.categoryname
            this.$api.linkAssets.statements({
              adddoc: JSON.stringify(this.tabdet),
              bankaccid: this.inoutflag === '默认账户' ? '' : this.inoutflag
            }).then(res => {
              loading.close()
              if (res.success) {
                this.$nextTick(() => {
                  this.$refs[refname].resetFields()
                })
                this.tabdalog = false
                this.addpose()
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
          } else {
            this.tabdet.busitypetempid = this.tabdet.busitempname
            const busitempnames = this.gridData.find(item => {
              return this.tabdet.busitempname === item.id
            })
            // console.log(busitempnames)
            this.tabdet.busitempname = busitempnames.categoryname
            // console.log(this.tabdet.busitempname)
            const loading = MsgUtil.loading(this, '正在保存...')
            this.$api.linkAssets.statements({
              upddoc: JSON.stringify(this.tabdet),
              bankaccid: this.inoutflag === '默认账户' ? '' : this.inoutflag
            }).then(res => {
              loading.close()
              if (res.success) {
                this.isadds = true
                this.$nextTick(() => {
                  this.$refs[refname].resetFields()
                })
                this.tabdalog = false
                this.addpose()
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
          }
        } else {
          return false
        }
      })
    },
    // 新增保存
    xinzeng (refname) {
      this.$refs[refname].validate((valid) => {
        if (valid) {
          this.tabdet.busitypetempid = this.tabdet.busitempname
          const busitempnames = this.gridData.find(item => {
            return this.tabdet.busitempname === item.id
          })
          this.tabdet.busitempname = busitempnames.categoryname
          const loading = MsgUtil.loading(this, '正在新增...')
          this.$api.linkAssets.statements({
            adddoc: JSON.stringify(this.tabdet),
            bankaccid: this.inoutflag === '默认账户' ? '' : this.inoutflag
          }).then(res => {
            loading.close()
            if (res.success) {
              this.$nextTick(() => {
                this.$refs[refname].resetFields()
              })

              this.addpose()
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
        } else {
          return false
        }
      })
    },
    onTableSelect (rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1
      if (selected) {
        this.$refs.handSelectTest_multipleTable.toggleRowSelection(row)
      } // true就是选中，0或者false是取消选中
    },
    xiue () {
      if (this.listSelectedRows && this.listSelectedRows.length > 0) {
      } else {
        MsgUtil.warnMsg(this, '请选择要修改的数据！')
        return
      }
      this.xiutab(this.listSelectedRows)
    },
    xiutab () {
      this.panduansl()
      this.titlevals = '修改'
      this.seaves = false
      this.isadds = false
      if (this.ipthas) {
        MsgUtil.warnMsg(this, '智能识别票据，请至票据工作台进行相关处理！')
      } else if (this.ispzh) {
        MsgUtil.warnMsg(this, '银行对账单[' + this.listSelectedRows[0].jyrq + '],单据已生成凭证,请检查')
      } else {
        this.listSelectedRows.forEach(item => {
          this.tabdet = JSON.parse(JSON.stringify(item))
          this.tabdetids = item.busitypetempid
          this.tabdetas = item
        })
        this.riqis()
        this.tabdet.busitempname = this.tabdet.busitypetempid
        this.tabdalog = true
      }

      console.log(this.tableData, 'aaa')
    }

  },
  mounted () {
    if (this.$route.params.action !== undefined) {
      this.refh()
    }
    this.$bus.$on('queryBillInfos', data => {
      console.log(data)
      if (data) {
        this.addpose()
      }
    })
  }

}
</script>

<style lang="less" scoped>
header {
  width: 100%;
  height: 50px;

  display: flex;
  // justify-content: space-between;
  .headerleft {
    width: 36%;
    display: flex;
    /deep/.el-form-item__content{
      width: 70%;
    }
  }
  .headerright {
    width: 62.8%;
    line-height: 50px;
    text-align: right;
    font-size: 14px;
    button {
      margin-left: 1px;
    }
  }
}
.el-table > .warning-row {
  background-color: #f5f7fa;
}
.totle {
  width: 100px;
  height: 30px;
  font-size: 12px;
  color: #fff;
  background: #4f9cd4;
  line-height: 30px;
  text-align: center;
}
// /deep/.el-dialog__body {
//   height: 400px;
//   //  background:#d9ecf6;
// }
/deep/.el-input-number__decrease,
/deep/.el-input-number__increase {
  display: none;
}
</style>
