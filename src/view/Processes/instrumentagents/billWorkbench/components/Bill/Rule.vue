<template>
  <div style="width: 1200px;border: 1px solid #e6e6e6; margin: auto;text-align: left" class="createRules-container">
    <div style="height: 55px;padding: 30px 85px 0;text-align: left;">
      <el-radio @change="radioChange" v-model="radio" label="1">默认入账规则</el-radio>
      <el-radio @change="radioChange" v-model="radio" label="2">关键字入账规则</el-radio>
    </div>
    <div class="table-container">
      <div :key="idx" v-for="(voucherItem, idx) in oneVoucher">
        <div @mouseout="outKeyword(idx)" @click="addKeyword(idx, $event)" class="rules-keyword rules-keyword-ar" :style="idx > 0 ? 'display: block; margin-top: 10px' : 'display: none'">
          <p class="rules-keyword-arr" style="display: inline-block;
                    vertical-align: top;
                    width: 60px;
                    background: #eff8ff;
                    border-right: 1px solid #e6e6e6;
                    text-align: center;">关<br/>键<br/>词</p>
          <div style="width: calc(100% - 65px); display: inline-block; padding: 5px; height: 59px; overflow: auto;" class="rules-keyword-arr">
            <el-input class="rules-keyword-arr" size="mini" style="width: 130px; margin: 5px 3px;" :key="keywordIdx" v-for="(keyword, keywordIdx) in voucherItem.keywords" placeholder="" v-model="keyword.keyword">
              <i
                @click="delKeyWord(idx, keywordIdx)"
                class="el-icon-close el-input__icon"
                slot="suffix">
              </i>
            </el-input>
          </div>
        </div>
        <table>
          <thead>
          <tr>
            <th width="55"></th>
            <th>摘要</th>
            <th>会计科目</th>
            <th width="210">借方金额</th>
            <th width="210">贷方金额</th>
            <th width="55"></th>
          </tr>
          </thead>
          <div class="mockTbody">
            <tr class="itemTr" v-for="(vItem, index) in voucherItem.body" :key="index">
              <td>
                <i class="el-icon-circle-plus-outline" @click="addItem(index, idx)"></i>
                <i class="el-icon-remove-outline" @click="removeItem(index, idx)"></i>
              </td>
              <td><input type="text" v-model="voucherItem.body[index].zy" @focus="zyFocus(index, idx)"></td>
              <td class="selectAccountTd">
                <el-select v-model="voucherItem.body[index].accid" clearable filterable placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in kmList"
                    :key="item.id"
                    :label="item.codename"
                    :value="item.id">
                  </el-option>
                </el-select>
              </td>
              <td class="selectAmountTypeTd">
                <el-select v-model="voucherItem.body[index].debit" @change="debitChange(voucherItem.body[index])" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in debitOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="voucherItem.body[index].credit" @change="creditChange(voucherItem.body[index])" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in debitOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <i class="el-icon-circle-close-outline" @click="removeItem(index, idx)"></i>
              </td>
            </tr>
          </div>
          <tfoot>
          <tr>
            <td></td>
            <td colspan="2">合计</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tfoot>
        </table>
      </div>
      <div v-if="radio === '2'" style=" margin: 5px auto; display: block; text-align: center; border: 1px solid #e6e6e6; padding: 10px; margin-left: 55px; margin-right: 54px;">
        <el-button @click="addRule"
                   size="small" round
                   style="color: #00a2d4; font-size: 16px;" class="el-icon-plus">添加规则</el-button>
        <el-button @click="delRule()"
                   v-if="oneVoucher.length > 1" type="danger" size="small" round
                   style="color: white; font-size: 16px;" class="el-icon-delete">删除规则</el-button>
      </div>
    </div>
    <el-button @click="saveKeyWords" style="width: 100px; display: block; margin: 10px auto;" type="primary" round class="el-icon-circle-check-outline">保存</el-button>
  </div>
