<template>
  <!-- 页面主体 -->
  <div class="zncs-main" id="zncs-main">
    <div class="zncs-container">
      <!-- 搜索 start -->
      <div class="zncs-container-search">
        <span @click="previousPeriodClick" class="period-arrow period-arrow-left"></span>
        <el-date-picker
          v-model="searchData.period"
          style="width: 120px; vertical-align: middle; font-size: 12px"
          type="month"
          @change="paramChange"
          value-format="yyyy-MM"
          format="yyyy-MM"
          :clearable="false"
          :picker-options="pickerOptions"
          placeholder="选择月" size="small">
        </el-date-picker>
        <span @click="newPeriodClick" class="period-arrow period-arrow-right"></span>
        <el-select style="width: 130px" placeholder="请选择" v-model="searchData.billstate" @change="paramChange">
          <el-option key="0" label="未做账票据" value="0"></el-option>
          <el-option key="1" label="已做账票据" value="1"></el-option>
          <el-option key="2" label="已作废票据" value="2"></el-option>
          <el-option key="4" label="识别中票据" value="4"></el-option>
          <el-option key="3" label="全部票据" value="3"></el-option>
        </el-select>
        <el-input
          v-if="searchData.billstate === '0' || searchData.billstate === '1'"
          class="search-more-input"
          @keyup.enter.native="queryBillsByWhere"
          v-model="seachBillsByWhere.billtitle"
          @change="val => seachBillsByWhere.billtitle = val.replace(/\s*/g,'')"
          placeholder="请输入票据名称"
          style="width: 157px">
          <i
            @click="queryBillsByWhere"
            class="el-icon-search el-input__icon"
            style="cursor: pointer;"
            slot="suffix">
          </i></el-input>
        <el-popover
          v-if="searchData.billstate === '0' || searchData.billstate === '1'"
          placement="bottom"
          trigger="manual"
          title="票据查询"
          v-model="showBillsForm">
          <div style="width: 400px;" class="search-more">
            <el-form label-width="100px" size="small" style="margin: 0 9px" inline-message>
              <el-form-item label="票据类别：">
                <el-select style="width: 100%" v-model="seachBillsByWhere.billtype">
                  <el-option value="全部">全部</el-option>
                  <el-option value="增值税发票">增值税发票</el-option>
                  <el-option value="b银行票据">b银行票据</el-option>
                  <el-option value="c其它票据">c其它票据</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单据类型：">
                <el-input @change="val => seachBillsByWhere.invoicetype = val.replace(/\s*/g,'')" v-model="seachBillsByWhere.invoicetype" placeholder="请输入单据类型"></el-input>
              </el-form-item>
              <el-form-item label="票据名称：">
                <el-input @change="val => seachBillsByWhere.billtitle = val.replace(/\s*/g,'')" v-model="seachBillsByWhere.billtitle" placeholder="请输入票据名称"></el-input>
              </el-form-item>
              <el-form-item label="付款方：">
                <el-input @change="val => seachBillsByWhere.vpurchname = val.replace(/\s*/g,'')" v-model="seachBillsByWhere.vpurchname" placeholder="请输入票据购买方名称"></el-input>
              </el-form-item>
              <el-form-item label="收款方：">
                <el-input @change="val => seachBillsByWhere.vsalename = val.replace(/\s*/g,'')" v-model="seachBillsByWhere.vsalename" placeholder="请输入票据销货方名称"></el-input>
              </el-form-item>
              <el-form-item label="总金额：">
                <el-input v-model="seachBillsByWhere.bntotaltax" @change="changeSearchBntoTaltax" style="width: 132px" placeholder="￥0.00"></el-input> -
                <el-input v-model="seachBillsByWhere.entotaltax" @change="changeSearchEntoTaltax" style="width: 131px" placeholder="￥0.00"></el-input>
              </el-form-item>
              <el-form-item label="开票日期：">
                <el-date-picker v-model="seachBillsByWhere.bdate" type="date" placeholder="选择日期" format="yyyyMMdd" value-format="yyyyMMdd" style="width: 132px"></el-date-picker> -
                <el-date-picker v-model="seachBillsByWhere.edate" type="date" placeholder="选择日期" format="yyyyMMdd" value-format="yyyyMMdd" style="width: 131px"></el-date-picker>
              </el-form-item>
              <el-form-item label="发票真伪：">
                <el-select style="width: 100%" v-model="seachBillsByWhere.truthindent">
                  <el-option value="全部">全部</el-option>
                  <el-option value="真">真</el-option>
                  <el-option value="无查验结果">无查验结果</el-option>
                  <el-option value="假">假</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" style="text-align: right;">
                <el-button type="primary" @click="showBillsForm = false">取消</el-button>
                <el-button type="primary" @click="seachBillsByWhere = {billtype: '全部', truthindent: '全部'}">清除</el-button>
                <el-button type="primary" @click="queryBillsByWhere">确定</el-button>

              </el-form-item>
            </el-form>
          </div>
          <el-button slot="reference" @click="showBillsForm = !showBillsForm"  style="margin-left: -10px; line-height: 12px; font-size: 13px;">更多</el-button>
        </el-popover>

        <el-button-group v-if="searchData.billstate === '0' ||  searchData.billstate === '1'">
          <el-button @click="showModeType = 0, folderBillDetails = []" :type="showModeType === 0 ? 'primary' : '' " style="font-size: 13px; line-height: 12px;">
            <img v-if="showModeType === 1" src="@/assets/column.png" alt="">
            <img v-else src="@/assets/_column.png" alt="">
          </el-button>
          <el-button @click="showModeType = 1" :type="showModeType === 1 ? 'primary' : '' " style="font-size: 13px; line-height: 12px;">
            <img v-if="showModeType === 0" src="@/assets/list-column.png" alt="">
            <img v-else src="@/assets/_list-column.png" alt="">
          </el-button>
        </el-button-group>
        <!--        <el-button type="primary" icon="el-icon-setting" @click="settings">设置引导</el-button>-->
        <el-radio-group @change="billStateChange" v-model="billStateForImage" v-if="searchData.billstate === '3'">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="未做账"></el-radio-button>
          <el-radio-button label="已做账"></el-radio-button>
          <el-radio-button label="已作废"></el-radio-button>
          <el-radio-button label="识别中"></el-radio-button>
        </el-radio-group>

        <div v-if="searchData.billstate === '0' || searchData.billstate === '1'" style="display: inline-block; float: right; margin-right: 10px">
          <el-button  @click="paramChange">刷新</el-button>
          <el-button  @click="getCompanyType('all')" v-if="companyType !== 0 && searchData.billstate !== '1'" >存货</el-button>
          <el-button  @click="voucherClick('all')" v-if="searchData.billstate !== '1'">智能做账</el-button>
          <el-button  @click="queryBillCount">统计分析</el-button>
          <el-dropdown split-button  style="margin-left: 10px">
            更多
            <el-dropdown-menu slot="dropdown" class="pjgzt-more">
              <el-dropdown-item v-if="searchData.billstate !== '1'"><div @click="finishingDirectory({period: searchData.period})">整理分类</div></el-dropdown-item>
              <el-dropdown-item divided v-if="searchData.billstate !== '1'"><div @click="checkCategory">检测分类</div></el-dropdown-item>
              <el-dropdown-item divided v-if="searchData.billstate !== '1'"><div @click="settings">设置引导</div></el-dropdown-item>

              <el-popover
                placement="left"
                trigger="hover"
                popper-class="instructions-pop"
                title="">
                <img src="../../../../assets/instructions.png" alt="">
                <el-dropdown-item slot="reference" divided v-if="searchData.billstate !== '1'"><div>快捷键操作</div></el-dropdown-item>
              </el-popover>

              <el-dropdown-item divided ><div @click="exportBillAll">下载全部票据</div></el-dropdown-item>
              <el-dropdown-item divided ><a class="dzffpsm-download" href="http://download.dazhangfang.com/vas/dzffpsm.exe" target="_blank" style='font-size:14px'>扫描客户端下载</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="searchData.billstate === '2' || searchData.billstate === '3' || searchData.billstate === '4'" style="display: inline-block; float: right; margin-right: 10px">
          <el-button type="primary" v-if="searchData.billstate === '3'" @click="billStateChange(billStateForImage)">刷新</el-button>
          <el-button type="primary" v-if="searchData.billstate === '2' || searchData.billstate === '4'" @click="paramChange()">刷新</el-button>
          <el-dropdown split-button type="primary" v-if="searchData.billstate !== '4' && billStateForImage !== '识别中'">
            更多
            <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
              <el-dropdown-item v-if="searchData.billstate === '3' && billStateForImage === '未做账'">
                <div @click="invalidBillForImage" v-if="searchData.billstate === '3' && billStateForImage === '未做账'">作废</div>
              </el-dropdown-item>
              <el-dropdown-item :divided="searchData.billstate === '3' && billStateForImage === '未做账'" v-if="searchData.billstate === '3' && billStateForImage === '未做账'">
                <div @click="changePeoridforImage" v-if="searchData.billstate === '3' && billStateForImage === '未做账'">跨期</div>
              </el-dropdown-item>
              <el-dropdown-item :divided="searchData.billstate === '3' && billStateForImage === '未做账'" v-if="searchData.billstate !== '4' && billStateForImage !== '识别中'">
                <div @click="exportBillForImage" v-if="searchData.billstate !== '4' && billStateForImage !== '识别中'">下载</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 搜索 end -->
      <div class="zncs-container-body" @click="containerClick">
        <div class="zncs-container-b-scroll">
          <template v-if="showModeType === 0">
            <div class="bills-num" style="line-height: 42px; text-align: left; font-size: 14px; padding-left: 11px;">
              <div v-if="searchData.billstate === '2' || searchData.billstate === '3' || searchData.billstate === '4'">
                <el-checkbox :indeterminate="indeterminateCheck" v-model="isCheckAll" @change="checkAll" style="margin-right: 30px">全选</el-checkbox> 共: {{allImgList.length}}张
              </div>
            </div>
            <div class="folder-list-wrap clearfix" v-if="searchData.billstate === '0' || searchData.billstate === '1'" style="overflow-y: auto">
              <div class="folder-list" v-for="(level, lindex) in folderData" :key="lindex">
                <div class="folder-total">共:{{level.total}}票据
                </div>
                <div class="folder-list-content">
                  <ul>
                    <li
                      :class="'folder-item ' + (col_ids[lindex + 1] && (col_ids[lindex + 1].indexOf(itemIdx) !== -1 ? 'folder-actives' : ''))"
                      v-for="(item, itemIdx) in level.folderList"
                      :key="item.id" @mousedown="mousedownItem(lindex + 1, item, itemIdx ,$event)"
                      @click="getFolderData(lindex + 1, item, itemIdx ,$event)">
                      <div style="margin-left: -20px; padding-left: 20px;" v-contextmenu="{val: item, ref: 'contextmenu'}">
                      <span class="folder-name"
                            :class="item.categorytype === 0 ? (item.billcount > 0 ? 'folder-en' : 'folder-dis') : (item.billcount > 0 ? 'folder-lock-en' : 'folder-lock-dis')"
                            v-if="item.itype === 0">
                        <el-tooltip v-if="item.categoryname.length > 8" class="item" effect="light" :content="item.categoryname + '(' + item.billcount + ')'" placement="right">
                           <span style="display: inline-block; width: 180px">{{item.categoryname + '(' + item.billcount + ')'}}</span>
                        </el-tooltip>
                        <div v-if="item.categoryname.length <= 8">
                          {{item.categoryname + '(' + item.billcount + ')'}}
                        </div>
                      </span>
                        <el-tooltip v-if="item.errorcount > 0 && item.itype === 0" class="item" effect="light" :content="'问题(' + item.errorcount + ')'" placement="right">
                          <i @click="getBillErrorInfo(item)" class="el-icon-warning-outline" style="position: absolute; right: 28px; top: 12px; cursor: pointer"></i>
                        </el-tooltip>
                        <i class="el-icon-caret-right" v-if="item.itype !== 1"></i>
                      </div>

                      <div v-if="item.itype === 1"
                           @dblclick="openbillDetailDialog(item)"
                           @click="folderData.splice(lindex + 1, 1)"
                           v-contextmenu="{val: item, ref: 'contextmenu2'}">
                        <div style="display: inline-block; height: 25px; height: 41px; float: left; cursor: pointer">
                          <i @click="showDetailedBill(item)" style=""
                             :class="(item.isDetailed ? 'el-icon-caret-bottom' : 'el-icon-caret-right') + (item.rowcount < 2 ? ' iocn-disable' : '')"></i>
                        </div>
                        <span class="folder-name bill-en">
                          <div v-if="item.billtitle && item.billtitle.length > 8">
                            <el-popover
                              placement="top-start"
                              trigger="hover"
                              :content="item.billtitle">
                              <span slot="reference">{{item.billtitle }}</span>
                            </el-popover>
                          </div>
                           <span v-else >{{item.billtitle }}</span>
                          <el-tooltip v-if="item.errordesc" class="item" effect="light" :content="item.errordesc" placement="right">
                            <i class="el-icon-warning-outline" style="position: absolute; right: 7px; top: 12px;"></i>
                          </el-tooltip>
                        </span>
                      </div>

                      <template v-if="item.isDetailed">
                        <ul class="show-detailed-bill">
                          <li v-contextmenu="{val: chi, ref: 'menuForDetailed'}" :key="chiIdxDetails" v-for="(chi, chiIdxDetails) in item.detailedChildren">
                            <el-tooltip class="item" effect="light" :content="chi.invname + ' (' + chi.categoryname + ')' " placement="right">
                              <span>{{chi.invname && chi.invname.substring(0, 10)}}{{chi.invname && chi.invname.length > 10 ? '... ' : ' '}}(<b>{{chi.categoryname}})</b></span>
                            </el-tooltip>
                            <p></p>
                          </li>
                        </ul>
                      </template>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </template>
          <template v-if="showModeType === 1">
            <div class="bills-num" style="line-height: 42px; text-align: left; font-size: 14px; padding-left: 11px;">
              <div v-if="searchData.billstate === '2' || searchData.billstate === '3' || searchData.billstate === '4'">
                共: {{allImgList.length}}张
              </div>
            </div>
            <div class="folder-list-wrap clearfix" v-if="searchData.billstate === '0' || searchData.billstate === '1'"
                 style="width: 100%">
              <div class="folder-list" v-for="(level, lindex) in folderData" :key="lindex">
                <div class="folder-total">共:{{level.total}}票据
                </div>
                <div class="folder-list-content tree-list" style="overflow-x: auto">
                  <ul>
                    <li :class="$root.appData.selectTreeItem === item.id ? 'folder-actives' : ''" v-for="(item, itemIdx) in level.folderList"
                        :key="item.id" @mousedown="mousedownItem(1, item, itemIdx ,$event)" >

                      <div class="tree-list-item" @click="getFolderData(lindex + 1, item, itemIdx ,$event)" style="" v-contextmenu="{val: item, ref: 'contextmenu'}">
                        <i :class="item.isOpen ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" style="float: none; cursor: pointer;" v-if="item.itype !== 1"></i>
                        <span class="folder-name"
                              :class="item.categorytype === 0 ? (item.billcount > 0 ? 'folder-en' : 'folder-dis') : (item.billcount > 0 ? 'folder-lock-en' : 'folder-lock-dis')"
                              v-if="item.itype === 0">{{item.categoryname + '(' + item.billcount + ')'}} </span>

                        <el-tooltip v-if="item.errorcount > 0 && item.itype === 0" class="item" effect="light" :content="'问题(' + item.errorcount + ')'" placement="right">
                          <i @click="getBillErrorInfo(item)" class="el-icon-warning-outline" style="position: absolute; right: 8px; top: 12px; cursor: pointer"></i>
                        </el-tooltip>
                      </div>
                      <folderTree :children="item.children" :getFolderDataFun="getFolderData" :Contextmenu="$refs['contextmenu']"></folderTree>
                    </li>
                  </ul>
                </div>
              </div>
              <div style="height: 100%;
                          position: absolute;
                          width: calc(100% - 270px);
                          right: 0px;">
                <div style="height: 100%;">
                  <el-row type="flex" class="bill-details-title" style="height: 42px; line-height: 42px; min-width: 1200px; font-size: 14px">
                    <el-col :span="4">摘要</el-col>
                    <el-col :span="3">付款方</el-col>
                    <el-col :span="4">收款方</el-col>
                    <el-col :span="2">金额</el-col>
                    <el-col :span="2">税额</el-col>
                    <el-col :span="2">税率</el-col>
                    <el-col :span="2">价税合计</el-col>
                    <el-col :span="3">日期</el-col>
                    <el-col :span="3">发票真伪</el-col>
                  </el-row>
                  <div style="overflow: auto;height: calc(100% - 42px); min-width: 1200px;">
                    <el-row
                      type="flex"
                      class="bill-details-list"
                      :class="col_ids[2] && (col_ids[2].indexOf(index) !== -1 ? 'folder-actives' : '')"
                      v-for="(item, index) in folderBillDetails"
                      :key="index" style="min-height: 42px; line-height: 42px">
                      <el-col :span="4">
                        <div style="display: inline-block; height: 25px; height: 42px; float: left; cursor: pointer;">
                          <i @click="showDetailedBill(item, folderBillDetails)" style=""
                             :class="(item.isDetailed ? 'el-icon-caret-bottom' : 'el-icon-caret-right') + (item.rowcount < 2 ? ' iocn-disable' : '')"></i>
                        </div>
                        <span @dblclick="openbillDetailDialog(item)" v-contextmenu="{val: item, ref: 'contextmenu2'}" @mousedown="mousedownItem(2, item, index ,$event)" :class="col_ids[2] && (col_ids[2].indexOf(index) !== -1 ? 'folder-actives' : '')" style=" padding-left: 26px;
                                      overflow: hidden;
                                      text-overflow: clip;
                                      width: calc(100% - 24px);
                                      display: block;
                                      text-overflow: ellipsis;
                                      white-space: nowrap;
                                      height: 41px;
                                      position: relative;
                                  " class="folder-name bill-en">
                        <div v-if="item.billtitle && item.billtitle.length > 8">
                          <el-popover
                            placement="top-start"
                            trigger="hover"
                            :content="item.billtitle">
                            <span slot="reference">{{item.billtitle }}</span>
                          </el-popover>
                        </div>
                         <span v-else>{{item.billtitle }}</span>
                          <el-tooltip v-if="item.errordesc" class="item" effect="light" :content="item.errordesc" placement="right">
                          <i class="el-icon-warning-outline" style="position: absolute; top: 13px; right: 5px;"></i>
                        </el-tooltip>
                      </span>
                        <template v-if="item.isDetailed">
                          <div style="position: absolute;
                                      width: 100%;
                                      top: 42px;
                                      background: white;
                                      margin-left: -5px;" class="currentd-detailed-bill">
                            <el-row class="currentd-detailed-bill-row" :key="currentIdx" v-for="(currentItem, currentIdx) in currentDetailedBill">
                              <el-col :span="4" style="text-align: right">&nbsp;</el-col>
                              <el-col :span="3" style="text-align: right">&nbsp;</el-col>
                              <el-col :span="3" style="text-align: right">&nbsp;</el-col>
                              <el-col :span="2" style="text-align: right">{{currentItem.itemmny | forThousands}}&nbsp;</el-col>
                              <el-col :span="2" style="text-align: right">&nbsp; <span v-if="currentItem.itemtaxmny">{{currentItem.itemtaxmny | forThousands}} </span></el-col>
                              <el-col :span="2" style="text-align: right">{{currentItem.itemtaxrate}}&nbsp;</el-col>
                              <el-col :span="2" style="text-align: right">
                                <!--<a href="">{{(Number(currentItem.itemmny || 0) + Number(currentItem.itemtaxmny || 0)).toFixed(2) | forThousands}}&nbsp;</a>-->
                                &nbsp; <span v-if="item.istate.indexOf('增值税发票') !== -1"> {{(Number(currentItem.itemmny || 0) + Number(currentItem.itemtaxmny || 0)).toFixed(2) | forThousands}}&nbsp; </span>
                              </el-col>
                              <el-col :span="3" style="font-size: 14px!important; text-align: left">
                                <!--{{item.dinvoicedate}}&nbsp;-->
                                <span v-if="item.dinvoicedate && item.dinvoicedate.indexOf('年') !== -1">{{item.dinvoicedate.replace('年', '-').replace('月', '-').replace('日', '')}}</span>
                                <span v-if="item.dinvoicedate && item.dinvoicedate.length === 8">{{item.dinvoicedate.substring(0, 4)}}-{{item.dinvoicedate.substring(4, 6)}}-{{item.dinvoicedate.substring(6, 8)}}</span>
                              </el-col>
                              <el-col :span="3" style="font-size: 14px!important; text-align: left">
                                &nbsp;
                              </el-col>
                            </el-row>
                          </div>
                          <ul class="show-detailed-bill" style="width: 100%!important; margin-left: -22px; z-index: 99; position: relative;">
                            <li v-contextmenu="{val: chi, ref: 'menuForDetailed'}" :key="chiIdxDetails" v-for="(chi, chiIdxDetails) in item.detailedChildren">
                              <el-tooltip class="item" effect="light" :content="chi.invname + ' (' + (chi.categoryname || '') + ')' " placement="right">
                                <span style="width: 100%!important">{{chi.invname.substring(0, 10)}}{{chi.invname.length > 10 ? '... ' : ' '}}(<b>{{chi.categoryname}})</b></span>
                              </el-tooltip>
                              <p></p>
                            </li>
                          </ul>
                        </template>
                      </el-col>
                      <el-col :span="3" style="text-align: left">
                        <el-tooltip class="item" effect="light" :content="item.vpurchname" placement="left">
                          <span style="width: 100%!important">{{item.vpurchname}}</span>
                        </el-tooltip>
                      </el-col>
                      <el-col :span="3" style="text-align: left">
                        <el-tooltip class="item" effect="light" :content="item.vsalename" placement="top">
                          <span style="max-width: 100%!important; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{item.vsalename}}</span>
                        </el-tooltip>
                      </el-col>
                      <!--                      <el-col :span="2" style="text-align: right">{{(item.istate.indexOf('增值税发票') === -1 ? item.ntotaltax : item.nmny) | forThousands}}</el-col>-->
                      <el-col :span="2" style="text-align: right">{{(item.istate.indexOf('增值税发票') === -1 ? item.nmny : item.nmny) | forThousands}}</el-col>
                      <el-col :span="2" style="text-align: right">
                        <span v-if="item.istate.indexOf('增值税发票') !== -1"> {{item.ntaxnmny | forThousands}}</span>
                        <span v-else> {{item.ntaxnmny | forThousands}}</span>
                      </el-col>

                      <el-col :span="2" style="text-align: right">{{(item.istate.indexOf('增值税发票') !== -1 ? item.taxrate : '')}}</el-col>
                      <el-col :span="2" style="text-align: right">&nbsp;
                        <span v-if="item.istate.indexOf('增值税发票') !== -1"> {{item.ntotaltax | forThousands }} </span>
                        <span v-else> {{item.ntotaltax | forThousands }} </span>
                      </el-col>
                      <el-col :span="3">
                        <span v-if="item.dinvoicedate && item.dinvoicedate.indexOf('年') !== -1">{{item.dinvoicedate.replace('年', '-').replace('月', '-').replace('日', '')}}</span>
                        <span v-if="item.dinvoicedate && item.dinvoicedate.length === 8">{{item.dinvoicedate.substring(0, 4)}}-{{item.dinvoicedate.substring(4, 6)}}-{{item.dinvoicedate.substring(6, 8)}}</span>
                      </el-col>
                      <el-col :span="3">
                        {{ item.truthindent}}
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="searchData.billstate === '2' || searchData.billstate === '3' || searchData.billstate === '4'" class="list-images" style="overflow: auto; text-align: left; height: calc(100% - 42px);">
            <el-checkbox-group v-model="checkedImg" @change="checkedImgChange">
              <div :key="idx" v-for="(item, idx) in allImgList" style="display: inline-block">
                <div class="img-list-item"
                     :style="'position: relative;display: inline-block;width: 275px; height: 210px; margin: 10px; ' + (item.status === 0 ? 'border: 1px solid #c0c4cc; ' : 'border: 2px solid #409EFF;  ')">
                  <el-checkbox :label="item.imgname+idx" :key="item.imgsourid" style="float: left; margin-left: 9px; margin-top: 5px;"></el-checkbox>
                  <img style="position: absolute; display: block; top: 80px; left: 61px;" v-if="item.istate === '0'" src="@/assets/img/sbz.png" alt="">
                  <img style="position: absolute; display: block; top: 80px; left: 61px;" v-if="item.istate === '1'" src="@/assets/img/yzf.png" alt="">
                  <img style="position: absolute; display: block; top: 80px; left: 61px;" v-if="item.istate === '2'" src="@/assets/img/wzz.png" alt="">
                  <img style="position: absolute; display: block; top: 80px; left: 61px;" v-if="item.istate === '3'" src="@/assets/img/yzz.png" alt="">
                  <div  v-viewer="{url: 'data-source'}" style="width: 100%; height: 100%; cursor: pointer">
                    <img @click="clickShowImg(item)"
                         style="display: block;
                                width: 256px;
                                height: 170px;
                                border: 1px solid #c0c4cc;
                                margin: 28px auto;" class="bill-img"
                         :data-source="imgUrlBase + '?id=' + item.imgsourid + '&name=' + item.imgname + '&pk_corp=' + item.corpId + '&X-Login-Corp='+usercorp+'&X-Login-Date='+userdata+'&X-Login-User='+user+'&X-ACCESS-TOKEN='+usertoken"
                         :src="imgUrlBase + '?id=' + item.imgsourid + '&name=' + item.imgname + '&pk_corp=' + item.corpId + '&isSmall=Y&X-Login-Corp='+usercorp+'&X-Login-Date='+userdata+'&X-Login-User='+user+'&X-ACCESS-TOKEN='+usertoken" alt="">
                  </div>
                </div>
                <p v-if="item.webid" style="text-align: center; font-size: 14px">图片id: {{item.webid}}</p>
              </div>
            </el-checkbox-group>
            <div style="height: 42px;"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 页面主体 end -->
    <!-- 弹框  -->
    <el-dialog :close-on-click-modal="false" @close="beforeCloseBillInfo" id="dialog-bill-Info" class="dialog-bill-Info"  :visible.sync="billDetailDialogVisible"
               style="text-align: center">
      <div style="height: 502px;border: 1px solid #c5c5c5; margin: auto;">
        <div style="width: calc(100% - 370px); height: 100%; overflow-y: auto;margin: 0 auto; float: left; padding: 10px;">
          <viewer style="width: 100%; height: 100%; cursor: pointer">
            <img
              :src="imgUrlBase + '?id=' + billDetailInfo.imgsourid + '&name=' + billDetailInfo.imgname + '&pk_corp=' + billDetailInfo.corpId+'&X-Login-Corp='+usercorp+'&X-Login-Date='+userdata+'&X-Login-User='+user+'&X-ACCESS-TOKEN='+usertoken"
              style="max-width: 100%; max-height: 100%"/>
          </viewer>
        </div>
        <div style="width: 370px;overflow-y: auto;float: right;height:500px; border-left: 1px solid #c5c5c5;">
          <div style="padding: 8px; border-bottom: 1px solid #c5c5c5;background: #2c9dd8; text-align: left; color: white">
            <h3  style="line-height: 19px;">票据信息 <i
              v-if="searchData.billstate != 1"
              @click="editBillDetai" style="float: right; cursor: pointer;" class="el-icon-edit-outline">{{!isBillInfoFormEdit
              ? '编辑' : '保存'}}</i></h3>
          </div>
          <el-form ref="form" style="height: calc(100% - 36px); overflow: auto;" label-position="left" class="bill-info-form" size="mini" :model="billInfoForm" label-width="120px">
            <el-form-item :key="key"
                          v-for="(bv, key) in billInfoFormRule[billDetailInfo.invoicvo && billDetailInfo.invoicvo.istate]"
                          style="padding: 0 10px;"
                          :label="bv.field !== 'children' ? bv.label + (bv.field === 'errordesc' || bv.field === 'errordesc2' ? '' : ':') : ''">
