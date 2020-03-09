<template>
  <div>
    <el-dialog
      title="打印设置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="print-dialog"
      width="500px">
      <el-form label-width="auto">
        <el-form-item label="公司:">
          <el-input :value="corpName" :readonly="true" style="width: 355px">
            <template #suffix>
              <i class="el-input__icon el-icon-search" style="cursor: pointer"
                 @click="corpDialogVisible = true"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="模板选择:">
          <el-select
            v-model="formData.type"
            style="width: 190px">
            <el-option
              v-for="item in templateRef"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <label>打印行数</label>
          <el-select
            v-model="formData.print_rows"
            style="width: 100px">
            <el-option
              v-for="item in lineRef"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字体:">
          <el-select
            v-model="formData.font_name"
            style="width: 100px">
            <el-option
              v-for="item in fontRef"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <el-checkbox
            v-model="formData.print_splitline"
            true-label="Y" false-label="N">打印虚线
          </el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox
            v-model="formData.collect"
            true-label="Y" false-label="N">汇总打印
          </el-checkbox>
        </el-form-item>
        <el-form-item label="" v-if="formData.collect === 'Y'">
          <div>
            将科目汇总到:
            <el-select
              v-model="formData.account_level"
              placeholder=""
              style="width: 60px">
              <el-option
                v-for="item in subjectLevelRef"
                :key="item.value"
                :value="item.value"
                :label="item.label"></el-option>
            </el-select>
            级
          </div>
          <div>
            <el-checkbox
              v-model="formData.deb_cred"
              true-label="Y" false-label="N">按借贷方向分别汇总
            </el-checkbox>
            <el-checkbox
              v-model="formData.hide_zero"
              true-label="Y" false-label="N">汇总金额为零不显示
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox
            v-model="formData.show_auxiliary"
            true-label="Y" false-label="N">打印辅助核算项目
            <el-tooltip
              effect="light"
              content="说明：选中“打印辅助核算项目”默认打印全部辅助项目，若需单独设置具体辅助明细请点开“设置”进行操作"
              placement="bottom">
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <el-button type="primary" size="mini" @click="assistSettingVisible = true">设置</el-button>
          </el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox
            v-model="formData.show_auxiliary_noinv"
            true-label="Y" false-label="N">打印辅助核算项目（不打印存货辅助）
          </el-checkbox>
        </el-form-item>
        <el-form-item label="边距调整:">
          上:
          <el-input v-model="formData.top" style="width: 60px"></el-input>
          毫米
          <span style="margin-left: 10px;">左:</span>
          <el-input v-model="formData.left" style="width: 60px"></el-input>
          毫米
        </el-form-item>
        <el-form-item label="制单人:">
          <el-radio v-model="formData.zdr" label="0">原制单人</el-radio>
          <el-radio v-model="formData.zdr" label="1">当前操作员</el-radio>
          <el-radio v-model="formData.zdr" label="2">指定</el-radio>
          <el-input style="width: 100px" v-model="formData.user_name"></el-input>
        </el-form-item>
        <el-form-item label="打印显示:">
          <el-checkbox
            v-model="formData.show_vappr"
            true-label="Y" false-label="N">审核人
          </el-checkbox>
          <el-checkbox
            v-model="formData.show_vjz"
            true-label="Y" false-label="N">记账人
          </el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveData">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <CorpDialog
      :visible.sync="corpDialogVisible"
      @selected="handleCorpSelect"></CorpDialog>
    <el-dialog
      title="辅助项打印设置"
      :visible.sync="assistSettingVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="onOpenAuxiliarySettingDialog"
      class="print-dialog"
      width="600px">
      <div style="height: 40px; line-height: 40px; margin-bottom: 5px;">
        <div style="float: right">
          <el-button size="small" type="primary"
                     @click="savePrintAssistSetting">保存
          </el-button>
          <el-button size="small" @click="assistSettingVisible=false">取消</el-button>
        </div>
      </div>
      <el-table
        border
        :data="auxiliarySettingData"
        :max-height="500"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="辅助核算科目"
          header-align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="isfzhs"
          label="辅助项目（选中项在打印凭证时会打印）"
          header-align="center">
          <template #default="{ row }">
            <el-checkbox v-for="(fzhs, index) in auxiliaryTypes"
                         :key="index"
                         v-if="row.isfzhs.charAt(index) == '1'"
                         v-model="row['printfzhs'+(index + 1)]">{{ fzhs.name }}
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import { SUBJECT_AUXILIARY_DEFAULT } from '@/constants'
import { arrayToMap } from '@/utils'

