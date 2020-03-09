const mixin = {
  data () {
    return {
      warningTypeList: []
    }
  },
  methods: {
    glIncomewarning () {
      this.$api.BasicSettingApi.IncomeWarning.queryIncomeWarningInfo({
        nowDate: this.$store.getters.getLoginDate,
        unjl: 'Y'
      }).then(res => {
        if (res.success) {
          if (res.rows != null && res.rows.length > 0) {
            this.warningTypeList = res.rows

            let sryjStr = '<div id="sryj_info" class="yj-scroll">'
            let sryj_data = res.rows
            let alertMsg = ''
            for (let i = 0; i < res.rows.length; i++) {
              let row = res.rows[i]
              let yjz = row.yjz || ''
              let fsTotal = row.fsTotal || ''
              let xmmc = row.xmmc || ''
              let period_type = this.getPeriodType(row.period_type)
              xmmc += '(' + period_type + ')'
              row.xmmc = xmmc
              let infoNumber1 = row.infoNumber || ''
              let infoNumber2 = row.fsTotal - row.yjz || ''
              if (row.isLoginRemind == 'Y' && row.yjz < row.fsTotal && infoNumber1 > 0) {
                alertMsg += '您的' + xmmc + '超过预警值' + this.formatMny(infoNumber2) + '元，请留意<br>'
              } else if (row.isLoginRemind == 'Y' && row.yjz < row.fsTotal && infoNumber1 <= 0) {
                alertMsg += '您的' + xmmc + '已达预警上限<br>'
              }
            }
            if (alertMsg) {
              // this.$message.defaults.width = 400;
              this.$alert('<div style="margin-left:40px">' + alertMsg + '</div>', '预警提示', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
              })
              // this.$message.defaults.width = 300;
            }
          } else {
            this.warningTypeList = [{
              xmmc: '未设置预警条目',
              fsTotal: '0.00',
              srsx: '0.00',
              infoNumber: '0.00'
            }]
          }
        }
      })
    },
    getPeriodType (period_type) {
      switch (period_type) {
        case 0:
          period_type = '月度'
          break
        case 1:
          period_type = '季度'
          break
        case 2:
          period_type = '年度'
          break
        default:
          period_type = '连续12月'
          break
      }
      return period_type
    },
    formatMny (val) {
      return this.$options.filters.forThousands(val)
    }
  }
}

export default mixin
