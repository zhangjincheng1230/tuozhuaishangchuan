<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"
  >
    <div v-if="openImgs">
      <header style="position: relative;width: 100%">
        <el-form
          :inline="true"
          @submit.native.prevent
          class="form-inline"
          label-width="100px"
          style="height:45px;padding-top: 12px;"
        >
          <el-form-item
            v-if="IsShowDate"
            label="期间:"
            size="small"
            label-width="50px"
            style="float: left; margin-left:14px; "
          >
            <el-input
              placeholder="请选择日期"
              v-popover:popover
              suffix-icon="el-icon-arrow-down"
              v-model="dateTime"
            ></el-input>
          </el-form-item>
          <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
            <h4>图片查询</h4>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span style="margin-left:14px;">公司：</span>
              <div
                class="demo-input-suffix"
                @click="CompeData"
                style="width:70%; margin-right:15px;"
              >
                <el-select
                  v-model="valueda"
                  filterable
                  placeholder="请选择公司"
                  style="width:100%; margin-right:15px;"
                >
                  <el-option
                    v-for="item in optionsval"
                    :key="item.pk_gs"
                    :label="item.uname"
                    :value="item.pk_gs"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span style="margin-left:14px;">状态：</span>
              <el-select
                v-model="optionsVal"
                placeholder="请选择"
                style="width:70%; margin-right:15px;"
              >
                <el-option
                  v-for="item in optionsValue"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span>
                <el-radio v-model="radio" label="serSc">入账日期</el-radio>：
              </span>
              <el-date-picker
                v-model="valueDate"
                type="daterange"
                unlink-panels
                :clearable="false"
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                value-format="yyyy-MM-dd"
                :picker-options="monthPickerOptions"
                style="width:70%; margin-right:15px;"
                @change="ase"
              >></el-date-picker>
            </div>
            <div
              style="width: 96%; height: 50px; margin: 0 auto;line-height:45px; display:flex; justify-content: space-between"
            >
              <span>
                <el-radio v-model="radio" label="serRz">上传日期：</el-radio>
              </span>
              <el-date-picker
                v-model="valueDates"
                :clearable="false"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                value-format="yyyy-MM-dd"
                :picker-options="monthPickerOptions"
                style="width:70%; margin-right:15px;"
                 @change="ases"
              >></el-date-picker>
            </div>
            <div style="text-align: right;margin-top: 12px">
              <el-button @click="openold">取 消</el-button>
              <el-button type="primary" @click="addpacruse">确 定</el-button>
            </div>
          </el-popover>
          <el-form-item label="公司:" size="small" label-width="50px" style="float: left">
            <span>{{pkname.uname}}</span>
          </el-form-item>
          <!-- </el-form-item> -->
          <el-row style="float:right;margin-right:14px" size="small">
            <el-button @click="rafhs">刷新</el-button>
          </el-row>
        </el-form>
      </header>
      <div class="contents">
        <div class="contes" style="width:100%; height:50px; line-height:50px;">
          <span @click="addImg">共收取票据：{{allphoto||0}}张</span>
          <span @click="yizuozhang">已做账：{{yizizhang||0}}张</span>
          <span @click="weizuozhangs">未做账：{{weizuozhang||0}}张</span>
          <span @click="yizuofeis">已作废：{{yizuofei||0}}张</span>
          <span @click="shibiezhongs">识别中：{{shibiezhong||0}}张</span>
        </div>
      </div>
    </div>
    <Tpyls v-if="openImg" :listData="listData" :numa="numa" :timedata="dateTime" :radio="radio" :pkname='pkname'></Tpyls>
  </div>
</template>