export default {
  name: 'VoucherPrintSettingDialog',
  components: {
    CorpDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let loginCorp = this.$store.getters.getLoginCorp
    return {
      formData: {
        type: '6',
        print_rows: '5',
        font_name: 'simkai',
        print_splitline: 'N',
        collect: 'N',
        account_level: '1',
        show_auxiliary: 'N',
        top: '12.7',
        left: '16.6',
        zdr: '0',
        show_vappr: 'Y',
        show_vjz: 'Y'
      },
      corpId: loginCorp.pk_gs,
      corpName: loginCorp.uname,
      corpDialogVisible: false,
      assistSettingVisible: false,
      auxiliarySettingData: [],
      templateRef: [
        {
          label: '凭证纸版(横向12*21cm)',
          value: '6'
        },
        {
          label: '凭证纸版(纵向21*12cm)',
          value: '4'
        },
        {
          label: 'A4两版',
          value: '1'
        },
        {
          label: 'A4三版',
          value: '2'
        },
        {
          label: 'A5版',
          value: '5'
        },
        {
          label: 'B5版(25.7*18.2cm)',
          value: '7'
        },
        {
          label: '发票版(14*24cm)',
          value: '3'
        }
      ],
      lineRef: [
        {
          label: '5行',
          value: '5'
        },
        {
          label: '6行',
          value: '6'
        },
        {
          label: '7行',
          value: '7'
        },
        {
          label: '8行',
          value: '8'
        },
        {
          label: '9行',
          value: '9'
        },
        {
          label: '10行',
          value: '10'
        }
      ],
      fontRef: [
        {
          label: '楷体',
          value: 'simkai'
        },
        {
          label: '黑体',
          value: 'msyh'
        }
      ],
      subjectLevelRef: [
        {
          label: '1',
          value: '1'
        },
        {
          label: '2',
          value: '2'
        },
        {
          label: '3',
          value: '3'
        },
        {
          label: '4',
          value: '4'
        },
        {
          label: '5',
          value: '5'
        }
      ]
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
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    subjects () {
      return this.$store.getters.subSubjectRef
    }
  },
  created () {
    this.fetchSetting()
  },
  methods: {
    fetchSetting () {
      this.$api.Public.queryPrintSetting({
        nodeName: '凭证管理'
      }).then(res => {
        if (res.success && res.data) {
          let settingStr = res.data.print_setting
          if (settingStr) {
            this.formData = JSON.parse(settingStr)
          }
        }
      })
    },
    onOpenAuxiliarySettingDialog () {
      if (this.auxiliarySettingData.length === 0) {
        this.fetchAuxiliarySetting()
      }
    },
    fetchAuxiliarySetting () {
      this.$api.Voucher.queryAssistPrintSetting().then(res => {
        this.loadAuxiliarySetting(res.rows)
      })
    },
    loadAuxiliarySetting (rows) {
      let tableData = []
      let savedData = arrayToMap(rows, 'pk_accsubj')
      this.subjects.forEach(subject => {
        let isfzhs = subject.isfzhs
        if (isfzhs !== SUBJECT_AUXILIARY_DEFAULT) {
          let subjectAssist
          if (savedData.has(subject.id)) {
            subjectAssist = savedData.get(subject.id)
          } else {
            subjectAssist = {}
          }
          for (let i = 0; i < 10; i++) {
            let key = 'printfzhs' + (i + 1)
            if (subjectAssist[key] === undefined) {
              subjectAssist[key] = isfzhs.charAt(i) === '1'
            }
          }
          subjectAssist.name = subject.codefullname
          subjectAssist.pk_accsubj = subject.id
          subjectAssist.isfzhs = isfzhs
          tableData.push(subjectAssist)
        }
      })
      this.auxiliarySettingData = tableData
    },
    handleCorpSelect (corps) {
      let corpNames = []
      let corpIds = []
      corps.forEach(corp => {
        corpNames.push(corp.uname)
        corpIds.push(corp.pk_gs)
      })
      this.corpId = corpIds.join(',')
      this.corpName = corpNames.join(',')
    },
    saveData () {
      this.$api.Public.savePrintSetting({
        nodename: '凭证管理',
        print_setting: JSON.stringify(this.formData),
        pk_corp: this.$store.getters.getLoginCorpId,
        corpids: this.corpId
      }).then(res => {
        if (res.success) {
          this.dialogVisible = false
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    savePrintAssistSetting () {
      this.$api.Voucher.saveAssistPrintSetting(this.auxiliarySettingData).then(res => {
        if (res.success) {
          this.assistSettingVisible = false
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  >>> .print-dialog .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }

  >>> .print-dialog .el-radio {
    margin-right: 15px;
  }
</style>
