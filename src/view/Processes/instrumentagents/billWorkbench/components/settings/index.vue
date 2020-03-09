<template>
  <div class="sttings-main">
    <el-container style=" border: 1px solid #eee">
      <el-aside width="201px" style="border-right: solid 1px #e6e6e6">
        <el-menu @select="menuSelect" :default-openeds="['1', '2']" style="border-right: solid 0px #e6e6e6;">
          <el-submenu index="1">
            <template slot="title"><label><i class="el-icon-setting"></i>票据设置</label></template>
            <el-menu-item index="1-1" >按往来单位分类</el-menu-item>
            <el-menu-item index="1-2">银行票据按账户分类</el-menu-item>
            <el-menu-item index="1-3">黑名单</el-menu-item>
            <el-menu-item index="1-4">进项票据标为已认证</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><label><i class="el-icon-setting"></i>凭证设置</label></template>
            <el-menu-item index="2-5">农产品收购发票抵扣税率</el-menu-item>
            <el-menu-item index="2-6">凭证日期</el-menu-item>
<!--            <el-menu-item index="2-6">凭证合并分录</el-menu-item>-->
            <el-menu-item index="2-7">分录合并规则</el-menu-item>
            <el-menu-item index="2-8">凭证摘要</el-menu-item>
            <el-menu-item index="2-9" style="line-height: 20px;">智能做账包含问题票据<br>及未识别票据</el-menu-item>
            <el-menu-item index="2-10">票据合并数量</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container id="sttingsContainer" style="display: block; padding: 20px; overflow: auto;">
        <h4>1. 按往来单位分类
          <!--<el-switch style="float: right; margin-right: 5px" @change="saveParaSet('srfl', srfl)" v-model="srfl"></el-switch>-->
        </h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="text-content">
              <el-row class="set-item">
<!--               <label style="font-weight: 700;">1.1 按往来单位分类及合并凭证</label>-->
              </el-row>
              <el-row class="set-item">
                <div style="'text-indent: 0px">
                  <i class="set-item-style"></i>
                  <label style="font-weight: 700;">收入</label>
                  <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('srfl', srfl)"
                             v-model="srfl"></el-switch>
                </div>
                <div style="'text-indent: 0px">收入分类下票据将按不同往来单位分配到以对方单位名称命名的四级分类下，并在智能做账时按往来单位合并生成凭证。</div>
              </el-row>
              <el-row class="set-item">
                <div style="'text-indent: 0px">
                  <i class="set-item-style"></i>
                  <label style="font-weight: 700">库存采购</label>
                  <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('cgfz', cgfz)"
                             v-model="cgfz"></el-switch>
                </div>
                <div style="'text-indent: 0px">库存采购分类下票据将按不同往来单位分配到以对方单位名称命名的三级分类下，并在智能做账时按往来单位合并生成凭证。</div>
              </el-row>
              <el-row class="set-item">
                <div style="'text-indent: 0px">
                  <i class="set-item-style"></i>
                  <label style="font-weight: 700">成本</label>
                  <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('cbfz', cbfz)"
                             v-model="cbfz"></el-switch>
                </div>
                <div style="'text-indent: 0px">成本分类下票据将按不同往来单位分配到以对方单位名称命名的四级分类下，并在智能做账时按往来单位合并生成凭证。</div>
              </el-row>
              <el-row class="set-item">
<!--                <label style="font-weight: 700">1.2 按往来单位合并凭证</label>-->
              </el-row>
              <el-row class="set-item">
                <div style="'text-indent: 0px">
                  <i class="set-item-style"></i>
                  <label  style="font-weight: 700">银行票据(转入及转出)</label>
                  <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('yhhb', yhhb)"
                             v-model="yhhb"></el-switch>
                </div>
                <div style="'text-indent: 0px">银行票据(转入及转出)分类下票据将按不同往来单位分配到以对方单位命名的四级 分类下，并在智能做账时按往来单位合并生成凭证。
