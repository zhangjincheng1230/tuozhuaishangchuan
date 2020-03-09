<template>
  <div>
    <el-dialog title="文件上传" :visible.sync="visible"  :close-on-click-modal="false" width="900px">
      <div style="height: 500px; width: 100%">
        <div style="font-size: 16px; margin-bottom: 15px">
          客户名称：{{corpkna}} &nbsp;&nbsp;&nbsp;&nbsp;日期：{{period}}
        </div>
        <el-upload
          action = "/"
          ref = "upload"
          list-type="picture-card"
          :http-request="uploadImg"
          :before-upload="beforeAvatarUpload"
          :on-change="changeImg"
          :file-list="fileList"
          accept="image/jpg,image/jpeg,image/png,aplication/zip,text/plain,application/msword,application/vnd.ms-excel,application/vnd.ms-powerpoint">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" style="height: 100%" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url" alt=""
            >
            <span class="el-upload-list__item-actions" v-if="file.raw.type.startsWith('image')">
              <span
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
            <div style="text-align: center" v-else>
              {{file.name}} <br/>
              不能预览
            </div>
          </div>
        </el-upload>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitUpload">上传</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'file-up-dialog',
  data () {
    return {
      fileList: [],
      cpperiod: '',
      khid: '',
      period: '',
      corpkna: '',
      visible: false,
      formData: {}
    }
  },
  props: {
  },
  methods: {
    beforeAvatarUpload (file) {
      let isSingle = file.size / 1024 / 1024 < 10

      let isLimitSize = this.fileList.map(v => v.size).reduce(function (prev, cur) {
        return prev + cur
      }, 0) / 1024 / 1024 < 200
      if (!isSingle) {
        this.$message({
          message: '所选择的图片大小超出最大限制（50M）',
          type: 'warning'
        })
      } else if (!isLimitSize) {
        this.$message({
          message: '所选择的图片总大小超出最大限制（200M）',
          type: 'warning'
        })
      }
      return isLimitSize && isSingle
    },
    changeImg (file, fileList) {
      this.fileList = fileList
    },
    show (corpkna, khid, period, cpperiod) {
      this.corpkna = corpkna
      this.khid = khid
      this.period = period
      this.cpperiod = cpperiod
      this.visible = true
      this.fileList = []
      this.formData = new FormData()
    },
    submitUpload () {
      this.formData.append('cpperiod', this.cpperiod)// 通过append向form对象添加数据
      this.formData.append('khid', this.khid)// 通过append向form对象添加数据
      this.formData.append('period', this.period)// 通过append向form对象添加数据
      this.$api.TaxRptApi.Workbench.uploadFile(this.formData).then(result => {
        if (result.success) {
          this.$message.success(result.msg)
          this.visible = false
        } else {
          this.$message.error(result.msg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    uploadImg (f) {
      this.formData.append('files', f.file)
    }
  }
}
</script>

<style scoped>
  >>> .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
    height: 100%;
    overflow-y: auto;
  }
</style>
