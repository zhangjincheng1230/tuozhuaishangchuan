<template>
  <div class="priseInfo" style="position: relative;height: 100%;border: 1px solid #ddd;background:rgba(255,255,255,1)">
    <el-form ref="formRef" :model="InfoForm" label-width="160px" :inline="true" style="width: 100%">
    <div class="titleboxStyle">
      <div class="dot"></div>
      <span class="titleFont">基本信息</span>
    </div>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="所属行业:"><strong><p class="itemp">{{InfoForm.indusname}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="公司编码:"><strong><p class="itemp">{{InfoForm.incode}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="会计制度:"><strong><p class="itemp">{{InfoForm.ctypename}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="建账日期:"><strong><p class="itemp">{{InfoForm.bdate}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="联系电话:"><strong><p class="itemp">{{InfoForm.p1}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="公司地址:"><strong><p class="itemp">{{InfoForm.postadd}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="公司类型:"><strong><p class="itemp">{{InfoForm.comptype}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="纳税人资格:"><strong><p class="itemp">{{InfoForm.chname}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="库存启用日期:"><strong><p class="itemp">{{InfoForm.icbegindate}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="成本结转类型:"><strong><p class="itemp">{{InfoForm.costforwardstyle}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="是否小型微利企业:"><strong><p class="itemp">{{InfoForm.yhzc === '0' ? '是' : '否'}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="固定资产启用日期:"><strong><p class="itemp">{{InfoForm.bb_date}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="经营范围:"><strong><p class="itemp">{{InfoForm.buscope}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="备注:"><strong><p class="itemp">{{InfoForm.demo}}</p></strong></el-form-item>
      </el-col>
    </el-row>

    <div class="titleboxStyle">
      <div class="dot"></div>
      <span class="titleFont">纳税信息</span>
    </div>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="报税地区:"><strong><p class="itemp">{{InfoForm.tax_area}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="城建税税率:"><strong><p class="itemp">{{InfoForm.cbtax * 100 | forThousands(0, true)}}%</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="纳税人识别号:"><strong><p class="itemp">{{InfoForm.ccrecode}}</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="所得税类型:"><strong><p class="itemp">{{InfoForm.sdslx}}</p></strong></el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="spanp">
        <el-form-item label="地方教育费附加:"><strong><p class="itemp">{{InfoForm.leatax * 100 | forThousands(0, true)}}%</p></strong></el-form-item>
      </el-col>
      <el-col class="spanp">
        <el-form-item label="征收方式:"><strong><p class="itemp">{{InfoForm.zsfs}}</p></strong></el-form-item>
      </el-col>
    </el-row>
<!--      <div class="titleboxStyle">-->
<!--        <div class="dot"></div>-->
<!--        <span class="titleFont">建账信息</span>-->
<!--      </div>-->
    </el-form>
  </div>
</template>

<script>
import relateDataMixin from '@/mixins/relate-data'

export default {
  name: 'enterpriseInfo',
  mixins: [ relateDataMixin ],
  data () {
    return {
      InfoForm: {
        indusname: '',
        incode: '',
        ctypename: '',
        bb_date: '',
        bdate: '',
        chname: '',
        sshy: '',
        buscope: '',
        icbegindate: '',
        tax_area: '',
        cbtax: '',
        leatax: '',
        ccrecode: '',
        comptype: '',
        costforwardstyle: '',
        zsfs: '',
        demo: ''
      },

      area_options: {},
      sdslx_options: {
        '0': '企业所得税',
        '1': '个人所得税生产经营所得'
      },
      zsfs_options: {
        0: '核定征收',
        1: '查账征收'
      },
      costforwardstyle_options: {
        0: '成本手工结转',
        1: '成本比例结转',
        2: '商贸成本结转',
        3: '工业成本结转'
      },
      comptype_options: {
        '1': '有限责任公司',
        '20': '个体工商户',
        '2': '个人独资企业',
        '3': '有限合伙企业',
        '22': '普通合伙企业',
        '21': '承包、承租经营者',
        '4': '有限责任公司(自然人独资)',
        '5': '有限责任公司(国内合资)',
        '6': '自然人有限责任公司',
        '7': '有限责任公司(自然人投资或控股)',
        '8': '有限责任公司(外商投资企业法人独资)',
        '9': '有限责任公司(台港澳法人独资)',
        '10': '有限责任公司(中外合资)',
        '11': '有限责任公司(国有独资)',
        '12': '有限责任公司(非自然人投资或控股的法人独资)',
        '13': '其他股份有限公司(非上市)',
        '14': '其他股份有限公司分公司(非上市)',
        '15': '一人有限责任公司',
        '16': '其他有限责任公司',
        '17': '其他有限责任公司(分公司)',
        '18': '全民所有制',
        '19': '其他'
      }
    }
  },
  created () {
    this.getAreaTypes()
  },
  methods: {
    getAreaTypes () {
      this.$api.BasicSettingApi.CompanySetting.queryArea({
        isbs: 'Y'
      }).then(result => {
        if (result.success) {
          result.rows.reduce((temp, row) => {
            this.area_options[row.region_id] = row.region_name
          }, [])
        }
      }).catch(e => {
      })
    },
    reFetchData () {
      this.loadDataInfo()
    },
    loadDataInfo: function () {
      this.$api.Home.enterpriseQuery({corpIds: this.$store.getters.getLoginCorpId}).then(result => {
        if (result.success && result.rows && result.rows.length > 0) {
          this.dealValue(result.rows[0])
        } else {

        }
      })
    },
    dealValue: function (row) {
      row.comptype = this.comptype_options[row.comptype]
      row.costforwardstyle = this.costforwardstyle_options[row.costforwardstyle]
      row.tax_area = this.area_options[row.tax_area]
      row.sdslx = this.sdslx_options[row.sdslx]
      row.zsfs = this.zsfs_options[row.zsfs]
      this.InfoForm = row
    }
  },
  mounted () {
    this.loadDataInfo()
  }
}
</script>

<style lang="less">
  .priseInfo{
    .titleboxStyle{
      margin: 25px 0 0 25px;
      display: inline-block;
    }
    .dot{
      width: 8px;
      height: 8px;
      background: #0c7bd5;
      border-radius: 50%;
      float: left;
      margin-top: 7px;
    }
    .titleFont{
      font-size: 16px;
      float: left;
      margin-left: 5px;
    }
    /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 5px;
    }

    .itemp{
      font-size: 12px;
      font-weight: 400;
      background: #ededed;
      color: #333;
      line-height: 32px;
      height: 32px;
      width: 320px;
      padding-left: 5px;
    }
    .spanp{
      width: 567px;
    }
  }
</style>
