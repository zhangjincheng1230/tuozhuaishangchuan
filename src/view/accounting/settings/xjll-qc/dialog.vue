<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="dialogOpen"
    @close="dialogClose"
    width="450px"
  >
    <el-form :model="formData" :rules="rules" ref="formData">
      <el-form-item label="项目" prop="xjlxmid" label-width="120px">
        <el-select v-model="formData.xjlxmid" filterable placeholder="请选择" @change="changeInv" style="width: 100%">
          <el-option
            v-for="inv in prjInv"
            :key="inv.id"
            :label="inv.xjlxmmc"
            :value="inv.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="方向" prop="fx" label-width="120px">
        <el-select v-model="formData.fx" disabled  placeholder="请选择">
          <el-option
            v-for="item in fxOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="累计发生额" prop="je" label-width="120px">
        <el-input-number  v-model="formData.je" :precision="2" autocomplete="off" :controls="false"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: ['visible', 'currentRow', 'isAdd'],
  data () {
    return {
      prjInv: [],
      formData: {},
      rules: {
        xjlxmid: [
          { required: true, message: '请选择应收或现金科目', trigger: 'change' }
        ],
        je: [
          { type: 'number', required: true, message: '请输入数字', trigger: 'blue' }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    title () {
      return this.isAdd ? '新增' : '修改'
    },
    fxOptions () {
      return [{label: '流入', value: 0}, {label: '流出', value: 1}]
    }
  },
  created () {
    this.queryPrjInv()
  },
  methods: {
    queryPrjInv () {
      this.$api.BasicSettingApi.XjllQc.qryPrjInv({ fx: -1 }).then(result => {
        if (result.success) {
          this.prjInv = result.rows
        }
      })
    },
    changeInv (value) {
      const inv = this.prjInv.find(v => v.id === value)
      if (inv != null) {
        this.formData.fx = inv.fx
        this.formData.xmmc = inv.xjlxmmc
      }
    },
    save () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$emit('save', this.formData)
        }
      })
    },
    dialogOpen () {
      this.formData = this.isAdd ? {} : Object.assign({}, this.currentRow)
    },
    dialogClose () {
      this.dialogVisible = false
    }
  }
}
</script>
