<template>
  <div class="app-main">
    <div class="kj-container">
      <header class="kj-head">
        <div class="Headleft"></div>
        <div class="Headright">
          <el-button @click="addtable">新增</el-button>
          <el-button @click="btnModify">修改</el-button>
          <el-button @click="opendel">删除</el-button>
          <el-button @click="refresher">刷新</el-button>
        </div>
      </header>
      <div class="kj-main">
        <div class="table-container">
          <el-table
            :data="tableData"
            height="100%"
            border
            highlight-current-row
            @current-change="handleCheckChang"
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column label="资产属性" align="center" width="110" show-overflow-tooltip>
              <template slot-scope="sope">
                <span>{{sope.row.zcsx| formatZcSx}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="zclbmc" label="资产类别" align="center" width="140" show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="科目属性" align="center" show-overflow-tooltip width="140">
              <template slot-scope="sope">
                <span>{{sope.row.zckm | formatKmsx}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="zzkmmc"
              label="资产科目" align="center" show-overflow-tooltip width="140"
            ></el-table-column>
            <el-table-column
              prop="zjfykmmc" align="center" label="折旧费用科目"
              width="160" show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="jskmmc" label="结算科目" align="center" show-overflow-tooltip width="140"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false"
               :close-on-press-escape="false" width="430px" @opened="dilogOpen" @close="dialogClosed">
      <el-form  :model="form" ref="validateForm" label-width="120px" class="demo-ruleForm">
        <el-form-item
          label="资产属性" prop="zcsx"
          :rules="[
            { required: true, message: '资产属性不能为空'},
          ]">
          <el-select  ref = "coderef" v-model="form.zcsx" placeholder="请选择" style="width:210px" >
            <el-option
              v-for="item in assetProp"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="类别名称" prop="zclbmc">
          <el-input
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            v-model="form.zclbmc"
            style="width:210px" @click.native="zichanval"
          ></el-input>
        </el-form-item>
        <el-form-item size="mini" label="资产类别id" prop="zclbid" class="row-child" style = "display: none">
          <el-input v-model="form.zclbid"></el-input>
        </el-form-item>
        <el-form-item
          label="科目属性"
          prop="zckm"
          :rules="[
            { required: true, message: '科目属性不能为空'},
          ]">
          <el-select  v-model="form.zckm" filterable :clearable = "true" placeholder="请选择" style="width:210px" >
            <el-option
              v-for="item in subjectProp"
              :key="'zckm' + item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="资产科目"
          prop="zzkmid"
          :rules="[
            { required: true, message: '资产科目不能为空'},
          ]">
          <el-select v-model="form.zzkmid" filterable :clearable = "true" placeholder="请选择" style="width:210px" >
            <el-option
              v-for="item in subjectRef"
              :key="'zzkmid' + item.id"
              :label="item.codename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="折旧费用科目"
          prop="zjfykmid"
          :rules="[
            { required: true, message: '折旧费用科目不能为空'},
          ]">
          <el-select v-model="form.zjfykmid"  filterable :clearable = "true" placeholder="请选择" style="width:210px" >
            <el-option
              v-for="item in subjectRef"
              :key="'zjfykmid' + item.id"
              :label="item.codename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="结算科目"
          prop="jskmid"
          :rules="[
            { required: true, message: '结算科目不能为空'},
          ]">
          <el-select v-model="form.jskmid" filterable :clearable = "true" placeholder="请选择" style="width:210px" >
            <el-option
              v-for="item in subjectRef"
              :key="'jskmid' + item.id"
              :label="item.codename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitSave()">保存</el-button>
        </div>
      </template>
    </el-dialog>
    <AssetsType ref="assetsTypeSelect" @findinde="asettab"></AssetsType>
  </div>
</template>

