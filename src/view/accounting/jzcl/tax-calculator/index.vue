<template>
  <div class="app-main">
    <div
      class="kj-container"
      v-loading="loading"
      :element-loading-text="loadingText"
      :element-loading-spinner="loadingSpinner">
      <div class="kj-head">
        <div style="float: left">
          <el-button
            @click="prevPeriod"
            :disabled="disablePrevPeriodButton"
            type="primary"
            class="period-nav"
            icon="el-icon-caret-left"></el-button>
          <el-date-picker
            style="width: 120px"
            v-model="queryPeriod"
            value-format="yyyy-MM"
            :editable="false"
            :clearable="false"
            type="month"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button
            @click="nextPeriod"
            type="primary"
            class="period-nav"
            icon="el-icon-caret-right"></el-button>
          <el-tooltip content="本节点功能只支持2019年之后使用" placement="right">
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
        <div class="kj-button-group">
          <el-button @click="loadTaxData(true)">取数</el-button>
          <el-button @click="saveTaxDatas">保存</el-button>
          <el-button @click="exportExcel">导出</el-button>
        </div>
      </div>
      <div class="kj-main">
        <ul class="nav nav-tabs">
          <li :class="activeNavIndex === 0 ? 'active' : ''" @click="navTax(0, $event)">
            <a href="javascript:void(0);">增值税</a>
          </li>
          <li :class="activeNavIndex === 1 ? 'active' : ''" @click="navTax(1, $event)">
            <a href="javascript:void(0);">其他税费</a>
          </li>
          <li :class="activeNavIndex === 2 ? 'active' : ''" @click="navTax(2, $event)">
            <a href="javascript:void(0);">所得税</a>
          </li>
        </ul>
        <div class="tax-view">
          <div class="tax-section">
            <div class="tax-header skin_base_color_border_bottom">
              <div class="title"><span class="title-name skin_base_color">增值税</span><span
                class="triangle-right skin_base_color_border_left"></span></div>
              <span class="head_tax_info">{{ formatPeriodType(settings.addTaxPeriodType) }}</span>
            </div>
            <template v-if="settings.addTaxPeriodType === 1 && period !== quarterEnd">
              <div class="empty_data">
                该客户增值税为季报，当期无需计税
              </div>
            </template>
            <template v-else>
              <template v-if="isSmall">
                <table id="taxItemTable" class="table table-bordered table-condensed" style="margin-bottom:0">
                  <thead>
                  <tr>
                    <th rowspan="2" class="col-md-1"></th>
                    <th rowspan="2" class="col-md-2">税率</th>
                    <th class="col-md-3">货物及劳务</th>
                    <th class="col-md-3">服务不动产与无形资产</th>
                    <th rowspan="2" class="col-md-3">税额</th>
                  </tr>
                  <tr>
                    <th>金额</th>
                    <th>金额</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(tax, index) in outTaxOrdered" :key="index">
                    <td v-if="index === 0" v-bind:rowspan="outTaxOrdered.length + 2">销项</td>
                    <td style="position: relative">
                      <div class="row-operate ">
                        <i class="el-icon-circle-plus-outline" title="增行"  @click="showOutTaxDialog()"></i>
                        <i class="el-icon-remove-outline" title="删行" @click="delOutTax(index)"></i>
                      </div>
                      {{ tax.tax_name }}
                    </td>
                    <td v-if="tax.rate !== 0.05" class="text-right td-input">
                      <mny-input :value="tax.mny_cargo"
                                 @input="onOutTaxInput($event, tax, 'mny_cargo')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td v-else class="text-center">-</td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.mny_service"
                                 @input="onOutTaxInput($event, tax, 'mny_service')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.taxmny"
                                 @input="onOutTaxInput($event, tax, 'taxmny')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>免税销售额</td>
                    <td class="text-right">{{ outTaxGenCargoFree|forThousands }}</td>
                    <td class="text-right">{{ outTaxGenServiceFree|forThousands }}</td>
                    <td class="text-right">{{ outTaxGenTaxFree|forThousands }}</td>
                  </tr>
                  <tr>
                    <td>合计</td>
                    <td class="text-right">{{ outTaxSumMnyCargo|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumMnyService|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumTaxmny|forThousands }}</td>
                  </tr>
                  </tbody>
                </table>
                <table id="addTaxTable" class="table table-bordered table-condensed">
                  <thead style="display: none">
                  <tr>
                    <th class="col-md-3"></th>
                    <th class="col-md-3"></th>
                    <th class="col-md-3"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td rowspan="6">税费计算</td>
                    <td>本期应纳税额</td>
                    <td class="text-right">{{ calAddTaxPayableSmall|forThousands }}</td>
                  </tr>
                  <tr>
                    <td>本期免税额</td>
                    <td class="text-right">{{ outTaxGenTaxFree|forThousands }}</td>
                  </tr>
                  <tr>
                    <td>税控设备及维修费</td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.sksb" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>应纳税额合计</td>
                    <td class="text-right">{{ calAddTaxPayable|forThousands }}</td>
                  </tr>
                  <tr>
                    <td>本期已缴税额</td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.yjse" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>本期应补（退）税额</td>
                    <td class="text-right">{{ calAddTaxRealPayable|forThousands }}</td>
                  </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                <!-- 增值税一般人 -->
                <table id="taxItemTable" class="table table-bordered table-condensed" style="margin-bottom:0">
                  <thead>
                  <tr>
                    <th rowspan="2" class="col-md-1"></th>
                    <th rowspan="2" class="col-md-1">税率</th>
                    <th rowspan="2" class="col-md-1">份数</th>
                    <th colspan="2" class="col-md-3">专票</th>
                    <th colspan="2" class="col-md-3">普票和其他</th>
                    <th colspan="2" class="col-md-3">未开票</th>
                  </tr>
                  <tr>
                    <th>金额</th>
                    <th>税额</th>
                    <th>金额</th>
                    <th>税额</th>
                    <th>金额</th>
                    <th>税额</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(tax, index) in outTaxOrdered" :key="index">
                    <td v-if="index === 0" v-bind:rowspan="outTaxOrdered.length + 1">销项</td>
                    <td style="position: relative">
                      <div class="row-operate">
                        <i class="el-icon-circle-plus-outline" title="增行"  @click="showOutTaxDialog()"></i>
                        <i class="el-icon-remove-outline" title="删行" @click="delOutTax(index)"></i>
                      </div>
                      {{ tax.tax_name }}
                    </td>
                    <td class="text-center">-</td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.mny_spec"
                                 @input="onOutTaxInput($event, tax, 'mny_spec')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.taxmny_spec"
                                 @input="onOutTaxInput($event, tax, 'taxmny_spec')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.mny_gen"
                                 @input="onOutTaxInput($event, tax, 'mny_gen')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.taxmny_gen"
                                 @input="onOutTaxInput($event, tax, 'taxmny_gen')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.mny_not"
                                 @input="onOutTaxInput($event, tax, 'mny_not')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input :value="tax.taxmny_not"
                                 @input="onOutTaxInput($event, tax, 'taxmny_not')"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td v-if="!outTaxOrdered">销项</td>
                    <td>合计</td>
                    <td class="text-center">-</td>
                    <td class="text-right">{{ outTaxSumMnySpec|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumTaxmnySpec|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumMnyGen|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumTaxmnyGen|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumMnyNot|forThousands }}</td>
                    <td class="text-right">{{ outTaxSumTaxmnyNot|forThousands }}</td>
                  </tr>
                  <tr v-for="(tax, index) in taxInfo.intax" :key="index">
                    <td v-if="index === 0" v-bind:rowspan="taxInfo.intax.length + 1">进项</td>
                    <td>{{ tax.tax_name }}</td>
                    <td class="text-center td-input">
                      <mny-input class="text-center"
                                 v-model="tax.num_count" precision="0"
                                 :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="tax.mny_spec" :editable="addTaxEditable"></mny-input>
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="tax.taxmny_spec" :editable="addTaxEditable"></mny-input>
                    </td>
                    <td v-if="tax.tax_name === '本期认证抵扣'" class="text-center">
                      -
                    </td>
                    <td v-else class="text-right td-input">
                      <mny-input v-model="tax.mny_gen" :editable="addTaxEditable"></mny-input>
                    </td>
                    <td v-if="tax.tax_name === '本期认证抵扣'" class="text-center">
                      -
                    </td>
                    <td v-else class="text-right td-input">
                      <mny-input v-model="tax.taxmny_gen" :editable="addTaxEditable"></mny-input>
                    </td>
                    <td v-if="tax.tax_name === '本期认证抵扣' || tax.tax_name === '旅客运输服务扣除凭证'"
                        class="text-center">
                      -
                    </td>
                    <td v-else class="text-right td-input">
                      <mny-input v-model="tax.mny_not" :editable="addTaxEditable"></mny-input>
                    </td>
                    <td v-if="tax.tax_name === '本期认证抵扣' || tax.tax_name === '旅客运输服务扣除凭证'"
                        class="text-center">
                      -
                    </td>
                    <td v-else class="text-right td-input">
                      <mny-input v-model="tax.taxmny_not" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td v-if="!taxInfo.intax">进项</td>
                    <td>合计</td>
                    <td class="text-center">{{ calInTaxSum('num_count')|forThousands(0, true) }}</td>
                    <td class="text-right">{{ calInTaxSum('mny_spec')|forThousands }}</td>
                    <td class="text-right">{{ calInTaxSum('taxmny_spec')|forThousands }}</td>
                    <td class="text-right">{{ calInTaxSum('mny_gen')|forThousands }}</td>
                    <td class="text-right">{{ calInTaxSum('taxmny_gen')|forThousands }}</td>
                    <td class="text-right">{{ calInTaxSum('mny_not')|forThousands }}</td>
                    <td class="text-right">{{ calInTaxSum('taxmny_not')|forThousands }}</td>
                  </tr>
                  </tbody>
                </table>
                <table id="addTaxTable" class="table table-bordered table-condensed">
                  <thead style="display: none">
                  <tr>
                    <th class="col-md-3"></th>
                    <th class="col-md-3"></th>
                    <th class="col-md-3"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td rowspan="11">
                      税费计算
                      <i title="设置显示字段" class="tax_setting el-icon-s-tools"
                         @click="addTaxFieldSettingVisible=true"></i>
                    </td>
                    <td style="position: relative;">
                      上期留抵税额
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.sqld" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>进项税额转出</td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.jxszc" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr v-if="period >= '2019-04'">
                    <td>加计抵减本期实际抵减额</td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.jjdj" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr v-if="addTaxHiddenFieldShow.ckts || taxInfo.addtax_info.ckts">
                    <td style="position: relative">
                      <div class="operate column_operate">
                        <a title="删除" class="del" @click="delAddTaxField('ckts')"></a>
                      </div>
                      出口退税
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.ckts" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr v-if="addTaxHiddenFieldShow.zcdjzzs || taxInfo.addtax_info.zcdjzzs">
                    <td style="position: relative">
                      <div class="operate column_operate">
                        <a title="删除" class="del" @click="delAddTaxField('zcdjzzs')"></a>
                      </div>
                      转出多交增值税
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.zcdjzzs" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>应纳税额</td>
                    <td class="text-right">{{ calAddTaxPayable|forThousands }}</td>
                  </tr>
                  <tr>
                    <td>税控设备及维修费</td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.sksb" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>本期已缴税额</td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.yjse" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr v-if="addTaxHiddenFieldShow.ckdj || taxInfo.addtax_info.ckdj">
                    <td style="position: relative">
                      <div class="operate column_operate">
                        <a title="删除" class="del" @click="delAddTaxField('ckdj')"></a>
                      </div>
                      出口抵减内销产品应纳税额
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.ckdj" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr v-if="addTaxHiddenFieldShow.xxdj || taxInfo.addtax_info.xxdj">
                    <td style="position: relative">
                      <div class="operate column_operate">
                        <a title="删除" class="del" @click="delAddTaxField('xxdj')"></a>
                      </div>
                      销项税额抵减
                    </td>
                    <td class="text-right td-input">
                      <mny-input v-model="taxInfo.addtax_info.xxdj" :editable="addTaxEditable"></mny-input>
                    </td>
                  </tr>
                  <tr>
                    <td>期末留抵税额</td>
                    <td class="text-right">{{ taxInfo.addtax_info.qmld|forThousands }}</td>
                  </tr>
                  <tr>
                    <td>本期应补（退）税额</td>
                    <td class="text-right">{{ calAddTaxRealPayable|forThousands }}</td>
                  </tr>
                  </tbody>
                </table>
              </template>
              <el-dialog
                title="新增税目"
                :visible.sync="addOutTaxDialogVisible"
                :close-on-click-modal="false"
                width="500px"
                style="overflow: hidden"
                @open="onAddTaxDialogOpen">
                <el-table :data="toAddTaxData"
                          border
                          ref="multipleTable"
                          @row-click="onAddTaxTableRowClick"
                          @selection-change="handleTaxItemSelectionChange"
                          :max-height="maxDialogTableHeight"
                          style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="sname"
                    label="税目简称"
                    header-align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="shuilv"
                    label="税率"
                    header-align="center"
                    align="right"
                    :formatter="formatRate"
                    width="140">
                  </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                  <el-button class="ui-btn" @click="addOutTaxDialogVisible = false">取 消</el-button>
                  <el-button class="ui-btn" type="primary" @click="addOutTax">确 定</el-button>
                </span>
              </el-dialog>
              <el-dialog
                v-if="!isSmall"
                title="显示字段"
                :visible.sync="addTaxFieldSettingVisible"
                :close-on-click-modal="false"
                width="500px"
                style="overflow: hidden"
                @open="onAddTaxFieldSetting">
                <el-table :data="getAddTaxFieldSettingData()"
                          border
                          ref="multipleTable"
                          @row-click="onAddTaxFieldTableRowClick"
                          @selection-change="handleAddTaxFieldChange"
                          :max-height="maxDialogTableHeight"
                          style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="名称"
                    header-align="center"
                  >
                  </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                  <el-button class="ui-btn" @click="addTaxFieldSettingVisible = false">取 消</el-button>
                  <el-button class="ui-btn" type="primary" @click="applyAddTaxFieldSetting">确 定</el-button>
                </span>
              </el-dialog>
            </template>
          </div>
          <div class="tax-section">
            <div class="tax-header skin_base_color_border_bottom">
              <div class="title">
                <span class="title-name skin_base_color">其他税费
                </span><span class="triangle-right skin_base_color_border_left"></span>
              </div>
            </div>
            <table id="additionalTaxTable" class="table table-bordered table-condensed">
              <thead>
              <tr>
                <th class="col-md-2"></th>
                <th class="col-md-1">计税依据</th>
                <th class="col-md-1">税率</th>
                <th class="col-md-1">本期应纳税额</th>
                <th class="col-md-1">本期减免税额</th>
                <th class="col-md-1">本期已缴税额</th>
                <th class="col-md-1" v-if="isSmall">增值税小规模纳税人减征额</th>
                <th class="col-md-1">本期应补（退）税额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(tax, index) in surtaxOrdered" :key="index">
                <td class="surtax-name-td">
                  <div class="row-operate">
                    <i class="el-icon-circle-plus-outline" title="增行"  @click="addOtherTaxDialogVisible = true"></i>
                    <i class="el-icon-remove-outline" title="删行" @click="delSurtax(tax, index)"></i>
                  </div>
                  {{ tax.tax_name }}
                  <i title="设置" class="tax_setting el-icon-s-tools" @click="onSetSurtax(tax)"></i>
                </td>
                <td v-if="notSurtaxQuarterEnd && tax.is_surtax && index === 0"
                    :rowspan="surtaxCount" :colspan="isSmall ? 8 : 7"
                    style="color: #888" class="text-center">
                  该客户附加税为季报，当期无需计税
                </td>
                <td v-if="!tax.is_surtax && tax.period_type === 1 && period !== quarterEnd" :colspan="isSmall ? 8 : 7"
                    style="color: #888" class="text-center">
                  该客户{{ tax.tax_name }}为季报，当期无需计税
                </td>
                <td v-if="showSurtaxTd(tax, index)" class="text-right td-input">
                  <mny-input :value="tax.base_tax" @input="onSurtaxInput(tax, 'base_tax', $event)"
                             :editable="tax.is_surtax ? surtaxEditable : !tax.voucher_num"></mny-input>
                </td>
                <td v-if="showSurtaxTd(tax, index)" class="text-right td-input">
                  <template v-if="tax.tax_name === '城建税' || tax.tax_name === '地方教育费附加'">
                    <el-select v-model="tax.rate"
                               placeholder="请选择"
                               @change="onSurtaxInput(tax, 'rate', $event)"
                               style="width: 100%;">
                      <el-option
                        v-for="item in (tax.tax_name === '城建税'  ? urbanConstructionTaxRateData : localEduTaxRateData)"
                        :key="item"
                        :label="formatRateVal(item)"
                        :value="item">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else>
                    <mny-input :value="tax.rate" precision="5"
                               @input="onSurtaxInput(tax, 'rate', $event)"
                               :formatter="formatRateVal"
                               :editable="tax.is_surtax ? surtaxEditable : !tax.voucher_num"></mny-input>
                  </template>
                </td>
                <td v-if="showSurtaxTd(tax, index)" class="text-right">{{ tax.ynse|forThousands }}</td>
                <td v-if="showSurtaxTd(tax, index)" class="text-right">
                  <mny-input :value="tax.jmse" @input="onSurtaxInput(tax, 'jmse', $event)"
                             :editable="tax.is_surtax ? surtaxEditable : !tax.voucher_num"></mny-input>
                </td>
                <td v-if="showSurtaxTd(tax, index)" class="text-right td-input">
                  <mny-input :value="tax.yjse" @input="onSurtaxInput(tax, 'yjse', $event)"
                             :editable="tax.is_surtax ? surtaxEditable : !tax.voucher_num"></mny-input>
                </td>
                <td v-if="isSmall && showSurtaxTd(tax, index)" class="text-right">
                  <mny-input :value="tax.xgmjze" @input="onSurtaxInput(tax, 'xgmjze', $event)"
                             :editable="tax.is_surtax ? surtaxEditable : !tax.voucher_num"></mny-input>
                </td>
                <td v-if="showSurtaxTd(tax, index)" class="text-right">{{ tax.ybtse|forThousands }}</td>
              </tr>
              </tbody>
            </table>
            <el-dialog
              title="新增税种"
              :visible.sync="addOtherTaxDialogVisible"
              :close-on-click-modal="false"
              width="400px"
              style="overflow: hidden"
              @open="onAddTaxDialogOpen">
              <div>
                <el-table :data="getSurtaxAddData()"
                          border
                          ref="multipleTable"
                          @row-click="onAddTaxTableRowClick"
                          @selection-change="handleSurtaxSelectionChange"
                          :max-height="maxDialogTableHeight"
                          style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="tax_name"
                    label="名称"
                    header-align="center">
                  </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer" style="text-align: center; padding: 10px 0;">
                  <el-button class="ui-btn" @click="addOtherTaxDialogVisible = false">取 消</el-button>
                  <el-button class="ui-btn" type="primary" @click="addSurtax">确 定</el-button>
                </div>
              </div>

            </el-dialog>
            <el-dialog
              :title="surtaxTempForm.tax_name + '设置'"
              :visible.sync="surtaxSettingDialogVisible"
              :close-on-click-modal="false"
              width="500px"
              style="overflow: hidden">
              <div style="margin-top: 15px">
                <el-form ref="form" :model="surtaxTempForm" label-width="80px">
                  <el-form-item label="税率">
                    <template
                      v-if="surtaxTempForm.tax_name === '城建税'">
                      <el-select v-model="surtaxTempForm.rate"
                                 placeholder="请选择"
                                 style="width: 100%;">
                        <el-option
                          v-for="item in urbanConstructionTaxRateData"
                          :key="item"
                          :label="formatRateVal(item)"
                          :value="item">
                        </el-option>
                      </el-select>
                    </template>
                    <template
                      v-else-if="surtaxTempForm.tax_name === '地方教育费附加'">
                      <el-select v-model="surtaxTempForm.rate"
                                 placeholder="请选择"
                                 style="width: 100%;">
                        <el-option
                          v-for="item in localEduTaxRateData"
                          :key="item"
                          :label="formatRateVal(item)"
                          :value="item">
                        </el-option>
                      </el-select>
                    </template>
                    <template v-else>
                      <el-input v-model="surtaxTempForm.rate"></el-input>
                    </template>
                  </el-form-item>
                  <el-form-item label="申报周期">
                    <el-select v-model="surtaxTempForm.period_type"
                               placeholder="请选择"
                               :disabled="surtaxTempForm.is_surtax"
                               style="width: 100%;">
                      <el-option
                        v-for="item in periodTypes"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="toSetTempTax.length > 1" style="text-align: center;">
                    <el-button class="ui-btn" type="primary" @click="saveSurtaxTemp">下一个</el-button>
                  </el-form-item>
                  <el-form-item v-else-if="toSetTempTax.length === 1" style="text-align: center;">
                    <el-button class="ui-btn" type="primary" @click="saveSurtaxTemp">完 成</el-button>
                  </el-form-item>
                  <el-form-item v-else style="text-align: center;">
                    <el-button class="ui-btn" type="primary" @click="saveSurtaxTemp">保 存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
          </div>
          <div class="tax-section">
            <div class="tax-header skin_base_color_border_bottom">
              <div class="title"><span class="title-name skin_base_color">
                <template v-if="settings.incomeTaxType === 1">个人生产经营所得</template>
                <template v-else>企业所得税</template>
              </span><span class="triangle-right skin_base_color_border_left"></span></div>
              <span class="head_tax_info">
                <span>{{ formatPeriodType(settings.incomeTaxPeriodType) }}</span>
                <span>{{ formatIncomeTaxType(settings.incomeTaxLevyType) }}</span>
              </span>
            </div>
            <template v-if="settings.incomeTaxPeriodType === 1 && period !== quarterEnd">
              <div class="empty_data">
                该客户所得税为季报，当期无需计税
              </div>
            </template>
            <template v-else>
              <table id="incomeTaxTable" class="table table-bordered table-condensed">
                <thead>
                <tr>
                  <th class="col-md-6">项目</th>
                  <th class="col-md-6">本年累计</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="settings.incomeTaxType !== 1">
                  <template v-if="settings.incomeTaxLevyType === 0">
                    <!-- 企业核定 -->
                    <tr>
                      <td>收入总额</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.srze" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-left: 15px;">减：不征税收入</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.bzssr" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-left: 15px;">减：免税收入</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.mssr" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>税务机关核定的应税所得率（%）</td>
                      <td class="text-right">{{ taxInfo.incometax.hdsdl }}</td>
                    </tr>
                    <tr>
                      <td>应纳税所得额</td>
                      <td class="text-right"> {{ getTaxableIncome|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>税率（25%）</td>
                      <td class="text-right"> {{ taxInfo.incometax.rate }}</td>
                    </tr>
                    <tr>
                      <td>应纳所得税额</td>
                      <td class="text-right"> {{ getIncomeTax|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>减：符合条件的小型微利企业减免企业所得税</td>
                      <td class="text-right"> {{ getIncomeTaxPreference|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>减：实际已缴纳所得税额
                        <el-tooltip class="item" effect="light"
                                    content="本字段取数算法：“所得税费用”科目本年度借方发生数（不包括当期计提的金额），若与实际不符，请修改"
                                    placement="right">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </td>
                      <td class="text-right">
                        <mny-input v-model="taxInfo.incometax.sjyjsds" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>本期实际应补（退）所得税额</td>
                      <td class="text-right"> {{ getRealIncomeTax|forThousands }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <!-- 企业查账 -->
                    <tr>
                      <td>利润总额</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.lrze" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-left: 15px;">减：不征税收入和免税收入等</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.bzsmssr" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-left: 43px;">固定资产加速折旧调减额</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.gdzczj" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-left: 43px;">
                        弥补以前年度亏损
                        <el-popover
                          placement="right"
                          width="310"
                          v-model="mbDialogVisible"
                          :popper-options="popperOptions">
                          <div style="padding-left: 28px;">
                            弥补年度：
                            <span> {{ period.substring(0, 4) }} </span>
                          </div>
                          <div style="margin-top: 10px">
                            可弥补亏损额：
                            <el-input-number
                              style="width:150px;"
                              v-model="makeLoss" :precision="2"
                              :controls="false"></el-input-number>
                            <el-tooltip class="item" effect="light" content="当前年度可弥补亏损数（包括前五年或前十年未弥补的亏损数）"
                                        placement="right">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </div>
                          <div style="text-align: center;margin-top: 10px;">
                            <el-button class="ui-btn" type="primary" size="mini" @click="saveMakeLoss">确 定</el-button>
                          </div>
                          <i slot="reference" class="el-icon-s-tools" style="margin-left:20px;cursor:pointer;"></i>
                        </el-popover>
                      </td>
                      <td class="text-right"> {{ taxInfo.incometax.mbks|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>实际利润额</td>
                      <td class="text-right"> {{ getTaxableIncome|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>税率（25%）</td>
                      <td class="text-right"> {{ taxInfo.incometax.rate }}</td>
                    </tr>
                    <tr>
                      <td>应纳所得税额</td>
                      <td class="text-right"> {{ getIncomeTax|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>减：减免所得税额</td>
                      <td class="text-right"> {{ getIncomeTaxPreference|forThousands }}</td>
                    </tr>
                    <tr>
                      <td style="padding-left: 30px;">实际已缴纳所得税额
                        <el-tooltip class="item" effect="light"
                                    content="本字段取数算法：“所得税费用”科目本年度借方发生数（不包括当期计提的金额），若与实际不符，请修改"
                                    placement="right">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </td>
                      <td class="text-right">
                        <mny-input v-model="taxInfo.incometax.sjyjsds" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>本期实际应补（退）所得税额</td>
                      <td class="text-right"> {{ getRealIncomeTax|forThousands }}</td>
                    </tr>
                  </template>
                </template>
                <template v-else>
                  <template v-if="settings.incomeTaxLevyType === 0">
                    <!-- 个人核定 -->
                    <tr>
                      <td>收入总额</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.srze" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>应税所得率（%）</td>
                      <td class="text-right"> {{ taxInfo.incometax.hdsdl }}</td>
                    </tr>
                    <tr>
                      <td>应纳税所得额</td>
                      <td class="text-right"> {{ getTaxableIncome|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>税率（%）</td>
                      <td class="text-right"> {{ getIndividualIncomeRate() }}</td>
                    </tr>
                    <tr>
                      <td>速算扣除数</td>
                      <td class="text-right"> {{ getQuickCalculationDeduction|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>应纳税额</td>
                      <td class="text-right"> {{ getIncomeTax|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>已预缴税额
                        <el-tooltip class="item" effect="light"
                                    content="本字段取数算法：“所得税费用”科目本年度借方发生数（不包括当期计提的金额），若与实际不符，请修改"
                                    placement="right">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </td>
                      <td class="text-right">
                        <mny-input v-model="taxInfo.incometax.sjyjsds" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>应补（退）税额</td>
                      <td class="text-right"> {{ getRealIncomeTax|forThousands }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <!-- 个人查账 -->
                    <tr>
                      <td>利润总额</td>
                      <td class="text-right td-input">
                        <mny-input v-model="taxInfo.incometax.lrze" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>弥补以前年度亏损
                        <el-popover
                          placement="right"
                          width="310"
                          v-model="mbDialogVisible"
                          :popper-options="popperOptions">
                          <div style="padding-left: 28px;">
                            弥补年度：
                            <span> {{ period.substring(0, 4) }} </span>
                          </div>
                          <div style="margin-top: 10px">
                            可弥补亏损额：
                            <el-input
                              style="width:150px;" v-model="makeLoss"
                              :controls="false" :precision="2"></el-input>
                            <el-tooltip class="item" effect="light" content="当前年度可弥补亏损数（包括前五年或前十年未弥补的亏损数）"
                                        placement="right">
                              <i class="el-icon-warning-outline"></i>
                            </el-tooltip>
                          </div>
                          <div style="text-align: center;margin-top: 10px;">
                            <el-button class="ui-btn" type="primary" size="mini" @click="saveMakeLoss">确 定</el-button>
                          </div>
                          <i slot="reference" class="el-icon-s-tools"
                             style="margin-left:20px;cursor:pointer;"></i>
                        </el-popover>
                      </td>
                      <td class="text-right"> {{ taxInfo.incometax.mbks|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>投资者减除费用</td>
                      <td class="text-right">
                        <mny-input v-model="taxInfo.incometax.tzzjc" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>专项扣除</td>
                      <td class="text-right">
                        <mny-input v-model="taxInfo.incometax.zxkc" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>应纳税所得额</td>
                      <td class="text-right"> {{ getTaxableIncome|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>税率（%）</td>
                      <td class="text-right"> {{ getIndividualIncomeRate() }}</td>
                    </tr>
                    <tr>
                      <td>速算扣除数</td>
                      <td class="text-right"> {{ getQuickCalculationDeduction|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>应纳税额</td>
                      <td class="text-right"> {{ getIncomeTax|forThousands }}</td>
                    </tr>
                    <tr>
                      <td>已预缴税额
                        <el-tooltip class="item" effect="light"
                                    content="本字段取数算法：“所得税费用”科目本年度借方发生数（不包括当期计提的金额），若与实际不符，请修改"
                                    placement="right">
                          <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                      </td>
                      <td class="text-right">
                        <mny-input v-model="taxInfo.incometax.sjyjsds" :editable="incomeTaxEditable"></mny-input>
                      </td>
                    </tr>
                    <tr>
                      <td>应补（退）税额</td>
                      <td class="text-right"> {{ getRealIncomeTax|forThousands }}</td>
                    </tr>
                  </template>
                </template>
                </tbody>
              </table>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Big from 'big.js'
import MnyInput from './components/MnyInput'
import loading from '@/mixins/loading'
import relateDataMixin from '@/mixins/relate-data'
import {getPreviousPeriod, getNextPeriod} from '@/utils'

export default {
  name: 'tax-calculator',
  components: {
    MnyInput
  },
  mixins: [loading, relateDataMixin],
  data: function () {
    let loginDate = this.$store.getters.getLoginDate
    let loginPeriod = loginDate.substring(0, 7)
    let loginCorp = this.$store.getters.getLoginCorp
    let isSmall = loginCorp.chname !== '一般纳税人'
    if (loginPeriod < '2019-01') {
      loginPeriod = '2019-01'
    }
    let beginPeriod = loginCorp.bdate.substring(0, 7)
    if (beginPeriod < '2019-01') {
      beginPeriod = '2019-01'
    }
    let beginPeriodDate = new Date(beginPeriod + '-01')
    beginPeriodDate.setHours(0, 0, 0, 0)
    return {
      dataLoaded: false,
      period: loginPeriod,
      queryPeriod: loginPeriod,
      beginPeriod,
      date: new Date(loginPeriod + '-01'),
      reFetchMethod: 'refetchPrompt',
      pk_corp: loginCorp.pk_gs,
      corpName: loginCorp.uname,
      activeNavIndex: 0,
      // 是否加载已保存数据
      initing: false,
      // 各税种信息
      taxInfo: {
        outtax: [],
        intax: [],
        addtax_info: {},
        surtax: [],
        incometax: {},
        addValueTaxStatus: {},
        surtaxStatus: {},
        incomeTaxStatus: {},
        incomeMny: 0
      },
      // 销项合计行
      outtaxSum: {},
      // 进项合计行
      intaxSum: {},
      surtax_base: 0,
      // 是否是小规模纳税人
      isSmall: isSmall,
      // 税种参数设置
      settings: {},
      // 销项免税行
      taxFreeRow: {},
      // 弥补亏损录入显示状态
      mbDialogVisible: false,
      // 增加销项税目对话框显示状态
      addOutTaxDialogVisible: false,
      // 增加其他税对话框显示状态
      addOtherTaxDialogVisible: false,
      // 附加税模板设置
      surtaxSettingDialogVisible: false,
      // 弥补亏损
      makeLoss: 0,
      allOutTaxItem: [],
      otherTaxArchives: [],
      // 附加税模板
      surtaxTemplates: [],
      toAddTaxData: [],
      // 税目选择
      taxItemSelection: [],
      surtaxSelection: [],
      addTaxFieldSelection: [],
      // 期间类型
      periodTypes: [
        {
          name: '月报',
          value: 0
        },
        {
          name: '季报',
          value: 1
        }
      ],
      // 附加税模板表单
      surtaxTempForm: {
        // tax_name: ""
      },
      popperOptions: {
        boundariesElement: '#scrollParent',
        placement: 'right'
      },
      toSetTempTax: [],
      pickerOptions: {
        disabledDate: (date) => {
          return date.getTime() < beginPeriodDate.getTime()
        }
      },
      voucherChanged: false,
      qmclChanged: false,
      urbanConstructionTaxRateData: [0.01, 0.05, 0.07],
      localEduTaxRateData: [0.01, 0.015, 0.02],
      // 设置增值税显示字段
      addTaxFieldSettingVisible: false,
      // 增值税一般人隐藏字段
      addTaxHiddenField: [
        {
          name: '出口退税',
          value: 'ckts'
        },
        {
          name: '转出多交增值税',
          value: 'zcdjzzs'
        },
        {
          name: '出口抵减内销产品应纳税额',
          value: 'ckdj'
        },
        {
          name: '销项税额抵减',
          value: 'xxdj'
        }
      ],
      addTaxHiddenFieldShow: {
        'ckts': false,
        'zcdjzzs': false,
        'ckdj': false,
        'xxdj': false
      }
    }
  },
  watch: {
    surtax_base: function (baseTax) {
      for (let i = 0; i < this.taxInfo.surtax.length; i++) {
        if (this.taxInfo.surtax[i].is_surtax && !this.taxInfo.surtax[i].pk_base_subject) {
          this.$set(this.taxInfo.surtax[i], 'base_tax', baseTax)
          this.onSurtaxInput(this.taxInfo.surtax[i])
        }
      }
    },
    mbDialogVisible: function (val) {
      if (val) {
        this.makeLoss = this.taxInfo.incometax.mbks
      }
    },
    surtaxSettingDialogVisible: function (val) {
      if (!val) {
        this.toSetTempTax = []
      }
    },
    queryPeriod: function (date) {
      this.loadTaxData()
    }
  },
  computed: {
    maxDialogTableHeight () {
      return this.$store.getters.maxDialogBodyHeight
    },
    disablePrevPeriodButton () {
      let prevPeriod = getPreviousPeriod(this.queryPeriod)
      return prevPeriod < this.beginPeriod
    },
    quarterStart: function () {
      let month = Number(this.period.substring(5, 7))
      month = (parseInt((month - 1) / 3) + 1) * 3 - 2
      let quarterStart = this.period.substring(0, 4) + '-' + (month < 10 ? '0' + month : month)
      return quarterStart
    },
    quarterEnd: function () {
      let month = Number(this.period.substring(5, 7))
      month = (parseInt((month - 1) / 3) + 1) * 3
      let quarterEnd = this.period.substring(0, 4) + '-' + (month < 10 ? '0' + month : month)
      return quarterEnd
    },
    notSurtaxQuarterEnd: function () {
      return this.settings.addTaxPeriodType === 1 && this.period !== this.quarterEnd
    },
    addTaxEditable: function () {
      return !this.taxInfo.addValueTaxStatus.carryover
    },
    surtaxEditable: function () {
      return !this.taxInfo.surtaxStatus.carryover
    },
    incomeTaxEditable: function () {
      return !this.taxInfo.incomeTaxStatus.carryover
    },
    surtaxOrdered: function () {
      return this.taxInfo.surtax ? this.taxInfo.surtax.sort(function (a1, a2) {
        return a1.snumber - a2.snumber
      }) : []
    },
    outTaxOrdered: function () {
      return this.taxInfo.outtax ? this.taxInfo.outtax.sort(function (a1, a2) {
        return a1.snumber - a2.snumber
      }) : []
    },
    outTaxSumMnyCargo: function () {
      return this.calOutTaxSum('mny_cargo')
    },
    outTaxSumMnyService: function () {
      return this.calOutTaxSum('mny_service')
    },
    outTaxSumTaxmny: function () {
      return this.calOutTaxSum('taxmny')
    },
    outTaxSumMnySpec: function () {
      return this.calOutTaxSum('mny_spec')
    },
    outTaxSumTaxmnySpec: function () {
      return this.calOutTaxSum('taxmny_spec')
    },
    outTaxSumMnyGen: function () {
      return this.calOutTaxSum('mny_gen')
    },
    outTaxSumTaxmnyGen: function () {
      return this.calOutTaxSum('taxmny_gen')
    },
    outTaxSumMnyNot: function () {
      return this.calOutTaxSum('mny_not')
    },
    outTaxSumTaxmnyNot: function () {
      return this.calOutTaxSum('taxmny_not')
    },
    // 附加税个数
    surtaxCount: function () {
      let count = 0
      for (let i = 0; i < this.taxInfo.surtax.length; i++) {
        if (this.taxInfo.surtax[i].is_surtax) {
          count++
        }
      }
      return count
    },
    addTaxFree: function () {
      let taxmny = new Big(0)
      if (this.isTaxFree()) {
        if (this.taxFreeRow.taxmny) {
          taxmny = taxmny.plus(this.taxFreeRow.taxmny)
        }
      }
      this.taxInfo.addtax_info.bqmse = taxmny
      return taxmny.toFixed(2)
    },
    // 小规模普票货物金额合计
    outTaxGenCargoSum: function () {
      return this.calFreeTaxSum('mny_cargo')
    },
    // 普票服务金额合计
    outTaxGenServiceSum: function () {
      return this.calFreeTaxSum('mny_service')
    },
    // 普票税额合计
    outTaxGenTaxSum: function () {
      return this.calFreeTaxSum('taxmny')
    },
    // 是否免税
    isTaxFree: function () {
      let limit = this.period >= '2019-01' ? 100000 : 30000
      if (this.settings.addTaxPeriodType === 1) {
        limit = limit * 3
      }
      return new Big(this.outTaxSumMnyCargo).plus(this.outTaxSumMnyService)
        .lte(limit)
    },
    outTaxGenCargoFree: function () {
      if (this.isTaxFree) {
        return this.calFreeTaxSum('mny_cargo')
      }
    },
    outTaxGenServiceFree: function () {
      if (this.isTaxFree) {
        return this.calFreeTaxSum('mny_service')
      }
    },
    outTaxGenTaxFree: function () {
      if (this.isTaxFree) {
        let mny = this.calFreeTaxSum('taxmny')
        this.taxInfo.addtax_info.bqmse = mny
        return mny
      } else {
        this.taxInfo.addtax_info.bqmse = '0.00'
      }
    },
    calAddTaxPayableSmall: function () {
      // 专票税额合计
      let taxmny = new Big(0)
      let taxArray = this.taxInfo.outtax
      for (let i = 0; i < taxArray.length; i++) {
        let tax = taxArray[i]
        if ((!this.isTaxFree || tax.fp_style === 2) && tax.taxmny) {
          taxmny = taxmny.plus(tax.taxmny)
        }
      }
      taxmny = taxmny.toFixed(2)
      this.$set(this.taxInfo.addtax_info, 'bqynse', taxmny)
      return taxmny
    },
    calAddTaxPayable: function () {
      // 应纳税额
      let taxmny
      if (this.isSmall) {
        taxmny = this.taxInfo.addtax_info.bqynse
        taxmny = new Big(taxmny || 0)
        if (this.taxInfo.addtax_info.sksb) {
          taxmny = taxmny.minus(this.taxInfo.addtax_info.sksb)
        }
      } else {
        taxmny = this.outtaxSum['taxmny_spec']
          .plus(this.outtaxSum['taxmny_gen'])
          .plus(this.outtaxSum['taxmny_not'])
        if (this.taxInfo.intax && this.taxInfo.intax.length > 0) {
          for (let i = 0; i < this.taxInfo.intax.length; i++) {
            let curIntax = this.taxInfo.intax[i]
            if (curIntax.tax_name === '本期认证抵扣') {
              if (curIntax['taxmny_spec']) {
                taxmny = taxmny.minus(curIntax['taxmny_spec'])
              }
            } else if (curIntax.tax_name === '其他扣税凭证') {
              if (curIntax['taxmny_spec']) {
                taxmny = taxmny.minus(curIntax['taxmny_spec'])
              }
              if (curIntax['taxmny_gen']) {
                taxmny = taxmny.minus(curIntax['taxmny_gen'])
              }
              if (curIntax['taxmny_not']) {
                taxmny = taxmny.minus(curIntax['taxmny_not'])
              }
            }
          }
        }
        let addFields = ['jxszc', 'ckts', 'zcdjzzs']
        let subFields = ['sqld', 'jjdj']
        for (let i = 0; i < addFields.length; i++) {
          let fieldVal = this.taxInfo.addtax_info[addFields[i]]
          if (fieldVal) {
            taxmny = taxmny.plus(fieldVal)
          }
        }
        for (let i = 0; i < subFields.length; i++) {
          let fieldVal = this.taxInfo.addtax_info[subFields[i]]
          if (fieldVal) {
            taxmny = taxmny.minus(fieldVal)
          }
        }
      }
      let rs = taxmny.toFixed(2)
      this.$set(this.taxInfo.addtax_info, 'ynse', rs)
      if (this.isSmall) {
        this.surtax_base = taxmny.lt(0) ? '0.00' : this.taxInfo.addtax_info['ynse']
      }
      return rs
    },
    calAddTaxRealPayable: function () {
      // 应补（退）税额
      let ynse = new Big(this.taxInfo.addtax_info['ynse'])
      if (this.isSmall) {
        let yjse = this.taxInfo.addtax_info['yjse']
        if (yjse) {
          ynse = ynse.minus(yjse)
        }
      } else {
        let subFields = ['sksb', 'yjse', 'ckdj', 'xxdj']
        for (let i = 0; i < subFields.length; i++) {
          let fieldVal = this.taxInfo.addtax_info[subFields[i]]
          if (fieldVal) {
            ynse = ynse.minus(fieldVal)
          }
        }
      }
      ynse = ynse.round(2)
      if (!this.isSmall) {
        if (ynse.lt(0)) {
          this.taxInfo.addtax_info['qmld'] = ynse.mul(-1).toFixed(2)
          this.taxInfo.addtax_info['ybtse'] = ''
          this.surtax_base = '0.00'
        } else {
          this.taxInfo.addtax_info['ybtse'] = ynse.toFixed(2)
          this.taxInfo.addtax_info['qmld'] = ''
          // 附加税计税基数
          this.surtax_base = this.taxInfo.addtax_info['ybtse']
        }
      } else {
        this.taxInfo.addtax_info['ybtse'] = ynse.lte(0) ? '0.00' : ynse.toFixed(2)
      }
      return this.taxInfo.addtax_info['ybtse']
    },
    // 应纳税所得额
    getTaxableIncome: function () {
      let income = new Big(0)
      if (this.settings.incomeTaxLevyType === 0) {
        if (this.settings.incomeTaxType === 0) {
          // 企业核定
          if (this.taxInfo.incometax.srze) {
            income = income.plus(this.taxInfo.incometax.srze)
          }
          if (this.taxInfo.incometax.bzssr) {
            income = income.minus(this.taxInfo.incometax.bzssr)
          }
          if (this.taxInfo.incometax.mssr) {
            income = income.minus(this.taxInfo.incometax.mssr)
          }
          if (this.taxInfo.incometax.hdsdl) {
            income = income.mul(this.taxInfo.incometax.hdsdl)
          }
        } else {
          // 个人核定
          if (this.taxInfo.incometax.srze) {
            income = income.plus(this.taxInfo.incometax.srze)
          }
          if (this.taxInfo.incometax.hdsdl) {
            income = income.mul(this.taxInfo.incometax.hdsdl)
          }
        }
      } else {
        if (this.settings.incomeTaxType !== 1) {
          // 企业查账
          if (this.taxInfo.incometax.lrze) {
            income = income.plus(this.taxInfo.incometax.lrze)
          }
          if (this.taxInfo.incometax.bzsmssr) {
            income = income.minus(this.taxInfo.incometax.bzsmssr)
          }
          if (this.taxInfo.incometax.gdzczj) {
            income = income.minus(this.taxInfo.incometax.gdzczj)
          }
          if (this.taxInfo.incometax.mbks) {
            income = income.minus(this.taxInfo.incometax.mbks)
          }
        } else {
          // 个人查账
          if (this.taxInfo.incometax.lrze) {
            income = income.plus(this.taxInfo.incometax.lrze)
          }
          if (this.taxInfo.incometax.mbks) {
            income = income.minus(this.taxInfo.incometax.mbks)
          }
          if (this.taxInfo.incometax.tzzjc) {
            income = income.minus(this.taxInfo.incometax.tzzjc)
          }
          if (this.taxInfo.incometax.zxkc) {
            income = income.minus(this.taxInfo.incometax.zxkc)
          }
        }
      }
      let rs = income.lte(0) ? '0.00' : income.toFixed(2)
      this.$set(this.taxInfo.incometax, 'ynsde', rs)
      return rs
    },
    // 应纳所得税额
    getIncomeTax: function () {
      let tax = new Big(0)
      if (this.settings.incomeTaxType === 0) {
        if (this.taxInfo.incometax.ynsde) {
          tax = tax.plus(this.taxInfo.incometax.ynsde)
        }
        if (this.taxInfo.incometax.rate) {
          tax = tax.mul(this.taxInfo.incometax.rate)
        }
      } else {
        if (this.taxInfo.incometax.ynsde) {
          tax = tax.plus(this.taxInfo.incometax.ynsde)
        }
        if (this.taxInfo.incometax.rate) {
          tax = tax.mul(this.taxInfo.incometax.rate)
        }
        if (this.taxInfo.incometax.sskcs) {
          tax = tax.minus(this.taxInfo.incometax.sskcs)
        }
      }
      let rs = tax.lte(0) ? '0.00' : tax.toFixed(2)
      this.$set(this.taxInfo.incometax, 'ynsdse', rs)
      return rs
    },
    getInvestorDeduction: function () {
      let year = Number(this.period.substring(0, 4))
      let deduction = new Big(0)
      if (this.settings.start_production_date) {
        let beginMon = 1
        let beginYear = this.settings.start_production_date.substring(0, 4)
        let curYear = this.period.substring(0, 4)
        if (beginYear === curYear) {
          // 开始生产经营日期在操作年，从开始经营月开始计算
          beginMon = Number(this.settings.start_production_date.substring(5, 7))
        } else if (beginYear > curYear) {
          // 开始生产经营日期在操作日期后
          beginMon = 13
        }
        let endMon = 0
        if (this.taxInfo.incometax.period) {
          endMon = Number(this.taxInfo.incometax.period.substring(5, 7))
        }

        for (let i = beginMon; i <= endMon; i++) {
          let perMonDeduction = this.getInvestorDeductionPerMon(year, i)
          deduction = deduction.plus(perMonDeduction)
        }
      }
      let rs = deduction.toFixed(2)
      this.$set(this.taxInfo.incometax, 'tzzjc', rs)
      return rs
    },
    getQuickCalculationDeduction: function () {
      let mny = new Big(this.taxInfo.incometax.ynsde ? this.taxInfo.incometax.ynsde : 0)
      let deduction = 0
      if (this.period < '2018-10') {
        if (mny.lte(15000)) {
          deduction = new Big(0)
        } else if (mny.lte(30000)) {
          deduction = new Big(750)
        } else if (mny.lte(60000)) {
          deduction = new Big(3750)
        } else if (mny.lte(100000)) {
          deduction = new Big(9750)
        } else {
          deduction = new Big(14750)
        }
      } else {
        if (mny.lte(30000)) {
          deduction = new Big(0)
        } else if (mny.lte(90000)) {
          deduction = new Big(1500)
        } else if (mny.lte(300000)) {
          deduction = new Big(10500)
        } else if (mny.lte(500000)) {
          deduction = new Big(40500)
        } else {
          deduction = new Big(65500)
        }
      }
      let rs = deduction.toFixed(2)
      this.taxInfo.incometax.sskcs = rs
      return rs
    },
    getIncomeTaxPreference: function () {
      if (!this.settings.incomeTaxPreferPolicy ||
          this.settings.incomeTaxPreferPolicy === '0') {
        let taxPreference = new Big(0)
        if (this.taxInfo.incometax.ynsde) {
          let taxableIncome = new Big(this.taxInfo.incometax.ynsde)
          if (this.period >= '2019-01') {
            // 2019新政策
            if (taxableIncome.lte(1000000)) {
              taxPreference = taxableIncome.mul(0.2)
            } else if (taxableIncome.lte(3000000)) {
              taxPreference = taxPreference.plus(50000)
              taxPreference = taxPreference.plus(taxableIncome.mul(0.15))
            }
          } else {
            if (this.taxInfo.incometax.ynsde <= 1000000) {
              taxPreference = taxableIncome.mul(0.15)
            }
          }
        }
        let rs = taxPreference.toFixed(2)
        this.$set(this.taxInfo.incometax, 'jmsds', rs)
        return rs
      } else {
        this.taxInfo.incometax.jmsds = '0.00'
      }
    },
    // 实际应补（退）所得税额
    getRealIncomeTax: function () {
      let tax = new Big(0)
      if (this.taxInfo.incometax.ynsdse) {
        tax = tax.plus(this.taxInfo.incometax.ynsdse)
      }
      if (this.taxInfo.incometax.jmsds) {
        tax = tax.minus(this.taxInfo.incometax.jmsds)
      }
      if (this.taxInfo.incometax.sjyjsds) {
        tax = tax.minus(this.taxInfo.incometax.sjyjsds)
      }
      let rs = tax.lte(0) ? '0.00' : tax.toFixed(2)
      this.$set(this.taxInfo.incometax, 'sjybtsds', rs)
      return rs
    }
  },
  created () {
    this.loadTaxData()
    this.loadTaxArchives()
  },
  mounted () {
    let scrollParent = this.$el.querySelector('.tax-view')
    let updateNav = this.$_.debounce(() => {
      this.adjustNavActive()
    }, 100)
    scrollParent.addEventListener('scroll', updateNav)
  },
  methods: {
    loadTaxData: function (refetch) {
      this.showLoading(refetch ? '取数中' : '')
      if (refetch) {
        this.surtax_base = 0
      }
      let api = refetch ? this.$api.TaxCalculator.reFetchData : this.$api.TaxCalculator.query
      api({
        period: this.queryPeriod
      }).then(res => {
        this.closeLoading()
        if (res.success) {
          if (refetch) {
            this.$message.success('取数成功')
          }
          let tax = res.rows
          if (tax) {
            if (!refetch) {
              this.initing = true
            }
            this.taxInfo = tax
            this.settings = tax.settings
            this.period = this.queryPeriod
            this.$nextTick(() => {
              this.initing = false
              this.adjustNavActive()
              if (refetch) {
                this.reCalSurtax()
              } else if (tax.shouldRefetch) {
                this.refetchPrompt()
              }
            })
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    loadTaxArchives () {
      let archiveReq = this.$api.TaxCalculator.getOtherTaxArchives()
      let templateReq = this.$api.TaxCalculator.querySurtaxTemplate()
      Promise.all([archiveReq, templateReq]).then(res => {
        this.otherTaxArchives = res[0].rows
        this.surtaxTemplates = res[1].rows
        for (let i = 0; i < this.otherTaxArchives.length; i++) {
          for (let j = 0; j < this.surtaxTemplates.length; j++) {
            if (this.otherTaxArchives[i].pk_archive === this.surtaxTemplates[j].pk_archive) {
              this.otherTaxArchives[i].rate = this.surtaxTemplates[j].rate
            }
          }
        }
      })
      this.$api.Voucher.getTaxItem().then(res => {
        if (res.success && res.rows) {
          this.processTaxItems(res.rows)
        }
      })
    },
    refetchPrompt: function (msg) {
      this.$confirm(msg || '凭证数据改变，是否重新取数?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadTaxData(true)
      })
    },
    prevPeriod () {
      this.queryPeriod = getPreviousPeriod(this.queryPeriod)
    },
    nextPeriod () {
      this.queryPeriod = getNextPeriod(this.queryPeriod)
    },
    processTaxItems: function (items) {
      if (this.isSmall) {
        let taxNames = new Object()
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          if (item.def1 !== 'Y') {
            if (this.isSmall) {
              let taxName = item.sname.replace(/^服务|货物/g, '')
              if (!taxNames[taxName]) {
                taxNames[taxName] = true
                item.sname = taxName
                this.allOutTaxItem.push(item)
              }
            } else {
              this.allOutTaxItem.push(item)
            }
          }
        }
      } else {
        let outArray = []
        for (let i = 0; i < items.length; i++) {
          if (items[i].def1 !== 'Y' && items[i].taxstyle === '1') {
            outArray.push(items[i])
          }
        }
        this.allOutTaxItem = outArray
      }
    },
    navTax: function (index, e) {
      this.activeNavIndex = index
      let scrollParent = this.$el.querySelector('.tax-view')
      let section = this.$el.querySelectorAll('.tax-section')[index]
      scrollParent.scrollTop = scrollParent.scrollTop + section.getBoundingClientRect().top -
        scrollParent.getBoundingClientRect().top
    },
    adjustNavActive: function () {
      let scrollParent = this.$el.querySelector('.tax-view')
      let parentTop = scrollParent.getBoundingClientRect().top
      let taxSections = this.$el.querySelectorAll('.tax-section')
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
    formatPeriodType: function (type) {
      if (type === 1) {
        return '季报'
      } else {
        return '月报'
      }
    },
    formatIncomeTaxType: function (type) {
      let taxType
      switch (type) {
        case 0:
          taxType = '核定征收'
          break
        case 1:
          taxType = '查账征收'
          break
        default:
          taxType = '查账征收'
          break
      }
      return taxType
    },
    formatVoucherOption: function (taxType) {
      let showText = '生成凭证'
      let isCarryover = false
      let voucherNum = null
      let taxStatus = this.getTaxStatus(taxType)
      if (taxStatus) {
        isCarryover = taxStatus.carryover
        voucherNum = taxStatus.voucherNumber
      }
      if (isCarryover) {
        showText = voucherNum ? '记' + voucherNum : '未生成结转凭证'
      }
      return showText
    },
    getTaxStatus: function (taxType) {
      let taxStatus = null
      switch (taxType) {
        case 1:
          taxStatus = this.taxInfo.addValueTaxStatus
          break
        case 2:
          taxStatus = this.taxInfo.surtaxStatus
          break
        case 3:
          taxStatus = this.taxInfo.incomeTaxStatus
          break
        default:
          break
      }
      return taxStatus
    },
    onOutTaxInput: function (value, tax, key) {
      this.$set(tax, key, value)
      if (key !== 'taxmny' && key !== 'taxmny_spec' && key !== 'taxmny_gen' && key !== 'taxmny_not') {
        let destKey = null
        let destValue = new Big(0)
        switch (key) {
          case 'mny_cargo':
          case 'mny_service':
            destKey = 'taxmny'
            if (tax.mny_cargo) {
              destValue = destValue.plus(new Big(tax.mny_cargo).mul(tax.rate).round(2))
            }
            if (tax.mny_service) {
              destValue = destValue.plus(new Big(tax.mny_service).mul(tax.rate).round(2))
            }
            break
          case 'mny_spec':
            destKey = 'taxmny_spec'
            if (tax[key]) {
              destValue = new Big(tax[key]).mul(tax.rate).round(2)
            }
            break
          case 'mny_gen':
            destKey = 'taxmny_gen'
            if (tax[key]) {
              destValue = new Big(tax[key]).mul(tax.rate).round(2)
            }
            break
          case 'mny_not':
            destKey = 'taxmny_not'
            if (tax[key]) {
              destValue = new Big(tax[key]).mul(tax.rate).round(2)
            }
            break
        }
        if (destKey) {
          this.$set(tax, destKey, destValue.toFixed(2))
        }
      }
      if (this.isSmall && tax.fp_style === 2) {
        let paidTax = this.calPaidTaxSmall()
        this.$set(this.taxInfo.addtax_info, 'yjse', paidTax)
      }
    },
    calPaidTaxSmall: function () {
      if (this.isSmall) {
        let sum = new Big(0)
        let taxArray = this.taxInfo.outtax
        for (let i = 0; i < taxArray.length; i++) {
          let tax = taxArray[i]
          if (tax.fp_style === 2 && tax['taxmny']) {
            sum = sum.plus(tax['taxmny'])
          }
        }
        return sum.toFixed(2)
      } else {
        return '0.00'
      }
    },
    calSum: function (array, field) {
      for (let i = 0; i < array.length; i++) {
        let tax = array[i]
        if (tax[field]) {
          sum = sum.plus(tax[field])
        }
      }
      return sum.toFixed(2)
    },
    calFreeTaxSum: function (field) {
      if (this.isSmall) {
        let sum = new Big(0)
        let taxArray = this.taxInfo.outtax
        for (let i = 0; i < taxArray.length; i++) {
          let tax = taxArray[i]
          if ((tax.fp_style === undefined || tax.fp_style === 1 || tax.fp_style === 3) && tax[field]) {
            sum = sum.plus(tax[field])
          }
        }
        return sum.toFixed(2)
      } else {
        return '0.00'
      }
    },

    onAddTaxDialogOpen: function () {
      let addArray = []
      for (let i = 0; i < this.allOutTaxItem.length; i++) {
        let isContains = false
        for (let j = 0; j < this.taxInfo.outtax.length; j++) {
          if (this.allOutTaxItem[i].sname === this.taxInfo.outtax[j].tax_name) {
            isContains = true
            break
          }
        }
        if (!isContains) {
          addArray.push(this.allOutTaxItem[i])
        }
      }
      this.toAddTaxData = addArray
    },
    calOutTaxSum: function (field) {
      let sum = new Big(0)
      let taxArray = this.taxInfo.outtax
      for (let i = 0; i < taxArray.length; i++) {
        let tax = taxArray[i]
        if (tax[field]) {
          sum = sum.plus(tax[field])
        }
      }
      this.$set(this.outtaxSum, field, sum)
      // this.outtaxSum[field] = sum;
      return sum.toFixed(2)
    },
    calInTaxSum: function (field) {
      let sum = new Big(0)
      let taxArray = this.taxInfo.intax
      if (taxArray) {
        for (let i = 0; i < taxArray.length && i < 2; i++) {
          let tax = taxArray[i]
          if (tax[field]) {
            sum = sum.plus(tax[field])
          }
        }
      }
      this.$set(this.intaxSum, field, sum)
      return sum.toFixed(field === 'num_count' ? 0 : 2)
    },
    addOutTax: function () {
      // 增加税目
      if (this.taxItemSelection.length === 0) {
        this.$message.warning('请选择要添加的数据')
      } else {
        for (let i = 0; i < this.taxItemSelection.length; i++) {
          this.taxInfo.outtax.push({
            pk_taxitem: this.taxItemSelection[i].itemid,
            fp_style: this.taxItemSelection[i].fp_style,
            rate: this.taxItemSelection[i].shuilv,
            tax_name: this.taxItemSelection[i].sname,
            tax_type: 1,
            snumber: this.taxItemSelection[i].iorder
          })
        }
        this.addOutTaxDialogVisible = false
      }
    },
    getSujectData: function () {
      return top.SUB_SUBJECT_DATA
    },
    formatRate: function (row) {
      return this.formatRateVal(row.shuilv)
    },
    formatRateVal: function (val) {
      return new Big(val).mul(100).toString() + '%'
    },
    onAddTaxTableRowClick: function (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    showOutTaxDialog: function () {
      if (this.taxInfo.addValueTaxStatus.carryover) {
        this.$message.warning('已结转，不能操作')
        return
      }
      this.addOutTaxDialogVisible = true
    },
    handleTaxItemSelectionChange: function (val) {
      // 选择税目
      this.taxItemSelection = val
    },
    delOutTax: function (index) {
      if (this.taxInfo.addValueTaxStatus.carryover) {
        this.$message.warning('已结转，不能删除')
        return
      }
      // 删除税目
      if (this.taxInfo.outtax.length === 1) {
        this.$message.warning('至少保留一行数据')
        return
      }
      this.taxInfo.outtax.splice(index, 1)
    },
    handleSurtaxSelectionChange: function (val) {
      // 选择税目
      this.surtaxSelection = val
    },
    handleAddTaxFieldChange: function (val) {
      // 选择税目
      this.addTaxFieldSelection = val
    },
    onAddTaxFieldTableRowClick: function (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    onAddTaxFieldSetting: function () {
      this.addTaxFieldSelection = []
    },
    getAddTaxFieldSettingData: function () {
      let data = []
      for (let i = 0; i < this.addTaxHiddenField.length; i++) {
        if (this.addTaxHiddenFieldShow[this.addTaxHiddenField[i].value] ||
            this.taxInfo.addtax_info[this.addTaxHiddenField[i].value]) {
          continue
        }
        data.push(this.addTaxHiddenField[i])
      }
      return data
    },
    delAddTaxField: function (key) {
      if (this.taxInfo.addtax_info[key] && Number(this.taxInfo.addtax_info[key]) !== 0) {
        this.$message.warning('金额不为0，不允许删除')
      } else {
        this.addTaxHiddenFieldShow[key] = false
      }
    },
    applyAddTaxFieldSetting: function () {
      for (let i = 0; i < this.addTaxFieldSelection.length; i++) {
        this.addTaxHiddenFieldShow[this.addTaxFieldSelection[i].value] = true
      }
      this.addTaxFieldSettingVisible = false
    },
    getSurtaxData: function () {
      let data = []
      for (let i = 0; i < this.taxInfo.surtax.length; i++) {
        if (this.taxInfo.surtax[i].is_surtax) {
          data.push(this.taxInfo.surtax[i])
        }
      }
      return data
    },
    getSurtaxAddData: function () {
      let addArray = []
      for (let i = 0; i < this.otherTaxArchives.length; i++) {
        if (this.otherTaxArchives[i].is_surtax && this.taxInfo.surtaxStatus.carryover) {
          continue
        }
        let isContains = false
        for (let j = 0; j < this.taxInfo.surtax.length; j++) {
          if (this.otherTaxArchives[i].tax_name === this.taxInfo.surtax[j].tax_name) {
            isContains = true
            break
          }
        }
        if (!isContains) {
          addArray.push(this.otherTaxArchives[i])
        }
      }
      return addArray
    },
    addSurtax: function () {
      if (this.surtaxSelection.length === 0) {
        this.$message.warning('请选择要添加的数据')
      } else {
        for (let i = 0; i < this.surtaxSelection.length; i++) {
          let surtaxInfo = {
            rate: this.surtaxSelection[i].rate,
            tax_name: this.surtaxSelection[i].tax_name,
            snumber: this.surtaxSelection[i].show_order,
            is_surtax: this.surtaxSelection[i].is_surtax,
            period: this.period,
            pk_corp: this.pk_corp,
            pk_archive: this.surtaxSelection[i].pk_archive
          }
          if (surtaxInfo.is_surtax) {
            surtaxInfo.base_tax = this.surtax_base
          }
          this.taxInfo.surtax.push(surtaxInfo)
          this.onSurtaxInput(surtaxInfo)
        }
        this.addOtherTaxDialogVisible = false
      }
    },
    delSurtax: function (tax, index) {
      if (tax.is_surtax && this.taxInfo.surtaxStatus.carryover) {
        this.$message.warning('已结转，不能删除')
        return
      } else if (tax.voucher_num) {
        this.$message.warning('已生成凭证，不能删除')
        return
      }
      if (tax.tax_name === '城建税' ||
          tax.tax_name === '教育费附加' ||
          tax.tax_name === '地方教育费附加') {
        this.$message.warning('不允许删除')
        return
      }
      this.taxInfo.surtax.splice(index, 1)
    },
    onSetSurtax: function (tax) {
      let formData = {}
      let hasSavedData = false
      for (let i = 0; i < this.surtaxTemplates.length; i++) {
        let temp = this.surtaxTemplates[i]
        if (temp.pk_archive === tax.pk_archive) {
          hasSavedData = true
          for (let key in temp) {
            formData[key] = temp[key]
          }
          break
        }
      }
      if (!hasSavedData) {
        formData.summary = tax.tax_name
        formData.rate = tax.rate
        formData.period_type = 0
      }
      if (tax.is_surtax) {
        formData.period_type = this.settings.addTaxPeriodType
      }
      formData.is_surtax = tax.is_surtax
      formData.tax_name = tax.tax_name
      formData.pk_archive = tax.pk_archive
      this.surtaxTempForm = formData
      this.surtaxSettingDialogVisible = true
    },
    saveSurtaxTemp: function () {
      if (this.surtaxTempForm.period_type === '' ||
          this.surtaxTempForm.period_type === undefined) {
        this.$message.warning('申报周期不能为空')
        return
      }
      this.$api.TaxCalculator.saveSurtaxTemplate(this.surtaxTempForm).then(res => {
        if (res.success) {
          this.surtaxSettingDialogVisible = false
          for (let i = 0; i < this.surtaxOrdered.length; i++) {
            if (this.surtaxOrdered[i].pk_archive === this.surtaxTempForm.pk_archive) {
              if (this.surtaxTempForm.rate) {
                this.onSurtaxInput(this.surtaxOrdered[i], 'rate',
                  this.surtaxTempForm.rate)
              }
              break
            }
          }
          let hasSavedData = false
          for (let i = 0; i < this.surtaxTemplates.length; i++) {
            if (this.surtaxTemplates[i].pk_archive === this.surtaxTempForm.pk_archive) {
              hasSavedData = true
              for (let key in this.surtaxTempForm) {
                this.surtaxTemplates[i][key] = this.surtaxTempForm[key]
              }
              break
            }
          }
          if (!hasSavedData) {
            this.surtaxTemplates.push(res.rows)
          }
          if (this.toSetTempTax.length > 0) {
            this.toSetTempTax.splice(0, 1)
            if (this.toSetTempTax.length > 0) {
              this.onSetSurtax(this.toSetTempTax[0])
            }
          }
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    reCalSurtax: function () {
      for (let i = 0; i < this.taxInfo.surtax.length; i++) {
        this.onSurtaxInput(this.taxInfo.surtax[i])
      }
    },
    showSurtaxTd: function (tax, index) {
      let isShow = true
      if (tax.is_surtax && this.notSurtaxQuarterEnd ||
          !tax.is_surtax && tax.period_type === 1 && this.period !== this.quarterEnd) {
        isShow = false
      }
      return isShow
    },
    onSurtaxInput: function (tax, field, value) {
      if (field) {
        this.$set(tax, field, value)
      }
      let ynse = this.calSurtaxPayable(tax)
      this.$set(tax, 'ynse', ynse.toFixed(2))
      let payable = new Big(tax.ynse)
      if (field !== 'jmse' && field !== 'xgmjze' && field !== 'yjse') {
        let jmse = this.calSurtaxDeduction(tax)
        this.$set(tax, 'jmse', jmse.toFixed(2))
      }
      if (tax.jmse) {
        payable = payable.minus(tax.jmse)
      }
      if (tax.yjse) {
        payable = payable.minus(tax.yjse)
      }
      if (this.isSmall) {
        if (field !== 'xgmjze' && field !== 'yjse') {
          let xgmjze = this.calSurtaxDeductionSmall(tax)
          this.$set(tax, 'xgmjze', xgmjze.toFixed(2))
        }
        if (tax.jmse) {
          payable = payable.minus(tax.xgmjze)
        }
      }
      this.$set(tax, 'ybtse', payable.lte(0) ? '0.00' : payable.toFixed(2))
    },
    // 其他税费-应纳税额
    calSurtaxPayable: function (tax) {
      let ynse = new Big(tax.base_tax ? tax.base_tax : 0)
      if (tax.rate) {
        ynse = ynse.mul(tax.rate)
      } else {
        ynse = new Big(0)
      }
      return ynse
    },
    // 其他税费-应补（退）税额
    calSurtaxRealPayable: function (tax) {
      let ynse = new Big(tax.ynse)
      if (tax.jmse) {
        ynse = ynse.minus(tax.jmse)
      }
      if (tax.yjse) {
        ynse = ynse.minus(tax.yjse)
      }
      if (this.isSmall && tax.xgmjze) {
        ynse = ynse.minus(tax.xgmjze)
      }
      let rs = ynse.toFixed(2)
      tax.ybtse = rs
      return rs
    },
    // 其他税费-减免税额
    calSurtaxDeduction: function (tax) {
      if (this.initing && tax.pk_tax) {
        return new Big(tax.jmse ? tax.jmse : 0)
      }
      let jmse
      let qualifyForFreeEdu = (tax.tax_name === '教育费附加' || tax.tax_name === '地方教育费附加' ||
          tax.tax_name === '地方水利建设基金') &&
          ((this.settings.addTaxPeriodType === 1 && this.taxInfo.incomeMny <= 300000) ||
            (this.settings.addTaxPeriodType !== 1 && this.taxInfo.incomeMny <= 100000))
      if (qualifyForFreeEdu) {
        jmse = new Big(tax.ynse)
        tax.qualifyForFreeEdu = true
      } else {
        jmse = new Big(0)
      }
      return jmse
    },
    calSurtaxDeductionSmall: function (tax) {
      let val
      if (!tax.qualifyForFreeEdu && (tax.tax_name === '城建税' ||
          tax.tax_name === '教育费附加' ||
          tax.tax_name === '地方教育费附加' ||
          tax.tax_name === '印花税') &&
          this.isSmall && this.period >= '2019-01') {
        // 减半征收
        val = new Big(tax.ynse).minus(tax.jmse)
        if (val.lte(0)) {
          val = new Big(0)
        } else {
          val = val.mul(0.5)
        }
      } else {
        val = new Big(0)
      }
      return val
    },
    getInvestorDeductionPerMon: function (year, mon) {
      return (year < 2018 || (year === 2018 && mon < 10)) ? 3500 : 5000
    },
    getIndividualIncomeRate: function () {
      let mny = new Big(this.taxInfo.incometax.ynsde ? this.taxInfo.incometax.ynsde : 0)
      let rate = 0
      if (this.period < '2018-10') {
        if (mny.lte(15000)) {
          rate = new Big(0.05)
        } else if (mny.lte(30000)) {
          rate = new Big(0.1)
        } else if (mny.lte(60000)) {
          rate = new Big(0.2)
        } else if (mny.lte(100000)) {
          rate = new Big(0.3)
        } else {
          rate = new Big(0.35)
        }
      } else {
        if (mny.lte(30000)) {
          rate = new Big(0.05)
        } else if (mny.lte(90000)) {
          rate = new Big(0.1)
        } else if (mny.lte(300000)) {
          rate = new Big(0.2)
        } else if (mny.lte(500000)) {
          rate = new Big(0.3)
        } else {
          rate = new Big(0.35)
        }
      }
      let rs = rate.toFixed(2)
      this.taxInfo.incometax.rate = rs
      return rs
    },
    saveMakeLoss: function () {
      this.showLoading('保存中')
      this.$api.qmcl.updateqmLoss({
        begindate: this.period + '-01',
        lossvalue: this.makeLoss,
        pk_corp: this.pk_corp
      }).then(res => {
        this.closeLoading()
        if (res.success) {
          this.mbDialogVisible = false
          if (!this.taxInfo.incomeTaxStatus.carryover) {
            this.taxInfo.incometax.mbks = this.makeLoss
          }
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    saveTaxDatas: function () {
      this.showLoading('保存中')
      this.$api.TaxCalculator.save(this.taxInfo).then(res => {
        this.closeLoading()
        if (res.success) {
          this.taxInfo = res.rows
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.closeLoading()
      })
    },
    checkHasTemplate: function (taxes) {
      let noTempTax = []
      let hasTemplate = false
      for (let i = 0; i < taxes.length; i++) {
        let tax = taxes[i]
        for (let j = 0; j < this.surtaxTemplates.length; j++) {
          if (this.surtaxTemplates[j].pk_archive === tax.pk_archive) {
            hasTemplate = true
            break
          }
        }
        if (!hasTemplate) {
          noTempTax.push(tax)
        }
      }
      return noTempTax
    },
    exportExcel: function () {
      let exportData = this.getExportData()
      if (exportData === null) {
        this.$message.warning('没有可导出数据')
        return
      }
      this.$api.TaxCalculator.exportExcel({
        exportData: JSON.stringify(exportData)
      })
    },
    getExportData: function () {
      let exportData = {
        corpName: this.corpName,
        period: this.period,
        addTax: this.getAddTaxExportData(),
        surtax: this.getSurtaxExportData(),
        incomeTax: this.getIncomeTaxExportData()
      }
      if (exportData.addTax === null && exportData.surtax === null &&
          exportData.incomeTax === null) {
        exportData = null
      }
      return exportData
    },
    getTableRows: function (body) {
      let rows = []
      let bodyTrs = body.children
      for (let i = 0; i < bodyTrs.length; i++) {
        let rowTds = bodyTrs[i].cells
        let cells = []
        for (let j = 0; j < rowTds.length; j++) {
          let col = rowTds[j]
          let value = col.innerText
          if (value === '') {
            let input = col.querySelector('input')
            if (input !== null) {
              value = input.value
            }
          }
          let align = 1
          if (col.classList.contains('text-right')) {
            align = 3
          } else if (col.classList.contains('text-center')) {
            align = 2
          }
          cells.push({
            rowSpan: col.rowSpan,
            colSpan: col.colSpan,
            value: value,
            align: align
          })
        }
        rows.push({
          cells: cells
        })
      }
      return rows
    },
    getAddTaxExportData: function () {
      let tableData = null
      let tableElement = document.getElementById('taxItemTable')
      if (tableElement !== null) {
        tableData = {
          title: document.querySelector('.tax-section:nth-child(1) .title').innerText
        }
        tableData.head = this.getTableRows(tableElement.tHead)
        tableData.body = this.getTableRows(tableElement.tBodies[0])
        tableElement = document.getElementById('addTaxTable')
        let addTaxBody = this.getTableRows(tableElement.tBodies[0])
        let colSpan = tableData.body[0].cells.length - 2
        for (let i = 0; i < addTaxBody.length; i++) {
          let cells = addTaxBody[i].cells
          cells[cells.length - 1].colSpan = colSpan
        }
        tableData.body = tableData.body.concat(addTaxBody)
      }
      return tableData
    },
    getSurtaxExportData: function () {
      let tableData = null
      let tableElement = document.getElementById('additionalTaxTable')
      if (tableElement !== null) {
        tableData = {
          title: document.querySelector('.tax-section:nth-child(2) .title').innerText
        }
        tableData.head = this.getTableRows(tableElement.tHead)
        let body = []
        let surtaxBody = this.getTableRows(tableElement.tBodies[0])
        for (let i = 0; i < surtaxBody.length; i++) {
          if (surtaxBody[i].cells.length > 2) {
            body.push(surtaxBody[i])
          }
        }
        if (body.length === 0) {
          tableData = null
        } else {
          tableData.body = body
        }
      }
      return tableData
    },
    getIncomeTaxExportData: function () {
      let tableData = null
      let tableElement = document.getElementById('incomeTaxTable')
      if (tableElement !== null) {
        tableData = {
          title: document.querySelector('.tax-section:nth-child(3) .title').innerText
        }
        tableData.head = this.getTableRows(tableElement.tHead)
        tableData.body = this.getTableRows(tableElement.tBodies[0])
      }
      return tableData
    }
  }
}
</script>

<style scoped>
  .nav-tabs {
    height: 30px;
    border-bottom: 1px solid #ddd;
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

  .tax-view {
    height: calc(100% - 30px);
    overflow: auto;
  }

  .table {
    width: 100%;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }

  .table > caption + thead > tr:first-child > td, .table > caption + thead > tr:first-child > th,
  .table > colgroup + thead > tr:first-child > td, .table > colgroup + thead > tr:first-child > th,
  .table > thead:first-child > tr:first-child > td, .table > thead:first-child > tr:first-child > th {
    border-top: 0;
  }

  .table-bordered, .table-bordered > tbody > tr > td, .table-bordered > tbody > tr > th,
  .table-bordered > tfoot > tr > td, .table-bordered > tfoot > tr > th,
  .table-bordered > thead > tr > td, .table-bordered > thead > tr > th {
    border: 1px solid #ddd;
  }

  .text-right {
    text-align: right;
  }

  .text-center {
    text-align: center;
  }

  .row-operate {
    top: 4px;
    left: -15px;
  }

  .table .surtax-name-td {
    position: relative;
    padding-left: 15px;
  }

  .surtax-name-td .row-operate {
    left: 0px;
  }

  .empty_data {
    color: #888;
    text-align: center;
    height: 200px;
    border: 1px solid #ddd;
    line-height: 200px;
    font-size: 16px;
  }

  .table > tbody > tr > td {
    height: 45px;
    /*line-height: 45px;*/
    padding: 0 5px;
  }

  .table > tbody > tr > td.td-input {
    padding: 0;
  }

  .td-input input {
    padding: 0 5px;
  }

  .text-right input {
    text-align: right;
  }

  td input {
    border: none;
    width: 100%;
    height: 100%;
    box-sizing: border-box; /* works fine with IE8+ */
    -moz-box-sizing: border-box; /* works fine Firefox */
    -webkit-box-sizing: border-box; /* height is not correct in Chrome */
  }

  td input[readonly] {
    outline: none;
  }

  td >>>.el-input__inner {
    text-align: right;
  }

  td >>> .number_input {
    text-align: right;
  }

  .head_tax_info {
    font-size: 14px;
    margin-right: 5px;
    float: right;
  }

  .tax-section {
    margin-top: 10px;
  }

  .tax-header {
    height: 34px;
    line-height: 34px;
    border-bottom: 2px solid #2c9dd8;
  }

  .tax-section .title {
    display: inline-block;
    height: 34px;
    line-height: 34px;
    color: #fff;
    font-size: 15px;
  }

  .tax-section .title-name {
    float: left;
    padding-left: 3px;
    display: inline-block;
  }

  .triangle-right {
    display: inline-block;
    width: 0px;
    height: 0px;
    line-height: 0px;
    border-left: 32px solid;
    border-right: 0px solid transparent;
    border-top: 32px solid transparent;
  }

  .skin_base_color {
    background-color: #2c9dd8;
  }

  .skin_base_color_border_left {
    border-left-color: #2c9dd8;
  }

  .tax_setting {
    margin-left: 10px;
    cursor: pointer;
    visibility: hidden;
  }

  td:hover .tax_setting {
    visibility: visible;
  }
  .period-nav {
    padding: 9px 5px;
  }

  .col-md-12 {
    width: 100%
  }

  .col-md-11 {
    width: 91.66666667%
  }

  .col-md-10 {
    width: 83.33333333%
  }

  .col-md-9 {
    width: 75%
  }

  .col-md-8 {
    width: 66.66666667%
  }

  .col-md-7 {
    width: 58.33333333%
  }

  .col-md-6 {
    width: 50%
  }

  .col-md-5 {
    width: 41.66666667%
  }

  .col-md-4 {
    width: 33.33333333%
  }

  .col-md-3 {
    width: 25%
  }

  .col-md-2 {
    width: 16.66666667%
  }

  .col-md-1 {
    width: 8.33333333%
  }
</style>
