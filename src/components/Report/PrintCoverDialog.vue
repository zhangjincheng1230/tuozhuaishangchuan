<!-- 打印封皮 -->
<template>
    <div>
        <el-dialog title="打印封皮"  :visible.sync="visible" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="420px" :modal="false">
            <el-form :model="printForm" ref="formData" label-width="100px">
              <el-form-item label="公司" size="mini">
                <el-input  placeholder
                           clearable
                           suffix-icon="el-icon-search"
                           v-model="printForm.corpnames" @click.native="selectCorp"
                           style="width: 210px"
                ></el-input>
              </el-form-item>
              <el-form-item label="模板选择">
                  <el-select  v-model="printForm.type"
                          style="width: 210px">
                      <el-option
                              v-for="item in printTempRef"
                              :key="item.value"
                              :value="item.value"
                              :label="item.label">
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="打印预览方向" v-if="printForm.type === '1'">
                  <div style="display: inline-block">
                      <el-radio-group v-model="printForm.activation">
                          <el-radio label="Y">横向</el-radio>
                          <el-radio label="N">纵向</el-radio>
                      </el-radio-group>
                  </div>
              </el-form-item>
              <el-form-item label="页面边距">
                  <div style="display: inline-block">
                      左<el-input
                          v-model.trim="printForm.left"
                          style="width: 50px"></el-input>毫米
                  </div>
                  <div style="display: inline-block; margin-left: 10px">
                      上<el-input
                          v-model.trim="printForm.top"
                          style="width: 50px"></el-input>毫米
                  </div>
              </el-form-item>
              <el-form-item label="每个公司打印">
                <el-select  v-model="printForm.pagenum"
                            style="width: 210px">
                  <el-option
                    v-for="item in printPageNumTempRef"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="printReport">打 印</el-button>
                </div>
            </template>
        </el-dialog>
      <CorpDialog :visible.sync="dialogVisible"
                  :defaultSelection="printForm.corpIds"
                  @selected="confirm" :modal="false"></CorpDialog>
    </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
export default {
  name: 'PrintCoverDialog',
  components: {
    CorpDialog
  },
  props: {
    nodename: {},
    corpid: {},
    corpname: {}
  },
  data () {
    return {
      visible: false,
      dialogVisible: false,
      printForm: {
        corpnames: this.$store.getters.currentCorp.uname,
        corpIds: this.$store.getters.currentCorp.pk_gs,
        activation: 'Y',
        type: '1',
        left: '0',
        top: '20',
        pagenum: '1'
      },
      printTempRef: [
        {
          value: '1',
          label: 'A4纸模板'
        },
        {
          value: '2',
          label: 'B5纸模板'
        }
      ],
      printPageNumTempRef: [
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        }
      ]
    }
  },
  watch: {
    // 纸张类型编辑事件
    'printForm.type' (newValue, oldValue) {
      this.updateLeftAndTop()
    },
    // 横纵向编辑事件
    'printForm.activation' (newValue, oldValue) {
      this.updateLeftAndTop()
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    // 显示公司
    selectCorp () {
      this.dialogVisible = true
    },
    // 公司选中
    confirm (selectedCorps) {
      if (selectedCorps && selectedCorps.length > 0) {
        let corpnames = []
        let corpids = []
        for (const t of selectedCorps) {
          corpnames.push(t.uname)
          corpids.push(t.pk_gs)
        }
        this.printForm.corpnames = corpnames.join(',')
        this.printForm.corpIds = corpids.join(',')
      }
    },
    // 更新边距
    updateLeftAndTop () {
      // 横向
      if (this.printForm.activation === 'Y') {
        this.printForm.left = '0'
        this.printForm.top = '20'
      } else {
        this.printForm.left = '0'
        this.printForm.top = '60'
      }
    },
    // 打印确定
    printReport () {
      this.printForm.pageOrt = this.printForm.activation // 打印方向
      this.$emit('confirmPrint', JSON.parse(JSON.stringify(this.printForm)))
    },
    // 打印取消
    cancel () {
      this.visible = false
    },
    show () {
      this.visible = true
    }
  }
}
</script>

<style scoped>
</style>
