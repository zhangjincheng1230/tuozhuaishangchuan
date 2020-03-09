<template>
    <div class="voucher-panel" style=" overflow: hidden; padding-bottom: 30px; margin: 0 -20px">
      <div style="position: absolute; width: 100%; z-index: 9999">
        <el-row style="background: #d8ebf5; line-height: 37px; padding: 0 10px;">
          <el-col :span="12" style="text-align:left; visibility: hidden">
            期间：&nbsp;
            <el-date-picker
              size="mini"
              v-model="value1"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
          <el-col :span="12" style="text-align:right;">
            <el-button style="background: #2c9dd8" size="mini" type="primary" @click="showChange" v-html="showImgAll?'隐藏票据':'显示票据'"></el-button>
            <el-button style="background: #2c9dd8" v-show="this.$parent.$parent.curFolder.voucherType !== '091'" size="mini" type="primary" @click="saveTzpzHVOs">保存</el-button>
          </el-col>
        </el-row>
        <el-row class="header-title">
          <el-col :span="1" >
            <!-- <el-checkbox :indeterminate="isIndeterminate" @change="checkAll" v-model="isCheckAll" text-color="#FFF" fill="#FFF" id="allCheck" style="color: white">全选</el-checkbox> -->
            序号
          </el-col>
          <el-col :span="10" >
            摘要
          </el-col>
          <el-col :span="9" >
            会计科目
          </el-col>
          <el-col :span="2" >
            借方金额
          </el-col>
          <el-col :span="2" >
            贷方金额
          </el-col>
        </el-row>
      </div>
      <el-checkbox-group style="height: calc(100% - 70px); overflow-y: auto; margin-top: 70px;" v-model="checkedAllkey" @change="checkedListChange">
        <div class="list-talbe" :key="key" v-for="(item, key) in dataList" :label="item">
          <el-card shadow="hover" :body-style="{ padding: '0px'}" >
            <el-row class="talbe-head">
              <el-col :span="20" >
                <!-- <el-checkbox class="check-item" :label="key" v-model="item.isCheck"></el-checkbox> -->
                <label v-if="item.typeName" style="color: white; background: red; border-radius: 50%; padding: 2px; font-weight: 500">{{item.typeName}}</label>
                <label>日期: {{item.zdrq}}</label>
                <label>凭证号: <span style="cursor: pointer; color: #0c7bd5" @click="editVoucher(item), currentRow = key" >{{item.pzh}}</span></label>
                <label>附单据: {{item.fdjs || item.userObject.length}}张</label>
                <label>制单人: {{item.zd_user}}</label>
                <label><span style="cursor: pointer; color: #0c7bd5" @click="showChangeImg(key)" v-html="item.showImg?'隐藏票据':'显示票据'">显示票据</span></label>
                <el-tooltip v-if="pzztCode.indexOf(item.pzzt) !== -1" :content="pzztMsg[item.pzzt]" placement="right" effect="light">
                  <img style="display: inline-block; vertical-align: top; margin-left: 15px;" src="@/assets/lp250.png" alt="">
                </el-tooltip>
              </el-col>
              <el-col :span="4" style="text-align:right">
                <label><i style="font-size:18px; cursor: pointer;" @click="editVoucher(item), currentRow = key" class="el-icon-edit"></i></label>
                <label><i style="font-size:18px; cursor: pointer;" @click="delVoucher(key)" class="el-icon-delete"></i></label>
              </el-col>
            </el-row>
            <el-row v-if="item.showImg">
              <el-col :span="24" class="talbe-img" style="overflow-x: scroll; overflow-y: hidden; white-space:nowrap; text-align: center">
                <viewer style="width: 100%; height: 100%; cursor: pointer">
                  <img :key="key"
                       style="margin-right:10px"
                       v-if="imageMaps[imgUrl]"
                       v-for="(imgUrl, key) in item.userObject"
                       :src="imgUrlBase + '?id=' + (imageMaps[imgUrl].imgsourid) + '&pk_corp=' + item.corpId + '&name=' + (imageMaps[imgUrl].imgname)+'&X-Login-Corp='+usercorp+'&X-Login-Date='+userdata+'&X-Login-User='+user+'&X-ACCESS-TOKEN='+usertoken" />
                </viewer>
              </el-col>
            </el-row>
            <div class="label-data-panel" :key="key" v-for="(chi, key) in item.children">
              <el-row type="flex" class="talbe-data">
                <el-col :span="1" >
                  {{key + 1}} &nbsp;
                </el-col>
                <el-col :span="10" >
                  <el-tooltip v-if="chi.tmpzy" :disabled="chi.tmpzy && chi.tmpzy.length < 30" effect="light" :content="chi.tmpzy">
                    <span style=" text-overflow: ellipsis;
                                white-space: nowrap;
                                width: 100%;
                                overflow: hidden;
                                display: block;"> {{chi.tmpzy}}&nbsp; </span>
                  </el-tooltip>
                </el-col>
                <el-col :span="9" >
                  <el-tooltip v-if="chi.tmpfullname" :disabled="chi.tmpfullname && chi.tmpfullname.length < 30" effect="light" :content="chi.tmpfullname">
                    <span style=" text-overflow: ellipsis;
                                white-space: nowrap;
                                width: 100%;
                                overflow: hidden;
                                display: block;"> {{chi.tmpfullname}}&nbsp; </span>
                  </el-tooltip>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  {{chi.jfmny ? chi.jfmny.toFixed(2) : ''}}
                  <span> &nbsp;</span>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  {{chi.dfmny ? chi.dfmny.toFixed(2) : ''}}
                  <span> &nbsp;</span>
                </el-col>
              </el-row>
            </div>
            <el-row class="talbe-data-count">
              <el-col :span="20" >
                合计
              </el-col>
              <el-col :span="2" style="text-align: right">
                <div>{{item.jfhj ? item.jfhj.toFixed(2) : ''}}&nbsp;</div>
              </el-col>
              <el-col :span="2" style="text-align: right">
                <div>{{item.dfhj ? item.dfhj.toFixed(2) : ''}}&nbsp;</div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-checkbox-group>
      <div style="text-align: right; margin-right: 20px; margin-top: 10px;position: absolute; right: 0px; bottom: 0px;">总凭证数: {{dataList.length}} 张</div>
    </div>