</template>
<script>
import {postAxios, getAxios} from '@/libs/axios'
let voucherItem = {
  zy: '',
  accid: '',
  debit: '',
  credit: ''
}
export default {
  props: {
    folderInfo: {
      type: Object
    }
  },
  computed: {},
  data () {
    return {
      kmList: {},
      ruleData: {},
      radio: '1',
      debitOpts: [{
        label: '金额',
        value: 0
      }, {
        label: '税额',
        value: 1
      }, {
        label: '价税合计',
        value: 2
      }
      // , {
      //   label: '金额负',
      //   value: 3
      // }, {
      //   label: '税额负',
      //   value: 4
      // }, {
      //   label: '价税合计',
      //   value: 5
      // }
      ],
      oneVoucher: [
        {
          body: [
            {...voucherItem},
            {...voucherItem},
            {...voucherItem},
            {...voucherItem}
          ],
          keywords: []
        }
      ],
      currentVoucher: 0
    }
  },
  methods: {
    debitChange (item) {
      item.credit = ''
    },
    creditChange (item) {
      item.debit = ''
    },
    saveKeyWords (e) {
      let templet = []
      for (let ov in this.oneVoucher) {
        let bodys = []
        for (let VOB in this.oneVoucher[ov].body) {
          let bodyItem = this.oneVoucher[ov].body[VOB]
          if (bodyItem.accid === '' && bodyItem.credit === '' && bodyItem.debit === '' && bodyItem.zy === '') {
          } else {
            if ((bodyItem.debit === '' && bodyItem.credit === '') || bodyItem.accid === '' || bodyItem.zy === '') {
              this.$message.error('请完善规则')
              return
            } else {
              bodys.push(bodyItem)
            }
          }
        }
        templet.push({
          head: {
            words: this.oneVoucher[ov].keywords.map(ev => {
              return ev.keyword
            }).join(','),
            pk_basecategory: this.folderInfo.pk_basecategory,
            categoryid: this.folderInfo.id,
            order: ov
          },
          body: bodys
        })
      }
      const loading = this.$loading({
        lock: true,
        text: '正在保存',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      postAxios('/zncs/workbench/saveVoucherTemplet', {templet: JSON.stringify(templet)}).then(res => {
        loading.close()
        if (res.success) {
          this.$message.success(res.msg)
          this.$parent.$parent.getFolderData()
          this.$parent.$parent.ruleDialogVisible = false
        } else {
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    delKeyWord (idx, keywordIdx) {
      this.oneVoucher[idx].keywords.splice(keywordIdx, 1)
    },
    outKeyword (idx) {
      this.currentVoucher = idx
    },
    addKeyword (idx, event) {
      if (event.target.nodeName === 'DIV') {
        if (this.oneVoucher[idx].keywords.length) {
          this.oneVoucher[idx].keywords[this.oneVoucher[idx].keywords.length - 1].keyword && this.oneVoucher[idx].keywords.push({keyword: ''})
        } else {
          this.oneVoucher[idx].keywords.push({keyword: ''})
        }
      }
    },
    delRule () {
      this.oneVoucher.pop()
    },
    addRule () {
      this.oneVoucher.push({
        body: [
          {...voucherItem},
          {...voucherItem},
          {...voucherItem},
          {...voucherItem}
        ],
        keywords: []
      })
    },
    radioChange (e) {
      if (e === '1' && this.oneVoucher.length > 1) {
        this.$confirm('此操作会删除已经添加规则', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.oneVoucher.splice(1, this.oneVoucher.length + 1)
        }).catch(action => {
          this.radio = '2'
        })
      }
    },
    zyFocus (index, parentIndex) {
      if (index > 0 && this.oneVoucher[parentIndex].body[index].zy === '') {
        this.oneVoucher[parentIndex].body[index].zy = this.oneVoucher[parentIndex].body[index - 1].zy
      }
    },
    removeItem (index, idx) {
      if (this.oneVoucher.length > 0) {
        this.oneVoucher[idx].body.splice(index, 1)
      }
    },
    addItem (index, idx) {
      this.oneVoucher[idx].body.splice(index + 1, 0, {...voucherItem})
    },
    initKmListData () {
      const loading = this.$loading({
        lock: true,
        text: '查询中...',
        spinner: 'el-icon-loading'
      })
      getAxios('/bdset/gl_cpacckmact/queryByPz').then(res => {
        if (res.success) {
          this.kmList = res.rows

          postAxios('/zncs/workbench/quertVoucherTemplet', {categoryid: this.folderInfo.id}).then(res => {
            loading.close()
            if (res.success) {
              if (res.rows.length === 0) {
                return
              }
              this.oneVoucher = []
              this.radio = res.rows.length === 1 ? '1' : '2'
              res.rows.forEach(res => {
                this.oneVoucher.push({
                  keywords: res.words ? res.words.split(',').map(res => {
                    return {keyword: res}
                  }) : [],
                  body: (function () {
                    let pushLenght = 4 - res.children.length
                    for (let idx = 0; idx < pushLenght; idx++) {
                      res.children.push({...voucherItem})
                    }
                    return res.children
                  })()
                })
              })
              // this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          loading.close()
          this.$message.error(res.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  beforeDestroy () {
  },
  mounted () {
    this.initKmListData()
    document.addEventListener('click', e => {
      if (this.oneVoucher[this.currentVoucher].keywords.length && this.oneVoucher[this.currentVoucher].keywords[this.oneVoucher[this.currentVoucher].keywords.length - 1].keyword === '') {
        if (e.target.className !== 'rules-keyword-arr' && e.target.className !== 'el-input__inner' && e.target.className.indexOf('el-input__icon') === -1) {
          this.oneVoucher[this.currentVoucher].keywords.pop()
        }
      }
    }, false)
  }
}
</script>
<style scoped>
  .rules-keyword .el-icon-close:before {
    color: #000;
  }
  .rules-keyword:hover {
    margin-top: 2px;
    border: 1px solid #409eff;
  }
  .rules-keyword {
    margin-left: 55px;
    margin-right: 54px;
    min-height: 60px;
    border: 1px solid #e6e6e6;
  }
  .table-container{
    height: 400px;
    overflow: hidden;
    overflow-y: auto;
  }
  .createRules-container .table-container {
    padding: 0 30px;
  }
  .createRules-container .table-container table {
    width: 100%;
  }
  .createRules-container .table-container th {
    background-color: #eff8ff;
    color: #666667;
  }
  .createRules-container .table-container table thead tr th {
    height: 62px;
    text-align: center;
    border: 1px solid #e6e6e6;
    border-top: none;
    border-bottom: none;
  }
  .createRules-container .table-container table .mockTbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  .createRules-container .table-container table .mockTbody tr td:first-child, .createRules-container .table-container table .mockTbody tr td:last-child {
    border: none;
  }
  .createRules-container .table-container table .mockTbody tr:hover i {
    display: block;
  }
  .createRules-container .table-container table .mockTbody tr td {
    height: 52px;
    border: 1px solid #e6e6e6;
    border-top: none;
  }
  .createRules-container .table-container table .mockTbody tr td i {
    display: none;
    margin: 5px auto 0;
    font-size: 18px;
    text-align: center;
  }
  .createRules-container .table-container table thead tr th {
    height: 62px;
    text-align: center;
    border: 1px solid #e6e6e6;
    border-top: none;
    border-bottom: none;
  }
  .createRules-container .table-container table thead tr th:first-child, .createRules-container .table-container table thead tr th:last-child {
    background: inherit;
    border: none;
  }
  .createRules-container .table-container table .mockTbody tr td input {
    width: 100%;
    height: 100%;
    border: none;
  }
  .createRules-container .table-container table tfoot tr td:last-child {
    border: none;
  }
  .createRules-container .table-container table tfoot tr td {
    height: 52px;
    border: 1px solid #e6e6e6;
    border-top: none;
  }
  .createRules-container .table-container table tfoot tr td:first-child, .createRules-container .table-container table tfoot tr td:last-child {
   border: none;
 }
</style>
<style>
  .createRules-container .mockTbody .el-input__inner {
    border-width: 0;
  }
  .createRules-container .mockTbody .el-input__suffix {
    display: none;
  }

</style>