<!--                  <div style="'text-indent: 0px">-->
<!--                    此选项若与“票据合并数量“同时开启，转入、转出仅按往来单位合并生成凭证，票据 合并数量不生效。-->
<!--                  </div>-->
<!--                  <div style="'text-indent: 0px">-->
<!--                    此选项无需整理分类，开启后即生效。-->
<!--                  </div>-->
                </div>
                智能做账生成凭证时，勾选分类下票据将按照往来单位合并生成凭证。<br>已上传票据需【整理分类】后才能生效。
              </el-row>
            </div>
          </el-col>
        </el-row>
        <!--<el-row :gutter="24">-->
        <!--<el-col :span="24">-->
        <!--<p class="text-content">-->
        <!--开启后，收入、库存采购分类下票据将会按不同往来单位分配到以采购方名称命名的三级分类下。<br>-->
        <!--关闭后，收入、库存采购分类下票据不会按不同往来单位分配到以采购方名称命名的三级目录，而是直接进入原三级分类。<br>-->
        <!--已上传的票据重新整理后才能生效-->
        <!--</p>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <h4>2. 银行票据按账户分类
          <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('isyh', isyh)"
                     v-model="isyh"></el-switch>
        </h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <p class="text-content">
              开启后，票据分类下的银行票据（社保、手续费等）将会按照不同对的本公司银行账号分配到不同的以银行账号命名的二级分类下。<br>
              关闭后，票据分类下的银行票据不会按本公司银行账号分类到二级分类下，而是直接进入原二级分类中。
            </p>
          </el-col>
        </el-row>
        <h4>3. 黑名单</h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <p class="text-content">
              <el-input @blur="blackInputBlur($event)" :key="key" v-for="(b, key) in blacklist" v-model="b.name"
                        class="rules-keyword-arr" size="mini" style="width: 130px; margin: 5px 3px;">
                <i class="el-icon-close el-input__icon" slot="suffix" style="cursor: pointer"
                   @click="delBlacklist(key)"></i>
              </el-input>
              <el-button @click="addBlacklist" round type="text" class="el-icon-circle-plus-outline"
                         style="padding: 7px 7px; font-size: 14px;" size="mini">添加黑名单
              </el-button>
            </p>
          </el-col>
        </el-row>
        <h4>4. 进项票据标为已认证
          <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('isrz', isrz)"
                     v-model="isrz"></el-switch>
        </h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <p class="text-content">
              开启后，进入系统的进项增值税发票会自动标记成已认证状态。<br>
              关闭后，进入系统的进项增值税发票将不会被自动标记为已认证状态。
            </p>
          </el-col>
        </el-row>

        <h4>5. 农产品免税处理
          <el-select
            @change="saveParaSet('ncpsl', ncpsl)"
            v-model="ncpsl"
            style="float: right; margin-right: 5px; width: 150px"
            size="mini">
            <el-option label="0%" value="0"></el-option>
            <el-option label="9%" value="9"></el-option>
            <el-option label="10%" value="10"></el-option>
          </el-select>
        </h4>
        <h4>6. 凭证日期
          <el-select
            @change="saveParaSet('pzrq', pzrq)"
            v-model="pzrq"
            style="float: right; margin-right: 5px; width: 150px"
            size="mini">
            <el-option label="票据实际日期" :value="0"></el-option>
            <el-option label="当前账期最后一天" :value="1"></el-option>
          </el-select>
        </h4>
        <el-row style="display: none" :gutter="24">
          <el-col :span="24">
            <p class="text-content">
            </p>
          </el-col>
        </el-row>