</template>

<script>

import {postAxios, prefix} from '@/libs/axios'
import axios from 'axios'
// import indexAddtab from '../../../DZF_KJ/index.js'
export default {
  props: {
    folderInfo: {},
    voucherList: {}
  },
  data () {
    return {
      user: this.$store.getters.getUserId,
      userdata: this.$store.getters.getLoginDate,
      usercorp: this.$store.getters.getLoginCorpId,
      usertoken: this.$store.getters.getToken,
      win: window,
      checkedAllkey: [],
      checkedAllList: [],
      isIndeterminate: false,
      isCheckAll: false,
      imgUrlBase: prefix + '/zncs/gl_imgview/search',
      showImgAll: false,
      dataList: [],
      value1: '',
      imageMaps: {},
      successNum: 0,
      errorTips: [],
      infoTips: [],
      currentRow: null,
      pzztCode: [251, 252, 253, 254, 255, 256, 257, 258],
      pzztMsg: {
        '251': '凭证借贷方向不平，请处理',
        '252': '问题票据或未识别票据需手动填制凭证',
        '253': '数量*单价≠金额',
        '254': '辅助核算项目为空',
        '255': '金额为空，请检查!',
        '256': '票据币种与会计科目币种不一致，请检查！',
        '257': '请设置外币汇率！',
        '258': '特殊业务票据(例如:社保、还贷等)，请检查！'
      },
      labelval: {}
    }
  },
  methods: {
    editDel (msg) {
      if (this.currentRow !== null) {
        this.delVoucher(this.currentRow)
        this.currentRow = null
        if (this.dataList.length === 0) {
          this.$parent.$parent.voucherVisible = false
        }
        this.$parent.$parent.getFolderData()
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: msg,
          type: 'success'
        })
      }
    },
    delVoucher (e) {
      // const indexInt = this.dataList[0].pzh
      this.dataList.splice(e, 1)
      // this.dataList.forEach((item, idx) => {
      //   let pzh = idx + Number(indexInt)
      //   switch (idx.toString().length) {
      //     case 1:
      //       pzh = '000' + pzh
      //       break
      //     case 2:
      //       pzh = '00' + pzh
      //       break
      //     case 3:
      //       pzh = '0' + pzh
      //       break
      //     case 4:
      //       break
      //   }
      //   item.pzh = pzh
      // })
    },
    editVoucher (ev) {
      window.top.editVoucherDel = this.editDel
      this.labelval = ev

      const e = JSON.parse(JSON.stringify(ev))
      console.log(e, 'fawfwa')
      if (this.$parent.$parent.curFolder.voucherType === '091') {
        // window.top.addTab('凭证', 'gl/gl_pzgl/gl_tzpz.jsp?from=票据工作台&imgIds=' + e.userObject.join(',') + '&pk_ivs=' + e.pkIvs.join(',') + '&vdate=' + e.zdrq + '&pzh=' + e.pzh, null, 'voucherDetail')
        this.$router.push('/cwcl/voucher/voucher-card?from=票据工作台&imgIds=\' + e.userObject.join(\',\') + \'&pk_ivs=\' + e.pkIvs.join(\',\') + \'&vdate=\' + e.zdrq + \'&pzh=\' + e.pzh')
      } else {
        window.top.editVoucherData = e
        if (typeof e.userObject !== 'string') {
          window.top.editVoucherData.userObject = window.top.editVoucherData.userObject.join(',')
        }
        // this.$router.push('/cwcl/voucher/voucher-card?from=票据工作台')
        this.$router.push({
          name: 'voucher-edit',
          params: {
            data: e
          }
        })
        // this.$parent.$parent.voucherVisible = false
        // window.top.addTab('凭证', 'gl/gl_pzgl/gl_tzpz.jsp?from=票据工作台', '', 'voucherDetail')
      }
    },
    saveTzpzHVOs () {
      let arrPZH = []
      debugger
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.pzztCode.indexOf(this.dataList[i].pzzt) !== -1) {
          arrPZH.push(this.dataList[i].pzh)
        }
      }
      if (arrPZH.length > 0) {
        this.$message.error('包含待确认凭证[' + arrPZH.join('，') + ']，请检查!')
        return
      }
      var dataListParams = JSON.parse(JSON.stringify(this.dataList))
      let arrayparams = []
      let arrayParamsOther = []
      dataListParams.forEach((res) => {
        if (typeof (res.userObject) === 'object') {
          res.userObject = res.userObject.join(',')
        }
        if (res.lydjlx === 'HP70' || res.lydjlx === 'HP75' || res.lydjlx === 'HP59') {
          arrayParamsOther.push(JSON.stringify(res))
        } else {
          arrayparams.push(JSON.stringify(res))
        }
      })
      this.sycelist(arrayparams, arrayParamsOther)
    },
    sycelist (arrayparams, arrayParamsOther) {
      var _this = this
      let arrayParamsOtherIndex = 0
      let sendSave = () => {
        let tempParamsOther = JSON.parse(arrayParamsOther[arrayParamsOtherIndex])
        postAxios('/voucher-manage/voucher/save', tempParamsOther, {}, 60000000).then((re) => {
          arrayParamsOtherIndex++
          if (re.success) {
            _this.successNum++
          } else {
            if (re.msg === '-150' || re.msg === -150) {
              re.msg = '损益结转已完成，编辑并保存凭证后请重新结转损益！'
            }
            // _this.errorTips.push(re.msg)
            // 需要启用存货辅助、启用数量核算
            _this.dataList.push(tempParamsOther)
          }
          if (re.msg.indexOf('需要启用存货辅助、启用数量核算') !== -1 && _this.errorTips.join('').indexOf('需要启用存货辅助、启用数量核算') === -1) {
            _this.errorTips.push(re.msg.split('<br>')[0] + '<br>' + re.msg.split('<br>')[1])
          } else if (re.msg.indexOf('需要启用存货辅助、启用数量核算') !== -1 && _this.errorTips.join('').indexOf('需要启用存货辅助、启用数量核算') !== -1) {
            _this.errorTips.push('')
          } else if (re.msg.indexOf('损益结转已完成') !== -1 && _this.errorTips.join('').indexOf('损益结转已完成') === -1) {
            _this.errorTips.push(re.msg.replace('-150', ' 损益结转已完成，编辑并保存凭证后请重新结转损益！ '))
          } else if (re.msg.indexOf('损益结转已完成') !== -1 && _this.errorTips.join('').indexOf('损益结转已完成') !== -1) {
            _this.errorTips.push('')
          } else if (re.msg.indexOf('成本结转') !== -1 && _this.infoTips.join('').indexOf('成本结转') === -1) {
            _this.infoTips.push('<br>' + re.msg)
          } else if (re.msg.indexOf('成本结转') !== -1 && _this.infoTips.join('').indexOf('成本结转') !== -1) {
            _this.infoTips.push('')
          } else if (re.msg.indexOf('反计提折旧') !== -1 && _this.errorTips.join('').indexOf('反计提折旧') === -1) {
            _this.errorTips.push('<br>' + re.msg)
          } else if (re.msg.indexOf('反计提折旧') !== -1 && _this.errorTips.join('').indexOf('反计提折旧') !== -1) {
            _this.errorTips.push('')
          }
          // else if (re.msg.indexOf('已计提折旧') !== -1 && _this.errorTips.join('').indexOf('已计提折旧') === -1) {
          //   _this.errorTips.push('<br>' + re.msg)
          // } else if (re.msg.indexOf('已计提折旧') !== -1 && _this.errorTips.join('').indexOf('已计提折旧') !== -1) {
          //   _this.errorTips.push('')
          // }

          if (arrayParamsOther[arrayParamsOtherIndex]) {
            sendSave()
          }
          if (arrayParamsOther.length === arrayParamsOtherIndex) {
            this.$parent.$parent.getFolderData()
            loading.close()
            // _this.$message.success(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
            if (_this.successNum === 0) {
              // _this.$message.error(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
              _this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: `成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.join('')} ${_this.infoTips.join('')}`,
                type: 'error'
              })
            } else if (_this.errorTips.length === 0) {
              _this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: `成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.join('')} ${_this.infoTips.join('')}`,
                type: 'success'
              })
              // _this.$message.success(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
            } else {
              _this.$message({
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: `成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.join('')} ${_this.infoTips.join('')}`,
                type: 'info'
              })
              // _this.$message.info(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
            }
            if (_this.errorTips.length === 0) {
              _this.$parent.$parent.voucherVisible = false
            }
            _this.successNum = 0
            _this.errorTips = []
            _this.errorTips = []
          }
        }).catch(re => {
          loading.close()
          _this.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '请求出错',
            type: 'error'
          })
        })
      }
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'a',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'custom-makeAccount'
      })
      let arrSend = []
      arrayparams.map(item => arrSend.push(_this.saveDataList(item)))
      axios.all(arrSend).then(axios.spread((...arr) => {
        this.dataList = []
        arr.forEach((value, key, arr) => {
          let tempListItem = JSON.parse(arrayparams[key])
          if (value.success) {
            _this.successNum++
          } else {
            _this.dataList.push(tempListItem)
            if (value.msg === '-150' || value.msg === -150) {
              value.msg = '损益结转已完成，编辑并保存凭证后请重新结转损益！'
            }
            // _this.errorTips.push(value.msg)
          }
          if (value.msg.indexOf('损益结转已完成') !== -1 && _this.errorTips.join().indexOf('损益结转已完成') === -1) {
            _this.errorTips.push(value.msg.replace('-150', ' 损益结转已完成，编辑并保存凭证后请重新结转损益！ '))
          } else if (value.msg.indexOf('损益结转已完成') !== -1 && _this.errorTips.join().indexOf('损益结转已完成') !== -1) {
            _this.errorTips.push('')
          } else if (value.msg.indexOf('需要启用存货辅助、启用数量核算') !== -1 && _this.errorTips.join().indexOf('需要启用存货辅助、启用数量核算') === -1) {
            _this.errorTips.push(value.msg.split('<br>')[0] + '<br>' + value.msg.split('<br>')[1])
          } else if (value.msg.indexOf('需要启用存货辅助、启用数量核算') !== -1 && _this.errorTips.join().indexOf('需要启用存货辅助、启用数量核算') !== -1) {
            _this.errorTips.push('')
          } else if (value.msg.indexOf('成本结转') !== -1 && _this.infoTips.join().indexOf('成本结转') === -1) {
            _this.infoTips.push('<br>' + value.msg)
          } else if (value.msg.indexOf('成本结转') !== -1 && _this.infoTips.join().indexOf('成本结转') !== -1) {
            _this.infoTips.push('')
          } else if (value.msg.indexOf('反计提折旧') !== -1 && _this.errorTips.join('').indexOf('反计提折旧') === -1) {
            _this.errorTips.push('<br>' + value.msg)
          } else if (value.msg.indexOf('反计提折旧') !== -1 && _this.errorTips.join('').indexOf('反计提折旧') !== -1) {
            _this.errorTips.push('')
          }
          // else if (value.msg.indexOf('已计提折旧') !== -1 && _this.errorTips.join('').indexOf('已计提折旧') === -1) {
          //   _this.errorTips.push('<br>' + value.msg)
          // } else if (value.msg.indexOf('已计提折旧') !== -1 && _this.errorTips.join('').indexOf('已计提折旧') !== -1) {
          //   _this.errorTips.push('')
          // }
        })
        if (arrayParamsOther.length) {
          sendSave()
        } else {
          this.$parent.$parent.getFolderData()
          loading.close()
          if (_this.successNum === 0) {
            // _this.$message.error(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: `成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.join('')} ${_this.infoTips.join('')}`,
              type: 'error'
            })
          } else if (_this.errorTips.length === 0) {
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: `成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.join('')} ${_this.infoTips.join('')}`,
              type: 'success'
            })
            // _this.$message.success(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
          } else {
            _this.$message({
              dangerouslyUseHTMLString: true,
              showClose: true,
              message: `成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.join('')} ${_this.infoTips.join('')}`,
              type: 'info'
            })
            // _this.$message.info(`成功${_this.successNum}条，失败${_this.errorTips.length}条，${_this.errorTips.toString()}`)
          }
          if (_this.errorTips.length === 0) {
            _this.$parent.$parent.voucherVisible = false
          }
          _this.successNum = 0
          _this.errorTips = []
        }
      })).catch(re => {
        loading.close()
        _this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: '请求出错',
          type: 'error'
        })
      })
    },

    saveDataList (params) {
      return postAxios('/voucher-manage/voucher/save', JSON.parse(params), {}, 60000000)
    },
    queryBill () {
    },
    checkedListChange (val) {
      this.isCheckAll = val.length === this.dataList.length
      this.isIndeterminate = val.length > 0 && val.length < this.dataList.length
      this.checkedAllList.push(this.dataList[val[val.length - 1]])
    },
    checkAll (val) {
      if (val) {
        this.dataList.forEach((res, idx) => {
          res.isCheck = val
          this.checkedAllList.push(idx)
        })
      } else {
        this.dataList.forEach((res, idx) => {
          res.isCheck = val
          this.checkedAllList = []
        })
      }
      // this.isCheckAll = this.checkedAllList.length === this.dataList.length
      // this.isIndeterminate = this.checkedAllList.length > 0 && this.checkedAllList.length < this.dataList.length
    },
    showChange () {
      this.showImgAll = !this.showImgAll
      this.dataList.forEach(res => {
        res.showImg = this.showImgAll
      })
    },
    showChangeImg (idx) {
      this.dataList[idx].showImg = !this.dataList[idx].showImg
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
    },
    queryBillInfos (ids) {
      postAxios('/zncs/workbench/queryBillInfos', {ids: ids, period: this.$parent.$parent.searchData.period}).then(res => {
        res.data && res.data.forEach(item => {
          this.imageMaps[item.invoicvo.pk_invoice] = {
            imgname: item.imgname,
            imgsourid: item.imgsourid
          }
        })
      })
    }
  },
  destroyed (e) {
    delete this.$parent.$parent.curFolder.voucherType
  },
  mounted () {
    if (this.$parent.$parent.curFolder.voucherType === '091') {
      const maps = {
        zjx: '', // 进项 -专票
        zxx: '', // 销项-专
        yh: '', // 银行
        pjx: '', // 进项-普票
        pxx: '' // 销项-普
      }
      this.showImgAll = true
      let dataArr = []
      for (let map in maps) {
        if (this.$parent.$parent.curFolder.rows[map]) {
          dataArr.push({
            typeName: map === 'zjx' || map === 'zxx' ? '专票' : undefined,
            corpId: this.$parent.$parent.curFolder.rows[map][0].invoicvo.corpId,
            showImg: true,
            zd_user: window.top.SYSTEM && window.top.SYSTEM.UserName,
            jfhj: 0,
            dfhj: 0,
            zdrq: this.$parent.$parent.curFolder.rows[map + 'voucherdate'],
            pzh: this.$parent.$parent.curFolder.rows[map + 'voucherno'],
            children: [{}, {}],
            pkIvs: this.$parent.$parent.curFolder.rows[map].map(item => {
              return item.invoicvo.pk_invoice
            }),
            userObject: this.$parent.$parent.curFolder.rows[map].map(item => {
              this.imageMaps[item.imgsourid] = {
                imgname: item.imgname,
                imgsourid: item.imgsourid
              }
              return item.imgsourid
            })
          })
        }
      }
      this.$set(this, 'dataList', dataArr)
      // dataArr[0] = {
      //   corpId: this.$parent.$parent.curFolder.pk_corp,
      //   showImg: true,
      //   zdrq: ' ',
      //   jfhj: 0,
      //   dfhj: 0,
      //   typeName: '专票'
      // }
      // dataArr[0].userObject = this.$parent.$parent.curFolder.rows.z.map(item => {
      //   this.imageMaps[item.imgsourid] = {
      //     imgname: item.imgname,
      //     imgsourid: item.imgsourid
      //   }
      //   return item.imgsourid
      // })
      // dataArr[0].zdrq = this.$parent.$parent.curFolder.rows.zvoucherdate
      // dataArr[0].pzh = this.$parent.$parent.curFolder.rows.zvoucherno
      // dataArr[0].pkIvs = this.$parent.$parent.curFolder.rows.z.map(item => {
      //   return item.invoicvo.pk_invoice
      // })
      //
      // dataArr[1] = {
      //   corpId: this.$parent.$parent.curFolder.pk_corp,
      //   showImg: true,
      //   zdrq: ' ',
      //   jfhj: 0,
      //   dfhj: 0
      // }
      // dataArr[1].userObject = this.$parent.$parent.curFolder.rows.p.map(item => {
      //   this.imageMaps[item.imgsourid] = {
      //     imgname: item.imgname,
      //     imgsourid: item.imgsourid
      //   }
      //   return item.imgsourid
      // })
      // dataArr[1].zdrq = this.$parent.$parent.curFolder.rows.pvoucherdate
      // dataArr[1].pzh = this.$parent.$parent.curFolder.rows.pvoucherno
      // dataArr[1].pkIvs = this.$parent.$parent.curFolder.rows.p.map(item => {
      //   return item.invoicvo.pk_invoice
      // })
      // dataArr[0].children = [{}, {}]
      // dataArr[1].children = [{}, {}]
      // this.dataList.push(dataArr[0])
      // this.dataList.push(dataArr[1])
      return
    }
    // let params
    // if (this.folderInfo.allowchild) {
    //   params = {
    //     categoryid: this.folderInfo.id,
    //     period: this.$parent.$parent.searchData.period
    //   }
    // } else {
    //   params = {
    //     ids: this.folderInfo.id,
    //     period: this.$parent.$parent.searchData.period
    //   }
    // }
    // let loading = ''
    let ids = []
    this.voucherList.forEach(res => {
      res.userObject = res.userObject.split(',')
      ids = ids.concat(res.userObject)
    })
    this.queryBillInfos(ids.join(','))
    this.dataList = this.voucherList
    // 监听
    this.$bus.$off('queryBillInfos')
    this.$bus.$on('queryBillInfos', (data) => {
      if (data) {
        const inde = this.dataList.findIndex(item => {
          return item.lydjid === this.labelval.lydjid
        })
        if (inde !== -1) {
          this.dataList.splice(inde, 1)
        }
      }
    })
    // this.$message.success(res.msg)
    // postAxios('/zncs/workbench!makeAccount', params, {}, 600000).then(res => {
    //   loading.close()
    //   if (res.success) {

    //   } else {
    //     this.$message.error(res.msg)
    //   }
    // }).catch(res => {
    //   loading.close()
    //   this.$message.error(res.msg)
    // })
    // loading = this.$loading({
    //   lock: true,
    //   text: '正在整理',
    //   body: true,
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
  },
  activated () {
  }
}
</script>
<style>
  .voucher-panel .check-item .el-checkbox__label {
    display: none!important;
  }
  .voucher-panel .el-icon-edit:before {
    color: #006bff;
  }
  .voucher-panel .el-icon-delete:before {
    color: #006bff;
  }
  .custom-makeAccount {
    background: url(../../../../../../assets/img/make-loading.gif) 0 no-repeat;
    background-position:center center
  }
