<template>
  <div>
    <el-dialog :title="xm"  :visible.sync="visible"  width="300px">
      <span style="display: none">{{xm}}</span>
      <p style="margin-top:10px;" v-if="source === 'jysjfx'" id ="jysjfx_set">
        <label>区间：</label>
        <el-input-number style="width: 80px;text-align: right;"
                         class="percent-number"
                         size="small" :precision="2"  :controls="false"
                         v-model="min" placeholder="请输入内容">
        </el-input-number>
        <label>~</label>
        <el-input-number style="width: 80px;text-align: right;"
                         class="percent-number"
                         size="small" :precision="2"  :controls="false"
                         v-model="max" placeholder="请输入内容">
        </el-input-number>
      </p>
      <p style="margin-top:10px;" v-if="source === 'xgmzb'" id ="xgmzb_set">
        <label>预警值：</label>
        <el-input-number style="width: 160px;text-align: right;"
                         size="small" :precision="2"  :controls="false"
                         v-model="yjz" placeholder="请输入内容">
        </el-input-number>
      </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveSet">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'setdialog',
  data () {
    return {
      xm: null,
      min: null,
      max: null,
      yjz: null,
      corp: '',
      source: '',
      visible: false
    }
  },
  props: {
  },
  methods: {
    show (xm, min, max, yjz, source, corp) {
      this.xm = xm
      this.min = min
      this.max = max
      this.yjz = yjz
      this.source = source
      this.corp = corp
      this.visible = true
    },
    saveSet () {
      const param = {
        corp: this.corp,
        xm: this.xm,
        max: this.source === 'jysjfx' ? this.max : this.yjz,
        min: this.min
      }
      this.$api.qmgzbg.saveSet(param).then(result => {
        if (result.success === true) {
          this.visible = false
          this.$emit('reflesh')
        } else {
        }
      }).catch(e => {
      })
    }
  }
}
</script>

<style scoped>

</style>
