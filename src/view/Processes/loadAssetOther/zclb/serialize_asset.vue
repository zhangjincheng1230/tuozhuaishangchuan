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
            :row-class-name="tableRowClassName"
            @row-click="remove"
            row-key="id"
            border
            default-expand-all
            highlight-current-row
            v-loading="loading"
            element-loading-text="数据处理中，请稍候..."
            element-loading-spinner="el-icon-loading"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
            <el-table-column
              prop="code" label="编号"
              sortable width="120" header-align="center" align="left" show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="name" header-align="center" align="left" label="名称" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="zjfs" label="折旧方式" width="140" header-align="center" align="left">
              <template slot-scope="sope">
                <span style="text-align:right">{{sope.row.zjfs| formatZjfs}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="czl" header-align="center" align="right" label="残值率" width="130">
              <template slot-scope="sope">
                <span style="text-align:right">{{sope.row.czl| forThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ulimit" header-align="center" align="right" label="使用年限(月)" width="130"></el-table-column>
            <el-table-column prop="memo" header-align="center" align="left" label="备注" width="180"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="visible"  width="400px" @opened="dilogOpen"  :close-on-click-modal="false"
               :modal="false" :close-on-press-escape="false" @closed="dialogClosed">
      <span style="display: block;color: red;margin-bottom: 20px;margin-top:-10px">编码规则xx-xx-xx</span>
      <el-form  :model="form" ref="validateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="类别编码" prop="code"
          :rules="[
            { required: true, message: '类别编码不能为空'},
          ]">
          <el-input ref="coderef" :disabled="bdisable" v-model="form.code" @change="zjfsap"  style="width:210px"></el-input>
        </el-form-item>
        <el-form-item
          label="类别名称" prop="name"
          :rules="[
            { required: true, message: '类别名称不能为空'},
          ]">
          <el-input :disabled="bdisable" v-model="form.name" style="width:210px"></el-input>
        </el-form-item>
        <el-form-item
          label="资产属性"
          prop="prop"
          :rules="[
            { required: true, message: '资产属性不能为空'},
          ]">
          <el-select :disabled="bdisable" v-model="form.prop" placeholder="请选择" style="width:210px" >
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
          label="折旧方式"
          prop="zjfs"
          :rules="[
            { required: true, message: '折旧方式不能为空'},
          ]">
          <el-select v-model="form.zjfs" placeholder="请选择" style="width:210px">
            <el-option
              v-for="item in zjType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预计净残值"
          prop="czl"
          :rules="[]">
          <el-input-number  style="width:210px"
            placeholder="请输入内容"
            v-model="form.czl"
            :precision="2"
            :controls="false"
            :max="0.99"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="使用年限"
          prop="ulimit"
          :rules="[]">
          <el-input-number placeholder="请输入内容" style="width:210px"
            v-model="form.ulimit" :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="memo"
          :rules="[]">
          <el-input
            style="width:210px"
            placeholder="请输入内容"
            v-model="form.memo"
            :controls="false"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="submitSave()">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Header from '../../components/Header'
import AddTable from '../../components/AddTable'
import assetMixin from '@/filters/asset'
import { ASSET_PROP, ZJ_TYPE } from '@/constants/asset'
export default {
  mixins: [assetMixin],
  name: 'zclb',
  data () {
    return {
      values: '',
      form: {
        code: '', // 类别编码
        name: '', // 类别名称
        prop: null, // 资产属性
        zjfs: '', // 折旧方式
        czl: '', // 预计净残值
        ulimit: '', // 使用年限
        memo: '' // 备注
      },
      title: '新增类别',
      visible: false,
      tableData: [],
      loading: false,
      assetProp: ASSET_PROP,
      zjType: ZJ_TYPE,
      expanded: false,
      lace: false,
      bdisable: false // 是否可以编辑
    }
  },
  components: {
    Header,
    AddTable
  },
  methods: {
    zjfsap (val, va1) {
      if (val.substring(1, 2) === '1') {
        this.form.prop = 0 // 固定资产
      } else if (val.substring(1, 2) === '2') {
        this.form.prop = 1 // 无形资产
      } else if (val.substring(1, 2) === '4') {
        this.form.prop = 3 // 待摊费用
      } else {
        this.$message({type: 'error', message: '编码对应的资产属性不存在'})
      }
    },
    addtable () {
      this.title = '新增类别'
      this.visible = true
      this.bdisable = false
      this.form = {code: '', prop: null}
      // this.$refs.coderef.$el.querySelector('input').focus()
    },
    dilogOpen () {
      // this.$refs.coderef.$el.querySelector('input').focus()
      this.$refs.coderef.focus()
    },
    dialogClosed () {
      this.$refs.validateForm.resetFields()
    },
    submitSave () { // 确定按钮
      this.$refs.validateForm.validate((rs) => {
        if (rs) {
          this.$api.linkAssets.IAssetExporter(this.form).then(res => {
            if (res.success) {
              this.$message({type: 'success', message: res.msg})
              this.visible = false
              this.refresher()
            } else {
              this.$message({type: 'error', message: res.msg})
            }
          })
        }
      })
    },
    btnModify () { // 修改
      this.title = '修改类别'
      // 判断是否是预制数据
      if (this.selection.corp !== this.$store.getters.getLoginCorpId) {
        this.bdisable = true
      } else {
        this.bdisable = false
      }
      const str = JSON.stringify(this.selection)
      this.form = JSON.parse(str)
      this.visible = true
    },
    remove (row, column, event) {
      if (row != null) {
        this.selection = row
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    // 删除
    opendel () {
      if (!this.selection) {
        this.$message({type: 'error', message: '请选择数据'})
      } else {
        if (this.selection.corp !== this.$store.getters.currentCorp.pk_gs) {
          this.$message({type: 'error', message: '预置数据不可删除'})
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
          this.$api.linkAssets.shortcutToAssetId({ id: this.selection.id }).then(res => {
            this.gettabDate()
            if (res.success) {
              this.$message({type: 'success', message: res.msg})
              this.refresher()
            } else {
              this.$message({type: 'error', message: res.msg})
            }
          })
        })
      }
    },
    gettabDate () {
      this.loading = true
      this.$api.linkAssets.Attribute().then(res => {
        this.loading = false
        this.tableData = res
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
