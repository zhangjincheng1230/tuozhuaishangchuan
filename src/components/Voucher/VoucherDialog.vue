<template>
  <el-dialog
    title="凭证"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="onOpenDialog" width="1125px">
    <div class="clearfix">
      <div class="kj-button-group">
        <el-button @click="saveVoucher">保存</el-button>
        <el-button v-if="saved" @click="deleteVoucher">删除</el-button>
      </div>
    </div>
    <div style="max-height: 480px; overflow: auto">
      <VoucherEditTable
        ref="voucherTable"
        :voucher-id="id"
        :voucher-data="data"></VoucherEditTable>
    </div>
  </el-dialog>
</template>

<script>
import VoucherEditTable from '@/components/Voucher/VoucherEditTable'

export default {
  name: 'VoucherDialog',
  components: {
    VoucherEditTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {
    saved () {
      return this.id || (this.data && this.data.id)
    },
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
    onOpenDialog () {
    },
    saveVoucher () {
      this.$refs.voucherTable.saveVoucher().then(data => {
        this.$emit('save', data)
      }).catch(e => {
        console.log(e)
      })
    },
    deleteVoucher () {
      this.$refs.voucherTable.deleteVoucher().then(data => {
        this.$emit('delete')
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