<!--        <h4>6. 凭证合并分录-->
<!--          <el-switch style="float: right; margin-right: 5px" @change="saveParaSet('ishbfl', ishbfl)"-->
<!--                     v-model="ishbfl"></el-switch>-->
<!--        </h4>-->
<!--        <el-row :gutter="24">-->
<!--          <el-col :span="24">-->
<!--            <p class="text-content">-->
<!--              开启后，智能做账同一张凭证中摘要、科目及辅助核算完全一致的分录将合并；<br>-->
<!--              关闭后，智能做账同一张凭证中摘要、科目及辅助核算完全一致的分录不合并；-->
<!--            </p>-->
<!--          </el-col>-->
<!--        </el-row>-->

        <h4>7. 分录合并规则</h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="text-content">

              <div style="margin-left: 0px">
                <div style="display: inline-block">
                  <el-radio @change="saveMergeSetting(mergeSetting)" v-model="mergeSetting.entry_type" :label="1">
                    同方向分录合并
                  </el-radio>
                  <el-radio @change="saveMergeSetting(mergeSetting)" v-model="mergeSetting.entry_type" :label="2">
                    同方向、不同方向分录合并
                  </el-radio>
                  <el-checkbox @change="saveMergeSetting(mergeSetting)" style="margin-left: 30px"
                               v-model="mergeSetting.not_merge_bank">银行科目不合并
                  </el-checkbox>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <h4>8. 凭证摘要</h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <p class="text-content">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="进项发票" name="tab1">
                  <el-checkbox @change="saveIncomeInvoice(incomeInvoice, '/zncs/gl_vatincinvact/combineRule')"
                               v-model="incomeInvoice.selectQjZy" label="开票日期"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(incomeInvoice, '/zncs/gl_vatincinvact/combineRule')"
                               v-model="incomeInvoice.selectWlZy" label="对方单位"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(incomeInvoice, '/zncs/gl_vatincinvact/combineRule')"
                               v-model="incomeInvoice.selectLxZy" label="业务类型"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(incomeInvoice, '/zncs/gl_vatincinvact/combineRule')"
                               v-model="incomeInvoice.selectXmZy" label="开票项目"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(incomeInvoice, '/zncs/gl_vatincinvact/combineRule')"
                               v-model="incomeInvoice.selectHmZy" label="发票号码"></el-checkbox>
                </el-tab-pane>
                <el-tab-pane label="销项发票" name="tab2">
                  <el-checkbox @change="saveIncomeInvoice(outputInvoice, '/zncs/gl_vatsalinvact/combineRule')"
                               v-model="outputInvoice.selectQjZy" label="开票日期"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(outputInvoice, '/zncs/gl_vatsalinvact/combineRule')"
                               v-model="outputInvoice.selectWlZy" label="对方单位"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(outputInvoice, '/zncs/gl_vatsalinvact/combineRule')"
                               v-model="outputInvoice.selectLxZy" label="业务类型"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(outputInvoice, '/zncs/gl_vatsalinvact/combineRule')"
                               v-model="outputInvoice.selectXmZy" label="开票项目"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(outputInvoice, '/zncs/gl_vatsalinvact/combineRule')"
                               v-model="outputInvoice.selectHmZy" label="发票号码"></el-checkbox>
                </el-tab-pane>
                <el-tab-pane label="银行票据" name="tab3">
                  <el-checkbox @change="saveIncomeInvoice(bankInvoice, '/zncs/gl_yhdzdact/combineRule')"
                               v-model="bankInvoice.selectQjZy" label="开票日期"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(bankInvoice, '/zncs/gl_yhdzdact/combineRule')"
                               v-model="bankInvoice.selectWlZy" label="对方单位"></el-checkbox>
                  <el-checkbox @change="saveIncomeInvoice(bankInvoice, '/zncs/gl_yhdzdact/combineRule')"
                               v-model="bankInvoice.selectLxZy" label="业务类型"></el-checkbox>
                </el-tab-pane>
              </el-tabs>
            </p>
          </el-col>
        </el-row>
        <h4>9. 智能做账包含问题票据及未识别票据
          <el-switch @change="saveParaSet('iscwvhr', iscwvhr)" v-model="iscwvhr"
                     style="float: right; margin-right: 5px"></el-switch>
        </h4>
        <h4>10. 票据合并数量</h4>
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="text-content">
              <div style="margin-left: 0px">
                <div style="display: inline-block">
                  <label>合并票据数量： </label>
                  <el-select v-model="pjhbsl" @change="saveParaSet('pjhbsl', pjhbsl)" size="small" style="width: 80px">
                    <el-option :key="idx" :value="idx" :label="idx" v-for="idx in [2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20]"></el-option>
                  </el-select>
                  <label style="margin-left: 30px">合并范围：</label>
                  <el-checkbox @change="saveParaSet('ishbsr', ishbsr)" v-model="ishbsr" label="收入"></el-checkbox>
                  <el-checkbox @change="saveParaSet('ishbkc', ishbkc)" v-model="ishbkc" label="库存采购"></el-checkbox>
                  <el-checkbox @change="saveParaSet('ishbyh', ishbyh)" v-model="ishbyh" label="银行票据"></el-checkbox>
                </div>
              </div>
              <p style="margin-top: 10px">
                若设置，点击【智能做账】勾选范围内票据将自动按设置数量分批合并，上级分类设置为合并时该设置不生效;<br>
                若未设置，点击【智能做账】按其他合并相关设置生成凭证;
              </p>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
          </el-col>
        </el-row>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {postAxios, getAxios} from '@/libs/axios'