<script>
import Header from '../../components/Header'
import AddTable from '../../components/AddTable'
import assetMixin from '@/filters/asset'
import AssetsType from '@/view/Processes/components/AssetsTypeSelect'
import { ASSET_PROP, ZJ_TYPE, SUBJECT_PROP } from '@/constants/asset'
export default {
  mixins: [assetMixin],
  name: 'zclb',
  data () {
    return {
      values: '',
      form: {
        zcsx: '', // 资产属性
        zclbmc: '', // 资产类别名称
        zclbid: '', // 资产类别
        zckm: '', // 科目属性
        zzkmid: '', // 资产科目
        zjfykmid: '', // 折旧费用科目
        jskmid: '' // 结算科目
      },
      title: '新增',
      visible: false,
      tableData: [],
      loading: false,
      assetProp: ASSET_PROP,
      zjType: ZJ_TYPE,
      subjectProp: SUBJECT_PROP,
      expanded: false,
      lace: false,
      subjectRef: this.$store.getters.subSubjectRef,
      Lbprop: {}, // 选中的类别对象,
      selection: null,
      openAssetsType: false // 资产类别是否显示
    }
  },
  components: {
    Header,
    AddTable,
    AssetsType
  },
  methods: {
    addtable () {
      this.title = '新增'
      this.visible = true
      this.form = {
        zcsx: '', // 资产属性
        zclbmc: '',
        zclbid: '', // 资产类别
        zckm: '', // 科目属性
        zzkmid: '', // 资产科目
        zjfykmid: '', // 折旧费用科目
        jskmid: '' // 结算科目
      }
    },
    zichanval () {
      this.$refs.assetsTypeSelect.show()
    },
    asettab (val) {
      this.Lbprop = val
      this.form.zclbmc = this.Lbprop.name
      this.form.zclbid = this.Lbprop.id
    },
    dilogOpen () {
      this.$refs.coderef.focus()
    },
    dialogClosed () {
      this.$refs.validateForm.resetFields()
    },
    submitSave () { // 确定按钮
      this.$refs.validateForm.validate((rs) => {
        if (rs) {
          this.$api.linkAssets.controlledxiu(this.form).then(res => {
            if (res.success) {
              this.$message({type: 'success', message: res.msg})
              this.visible = false
              this.refresher()
            } else {
              this.$message({type: 'warning', message: res.msg})
            }
          })
        }
      })
    },
    btnModify () { // 修改
      if (!this.selection) {
        this.$message({type: 'warning', message: '请选择数据'})
        return
      }
      this.title = '修改类别'
      // 判断是否是预制数据
      const str = JSON.stringify(this.selection)
      this.form = JSON.parse(str)
      this.visible = true
    },
    handleCheckChang: function (selection) {
      this.selection = selection
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 删除
    opendel () {
      if (!this.selection) {
        this.$message({type: 'warning', message: '请选择数据'})
      } else {
        if (this.selection.corp !== this.$store.getters.pk_gs) {
          this.$message({type: 'warning', message: '预置数据不可删除'})
          return
        }
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.linkAssets.BankAccount({
            id: this.selection.id,
            gsid: this.selection.gsid
          }).then(res => {
            // this.gettabDate()
            if (res.success) {
              this.$message({type: 'success', message: res.msg})
              this.refresher()
            } else {
              this.$message({type: 'warning', message: res.msg})
            }
          })
        })
      }
    },
    gettabDate () {
      this.loading = true
      this.$api.linkAssets.Accounts().then(res => {
        this.loading = false
        this.tableData = res.rows
      })
    },
    refresher () {
      this.gettabDate()
    }
  },
  created () {
    this.gettabDate()
  }
}
</script>

<style scoped lang="less">
header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  .Headleft {
    margin-left: 15px;
    font-size: 20px;
    color: #297fc2;
  }
  .Headright {
    margin-right: 15px;
  }
}
.contents {
  width: 99%;
  height: 90%;
  overflow: hidden;
  overflow-y: auto;
  margin-left: 10px;
  /* text-align: center; */
}
/deep/input::-webkit-outer-spin-button,
/deep/input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/deep/input[type="number"] {
  -moz-appearance: textfield;
}
/deep/.redbor {
  border: solid 1px red;
}
/deep/.gaybor {
  border: solid 1px #fff;
}
</style>
