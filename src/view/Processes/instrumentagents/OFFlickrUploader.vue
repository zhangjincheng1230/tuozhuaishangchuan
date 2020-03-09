<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"

  >
    <header>
      <div style="width:20%; margin-left:14px;">
        <span>票据类型：</span>
        <el-select v-model="value" placeholder="请选择" style="width:40%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.id"
            @change="pjlxval"
          ></el-option>
        </el-select>
      </div>
      <div style="width:26%; display:flex">
        <span>客户：</span>
        <div class="demo-input-suffix" style="width:72%; margin-right:15px;">
           <i class="el-icon-search" style='position: absolute;top:18px;right:60%;z-index:1000;background:#fff;' @click="jumpcomp"></i>
          <el-select
            v-model="valueda"
            filterable
            placeholder="请选择公司"
            style="width:90%; margin-right:15px;position:relative;"
          >
            <el-option
              v-for="item in optionsval"
              :key="item.pk_gs"
              :label="item.uname"
              :value="item.pk_gs"
            ></el-option>
          </el-select>
        </div>
      </div>

      <CorpDialog
      style="margin-top:80px"
      ref="corpRef"
      :visible.sync="dialogVisible"
      single-select
      select-first
      @selected="handleCorpSelect"
    ></CorpDialog>
      <div style="width:23%">
        <span>图片入账月份：</span>
        <el-date-picker
          style="margin-left:5px;width:136px"
          v-model="valueDate"
          type="month"
          :editable="false"
          :clearable="false"
          value-format="yyyy-MM"
          placeholder="选择期间"
          :picker-options="monthPickerOptions"
        ></el-date-picker>
      </div>
      <div style="width:25%; text-align:right; margin-right:14px;">
        <el-button style="dispaly:inline" @click="jixu">继续添加</el-button>
        <el-button style="dispaly:inline" @click="onUpload">开始上传</el-button>
      </div>
    </header>
    <div
      class="contents"
      @drop.prevent="onDrop"
      @dragover.prevent="onDragover"
      @dragleave.prevent="dragover = false"
    >
      <div style="width:500px;"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragover"
        @dragleave.prevent="dragover = false"
      >
        <!-- (共{{sez.toFixed(2)}}KB) -->
        <div>共{{nums}}张，已成功上传{{unique(filedata).length}}张图片。
          {{unique(filestad).length}}张图片上传失败，<span v-if="unique(filestad).length>0">请
          <a style="color:red;cursor:pointer" @click="chongxin">重新上传</a>
        失败图片</span></div>
        <el-progress :percentage="tatse"></el-progress>
      </div>
      <div style="width:100%;height:95%;border:2px dashed rgb(44, 157, 216);;text-align:center" @click="jixu" v-if='juxuas'>
        <div>
          <i slot="default" class="el-icon-picture" style="margin-top:100px;display:inline-block;"  ></i>
          </div>
            <div style="margin-top:160px;" >
              <el-button style="background:#2c9dd8;color:#ffffff;">点击选择图片</el-button>
            </div>

            <div style="height:20px;margin-top:-100px" >
              <p>可上传jpg、jpeg、png、bmp、pdf等图片文件，单次最多可选1000张</p>
              <p style="margin-top:-100px">
                <font color="red">当日开具发票无法查验，请两日后点击【重新识别】</font>
              </p>
            </div>
      </div>
      <div v-show='juxua'>
          <el-upload
            :action="serverUrl"
            list-type="picture-card"
            :auto-upload="false"
            ref="upload"
            name="infiles"
            drag
            multiple
            :data="datas"
            :headers="{'X-Login-Corp':this.$store.getters.getLoginCorpId,'X-Login-Date':this.$store.getters.getLoginDate,'X-Login-User':this.$store.getters.getUserId,'X-ACCESS-TOKEN':this.$store.getters.getToken}"
            :on-success="access"
            :on-error="assecc"
            :on-change='addset'
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :limit="10000"
          >
          <div>
            <i slot="default" class="el-icon-plus" style="" ></i>
          </div>
            <div slot="file" slot-scope="{file}" style=" " v-if="uploadx" >
              <img class="el-upload-list__item-thumbnail" :src="file.url"  style="height:130px; width:220px;"/>
              <span class="el-upload-list__item-actions">
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file,fileList)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="dialogonlod" width="30%" :before-close="handleClose">
      <span
        v-if="value==='20'"
      >是否上传日期为{{valueDate.substring(0, 4)}}年{{valueDate.substring(5, 7)}}月的图片</span>
      <span
        v-if="value==='21'"
      >请确认票据类型是否为【存货】,上传日期为{{valueDate.substring(0, 4)}}年{{valueDate.substring(5, 7)}}月的图片</span>
      <span
        v-if="value==='22'"
      >请确认票据类型是否为【费用】,上传日期为{{valueDate.substring(0, 4)}}年{{valueDate.substring(5, 7)}}月的图片</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogonlod = false">取 消</el-button>
        <el-button type="primary" @click="dialogunlod">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="shangchuandalog" width="30%" :before-close="handleClose">
      <span>{{shangchuans}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shangchuandalog = false">取 消</el-button>
        <el-button type="primary" @click="shangchuanase">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CorpDialog from '@/components/reference/CorpDialog'
import { prefix } from '@/libs/axios'
import * as MsgUtil from '../msg-util'
import Compe from '../components/Mycompe'
import datePickerMixin from '@/mixins/date-picker'
import { getMonthEnd } from '@/utils'
export default {
  name: 'sctp',
  mixins: [datePickerMixin],
  components: {
    Compe,
    CorpDialog
  },
  data () {
    return {
      pickerOptions: this.datePicker(),
      form: {},
      contentLoading: false,
      serverUrl: prefix + '/zncs/gl_imageuplad/uploadSingleFile', // 这里写你要上传的图片服务器地址

      rotate: false,
      rotats: false,
      options: [{
        id: '20',
        label: '全部'
      }, {
        id: '21',
        label: '存货'
      }, {
        id: '22',
        label: '费用'
      }],
      optionsYear: [{
        value: '选项1',
        label: '2019'
      }],
      optionsDay: [{
        value: '选项1',
        label: '01'
      }, {
        value: '选项2',
        label: '02'
      }, {
        value: '选项3',
        label: '03'
      }, {
        value: '选项4',
        label: '04'
      }, {
        value: '选项5',
        label: '05'
      }, {
        value: '选项6',
        label: '06'
      }, {
        value: '选项7',
        label: '07'
      }, {
        value: '选项8',
        label: '08'
      }, {
        value: '选项9',
        label: '09'
      }, {
        value: '选项10',
        label: '10'
      }, {
        value: '选项11',
        label: '11'
      }, {
        value: '选项12',
        label: '12'
      }],
      value: '20',
      valueYear: '',
      valueDay: '',
      logins: 1,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      upList: [],
      dialogonlod: false,
      optionsval: this.$store.getters.corps,
      valueda: this.$store.getters.currentCorp.pk_gs,
      datas: {

      },
      valueDate: this.$store.getters.getLoginDate.substring(0, 7),
      shangchuans: '',
      shangchuandalog: false,
      ass: false,
      assa: false,
      tatse: 0,
      pic: 0,
      deg: 0,
      windowURL: null,
      nums: 0,
      filedata: [],
      filestad: [],
      valse: [],
      sez: 0,
      sai: 0,
      uploadx: true,
      uploads: false,
      openload: false,
      juxua: false,
      juxuas: true,
      itea: true
    }
  },
  computed: {
    headers () {
      return {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  },
  watch: {
    upList (naval) {
      if (this.$refs.upload.$children[0].files) {
        // this.$refs.upload.$children[1].$el.style.display = 'none'
        // console.log(this.$refs.upload.$el.children[0].style.position='relative')
        this.juxua = true
        this.juxuas = false
      } else if (this.$refs.upload.$children[0].files < 1) {
        // this.$refs.upload.$children[1].$el.style.display = 'block'
        this.juxua = false
        this.juxuas = true
      }
      this.nums = naval.length
      this.uploadx = false
      this.uploads = true
    },
    fileList (nale) {
      this.fileList.forEach(val => {
        if (!val.response.data.success) {
          val.ass = false
          val.assc = true
          this.valse.push(val)
          val.status = 'fail'
          this.$message({
            type: 'error',
            message: val.response.data.msg
          })
        } else {
          val.ass = true
          val.assc = false
          val.status = 'success'
          this.$message({
            type: 'success',
            message: val.response.data.msg
          })
        }
      })
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].status === 'success') {
          this.shabai = false
        } else {
          this.shabai = true
        }
      }
      console.log(this.fileList)
    }
  },
  methods: {
    addparkuser () {
      this.jixu()
    },
    jumpcomp () {
      this.dialogVisible = true
    },
    handleCorpSelect (corp) {
      const loginDate = getMonthEnd(corp.accountProgressDate)
      this.$api.System.selectCorp({
        pk_corp: corp.pk_gs,
        login_date: loginDate
      }).then(res => {
        if (res.success) {
          this.$store.commit('setCorpInfo', corp)
          this.$store.commit('setLoginDate', loginDate)
          this.valueda = corp.pk_gs
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    beforeAvatarUpload (file) {
      console.log(file)
      // const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      // const extension =
      //   testmsg === 'jpg' ||
      //   testmsg === 'JPG' ||
      //   testmsg === 'png' ||
      //   testmsg === 'PNG' ||
      //   testmsg === 'bpm' ||
      //   testmsg === 'BPM' ||
      //   testmsg === 'jpeg' ||
      //   testmsg === 'JPEG' ||
      //   testmsg === 'pdf' ||
      //   testmsg === 'PDF'
      // if (!extension) {
      //   this.$message({
      //     message: '上传图片只能是jpg / png / bpm / jpeg / pdf格式!',
      //     type: 'error'
      //   })
      //   return false // 必须加上return false; 才能阻止.style.display = 'none'
      // }
      // return extension
    },
    addset () {
      if (this.$refs.upload.$children[0].files) {
        // this.$refs.upload.$children[1].$el.style.display = 'none'
        // console.log(this.$refs.upload.$el.children[0].style.position='relative')
        this.juxua = true
        this.juxuas = false
      } else if (this.$refs.upload.$children[0].files < 1) {
        // this.$refs.upload.$children[1].$el.style.display = 'block'
        this.juxua = false
        this.juxuas = true
      }
      this.upList = this.$refs.upload.$children[0].files
    },
    onDrop (e) {
      const that = this
      const items = e.dataTransfer.items
      console.log(items, '12112')

      if (items.length >= 1) {
        this.itea = true
      } else {
        this.itea = false
      }
      var fs = e.dataTransfer.files // 获取文件

      // console.log(fs)
      // reader.onload = function () {
      // debugger
      if (fs.length < 1) {
        debugger
        that.windowURL = window.URL || window.webkitURL
        const dataURL = that.windowURL.createObjectURL(fs[0])
        const uid = new Date().valueOf()
        const file = fs
        console.log(file)
        file.uid = uid
        let fileObj = {
          name: file.name,
          percentage: 0,
          raw: file,
          size: file.size,
          status: 'ready',
          uid: uid,
          url: dataURL
        }
        that.$refs.upload.$children.forEach(fe => {
          if (fe.files) {
            fe.files.push(fileObj)
            that.upList = fe.files
          }
        })
      } else {
        for (let j = 0; j < fs.length; j++) {
          if (fs[j].type === '') {
            for (let i = 0; i < items.length; i++) {
              // file 对象（按实例拖拽的内容）转换成 FileSystemFileEntry 对象 或 FileSystemDirectoryEntry 对象
              let item = items[i].webkitGetAsEntry()
              let directoryReader = item.createReader()

              directoryReader.readEntries(function (entries) {
                entries.forEach(function (val) {
                  val.file(function (val) {
                    that.windowURL = window.URL || window.webkitURL
                    const dataURL = that.windowURL.createObjectURL(val)
                    const uid = new Date().valueOf()
                    const file = val
                    file.uid = uid
                    let fileObj = {
                      name: file.name,
                      percentage: 0,
                      raw: file,
                      size: file.size,
                      status: 'ready',
                      uid: uid,
                      url: dataURL
                    }
                    that.$refs.upload.$children.forEach(fe => {
                      if (fe.files) {
                        fe.files.push(fileObj)
                        that.upList = fe.files
                      }
                    })
                  })
                })
              })
            }
          } else {
            that.windowURL = window.URL || window.webkitURL
            const dataURL = that.windowURL.createObjectURL(fs[j])
            const uid = new Date().valueOf()
            const file = fs[j]
            file.uid = uid
            let fileObj = {
              name: file.name,
              percentage: 0,
              raw: file,
              size: file.size,
              status: 'ready',
              uid: uid,
              url: dataURL
            }
            that.$refs.upload.$children.forEach(fe => {
              if (fe.files) {
                fe.files.push(fileObj)
                that.upList = fe.files
              }
            })
          }
        }
      }
    },
    chongxin () {
      // debugger
      this.openload = true
      this.onUpload()
      //  this.$refs.upload.$children[1].post(this.valse)
      //
    },
    onDragover (e) {
      this.dragover = true
    },
    jixu () {
      this.$refs.upload.$children[1].$el.children[1].click()
    },
    datePicker () {
      const self = this
      return {
        disabledDate (time) {
          const month = time.getMonth() + 1
          const period = time.getFullYear() + '-' + (month < 10 ? '0' + month : month)
          const jzDate = self.qcdate
          if (jzDate) {
            return period < jzDate.substring(0, 7)
          } else {
            return false
          }
        }
      }
    },
    assecc (response, file, fileList) {
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    access (response, file, fileList) {
      this.fileList = fileList
      fileList.forEach(val => {
        if (val.response.data.success) {
          this.filedata.push(val)
          this.assa = false
        } else {
          this.filestad.push(val)
        }
      })
      // const arrsome = 100 / this.upList
      this.tatse = 100

      if (response.data.success) {
        this.ass = true
        // this.$message({
        //   type: 'success',
        //   message: response.data.msg
        // })
      } else {
        this.assa = true
        // this.$message({
        //   type: 'error',
        //   message: response.data.msg
        // })
      }
    },
    handleRemove (file) {
      this.sai = this.$refs.upload.$children[0].files.findIndex((item) => file.uid === item.uid)
      this.$refs.upload.$children[0].files.splice(this.sai, 1)
      this.sez = this.sez - file.size / 1024
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
    },
    handleDownload (file) {
    },
    handleClose () {
      this.dialogonlod = false
      this.shangchuandalog = false
    },
    format (percentage) {
      return percentage === 100 ? '满' : `${percentage}%`
    },
    updateas (response, file, fileList) {
    },
    start () {
      this.rotate = !this.rotate
    },
    starts () {
      this.rotats = !this.rotats
    },
    onUpload (formdata) {
      const loading = MsgUtil.loading(this, '正在載入...')
      this.$api.linkAssets.OnButtonStart({
        selYear: this.valueDate.substring(0, 4),
        selMon: this.valueDate.substring(5, 7),
        pk_corp: this.valueda
      }).then(res => {
        loading.close()
        if (res.success) {
          this.dialogonlod = true
          this.datas = {
            selYear: this.valueDate.substring(0, 4),
            selMon: this.valueDate.substring(5, 7),
            pk_corp: this.valueda,
            pjlx: this.value,
            msgkey: this.valueda + '_' + this.valueDate.substring(0, 4) + '_' + this.valueDate.substring(5, 7)
          }
        } else {
          this.shangchuandalog = true
          this.datas = {
            selYear: this.valueDate.substring(0, 4),
            selMon: this.valueDate.substring(5, 7),
            pk_corp: this.valueda,
            pjlx: this.value,
            msgkey: this.valueda + '_' + this.valueDate.substring(0, 4) + '_' + this.valueDate.substring(5, 7)
          }
          if (res.msg === '该月份已经结转损益，请修改上传月份！') {
            this.shangchuans = '该月份已经结转损益，是否继续上传！'
          }
        }
      })
    },
    pjlxval (val) {
    },
    shangchuanase () {
      this.$refs.upload.submit()
      this.shangchuandalog = false
    },
    dialogunlod () {
      if (!this.openload) {
        this.tatse = 100
        this.dialogonlod = false
        this.$refs.upload.submit()
        this.openload = false
      } else {
        this.dialogonlod = false
        this.$message.error('图片已存在，不可重复上传')
      }
    }
  },

  created () {
  }
}
</script>

<style lang="less" scoped>
header {
  width: 100%;
  height: 50px;

  line-height: 50px;
  display: flex;
  justify-content: space-between;
}
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}
// /deep/.el-upload {
//   width: 100%;
//   height: 100%;
// }
// /deep/.el-upload-dragger {
//   width: 100%;
//   height: 100%;
// }
/deep/.el-icon-picture {
  font-size: 150px;
  margin-top: 25px;
}
.fount p {
  margin-top: -80px;
}
.aa {
  transition: all 2s;
}
.go {
  transform: rotate(-90deg);
  transition: all 2s;
}
.bb {
  transition: all 2s;
}
.to {
  transform: rotate(90deg);
  transition: all 2s;
}

.shangchuan {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 150px;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  color: rgb(12, 246, 168);
  text-align: center;
}
.shibai {
  position: absolute;
  z-index:2000;
  left: 0;
  bottom: 10px;
  width: 150px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.3);
  color: rgb(207, 17, 3);
  text-align: center;
}
// /deep/.ace{
//   width: 100%;
//   height:150px;

// }
// /deep/.aces{
//   height:500px;
// }
/deep/.el-upload-list__item{
  width: 280px;
  border-radius: 1px;
}
// /deep/.el-upload-list{
//   position: relative;
// }
/deep/.el-upload-dragger{
   width:220px;
   height:150px;
}
/deep/.el-upload--picture-card{
  // display:none;
  border:none;
}
</style>
