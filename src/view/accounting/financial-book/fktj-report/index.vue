<template>
  <div class="app-main">
    <div v-show="!info" class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div>期间：
            <el-popover
              placement="bottom-start"
              title="辅助余额表查询"
              width="450"
              popper-class="query-popover"
              v-model="queryVisible">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.periodRange"
                    type="daterange"
                    unlink-panels
                    :picker-options="pickerOptions"
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    style="width: 315px">
                  </el-date-picker>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button @click="queryVisible = false">取消</el-button>
                  <el-button type="primary" @click="query">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                            {{queryForm.periodRange[0]}} - {{queryForm.periodRange[1]}}
                <i :class="queryVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="el-icon--right"></i>
              </span>
            </el-popover>
          </div>
        </div>
        <div class="kj-button-group">
          <el-button @click="save">立即体检</el-button>
          <el-button @click="reflesh">刷新</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            highlight-current-row
            stripe
            border
            height="100%"
            style="width: 100%"
          >
            <el-table-column
              property="qj"
              label="期间"
              header-align="center"
              align="center"
              width="320"
            ></el-table-column>
            <el-table-column
              property="hy"
              label="行业"
              header-align="center"
              align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              property="idate"
              label="体检时间"
              header-align="center"
              align="center"
              width="180"
            ></el-table-column>
            <el-table-column
              label="体检报告"
              header-align="center"
              align="center"
              width="180"
            >
              <template slot-scope="{row}">
                <span class="link-type" @click="seachTjbg(row)">查看</span>
              </template>

            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div v-show="info" class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <el-button @click="history">返回</el-button>
        </div>
        <div class="kj-button-group">
          <el-button @click="refleshInfo">报告首页</el-button>
          <el-dropdown placement="bottom" v-show="yczbx && yczbx.length > 0">
            <el-button>
              异常指标项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="changeZb(v)" :key="index" v-for="(v, index) in yczbx">{{v}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown placement="bottom" v-show="wfjs && wfjs.length > 0">
            <el-button>
              无法计算项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="changeZb(v)" :key="index" v-for="(v,index) in wfjs">{{v}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown v-show="zczb && zczb.length > 0">
            <el-button>
              正常指标项<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="changeZb(v)" :key="index" v-for="(v,index) in zczb">{{v}}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="kj-main" style="overflow: hidden">
        <div class="inner-container" v-show="issy">
          <div class="reportTitle">
            大账房税控报告
          </div>
          <div class="linetips">
            <span>期间：{{idate.substr(0,7)}}~{{idate.substr(0,7)}}</span>
            <span>行业：其他综合零售</span>
          </div>
          <div class="reportInstructions">
            <h2>报告说明</h2>
            <div>
              <h4>1.涉税风险评估</h4>
              <p>税务局按照指标体系对企业进行税务风险评分，划分风险等级，要求风险等级高的企业说明风险原因，是否存在偷税漏税的行为。</p>
            </div>
            <div>
              <h4>2.防范与应对</h4>
              <p>企业在报税前检测。实现税务风险预警，从而能提早进行风险防范与应对。</p>
            </div>
            <div>
              <h4>3.纳税情况描述</h4>
              <p>每个月报告企业的纳税额（增值税和企业所得税）,通过企业税负率和行业税负率的比较，给出税负合理性 。</p>
            </div>
          </div>
          <h2 class="canvasChat">纳税情况综述</h2>
          <div class="cavas_cont" id="cavas_cont">
            <div style="width:49%;position: relative;overflow:hidden;margin-right:1%;">
              <h3>增值税</h3>
              <div class="VATtip">{{zzs.msg}}</div>
              <div id="VATchart" style="height:300px;"></div>
              <!--              <div class="trggleyear" style="display: none">-->
              <!--                <div class="yearleft" onclick="yearleft()">-->
              <!--                  <a>&lt;</a>-->
              <!--                </div>-->
              <!--                <div class="yearcenter">2018年</div>-->
              <!--                <div class="yearright" onclick="yearright()">-->
              <!--                  <a>&gt;</a>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
            <div style="width:49%;position:relative;overflow:hidden;margin-right:1%;">
              <h3>企业所得税</h3>
              <div class="TAXtip">{{sds.msg}}</div>
              <div id="enterpriseTAX" style="height:300px;">

              </div>
              <!--              <div class="trgglequarter" style="display: none">-->
              <!--                <div class="quarterleft" onclick="quarterleft()">-->
              <!--                  <a>&lt;</a>-->
              <!--                </div>-->
              <!--                <div class="quartercenter">2018年</div>-->
              <!--                <div class="quarterright" onclick="quarterright()">-->
              <!--                  <a>&gt;</a>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
          </div>
          <h2 class="resultdetail">指标检测结果详情</h2>
          <el-table
            :data="tableDataInfo"
            stripe
            :cell-style="cellStyle"
            style="width: 100%">
            <el-table-column
              prop="zbmc"
              header-align="center"
              align="left"
              label="指标名称"
              min-width="48%">
            </el-table-column>
            <el-table-column
              prop="fxstr"
              label="风险"
              align="left"
              header-align="center"
              min-width="16%">
            </el-table-column>
            <el-table-column
              prop="jystr"
              header-align="center"
              align="left"
              min-width="36%"
              label="建议">
            </el-table-column>
          </el-table>
        </div>
        <div id="card-detail" class="inner-container" v-show="!issy">
          <h2>指标名称：<span>{{currentZb.zbmc}}</span></h2>
          <p class="errTip"><img src="@/assets/img/warning.png">如因疏忽导致的异常，请尽快调整账目；如因经营环境变化所致，请备好证据链备查。</p>
          <el-table
            :data="currentZb.fktjbgbvos"
            stripe
            style="width: 100%">
            <el-table-column
              prop="name"
              header-align="center"
              align="left"
              label="科目名称"
              min-width="48%">
            </el-table-column>
            <el-table-column
              prop="bq"
              label="本期/元"
              align="right"
              header-align="center"
              min-width="16%">
            </el-table-column>
            <el-table-column
              prop="sq"
              header-align="center"
              align="right"
              min-width="36%"
              label="上期/元">
            </el-table-column>
          </el-table>
          <h3>分析结果</h3>
          <div class="analysis" style="text-indent:1em">
            {{currentZb.fxjg}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'fktj-report',
  mixins: [datePickerMixin],
  data () {
    return {
      info: false,
      queryForm: {
        periodRange: [formatDate(new Date().setDate(new Date().getDate() - 7)), formatDate(new Date())]
      },
      queryVisible: false,
      queryParam: {

      },
      tableData: [],
      issy: true,
      tableDataInfo: [],
      zczb: [],
      yczbx: [],
      wfjs: [],
      zzs: {},
      sds: {},
      currentZb: {},
      idate: '',
      zzsChart: null,
      sdsChart: null
    }
  },
  created () {
    this.query()
  },
  computed: {
    zzs1 () {
      return this.zzs.rows.map(v => {
        return parseFloat(v.yysr.replace(/,/g, ''))
      })
    },
    zzs2 () {
      return this.zzs.rows.map(v => {
        return parseFloat(v.zzs.replace(/,/g, ''))
      })
    },
    sds1 () {
      return this.sds.rows.map(v => v.jdsf.replace('%', ''))
    },
    sds2 () {
      return this.sds.rows.map(v => v.ljsf.replace('%', ''))
    }
  },
  methods: {
    query () {
      this.$api.fktjbg.query(this.getQueryParam()).then(result => {
        if (result.success) {
          this.queryVisible = false
          this.tableData = result.rows
          this.$message({
            message: '查询成功',
            type: 'success'
          })
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    save () {
      this.$confirm('您是否授权企业服务平台对您所选公司进行风控体检？我们仅对您的数据进行计算，且只用于风控体检，不涉及公司名称及联系人电话等敏感信息。请您放心使用。', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        title: '提示',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          this.$api.fktjbg.save().then(result => {
            if (result.success) {
              this.query()
            } else {
              this.$message.error(result.msg)
            }
          })
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
          })
        })
    },
    getQueryParam () {
      this.queryParam.begindate = this.queryForm.periodRange[0]
      this.queryParam.enddate = this.queryForm.periodRange[1]
      return this.queryParam
    },
    seachTjbg (row) {
      this.issy = true
      this.tableDataInfo = []
      this.zczb = []
      this.yczbx = []
      this.wfjs = []
      this.zzs = {}
      this.sds = {}
      this.currentZb = {}
      this.info = true
      this.idate = row.qj.substring(8) + '-01'
      this.queryZzs(this.idate)
      this.queryFktj(this.idate)
      this.querySds(this.idate)
    },
    reflesh () {
      this.query()
    },
    cellStyle ({ row, column}) {
      if (column.property === 'fxstr') {
        if (row.fxstr === '未知') {
          return 'color:#ffbd2e'
        }
        if (row.fxstr === '极低') {
          return 'color:#28ca42'
        }
        if (row.fxstr === '爆表') {
          return 'color:#ff6158'
        }
      }
    },
    refleshInfo () {
      this.issy = true
      this.queryZzs(this.idate)
      this.queryFktj(this.idate)
      this.querySds(this.idate)
      this.$message({
        message: '刷新成功',
        type: 'success'
      })
    },
    history () {
      this.info = false
    },
    queryFktj (idate) {
      this.$api.fktjbg.queryFktj({idate: idate}).then(result => {
        if (result.success) {
          this.tableDataInfo = result.rows
          this.zczb = result.data.zczb
          this.yczbx = result.data.yczbx
          this.wfjs = result.data.wfjs
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    changeZb (v) {
      this.issy = false
      this.currentZb = this.tableDataInfo.find(obj => obj.zbmc === v)
    },
    queryZzs (idate) {
      if (this.zzsChart !== null) {
        this.zzsChart.clear()
      }
      this.$api.fktjbg.queryZzs({idate: idate}).then(result => {
        if (result.success) {
          this.zzs = result
          this.drawZzsChart()
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    drawZzsChart () {
      let _this = this
      this.zzsChart = this.$echarts.init(document.getElementById('VATchart'))
      let option = {
        backgroundColor: '#eee',
        title: {
          x: 'center',
          y: '20px',
          subtext: '注: 税负 = 应缴纳的增值税 / 主营业务收入净发生率*100%',
          subtextStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var relVal = params[0].name
            let obj = _this.zzs.rows.find(v => v.month === params[0].name)
            for (var i = 0; i < params.length; i++) {
              relVal += '<br/>' + params[i].seriesName + ':' + params[i].value
            }
            relVal += '<br/>税负:' + obj.sf
            return relVal
          }
        },
        legend: {
          data: ['主营业务收入净发生额', '应缴纳的增值税']
        },
        xAxis: {
          name: '月份',
          silent: false,
          type: 'category',
          axisLine: {onZero: true},
          nameTextStyle: {
            color: '#B9B9B9'
          },
          axisTick: {
            show: true
          },
          data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '主营业务收入净发生额',
            type: 'bar',
            stack: 'one',
            data: this.zzs1
          },
          {
            name: '应缴纳的增值税',
            type: 'bar',
            stack: 'one',
            data: this.zzs2
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.zzsChart.setOption(option)
    },

    drawSdsChart () {
      let _this = this
      this.sdsChart = this.$echarts.init(document.getElementById('enterpriseTAX'))
      let option = {
        backgroundColor: '#eee',
        title: {
          x: 'center',
          y: '20px',
          subtext: '注: 税负 = 利润总和*25% / 营业收入*100%',
          subtextStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var relVal = params[0].name
            for (var i = 0; i < params.length; i++) {
              if (params[i].value.substr(params[i].value.length - 1, 1) === '%') {
                relVal += '<br/>' + params[i].seriesName + ':' + params[i].value
              } else {
                relVal += '<br/>' + params[i].seriesName + ':' + params[i].value + '%'
              }
            }
            relVal += '<br/>本季应缴纳的企业所得税:' + 1
            return relVal
          }
        },
        legend: {
          data: ['季度税负', '累计税负']
        },
        xAxis: {
          name: '月份',
          type: 'category',
          nameTextStyle: {
            color: '#B9B9B9'
          },
          boundaryGap: false,
          data: ['3', '6', '9', '12']
        },
        yAxis: {
          max: function (value) {
            return value.max
          },
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '季度税负',
            type: 'line',
            smooth: true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: _this.sds1
          },
          {
            name: '累计税负',
            type: 'line',
            smooth: true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: _this.sds2
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.sdsChart.setOption(option)
    },
    querySds (idate) {
      if (this.sdsChart !== null) {
        this.sdsChart.clear()
      }
      this.$api.fktjbg.querySds({idate: idate}).then(result => {
        if (result.success) {
          console.log('所得税----------------》', result)
          this.sds = result
          this.drawSdsChart()
        } else {
          this.$message.error(result.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .link-type, .link-type:focus {
    color: #337ab7;
    cursor: pointer;
  }
  .reportTitle {
    width: 100%;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    margin-top: 10px;
  }

  .linetips {
    text-align: center;
    line-height: 20px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .reportInstructions {
    width: 100%;
    background: #F6F6F6;
    padding: 6px;
    font-size: 14px;
  }

  .canvasChat, .resultdetail {
    margin-bottom: 14px;
    margin-top: 14px;
  }

  h2 {
    display: block;
    font-size: 14px;
    font-weight: bold;
  }

  h3 {
    display: block;
    font-size: 12px;
    font-weight: bold;
  }

  h4 {
    display: block;
    font-size: 12px;
    font-weight: bold;
  }

  p {
    text-indent: 10px;
    padding: 0 5px;
    margin: 0 0 -1px;
    border-bottom: 1px solid #ddd;
    height: 34px;
    line-height: 34px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cavas_cont {
    display: flex;
    width: 100%;
  }

  .cavas_cont .TAXtip, .cavas_cont .VATtip {
    width: 100%;
    padding-left: 20px;
    box-sizing: border-box;
    height: 36px;
    font-size: 12px;
  }

  .inner-container {
    position: absolute;
    left: 0;
    top: 0;
    right: -17px;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .trggleyear, .trgglequarter {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 5px;
    display: flex;
  }

  .trggleyear .yearleft, .trgglequarter .quarterleft {
    text-align: right;
    flex: 2;
  }

  .trggleyear .yearright, .trgglequarter .quarterright {
    flex: 2;
    text-align: left;
  }

  .trggleyear .yearcenter, .trgglequarter .quartercenter {
    flex: 1;
    text-align: center;
    font-size: 14px;
    font-weight: 800;
  }

  .yearleft a, .quarterleft a, .yearright a, .quarterright a {
    flex: 2;
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #0189EA;
    color: #fff;
    text-align: center;
    line-height: 16px;
  }

  a {
    cursor: pointer;
    color: #555;
    text-decoration: none;
    outline: none;
  }

  #card-detail{
    border:none;
    background:#fff;
    padding: 0 20px;
    box-sizing: border-box;
  }

  #card-detail h2{
    text-align:center;
    margin-top:20px;
    margin-bottom:20px;
  }
  #card-detail .errTip{
    text-align:center;
    border:none;
  }
  #card-detail .errTip img{
    width:16px;
    height:16px;
    display:inline-block;
    margin-right:10px;
    line-height:20px;
  }
  #card-detail h3{
    margin-bottom:12px;
  }
  #card-detail .analysis p{
    line-height:30px;
    border:none;
  }
  #card-detail .tabeldetail2{
    margin-top:24px;
    margin-bottom:24px;
  }
</style>
