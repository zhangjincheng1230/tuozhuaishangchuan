<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onDialogClosed"
    :visible.sync="dialogVisible"
    width="450px">
    <el-upload
      :action="action"
      list-type="picture-card"
      ref="upload"
      :auto-upload="false"
      :limit="1"
      :file-list="fileList"
      :data="param"
      :accept="accept"
      :on-change="handleChange"
      :on-success="onSuccess"
      :on-error="onError"
      class="import-file" :class="showAddFile ? '' : 'hide-file-add'">
      <template #default>
        <i class="el-icon-plus"></i>
      </template>
      <template #file="{ file }">
        <div class="file-icon">
          <img
            class="el-upload-list__item-thumbnail"
            src="@/assets/img/archive.png" alt="">
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove()">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
        <span class="upload-file-name">{{ file.name }}</span>
      </template>
    </el-upload>
    <slot name="description"></slot>
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">上 传</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'UploaderDialog',
  props: {
    title: {
      type: String,
      default: '导入'
    },
    visible: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    },
    param: {
      type: Object
    },
    name: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    onSuccess: {
      type: Function
    },
    onError: {
      type: Function
    }
  },
  data () {
    return {
      key: 'value',
      fileList: [],
      showAddFile: true
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
    uploadFile () {
      return this.fileList.length > 0 ? this.fileList[0] : null
    }
  },
  watch: {
    fileList (val) {
      const showAddFile = val.length === 0
      if (showAddFile) {
        setTimeout(() => {
          this.showAddFile = showAddFile
        }, 1000)
      } else {
        this.showAddFile = showAddFile
      }
    }
  },
  methods: {
    submit () {
      if (this.uploadFile) {
        if (this.action) {
          this.$refs.upload.submit()
        } else if (this.param) {
          this.submitFormData()
        } else {
          this.submitFile()
        }
      } else {
        this.$message.warning('请选择文件')
      }
    },
    submitFormData () {
      const formData = new FormData()
      formData.append(this.name, this.uploadFile.raw, this.uploadFile.name)
      if (this.param) {
        Object.entries(this.param).forEach(([key, value]) => {
          formData.append(key, value)
        })
        this.$emit('submit', formData)
      }
    },
    submitFile () {
      this.$emit('submit', this.uploadFile)
    },
    handleChange (file, fileList) {
      if (fileList.size > 0) {
      }
      this.fileList = fileList
    },
    handleRemove () {
      this.fileList = []
    },
    onDialogClosed () {
      this.fileList = []
    }
  }
}
</script>

<style scoped>
  .import-file {
    text-align: center;
    height: 110px;
    margin-top: 3px;
  }
  .file-icon {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .import-file >>> .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
  .import-file >>> .el-upload-list--picture-card .el-upload-list__item {
    width: 200px;
    height: 100px;
    padding-bottom: 20px;
    border: none;
  }
  .upload-file-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
    width: 100%;
    left: 0px;
    bottom: -5px;
  }
  .hide-file-add >>> .el-upload--picture-card{
    display: none;
  }
</style>
