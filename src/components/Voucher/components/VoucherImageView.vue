<template>
  <div class="clearfix">
    <div class="voucher-img-container" style="width: 700px; height: 400px; float: left">
      <viewer ref="viewer" :images="images" :options="options" @view.native="onViewImage">
        <img v-for="img in images" :src="img.src" :key="img.src" class="org-img">
      </viewer>
    </div>
    <div style="float: left; width: 62px; margin: 0 5px;">
      <div class="image-control-button">
        <el-button @click="rotate(90)" icon="el-icon-refresh-right" size="medium"></el-button>
      </div>
      <div class="image-control-button">
        <el-button @click="rotate(-90)" icon="el-icon-refresh-left" size="medium"></el-button>
      </div>
      <div class="image-control-button">
        <el-button @click="zoom(0.1)" icon="el-icon-zoom-in" size="medium"></el-button>
      </div>
      <div class="image-control-button">
        <el-button @click="zoom(-0.1)" icon="el-icon-zoom-out" size="medium"></el-button>
      </div>
      <div class="image-control-button">
        <el-tooltip class="item" effect="dark" content="上一组" placement="right">
          <el-button @click="prevGroup" icon="el-icon-caret-top" size="medium"></el-button>
        </el-tooltip>
      </div>
      <div class="image-control-button">
        <el-tooltip class="item" effect="dark" content="下一组" placement="right">
          <el-button @click="nextGroup" icon="el-icon-caret-bottom" size="medium"></el-button>
        </el-tooltip>
      </div>
      <div style="margin-top: 10px; text-align: center">
        {{ groupIndex + 1 }}/{{ totalGroup }}组
      </div>
    </div>
    <div style="float: left; width: 270px;" class="image-info">
      <el-card class="box-card">
        <template #header>
          <span>图片信息</span>
        </template>
        <div style="height: 255px; overflow: auto;">
          <div class="image-info-item" v-for="imageInfo in imageInfoArray" :key="imageInfo.key">
            {{imageInfo.label}}: {{ imageInfo.value }}
          </div>
        </div>
        <div class="image-info-footer">
          <el-button @click="prevGroupImage">上一张</el-button>
          {{ groupImageIndex + 1 }}/{{ groupImageTotal }}
          <el-button @click="nextGroupImage">下一张</el-button>
        </div>
      </el-card>
      <div></div>
      <div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import {addAuthenticationToUrl} from '@/utils/request'
import {forThousands} from '@/filters'

