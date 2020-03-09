<template>
  <div class="app-main">
    <div style="height: 100%; overflow: auto">
      <ul class="accounting-list">
        <li v-for="type in types" :key="type.id">
          <router-link
            :to="type.id === typeConst.INVENTORY && inventoryModuleEnabled
             ? {name: 'icset-inventory', params: {tagTitle: type.name}}
              : {name: 'auxiliary-archive', params: {type: type.id}}"
            class="item">
            <i class="type-icon"></i>{{ type.name }}
          </router-link>
          <div class="operation" v-if="type.gsid !== '000001'">
            <i class="el-icon-edit" title="编辑" @click="editData(type)"></i>
            <i class="el-icon-delete" title="删除" @click="deleteData(type)"></i>
            <a href="javascript:void(0)" class="btYn-del opt-bar del-ico" title="删除"></a>
          </div>
        </li>
        <li class="add-li"><a href="javascript:void(0)" class="item" @click="addData">+ 新增分类</a></li>
      </ul>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @opened="onDialogOpened"
      @closed="onDialogClosed"
      width="400px">
      <el-form
        :model="formData"
        ref="formRef"
        :rules="rules"
        @submit.native.prevent="saveType"
        label-width='auto'>
        <el-form-item prop="name" label="名称">
          <el-input ref="nameInput" v-model="formData.name" style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">关 闭</el-button>
          <el-button type="primary" @click="saveType">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { AUXILIARY_TYPE } from '@/constants/auxiliary-accounting'
export default {
  name: 'auxiliary-accounting',
  data () {
    return {
      visible: false,
      formData: {
        name: ''
      },
      typeConst: AUXILIARY_TYPE,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    types () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    dialogTitle () {
      return this.formData.id ? '修改分类' : '新增分类'
    },
    inventoryModuleEnabled () {
      return this.$store.getters.inventoryModuleEnabled
    }
  },
  methods: {
    closeDialog () {
      this.visible = false
    },
    addData () {
      this.visible = true
      this.formData = {}
    },
    onDialogOpened () {
      this.$refs.nameInput.focus()
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    },
    editData (data) {
      this.visible = true
      this.formData = Object.assign({}, data)
    },
    deleteData (data) {
      this.$confirm('删除后不可恢复！您确定要删除该辅助核算吗？', '提示', {
        type: 'warning',
        iconClass: 'el-icon-warning-outline',
        center: true,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.$api.BasicSettingApi.Auxiliary.deleteType({
          hid: data.id
        }).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.types.splice(this.types.findIndex(row => row.id === this.formData.id), 1)
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },
    saveType () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$api.BasicSettingApi.Auxiliary.saveType(this.formData).then(res => {
            if (res.success) {
              if (this.formData.id) {
                this.types.find(row => row.id === this.formData.id).name = res.rows.name
                this.visible = false
              } else {
                this.types.push(res.rows)
                this.formData = {}
                this.$nextTick(() => {
                  this.$refs.nameInput.focus()
                })
              }
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.accounting-list {
  position: relative;
  width: 100%;
  top: 1px;
  margin: -1px -5px 0 0;
  background: #fff;
  overflow: hidden;
  list-style: none;
}
.accounting-list li {
  position: relative;
  float: left;
  width: 25%;
  height: 165px;
}
.accounting-list .type-icon {
  width: 85px;
  height: 85px;
  background-repeat: no-repeat;
  display: block;
  margin: 40px auto 0;
  background-image: url("../../../../../assets/img/auxiliary-blue.png");
}
.accounting-list li .type-icon {
  background-position: -589px -334px;
}
.accounting-list li:nth-child(1) .type-icon {
  background-position: -92px -84px;
}
.accounting-list li:nth-child(2) .type-icon {
  background-position: -339px -80px;
}
.accounting-list li:nth-child(3) .type-icon {
  background-position: -589px -84px;
}
.accounting-list li:nth-child(4) .type-icon {
  background-position: -839px -84px;
}
.accounting-list li:nth-child(5) .type-icon {
  background-position: -77px -326px;
}
.accounting-list li:nth-child(6) .type-icon {
  background-position: -338px -334px;
}
.accounting-list a.item {
  display: block;
  height: 164px;
  overflow: hidden;
  text-align: center;
  text-decoration: none;
  color: #1a76a8;
  background: #fff;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.add-li a {
  line-height: 164px;
  font-size: 14px;
}
.operation {
  display: none;
  position: absolute;
  right: 5px;
  top: 5px;
}
.operation i {
  cursor: pointer;
  margin: 0 5px;
}
.accounting-list li:hover .operation {
  display: block;
}
</style>