</style>
<style scoped>
.el-table__expand-column{
  width: 20px;
}
  .list-talbe{
    text-align: left;
    margin-top: 10px;
  }
.list-talbe:first-child{
  margin-top: 0px;
}
  .list-talbe .el-row {
    /*border: 1px solid #d1d1d1;*/
  }
  .talbe-head {
    background: #EBEBEB;
    font-size: 12px;
  }
  .talbe-head label {
    margin-left: 20px;
  }
  .talbe-img img {
    height: 100%;
    border: 1px solid #d1d1d1;
  }
  .talbe-img {
    height: 100px;
    padding: 10px 30px;
  }
  .list-talbe [class*=el-col-]{
    border-right: 1px solid #d1d1d1;
    border-bottom: 1px solid #d1d1d1;
    padding: 4px;
    font-size: 13px;
  }
  .list-talbe [class*=el-col-]:last-child {
    border-right: 0px solid #d1d1d1;
    /*border-bottom: 0px solid #d1d1d1;*/
  }
  .header-title {
    border: 1px solid #d1d1d1;
    background: #349ed7;
    line-height: 30px;
    color: white;
    border-left-width: 0;
    border-right-width: 0;
  }
  .header-title [class*=el-col-] {
    border-left: 1px solid #FFF;
  }
  .header-title [class*=el-col-]:first-child {
    border-left: 0px solid #d1d1d1;
  }
  .talbe-data .el-col-1, .talbe-data-count .el-col-1{
    text-align: center;
  }
</style>
