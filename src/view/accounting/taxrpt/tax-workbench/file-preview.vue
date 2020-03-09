<template>
  <div style="height: 500px">
    <el-dialog title="附件预览" :visible.sync="visible"  :close-on-click-modal="false" width="800px">
      <div style="height: 500px; overflow-y: auto">
        <el-row>
          <el-col :span="6" v-for="(o, index) in imageData.length" :key="o" :offset="1">
            <el-card :body-style="{ padding: '0px', height: '240px'}">
              <div class="fileShow" style="height: 80%;width:100%; position: relative">
                  <div class="showTip" @dblclick="shouPdf(imageData[index])" v-if="imageData[index].ext === 'pdf'">双击预览</div>
                  <div class="showTip" @dblclick="downLoadFile(imageData[index])" v-if="!(imageData[index].ext === 'png' || imageData[index].ext === 'jpg')">双击下载</div>
                  <img style="height: 100%;width:100%; z-index: 1;cursor: pointer" :src="createImg(imageData[index])"  :preview="index" :preview-text="imageData[index].docname" v-if="imageData[index].ext === 'png' || imageData[index].ext === 'jpg'"/>
                  <img style="height: 100%;width:100%; z-index: 1" :src="createImg(imageData[index])" v-else-if="imageData[index].ext === 'pdf'"/>
                  <img style="height: 100%;width:100%; z-index: 1" :src="createImg(imageData[index])" v-else/>
              </div>
              <div style="padding: 5px; text-align: center">
                <span><el-checkbox v-model="imageData[index].checked">{{imageData[index].docname}}</el-checkbox></span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="selectAll">全选</el-button>
          <el-button type="primary" @click="unSelectAll">全消</el-button>
          <el-button type="primary" @click="del">删除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'file-preview',
  data () {
    return {
      visible: false,
      imageData: [],
      corpkna: '',
      period: '',
      cpperiod: '',
      srcList: [
        require('@/assets/typeicon/excel.jpg'),
        require('@/assets/typeicon/pdf.jpg'),
        require('@/assets/typeicon/powerpoint.jpg'),
        require('@/assets/typeicon/txt.jpg'),
        require('@/assets/typeicon/word.jpg'),
        require('@/assets/typeicon/zip.jpg')
      ]
    }
  },
  methods: {
    selectAll () {
      this.imageData = this.imageData.map(v => {
        v.checked = true
        return v
      })
    },
    unSelectAll () {
      this.imageData = this.imageData.map(v => {
        v.checked = false
        return v
      })
    },
    del () {
      let ids = this.imageData.filter(v => v.checked).map(v => v.docid)
      if (ids.length === 0) {
        this.$message({
          message: '请勾选需要删除的附件',
          type: 'warning'
        })
        return
      }
      this.$api.TaxRptApi.Workbench.delAttaches({delData: ids}).then(result => {
        if (result.success) {
          this.$message({
            message: result.msg,
            type: 'success'
          })
          this.query()
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    show (visible, corpkna, period, cpperiod) {
      this.visible = visible
      this.corpkna = corpkna
      this.period = period
      this.cpperiod = cpperiod
      this.query()
    },
    query () {
      this.$api.TaxRptApi.Workbench.getAttaches({khid: this.corpkna, corpid: this.period, cpperiod: this.cpperiod}).then(result => {
        this.imageData = result.rows.map(v => {
          v.checked = false
          return v
        })
      })
    },
    createImg (img) {
      var ext = img.ext
      console.log('img----------------->', img)
      if (ext.toLowerCase() === 'xlsx' || ext.toLowerCase() === 'xls') {
        return this.srcList[0]
      } else if (ext.toLowerCase() === 'pdf') {
        return this.srcList[1]
      } else if (ext.toLowerCase() === 'pptx' || ext.toLowerCase() === 'ppt') {
        return this.srcList[2]
      } else if (ext.toLowerCase() === 'txt') {
        return this.srcList[3]
      } else if (ext.toLowerCase() === 'docx' || ext.toLowerCase() === 'doc') {
        return this.srcList[4]
      } else if (ext.toLowerCase() === 'zip') {
        return this.srcList[5]
      }
      return 'data:image/png;base64,' + img.imgae
    },
    shouPdf (img) {
      this.$api.TaxRptApi.Workbench.downloadAttach(img.docname, img)
    },
    downLoadFile (img) {
      this.$api.TaxRptApi.Workbench.downloadAttach(img.docname, img)
    }
  }
}
</script>
<style>
  .pswp{
    z-index: 150000;
  }
</style>
<style scoped>
  .image {
    width: 100px;
    height: 100px;
  }
  .showTip{
    display: none;
  }
  .fileShow:hover .showTip{
    display: block;
    cursor: pointer;
    position: absolute;
    bottom: 30px;
    left: 60px
  }
</style>