<!--              v-if="billDetailInfo.invoicvo[bv.field] !== undefined"-->
              <template v-if="bv.field !== 'children'">
                <template v-if="bv.TagType !== undefined">
                  <el-select
                    :class="!isBillInfoFormEdit ? 'ready-bill-info' : ''"
                    v-model="billDetailInfo.invoicvo[bv.field]"
                    style="width: 100%"
                    :disabled="!isBillInfoFormEdit"
                    v-if="billDetailInfo.invoicvo && bv.TagType === 'select'"
                    @change="biilInfoStatusChange">
                    <el-option label="增值税发票" value="增值税发票"></el-option>
                    <el-option label="b银行票据" value="b银行票据"></el-option>
                    <el-option label="c其它票据" value="c其它票据"></el-option>
                  </el-select>
                  <el-date-picker
                    size="mini"
                    :clearable="false"
                    :class="!isBillInfoFormEdit ? 'ready-bill-info' : ''"
                    format="yyyy年MM月dd日"
                    value-format="yyyy年MM月dd日"
                    v-model="billDetailInfo.invoicvo[bv.field]"
                    :disabled="!isBillInfoFormEdit"
                    style="width: 100%"
                    v-if="billDetailInfo.invoicvo && bv.TagType === 'datePicker'">
                  </el-date-picker>
                </template>
                <template v-else>
                  <div v-if="bv.field === 'errordesc2' || bv.field === 'errordesc'" v-show="billDetailInfo.invoicvo[bv.field]" style="margin-left: -120px;">
                    <i class="el-icon-warning-outline errordesc-icon"></i>
                    <label style="color: red">{{billDetailInfo.invoicvo[bv.field]}}</label>
                  </div>
                  <div v-else :id="'more_input_' + key"
                       :class="(!isBillInfoFormEdit || bv.isReadOnly ? 'ready-bill-info' : '') + ' show-more'">
                    <el-input resize="none"
                              size="mini"
                              autosize
                              @change="billInfoChange"
                              :type="!isBillInfoFormEdit ? 'text' : 'textarea'"
                              :readonly="!isBillInfoFormEdit || bv.isReadOnly"
                              :style="(bv.field === 'errordesc' ? 'color: red;' : '') + ';text-align: left; ' + (bv.field === 'errordesc' ? 'color:red!important;' : '') + ' font-size: 14px; overflow: hidden'"
                              v-if="billDetailInfo.invoicvo"
                              v-model="billDetailInfo.invoicvo[bv.field]">
                      <i v-if="getBLen(billDetailInfo.invoicvo[bv.field]) > 24" title="查看更多"
                         @click="showMore('more_text_' + key, 'more_input_' + key)"
                         class="el-icon-more el-input__icon"
                         slot="suffix">
                      </i>
                    </el-input>
                  </div>
                  <div :id="'more_text_' + key"
                       :style="'font-weight: 400; display: none;' + (!isBillInfoFormEdit || bv.isReadOnly ? 'display: none;' : '')"
                       class="more-text">{{billDetailInfo.invoicvo[bv.field]}}</div>
                </template>
              </template>
              <template v-else>
                <div style="min-height: 50px; margin-left: -120px;">
                  <!--<el-menu @open="menuSelect">-->
                  <div v-if="chiObj.dr === 0" :key="chiKey" v-for="(chiObj, chiKey) in billDetailInfo.invoicvo.children">
                    <div :style="'width: 106%; margin: 0 -10px;' + (chiKey === 0 ? 'border-top: 1px solid #60626647;' : '')" class="product-list">
                      <el-input :class="!isBillInfoFormEdit ? 'ready-bill-info' : ''"
                                type="text"
                                :readonly="!isBillInfoFormEdit"
                                :style="'text-align: left; color: #0C0C0C; font-size: 14px; width: 250px; padding-left: 0;margin-left: -47px;'"
                                v-model="chiObj.invname"></el-input>
                      <div class="edit-bill-list" >
                        <i @click="clickMeunItemDel(chiKey), countTotal()" :style="!isBillInfoFormEdit ? 'visibility: hidden;' : ''" class="el-icon-remove-outline"></i>
                        <i @click="clickMeunItemAdd(chiKey), countTotal()" :style="!isBillInfoFormEdit ? 'visibility: hidden;' : ''" class="el-icon-circle-plus-outline"></i>
                        <i class="el-icon-caret-bottom" style="cursor: pointer" @click="clickMeunItemShow(chiKey)"></i>
                      </div>
                      <div style="display: none" :id="'productList_' + chiKey">
                        <el-form-item style="padding-left: 60px" :key="chiIdx" v-for="(chiObjKey, chiIdx) in bv.children" :label="chiObjKey.label + ':'">
                          <el-input :class="!isBillInfoFormEdit ? 'ready-bill-info' : ''"
                                    @change="countTotal(chiObjKey.field)"
                                    type="text"
                                    :readonly="!isBillInfoFormEdit"
                                    v-if="chiObjKey"
                                    v-model="chiObj[chiObjKey.field]"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="创建规则" :visible.sync="ruleDialogVisible" width="1200px" style="text-align: center;">
      <Rule :folderInfo="curFolder" v-if="ruleDialogVisible" style="width:1160px;height:580px;overflow:hidden;overflow-y:auto;background:#fff;margin-top:4px;"></Rule>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="设置向导" custom-class="settings-dialog" :visible.sync="settingsVisible" width="1200px" style="text-align: center;">
      <Settings v-if="settingsVisible" style="width:1160px;height:580px;overflow:hidden;overflow-y:auto;background:#fff;margin-top:4px;"></Settings>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="智能凭证" :modal='false' custom-class="settings-dialog" :visible.sync="voucherVisible"  width="1160px" style="text-align: center;">
      <Voucher :folderInfo="curFolder" :voucherList="voucherList"  v-if="voucherVisible" style="width:1160px;height:580px;overflow:hidden;overflow-y:auto;background:#fff;margin-top:4px;"></Voucher>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="智能凭证检测" custom-class="settings-dialog" width="1200px" :visible.sync="detectionVisible"  style="text-align: center;">
      <voucherDetection :errorRows="errorRows" :voucherList="voucherList" :folderInfo="curFolder" v-if="detectionVisible"></voucherDetection>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="移动到" :visible.sync="moveToDialogVisible" width="500px" height="700px">
      <FolderMoveTo :folderInfo="curFolder" v-if="moveToDialogVisible"></FolderMoveTo>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="匹配存货" width="1150px" :visible.sync="matchInventoryShow">
      <matchInventory  v-if="matchInventoryShow" :companyType="companyType" @listenStatus="listenStatus"></matchInventory>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="detectionTitle" :visible.sync="isCheckCategory" width="1200px" height="300px" :modal-append-to-body = 'appendBody'>
      <el-table
        :data="checkCategoryData"
        border
        highlight-current-row
        size="mini"
        style="width: 100%"
        height="380"
        :header-cell-style="{background:'#d9ecf6', color: '#333', fontSize: '14px'}"
      >
        <el-table-column
          type=index
          width="50"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="webid"
          align="center"
          label="图片ID">
        </el-table-column>
        <el-table-column
          prop="billtitle"
          align="center"
          label="票据名称">
        </el-table-column>
        <el-table-column
          prop="categoryname"
          align="center"
          label="分类名称">
        </el-table-column>
        <el-table-column
          prop="errordesc"
          align="center"
          label="问题描述">
        </el-table-column>
        <el-table-column
          prop="address"
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="font-size: 14px;" @click="showAddress(scope.row)" type="text" size="small">查看位置</el-button>
            <el-button style="font-size: 14px;" @click="openbillDetailDialogForCheckCategory(scope.row)" type="text" size="small">查看票据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="票据查询" :visible.sync="isBillQuery" width="1200px" height="330px" :modal-append-to-body = 'appendBody'>
      <el-table
        :data="queryBillList"
        border
        highlight-current-row
        size="mini"
        style="width: 100%"
        height="350"
        :header-cell-style="{background:'#d9ecf6', color: '#333', fontSize: '14px'}"
      >
        <el-table-column
          type=index
          width="50"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="billtitle"
          align="center"
          tooltip-effect="light"
          show-overflow-tooltip
          width="120"
          label="摘要">
        </el-table-column>
        <el-table-column
          prop="vpurchname"
          align="center"
          width="120"
          tooltip-effect="light"
          show-overflow-tooltip
          label="付款方">
        </el-table-column>
        <el-table-column
          prop="vsalename"
          align="center"
          width="120"
          tooltip-effect="light"
          show-overflow-tooltip
          label="收款方">
        </el-table-column>
        <el-table-column
          prop="nmny"
          align="center"
          label="金额">
        </el-table-column>
        <el-table-column
          prop="ntaxnmny"
          align="center"
          label="税额">
        </el-table-column>
        <el-table-column
          prop="ntotaltax"
          align="center"
          label="价税合计">
        </el-table-column>
        <el-table-column
          prop="dinvoicedate"
          align="center"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="address"
          width="180"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button style="font-size: 14px;" @click="showAddress(scope.row)" type="text" size="small">查看位置</el-button>
            <el-button style="font-size: 14px;" @click="openbillDetailDialogForCheckCategory(scope.row)" type="text" size="small">查看票据</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="编辑分类" :visible.sync="newFolderDialogVisible" width="500px">
      <el-form :model="folderFormData" label-width="100px" style="overflow: auto; padding-right: 20px;" :rules="newFolderRules" ref="folderForm" size="mini">
        <el-form-item  label="分类名称" prop="categoryname">
          <el-input :disabled="curFolder.categorytype === 0" v-model="folderFormData.categoryname" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item v-if="curFolder.categorycode && curFolder.categorycode.substring(0, 2) === '15' && curFolder.isleaf === '是'" label="使用年限" prop="zjnx">
          <el-input @change="zjnxChange(folderFormData.zjnx)" v-model="folderFormData.zjnx" placeholder="使用年限"></el-input>
          <label style="position: absolute;
                        right: -18px;
                        top: -1px;">月</label>
        </el-form-item>
        <el-form-item v-if="curFolder.categorycode && curFolder.categorycode.substring(0, 2) === '15' && curFolder.isleaf === '是'" label="残值率" prop="czl">
          <el-input @change="czlChange(folderFormData.czl)" v-model="folderFormData.czl" placeholder="残值率"></el-input>
          <label style="position: absolute;
                        right: -18px;
                        top: -1px;">%</label>
        </el-form-item>
        <el-form-item v-if="curFolder.categorycode && curFolder.categorycode.substring(0, 2) !== '19'" label="结算方式" prop="jsfs">
          <el-select v-model="folderFormData.jsfs" placeholder="请选择结算方式" style="width: 100%;">
            <el-option label="往来结算" :value="0"></el-option>
            <el-option label="现金结算" :value="1"></el-option>
            <el-option label="银行结算" :value="2"></el-option>
          </el-select>
          <el-popover
            placement="right-start"
            trigger="hover">
            <div>
              <p>现金结算:该分类下的所有票据将通过“库存现金”或其下级明细科目入账;</p>
              <p>银行结算:该分类下的所有票据将通过“银行存款”或其下级明细科目入账;</p>
              <p>往来结算:该分类下的所有票据将通过往来科目或其下级明细科目入账;</p>
            </div>
            <i slot="reference" class="el-icon-warning-outline" style="position: absolute; right: -20px; top: 4px; cursor: pointer; font-size: 18px;"></i>
          </el-popover>
        </el-form-item>
        <el-form-item v-if="!(curFolder.categorycode && curFolder.categorycode.substring(0, 2) === '15' && curFolder.isleaf === '是')" label="合并方式" prop="hbfs">
          <el-select v-model="folderFormData.hbfs" @change="hbfsChange" placeholder="请选择结算方式" style="width: 100%;">
            <el-option label="不合并" :value="0"></el-option>
            <el-option label="合并凭证" :value="1"></el-option>
            <!--            <el-option label="合并分录及凭证" :value="2"></el-option>-->
          </el-select>
          <el-popover
            placement="right-start"
            trigger="hover">
            <div>
              <p>不合并:分类下票据智能做账时一张票据对应一张凭证;</p>
              <p>合并凭证:分类下票据智能做账时将合并生成一张凭证，区分专普票，凭证内分录行自动合并</p>
            </div>
            <i slot="reference" class="el-icon-warning-outline" style="position: absolute; right: -20px; top: 4px; cursor: pointer; font-size: 18px;"></i>
          </el-popover>
        </el-form-item>
        <div v-if="curFolder.iseditacc === '是'">
          <el-form-item v-if="curFolder.categorycode && curFolder.categorycode.substring(0, 2) !== '19'" label="入账科目">
            <el-cascader
              clearable
              filterable
              style="width: 100%;"
              :value="folderFormData.rzkm2"
              :options="kmList"
              @active-item-change="handleItemChange"
              :props="kmProps"
              @change="changeRzkm"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item v-if="curFolder.categorycode && curFolder.categorycode.substring(0, 2) !== '19'" label="结算科目">
            <el-cascader
              clearable
              filterable
              style="width: 100%;"
              :value="folderFormData.jskm2"
              :options="kmList"
              @active-item-change="handleItemChange"
              :props="kmProps"
              @change="changeJskm"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="税行科目"
                        v-if="
                        !(contrastCategorycode === '12' ||
                        contrastCategorycode === '18' ||
                        contrastCategorycode === '17' ||
                        contrastCategorycode === '19')">
            <div class="fzhs"
                 size="mini">
              <el-cascader
                clearable
                filterable
                style="width: 100%;"
                :value="folderFormData.shkm2"
                :options="kmList"
                @active-item-change="handleItemChange"
                :props="kmProps"
                @change="changeShkm"
                :show-all-levels="false"
              ></el-cascader>
            </div>
          </el-form-item>
        </div>
        <el-form-item v-if="!(curFolder.categorycode && curFolder.categorycode.substring(0, 2) === '15' && curFolder.isleaf === '是')" label="辅助核算">
          <el-input :value="folderFormData.isFzhs ? '已关联' : '未关联'" readonly>
            <div slot="suffix">
              <el-switch
                v-model="folderFormData.isFzhs"
                @change="isFzhsChange"
                inactive-color="#e7e9ee">
              </el-switch>
            </div>
          </el-input>
          <el-popover
            placement="right-start"
            trigger="hover">
            <div>
              <p>系统将根据票据信息自动匹配对应辅助核算项，若分类下票据需按统一辅助核算项入账</p>
              <p>可在此设置对应辅助核算内容;</p>
            </div>
            <i slot="reference" class="el-icon-warning-outline" style="position: absolute; right: -20px; top: 4px; cursor: pointer; font-size: 18px;"></i>
          </el-popover>
        </el-form-item>
        <el-form-item label="" v-if="folderFormData.isFzhs">
          <div class="fzhs"
               style="width: 100%;border: 1px solid #bbb;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px; text-align: left;font-size: 14px;padding-top: 10px;"
               size="mini">
            <el-checkbox-group v-model="fzhsChecked" size="mini" @change="changeFzhsChecked">
              <el-checkbox v-for="item in fzhsList" :label="item.id" :key="item.id" style="margin-left: 10px;" border>{{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item v-if="fzhsItemValuesList[item]" :key="item" :label="fzhsDataMap[item] ? fzhsDataMap[item].name : ''" v-for="item in fzhsChecked2">
          <div style="display: none">
            {{fzhsItemValuesList[item] ? (fzhsItemValuesList[item].map(m => m.id).includes(fzhsDataMap[item].selVal) || (fzhsDataMap[item].selVal = '') ) : ''}}
          </div>
          <el-select v-model="fzhsDataMap[item].selVal" style="width: 100%;">
            <el-option :label="item2.name" :value="item2.id" v-for="item2 in fzhsItemValuesList[item]"
                       :key="item2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :prop="curFolder.categorytype === 1 ? 'zdyzyRe' : 'zdyzy'" label="自定义摘要">
          <el-input type="textarea" @change="zdyzyChange" v-model="folderFormData.zdyzy"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button @click="newFolderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFolder">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="跨期" :visible.sync="intertemporalDialog" width="500px">
      <el-form size="mini" :rules="intertemporalFormRules" :model="intertemporalFormData" ref="intertemporalRef" label-width="100px" style="padding-right: 135px">
        <!--<div style="color: #e6a23c"><i class="el-icon-warning-outline" style="margin-right: 15px"></i>提示：此操作不可恢复，请谨慎操作</div>-->
        <el-form-item label="跨期日期:" prop="intertemporalDate">
          <el-date-picker
            :default-value="jzdate"
            size="mini"
            :picker-options="pickerOptions"
            v-model="intertemporalFormData.intertemporalDate"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button @click="intertemporalDialog = false">取 消</el-button>
        <el-button type="primary" @click="intertemporalASave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="统计分析" :visible.sync="statisticalAnalysisShow" width="1160px" >
      <div style="width:1160px;height:500px;">
         <statisticalAnalysis :folderInfo="curFolder" v-if="statisticalAnalysisShow" style="width:1160px;height:580px;overflow:hidden;overflow-y:auto;background:#fff;margin-top:4px;"></statisticalAnalysis>
         </div>
    </el-dialog>
    <el-dialog  :close-on-click-modal="false" title="创建分类" width="500px" :visible.sync="newClassificationVisible" style="text-align: center">
      <el-form size="mini" :rules="classificationFormRules" :model="classificationFormData" ref="newClassificationRef" label-width="100px" style="padding-right: 80px">
        <el-form-item label="分类名称:" prop="newClassificationName">
          <el-input v-model="classificationFormData.newClassificationName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">

        <el-button @click="newClassificationVisible = false">取 消</el-button>
        <el-button type="primary" @click="newClassificationSave">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog ref="companyDialogRef" :close-on-click-modal="false" title="选择公司" width="460px" :visible.sync="crossCompanyVisible" class="cross-company" style="text-align: center">
       <input style="text-align: center;
    margin: 7px 30px;
    width: 80%;
    border-radius: 4px;
    border: 1px solid #a1a3a9;
    padding: 5px;" @input="changeComp" placeholder="按编码、名称查询"></input>
      <el-table ref="companyRef" :data="companyList" highlight-current-row @current-change="companyCurrentChange" style="width: 100%" height="320">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column label="公司编码" show-overflow-tooltip prop="incode">
        </el-table-column>
        <el-table-column label="公司名称" show-overflow-tooltip prop="uname">
        </el-table-column>
        <el-table-column label="公司性质" show-overflow-tooltip prop="chname">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">

        <el-button @click="crossCompanyVisible = false">取 消</el-button>
        <el-button type="primary" @click="crossCompanySave">确定</el-button>
      </div>
    </el-dialog>
    <!-- 弹框 end -->

    <!-- 右键功能 -->
    <Contextmenu ref="contextmenu_new" :theme="theme" @show="rightMenuShow">
    </Contextmenu>
    <!--票据右键-->
    <Contextmenu ref="contextmenu2" :theme="theme" @show="rightMenuShow">
      <ContextmenuItem @click="openbillDetailDialog" :disabled="curFolder.id && curFolder.id.split(',').length > 1">打开</ContextmenuItem>
      <ContextmenuItem @click="exportBill">下载</ContextmenuItem>
      <!--<ContextmenuItem :disabled="searchData.billstate === '1'" @click="handleClick">打散</ContextmenuItem>-->
      <ContextmenuItem divider></ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate === '1'" @click="voucherClick">智能做账</ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate === '1'" @click="manualVoucherClick(false)">手动凭证</ContextmenuItem>
      <ContextmenuItem divider></ContextmenuItem>
      <!--<ContextmenuItem :disabled="searchData.billstate === '1'" @click="handleClick">选择合并票据</ContextmenuItem>-->
      <ContextmenuItem :disabled="searchData.billstate === '1'" @click="invalidBill">作废</ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate === '1'" @click="changePeorid">跨期</ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate === '1' || (curFolder.categorycode && curFolder.categorycode.substring(0, 2) === '17')" @click="moveToDialogVisible = true">移动到</ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate === '1'" @click="getCompany">跨公司</ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate === '1' || (curFolder.billtitle && curFolder.billtitle === '未识别票据')" @click="addBlackList">添加黑名单</ContextmenuItem>
      <ContextmenuItem divider></ContextmenuItem>
      <ContextmenuItem :disabled="searchData.billstate !== '1'" @click="serVoucherByImagePk">联查凭证</ContextmenuItem>
    </Contextmenu>
    <!--票据分录-->
    <Contextmenu ref="menuForDetailed" :theme="theme" @show="rightMenuShow">
      <ContextmenuItem disabled>打开</ContextmenuItem>
      <ContextmenuItem disabled>下载</ContextmenuItem>
      <ContextmenuItem disabled>打散</ContextmenuItem>
      <ContextmenuItem divider></ContextmenuItem>
      <ContextmenuItem disabled>智能做账</ContextmenuItem>
      <ContextmenuItem disabled>手动凭证</ContextmenuItem>
      <ContextmenuItem disabled divider></ContextmenuItem>
      <ContextmenuItem disabled>选择合并票据</ContextmenuItem>
      <ContextmenuItem disabled>作废</ContextmenuItem>
      <ContextmenuItem disabled>跨期</ContextmenuItem>
      <ContextmenuItem @click="moveToDialogVisible = true" :disabled="searchData.billstate === '1' || (folderData[0] && col_ids[1] && folderData[0].folderList[col_ids[1]] && folderData[0].folderList[col_ids[1]].categorycode == '19')">移动到</ContextmenuItem>
      <!--      || (folderData[0] && col_ids[1] && folderData[0].folderList[col_ids[1]].categorycode === '19')-->
      <ContextmenuItem disabled>添加黑名单</ContextmenuItem>
      <ContextmenuItem divider></ContextmenuItem>
      <ContextmenuItem disabled>联查凭证</ContextmenuItem>
    </Contextmenu>
    <!--分类右键-->
    <Contextmenu ref="contextmenu" :theme="theme" @show="rightMenuShow">
      <ContextmenuItem @click="newClassification"
                       :disabled="curFolder.allowchild !== '是' ||
                        curFolder.isaccount !== '否' ||
                        curFolder.categorytype === 5 ||
                        searchData.billstate === '1'" class="leftMenuItem">新建分类
      </ContextmenuItem>
      <ContextmenuItem @click="openNewFolderDialog(true)"
                       :disabled="curFolder.isaccount === '是' ||
                       curFolder.categoryname === '资产' ||
                       curFolder.categoryname === '固定资产' ||
                       curFolder.categoryname === '无形资产' ||
                       searchData.billstate === '1' ||
                       curFolder.categoryname == '未识别票据' ||
                       curFolder.categoryname == '问题票据' ||
                       curFolder.categorytype === 5
                        ">编辑分类</ContextmenuItem>
      <ContextmenuItem @click="delClassificationSave"
                       :disabled="curFolder.isaccount === '是' || (curFolder.categorytype !== 1 && curFolder.categorytype !== 2) || searchData.billstate === '1'">
        删除分类
      </ContextmenuItem>
      <ContextmenuItem @click="finishingDirectory()" :disabled="
                      curFolder.isaccount === '是' || searchData.billstate === '1' ||
                      (curFolder.categorycode && curFolder.categorycode.substring(0, 2) === '17')"
      >整理分类</ContextmenuItem>
      <ContextmenuItem divider></ContextmenuItem>
      <ContextmenuItem @click="voucherClick" :disabled="searchData.billstate === '1'">智能做账</ContextmenuItem>
      <ContextmenuItem @click="manualVoucherClick(true)" :disabled="searchData.billstate === '1'">手动凭证</ContextmenuItem>
      <ContextmenuItem @click="ruleDialogVisible = true" :disabled="searchData.billstate === '1' || (curFolder.categorycode && curFolder.categorycode.substring(0, 2) !== '19')">编辑规则</ContextmenuItem>
      <ContextmenuItem divider></ContextmenuItem>
      <ContextmenuItem @click="invalidBatchBill" :disabled="curFolder.isaccount === '是' || searchData.billstate === '1'">作废</ContextmenuItem>
      <ContextmenuItem @click="changeBatchPeorid" :disabled="curFolder.isaccount === '是' || searchData.billstate === '1'">跨期</ContextmenuItem>
      <ContextmenuItem @click="handleClick" disabled>移动到</ContextmenuItem>
      <ContextmenuItem @click="updateRetransBill" :disabled="searchData.billstate === '1'">重新识别</ContextmenuItem>
    </Contextmenu>
    <!-- 右键功能 end -->
  </div>
</template>

<script>
import axios from 'axios'
import {postAxios, getAxios, prefix, suffix} from '@/libs/axios'
import {getParams} from '@/libs/tools'
import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuSubmenu,
  ContextmenuGroup
} from '@/components/ContextMenu'
import FolderMoveTo from './components/FolderMoveTo'
import Rule from './components/Bill/Rule.vue'
import Settings from './components/settings'
import Voucher from './components/Voucher'
import voucherDetection from './components/voucherDetection'
import matchInventory from './components/matchInventory'
import statisticalAnalysis from './components/statisticalAnalysis'
import folderTree from './components/folder-tree'
const kmInitData = [
  {
    id: '0',
    codename: '资产',
    accindex: 1,
    children: []
  }, {
    id: '1',
    codename: '负债',
    accindex: 1,
    children: []
  }, {
    id: '2',
    codename: '共同',
    accindex: 1,
    children: []
  }, {
    id: '3',
    codename: '权益',
    accindex: 1,
    children: []
  }, {
    id: '4',
    codename: '成本',
    accindex: 1,
    children: []
  }, {
    id: '5',
    codename: '损益',
    accindex: 1,
    children: []
  }
]
const initFolderFormData = {
  categoryid: '',
  sortNum: 100,
  categoryname: '',
  jsfs: 0,
  hbfs: 0,
  zjnx: 0,
  czl: 0,
  rzkm: '',
  jskm: '',
  shkm: '',
  isFzhs: false,
  rzkm2: [],
  jskm2: [],
  shkm2: [],
  zdyzy: '',
  zdyzyRe: ''
}
export default {
  name: 'billWorkbench',
  components: {
    Contextmenu,
    ContextmenuItem,
    ContextmenuSubmenu,
    ContextmenuGroup,
    FolderMoveTo,
    Rule,
    Settings,
    Voucher,
    matchInventory,
    voucherDetection,
    statisticalAnalysis,
    folderTree
  },
  data () {
    const self = this
    return {
      user: this.$store.getters.getUserId,
      userdata: this.$store.getters.getLoginDate,
      usercorp: this.$store.getters.getLoginCorpId,
      usertoken: this.$store.getters.getToken,
      companyList: [],
      dzf010: 2, // Number((window.top.getCSSZValue && window.top.getCSSZValue('dzf010')) || 2),
      currentTreeRow: {},
      currentDetailedBill: [],
      crossCompanyVisible: false,
      Contextmenu: Contextmenu,
      folderBillDetails: [],
      showModeType: 0,
      jzdate: top.SYSTEM ? top.SYSTEM.jzdate.split('-')[0] : '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(self.$store.state.system.info.jzdate.split('-')[0] + '-' + self.$store.state.system.info.jzdate.split('-')[1])
        }
      },
      billStateForImage: '全部',
      isCheckAll: false,
      checkedImg: [],
      indeterminateCheck: false,
      allImgList: [],
      companyType: -1,
      checkCategoryData: [],
      isCheckCategory: false,
      appendBody: false,
      detectionTitle: '',
      matchInventoryShow: false,
      pkCorp: '',
      intertemporalFormRules: {
        intertemporalDate: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ]
      },
      intertemporalFormData: {
        intertemporalDate: ''
      },
      intertemporalDialog: false,
      classificationFormData: {
        newClassificationName: ''
      },
      classificationFormRules: {
        newClassificationName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      newClassificationVisible: false,
      voucherVisible: false,
      detectionVisible: false,
      isBillInfoFormEdit: false,
      billDetailTab: 'billDetailTab1',
      ruleDialogVisible: false,
      billInfoForm: {
        name: ''
      },
      billInfoFormRule: {
        '未识别票据': [
          {
            label: '',
            field: 'errordesc',
            isReadOnly: true
          },
          {
            label: '',
            field: 'errordesc2',
            isReadOnly: true
          },
          {
            label: '公司编码',
            field: 'corpCode',
            isReadOnly: true
          },
          {
            label: '图片名称',
            field: 'imgname',
            isReadOnly: true
          },
          {
            label: '图片ID',
            field: 'webid',
            isReadOnly: true
          }
        ],
        '问题票据': [
          {
            label: '',
            field: 'errordesc',
            isReadOnly: true
          },
          {
            label: '',
            field: 'errordesc2',
            isReadOnly: true
          },
          {
            label: '公司编码',
            field: 'corpCode',
            isReadOnly: true
          },
          {
            label: '图片名称',
            field: 'imgname',
            isReadOnly: true
          },
          {
            label: '图片ID',
            field: 'webid',
            isReadOnly: true
          }
        ],
        '增值税发票': [
          {
            label: '',
            field: 'errordesc',
            isReadOnly: true
          },
          {
            label: '',
            field: 'errordesc2',
            isReadOnly: true
          },
          {
            label: '公司编码',
            field: 'corpCode',
            isReadOnly: true
          },
          {
            label: '图片名称',
            field: 'imgname',
            isReadOnly: true
          },
          {
            label: '图片ID',
            field: 'webid'
          },
          {
            label: '票据名称',
            field: 'billtitle'
          },
          {
            label: '票据类型',
            field: 'istate',
            // TagType: 'select',
            isReadOnly: true
          },
          {
            label: '单据类型',
            field: 'invoicetype'
          },
          // {
          //   label: '关键字',
          //   field: 'keywords'
          // },
          {
            label: '发票号码',
            field: 'vinvoiceno'
          },
          {
            label: '发票代码',
            field: 'vinvoicecode'
          },
          {
            label: '开票日期',
            field: 'dinvoicedate',
            TagType: 'datePicker'
          },
          {
            label: '销售方名称',
            field: 'vsalename'
          },
          {
            label: '销售方纳税号',
            field: 'vsaletaxno'
          },
          {
            label: '销售方地址电话',
            field: 'vsalephoneaddr'
          },
          {
            label: '销售方开户账号',
            field: 'vsaleopenacc'
          },
          {
            label: '购买方名称',
            field: 'vpurchname'
          },
          {
            label: '购买方纳税号',
            field: 'vpurchtaxno'
          },
          {
            label: '购买方地址电话',
            field: 'vpurphoneaddr'
          },
          {
            label: '购买方开户账号',
            field: 'vpuropenacc'
          },
          {
            label: '备注',
            field: 'vmemo'
          },
          {
            label: '商品',
            field: 'children',
            children: [
              {
                label: '货物或应税劳务名称',
                field: 'invname'
              },
              {
                label: '规格型号',
                field: 'invtype'
              },
              {
                label: '单位',
                field: 'itemunit'
              },
              {
                label: '数量',
                field: 'itemamount'
              },
              {
                label: '单价',
                field: 'itemprice'
              },
              {
                label: '金额',
                field: 'itemmny'
              },
              {
                label: '税率',
                field: 'itemtaxrate'
              },
              {
                label: '税额',
                field: 'itemtaxmny'
              }
            ]
          },
          {
            label: '价税合计',
            isReadOnly: true,
            field: 'ntotaltax'
          },
          {
            label: '发票真伪',
            isReadOnly: true,
            field: 'truthindent'
          }
        ],
        'b银行票据': [
          {
            label: '',
            field: 'errordesc',
            isReadOnly: true
          },
          {
            label: '',
            field: 'errordesc2',
            isReadOnly: true
          },
          {
            label: '公司编码',
            field: 'corpCode',
            isReadOnly: true
          },
          {
            label: '图片名称',
            field: 'imgname',
            isReadOnly: true
          },
          {
            label: '图片ID',
            field: 'webid',
            isReadOnly: true
          },
          {
            label: '票据名称',
            field: 'billtitle'
          },
          {
            label: '交易流水号',
            field: 'uniquecode'
          },
          {
            label: '票据类型',
            field: 'istate',
            // TagType: 'select',
            isReadOnly: true
          },
          // {
          //   label: '银行名称',
          //   field: 'vsaleopenacc'
          // },
          {
            label: '单据类型',
            field: 'invoicetype'
          },
          // {
          //   label: '关键字',
          //   field: 'keywords'
          // },
          {
            label: '开票日期',
            field: 'dinvoicedate',
            TagType: 'datePicker'
          },
          {
            label: '付款方名称',
            field: 'vpurchname'
          },
          {
            label: '付款行名称',
            field: 'vpurbankname'
          },
          {
            label: '付款方账号',
            field: 'vpurchtaxno'
          },
          {
            label: '收款方名称',
            field: 'vsalename'
          },
          {
            label: '收款行名称',
            field: 'vsalebankname'
          },
          {
            label: '收款方账号',
            field: 'vsaletaxno'
          },
          {
            label: '商品',
            field: 'children',
            children: [
              {
                label: '摘要',
                field: 'invname'
              },
              {
                label: '金额',
                field: 'itemmny'
              }
            ]
          },
          {
            label: '合计金额',
            isReadOnly: true,
            field: 'ntotaltax'
          },
          {
            label: '备注',
            field: 'vsalephoneaddr'
          }
        ],
        'c其它票据': [
          {
            label: '',
            field: 'errordesc',
            isReadOnly: true
          },
          {
            label: '',
            field: 'errordesc2',
            isReadOnly: true
          },
          {
            label: '公司编码',
            field: 'corpCode',
            isReadOnly: true
          },
          {
            label: '图片名称',
            field: 'imgname',
            isReadOnly: true
          },
          {
            label: '图片ID',
            field: 'webid',
            isReadOnly: true
          },
          {
            label: '票据名称',
            field: 'billtitle'
          },
          {
            label: '票据类型',
            field: 'istate',
            // TagType: 'select',
            isReadOnly: true
          },
          {
            label: '单据类型',
            field: 'invoicetype'
          },
          // {
          //   label: '关键字',
          //   field: 'keywords'
          // },
          {
            label: '开票日期',
            field: 'dinvoicedate',
            TagType: 'datePicker'
          },
          {
            label: '收款方名称',
            field: 'vsalename'
          },
          {
            label: '付款方名称',
            field: 'vpurchname'
          },
          {
            label: '姓名',
            field: 'staffname'
          },
          // {
          //   label: '出发地',
          //   field: 'vsalename'
          // },
          // {
          //   label: '目的地',
          //   field: 'vpurchname'
          // },
          {
            label: '金额',
            field: 'nmny'
          },
          {
            label: '税额',
            field: 'ntaxnmny'
          },
          {
            label: '价税合计',
            field: 'ntotaltax',
            isReadOnly: true
          },
          {
            label: '备注',
            field: 'vsalephoneaddr'
          }
        ]
      },
      imgUrlBase: prefix + '/zncs/gl_imgview/search' + suffix,
      billDetailDialogVisible: false,
      moveToDialogVisible: false,
      billDetailInfo: {},
      billDetailInfoKey: [],
      kmList: [...kmInitData],
      tishi: '',
      kmProps: {
        value: 'id',
        label: 'codename',
        children: 'children',
        checkStrictly: true
      },
      newFolderDialogVisible: false,
      statisticalAnalysisShow: false,
      curFolder: {},
      folderFormData: initFolderFormData,
      newFolderRules: {
        categoryname: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}
        ],
        sortNum: [
          {required: true, message: '请输入排序值', trigger: 'change'}
        ],
        jsfs: [
          {required: true, message: '请选择结算方式', trigger: 'change'}
        ],
        hbfs: [
          {required: true, message: '请选择合并方式', trigger: 'change'}
        ],
        zdyzyRe: [
          {required: true, message: '请添写自定义摘要', trigger: 'blur'}
        ],
        zdyzy: [
          {required: false, message: '请添写自定义摘要', trigger: 'blur'}
        ],
        zjnx: [
          {required: false, message: '请添写使用期限', trigger: 'blur'}
        ],
        czl: [
          {required: false, message: '请添写残值率', trigger: 'blur'}
        ]
      },
      fzhsDataMap: {}, // 辅助核算 key,value
      fzhsChecked: [], // 已选择的辅助核算项
      fzhsChecked2: [],
      fzhsCheckedSelVal: [], // 已选择的辅助核算项
      fzhsItemValuesList: {}, // 辅助核算项下拉内容
      fzhsList: [], // 辅助核算项
      theme: 'default',
      folderData: [],
      disabled: true,
      lindex: 0,
      searchData: {
        period: this.$store.state.system.loginDate.substring(0, 7),
        billstate: '0'
      },
      jzrqDate: '2010-01',
      col_ids: [[], [], []],
      settingsVisible: false,
      errorRows: {},
      voucherList: {},
      seachBillsByWhere: {
        billtype: '全部',
        truthindent: '全部'
      },
      showBillsForm: false,
      isBillQuery: false,
      queryBillList: []
    }
  },
  computed: {
    contrastCategorycode () {
      return this.curFolder.categorycode ? this.curFolder.categorycode.substring(0, 2) : ''
    }
  },
  directives: {
    contextmenu: directive
  },
  methods: {
    changeComp (val) {
      this.companyList = this.companyListCopy.filter(f => {
        return f.incode.indexOf(val.target.value) !== -1 || f.uname.indexOf(val.target.value) !== -1
      })
    },
    companyCurrentChange (val) {
      this.currentCompanyRow = val
    },
    crossCompanySave () {
      if (!this.currentCompanyRow) {
        this.$message.error('请选择公司')
        return false
      }
      const loading = this.$loading({
        lock: true,
        text: '正在处理',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      postAxios('/zncs/gl_imageuplad/beforeCheck', {
        selMon: this.$store.state.system.loginDate.split('-')[1],
        selYear: this.$store.state.system.loginDate.split('-')[0],
        pk_corp: this.currentCompanyRow.pk_gs}).then((res) => {
        if (!res.success) {
          loading.close()
          this.$message.error(res.msg)
          return
        }
        postAxios('/zncs/workbench/changeCorp_long', {
          ids: this.curFolder.id,
          corpid: this.currentCompanyRow.pk_gs,
          period: this.searchData.period
        }).then((res) => {
          loading.close()
          if (res.success) {
            this.$message.success(res.msg)
            this.crossCompanyVisible = false
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    getCompany () {
      getAxios('/sm_user/gsQuery').then(res => {
        if (res.success) {
          // isCheckCategory checkCategoryData
          if (res.success) {
            this.companyList = res.rows
            this.companyListCopy = JSON.parse(JSON.stringify(res.rows))
            this.$nextTick(nt => {
              this.$refs.companyRef.setCurrentRow(this.companyList[0])
            })
            this.crossCompanyVisible = true
          } else {
            this.$message.error(res.msg)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    containerClick () {
      this.showBillsForm = false // 关闭更多查询
    },
    changeSearchBntoTaltax (val) {
      if (isNaN(val) || Number(val) === 0) {
        this.$set(this.seachBillsByWhere, 'bntotaltax', undefined)
      } else {
        this.seachBillsByWhere.bntotaltax = Number(val).toFixed(2)
      }
    },
    changeSearchEntoTaltax (val) {
      if (isNaN(val) || Number(val) === 0) {
        this.$set(this.seachBillsByWhere, 'entotaltax', undefined)
      } else {
        this.seachBillsByWhere.entotaltax = Number(val).toFixed(2)
      }
    },
    /**
       * 更多查询
       */
    queryBillsByWhere () {
      this.seachBillsByWhere.period = this.searchData.period
      this.seachBillsByWhere.billstate = this.searchData.billstate
      this.showBillsForm = false
      postAxios('/zncs/workbench/queryBillsByWhere', this.seachBillsByWhere).then(res => {
        if (res.success) {
          // isCheckCategory checkCategoryData
          if (res.success) {
            this.isBillQuery = true
            this.queryBillList = res.rows
          } else {
            this.$message.error(res.msg)
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    billInfoChange (val) {
      if (this.billDetailInfo.invoicvo.istate === 'c其它票据') {
        let {nmny = 0, ntaxnmny = 0, ntotaltax = 0} = this.billDetailInfo.invoicvo
        nmny = Number(nmny).toFixed(2)
        ntaxnmny = Number(ntaxnmny).toFixed(2)
        ntotaltax = Number(isNaN(nmny) ? (this.billDetailInfo.invoicvo.nmny = 0.00) : (this.billDetailInfo.invoicvo.nmny = nmny)) + Number(isNaN(ntaxnmny) ? (this.billDetailInfo.invoicvo.ntaxnmny = 0.00) : (this.billDetailInfo.invoicvo.ntaxnmny = ntaxnmny))
        this.billDetailInfo.invoicvo.ntotaltax = ntotaltax.toFixed(2)
      }
    },
    clickShowImg (item) {
      this.allImgList.forEach(ev => {
        ev.status = 0
      })
      item.status = 1
    },
    hbfsChange () {
      if (this.folderFormData.hbfs === 2) {
        this.curFolder.categorytype = 1
        if (!this.folderFormData.zdyzy) {
          this.folderFormData.zdyzy = this.folderFormData.defzy
          this.folderFormData.zdyzyRe = this.folderFormData.defzy
        }
      } else {
        this.curFolder.categorytype = 0
      }
    },
    countTotal (val) {
      if (this.billDetailInfo.invoicvo.istate === 'c其它票据') {
        return
      }
      let ntotaltax = 0
      let nmny = 0
      let ntaxnmny = 0
      let mmnyPrefix = ''
      this.billDetailInfo.invoicvo.children.forEach(item => {
        item.itemmny && (mmnyPrefix = item.itemmny.replace(/[^a-zA-Z]/ig, '') || mmnyPrefix)
        item.itemmny && (item.itemmny = Number(item.itemmny.replace(/[^0-9.]/ig, '')).toFixed(2))
        item.itemtaxmny && (item.itemtaxmny = isNaN(Number(item.itemtaxmny).toFixed(2)) ? 0 : Number(item.itemtaxmny).toFixed(2))
        if (!isNaN(Number(item.itemmny)) && item.dr !== 1) {
          ntotaltax += isNaN((Number(item.itemmny || 0) + Number(item.itemtaxmny || 0))) ? 0 : (Number(item.itemmny || 0) + Number(item.itemtaxmny || 0))
          nmny += isNaN(Number(item.itemmny)) ? 0 : Number(item.itemmny)
          item.itemmny = isNaN(item.itemmny) ? 0 : mmnyPrefix + ' ' + item.itemmny
          ntaxnmny += isNaN(Number(item.itemtaxmny || 0)) ? 0 : Number(item.itemtaxmny || 0)
        }
      })
      this.$set(this.billDetailInfo.invoicvo, 'ntotaltax', mmnyPrefix + '' + ntotaltax.toFixed(2))
      this.$set(this.billDetailInfo.invoicvo, 'nmny', nmny.toFixed(2))
      this.$set(this.billDetailInfo.invoicvo, 'ntaxnmny', ntaxnmny.toFixed(2))
      if (this.billDetailInfo.invoicvo.children && this.billDetailInfo.invoicvo.children.length) {
        this.$set(this.billDetailInfo.invoicvo, 'taxrate', this.billDetailInfo.invoicvo.children[this.billDetailInfo.invoicvo.children.length - 1].itemtaxrate)
        for (var idx in this.billDetailInfo.invoicvo.children) {
          if (this.billDetailInfo.invoicvo.children[idx].dr !== 1) {
            this.$set(this.billDetailInfo.invoicvo, 'taxrate', this.billDetailInfo.invoicvo.children[idx].itemtaxrate)
            break
          }
        }
      }
    },
    czlChange (item) {
      if (isNaN(item)) {
        this.folderFormData.czl = 0
      } else {
        this.folderFormData.czl = Number(item) < 0 ? 0 : Number(item).toFixed(0)
      }
    },
    zjnxChange (item) {
      if (isNaN(item)) {
        this.folderFormData.zjnx = 0
      } else {
        this.folderFormData.zjnx = Number(item) < 0 ? 0 : Number(item).toFixed(0)
      }
    },
    showDetailedBill (e, list) {
      if (e.rowcount < 2) {
        return
      }
      let tempDetailed = e.isDetailed
      this.currentDetailedBill = []
      list && list.forEach(ev => {
        ev.isDetailed = false
      })
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      e.isDetailed = !tempDetailed
      postAxios('/zncs/workbench/queryInvoicDetails', {pk_bill: e.id}).then(res => {
        loading.close()
        if (res.success) {
          this.$set(e, 'detailedChildren', res.rows)
          this.currentDetailedBill = res.rows
        }
      }).catch(e => {
        loading.close()
      })
    },
    billStateChange (e) {
      let para = {
        period: this.searchData.period
      }
      switch (e) {
        case '全部':
          delete para.istate
          break
        case '未做账':
          para.istate = 900
          break
        case '已做账':
          para.istate = 100
          break
        case '已作废':
          para.istate = 205
          break
        case '识别中':
          para.istate = 206
          break
      }
      const loading = this.$loading({
        lock: true,
        text: '正在加载',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      this.$set(this, 'allImgList', [])
      postAxios('/zncs/workbench/queryBatchBillByState', para).then(res => {
        loading.close()
        if (res.success) {
          res.rows.forEach(ev => {
            ev.isCheck = true
          })
          this.allImgList = res.rows
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        loading.close()
      })
    },
    checkedImgChange (e) {
      // e.length === this.allImgList.length || e.length === 0 ? (this.indeterminateCheck = false, this.isCheckAll = true) : this.indeterminateCheck = true
      if (e.length === this.allImgList.length) {
        this.indeterminateCheck = false
        this.isCheckAll = true
      } else if (e.length === 0) {
        this.isCheckAll = false
        this.indeterminateCheck = false
      } else {
        this.indeterminateCheck = true
      }
    },
    checkAll (e) {
      if (e) {
        this.allImgList.forEach(item => {
          // item.isCheck = e
          this.checkedImg.push(item.imgname)
        })
        this.indeterminateCheck = false
        this.isCheckAll = true
      } else {
        this.checkedImg = []
        this.isCheckAll = false
        this.indeterminateCheck = false
      }
    },
    // 点击存货触发 getCompanyType
    getInventory (ids) {
      ids === 'all' && (this.curFolder.ids = '')
      if (this.companyType === 1) {
        // const loading = this.$loading({
        //     lock: true,
        //     text: '正在加载',
        //     spinner: 'el-icon-loading',
        //     background: 'rgba(0, 0, 0, 0.7)'
        // })
        let params = {
          period: this.searchData.period,
          ids: this.curFolder.ids
        }
        this.matchInventoryShow = true
        // postAxios('/zncs/workbench/getGoodsInvenRela', params).then(res => {
        //   loading.close()
        //   if (res.success) {
        //     this.matchInventoryShow = true
        //   } else {
        //     this.$message.error(res.msg)
        //   }
        //   this.loading = false
        // }).catch((error) => {
        //   loading.close()
        //   this.$message.error(error)
        // })
      } else {
        let params = {
          // categoryid: '003xwb00000001tiKbWJ00AL',
          ids: this.curFolder.ids,
          period: this.searchData.period,
          isshow: 'Y'
        }
        // postAxios('/zncs/workbench/matchInventoryData_long', params).then(res => {
        //   loading.close()
        //   if (res.success) {
        //     this.matchInventoryShow = true
        //   } else {
        //     this.$message.error(res.msg)
        //   }
        // }).catch((error) => {
        //   loading.close()
        //   this.$message.error(error)
        // })
        this.matchInventoryShow = true
      }
    },
    listenStatus (bool) {
      this.matchInventoryShow = bool
    },
    finishingDirectory (val) {
      this.$confirm('是否按系统规则整理票据分类?', '整理分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // iconClass: 'el-icon-warning-outline',
        // center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在整理',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let param = {
          period: this.searchData.period,
          categoryid: this.curFolder.id
        }
        postAxios('/zncs/workbench/updateCategoryAgain', val || param).then(res => {
          loading.close()
          if (res.success) {
            this.$message.success(res.msg)
            this.getFolderData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          loading.close()
          this.$message.error(error)
        })
      }).catch(() => {

      })
    },
    settings () {
      this.settingsVisible = true
    },
    showMore (id, inputId) {
      document.getElementById(id).style.display = 'block'
      document.getElementById(inputId).style.display = 'none'
    },
    getBLen (str) {
      if (!str) {
        return undefined
      }
      var len = 0
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i)
        if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          len++
        } else {
          len += 2
        }
      }
      return len
    },
    beforeCloseBillInfo () {
      this.isBillInfoFormEdit = false
    },
    clickMeunItemShow (e) {
      if (!this.billDetailInfo.invoicvo.children[e].isShow) {
        document.getElementById('productList_' + e).style.display = 'block'
      } else {
        document.getElementById('productList_' + e).style.display = 'none'
      }
      this.billDetailInfo.invoicvo.children[e].isShow = !this.billDetailInfo.invoicvo.children[e].isShow
    },
    clickMeunItemAdd (e) {
      this.billDetailInfo.invoicvo.children.push({
        invname: '',
        invtype: '',
        itemamount: '',
        itemmny: '',
        itemprice: '',
        itemtaxmny: '',
        itemtaxrate: '',
        itemunit: '',
        dr: 0
      })
    },
    clickMeunItemDel (e) {
      const list = this.billDetailInfo.invoicvo.children.filter(e => {
        return e.dr === 0
      })
      if (list.length === 1) {
        this.$message.error('最少为一条')
        return
      }
      if (this.billDetailInfo.invoicvo.children[e].dr === 0) {
        this.billDetailInfo.invoicvo.children[e].dr = 1
      } else {
        this.billDetailInfo.invoicvo.children.length > 1 && this.billDetailInfo.invoicvo.children.splice(e, 1)
      }
    },
    menuSelect (e) {
      return false
    },
    biilInfoStatusChange (e) {
      this.billDetailInfo.invoicvo.istate = e
    },
    editBillDetai  () {
      console.log(this.tishi)
      if (this.tishi !== '' && this.tishi !== undefined) {
        this.$message.error(this.tishi)
      } else {
        debugger
        if (this.isBillInfoFormEdit) {
          let param = {
            head: {},
            body: []
          }
          for (let key in this.billDetailInfo.invoicvo) {
            key !== 'children' && (param.head[key] = this.billDetailInfo.invoicvo[key])
          }
          if (this.billDetailInfo.invoicvo.istate === 'c其它票据') {
            this.billDetailInfo.invoicvo.children && this.billDetailInfo.invoicvo.children.length && this.billDetailInfo.invoicvo.children.forEach((f) => {
              f.dr = 1
            })
          }
          param.head = JSON.stringify(param.head)
          param.body = JSON.stringify(this.billDetailInfo.invoicvo.children)
          const loading = this.$loading({
            lock: true,
            text: '正在保存',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          postAxios('/zncs/workbench/saveOcrInvoiceVO', param).then(res => {
            loading.close()
            if (res.success) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              const idxCol = this.col_ids.length - 2
              const idxItem = this.folderData[idxCol - 1].folderList[this.col_ids[idxCol]]
              this.getFolderData(idxCol, this.showModeType === 0 ? idxItem : this.currentTreeRow)
            } else {
              debugger
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        } else {
          const moreTextEles = document.getElementsByClassName('more-text')
          const showMoreEles = document.getElementsByClassName('show-more')
          for (let mEle in moreTextEles) {
            if (moreTextEles[mEle].nodeType === 1) {
              moreTextEles[mEle].style.display = 'none'
            }
          }
          for (let sEle in showMoreEles) {
            if (showMoreEles[sEle].nodeType === 1) {
              showMoreEles[sEle].style.display = 'block'
            }
          }
        }
        this.isBillInfoFormEdit = !this.isBillInfoFormEdit
      }
    },
    getBillErrorInfo (item) {
      this.$set(this, 'detectionTitle', '问题列表')
      const loading = this.$loading({
        lock: true,
        text: '正在处理',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      postAxios('/zncs/workbench/queryErrorDetails',
        {
          period: this.searchData.period,
          id: item.id,
          code: item.categorycode,
          pk_parent: item.pk_parentcategory,
          billstate: 0
        }).then(res => {
        loading.close()
        if (res.success) {
          this.isCheckCategory = true
          setTimeout(tiem => {
            this.$message.success(res.msg)
          }, 200)
          this.checkCategoryData = res.rows
          // this.getFolderData()
        } else {
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        this.$message.error('访问出错!')
      })
    },
    checkCategory () {
      this.$set(this, 'detectionTitle', '检测分类')
      this.$confirm('是否重新检测票据分类?', '检测分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // iconClass: 'el-icon-warning-outline',
        // center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在处理',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        postAxios('/zncs/workbench/checkCategory', {period: this.searchData.period}).then(res => {
          loading.close()
          if (res.success) {
            setTimeout(ev => {
              this.$message.success(res.msg)
            }, 100)
            this.isCheckCategory = true
            this.checkCategoryData = res.rows
            this.getFolderData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          this.$message.error(error)
        })
      }).catch(() => {
      })
    },
    exportBillAll () {
      // let iframe = document.createElement('iframe')
      // iframe.style.width = '0px'
      // iframe.style.height = '0px'
      // iframe.style.display = 'none'
      // iframe.onload = (ev) => {
      //   let objRes = JSON.parse(iframe.contentDocument.body.innerText)
      //   if (objRes.success) {
      //     this.$message.success(objRes.msg)
      //   } else {
      //     this.$message.error(objRes.msg)
      //   }
      //   document.body.removeChild(iframe)
      // }
      // iframe.src = prefix + '/zncs/workbench/exportBill' + suffix + '?period=' + this.searchData.period
      // document.body.appendChild(iframe)
      axios({
        method: 'GET',
        url: prefix + '/zncs/workbench/exportBill',
        params: {
          period: this.searchData.period
        },
        headers: {
          'X-Login-User': this.$store.getters.getUserId,
          'X-Login-Date': this.$store.getters.getLoginDate,
          'X-Login-Corp': this.$store.getters.getLoginCorpId,
          'X-ACCESS-TOKEN': this.$store.getters.getToken
        },
        responseType: 'blob'
      }).then(response => {
        console.log(response)
        let blob = new Blob([response.data], {type: 'application/zip'})
        let url = window.URL.createObjectURL(blob)
        window.location.href = url
      }).catch(error => this.$message.error('下载失败'))
      //  getAxios('/zncs/workbench/exportBill?period=' + this.searchData.period).then(res => {
      //   // if(res.success){
      //     let blob = new Blob([response.data], {type: 'application/zip'})
      //     let url = window.URL.createObjectURL(blob)
      //     window.location.href = url
      //   // }else{
      //   //   this.$message.error(res.msg)
      //   // }
      // }).catch(error => this.$message.error(error) )
    },
    exportBillForImage () {
      if (this.checkedImg.length === 0) {
        this.$message.error('请选择票据')
      } else {
        this.curFolder.id = this.checkedImg.join(',')
        this.exportBill()
      }
    },
    exportBill () {
      // let iframe = document.createElement('iframe')
      // iframe.style.width = '0px'
      // iframe.style.height = '0px'
      // iframe.style.display = 'none'
      // iframe.onload = (ev) => {

      //   let objRes = JSON.parse(iframe.contentDocument.body.innerText)
      //   if (objRes.data.success) {
      //     this.$message.success(objRes.data.msg)
      //   } else {
      //     this.$message.error(objRes.data.msg)
      //   }
      //   document.body.removeChild(iframe)
      // }
      // iframe.src = prefix + '/zncs/workbench/exportBill?ids=' + this.curFolder.id + '&period=' + this.searchData.period
      // document.body.appendChild(iframe)
      axios({
        method: 'GET',
        url: prefix + '/zncs/workbench/exportBill',
        params: {
          ids: this.curFolder.id,
          period: this.searchData.period
        },
        headers: {
          'X-Login-User': this.$store.getters.getUserId,
          'X-Login-Date': this.$store.getters.getLoginDate,
          'X-Login-Corp': this.$store.getters.getLoginCorpId,
          'X-ACCESS-TOKEN': this.$store.getters.getToken
        },
        responseType: 'blob'
      }).then(response => {
        console.log(response)
        let blob = new Blob([response.data], {type: 'application/zip'})
        let url = window.URL.createObjectURL(blob)
        window.location.href = url
      }).catch(error => this.$message.error('下载失败'))
    },
    showAddress (row) {
      if (this.showModeType === 1) {
        this.showModeType = 0
      }
      this.isCheckCategory = false
      this.isBillQuery = false
      const idsArr = row.ocraddress.split(',')
      this.idxArr = 0
      idsArr.push(row.pk_invoice)
      let selectFolderList = (e) => {
        if (!this.folderData[this.idxArr]) {
          return
        }
        for (let chi = 0; chi < this.folderData[this.idxArr].folderList.length; chi++) {
          if (idsArr[this.idxArr] === this.folderData[this.idxArr].folderList[chi].id) {
            this.col_ids[this.idxArr + 1] = [chi]
            this.curFolder = this.folderData[this.idxArr].folderList[chi]
            break
          }
        }
        this.idxArr++
      }
      let selectErrRow = (e) => {
        selectFolderList()
        if (this.idxArr < idsArr.length) {
          this.getFolderData(this.idxArr, this.curFolder, null, null, selectErrRow)
        }
      }
      selectErrRow()
    },
    openbillDetailDialogForCheckCategory (row) {
      this.curFolder.id = row.pk_invoice
      this.openbillDetailDialog()
    },
    openbillDetailDialog  (item) {
      item = item || {}
      this.billDetailTab = 'billDetailTab1'
      postAxios('/zncs/workbench/queryBillInfo', {id: item.id || this.curFolder.id}).then(res => {
        this.tishi = res.data.message
        if (res.success) {
          if (res.data.invoicvo.istate === 'b银行票据') {
            !res.data.invoicvo.vpurchtaxno && (res.data.invoicvo.vpurchtaxno = '')
            !res.data.invoicvo.vsalename && (res.data.invoicvo.vsalename = '')
          }
          if (res.data.invoicvo.istate === 'c其它票据') {
            if (res.data.invoicvo.invoicetype.indexOf('火车票') !== -1 ||
                res.data.invoicvo.invoicetype.indexOf('汽车客票') !== -1 ||
                res.data.invoicvo.invoicetype.indexOf('水路运输客票') !== -1 ||
                res.data.invoicvo.invoicetype.indexOf('航空运输电子客票行程单') !== -1) {
              res.data.invoicvo.nmny = Number(res.data.invoicvo.nmny || '0').toFixed(2)
              res.data.invoicvo.ntaxnmny = Number(res.data.invoicvo.ntaxnmny || '0').toFixed(2)
              res.data.invoicvo.ntotaltax = Number(res.data.invoicvo.ntotaltax || '0').toFixed(2)
            } else {
              res.data.invoicvo.nmny = res.data.invoicvo.ntotaltax
              delete res.data.invoicvo.ntotaltax
              delete res.data.invoicvo.ntaxnmny
            }
            res.data.invoicvo.staffname = res.data.invoicvo.staffname || ''
            if (res.data.invoicvo.invoicetype.indexOf('机打发票') !== -1) {
              delete res.data.invoicvo.staffname
            }
          }
          if (res.data.invoicvo.dinvoicedate) {
            res.data.invoicvo.dinvoicedate = res.data.invoicvo.dinvoicedate.replace(/-/g, '')
            res.data.invoicvo.dinvoicedate && res.data.invoicvo.dinvoicedate.length === 8 && (res.data.invoicvo.dinvoicedate = res.data.invoicvo.dinvoicedate.substring(0, 4) + '年' + res.data.invoicvo.dinvoicedate.substring(4, 6) + '月' + res.data.invoicvo.dinvoicedate.substring(6, 8) + '日')
          }
          this.billDetailDialogVisible = true
          this.billDetailInfo = res.data
          this.billDetailInfo.invoicvo.ntotaltax && (this.billDetailInfo.invoicvo.ntotaltax = this.billDetailInfo.invoicvo.ntotaltax.replace(/\s/g, ''))
          this.billDetailInfo.invoicvo.imgname = res.data.imgname
          this.billDetailInfo.invoicvo.children.forEach(e => {
            e.isShow = false
            e.dr = 0
            e.itemmny && (e.itemmny = Number(e.itemmny || 0).toFixed(2))
            e.itemtaxmny && (e.itemtaxmny = Number(e.itemtaxmny || 0).toFixed(2))
            e.itemprice && (e.itemprice = Number(e.itemprice || 0).toFixed(this.dzf010))
          })
          !this.billDetailInfo.invoicvo.istate && (this.billDetailInfo.invoicvo.istate = '问题票据')
          for (var name in res.data) {
            this.billDetailInfoKey.push(name)
          }
          this.$nextTick(nt => {
            // this.countTotal()
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    changeShkm (val) {
      if (val && val.length > 0) {
        this.folderFormData.shkm = val[val.length - 1]
      } else {
        this.folderFormData.shkm = ''
      }
    },
    changeRzkm (val) {
      if (val && val.length > 0) {
        this.folderFormData.rzkm = val[val.length - 1]
        this.folderFormData.rzkm2 = val[val.length - 1]
      } else {
        this.folderFormData.rzkm = ''
        this.folderFormData.rzkm2 = ''
      }
    },
    changeJskm (val) {
      if (val && val.length > 0) {
        this.folderFormData.jskm = val[val.length - 1]
        this.folderFormData.jskm2 = val[val.length - 1]
      } else {
        this.folderFormData.jskm = ''
        this.folderFormData.jskm2 = ''
      }
    },
    serVoucherByImagePk () {
      // /gl/gl_tzpzact!serVoucherByImagePk
      postAxios('/voucher-manage/voucher/serVoucherByImagePk', {pk_tzpz_h: this.curFolder.pk_image_library}).then(res => {
        this.$message.success(res.msg)
        if (res.success) {
          parent.VCHID_DATA = [res.rows[0].id]
          const id = res.rows[0].id
          // parent.addTab('凭证', 'gl/gl_pzgl/gl_tzpz.jsp', id, 'voucherDetail')
          this.$router.push({
            name: 'voucher-edit',
            params: {
              id: id
            }
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    openNewFolderDialog (isUpdate) {
      let arrSend = []
      for (let idx in this.kmList) {
        arrSend.push(this.handleItemChange(this.kmList[idx].id))
      }
      axios.all(arrSend).then(axios.spread(resArr => {
        postAxios('/zncs/workbench/queryEditDirection', {id: this.curFolder.id}).then(res => {
          if (!res.data) {
            this.folderFormData.jsfs = 0
            this.folderFormData.hbfs = 0
            this.folderFormData.categoryid = this.curFolder.id
            this.folderFormData.categoryname = this.curFolder.categoryname
            delete this.folderFormData.primaryKey
          } else {
            this.$nextTick(nt => {
              this.folderFormData.categoryid = res.data.categoryid
              this.folderFormData.primaryKey = res.data.primaryKey
              this.folderFormData.categoryname = this.curFolder.categoryname
              this.folderFormData.jsfs = res.data.jsfs
              this.folderFormData.hbfs = res.data.hbfs
              this.folderFormData.zjnx = res.data.zjnx
              this.folderFormData.czl = res.data.czl
              this.folderFormData.rzkm = res.data.rzkm ? getFullIdByTree(res.data.rzkm, this.kmList) : []
              this.folderFormData.jskm = res.data.jskm ? getFullIdByTree(res.data.jskm, this.kmList) : []
              this.folderFormData.shkm = res.data.shkm ? getFullIdByTree(res.data.shkm, this.kmList) : ''
              this.folderFormData.rzkm2 = res.data.rzkm ? getFullIdByTree(res.data.rzkm, this.kmList) : []
              this.folderFormData.jskm2 = res.data.jskm ? getFullIdByTree(res.data.jskm, this.kmList) : []
              this.folderFormData.shkm2 = res.data.shkm ? getFullIdByTree(res.data.shkm, this.kmList) : []

              this.folderFormData.defzy = res.data.defzy
              this.folderFormData.zdyzy = res.data.zdyzy
              this.folderFormData.zdyzyRe = res.data.zdyzy
              if (res.data.children && res.data.children.length > 0) {
                this.initFzhsList().then(resList => {
                  setTimeout(ev => {
                    this.changeFzhsChecked(this.fzhsChecked)
                  }, 100)
                  for (let chi in res.data.children) {
                    this.fzhsChecked.push(res.data.children[chi].da)
                    this.fzhsChecked2.push(res.data.children[chi].da)
                    this.fzhsDataMap[res.data.children[chi].da].selVal = res.data.children[chi].daz
                  }
                })
                this.folderFormData.isFzhs = true
              }
              if (res.data.hbfs === 2) {
                this.curFolder.categorytype = 1
              }
            })
          }
        })
      }))
      this.newFolderDialogVisible = true
    },
    handleItemChange (val) {
      !this.kmList[parseInt(val[0])] && (this.kmList[parseInt(val[0])] = {})
      !this.kmList[parseInt(val[0])].children && (this.kmList[parseInt(val[0])].children = [])
      if (val && val.length === 1 && !this.kmList[parseInt(val[0])].children.length) {
        //  去服务器请求 accindex=1&sort=kmbm
        return getAxios('/bdset/gl_cpacckmact/queryByPkcorp2', {accindex: val[0], sort: 'kmbm'}).then(res => {
          if (res.success) {
            this.kmList[parseInt(val[0])].children = res.rows
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          this.$message.error(error)
        })
      }
    },
    rightMenuShow (item) {
      this.curFolder = JSON.parse(JSON.stringify(item.menuData))
      if (this.showModeType === 1) {
        if (this.col_ids[2] && this.col_ids[2].length > 1) {
          let rightList = []
          let billtitles = []
          for (let col in this.col_ids[2]) {
            rightList.push(this.folderBillDetails[this.col_ids[2][col]].id)
            billtitles.push(this.folderBillDetails[this.col_ids[2][col]].billtitle)
          }
          this.curFolder.id = rightList.join(',')
          this.curFolder.billtitle = billtitles.join(',')
        }
        return
      }
      let curCls = []
      let selectItem = []
      let billtitles = []
      curCls = this.col_ids[this.col_ids.length - 1]
      for (let idx in curCls) {
        this.folderData[this.folderData.length - 1].folderList[curCls[idx]] && selectItem.push(this.folderData[this.folderData.length - 1].folderList[curCls[idx]].id)
        this.folderData[this.folderData.length - 1].folderList[curCls[idx]] && billtitles.push(this.folderData[this.folderData.length - 1].folderList[curCls[idx]].billtitle)
      }
      if ((this.col_ids.length - 1) === this.folderData.length && this.curFolder.itype === 1) {
        this.curFolder.id = Array.from(new Set(selectItem)).join(',')
        this.curFolder.billtitle = Array.from(new Set(billtitles)).join(',')
      }
    },
    voucherClick (isAll) {
      let params
      if (this.curFolder.allowchild) {
        params = {
          parentid: this.curFolder.pk_parentcategory,
          categoryid: this.curFolder.id,
          period: this.searchData.period,
          isforce: 'N'
        }
      } else {
        params = {
          parentid: this.curFolder.pk_parentcategory,
          ids: this.curFolder.id,
          period: this.searchData.period,
          isforce: 'N'
        }
      }
      if (isAll === 'all') {
        params = {
          period: this.searchData.period,
          isforce: 'N'
        }
      }
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'a',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'custom-makeAccount'
      })
      this.curFolder.pk_bankcode && (params.pk_bankcode = this.curFolder.pk_bankcode)
      // postAxios('/zncs/workbench!makeAccount', params, {}, 600000).then(res => {
      postAxios('/zncs/workbench/makeAccount_long', params, {}, 600000).then(res => {
        loading.close()
        if (res.success) {
          let isErrorVoucher = false
          res.rows.forEach(item => {
            item.showImg = false
          })
          this.voucherList = res.rows
          for (let item in res.data) {
            if (res.data[item].body && res.data[item].body.length > 0) {
              isErrorVoucher = true
              res.data[item].showConut = 5
            }
          }
          if (isErrorVoucher) {
            this.detectionVisible = true
            this.errorRows = res.data
          } else {
            this.voucherVisible = true
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(res => {
        loading.close()
        this.$message.error(res.msg)
      })
    },
    delClassificationSave () {
      this.$confirm('删除后不可恢复，且该分类下所有票据将自动作废', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        postAxios('/zncs/workbench/deleteDirectory', {
          id: this.curFolder.id,
          pid: this.curFolder.pk_parentcategory,
          period: this.searchData.period
        }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.getFolderData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
      })
    },
    intertemporalASave () {
      this.$refs['intertemporalRef'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在处理',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let param
          if (this.intertemporaPeorid) {
            param = {
              period: this.intertemporalFormData.intertemporalDate,
              id: this.curFolder.id,
              pk_parent: this.curFolder.pk_parentcategory,
              oldperiod: this.searchData.period
            }
          } else {
            param = {
              period: this.intertemporalFormData.intertemporalDate,
              ids: this.curFolder.id
            }
          }
          postAxios(this.intertemporaPeorid ? '/zncs/workbench/changeBatchPeorid_long' : '/zncs/workbench/changePeorid_long', param).then(res => {
            loading.close()
            if (res.success) {
              this.$message.success(res.msg)
              // this.getFolderData()
              this.paramChange()
              this.intertemporalDialog = false
            } else {
              this.$message.error(res.msg)
            }
          }).catch((error) => {
            this.$message.error(error)
          })
        }
      })
    },
    newClassificationSave () {
      this.$refs['newClassificationRef'].validate((valid) => {
        if (valid) {
          postAxios('/zncs/workbench/createDirectory', {
            name: this.classificationFormData.newClassificationName,
            pid: this.curFolder.id,
            period: this.searchData.period
          }).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.getFolderData()
              this.newClassificationVisible = false
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
        }
      })
    },
    newClassification (pId) {
      this.newClassificationVisible = true
    },
    invalidBillForImage () {
      if (this.checkedImg.length === 0) {
        this.$message.error('请选择票据')
      } else {
        this.curFolder.id = this.checkedImg.join(',')
        this.invalidBill()
      }
    },
    invalidBill () {
      this.$confirm('单据作废后不可恢复，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在处理',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        postAxios('/zncs/workbench/invalidBill', {ids: this.curFolder.id}).then(res => {
          loading.close()
          if (res.success) {
            this.$message.success(res.msg)
            this.billStateChange(this.billStateForImage)
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          this.$message.error(error)
        })
      }).catch(() => {
      })
    },
    invalidBatchBill () {
      this.$confirm('单据作废后不可恢复，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在处理',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        postAxios('/zncs/workbench/invalidBatchBill',
          {
            period: this.searchData.period,
            pk_corp: this.curFolder.pk_corp,
            id: this.curFolder.id,
            pk_parent: this.curFolder.pk_parentcategory
          }).then(res => {
          loading.close()
          if (res.success) {
            this.$message.success(res.msg)
            this.getFolderData()
          } else {
            this.$message.error(res.msg)
          }
        }).catch((error) => {
          this.$message.error(error)
        })
      }).catch(() => {

      })
    },
    changeBatchPeorid () {
      this.intertemporalDialog = true
      this.intertemporaPeorid = true
    },
    changePeoridforImage () {
      if (this.checkedImg.length === 0) {
        this.$message.error('请选择票据')
      } else {
        this.curFolder.id = this.checkedImg.join(',')
        this.changePeorid()
      }
    },
    changePeorid () {
      this.intertemporalDialog = true
      this.intertemporaPeorid = false
    },
    addBlackList () {
      postAxios('/zncs/workbench/saveBlackList', {names: this.curFolder.billtitle}).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    manualVoucherClick (e) {
      window.top.editVoucherDel = () => {
        this.getFolderData()
      }
      const maps = {
        yh: '', // 银行
        zjx: '', // 进项 -专票
        pjx: '', // 进项-普票
        zxx: '', // 销项-专
        pxx: '' // 销项-普
      }
      let isIntModel = 0
      const loading = this.$loading({
        lock: true,
        text: '正在处理',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let param = {}
      if (e) {
        param = {
          period: this.searchData.period,
          categoryid: this.curFolder.id,
          parentid: this.curFolder.pk_parentcategory
        }
      } else {
        param = {
          period: this.searchData.period,
          ids: this.curFolder.id
        }
      }
      this.curFolder.pk_bankcode && (param.pk_bankcode = this.curFolder.pk_bankcode)

      postAxios('/zncs/workbench/handVoucher', param).then(res => {
        console.log(res, 'aaaa')

        loading.close()
        if (res.success) {
          for (let map in maps) {
            if (res.rows[map]) {
              isIntModel++
              maps['list'] = res.rows[map]
              maps['voucherdate'] = res.rows[map + 'voucherdate']
              maps['voucherno'] = res.rows[map + 'voucherno']
            }
          }
          if (isIntModel > 1) {
            this.curFolder.voucherType = '091'
            this.curFolder.rows = res.rows
            this.voucherVisible = true
          } else {
            let ids = maps.list.map(ev => {
              return ev.imgsourid
            }).join(',')
            let pkIvs = maps.list.map(ev => {
              return ev.invoicvo.pk_invoice
            }).join(',')
            // console.log(ids,pkIvs,maps.voucherdate,maps.voucherno)
            this.$router.push({
              name: 'voucher-edit',
              params: {
                data: {
                  pzh: maps.voucherno,
                  zdrq: maps.voucherdate,
                  userObject: pkIvs,
                  tpgid: ids,
                  preserveCode: true,
                  lydjlx: 'HP110'
                }
              }
            })
            // window.top.addTab('凭证', 'gl/gl_pzgl/gl_tzpz.jsp?from=票据工作台&imgIds=' + ids + '&pk_ivs=' + pkIvs + '&vdate=' + maps.voucherdate + '&pzh=' + maps.voucherno, null, 'voucherDetail')
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateRetransBill () {
      const loading = this.$loading({
        lock: true,
        text: '正在处理',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      postAxios('/zncs/workbench/updateRetransBill', {
        id: this.curFolder.id,
        period: this.searchData.period,
        pk_corp: this.curFolder.pk_corp
      }).then(res => {
        loading.close()
        if (res.success) {
          this.$message.success(res.msg)
          // this.getFolderData()
          this.paramChange()
        } else {
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    handleClick (vm, event) {
    },
    handleSwitchDisabled () {
      this.disabled = !this.disabled
    },
    periodChange (val) {
      this.searchData.period = val
      this.paramChange()
    },
    queryBillCount () {
      if (!this.searchData.period) {
        this.$message.error('请选择区间!')
        return
      }
      this.statisticalAnalysisShow = true
    },
    previousPeriodClick () {
      if (this.searchData.period) {
        if (this.searchData.period.replace('-', '') <= this.$store.getters.currentCorp.bdate.substring(0, 7).replace('-', '')) {
          this.$message.warning('查询日期不能早于建账日期')
          return
        }
        let period = new Date(this.searchData.period.split('-')[0], Number(this.searchData.period.split('-')[1]) - 1, 1)
        this.searchData.period = period.getFullYear() + '-' + (period.getMonth() > 9 ? period.getMonth() : '0' + period.getMonth())
        if (this.searchData.period === '2020-00') {
          this.searchData.period = '2019-12'
        }
        if (this.searchData.billstate === '2' || this.searchData.billstate === '3' || this.searchData.billstate === '4') {
          this.paramChange()
        } else {
          this.getFolderData()
        }
      }
    },
    newPeriodClick () {
      if (this.searchData.period) {
        let period = new Date(this.searchData.period.split('-')[0], Number(this.searchData.period.split('-')[1]), 1)
        const dataStr = period.toLocaleDateString().split('/')
        // this.searchData.period = period.getFullYear() + '-' + (period.getMonth() > 9 ? period.getMonth() : '0' + period.getMonth())
        this.searchData.period = dataStr[0] + '-' + (dataStr[1] > 9 ? dataStr[1] : '0' + dataStr[1])
        if (this.searchData.billstate === '2' || this.searchData.billstate === '3' || this.searchData.billstate === '4') {
          this.paramChange()
        } else {
          this.getFolderData()
        }
      }
    },
    paramChange () {
      this.isCheckAll = false
      this.billStateForImage = '全部'
      this.indeterminateCheck = false
      this.checkedImg = []
      this.col_ids = []
      this.curFolder = {}
      if (this.searchData.billstate === '0' || this.searchData.billstate === '1') {
        this.getFolderData()
      } else if (this.searchData.billstate === '2') {
        postAxios('/zncs/workbench/queryBatchBillByState', {
          period: this.searchData.period,
          istate: 205
        }).then(res => {
          res.rows.forEach(ev => {
            ev.isCheck = false
          })
          if (res.success) {
            this.allImgList = res.rows
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (this.searchData.billstate === '3') {
        postAxios('/zncs/workbench/queryBatchBillByState', {
          period: this.searchData.period
        }).then(res => {
          if (res.success) {
            res.rows.forEach(ev => {
              ev.isCheck = false
            })
            this.allImgList = res.rows
          } else {
            this.$message.error(res.msg)
          }
        })
      } else if (this.searchData.billstate === '4') {
        postAxios('/zncs/workbench/queryBatchBillByState', {
          period: this.searchData.period,
          istate: 206
        }).then(res => {
          res.rows.forEach(ev => {
            ev.isCheck = false
          })
          if (res.success) {
            this.allImgList = res.rows
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    changeFzhsItemChange (val) {
    },
    zdyzyChange () {
      if (this.curFolder.categorytype === 1) {
        this.folderFormData.zdyzyRe = this.folderFormData.zdyzy
      }
    },
    changeFzhsChecked (vals) {
      for (let i = 0; i < vals.length; i++) {
        this.initFzhsItemVales(vals[i], vals)
      }
      if (vals.length === 0) {
        this.fzhsChecked2 = []
      }
      // this.fzhsChecked2 = vals
    },
    isFzhsChange (val) {
      if (val) {
        this.initFzhsList()
      } else {
        this.fzhsChecked = []
        this.fzhsChecked2 = []
      }
    },
    getSubject (arr, key) {
    },
    saveFolder () {
      let strTemp = '['
      for (let idx in this.fzhsChecked) {
        strTemp += (this.folderFormData.primaryKey ? ('{"id":"' + this.folderFormData.primaryKey + '",') : '{') + '"da":"' + this.fzhsChecked[idx] + '","daz":"' + this.fzhsDataMap[this.fzhsChecked[idx]].selVal + '"},'
      }
      if (this.fzhsChecked.length > 0) {
        strTemp = strTemp.substring(0, strTemp.length - 1)
      }
      strTemp += ']'
      this.$refs['folderForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '正在处理',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          let param = {}
          param.head = {...this.folderFormData}
          param.head.rzkm instanceof Array && (param.head.rzkm = param.head.rzkm[param.head.rzkm.length - 1])
          param.head.jskm instanceof Array && (param.head.jskm = param.head.jskm[param.head.jskm.length - 1])
          postAxios('/zncs/workbench/saveEditDirectory', {head: JSON.stringify(param.head), body: strTemp}).then(res => {
            loading.close()
            if (res.success) {
              this.$message.success(res.msg)
              this.newFolderDialogVisible = false
              this.getFolderData()
              setTimeout(t => {
                this.$refs['folderForm'].resetFields()
                this.folderFormData = {
                  categoryid: '',
                  sortNum: 100,
                  categoryname: '',
                  jsfs: 0,
                  hbfs: 0,
                  zjnx: 0,
                  czl: 0,
                  rzkm: '',
                  jskm: '',
                  shkm: '',
                  isFzhs: false,
                  rzkm2: [],
                  jskm2: [],
                  shkm2: [],
                  zdyzy: '',
                  zdyzyRe: ''
                }
                this.fzhsChecked = []
                this.fzhsChecked2 = []
              }, 500)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 初始化辅助核算列表
    initFzhsList () {
      return postAxios('/zncs/workbench/queryFzhsItem').then(res => {
        if (res.success) {
          this.fzhsDataMap = {}
          for (let i = 0; i < res.rows.length; i++) {
            res.rows[i].selVal = ''
            this.fzhsDataMap[res.rows[i].id] = res.rows[i]
          }
          this.fzhsList = res.rows
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 初始化辅助核算项的下拉内容
    initFzhsItemVales (id, vals) {
      if (!this.fzhsItemValuesList[id] || this.fzhsItemValuesList[id].length === 0) {
        postAxios('/zncs/workbench/queryFzhsValue', {id: id}).then(res => {
          if (res.success) {
            this.fzhsItemValuesList[id] = res.rows
            this.fzhsChecked2 = []
            this.fzhsChecked2 = vals
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.fzhsChecked2 !== this.fzhsChecked && (this.fzhsChecked2 = this.fzhsChecked)
      }
    },
    mousedownItem (lindex, folderItem, itemIdx, event) {
      if (folderItem && event.button === 0) {
        this.col_ids.splice(lindex + 1, this.col_ids.length - lindex)
        this.col_ids[lindex] || (this.col_ids[lindex] = [])
        if (event.ctrlKey && folderItem.itype === 1) {
          event.preventDefault()
          this.col_ids[lindex].push(itemIdx)
        } else if (event.shiftKey && folderItem.itype === 1) {
          if (!this.col_ids[lindex].length) {
            this.col_ids[lindex][0] = itemIdx
          } else {
            let indexTemp = 1
            this.col_ids[lindex].splice(1, this.col_ids[lindex].length - 1)
            if (this.col_ids[lindex][0] > itemIdx) {
              for (let idx = this.col_ids[lindex][0]; idx >= itemIdx; idx--) {
                this.col_ids[lindex][indexTemp++] = idx
              }
            } else {
              for (let idx = this.col_ids[lindex][0]; idx <= itemIdx; idx++) {
                this.col_ids[lindex][indexTemp++] = idx
              }
            }
          }
        } else {
          this.col_ids[lindex] = []
          this.col_ids[lindex][0] = itemIdx
        }
      }
    },
    // 显示存货 (修改)
    getCompanyType (callType) {
      postAxios('/zncs/workbench/getInventroyType').then(res => {
        if (res.success) {
          if (res.data === '0') {
            this.companyType = 0
          } else if (res.data === '1') {
            this.companyType = 1
          } else if (res.data === '2') {
            this.getCompanyType2(callType)
            return
          }
          if (callType !== 'init') {
            this.getInventory(callType)
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    getCompanyType2 (callType) {
      getAxios('/glic/gl_icinvset/query?_=' + new Date().valueOf()).then(res => {
        if (res.success) {
          if (res.rows && res.rows.chcbjzfs === 2) {
            this.companyType = 0
          } else if (res.rows && res.rows.chcbjzfs === 0) {
            this.companyType = 2
          } else if (res.rows && res.rows.chcbjzfs === 1) {
            this.companyType = 3
          }
        } else {
          this.$message.error(res.msg)
        }
        if (callType !== 'init') {
          this.getInventory(callType)
        }
      }).catch((error) => {
        this.$message.error(error)
      })
    },
    getFolderData (lindex, folderItem, itemIdx, event, callback) {
      this.currentTreeRow = folderItem
      lindex = lindex || 0
      let param = {}
      if (lindex > 0) {
        if (folderItem.itype === 1) {
          return false
        }
        param = {
          ...this.searchData,
          id: folderItem.id,
          code: folderItem.categorycode,
          pk_parent: folderItem.pk_parentcategory
        }
      } else {
        param = {...this.searchData}
      }
      folderItem && folderItem.pk_bankcode && (param.pk_bankcode = folderItem.pk_bankcode)
      new Date().valueOf()
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      postAxios('/zncs/workbench/queryCategory', param).then(res => {
        loading.close()
        if (res.success) {
          res.rows.forEach(ev => {
            if (ev.itype) {
              ev.isDetailed = false
              ev.children = []
            }
          })
          if (lindex === 0) {
            this.folderData = [{total: res.total, folderList: res.rows}]
            res.rows && res.rows.length > 0 && (this.pkCorp = res.rows[0].pk_corp)
            this.folderBillDetails = []
          } else {
            if (this.showModeType === 0) {
              this.folderData = [...this.folderData.slice(0, lindex)]
              setTimeout(st => {
                this.folderData = [...this.folderData, {total: res.total, folderList: [...res.rows]}]
              }, 100)
            } else {
              // this.folderBillDetails = []
              this.$set(this, 'folderBillDetails', [])
              if (folderItem && folderItem.isOpen) {
                this.$set(folderItem, 'children', [])
                this.$set(folderItem, 'isOpen', false)
              } else {
                this.$root.appData.selectTreeItem = folderItem.id
                this.$set(folderItem, 'children', res.rows)
                if (folderItem.isleaf !== '是') folderItem.isOpen = true
                // folderItem.isOpen = true
                let tempFolderBill = []
                res.rows.forEach(ev => {
                  if (ev.itype === 1) {
                    tempFolderBill.push(ev)
                  }
                  setTimeout(time => {
                    this.$set(this, 'folderBillDetails', tempFolderBill)
                  }, 50)
                })
              }
            }
          }
          callback && setTimeout(ev => {
            callback()
          }, 200)
        } else {
        }
      })
    }
  },
  mounted () {
    this.getCompanyType('init')
    document.oncontextmenu = function (event) {
      if (event.ctrlKey && event.button === 0) {
        event.preventDefault()
      }
    }
    if (this.$route.params.action !== undefined) {
      this.voucherVisible = true
    }
  },
  created () {
    this.getFolderData()
    let that = this
    this.pickerOptions1 = {
      disabledDate (time) {
        return time.getTime() < new Date(that.jzrqDate).getTime()
      }
    }
  },
  watch: {
    newFolderDialogVisible (e) {
      if (!e) {
        setTimeout(t => {
          this.fzhsChecked = []
          this.fzhsChecked2 = []
          this.folderFormData.isFzhs = false
          this.folderFormData = {
            categoryid: '',
            sortNum: 100,
            categoryname: '',
            jsfs: 0,
            hbfs: 0,
            zjnx: 0,
            czl: 0,
            rzkm: '',
            jskm: '',
            shkm: '',
            isFzhs: false,
            rzkm2: [],
            shkm2: [],
            jskm2: [],
            zdyzy: '',
            zdyzyRe: ''
          }
          this.fzhsChecked = []
          this.fzhsChecked2 = []
          for (let map in this.fzhsDataMap) {
            this.fzhsDataMap[map].selVal = ''
          }
        }, 500)
      }
    },
    newClassificationVisible (e) {
      if (!e) {
        this.classificationFormData.newClassificationName = ''
      }
    },
    intertemporalDialog (e) {
      if (!e) {
        this.intertemporalFormData.intertemporalDate = ''
        this.$refs['intertemporalRef'].resetFields()
      }
    },
    showModeType () {
      this.getFolderData()
      this.col_ids = []
    }
  }
}
/**
   * 通过未级ID查询，返回所有上级ID数组
   * @param {String} id
   * @param {Array} tree
   */

function getFullIdByTree (id, tree) {
  let index = 0
  let fullId = []
  for (; index < tree.length; index++) {
    if (tree[index].id === id) {
      return [id]
    }
    if (tree[index].children && tree[index].children.length > 0) {
      let rtnId = getChildred(tree[index].children, id)
      if (rtnId) {
        return [tree[index].id, ...rtnId]
      }
    }
  }
  return fullId
}

function getChildred (treeNode, id) {
  let index2 = 0
  for (; index2 < treeNode.length; index2++) {
    if (treeNode[index2].primaryKey === id) {
      return [id]
    } else {
      if (treeNode[index2].children && treeNode[index2].children.length > 0) {
        let rtnId = getChildred(treeNode[index2].children, id)
        if (rtnId) {
          return [treeNode[index2].primaryKey, ...rtnId]
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  @import "./index";
  @import "../index.less";
</style>
