<template>
    <div class="statistical-analysis-panel" v-if="billCountData.invoicelist" style="height:560px">
      <div class="sa-row" style="padding: 5px 25px; background: #d9ebf5;">期间 :
        <el-date-picker
          v-model="period"
          style="width: 200px; margin-left: 20px"
          type="month"
          @change="paramChange"
          value-format="yyyy-MM"
          format="yyyy-MM"
          :picker-options="pickerOptions"
          placeholder="选择月" size="medium">
        </el-date-picker>
      </div>

      <el-row class="sa-row">
        <el-col :span="4" style="padding: 22px 0;">
          <div >
            <img class="sa-img" src="../../../../../../assets/img/tjfx.png" alt="">
            <div class="sa-row-right">
              <p class="row-title">概况分析:</p>
              <p class="row-content">本期票据: {{billCountData.pjzs || 0}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div style="display: block" class="sa-row-right">上传票据 {{billCountData.scpj || 0}}张</div>
          <div class="sa-row-right">
            已识别:{{billCountData.ysb || 0}}张
          </div>
          <div class="sa-row-right">
            未识别:{{billCountData.wsb || 0}}张
          </div>
          <div class="vertical-line"></div>
        </el-col>
        <el-col :span="7">
          <div style="display: block" class="sa-row-right">跨期至本期票据 <el-button @click="getItemData('in')" type="text">{{billCountData.kqzbq || 0}}</el-button>张</div>
          <div class="sa-row-right">
            已做账:{{billCountData.yzz || 0}}张
          </div>
          <div class="sa-row-right">
            未做账:{{billCountData.wzz || 0}}张
          </div>
          <div class="sa-row-right">
            已作废:{{billCountData.yzf || 0}}张
          </div>
          <div class="vertical-line"></div>
        </el-col>
        <el-col :span="6">
          <div style="display: block" class="sa-row-right">跨期至其他期间票据 <el-button @click="getItemData('out')" type="text">{{billCountData.kqzqt || 0}}</el-button>张</div>
          <div class="sa-row-right">
            重复:{{billCountData.cf || 0}}张
          </div>
          <div class="sa-row-right">
            非本公司票据:{{billCountData.fbgs || 0}}张
          </div>
        </el-col>
      </el-row>
      <el-row class="sa-row">
        <el-col :span="4">
          <div >
            <img class="sa-img" src="../../../../../../assets/img/jxfp.png" alt="">
            <div class="sa-row-right">
              <p class="row-title">进项发票:</p>
              <p class="row-content">本期票据:{{billCountData.invoicelist[0].zsl || 0}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="sa-row-right">
            金额:{{billCountData.invoicelist[0].je || 0 | forThousands}}元
          </div>
          <div class="sa-row-right">
            税额:{{billCountData.invoicelist[0].se || 0 | forThousands}}元
          </div>
          <div class="sa-row-right">
            价税合计:{{billCountData.invoicelist[0].jshj || 0 | forThousands}}元
          </div>
          <div class="vertical-line"></div>
        </el-col>
        <el-col :span="7">
          <div class="sa-row-right">
            专票:{{billCountData.invoicelist[0].zp || 0}}张
          </div>
          <div class="sa-row-right">
            普票:{{billCountData.invoicelist[0].pp || 0}}张
          </div>
          <div class="vertical-line"></div>
        </el-col>
        <el-col :span="6">
          <div class="sa-row-right">
            已签收:{{billCountData.invoicelist[0].yqs || 0}}张
          </div>
          <div class="sa-row-right">
            未签收:{{billCountData.invoicelist[0].wqs || 0}}张
          </div>
        </el-col>
      </el-row>
      <el-row class="sa-row">
        <el-col :span="4">
          <div >
            <img class="sa-img" src="../../../../../../assets/img/xxfp.png" alt="">
            <div class="sa-row-right">
              <p class="row-title">销项发票:</p>
              <p class="row-content">本期票据:{{billCountData.invoicelist[1].zsl || 0}}</p>
            </div>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="sa-row-right">
            金额:{{billCountData.invoicelist[1].je || 0 | forThousands}}元
          </div>
          <div class="sa-row-right">
            税额:{{billCountData.invoicelist[1].se || 0 | forThousands}}元
          </div>
          <div class="sa-row-right">
            价税合计:{{billCountData.invoicelist[1].jshj || 0 | forThousands}}元
          </div>
          <div class="vertical-line"></div>
        </el-col>
        <el-col :span="7">
          <div class="sa-row-right">
            专票:{{billCountData.invoicelist[1].zp || 0}}张
          </div>
          <div class="sa-row-right">
            普票:{{billCountData.invoicelist[1].pp || 0}}张
          </div>
          <div class="vertical-line"></div>
        </el-col>
        <el-col :span="6">
          <div class="sa-row-right">
            已签收:{{billCountData.invoicelist[1].yqs || 0}}张
          </div>
          <div class="sa-row-right">
            未签收:{{billCountData.invoicelist[1].wqs || 0}}张
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div class="row-title" style="margin: 10px">
          分类情况
        </div>
      </el-row>
      <el-row>
        <template>
          <el-table
            stripe
            :data="billCountData.categorylist"
            :header-cell-style="tableHeaderStyle"
            style="width: 100%">
            <el-table-column
              prop="categoryname"
              label="分类"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="zsl"
              align="center"
              label="票据总量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="ckd"
              align="center"
              label="出库单">
            </el-table-column>

            <el-table-column
              prop="rkd"
              align="center"
              label="入库单">
            </el-table-column>

            <el-table-column
              prop="zckp"
              align="center"
              label="资产卡片">
            </el-table-column>

            <el-table-column
              prop="yzz"
              align="center"
              label="已做账票据">
            </el-table-column>

            <el-table-column
              prop="wzz"
              align="center"
              label="未做账票据">
            </el-table-column>
          </el-table>
        </template>
      </el-row>
      <el-dialog id="table-item-data" append-to-body title="票据详情"  :visible.sync="showItemData">
        <el-table height="360" :data="itemDataList" stripe>
          <el-table-column
            prop="webid"
            align="center"
            label="图片ID">
          </el-table-column>
          <el-table-column
            prop="billdm"
            align="center"
            label="发票代码">
          </el-table-column>
          <el-table-column
            prop="billhm"
            align="center"
            label="发票号码">
          </el-table-column>
          <el-table-column
            prop="uploadperiod"
            align="center"
            label="上传期间">
          </el-table-column>
          <el-table-column
            prop="nowperiod"
            align="center"
            label="当前期间">
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
</template>
<script>
import {postAxios} from '@/libs/axios'

export default {
  name: 'statisticalAnalysis',
  data () {
    return {
      showItemData: false,
      itemDataList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < new Date(top.SYSTEM ? (top.SYSTEM.jzdate.split('-')[0] + '-' + top.SYSTEM.jzdate.split('-')[1]) : '')
        }
      },
      period: this.$parent.$parent.searchData.period,
      billCountData: {},
      tableHeaderStyle: {
        background: '#fff',
        color: '#000',
        fontWeight: '600'
      }
    }
  },
  created () {
  },
  methods: {
    getItemData (flag) {
      this.showItemData = true

      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, .3)'
      })
      postAxios('/zncs/workbench/queryIntertemporal', {
        period: this.period,
        flag: flag
      }).then(res => {
        loading.close()
        if (res.success) {
          this.itemDataList = res.rows
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    paramChange (e) {
      if (e) {
        this.period = e
        this.getData()
      }
    },
    getData () {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      postAxios('/zncs/workbench/queryBillCount', {
        period: this.period
      }).then(res => {
        loading.close()
        if (res.success) {
          this.billCountData = res.rows[0]
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>
  #table-item-data .el-dialog .el-dialog__body {
    padding: 0!important;
  }
  #table-item-data .el-dialog__header {
    /* background: rgb(51, 158, 215); */
  }
  /* #table-item-data .el-icon-close:before {
    color: white;
    font-size: 20px;
  } */
</style>
<style scoped>

  .statistical-analysis-panel {
    text-align: left;
    margin: -30px -20px;
  }
  .row-title {
    vertical-align: middle;
    font-size: 16px;
    font-weight: 600;
    text-align: left;
  }
  .row-content {
    vertical-align: middle;
    text-align: left;
  }
  .sa-row {
    vertical-align: middle;
    padding: 30px 20px;
  }
  .sa-img {
    display: inline-block;
    vertical-align: middle;
  }
  .sa-row-right {
    margin-left: 38px;
    display: inline-block;
    vertical-align: middle;
    height: 48px;
    line-height: 48px;
  }
  .sa-row-right p {
    line-height: 25px;
  }
  .sa-row {
    border-bottom: 3px solid #EBEBEB;
  }
  .vertical-line {
    height: 30px;
    margin-top: 8px;
    width: 1px;
    border-left: 3px solid #EBEBEB;
    display: inline-block;
    vertical-align: middle;
    float: right;
  }
</style>