import axios from 'axios'

export default {
  name: 'settings',
  props: {},
  data () {
    return {
      dateValue: '票据实际日期',
      switchModel: false,
      radio: '1',
      activeTab: 'tab1',
      name: 'settings',
      srfl: false,
      isyh: false,
      isrz: false,
      ishbfl: false,
      ishbsr: false,
      ishbkc: false,
      ishbyh: false,
      pjhbsl: 1,
      cgfz: false,
      cbfz: false,
      yhhb: false,
      pzrq: '',
      ncpsl: '',
      blacklist: [],
      iscwvhr: false,
      incomeInvoice: {
        selectQjZy: false,
        selectWlZy: false,
        selectLxZy: false,
        selectXmZy: false,
        selectHmZy: false
      },
      outputInvoice: {
        selectQjZy: false,
        selectWlZy: false,
        selectLxZy: false,
        selectXmZy: false,
        selectHmZy: false
      },
      bankInvoice: {
        selectQjZy: false,
        selectWlZy: false,
        selectLxZy: false
      },
      mergeSetting: {
        entry_type: 1,
        not_merge_bank: false,
        group_type: 1,
        abstract_type: 1
      }
    }
  },
  methods: {
    saveMergeSetting (param) {
      let paramMerge = JSON.parse(JSON.stringify(param))
      if (paramMerge.not_merge_bank) {
        paramMerge.not_merge_bank = paramMerge.not_merge_bank ? '是' : '否'
      } else {
        delete paramMerge.not_merge_bank
      }
      postAxios('/voucher-manage/voucher/saveMergeSetting', paramMerge).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    menuSelect (e) {
      let topHeight = document.getElementById('sttingsContainer').getElementsByTagName('h4')[(e.split('-')[1] - 1)].offsetTop - 86
      document.getElementById('sttingsContainer').scrollTop = topHeight
    },
    saveIncomeInvoice (data, url) {
      let zy = ''
      let param = {}
      for (let key in data) {
        if (typeof data[key] === 'boolean') {
          if (data[key]) {
            zy += key
          }
          zy += '$'
        }
      }
      param.zy = zy
      param.pzrule = data.pzrule || 1
      param.flrule = data.flrule || 2
      param.setid = data.setid || ''
      param.style = data.style || ''
      postAxios(url, param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
          if (param.setid === '') {
            this.loadData()
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    saveParaSet (type, value) {
      let param = {pType: type, pValue: value ? '是' : '否'}
      if (type === 'srfl') {
        param.pValue = value ? 2 : 0
      }
      if (type === 'pzrq') {
        param.pValue = value
      }
      if (type === 'pjhbsl') {
        param.pValue = value
      }
      if (type === 'ncpsl') {
        param.pValue = value
      }

      postAxios('/zncs/workbench/saveParaSet', param).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    blackInputBlur (e) {
      if (e.target.value) {
        this.saveBlackList(e.target.value)
      }
    },
    delBlacklist (index) {
      postAxios('/zncs/workbench/deleteBlackList', {id: this.blacklist[index].id}).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        this.loadBlackList()
      })
    },
    addBlacklist () {
      this.blacklist.push({name: ''})
    },
    saveBlackList (names) {
      postAxios('/zncs/workbench/saveBlackList', {names: names}).then(res => {
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        this.loadBlackList()
      })
    },
    loadBlackList () {
      postAxios('/zncs/workbench/queryBlackList').then(bres => {
        this.blacklist = bres.rows
      })
    },
    loadData () {
      axios.all([
        postAxios('/zncs/workbench/quertParaSet'),
        postAxios('/zncs/workbench/queryBlackList'),
        postAxios('/zncs/gl_vatincinvact/queryRule'),
        postAxios('/zncs/gl_vatsalinvact/queryRule'),
        postAxios('/zncs/gl_yhdzdact/queryRule'),
        getAxios('/voucher-manage/voucher/queryMergeSetting')
      ]).then(axios.spread((...res) => {
        if (res[0].success) {
          this.srfl = res[0].rows[0].srfl !== 0
          this.isyh = res[0].rows[0].isyh === '是'
          this.isrz = res[0].rows[0].isrz === '是'
          this.pzrq = res[0].rows[0].pzrq
          this.ncpsl = res[0].rows[0].ncpsl
          this.ishbfl = res[0].rows[0].ishbfl === '是'
          this.iscwvhr = res[0].rows[0].iscwvhr === '是'
          this.ishbsr = res[0].rows[0].ishbsr === '是'
          this.ishbkc = res[0].rows[0].ishbkc === '是'
          this.ishbyh = res[0].rows[0].ishbyh === '是'
          this.cgfz = res[0].rows[0].cgfz === '是'
          this.cbfz = res[0].rows[0].cbfz === '是'
          this.yhhb = res[0].rows[0].yhhb === '是'
          this.pjhbsl = res[0].rows[0].pjhbsl
        }
        if (res[1].success) {
          this.blacklist = res[1].rows
        }
        if (res[2].success) {
          if (res[2].rows) {
            res[2].rows.zy && res[2].rows.zy.split('$').forEach(res => {
              if (res) {
                this.incomeInvoice[res] = true
              }
            })
            this.incomeInvoice.pzrule = res[2].rows.value
            this.incomeInvoice.flrule = res[2].rows.entry_type
            this.incomeInvoice.setid = res[2].rows.setid
            this.incomeInvoice.style = res[2].rows.style
          } else {
            this.incomeInvoice.selectWlZy = true
            this.incomeInvoice.selectLxZy = true
            this.incomeInvoice.selectXmZy = true
          }
        }
        if (res[3].success) {
          if (res[3].rows) {
            res[3].rows.zy && res[3].rows.zy.split('$').forEach(res => {
              if (res) {
                this.outputInvoice[res] = true
              }
            })
            this.outputInvoice.pzrule = res[3].rows.value
            this.outputInvoice.flrule = res[3].rows.entry_type
            this.outputInvoice.setid = res[3].rows.setid
            this.outputInvoice.style = res[3].rows.style
          } else {
            this.outputInvoice.selectWlZy = true
            this.outputInvoice.selectLxZy = true
            this.outputInvoice.selectXmZy = true
          }
        }
        if (res[4].success) {
          if (res[4].rows) {
            res[4].rows.zy && res[4].rows.zy.split('$').forEach(res => {
              if (res) {
                this.bankInvoice[res] = true
              }
            })
            this.bankInvoice.pzrule = res[4].rows.value
            this.bankInvoice.flrule = res[4].rows.entry_type
            this.bankInvoice.setid = res[4].rows.setid
            this.bankInvoice.style = res[4].rows.style
          }
        }
        if (res[5].success && res[5].data) {
          this.mergeSetting = res[5].data
          // this.mergeSetting.not_merge_bank = res[5].data.not_merge_bank === '是'
          this.$set(this.mergeSetting, 'not_merge_bank', res[5].data.not_merge_bank === '是')
        }
      }))
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style scoped>
  .set-item-style {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: rgb(51, 51, 51);
    border-radius: 50%;
    vertical-align: middle;
    margin-top: -4px;
    margin-right: 5px;
  }
  .set-item {
    line-height: 25px;
  }
  .sttings-main .el-icon-close:before {
    color: black;
  }

  h4 {
    margin: 20px 0;
  }

  .sttings-main {
    height: 100%;
    text-align: left;
  }

  .text-content {
    background-color: #fafafa;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    padding: 20px;
  }
</style>
