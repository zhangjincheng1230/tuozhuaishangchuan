<template>
  <div>
    <el-dialog
      title="打印封皮"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="print-dialog"
      width="450px">
      <el-form label-width="auto">
        <el-form-item label="公司:">
          <el-input :value="formData.corpNames" :readonly="true">
            <template #suffix>
              <i class="el-input__icon el-icon-search" style="cursor: pointer"
                 @click="corpDialogVisible = true"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="模板选择:">
          <el-select
            v-model="formData.type">
            <el-option
              v-for="item in templateRef"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面边距:">
          左:
          <el-input v-model="formData.left" style="width: 60px"></el-input>
          毫米
          <span style="margin-left: 10px;">上:</span>
          <el-input v-model="formData.top" style="width: 60px"></el-input>
          毫米
        </el-form-item>
        <el-form-item label="每个公司打印:">
          <el-select
            v-model="formData.page"
            style="width: 100px">
            <el-option
              v-for="item in printPageRef"
              :key="item.value"
              :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          张封皮
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="printCover">打 印</el-button>
        </div>
      </template>
    </el-dialog>
    <CorpDialog
      :visible.sync="corpDialogVisible"
      @selected="handleCorpSelect"></CorpDialog>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'

export default {
  name: 'VoucherPrintCoverDialog',
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
        top: '16',
        left: '16',
        corpNames: loginCorp.uname,
        page: '1'
      },
      corpDialogVisible: false,
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
      printPageRef: [
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
    }
  },
  methods: {
    printCover () {
      this.saveSetting()
      this.$api.Voucher.printVoucherCover(this.formData)
      this.dialogVisible = false
    },
    handleCorpSelect (corps) {
      let corpNames = []
      corps.forEach(corp => {
        corpNames.push(corp.uname)
      })
      this.formData.corpNames = corpNames.join(',')
    },
    saveSetting () {
      let settings = {
        'left_cover': this.formData.left,
        'page-num': this.formData.page,
        'top_cover': this.formData.top,
        'type_cover': this.formData.type
      }
      this.$api.Public.savePrintSetting({
        nodename: '凭证封面打印',
        print_setting: JSON.stringify(settings)
      })
    }
  }
}
</script>

<style scoped>

</style>
