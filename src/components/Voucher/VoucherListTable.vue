<template>
  <table class="item_table" border="0" cellspacing="0" cellpadding="0"
         :style="{width: (indexWidth + abstractWidth + subjectWidth + debitWidth + creditWidth) + 'px'}">
    <tr class="width-tr">
      <td :style="{width: indexWidth + 'px'}"></td>
      <td :style="{width: abstractWidth + 'px'}"></td>
      <td :style="{width: subjectWidth + 'px'}"></td>
      <td :style="{width: debitWidth + 'px'}"></td>
      <td :style="{width: creditWidth + 'px'}"></td>
    </tr>
    <tr>
      <td colspan=5 class="item_header">
                      <span style="margin-left: 25px;">
                        <label class="color_333">日期：</label>{{voucherData.zdrq}}
                      </span>
        <span :title="voucherData.vdef4" class="corp-name">
                      <label class="color_333">公司：</label>{{voucherData.vdef4}}
                    </span>
        <span>
                      <label class="color_333">凭证号：</label>记
                      <a class="voucher-link"
                         @click.stop.prevent="editVoucher">{{voucherData.pzh}}</a></span>
        <span>
                      <label class="color_333">附单据：</label>{{voucherData.fdjs ? voucherData.fdjs : 0}}张
                    </span>
        <span v-show="voucherData.zdr && voucherData.zdr.length > 0">
                      <label class="color_333">制单：</label>{{voucherData.zdr}}
                    </span>
        <span v-show="voucherData.shr && voucherData.shr.length > 0">
                      <label class="color_333">审核：</label>{{voucherData.shr}}
                    </span>
        <span v-show="voucherData.jzr && voucherData.jzr.length > 0">
                      <label class="color_333">记账：</label>{{voucherData.jzr}}
                    </span>
        <el-tooltip placement="right" effect="light" popper-class="tip_class"
                    v-if="voucherData.pzzt === -1 && voucherData.iautorecognize != 1">
          <div slot="content">暂存态凭证，可能存在错<br/>误，请手工确认后保存！</div>
          <span class="voucher-status status-stage">暂存</span>
        </el-tooltip>
        <span class="voucher-status status-recognized"
              v-if="voucherData.pzzt === -1 && voucherData.iautorecognize === 1">已识别</span>

        <div class="item_header_right">
          <img src="@/assets/voucher/fuzhi.png" style="margin-right: 16px;" @click.stop="copyVoucher"
               alt="复制" title="复制"/>
          <img src="@/assets/voucher/charucaidan.png" style="margin-right: 16px;"
               @click.stop="insertVoucher(voucherData)" alt="插入" title="插入"/>
          <img src="@/assets/voucher/xiugai-2.png" style="margin-right: 16px;"
               @click.stop="editVoucher" alt="修改" title="修改"/>
          <img src="@/assets/voucher/shanchu.png" style="margin-right: 18px;"
               @click.stop="deleteVoucher" alt="删除" title="删除"/>
        </div>
      </td>
    </tr>
    <tr v-for="(child, index2) in voucherData.children" :key="child.primaryKey">
      <td class="align-center">{{index2 + 1}}</td>
      <td>
        <div :title="child.tmpzy" class="cell">{{child.tmpzy}}</div>
      </td>
      <td>
        <div :title="child.fullname" class="cell">{{child.fullname }}
        </div>
      </td>
      <td class="align-right">{{ child.jfmny | forThousands }}
      </td>
      <td class="align-right">{{ child.dfmny | forThousands }}
      </td>
    </tr>
    <tr>
      <td colspan=3 class="item_footer_hj">合计</td>
      <td class="align-right">{{ voucherData.jfhj | forThousands }}</td>
      <td class="align-right">{{ voucherData.dfhj | forThousands }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'VoucherListTable',
  props: {
    voucherDataList: {
      type: Array
    },
    voucherData: {
      type: Object
    },
    indexWidth: {
      type: Number,
      default: 80
    },
    abstractWidth: {
      type: Number,
      default: 200
    },
    subjectWidth: {
      type: Number,
      default: 400
    },
    debitWidth: {
      type: Number,
      default: 200
    },
    creditWidth: {
      type: Number,
      default: 200
    }
  },
  methods: {
    editVoucher () {
      if (!this.$hasPermission('voucher-edit')) {
        return
      }
      let ids = []
      if (this.voucherDataList) {
        this.voucherDataList.forEach(item => ids.push(item.id))
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          id: this.voucherData.id,
          idList: ids
        }
      })
    },
    insertVoucher () {
      if (!this.$hasPermission('voucher-edit')) {
        return
      }
      if (this.voucherData.sfjz === '是') {
        this.$message.warning('凭证已记账，不允许插入')
        return
      }
      if (this.voucherData.pzzt === 1) {
        this.$message.warning('凭证已审核，不允许插入')
        return
      }
      this.$router.push({
        name: 'voucher-edit',
        params: {
          data: {
            zdrq: this.voucherData.zdrq,
            pzh: this.voucherData.pzh
          },
          routeParam: {
            isInsert: true
          }
        }
      })
    },
    copyVoucher () {
      if (!this.$hasPermission('voucher-edit')) {
        return
      }
      let children = []
      this.voucherData.children.forEach(child => {
        let copyChild = {...child}
        delete copyChild.bid
        children.push(copyChild)
      })
      this.$router.push({
        name: 'voucher-edit',
        params: {
          data: {
            fp_style: this.voucherData.fp_style,
            children: children
          }
        }
      })
    },
    deleteVoucher () {
      this.$confirm('您确认要删除此凭证吗？删除后将不可恢复，并会产生断号！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.$api.Voucher.deleteVoucher([this.voucherData]).then(res => {
          if (res.success) {
            this.$emit('delete')
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
  .corp-name {
    width: 265px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    display: inline-block;
  }

  .item_table {
    box-sizing: border-box;
    height: 34px;
    line-height: 34px;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 14px;
    border: 1px solid #C1C1C1;
    table-layout: fixed;
  }

  .item_table tr {
    background-color: #fff;
    font-size: 12px;
  }

  .align-right {
    text-align: right;
  }

  .align-center {
    text-align: center;
  }

  .item_table td {
    box-sizing: border-box;
    border-left: 1px solid #C1C1C1;
    border-top: 1px solid #C1C1C1;
    padding: 0 5px;
  }

  .item_table .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .item_table td:first-child {
    border-left: none;
  }

  .item_table:hover {
    border: 1px solid #2C9DD8;
  }

  td.item_header {
    box-sizing: border-box;
    border: 0;
    height: 34px;
    line-height: 34px;
    background-color: #EBEBEB;
    color: #333;
    font-size: 12px;
    text-align: left;
  }

  .item_table:hover .item_header_right {
    display: table-cell;
  }

  .item_header_right img {
    vertical-align: middle;
  }

  .item_header > span {
    margin-right: 12px;
  }

  .item_header_right {
    float: right;
    height: 34px;
    line-height: 34px;
    vertical-align: middle;
    display: none;
    cursor: pointer;
  }

  .width-tr {
    height: 0px;
  }

  .width-tr td {
    border: none;
  }

  .voucher-link {
    color: #2b3de7;
    cursor: pointer;
  }

  .voucher-status {
    padding: 3px 5px;
    border-radius: 4px;
    margin-left: 10px;
  }

  .status-stage {
    border: 2px solid #fb3838;
    color: #fb3838;
    font-weight: 700;
    cursor: pointer;
  }

  .status-recognized {
    border: 2px solid #2ab30f;
    color: #2ab30f;
  }
</style>
