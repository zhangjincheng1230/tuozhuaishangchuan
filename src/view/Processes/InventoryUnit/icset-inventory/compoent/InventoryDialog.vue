<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      @open="onDialogOpen"
      @close="onDialogClose"
      @closed="onDialogClosed"
      width="510px"
    >
      <div class="form-container" :style="'max-height: ' + maxHeight +'px'">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          label-width="120px">
          <el-form-item label="编码" prop="spbm">
            <el-input v-model.trim="formData.spbm" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="spmc" v-if="!isEdit" style=" position: relative;">
            <template slot-scope="scope">
<!--              <el-select  v-model="formData.spmc" filterable allow-create default-first-option  placeholder="点下拉可复制已有存货" @change="chChange" style="width:220px" >-->
<!--                <el-option  v-for="item in chData" :key="item.id" :label="item.spmc" :value="item.id" style="width:300px">-->
<!--                  <span style="float: left">{{ item.fullname }}</span>-->
<!--                </el-option>-->
<!--              </el-select>-->
              <el-input v-model.trim="formData.spmc" placeholder="点参照可复制已有存货" style="width:220px">
                <i @click.stop="openInv" slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </template>
          </el-form-item>
          <el-form-item label="名称" prop="spmc" v-if="isEdit" style=" position: relative;">
            <el-input v-model.trim="formData.spmc" style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="科目名称" prop="kmid">
            <el-select  v-model="formData.kmid" filterable default-first-option  placeholder="请选择科目"  style="width:220px" >
              <el-option  v-for="item in kmData" :key="item.kmid" :label="item.kmbm ? item.kmbm + '_' + item.kmmc : item.kmmc"  :value="item.kmid" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简称" prop="jc">
            <el-input v-model.trim="formData.jc"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="存货分类" prop="splxid" style=" position: relative;">
            <el-select  v-model.trim="formData.splxid"  filterable  default-first-option placeholder="请选择存货分类"   style="width:220px" >
              <el-option v-for="item in sortChfl"  :key="item.invcls_id" :label="item.cd ? item.cd + ' / ' + item.nm : item.nm" :value="item.invcls_id"  style="width:220px" >
              </el-option>
            </el-select>
            <i style="font-size:15px;color: #409EFF" class="el-icon-circle-plus" @click="addClass()"></i>
          </el-form-item>
          <el-form-item label="规格(型号)" prop="gg">
            <el-input v-model.trim="formData.gg"  style="width:220px"></el-input>
          </el-form-item>
          <el-form-item label="计量单位" prop="jldwid">
            <el-select  v-model.trim="formData.jldwid" filterable default-first-option placeholder="请选择计量单位"  style="width:220px" >
              <el-option  v-for="item in sortJldw" :key="item.id" :label="item.jldwbm ? item.jldwbm + ' / ' + item.jldwmc : item.jldwmc" :value="item.id" style="width:220px" >
              </el-option>
            </el-select>
            <i style="font-size:15px;color: #409EFF" class="el-icon-circle-plus" @click="addUnit()"></i>
          </el-form-item>
          <el-form-item label="结算价" prop="jsjg">
            <el-input-number  v-model="formData.jsjg" :precision=pricePre :controls="false"  :min="-99999999" :max="999999999" style="width:220px"  ></el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="bz">
            <el-input v-model.trim="formData.bz"  style="width:220px"></el-input>
          </el-form-item>
        </el-form>
        <InventoryRefDialog :visible.sync="dialogInvVisible"  :appendToBody="true"  :queryData="queryData" single-select select-first @selected="handleInvSelect"></InventoryRefDialog>
        <InventoryClassDialog :visible.sync="classFormVisible" :isRef="true" :data="{cd:'001'}" @saved="onClassSaved"></InventoryClassDialog>
        <InventoryUnitDialog :visible.sync="unitFormVisible" :isRef="true" :data="{ jldwbm:'001'}" @saved="onUnitSaved"></InventoryUnitDialog>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="save">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as IcbillManageConst from '../../icbill-manage-const'
