<template>
  <div>
    <!--导出对话框-->
    <el-dialog title="导出" :visible.sync="exceldilogvisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               width="20%">
      <el-dialog
        width="40%"
        title="操作说明"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <div class="qzkh-mian" style="height: 400px; width: 100%;">
          <dl class="qzkh-dl">
            <dt class="qzkh-A">
              一、导出文件包含资产负债表、利润表和现金流量表，可直接导入税局系统；支持按月、季导出，导出季报时请切换到3、6、9、12月份；
            </dt>
          </dl>
          <dl class="qzkh-dl images"  v-viewer>
            <dt class="qzkh-A">
              二、北京、广西、海南、河北、湖北、江苏、青岛、山东、深圳、重庆十个地区请参考如下“网页导入”；河南、上海、浙江三个地区请参考如下“下载客户端导入”。
            </dt>
            <dd>
              1、网页导入：<br/>
              &nbsp;&nbsp;（1）登录大账房在线会计财务报表资产负债表页面，点击“导出”-“税局格式”，选择“导出地区”和“期间类型”，导出申报属期的财务报表文件；<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[0]"><br/>
              &nbsp;&nbsp;（2）登录网上税务局，进入财务报表填写界面，点击“导入申报表”功能按钮；<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[1]"><br/>
              &nbsp;&nbsp;（3）通过“导入申报表”功能，导入从在线会计导出的文件，网上税务局自动读取文件中的内容自动带到申报页面；<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[2]"><br/>
              &nbsp;&nbsp;（4）确认数据无误，点击“确认发送”，网上税务局对导入的数据再次进行校验，系统校验无误才能成功提交申报表，校验不通过则提示不通过的栏次，修改后可再次导入；<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[3]"><br/>
              &nbsp;&nbsp;（5）申报之后，返回主页，查看财报申报状态。<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[4]"><br/>
            </dd>
            <dd>
              2、下载客户端导入：<br/>
              &nbsp;&nbsp;（1）登录大账房在线会计财务报表资产负债表页面，点击“导出”-“税局格式”，选择“导出地区”和“期间类型”，导出申报属期的财务报表文件；<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[5]"><br/>
              &nbsp;&nbsp;（2）从税局下载安装数据转换客户端；<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[6]"><br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[7]"><br/>
              &nbsp;&nbsp;（3）打开财报数据转换客户端进行数据转换，按操作说明，导入从在线会计导出的文件，点击“保存”后，点击“上传至电子税务局”。<br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[8]"><br/>
              &nbsp;&nbsp;<img alt="总体优化" style="cursor: pointer" class="logimg" :src="srcList[9]"><br/>
            </dd>
          </dl>
        </div>
      </el-dialog>
    <el-form ref="excelExportFormData" v-show="!isSj">
      <el-form-item label="导出选择" >
        <el-select v-model ="excelExportFormData.excelsel">
          <el-option
            v-for="item in exceloptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
      <el-form ref="excelExportSjFormData" v-show="isSj"  label-width="70px">
        <el-form-item label="导出地区" >
          <el-select v-model ="excelExportSjFormData.areaType">
            <el-option
              v-for="item in areaTypeRange"
              :key="item.id"
              :label="item.text"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="期间类型" >
          <el-select v-model ="excelExportSjFormData.qjlx">
            <el-option
              v-for="item in qjlxRange"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align: right; padding-right: 30px">
        <a style="cursor: pointer;text-decoration: underline" @click="innerVisible=true">操作说明</a>
      </div>
    <span slot="footer" class="dialog-footer">
            <el-button @click="exceldilogvisible = false">取消</el-button>
            <el-button type="primary" @click="confirmExcelExport">确定</el-button>
          </span>
  </el-dialog>
  </div>
</template>

<script>
import { KJ2007_AREA, KJ2013_AREA } from '@/constants'
export default {
  name: 'exceldialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Boolean,
      default: false
    },
    corpType: {
      type: String,
      default: ''
    },
    isQua: {
      type: Boolean,
      default: false
    },
    isEn: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isQua (val) {
      if (val) {
        this.excelExportSjFormData.qjlx = '1'
      } else {
        this.excelExportSjFormData.qjlx = '0'
      }
    },
    isEn (val) {
      if (val) {
        this.excelExportFormData.excelsel = '0' // 英文版只能是按月导出
      }
    }
  },
  computed: {
    exceloptions () {
      if (!this.isEn) {
        return [{
          value: '0',
          label: '当前月份EXCEL格式'
        }, {
          value: '1',
          label: '当前年度EXCEL格式'
        }]
      } else { // 英文版的只支持当前月
        return [{
          value: '0',
          label: '当前月份EXCEL格式'
        }]
      }
    },
    exceldilogvisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    isSj () {
      return this.type
    },
    areaTypeRange () {
      if (this.corpType === '00000100AA10000000000BMF') {
        return KJ2007_AREA
      } else if (this.corpType === '00000100AA10000000000BMD') {
        return KJ2013_AREA
      }
      return []
    },
    qjlxRange () {
      return [
        {value: '0', label: '月份'},
        {value: '1', label: '季份'}
      ]
    }
  },
  data () {
    return {
      innerVisible: false,
      excelExportSjFormData: {
        areaType: '0',
        qjlx: '0'
      },
      excelExportFormData: {
        excelsel: '0'
      },
      images: [
        'image001.png',
        'image002.png',
        'image003.png',
        'image004.png',
        'image005.png',
        'image006.png',
        'image007.png',
        'image008.png',
        'image009.png',
        'image010.png'
      ],
      srcList: [
        require('@/assets/image/image001.png'),
        require('@/assets/image/image002.png'),
        require('@/assets/image/image003.png'),
        require('@/assets/image/image004.png'),
        require('@/assets/image/image005.png'),
        require('@/assets/image/image006.png'),
        require('@/assets/image/image007.png'),
        require('@/assets/image/image008.png'),
        require('@/assets/image/image009.png'),
        require('@/assets/image/image010.png')
      ]
    }
  },
  methods: {
    // 导出
    excelexport () {
      this.exceldilogvisible = true
    },
    // 确认导出
    confirmExcelExport () {
      this.$emit('confirmExcelExport', this.isSj ? this.excelExportSjFormData : this.excelExportFormData)
      this.exceldilogvisible = true
    }
  }
}
</script>

<style scoped>
  a:hover{
    text-decoration:underline;color:blue;
  }

  dd{
    margin-left: 30px;
    margin-right: 40px;
  }

  .h30 strong{
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  >>>.el-dialog__body {
    padding: 11px 20px 11px 20px;
    overflow-y: auto;
  }
  .qijian_box .s{
    left:113px;
  }
  .qzkh-mian{/* width: 60%; */ margin: 0 auto; border-radius: 6px;}
  .qzkh-top{height: 50px;background: #1b8cf2;line-height: 50px;color: #FFF;text-indent:16px;border-radius: 6px 6px 0px 0px;}
  .qzkh-A{color:black;margin:8px 0px 8px 16px; margin-left: 30px; margin-right: 30px; margin-top: 20px; font-size: 14px}
  .qzkh-dl dd{line-height: 26px;  margin-left: 36px; font-size: 14px}
  .qzkh-B{margin-left: 150px; font-size: 14px}
</style>
