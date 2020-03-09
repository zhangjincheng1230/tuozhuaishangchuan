<template>
    <div class="home-content">
      <el-row type="flex" style="padding-top: 0;height: 42%">
        <el-col :span="12" align="middle" style="padding-top: 0">
          <div class="el-col-content content-1" style="padding-top: 0">
            <el-row type="flex" align="middle" style="padding-top: 25px;">
              <el-col :span="6" >
                <img @click="addTag('voucher-edit')" src="../../assets/home/tzpz.png" alt="">
                <label style="font-size: 13px">填制凭证</label>
              </el-col>
              <el-col :span="6" >
                <img @click="addTag('voucher-manage')" src="../../assets/home/pzgl.png" alt="">
                <label style="font-size: 13px">凭证管理</label>
              </el-col>
              <el-col :span="6" >
                <img @click="addTag('kmhzb-report')" src="../../assets/home/kmhzb.png" alt="">
                <label style="font-size: 13px">科目汇总表</label>
              </el-col>
              <el-col :span="6" >
                <img @click="addTag('kmmx-report')" src="../../assets/home/kmmxz.png" alt="">
                <label style="font-size: 13px">科目明细账</label>
              </el-col>
            </el-row>
            <el-row type="flex" align="middle" style="padding-bottom: 25px;">
              <el-col :span="6" >
                <img @click="addTag('zcfz-report')" src="../../assets/home/zcfzb.png" alt="">
                <label style="font-size: 13px">资产负债表</label >
              </el-col>
              <el-col :span="6" >
                <img @click="addTag('lrb-report')" src="../../assets/home/lrb.png" alt="">
                <label style="font-size: 13px">利润表</label>
              </el-col>
              <el-col :span="6" >
                <img @click="addTag('xjll-report')" src="../../assets/home/xjllb.png" alt="">
                <label style="font-size: 13px">现金流量表</label>
              </el-col>
              <el-col :span="6" >
                <img @click="addTag('tax-calculator')" src="../../assets/home/sscs.png" alt="">
                <label style="font-size: 13px">税费计算</label>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12" style="padding-top: 0">
          <div class="el-col-content content-2">
            <div id="chart" style="width: calc(100% - 35px);height: 100%">

            </div>
            <div style="width: 45px; margin: -26% auto;float: right">
              <el-button type="primary" size="mini" @click="rightClick" icon="el-icon-arrow-up" circle></el-button>
                <div style="margin: 20px 0; display: inline-block">{{fsyebactDate.substring(0, 4)}}</div>
              <el-button type="primary" size="mini" @click="leftClick" icon="el-icon-arrow-down" circle></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" style="height: 58%">
        <el-col :span="12" >
          <div class="el-col-content content-3">
            <el-row type="flex" align="middle">
              <label :class="activeFinance === 0 ? 'active-label' : ''" @click="changeaFinance(0)" style="font-size: 14px">财务状况</label>
              &ensp;<label style="font-weight: 600">&nbsp;&nbsp;|&nbsp;&nbsp;</label>&ensp;
              <label :class="activeFinance === 1 ? 'active-label' : ''" @click="changeaFinance(1)" style="font-size: 14px">财务指标</label>
              <el-date-picker
                style="width: 125px"
                class="cp-date"
                :editable="false"
                :clearable="false"
                prefix-icon="el-icon-arrow-down"
                size="mini"
                value-format="yyyy-MM"
                format="yyyy-MM"
                v-model="financeDate"
                @change="changeDate"
                type="month"
                :picker-options="pickerOptions"
                placeholder="">
              </el-date-picker>
            </el-row>
            <!--<transition>-->
              <div v-show="activeFinance === 0" style="height: calc(100% - 20%)">
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/ylzk.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">盈利状况</label>
                    <label>
                      <br>
                      营业收入：{{cwgyinfoacMap['营业收入'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label style="font-size:14px;
                                font-family:SourceHanSansCN-Bold;
                                font-weight:bold;
                                color:rgba(0,0,0,1)">&nbsp;</label>
                    <label>
                      <br>
                      净利润：{{cwgyinfoacMap['净利润'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/ysyf.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">应收应付</label>
                    <label>
                      <br>
                      应收账款：{{cwgyinfoacMap['应收账款'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label>&nbsp;</label>
                    <label>
                      <br>
                      应付账款：{{cwgyinfoacMap['应付账款'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/hbjj.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">货币基金</label>
                    <label>
                      <br>
                      净发生额：{{cwgyinfoacMap['净发生额'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label>&nbsp;</label>
                    <label>
                      <br>
                      余额：{{cwgyinfoacMap['余额'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/yjsj.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title" style="margin-bottom: 5px">应交税金</label>
                    <label style="line-height: 20px">
                      <br>
                      城建税：{{cwgyinfoacMap['城建税'] | forThousands(2,true)}}
                      <br>
                      地方教育附加：{{cwgyinfoacMap['地方教育附加'] | forThousands(2,true)}}
                      <br>
                      企业所得税累计税负：{{cwgyinfoacMap['企业所得税累计税负']}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label >&nbsp;</label>
                    <label style="line-height: 20px;
                                  margin-top: -23px;
                                  display: inline-block;
                                  text-align: left;">
                      <br>
                      教育附加：{{cwgyinfoacMap['教育附加'] | forThousands(2,true)}}
                      <br>
                      企业所得税：{{cwgyinfoacMap['企业所得税'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <div class="line"></div>
                </el-row>
              </div>
            <!--</transition>-->
            <!--<transition >-->
              <div v-show="activeFinance !== 0" style="height: calc(100% - 20%)">
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/ylnl.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">盈利能力</label>
                    <label>
                      <br>
                      净利率：{{cwgyinfoacMap['净利率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label style="font-size:14px;
                                font-family:SourceHanSansCN-Bold;
                                font-weight:bold;
                                color:rgba(0,0,0,1)">&nbsp;</label>
                    <label>
                      <br>
                      毛利率：{{cwgyinfoacMap['毛利率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/cznl.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">偿债能力</label>
                    <label>
                      <br>
                      资产负债率：{{cwgyinfoacMap['资产负债率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label>&nbsp;</label>
                    <label>
                      <br>
                      流动比率：{{cwgyinfoacMap['流动比率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img src="../../assets/home/yynl.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">运营能力：</label>
                    <label>
                      <br>
                      应收账款周转率：{{cwgyinfoacMap['应收账款周转率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label>&nbsp;</label>
                    <label>
                      <br>
                      资产周转率：{{cwgyinfoacMap['资产周转率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                </el-row>
                <el-row type="flex" align="middle" class="content-3-row">
                  <el-col :span="5">
                    <img style="height: 21px;" src="../../assets/home/vznlzb.png" alt="">
                  </el-col>
                  <el-col :span="10">
                    <label class="content-3-title">发展能力指标</label>
                    <label style="line-height: 20px;">
                      <br>
                      收入增长率：{{cwgyinfoacMap['收入增长率'] | forThousands(2,true)}}
                      <br>
                      净资产收益率：{{cwgyinfoacMap['净资产收益率'] | forThousands(2,true)}}

                    </label>
                  </el-col>
                  <el-col :span="9">
                    <label >&nbsp;</label>
                    <label>
                      <br>
                      净利润增长率：{{cwgyinfoacMap['净利润增长率'] | forThousands(2,true)}}
                    </label>
                  </el-col>
                  <!--<el-col :span="6">-->
                    <!--<label >&nbsp;</label>-->
                    <!--<label>-->
                    <!--</label>-->
                  <!--</el-col>-->
                  <div class="line"></div>
                </el-row>
              </div>
            <!--</transition>-->
          </div>
        </el-col>
        <el-col :span="12">
          <div class="el-col-content content-4">
            <el-row style="padding-top: 10px; padding-bottom: 10px; border-bottom: 1px solid #F7F7F7">
              <el-col :span="18">
                <label style="font-size:14px; font-weight: 400">快速查询</label>
                <el-input style="width: 270px" size="mini" placeholder="请输入科目" v-model="search" class="input-with-select">
                  <el-select size="mini" class="prepend-select" v-model="selectedSearch" slot="prepend" placeholder="请选择">
                    <el-option label="凭证" value="1"></el-option>
                    <el-option label="明细账" value="2"></el-option>
                    <el-option label="总账" value="3"></el-option>
                    <el-option label="余额" value="4"></el-option>
                  </el-select>
                  <el-button type="text" slot="append" icon="el-icon-search" @click="searchFast"></el-button>
                </el-input>
              </el-col>
            </el-row>

            <el-row style="padding-top: 5px; padding-bottom: 0px;">
              <el-col :span="18">
                <label style="font-size:14px; font-weight: 400">预警设置</label>
                <i class="el-icon-plus" @click="goSetting"></i>
              </el-col>
              <el-col :span="6">
                &nbsp;
              </el-col>
            </el-row>
            <el-row style="border-bottom: 1px solid #F7F7F7">
              <el-carousel @change="setWarningActiveItem" indicator-position="none" class="todo-list" trigger="click" arrow="always" :autoplay="false" :loop="false" height="110px">
                <el-carousel-item :key="page" v-for="page in warningTypeParam.warningPageNumber">
                  <el-row>
                    <el-col :span="1">
                      &nbsp;
                    </el-col>
                    <el-col :span="11" v-if="warningPeaList[0]">
                      <el-tooltip v-if="warningPeaList[0] && warningPeaList[0].xmmc.length > 14" class="item" effect="dark" :content="warningPeaList[0] && warningPeaList[0].xmmc" placement="top">
                        <label style="margin-bottom: 6px;display: block;text-align: left;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">预警项：{{warningPeaList[0] && warningPeaList[0].xmmc}}</label>
                      </el-tooltip>
                      <label v-else style="margin-bottom: 6px;display: block;text-align: left;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">预警项：{{warningPeaList[0] && warningPeaList[0].xmmc}}</label>
                      <ul class="warning-list">
                        <li> <i ></i> {{ getPeriodTypeName(warningPeaList[0].period_type) }}发生：¥{{warningPeaList[0] && warningPeaList[0].fsTotal | forThousands(2,true)}}</li>
                        <li> <i ></i> 预警上限：¥{{warningPeaList[0] && warningPeaList[0].srsx | forThousands(2,true)}}</li>
                        <li> <i ></i> 还可新增：¥{{warningPeaList[0] && warningPeaList[0].infoNumber | forThousands(2,true)}}</li>
                      </ul>
                    </el-col>
                    <el-col :span="11" v-if="warningPeaList[1]">
                      <label style="margin-bottom: 6px;display: block;text-align: left;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">预警项：{{warningPeaList[1] && warningPeaList[1].xmmc}}</label>
                      <ul class="warning-list">
                        <li> <i ></i> {{ getPeriodTypeName(warningPeaList[1].period_type) }}发生：¥{{warningPeaList[1] && warningPeaList[1].fsTotal | forThousands(2,true)}}</li>
                        <li> <i ></i> 预警上限：¥{{warningPeaList[1] && warningPeaList[1].srsx | forThousands(2,true)}}</li>
                        <li> <i ></i> 还可新增：¥{{warningPeaList[1] && warningPeaList[1].infoNumber | forThousands(2,true)}}</li>
                      </ul>
                    </el-col>
                    <el-col :span="1">
                      &nbsp;
                    </el-col>
                  </el-row>
                </el-carousel-item>
              </el-carousel>
            </el-row>
            <el-row style="padding-top: 5px;">
              <el-col :span="12">
                <label style="font-size:14px; font-weight: 400">待办事项</label>
                <i class="el-icon-plus" @click="showNeed"></i>
              </el-col>
              <el-col :span="12">
                &nbsp;
              </el-col>
            </el-row>
            <el-row style="border-bottom: 1px solid #F7F7F7">
              <el-carousel
                ref="todoCarousel"
                @change="setWorkTodoActiveItem" indicator-position="none"
                class="todo-list" trigger="click" arrow="always" :autoplay="false" :loop="false" height="100px">
                <el-carousel-item :key="page" v-for="page in workTodoParam.workTodoPageNumber">
                  <el-row>
                    <el-col :span="1">
                      &nbsp;
                    </el-col>
                    <el-col :span="11">
                      <ul class="warning-list">
                        <li v-if="idx < 3" :key="idx" v-for="(work, idx) in workTodoList[page - 1]">
                          <i></i>
                          <el-tooltip
                            :content="work.vmemo"
                            v-model="work.tooltip"
                            manual
                            @mouseenter.native="todoNameEnter($event, work)"
                            @mouseleave.native="todoNameLeave(work)">
                            <span class="todo-name" :class="work.zt === 1 ? 'todo-name-short' : ''">
                              {{work.vmemo}}
                            </span>
                          </el-tooltip>
                          <el-button class="show-matter" type="text" @click="showWork(work)">
                            <span v-if="work.zt === -1">查看</span>
                            <span v-if="work.zt === 0">处理</span>
                            <span v-if="work.zt === 1">已处理</span>
                            <span v-if="work.zt === 1" class="el-icon-delete" @click="showWork(work)">
                          </span>
                          </el-button>
                        </li>
                        <!--<li> <i ></i> 11月期间损益未结转 <el-button class="show-matter" type="text">查看</el-button></li>-->
                      </ul>
                    </el-col>
                    <el-col :span="11">
                      <ul class="warning-list">
                        <li v-if="idx > 2" :key="idx" v-for="(work, idx) in workTodoList[page - 1]">
                          <i></i>
                          <el-tooltip
                            :content="work.vmemo"
                            v-model="work.tooltip"
                            manual
                            @mouseenter.native="todoNameEnter($event, work)"
                            @mouseleave.native="todoNameLeave(work)">
                            <span class="todo-name" :class="work.zt === 1 ? 'todo-name-short' : ''">
                              {{work.vmemo}}
                            </span>
                          </el-tooltip>
                          <el-button class="show-matter" type="text" @click="showWork(work)">
                            <span v-if="work.zt === -1">查看</span>
                            <span v-if="work.zt === 0">处理</span>
                            <span v-if="work.zt === 1">已处理</span>
                            <span v-if="work.zt === 1"   class="el-icon-delete" @click="showWork(work)">
                            </span>
                          </el-button>
                        </li>
                      </ul>
                    </el-col>
                    <el-col :span="1">
                      &nbsp;
                    </el-col>
                  </el-row>
                </el-carousel-item>
              </el-carousel>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div class="notice-main" ref="dragMove" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
        <ul>
          <li>
            <el-popover
              placement="left-start"
              popper-class="progress-popper"
              offset="20"
              width="364"
              trigger="click"
              v-model="msgVisible">
              <div class="step" style="height: 400px">
                <div class="msg-title">
                  <span @click="queryMsg('通知')" :class="activeTitle === '通知' ? 'msg-title-active' : ''">通知</span>
                  <div style="width:1px; height:14px; border: 1px solid #E6E6E6; display: inline-block; margin: 0 10px;"></div>
                  <span @click="queryMsg('公告')" :class="activeTitle === '公告' ? 'msg-title-active' : ''">公告</span>
                </div>
                <div class="msg-list">
                  <div class="msg-item" @click="readMsg(msgItem)" :style="activeTitle === '公告' ? 'background: #FFF; border: 2px solid #F5F5F5; cursor: auto;' : ''" :key="idx" v-for="(msgItem, idx) in msgList">
                    <div class="msg-item-title">
                      <span style="vertical-align: middle; display: inline-block;color: #323548; font-size: 12px; font-weight: bold">{{msgItem.msgtypename}}</span>
                      <span style="vertical-align: middle; display: inline-block;color: #999999; font-size: 12px; font-weight: 400;float: right; margin-right: 5px;">{{msgItem.vsdate}}</span>
                    </div>
                    <div class="msg-item-content">
                      {{msgItem.content}}
                    </div>
                  </div>
                </div>
                <div class="msg-more" @click="addTag('消息')">查看全部</div>
              </div>
              <div slot="reference" @click="showMsg">消息</div>
            </el-popover>
            <label style="
    position: absolute;
    top: -12px;
    right: -3px;
    font-weight: 600;
    border-radius: 50%;
    background: red;
    padding: 0px 3px;
    line-height: 18px;">
              {{checkNewMessageNum}}
            </label>
          </li>
          <li onclick="qimoChatClick()"><a style="cursor: pointer">客服</a></li>
          <li>
            <el-popover
              placement="left-start"
              popper-class="progress-popper"
              offset="20"
              title="财务进度"
              width="450"
              trigger="click"
              v-model="visible">
<!--              <p>财务进度</p>-->
              <div class="step">
                <el-button @click="updateFinanceProgress('spzt')" :type="financeProgressData.spzt === 1 ? 'primary' : ''" size="mini"> 送票 </el-button> <i class="el-icon-right"></i>
                <el-button :type="financeProgressData.accheck === 1 ? 'primary' : ''" disabled size="mini"> 记账完成 </el-button> <i class="el-icon-right"></i>
                <el-button @click="updateFinanceProgress('cszt')" :type="financeProgressData.cszt === 1 ? 'primary' : ''" size="mini"> 抄税 </el-button> <i class="el-icon-right"></i>
                <el-button @click="updateFinanceProgress('wczt')" :type="financeProgressData.wczt === 1 ? 'primary' : ''" size="mini"> 申报完成 </el-button> <i class="el-icon-right"></i>
                <el-button @click="updateFinanceProgress('qkzt')" :type="financeProgressData.qkzt === 1 ? 'primary' : ''" size="mini"> 清卡 </el-button>
              </div>
              <div slot="reference" @click="getFinanceProgress">进度</div>
            </el-popover>
          </li>
        </ul>
      </div>
      <el-dialog style="border-radius: 13px;" size="mini" :close-on-click-modal="false"
                 :close-on-press-escape="false" :visible.sync="needDialog" title="添加待办事项" width="380px">
        <div>
          <el-form ref="needRef" :model="needFormData" :rules="needFormRules" label-width="80px">
            <el-form-item label="截止时间" prop="jzsj">
              <el-date-picker
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                v-model="needFormData.jzsj"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="关注人">
              <el-select v-model="needFormData.gzr" style="width: 100%">
                <el-option :label="item.cuname" :value="item.cuid" :key="idx" v-for="(item, idx) in queryuserList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="nr">
              <el-input v-model="needFormData.nr" type="textarea" rows="5"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="needDialog = false">取 消</el-button>
          <el-button type="primary" @click="saveNeed">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog class="settingLine" title="设置税负预警线" :close-on-click-modal="false" :visible.sync="settingLineDialog" width="300px">
        <el-form ref="setLineForm" :model="setLineForm">
          <el-form-item>
            <el-input-number size="small" v-model="setLineForm.lineValue" :precision="2" :step="0.01" controls-position="right" @change="handleChange"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeWarning('setLineForm')">取 消</el-button>
          <el-button type="primary" @click="saveWarning('setLineForm')">确 定</el-button>
        </div>
      </el-dialog>
      <IncomeWarningDialog :visible.sync="incomeDialogFormVisible"
                           :account="incomeFormData"
                           @save="onIncomeSaved"></IncomeWarningDialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addTag } from '@/libs/tools'
import IncomeWarningDialog from '@/view/accounting/settings/income-warning/components/IncomeWarningDialog'
import yj_mixin from '@/view/accounting/settings/income-warning/components/mixins/mixins'
import dataPickerMixin from '@/mixins/date-picker'
import {getIncomeWarningPeriodTypeName} from '@/utils'
import { get } from '@/utils/request'
import Big from 'big.js'
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/markLine')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  name: 'Home',
  components: {
    IncomeWarningDialog
  },
  mixins: [yj_mixin, dataPickerMixin],
  data () {
    let loginDate = this.$store.getters.getLoginDate
    return {
      msgList: [],
      activeTitle: '通知',
      msgVisible: false,
      settingLineDialog: false,
      queryuserList: [],
      needFormData: {
        nr: '',
        gzr: '',
        jzsj: ''
      },
      needFormRules: {
        nr: [
          {required: true, message: '请输选择时间', trigger: 'blur'}
        ],
        jzsj: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      needDialog: false,
      visible: false,
      search: '',
      selectedSearch: '1',
      activeFinance: 0,
      cwgyinfoactList: [],
      workTodoList: [],
      workTodoParam: {
        workTodoPageNumber: 0,
        currentPage: 1
      },
      cwgyinfoacMap: {},

      incomeDialogFormVisible: false,
      incomeFormData: {},
      warningType: '',
      warningPeaList: [],
      warningTypeList: [],
      warningTypeParam: {
        warningPageNumber: 0,
        currentPage: 1
      },
      financeDate: loginDate,
      checkNewMessageNum: '',
      FSYYearList: [],
      fsyebactDate: loginDate,
      glRepYearList: [],
      financeProgressData: {},
      moveDataelse: {
        x: null,
        y: null
      },
      setLineForm: {
        lineValue: 0
      },
      warningLine: 0,
      popupAnnouncement: new Set()
    }
  },
  computed: {
    ...mapGetters(['system']),
    loginDate () {
      return this.$store.getters.getLoginDate
    },
    loginCorp () {
      return this.$store.getters.getLoginCorp
    },
    loginCorpId () {
      return this.$store.getters.getLoginCorpId
    },
    subjectData () {
      return this.$store.getters.subjectRef
    }
  },
  mounted () {
    this.initData()
    this.readAnnouncement()
    setInterval(() => {
      this.readAnnouncement()
    }, 1800000)
  },
  methods: {
    mouseDownHandleelse (event) {
      this.moveDataelse.x = event.pageX - this.$refs.dragMove.offsetLeft
      this.moveDataelse.y = event.pageY - this.$refs.dragMove.offsetTop
      event.currentTarget.style.cursor = 'move'
      window.onmousemove = this.mouseMoveHandleelse
    },
    mouseMoveHandleelse (event) {
      let moveLeft = event.pageX - this.moveDataelse.x + 'px'
      let moveTop = event.pageY - this.moveDataelse.y + 'px'
      this.$refs.dragMove.style.left = moveLeft
      this.$refs.dragMove.style.top = moveTop
    },
    mouseUpHandleelse (event) {
      window.onmousemove = null
      event.currentTarget.style.cursor = 'move'
      // console.log('鼠标松开了')
    },
    searchFast () {
      if (this.search) {
        let params = {}
        const type = this.selectedSearch
        let subject = this.subjectData.find(subj => this.search === subj.kmmc || this.search === subj.kmbm)
        if (!subject) {
          this.$message.error('没有对应科目')
          return
        }
        if (type === '1') {
          params = {
            routeParam: {
              vname: subject.kmbm
            }
          }
        } else {
          params = {
            routerParam: {
              periodRange: [this.loginCorp.bdate.substring(0, 7), this.loginDate.substring(0, 7)],
              kms_first: subject.kmbm,
              kms_last: subject.kmbm
            }
          }
        }
        if (type === '1') {
          this.addTag('voucher-manage', params)
        } else if (type === '2') {
          this.addTag('kmmx-report', params)
        } else if (type === '3') {
          this.addTag('kmzz-report', params)
        } else if (type === '4') {
          this.addTag('fsyeb-report', params)
        }
      }
    },
    showWork (work) {
      // work.name && this.addTag(work.name, work.url.split('?')[1])
      if (work.zt === -1) { // 联查
        let url = work.url
        let paramstr = work.paramstr
        this.$router.push({
          name: url,
          params: {
            routerParam: Object.assign({id: 'index'}, JSON.parse(paramstr))
          }
        })
      } else if (work.zt === 0) { // 处理
        this.$api.WorkToDo.hand({
          id: work.id
        }).then(res => {
          this.sysWorkTodo()
        })
      } else if (work.zt === 1) { // 删除
        this.$api.WorkToDo.del({
          id: work.id
        }).then(res => {
          this.sysWorkTodo()
        })
      }
    },
    updateFinanceProgress (type) {
      let newStatus = this.financeProgressData[type] === 1 ? 0 : 1
      this.$api.Home.updateFinanceProgress({
        field: type,
        status: newStatus
      }).then(res => {
        if (res.success) {
          this.$set(this.financeProgressData, type, newStatus)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    readMsg (item) {
      this.$api.Home.updateMsgStatus([{
        msgtype: item.msgtype,
        pk_id: item.pk_id,
        isread: '是'
      }]).then(res => {
        this.getNewMessageNum()
        this.queryMsg('通知')
      })
    },
    queryMsg (e) {
      this.activeTitle = e
      this.msgList = []
      if (e === '通知') {
        this.$api.Home.pubMessageGetAdminMsg().then(res => {
          this.msgList = res.rows
        })
      } else {
        this.$api.Home.pubMessageGetSysMsg({sreceive: 'dzf_kj'}).then(res => {
          this.msgList = res.rows
        })
      }
    },
    showMsg () {
      this.queryMsg('通知')
    },
    getFinanceProgress () {
      this.$api.Home.getFinanceProgress().then(res => {
        if (res.success) {
          this.financeProgressData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showNeed () {
      this.needDialog = true
      this.$api.WorkToDo.queryUser({
        corps: `{"pk_gs": "${this.loginCorpId}"}`,
        sort: 'cucode',
        order: 'asc'
      }).then(res => {
        this.queryuserList = res.rows
      })
    },
    saveNeed () {
      this.$refs.needRef.validate((valid) => {
        if (valid) {
          this.$api.WorkToDo.save(this.needFormData).then(res => {
            if (res.success) {
              this.$message.success(res.msg)
              this.workTodoParam.currentPage = 1
              this.$refs.todoCarousel.activeIndex = 0
              this.sysWorkTodo()
            } else {
              this.$message.error(res.msg)
            }
            this.needDialog = false
          }).catch(res => {
            this.needDialog = false
          })
        }
      })
    },
    initData () {
      if (this.loginCorpId && this.loginDate) {
        this.initCorps() // 初始化公司列表
        this.getWarning()
        this.glIncomewarning() // 预警类别
        this.sysWorkTodo() // 待办事项
        this.getNewMessageNum() // 首页消息数量
        this.loadYSF() // 加载客服
        this.glRepCwgyinfoact() // 财务指标
        this.glRepFsyebactqueryYearAction() // 发生余额表
        this.glRepLrbactqueryYearAction() // 利润表
      }
    },
    initCorps () {
      this.$api.System.getCorps({
        ...this.pageInfo
      }).then(result => {
        if (result.rows) {
          this.$store.commit('setOwnedCorps', result.rows)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    leftClick () {
      let period = new Date(Number(this.fsyebactDate.split('-')[0]) - 1, Number(this.fsyebactDate.split('-')[1]), 1)
      if (parseInt(period.getFullYear()) < parseInt(this.$store.getters.getLoginCorp.bdate.substring(0, 4))) {
        this.$message.warning('不在查询期间内，' + period.getFullYear() + '年该公司还未建账！')
        period = new Date(Number(this.fsyebactDate.split('-')[0]), Number(this.fsyebactDate.split('-')[1]), 1)
      }
      this.fsyebactDate = period.getFullYear() + '-' + (period.getMonth() > 9 ? period.getMonth() : '0' + period.getMonth()) + '-01'
      this.showCharts()
    },
    rightClick () {
      let period = new Date(Number(this.fsyebactDate.split('-')[0]) + 1, Number(this.fsyebactDate.split('-')[1]), 1)
      this.fsyebactDate = period.getFullYear() + '-' + (period.getMonth() > 9 ? period.getMonth() : '0' + period.getMonth()) + '-01'
      this.showCharts()
    },
    loadScriptAsync (url, fun) {
      var scrs = document.getElementsByTagName('script')
      var last = scrs[scrs.length - 1]
      var scr = document.createElement('script')
      scr.src = url
      scr.async = true
      last.parentNode.insertBefore(scr, last)
      scr.onload = function (ev) {
        console.log('onload')
        fun()
      }

      scr.onreadystatechange = function (ev) {
        if ((this.readyState === 'loaded' || this.readyState === 'complete')) {
          console.log('onreadystatechange')
          fun()
        };
      }
    },
    custServActQuery () {
      var qimoClientId = {
        userId: '', // 自定义用户的唯一id，不能传空字符串、null、中文，id由字母大小写、数字及'-'和 '_'组成
        nickName: '',
        customField: { // 扩展字段，json对象，对象中的key-value都自定义
          '用户名称': '',
          '版本': '',
          '手机号': ''
        }
      }
      get('/zxkj/sys/custServAct/query', {corpid: this.loginCorpId}).then(res => {
        console.log('/sys/custServAct/query')
        console.log(res)
        let iversionName = ''
        switch (res.iversion) {
          case 1:
            iversionName = '普通版'
            break
          case 2:
            iversionName = 'C端版'
            break
          case 3:
            iversionName = '渠道商版'
            break
          case 4:
            iversionName = '标准版'
            break
          case 5:
            iversionName = '旗舰版'
            break
          case 6:
            iversionName = '普通加盟商'
            break
          case 7:
            iversionName = '工厂版'
            break
          case 8:
            iversionName = '金牌加盟商'
            break
          case 9:
            iversionName = '演示加盟商'
            break
        }
        this.$store.commit('SET_IVERSIONNAME', iversionName)
        qimoClientId.userId = res.rows.uid
        qimoClientId.nickName = res.rows.uname
        qimoClientId.customField['用户名称'] = JSON.parse(window.sessionStorage.getItem('dzf-zxkj')).system.info.UserName
        qimoClientId.customField['版本'] = iversionName
        qimoClientId.customField['手机号'] = JSON.parse(window.sessionStorage.getItem('dzf-zxkj')).system.userInfo.phonenum
        this.loadScriptAsync((res.rows.iversion === 6 || res.rows.iversion === 8 || res.rows.iversion === 9) ? 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=23d3b250-cfb4-11e9-abba-2fda7fb9bec8&autoShow=false&language=ZHCN' : 'https://webchat.7moor.com/javascripts/7moorInit.js?accessId=30d21cd0-cfb4-11e9-abba-2fda7fb9bec8&autoShow=false&language=ZHCN', function () {})
      })
    },
    loadYSF () {
      this.custServActQuery()
    },
    getNewMessageNum () {
      this.$api.Home.checkNewMessage().then(res => {
        this.checkNewMessageNum = res.rows
      })
    },
    addTag: addTag,
    setWorkTodoActiveItem (e) {
      this.workTodoParam.currentPage = e + 1
      this.sysWorkTodo()
    },
    setWarningActiveItem (e) {
      this.warningTypeParam.currentPage = e + 1
      this.warningPageChange()
    },
    changeDate (e) {
      this.financeDate = e + '-01'
      this.glRepFsyebactqueryYearAction()
      this.glRepLrbactqueryYearAction()
      this.glRepCwgyinfoact()
    },
    changeaFinance (e) {
      this.$nextTick(nt => {
        this.activeFinance = e
      })
    },
    showCharts () {
      let monthlyTax = [] // 月税负
      let cumulativeTax = [] // 累计税负
      let warningLines = 0
      let taxMnys = []
      this.$api.Home.getYearAddTax(this.fsyebactDate.substring(0, 4)).then(result => {
        if (result.rows === undefined && result.rows.length < 0) {
          return
        } else {
          monthlyTax = []
          cumulativeTax = []
          warningLines = this.warningLine
        }
        let emptyLen = 12 - result.rows.length
        for (let i = 0; i < emptyLen; i++) {
          taxMnys.push({
            taxMny: 0,
            monthBurden: 0,
            accumulatedBurden: 0
          })
        }
        result.rows.forEach(item => {
          taxMnys.push(item)
        })
        taxMnys.forEach(item => {
          monthlyTax.push(isNaN(item.monthBurden) ? '0.00' : item.monthBurden.toFixed(2))
          cumulativeTax.push(isNaN(item.accumulatedBurden) ? '0.00' : item.accumulatedBurden.toFixed(2))
        })

        let chart = echarts.init(document.getElementById('chart'))
        let option = {
          title: {
            text: '企业增值税',
            x: 15,
            y: 15,
            textStyle: {
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let tar = ''
              if (params[1].value !== '-') {
                tar = params[1]
              } else {
                tar = params[0]
              }
              let toolStr = tar.name + '<br/>' + '本月应缴增值税：' + taxMnys[tar.dataIndex].taxMny.toFixed(2) + '<br/>'
              params.forEach(item => {
                toolStr += item.seriesName + '：' + item.value + '%' + '<br/>'
              })
              toolStr += '税负预警线：' + warningLines + '%'
              return toolStr
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            y: 15,
            data: [
              {name: '月税负', icon: 'roundRect'},
              {name: '累计税负', icon: 'roundRect'},
              {name: '税负预警线'}], // icon: 'image://../../assets/img/legendIcon.png'
            selected: {},
            formatter: function (name) {
              if (name === '税负预警线') {
                return name + ' ' + warningLines + '%'
              } else {
                return name
              }
            }
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: function (param) {
                if (param > 0) {
                  return param + '%'
                } else {
                  return param
                }
              }
            }
          },
          series: [
            {
              name: '月税负',
              type: 'bar',
              data: monthlyTax,
              itemStyle: {
                normal: {
                  color: '#E77435'
                }
              }
            },
            {
              name: '累计税负',
              type: 'bar',
              data: cumulativeTax,
              itemStyle: {
                normal: {
                  color: '#0889F5'
                }
              }
            },
            {
              name: '税负预警线',
              type: 'line',
              markLine: {
                symbol: 'none',
                data: [
                  {
                    silent: false,
                    label: {
                      show: false
                    },
                    lineStyle: {
                      color: '#FA3934'
                    },
                    yAxis: this.warningLine
                  }
                ]
              }

            }
          ]
        }
        chart.setOption(option)
        chart.on('legendselectchanged', (obj) => {
          if (obj.name === '税负预警线') {
            obj.selected[obj.name] = true
            option.legend.selected = obj.selected
            chart.setOption(option)
            this.settingLineDialog = true
          }
        })
      })
    },
    /**
     * 发生余额表
     */
    glRepFsyebactqueryYearAction () {
      this.$api.fsyebReport.queryYear({
        begindate: this.financeDate,
        ishasjz: 'N',
        unjl: 'Y'
      }).then(res => {
        this.FSYYearList = res
        this.FSYYearList[this.financeDate.substring(0, 7)].forEach(fe => {
          // fe.kmmc === '货币资金净发生' && (this.cwgyinfoacMap = {...this.cwgyinfoacMap, ['净发生额']: fe.fsjf})
          // fe.kmmc === '货币资金余额' && (this.cwgyinfoacMap = {...this.cwgyinfoacMap, ['余额']: fe.qmjf})
          fe.kmmc === '货币资金净发生' && this.$set(this.cwgyinfoacMap, '净发生额', fe.fsjf)
          fe.kmmc === '货币资金余额' && this.$set(this.cwgyinfoacMap, '余额', fe.qmjf)
        })
      })
    },
    /**
     *利润表
     */
    glRepLrbactqueryYearAction () {
      const glEachData = (res) => {
        let incomeTax = 0
        let incomeMny = 0
        // const res = this.glRepYearList
        res.rows.forEach((tem) => {
          if (tem.period.substring(0, 7) === this.financeDate.substring(0, 7)) {
            if (tem.xm === '一、营业收入') {
              incomeMny = tem.bnljje ? tem.bnljje : 0
            } else if (tem.xm === '减：所得税费用' || tem.xm === '减：所得税') {
              if (tem.bnljje) {
                incomeTax = tem.bnljje
              }
              this.$set(this.cwgyinfoacMap, '企业所得税', tem.byje < 0 ? 0 : tem.byje)
            }
          }
        })
        let taxBurden = new Big(0)
        if (incomeTax > 0 && incomeMny > 0) {
          taxBurden = new Big(incomeTax).div(incomeMny)
        }
        this.$set(this.cwgyinfoacMap, '企业所得税累计税负', taxBurden.mul(100).toFixed(2) + '%')
      }
      this.$api.LrbReport.queryYear({
        begindate: this.financeDate,
        ishasjz: 'N',
        unjl: 'Y'
      }).then(res => {
        glEachData(res)
      })
    },
    /**
     * 财务指标
     */
    glRepCwgyinfoact () {
      this.$api.cwgyReport.query({
        begindate: this.financeDate,
        ishasjz: 'N',
        unjl: 'Y',
        nhasyj: 'Y'
      }).then(res => {
        if (res.success) {
          this.cwgyinfoactList = res.rows.filter(fl => {
            this.cwgyinfoacMap = {...this.cwgyinfoacMap, [fl.xm]: fl.byje}
            return true
          })
        }
      })
    },
    /**
     * 首页报表
     */
    glRepFsyebact () {
      // postAxios('/gl/gl_rep_fsyebact!queryYearAction', {
      //   begindate: this.system.LoginDate,
      //   corpIds: this.system.login_corp_id,
      //   ishasjz: 'Y'
      // }).then(res => {
      // })
    },
    /**
     * 待办事项
     */
    sysWorkTodo () {
      this.$api.WorkToDo.query({
        qj: this.loginDate.substring(0, 7),
        page: this.workTodoParam.currentPage,
        rows: 6
      }).then(res => {
        if (res.success) {
          this.workTodoParam.workTodoPageNumber = res.total / 6 > parseInt(res.total / 6) ? parseInt(res.total / 6) + 1 : parseInt(res.total / 6)
          let todoArray = []
          for (let i = 0; i < this.workTodoParam.workTodoPageNumber; i++) {
            if (i === this.workTodoParam.currentPage - 1) {
              todoArray.push(res.rows)
            } else {
              todoArray.push([])
            }
          }
          this.workTodoList = todoArray
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    /**
     * 预警类别
     */
    // glIncomewarning () {
    //   this.$api.BasicSettingApi.IncomeWarning.queryIncomeWarningInfo({
    //     nowDate: this.loginDate,
    //     unjl: 'Y'
    //   }).then(res => {
    //     if (res.success) {
    //       this.warningTypeParam.warningPageNumber = res.rows.length % 2 > 0 ? (res.rows.length / 2) + 1 : res.rows.length / 2
    //       this.warningAllList = res.rows
    //       this.warningPageChange()
    //     }
    //   })
    // },
    getPeriodTypeName (type) {
      return getIncomeWarningPeriodTypeName(type)
    },
    warningPageChange () {
      this.$nextTick(() => {
        if (this.warningTypeParam.currentPage > 1) {
          let i = (this.warningTypeParam.currentPage - 1) * 2
          let j = this.warningTypeParam.currentPage * 2
          this.warningPeaList = this.warningTypeList.slice(i, j)
        } else {
          this.warningPeaList = this.warningTypeList.slice(0, 2)
        }
      })
    },
    handleChange (value) {
      // this.setLineForm.lineValue = value + '%'
    },
    getWarning () {
      this.$api.Home.getTaxWarningRate().then(result => {
        if (result.success) {
          this.warningLine = result.data
          this.setLineForm.lineValue = result.data
          this.showCharts() // 报表
        }
      })
    },
    saveWarning (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.Home.updateTaxWarningRate(this.setLineForm.lineValue).then(result => {
            if (result.success) {
              this.settingLineDialog = false
              this.warningLine = this.setLineForm.lineValue
              this.showCharts()
            }
          })
        }
      })
    },
    onIncomeSaved (data) {
      this.glIncomewarning()
    },
    goSetting () {
      this.incomeFormData = {}
      this.incomeDialogFormVisible = true
    },
    closeWarning (formName) {
      this.$refs[formName].resetFields()
      this.settingLineDialog = false
    },
    readAnnouncement () {
      this.$api.Home.readAnnouncement().then(res => {
        if (res.success && res.rows) {
          let announcements = this.filterAnnouncement(res.rows)
          announcements.forEach(msg => {
            let content = `<p>亲爱的大账房用户</p>
              <p style="text-indent:2em">您好！</p>
              <p style="text-indent:2em">${msg.content}</p>
              <div style="margin-top: 20px;text-align: right;">
                <p>大账房运营团队</p>
                <p>2019年6月19日</p>
              </div>`
            this.$confirm(content, msg.msgtypename, {
              showCancelButton: false,
              showConfirmButton: false,
              dangerouslyUseHTMLString: true,
              closeOnClickModal: false,
              customClass: 'announcement-dialog'
            }).catch(() => {
              this.markReadAnnouncement(msg.pk_id)
            })
            this.popupAnnouncement.add(msg.pk_id)
          })
        }
      })
    },
    filterAnnouncement (announcements) {
      let set = new Set()
      this.popupAnnouncement.forEach(data => set.add(data))
      let markedData = localStorage.getItem('announcementReadId_' + this.$store.getters.getUserId)
      if (markedData) {
        markedData.split(',').forEach(data => set.add(data))
      }
      return announcements.filter(announcement => !set.has(announcement.pk_id))
    },
    // 标记公告为已读
    markReadAnnouncement (announcementId) {
      let key = 'announcementReadId_' + this.$store.getters.getUserId
      let markedData = localStorage.getItem(key)
      let readArray = []
      if (markedData) {
        readArray = markedData.split(',')
      }
      readArray.push(announcementId)
      if (readArray.length > 10) {
        readArray.splice(0, 1)
      }
      localStorage.setItem(key, readArray.join(','))
    },
    todoNameEnter (e, data) {
      let target = e.target
      if ((target.offsetWidth < target.scrollWidth)) {
        this.$set(data, 'tooltip', true)
      }
    },
    todoNameLeave (data) {
      this.$set(data, 'tooltip', false)
    }
  },
  watch: {
    warningTypeList () {
      this.warningTypeParam.warningPageNumber = this.warningTypeList.length % 2 > 0 ? (this.warningTypeList.length % 2) + 1 : this.warningTypeList.length / 2
      this.warningPageChange()
    },
    needDialog (e) {
      if (!e) {
        this.needFormData = {nr: '', gzr: '', jzsj: ''}
      }
    },
    loginCorpId () {
      this.financeDate = this.loginDate
      this.fsyebactDate = this.loginDate.substring(0, 4) + '-01-01'
      this.$nextTick(nt => {
        this.initData()
      })
    },
    loginDate (date) {
      this.financeDate = date
      this.fsyebactDate = date.substring(0, 4) + '-01-01'
      this.$nextTick(nt => {
        this.initData()
      })
    }
  }
}
</script>
<style lang="less">
  .progress-popper {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.83);
  }
  .step-left .el-step {
   min-width: 142px;
  }
  .step-left {
    overflow-x: auto;
  }
  .step-left .el-step.is-simple .el-step__title {
    font-size: 14px;
  }
  .todo-list {
    .el-carousel__arrow{
      /*right: 0;*/
      width: 20px;
      height: 20px;
    }
    .el-carousel__arrow--right {
      right: 0px;
    }
    .el-carousel__arrow--left {
      left: 0px;
    }
  }

  .todo-list .el-carousel__arrow .el-icon-arrow-right,
  .todo-list .el-carousel__arrow .el-icon-arrow-left{
    color: #0c0c0c;
    font-weight: 600;
  }

  .todo-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 75%;
    overflow: hidden;
    display: inline-block;
  }

  .todo-name.todo-name-short {
    max-width: 65%;
  }

  .content-3 .cp-date input{
    border: none!important;
    cursor: pointer;
    font-weight: 600;
  }
  .content-3 .cp-date .el-input__prefix .el-icon-arrow-down {
    font-weight: 600;
    color: #0c0c0c;
    position: absolute;
    right: -100px;
  }
  .content-4 .el-input-group__append, .content-4 .el-input-group__prepend {
    background-color: white!important;
    font-weight: 600;
    text-align: center;
    border: none ;
  }
  .content-4 .el-input__inner {
    border: none ;
  }
  .content-4 .el-input__inner {
    border-right-color: white;
  }
  .content-4 .el-input-group__prepend .el-icon-search:before {
    font-size: 18px;
  }
  .content-4 .input-with-select .el-input__inner {
    padding-left: 10px;
  }

  .content-4 .input-with-select .el-input-group__prepend .el-input__inner {
    padding-left: 10px;
    color: #2c3e50;
  }
</style>

<style scoped lang="less">
  .msg-more {
    width: 65px;
    color: #0889F5;
    margin: 0px auto;
    line-height: 21px;
    background: #DFEFFC;
    padding: 0px 4px;
    border-radius: 12px;
    margin-top: 3px;
    cursor: pointer;
  }
  .msg-item-content {
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 38px;
    margin: 7px 0;
  }
  .msg-item-title {
    border-bottom: 1px solid #E6E6E6;
    height: 36px;
    line-height: 31px;
  }
  .msg-item {
    background: #F5F5F5;
    padding: 5px;
    cursor: pointer;
    margin: 5px 0;
  }
  .msg-list {
    overflow: auto;
    height: 365px;
  }
  .msg-title span {
    cursor: pointer;
  }
  .msg-title-active {
    color: #0E8CF5;
    font-size:14px;
  }
  .el-col-content.content-3 img{
    width: 28px;
    height: 28px;
  }
  .cp-date {
    position: absolute;
    right: 0;
  }
  .content-4 .el-icon-plus {
    margin-left: 10px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer
  }
  .home-content .content-1 label {
    font-size: 14px;
    margin-top: 10px;
    display: inline-block;
  }
  .notice-main {
    width: 70px;
    border-radius: 5px;
    text-align: center;
    color: white;
    padding: 5px 0;
    background: rgba(0,0,0,1);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.13);
    opacity: 0.5;
    border-radius: 4px;
    right: 0px;
    position: fixed;
    top: 49%;
    border: 1px solid rgba(0,0,0,1);
    ul {
      list-style: none;
    }
  }
  .notice-main li {
    border-bottom: 1px solid rgba(255, 255, 255, .2);
    font-size: 13px;
    padding: 9px 0;
    cursor: pointer;
  }
  .notice-main li:hover {
    background: #303546;
  }
  .notice-main li:last-child {
    border-bottom: none
  }
  .show-matter {
    float: right;
    margin-top: -10px;
  }
  .warning-list li i{
    color: #178df3;
    display: inline-block;
    width: 7px;
    height: 7px;
    background: #178df3;
    border-radius: 50%;
    vertical-align: unset;
    margin-right: 2px;
    border: 1.5px solid #fff;
  }
  .warning-list li {
    padding: 5px 0;
  }
  .warning-list {
    padding: 0px 0;
    list-style: none;
    position: relative;
  }
  .warning-input {
    width: calc(100% - 100px);
    /*width: 290px;*/
    border: 1px solid #bfbfbf;
    border-radius: 3px;
    margin-left: 15px;
  }
  .prepend-select {
    width: 85px;
    font-size: 12px;
    border-right: 1px solid #bfbfbf;
  }
  .input-with-select{
    /*width: 290px;*/
    width: calc(100% - 100px);
    border: 1px solid #bfbfbf;
    border-radius: 3px;
    padding-left: 0px;
    margin-left: 15px;
  }
  .home-content {
    height: 100%;
    min-height: 618px;
    overflow-y: hidden;
  }
  .home-content .el-col {
    padding: 7px;
  }
  .home-content .el-col .el-col-content{
    border-radius: 5px;
    /*border: 1px solid #8c8c8c;*/
    background: white;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 12px;

  }
  /*.home-content > .el-row {*/
    /*height: 50%;*/
  /*}*/
  .content-1 .el-row {
    height: 50%;
  }
  .content-3 > .el-row {
    height: 20%;
    border-bottom: 1px solid #eaeefb;
    width: 96%;
    margin: 0 auto;
  }
  .content-3-row {
    height: 23%;
    border-bottom: 1px solid #eaeefb;
    width: 90%;
    margin: 0 auto;
  }
  .content-3-row:last-child {
    height: 31%;
  }
  .content-3 .content-3-row label {
    font-size: 12px;
  }
  .content-3 > .el-row:first-child, .content-3 > .el-row:last-child {
    border-bottom: none
  }
  .el-col-content img {
    height: 43px;
    width: 43px;
    display: block;
    text-align: center;
    margin: 0 auto;
    cursor: pointer;
  }
  .el-col-content label {
    font-size:12px;
    /*display: block;*/
    text-align: center;
    cursor: pointer;
  }
  .active-label {
    color: #3391f5;
  }
  .content-1, .content-2 {
    height: 258px;
  }
  .content-3, .content-4 {
    height: 403px;
    padding: 0 14px;
  }
  .content-3-title {
    font-size:14px;
    font-family:SourceHanSansCN-Bold;
    font-weight:bold;
    color:rgba(0,0,0,1);
    margin-bottom: 10px;
    display: inline-block;
  }
  /deep/ .settingLine .el-dialog__body{
    padding: 5px 20px 0;
  }
  /deep/ .settingLine .el-input-number {
    width: 100%;
  }
  /deep/ .settingLine .el-form-item__content{
    text-align: center;
    padding: 0 10px;
  }
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