import InventoryRefDialog from '@/components/reference/InventoryRefDialog'
import InventoryClassDialog from '../../icset-classify/components/InventoryClassDialog'
import InventoryUnitDialog from '../../icset-mesunit/components/InventoryUnitDialog'
import * as MsgUtil from '../../../msg-util'
import { orderBy } from 'natural-orderby'
import refreshDataMixin from '@/mixins/refresh-data'
import loadingMixin from '@/mixins/loading'
export default {
  name: 'InventoryDialog',
  mixins: [refreshDataMixin, loadingMixin],
  components: {
    InventoryRefDialog,
    InventoryClassDialog,
    InventoryUnitDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    title: {
      type: String,
      default: '新增'
    }
  },
  data () {
    return {
      formData: {},
      srcList: [
        require('@/assets/img/helptool.png')
      ],
      dialogInvVisible: false,
      chflData: [],
      chData: [],
      pricePre: this.$store.getters.pricePre,
      classFormVisible: false,
      unitFormVisible: false,
      jldwData: [],
      kmData: []
    }
  },
  computed: {
    maxHeight () {
      return this.$store.getters.maxDialogBodyHeight
    },
    dialogVisible: {
      get () {
        return this.visible
      },
      set () {
        this.$emit('update:visible', false)
      }
    },
    dialogTitle: {
      get () {
        return this.title
      },
      set () {
        this.$emit('update:title', false)
      }
    },
    isEdit () {
      return (this.data && this.data.id)
    },
    rules () {
      let rules = {
        spbm: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        spmc: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        kmid: [{ required: true, message: '请输入科目', trigger: 'blur' }],
        jc: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        gg: [{ min: 1, max: 20, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
        bz: [{ min: 1, max: 20, message: '长度在 1 到 100 个字符', trigger: 'blur' }]
      }
      return rules
    },
    queryData: {
      get () {
        return {isshow: 'N'}
      }
    },
    sortChfl () {
      return orderBy(this.chflData, v => v.cd)
    },
    sortJldw () {
      return orderBy(this.jldwData, v => v.jldwbm)
    }
  },
  mounted: function mounted () {
    this.fetchChfl()
    this.fetchJldw()
    this.fetchCh()
    this.fetchKm()
  },
  methods: {
    refreshData () {
      this.fetchChfl()
      this.fetchJldw()
      this.fetchKm()
    },
    getNewCode () {
      this.$api.InventoryManageApi.IcsetInventory.getCode().then(result => {
        this.formData.spbm = result.data
      })
    },
    fetchKm () {
      this.$api.InventoryManageApi.IcsetInventory.queryBySpecialKM({}).then(res => {
        if (res.rows) {
          this.kmData = res.rows
        }
      })
    },
    fetchCh () {
      this.$api.InventoryManageApi.IcsetInventory.queryBParam({}).then(res => {
        if (res.rows) {
          this.chData = IcbillManageConst.invDataFullName(res.rows)
        }
      })
    },
    fetchChfl () {
      this.$api.InventoryManageApi.IcsetClassfy.query({}).then(res => {
        if (res.rows) {
          this.chflData = res.rows
        }
      })
    },
    fetchJldw () {
      this.$api.InventoryManageApi.IcsetMesunit.queryInfo({}).then(res => {
        if (res.rows) {
          this.jldwData = res.rows
        }
      })
    },
    save () {
      this.showLoading('保存中...')
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          const chfldata = this.chflData.find(ch => ch.invcls_id === this.formData.splxid)
          if (chfldata) {
            this.formData.splxmc = chfldata.nm
          }
          const chdwdata = this.jldwData.find(ch => ch.id === this.formData.jldwid)
          if (chdwdata) {
            this.formData.jldw = chdwdata.jldwmc
          }
          const kmdata = this.kmData.find(ch => ch.kmid === this.formData.kmid)
          if (kmdata) {
            this.formData.kmmc = kmdata.kmmc
            this.formData.kmbm = kmdata.kmbm
          }
          this.$api.InventoryManageApi.IcsetInventory.save({
            ...this.formData
          }).then(result => {
            this.closeLoading()
            if (result.success) {
              this.$emit('save', result.rows)
              this.closeDialog()
            } else {
              MsgUtil.errorMsg(this, result.msg)
            }
          })
        } else {
          this.closeLoading()
        }
      })
    },
    chChange (id) {
      if (id) {
        const invdata = this.chData.find(ch => ch.id === id)
        if (invdata) {
          const cd = this.formData.spbm
          this.formData = Object.assign({}, invdata)
          this.formData.spbm = cd
          this.formData.id = null
        }
      }
    },
    openInv () {
      this.dialogInvVisible = true
    },
    handleInvSelect (invData) {
      if (invData) {
        const cd = this.formData.spbm
        this.formData = Object.assign({}, invData)
        this.formData.spbm = cd
        this.formData.id = null
        this.$refs.formRef.clearValidate() // 移除校验结果
      }
    },
    addClass () {
      this.classFormVisible = true
    },
    onClassSaved (data) {
      if (data) {
        this.chflData.push(data)
        this.formData.splxid = data.invcls_id
      }
    },
    addUnit () {
      this.unitFormVisible = true
    },
    onUnitSaved (data) {
      if (data && data[0]) {
        this.jldwData.push(data[0])
        this.formData.jldwid = data[0].id
      }
    },
    onDialogOpen () {
      if (!this.isEdit) {
        this.formData = {
          spbm: '001'
        }
        this.getNewCode()
      } else {
        this.formData = Object.assign({}, this.data)
      }
    },
    onDialogClose () {
      this.closeDialog()
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 10px 15px;
  overflow: auto;
}
>>>.el-input-number .el-input__inner {
  text-align: right;
}
</style>
