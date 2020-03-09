<template>
  <div class="app-main">
    <div class="kj-container"
         v-loading="loading"
         element-loading-text="数据加载中，请稍候..."
         element-loading-spinner="el-icon-loading">
      <div class="kj-head">
        <span style="float: left"><h4>数据备份记录:</h4></span>
        <div class="kj-button-group">
          <el-button @click="backup">开始备份</el-button>
          <el-button @click="mulirestore">恢复备份</el-button>
          <el-button @click="uploadDialog">上传本地备份</el-button>
        </div>
      </div>
      <div class="kj-main">
        <div class="table-container">
          <vxe-table
            border
            show-overflow
            show-header-overflow
            highlight-current-row
            :data="tableData"

            :edit-config="{trigger: 'click', mode: 'cell'}"
            @edit-closed="editClosedEvent"
            height="100%">
            <vxe-table-column title="备份名称" field="bfmc" header-align="center" align="left" width="350"></vxe-table-column>
            <vxe-table-column title="时间" field="time" header-align="center" align="left" width="155"></vxe-table-column>
            <vxe-table-column title="文件大小" field="size" header-align="center" align="left" width="100"></vxe-table-column>
            <vxe-table-column title="操作" field="opt" align="center" width="230">
              <template v-slot="{ row }">
                <vxe-button size="mini" @click="restore(row.id)">恢复</vxe-button>
                <vxe-button size="mini" @click="del(row.id)">删除</vxe-button>
                <vxe-button size="mini" @click="download(row.id)">下载</vxe-button>
              </template>
            </vxe-table-column>
            <vxe-table-column title="备注" field="bz" :edit-render="{name: 'input'}" header-align="center" align="left" width="240"></vxe-table-column>
          </vxe-table>
        </div>

      </div>
    </div>
    <CorpDialog :visible.sync="dialogVisible"
                :defaultSelection="corpIds"
                @selected="confirm"></CorpDialog>
    <UploaderDialog
      :visible.sync="dialogUploadFormVisible"
      accept = ""
      name="impfile"
      title="选择备份文件"
      @submit="onUpload"
      :param="uploadParam">
      <template #description>
        <div style="text-align: center; color:red; margin-bottom:4px">导入声明：只支持大账房系统导出的数据</div>
      </template>
    </UploaderDialog>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import UploaderDialog from '@/components/UploaderDialog'
import loadingMixin from '@/mixins/loading'

export default {
  name: 'backup',
  components: {
    CorpDialog,
    UploaderDialog
  },
  mixins: [loadingMixin],
  data () {
    return {
      loading: true,
      total: 0,
      tableData: [],
      dialogVisible: false,
      dialogFormVisible: false,
      dialogUploadFormVisible: false,
      currentRow: null,
      ope: '',
      formData: {},
      corpIds: [this.$store.getters.currentCorp.pk_gs],
      uploadParam: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.BackUp.query({
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.tableData = result.rows
          this.total = result.total
        }
      }).catch(e => {
        this.loading = false
      })
    },
    editClosedEvent ({ row, column }, event) {
      this.loading = true
      this.$api.BasicSettingApi.BackUp.upBack({
        id: row.id,
        bz: row.bz
      }).then(result => {
        this.loading = false
        if (result.success) {
          this.successMsg('保存成功')
        } else {
          this.errorMsg(result.msg)
        }
      }).catch(e => {
        this.loading = false
        this.errorMsg('保存失败')
      })
    },
    backup () {
      this.ope = 'back'
      let tips = '为保证备份数据的完整性，<span style="color:red;">' +
            '请确保账套里的其他用户已经退出系统。</span><span>确认执行备份？</span>'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.dialogVisible = true
      })
    },
    mulirestore () {
      this.ope = 'restore'
      let tips = '您将把账套数据恢复到备份文件所在的状态，<span style="color:red;">' +
            '此操作不可回退</span>，请谨慎操作。为保证备份数据的完整性，<span style="color:red;">请确保账套里的其他用户已经退出系统。</span>'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.dialogVisible = true
      })
    },
    confirm (selectedCorps) {
      if (this.ope === 'back') {
        this.backupconfirm(selectedCorps)
      } else if (this.ope === 'restore') {
        this.mconfirmrestore(selectedCorps)
      }
    },
    backupconfirm (selectedCorps) {
      if (selectedCorps) {
        this.loading = true
        this.$api.BasicSettingApi.BackUp.save({
          listvalue: JSON.stringify(selectedCorps)
        }).then(result => {
          this.loading = false
          if (result.success) {
            this.successMsg('备份成功')
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      } else {
        this.warnMsg('请先选择数据！')
      }
    },
    mconfirmrestore (selectedCorps) {
      if (selectedCorps) {
        this.loading = true
        this.$api.BasicSettingApi.BackUp.multiRestore({
          listvalue: JSON.stringify(selectedCorps)
        }).then(result => {
          this.loading = false
          if (result.success) {
            this.successMsg('恢复成功')
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch()
      } else {
        this.warnMsg('请先选择数据！')
      }
    },
    restore (fid) {
      let tips = '您将把账套数据恢复到备份文件所在的状态，<span style="color:red;">' +
            '此操作不可回退</span>，请谨慎操作。为保证备份数据的完整性，<span style="color:red;">请确保账套里的其他用户已经退出系统。</span></p>'
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.loading = true
        this.$api.BasicSettingApi.BackUp.restore({
          fid: fid
        }).then(result => {
          this.loading = false
          if (result.success) {
            // 后续需要补齐
            this.successMsg('恢复成功')
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        }).catch(e => {
          this.loading = false
        })
      })
    },
    del (fid) {
      this.$confirm('确认要删除该备份？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$api.BasicSettingApi.BackUp.del({
          fid: fid
        }).then(result => {
          if (result.success) {
            // 后续需要补齐
            this.successMsg('删除成功')
            this.fetchData()
          } else {
            this.errorMsg(result.msg)
          }
        })
      })
    },
    download (fid) {
      this.$api.BasicSettingApi.BackUp.download({
        fid: fid
      }).then(result => {
      }).catch(e => {
      })
    },
    uploadDialog () {
      this.dialogUploadFormVisible = true
    },
    onUpload (formData) {
      this.loading = true
      this.$api.BasicSettingApi.BackUp.upload(formData).then(res => {
        this.loading = false
        if (res.success) {
          this.dialogUploadFormVisible = false
          this.successMsg(res.msg)
          this.fetchData()
        } else {
          this.errorMsg(res.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    editRow () {
      if (this.currentRow) {
        this.formData = Object.assign({}, this.currentRow)
        this.dialogFormVisible = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择要编辑的银行账户',
          type: 'warning'
        })
      }
    },
    onSaved (data) {
      if (this.formData.id) {
        const index = this.tableData.findIndex(row => row.id === this.formData.id)
        if (index > -1) {
          this.$set(this.tableData, index, data)
        }
      } else {
        this.tableData.push(data)
      }
      this.successMsg('保存成功!')
    },
    successMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
    warnMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'warning'
      })
    },
    errorMsg (msg) {
      this.$message({
        showClose: true,
        message: msg,
        dangerouslyUseHTMLString: true,
        type: 'error'
      })
    }
  }
}
</script>
