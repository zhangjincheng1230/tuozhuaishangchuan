<template>
  <div>
    <el-dialog
      class="adjust"
      title="使用年限调整"
      :visible.sync="visible"
      width="20%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      @close="dialogclose">
      <el-form ref="formRef" :model="form"  :inline="true">
        <el-row>
          <el-form-item size="mini" label="原预计使用年限:" label-width="150">
            {{currrow.ulimit}} 月
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="月折旧:" label-width="80">
            {{currrow.nmzj}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item size="mini" label="已使用年限:" label-width="110">
            {{currrow.depperiod}} 月
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="adjustmonth" size="mini" label="调整使用年限为:" label-width="140">
            <el-input-number v-model="form.adjustmonth" :controls = "false" value="number" style="width: 120px"></el-input-number> 月
            <el-button size="mini" type="primary" @click="count">计算</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="newnmzj" size="mini" label="月折旧:" label-width="80">
            {{form.newnmzj | forThousands}}
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog__footer">
        <el-button type="primary" @click="confirmAdjust">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {accAdd, accDiv, accMul, accSubtr} from '@/utils'
export default {
  name: 'adjustDialog',
  data () {
    return {
      visible: false,
      form: {
        adjustmonth: 0,
        newnmzj: 0
      },
      newnmzj: 0 // 新折旧
    }
  },
  props: {
    currrow: {
      type: Object,
      default: function () {
        return {}
      }
    } // 当前选中行
  },
  watch: {
  },
  created () {
  },
  components: {
  },
  computed: {
  },
  methods: {
    show () {
      this.visible = true
    },
    // 计算
    count () {
      let newzj = 0
      if (this.currrow.zjtype === 0) { // 评价年限法
        newzj = this.calcYzj()
      } else if (this.currrow.zjtype === 2) { // 双倍
        newzj = this.calcYzj2()
      }
      this.form.newnmzj = newzj
    },
    calcYzj () {
      let sub = accSubtr(this.form.adjustmonth, this.currrow.depperiod)
      if (this.form.adjustmonth === 0 || sub === 0) {
        return 0
      }
      // 原值- 预估残值
      let submny = accSubtr(this.currrow.atmny, this.currrow.ygcz)
      // submny - 总累计折旧
      let submny1 = accSubtr(submny, this.currrow.depation)
      // 原值- 预估残值 - 期初折旧值 / 预计使用年限 - 期初月份
      return accDiv(submny1, sub)
    },
    // 双倍余额计算
    calcYzj2 () {
      let atmny = this.currrow.atmny
      let adjustmonth = this.form.adjustmonth
      let ygcz = this.currrow.ygcz
      let HalfUlimit = accDiv(2, adjustmonth)
      // 还是以原先的10位有效数字进行运算
      let depation = this.currrow.depation
      let depperiod = this.currrow.depperiod
      let sss = accSubtr(adjustmonth, depperiod)
      let submny = accSubtr(atmny, depation)
      if (adjustmonth === 0 || sss <= 0) {
        return 0
      }
      if (sss > 24) {
        let nmzj = accMul(submny, HalfUlimit)
        return nmzj
      } else {
        let subresult = accSubtr(submny, ygcz)
        let nmzj1 = accDiv(subresult, sss)
        return nmzj1
      }
    },
    // 确定
    confirmAdjust () {
      if (this.form.adjustmonth <= 0) {
        this.$message({showClose: true, message: '调整年限不能小于等于0', type: 'warning'})
        return
      }

      if (this.form.adjustmonth <= this.form.depperiod) {
        this.$message({showClose: true, message: '调整年限应大于已使用年限', type: 'warning'})
        return
      }

      const param = {
        id: this.currrow.id_assetcard,
        assetcode: this.currrow.ascode,
        newlimit: this.form.adjustmonth
      }
      this.$api.assetsCard.adjusts(param).then(result => {
        if (result.success) {
          this.$message({showClose: true, message: result.msg, type: 'success'})
          this.visible = false
          this.$emit('loadtableList', -1)
        } else {
          this.$message({showClose: true, message: result.msg, type: 'warning'})
        }
      }).catch(e => {
      })
    },
    dialogclose () {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