<script>
import * as MsgUtil from '../msg-util'
import { getMonthBegin, getMonthEnd } from '@/utils'
import Header from '../components/Header'
import Tpyls from './components/tpyls'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'tpyl',
  mixins: [datePickerMixin],
  components: {
    Header,
    Tpyls
  },

  data () {
    // const loginPeriod = this.$store.getters.getLoginDate
    // console.log(loginPeriod)
    return {
      IsShowDate: true,
      visiblePopover: false,
      dateTime: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      optionsval: this.$store.getters.corps,
      valueda: this.$store.getters.currentCorp.pk_gs,
      dialogVisible: false,
      openImg: false,
      openImgs: true,
      logins: 1,
      lists: {},
      optionsVal: 0,
      radio: 'serSc',
      startDate: '',
      valueDate: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      valueDates: [getMonthBegin(this.$store.getters.getLoginDate), getMonthEnd(this.$store.getters.getLoginDate)],
      begindate2: '',
      enddate2: '',
      endDate: '',
      optionsValue: [
        {
          id: 0,
          label: '全部'
        }, {
          id: 4,
          label: '已做账'
        }, {
          id: 10,
          label: '未做帐'
        }, {
          id: 16,
          label: '已作废'
        }, {
          id: 18,
          label: '识别中'
        }],
      serDays: {},
      serDays1: {
        beginDate: getMonthBegin(this.$store.getters.getLoginDate),
        endDate: getMonthEnd(this.$store.getters.getLoginDate)
      },
      headform: true,
      listData: [],
      vas: false,
      allphoto: '',
      yizizhang: '',
      weizuozhang: '',
      yizuofei: '',
      shibiezhong: '',
      numa: null,
      time: '',
      pickerOptions: this.datePicker(),
      pkname: ''
    }
  },
  methods: {
    ase () {
      this.radio = 'serSc'
    },
    ases () {
      this.radio = 'serRz'
    },
    rafhs () {
      this.piaoju()
      this.gettime()
    },
    yizuofeis () {
      this.getaddpacruse(16)
      this.numa = 16
      this.openImgsae = false
    },
    weizuozhangs () {
      this.getaddpacruse(10)
      this.numa = 10
    },
    shibiezhongs () {
      this.getaddpacruse(18)
      this.numa = 18
    },
    yizuozhang () {
      this.getaddpacruse(4)
      this.numa = 4

      // console.log(this.listData, 'aaa')
    },
    gettime () {
      this.time = ''
      if (this.radio === 'serSc') {
        this.time = this.valueDate[0] + '~' + this.valueDate[1]
      } else if (this.radio === 'serRz') {
        this.time = this.valueDates[0] + '~' + this.valueDates[1]
      } else {
        this.time = this.rdate
      }

      this.dateTime = this.time
    },
    openold () {
      this.visiblePopover = false
    },
    CompeData () {
      this.dialogVisible = true
    },
    addImg () {
      this.addpacruse(0)
      this.numa = 0
    },
    piaoju () {
      const loading = MsgUtil.loading(this, '正在載入...')
      this.$api.linkAssets.getpiaoju({
        pk_corp: this.valueda,
        ...this.serDays1,
        serdate: this.radio
      }).then(res => {
        loading.close()
        if (res.success) {
          this.allphoto = res.rows.total
          this.yizizhang = res.rows.vouchertotal
          this.weizuozhang = res.rows.unvoucher
          this.yizuofei = res.rows.invalidTotal
          this.shibiezhong = res.rows.processTotal
        }
      })
    },

    addpacruse () {
      this.gettime()
      this.pkname = this.optionsval.find(item => {
        return item.pk_gs === this.valueda
      })
      const loading = MsgUtil.loading(this, '正在載入...')

      if (this.radio === 'serSc') {
        this.serDays = JSON.parse(JSON.stringify({
          begindate: this.valueDate[0],
          enddate: this.valueDate[1]
        }))
        this.serDays1 = {
          beginDate: this.valueDate[0],
          endDate: this.valueDate[1]
        }
      } else if (this.radio === 'serRz') {
        this.serDays = JSON.parse(JSON.stringify({
          begindate2: this.valueDates[0],
          enddate2: this.valueDates[1]
        }))
        this.serDays1 = {
          beginDate: this.valueDates[0],
          endDate: this.valueDates[1]
        }
      }
      this.$api.linkAssets.getphoto({
        serdate: this.radio,
        pk_corp: this.valueda,
        pic_status: this.optionsVal,
        ...this.serDays

      }).then(res => {
        this.piaoju()
        loading.close()
        this.headform = true
        if (res.success) {
          this.listData = res.rows
          this.openold()
          if (res.msg) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }

          if (this.optionsVal === 4 || this.optionsVal === 18 || this.optionsVal === 10 || this.optionsVal === 16 || this.optionsVal === 0) {
            this.openImg = true
            this.openImgs = false
          }
        } else {
          if (res.msg) {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        }
      })
    },
    getaddpacruse (vals) {
      this.gettime()
      const loading = MsgUtil.loading(this, '正在載入...')
      if (this.radio === 'serSc') {
        this.serDays = JSON.parse(JSON.stringify({
          begindate: this.valueDate[0],
          enddate: this.valueDate[1]
        }))
      } else if (this.radio === 'serRz') {
        this.serDays = JSON.parse(JSON.stringify({
          begindate2: this.valueDates[0],
          enddate2: this.valueDates[1]
        }))
      }

      this.$api.linkAssets.getphoto({

        serdate: this.radio,
        pk_corp: this.valueda,
        pic_status: vals,
        ...this.serDays

      }).then(res => {
        loading.close()
        this.piaoju()
        this.headform = true
        console.log(res)
        if (res.success) {
          this.listData = res.rows
          this.openold()
          if (res.msg) {
            this.$message({
              type: 'success',
              message: res.msg
            })
          }

          if (vals === 4 || vals === 18 || vals === 10 || vals === 16 || vals === 0) {
            this.openImg = true
            this.openImgs = false
          } else if (this.optionsVal === 4 || this.optionsVal === 18 || this.optionsVal === 10 || this.optionsVal === 16 || this.optionsVal === 0) {
            this.openImg = true
            this.openImgs = false
          }
        } else {
          if (res.msg) {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
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
    openset () {
      this.$bus.$on('openset', (datas) => {
        this.openImgs = true

        this.openImg = datas
      })
    }
  },
  created () {
    this.$bus.$on('openCompe', (openCompe) => {
      this.openCompe = openCompe
    })
    this.$bus.$on('data', (data) => {
      this.lists = data
      // console.log(this.list)
      this.openCompe = this.lists.backup
    })

    this.openset()
    this.piaoju()
  },
  mounted () {
    this.gettime()
    this.pkname = this.optionsval.find(item => {
      return item.pk_gs === this.valueda
    })
  }
}
</script>

<style lang="less" scoped>
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}
.contes {
  width: 100%;
  height: 50px;
  line-height: 50px;
  span {
    margin-left: 25px;
  }
}
</style>