const picInfoFields = {
  '发票信息': {
    '公司编码': 'corpcode',
    '图片名称': 'imgname',
    '图片ID': 'webid',
    '票据类型': 'istate',
    '关键字': 'keywords',
    '发票号码': 'vinvoiceno',
    '发票代码': 'vinvoicecode',
    '开票日期': 'dinvoicedate',
    '销售方名称': 'vsalename',
    '销售方纳税号': 'vsaletaxno',
    '购买方名称': 'vpurchname',
    '购买方纳税号': 'vpurchtaxno',
    '备注': 'vmemo'
  },
  '发票内容': {
    '货物或应税劳务名称': 'invname',
    '规格(型号)': 'invtype',
    '单位': 'itemunit',
    '数量': 'itemamount',
    '单价': 'itemprice',
    '金额': 'itemmny',
    '税率': 'itemtaxrate',
    '税额': 'itemtaxmny',
    '价税合计': 'ntotaltax'
  },
  '银行': {
    '公司编码': 'corpcode',
    '图片名称': 'imgname',
    '图片ID': 'webid',
    '银行名称': 'vsaleopenacc',
    '票据类型': 'istate',
    '关键字': 'keywords',
    '开票日期': 'dinvoicedate',
    '付款方名称': 'vpurchname',
    '付款行名称': 'vpurbankname',
    '付款方账号': 'vpurchtaxno',
    '收款方名称': 'vsalename',
    '收款行名称': 'vsalebankname',
    '收款方账号': 'vsaletaxno',
    '金额': 'ntotaltax',
    '备注': 'vsalephoneaddr'
  },
  '发票通用': {
    '公司编码': 'corpcode',
    '图片名称': 'imgname',
    '图片ID': 'webid',
    '票据类型': 'istate',
    '关键字': 'keywords',
    '开票日期': 'dinvoicedate',
    '付款方名称': 'vpurchname',
    '付款方账号': 'vpurchtaxno',
    '收款方名称': 'vsalename',
    '收款方账号': 'vsaletaxno',
    '金额': 'ntotaltax',
    '备注': 'vsalephoneaddr'
  },
  '默认': {
    '公司编码': 'corpcode',
    '图片名称': 'imgname',
    '金额': 'mny',
    '摘要': 'memo',
    '结算方式': 'smode'
  }
}
export default {
  name: 'VoucherImageView',
  props: {
    imageGroupId: {
      type: String,
      default: null
    },
    imageGroups: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      viewer: null,
      imageGroup: null,
      imageIndex: 0,
      options: {
        inline: true,
        button: false,
        navbar: true,
        title: false,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: false,
        keyboard: true,
        toolbar: false,
        // toolbar: {
        //   zoomIn: 4,
        //   zoomOut: 4,
        //   oneToOne: 4,
        //   reset: 1,
        //   prev: 1,
        //   next: 1,
        //   rotateLeft: 4,
        //   rotateRight: 4,
        //   flipHorizontal: 4,
        //   flipVertical: 4,
        // },
        url: 'data-source'
      }
    }
  },
  computed: {
    corpCode () {
      return this.$store.getters.getLoginCorp.incode
    },
    groups () {
      let groups = []
      if (this.imageGroups) {
        groups = this.imageGroups
      } else if (this.imageGroup) {
        groups.push(this.imageGroup)
      }
      return groups
    },
    images () {
      let images = []
      this.groups.forEach(group => {
        group.children.forEach(img => {
          if (img.src === undefined) {
            img.src = addAuthenticationToUrl('/zxkj/voucher-manage/voucher/img?corpCode=' +
              this.corpCode + '&path=' + img.imgpath)
          }
          images.push(img)
        })
      })
      return images
    },
    currentImage () {
      if (this.images.length > 0) {
        return this.images[this.imageIndex]
      } else {
        return {}
      }
    },
    totalGroup () {
      return this.groups.length
    },
    groupIndex () {
      let index = 0
      if (this.images.length > 0) {
        let currentImg = this.images[this.imageIndex]
        let groupId = currentImg.pid
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].pid === groupId) {
            index = i
            break
          }
        }
      }
      return index
    },
    currentGroup () {
      if (this.groups.length > 0) {
        return this.groups[this.groupIndex]
      } else {
        return {}
      }
    },
    groupImageTotal () {
      let children = this.currentGroup.children
      return children ? children.length : 0
    },
    groupImageIndex () {
      let index = 0
      let imageId = this.currentImage.bid
      if (imageId) {
        for (let i = 0; i < this.currentGroup.children.length; i++) {
          if (this.currentGroup.children[i].bid === imageId) {
            index = i
            break
          }
        }
      }
      return index
    },
    imageInfoArray () {
      let imgInfo = {
        mny: forThousands(this.currentGroup.mny),
        memo: this.currentGroup.memo,
        imgname: this.currentImage.imgname,
        smode: this.currentGroup.smode,
        corpcode: this.currentGroup.corpcode,
      }
      let info = []
      let invoiceInfo = this.currentImage.invoice_info
      if (invoiceInfo) {
        let type = invoiceInfo.istate
        if (type && (type.indexOf('增值税') > -1 ||
          type.indexOf('机动车') > -1 ||
          type.indexOf('农产品') > -1)) {
          Object.entries(picInfoFields['发票信息']).forEach(([label, key]) => {
            info.push({
              label: label,
              value: invoiceInfo[key] || imgInfo[key],
              key: key
            })
          })
          Object.entries(picInfoFields['发票内容']).forEach(([label, key]) => {
            let children = invoiceInfo.children
            let value = ''
            if (invoiceInfo.hasOwnProperty(key)) {
              value = invoiceInfo[key]
            } else {
              if (children && children.length > 0) {
                children.forEach(child => {
                  let curVal = child[key]
                  if (curVal) {
                    if (value) {
                      value += '，'
                    }
                    value += curVal
                  }
                })
              }
            }
            info.push({
              label: label,
              value: value,
              key: key
            })
          })
        } else if (type && type.indexOf('b') === 0) {
          Object.entries(picInfoFields['银行']).forEach(([label, key]) => {
            info.push({
              label: label,
              value: invoiceInfo[key] || imgInfo[key],
              key: key
            })
          })
        } else {
          Object.entries(picInfoFields['发票通用']).forEach(([label, key]) => {
            info.push({
              label: label,
              value: invoiceInfo[key] || imgInfo[key],
              key: key
            })
          })
        }
      } else {
        Object.entries(picInfoFields['默认']).forEach(([label, key]) => {
          info.push({
            label: label,
            value: imgInfo[key],
            key: key
          })
        })
      }
      return info
    }
  },
  mounted () {
    console.log(this.$refs.viewer.$viewer)
  },
  watch: {
    imageGroupId: {
      handler (id) {
        if (id) {
          this.loadImageById(id)
        }
      },
      immediate: true
    }
  },
  methods: {
    onViewImage (event) {
      this.imageIndex = event.detail.index
      console.log(event)
    },
    prevGroupImage () {
      if (this.groupImageIndex > 0) {
        this.$refs.viewer.$viewer.prev()
      }
    },
    nextGroupImage () {
      if (this.groupImageIndex < this.groupImageTotal - 1) {
        this.$refs.viewer.$viewer.next()
      }
    },
    rotate (degree) {
      this.$refs.viewer.$viewer.rotate(degree)
    },
    zoom (ratio) {
      this.$refs.viewer.$viewer.zoom(ratio)
    },
    prevGroup () {
      let currentImgIndex = this.getCurrentImgIndex()
      let groupId = this.images[currentImgIndex].pid
      let prevGroupId = null
      let index = currentImgIndex - 1
      for (; index >= 0; index--) {
        if (prevGroupId === null) {
          if (this.images[index].pid !== groupId) {
            prevGroupId = this.images[index].pid
          }
        } else if (this.images[index].pid !== prevGroupId) {
          index++
          break
        }
      }
      if (prevGroupId !== null) {
        this.$refs.viewer.$viewer.view(Math.max(0, index))
      }
    },
    nextGroup () {
      let currentImgIndex = this.getCurrentImgIndex()
      let groupId = this.images[currentImgIndex].pid
      let nextGroupId = null
      let index = currentImgIndex + 1
      for (; index < this.images.length; index++) {
        if (nextGroupId === null && this.images[index].pid !== groupId) {
          nextGroupId = this.images[index].pid
          break
        }
      }
      if (nextGroupId !== null) {
        this.$refs.viewer.$viewer.view(Math.min(this.images.length - 1, index))
      }
    },
    getCurrentImgIndex () {
      return this.$refs.viewer.$viewer.index
    },
    loadImageById (id) {
      this.$api.Voucher.getImageById({
        id
      }).then(res => {
        if (res.success) {
          this.imageGroup = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .org-img {
    display: none;
  }

  .voucher-img-container {
    background: #fff;
    border: 1px solid #ddd;
  }

  >>> .viewer-navbar {
    background: #fff;
  }

  .image-control-button >>> .el-button {
    font-size: 20px;
  }
  .image-control-button+.image-control-button {
    margin-top: 15px;
  }
  .image-info-item {
    line-height: 30px;
    font-size: 13px;
    word-break: break-all;
  }
</style>
