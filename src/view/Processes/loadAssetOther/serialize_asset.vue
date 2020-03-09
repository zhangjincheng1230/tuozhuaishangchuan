<!-- 使用zclb下的vue，目前这个暂时不用 -->
<template>
  <div
    style="position: relative; border: 1px #ddd solid;background:rgba(255,255,255,1);height: 100%"
  >
    <header>
      <div class="Headleft"></div>
      <div class="Headright">
        <el-button @click="addtable">新增</el-button>
        <el-button @click="btnModify">修改</el-button>
        <el-button @click="opendel">删除</el-button>
        <el-button @click="refresher">刷新</el-button>
      </div>
    </header>
    <div class="contents">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;height:100%"
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
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column
          prop="code"
          label="编号"
          sortable
          width="120"
          header-align="center"
          align="left"
        ></el-table-column>
        <el-table-column prop="name" header-align="center" align="left" label="名称" width="180"></el-table-column>
        <el-table-column label="折旧方式" width="140" header-align="center" align="left">
          <template slot-scope="sope">
            <span style="text-align:right">{{sope.row.czl|fomrzjfs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="czl" header-align="center" align="right" label="残值率" width="130"></el-table-column>
        <el-table-column
          prop="ulimit"
          header-align="center"
          align="right"
          label="使用年限(月)"
          width="130"
        ></el-table-column>
        <el-table-column prop="memo" header-align="center" align="left" label="备注" width="180"></el-table-column>
      </el-table>
    </div>
    <div
      class="mark"
      style="width:100%;height:100%; background:rgba(0,0,0,0.3); position: absolute; left:0; top:0; z-index:900;"
      v-if="openForm"
    ></div>
    <AddTable v-if="openForm">
      <span slot="addHead" style="margin-left:14px;font-size:16px">新增</span>
      <span slot="opendown" @click="openForm=false" style="padding-right:14px; cursor:pointer">X</span>
      <div slot="addMain" style="font-size:14px;">
        <p style="color:red;margin-left:10px;font-size:16px;">编码规则xx-xx-xx</p>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px;margin-top:10px;"
        >
          <span style="width:23%;text-align:right;">
            <b style="color:red;margin-right:8px;   ">*</b>类别编码
          </span>
          <el-input
            v-model="Category"
            style="width:50%;height:35px; line-height:34px; margin-top:10px;margin-left:14px;"
            @change="zjfsap"
          ></el-input>
        </div>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px"
        >
          <span style="width:23%;text-align:right;">
            <b style="color:red;margin-right:8px;">*</b>类别名称
          </span>
          <el-input
            placeholder="请输入内容"
            v-model="Categoryname"
            style="width:50%;height:35px; line-height:34px; margin-top:10px;margin-left:14px;"
          ></el-input>
        </div>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px"
        >
          <span style="width:23%;text-align:right;">
            <b style="color:red;margin-right:8px;">*</b>资产属性
          </span>
          <el-select v-model="Subject" placeholder="请选择" style="width:50%;margin-left:14px;">
            <el-option
              v-for="item in subPropertyOf"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px"
        >
          <span style="width:23%;text-align:right;">
            <b style="color:red;margin-right:8px;   ">*</b>折旧方式
          </span>
          <el-select v-model="Depreciation" placeholder="请选择" style="width:50%;margin-left:14px;">
            <el-option
              v-for="item in wickedafterlife"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </div>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px"
        >
          <span style="width:23%;text-align:right;">预计净残值</span>
          <el-input-number
            placeholder="请输入内容"
            v-model="Salvage"
            style="width:50%;margin-left:14px;margin-top:10px;"
            :precision="2"
            :controls="false"
            :max="0.99"
          ></el-input-number>
        </div>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px"
        >
          <span style="width:23%;text-align:right;">使用年限</span>
          <el-input
            placeholder="请输入内容"
            v-model="service"
            style="width:50%;margin-left:14px;"
            oninput="value=value.replace(/[^\d]/g, '')"
          ></el-input>
        </div>
        <div
          style="width:100%; height:43px; display:flex; justify-content: center; line-height:55px"
        >
          <span style="width:23%;text-align:right;">备注</span>
          <el-input placeholder="请输入内容" v-model="Remarks" style="width:50%;margin-left:14px;"></el-input>
        </div>
      </div>
      <div slot="addFoot">
        <el-button
          type="primary"
          @click="Determine(Category, Categoryname, Subject, Depreciation, Salvage, service, Remarks)"
        >确定</el-button>
        <el-button type="primary" @click="openForm=false;expanded = false">取消</el-button>
      </div>
    </AddTable>
  </div>
</template>

<script>
import Header from '../components/Header'
import AddTable from '../components/AddTable'
import * as MsgUtil from '../msg-util'
export default {
  name: 'zclb',
  data () {
    return {
      values: '',
      Category: '', // 类别编码
      Categoryname: '', // 类别名称
      Subject: '', // 科目属性
      Depreciation: '', // 折旧方式
      Salvage: '', // 预计净残值
      service: '', // 使用年限
      Remarks: '', // 备注
      InputJudgements: true,
      Inputval: true,
      tableData: [],
      openForm: false,
      loading: false,
      wickedafterlife: [
        { value: '平均年限法' },
        { value: '工作量法' },
        { value: '双倍余额递减法' },
        { value: '年数总和法' }
      ],
      subPropertyOf: [
        { value: '固定资产' },
        { value: '无形资产' },
        { value: '待摊费用' }
      ],
      Subjectkeys: 0,
      Depreciationkeys: 0,
      expanded: false,
      lace: false
    }
  },
  components: {
    Header,
    AddTable
  },
  methods: {
    zjfsap (val) {
      console.log(val.substring(0, 2))
      if (val.substring(0, 2) === '01') {
        this.Subject = '固定资产'
      } else if (val.substring(0, 2) === '02') {
        this.Subject = '无形资产'
      } else if (val.substring(0, 2) === '04') {
        this.Subject = '待摊费用'
      } else {
        this.$message({
          type: 'error',
          message: '编码对应的资产属性不存在'
        })
      }
    },
    addtable () {
      this.openForm = true
      this.expanded = false
      this.Category = ''; this.Categoryname = ''; this.Subject = ''; this.Depreciation = ''; this.Salvage = ''; this.service = ''; this.Remarks = ''
    },
    Determine (Category, Categoryname, Subject, Depreciation, Salvage, service, Remarks) { // 确定按钮
      const loading = MsgUtil.loading(this, '正在加载...')
      this.lace = false
      if (this.expanded === false) {
        if (Subject === '固定资产') {
          this.Subjectkeys = 0
        } else if (Subject === '无形资产') {
          this.Subjectkeys = 1
        } else if (Subject === '待摊费用') {
          this.Subjectkeys = 2
        }
        if (Depreciation === '平均年限法') {
          this.Depreciationkeys = 0
        } else if (Depreciation === '工作量法') {
          this.Depreciationkeys = 1
        } else if (Depreciation === '双倍余额递减法') {
          this.Depreciationkeys = 2
        } else if (Depreciation === '年数总和法') {
          this.Depreciationkeys = 3
        }
        if (this.Category === '' || this.Categoryname === '' || this.Subject === '' || this.Depreciation === '') {
          loading.close()
          this.openForm = true
          this.$message({
            type: 'error',
            message: '请输入必输项'
          })
        } else {
          this.$api.linkAssets.IAssetExporter({
            code: Category,
            name: Categoryname,
            zcsxn: this.Subjectkeys,
            zjfs: this.Depreciationkeys,
            czl: Salvage === '' ? 0.00 : Salvage,
            ulimit: service,
            memo: Remarks
          }).then(res => {
            loading.close()
            if (res.success) {
              this.gettabDate()
              this.Category = ''; this.Categoryname = ''; this.Subject = ''; this.Depreciation = ''; this.Salvage = ''; this.service = ''; this.Remarks = ''
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
          this.openForm = false
        }
      } else {
        if (Subject === '固定资产') {
          this.Subjectkeys = 0
        } else if (Subject === '无形资产') {
          this.Subjectkeys = 1
        } else if (Subject === '待摊费用') {
          this.Subjectkeys = 2
        }
        if (Depreciation === '平均年限法') {
          this.Depreciationkeys = 0
        } else if (Depreciation === '工作量法') {
          this.Depreciationkeys = 1
        } else if (Depreciation === '双倍余额递减法') {
          this.Depreciationkeys = 2
        } else if (Depreciation === '年数总和法') {
          this.Depreciationkeys = 3
        }
        this.$api.linkAssets.IAssetExporter({
          code: Category,
          name: Categoryname,
          zcsxn: this.Subjectkeys,
          zjfs: this.Depreciationkeys,
          czl: Salvage === '' ? 0.00 : Salvage,
          ulimit: service,
          memo: Remarks,
          id: this.selection.id
        }).then(res => {
          loading.close()
          if (res.success) {
            this.gettabDate()
            this.Category = ''; this.Categoryname = ''; this.Subject = ''; this.Depreciation = ''; this.Salvage = ''; this.service = ''; this.Remarks = ''
            this.$message({
              type: 'success',
              message: res.msg
            })
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
        this.openForm = false
      }
    },
    btnModify () { // 修改
      if (!this.lace) {
        this.$message({
          type: 'error',
          message: '请选择数据'
        })
      } else {
        if (this.Subjectkeys === 0) {
          this.Subject = '固定资产'
        } else if (this.Subjectkeys === 1) {
          this.Subject = '无形资产'
        } else if (this.Subjectkeys === 2) {
          this.Subject = '待摊费用'
        }
        if (this.Depreciationkeys === 0) {
          this.Depreciation = '平均年限法'
        } else if (this.Depreciationkeys === 1) {
          this.Depreciationkeys = '工作量法'
        } else if (this.Depreciationkeys === 2) {
          this.Depreciationkeys = '双倍余额递减法'
        } else if (this.Depreciationkeys === 3) {
          this.Depreciationkeys = '年数总和法'
        }
        this.openForm = true
        this.expanded = true
        this.Category = this.selection.code
        this.Categoryname = this.selection.name
        this.Subjectkeys = this.selection.zcsxn
        this.Depreciationkeys = this.selection.zjfs
        this.Salvage = this.selection.czl
        this.service = this.selection.ulimit
        this.Remarks = this.selection.memo
      }
    },
    remove (row, column, event) {
      if (row != null) {
        this.selection = row
        this.lace = true
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row

      row.index = rowIndex
    },
    opendel () { // 删除
      if (!this.lace) {
        this.$message({
          type: 'error',
          message: '请选择数据'
        })
      } else {
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
              this.$message({
                type: 'success',
                message: res.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
          this.lace = false
          this.selection = {}
        })
      }
    },
    bodycolor () {
      if (this.Category === '') {
        this.InputJudgements = true
      } else {
        this.InputJudgements = false
      }
    },
    bodycolorone () {
      if (this.Categoryname === '') {
        this.Inputval = true
      } else {
        this.Inputval = false
      }
    },
    gettabDate () {
      this.loading = true
      this.$api.linkAssets.Attribute().then(res => {
        this.loading = false
        this.tableData = res
      })
    },
    inpnumber (val) {
      // this.Salvage = val.replace(/[^\d]/g, '')
      if (val >= 1) {
        this.Salvage = 0.99
      }
      this.Salvage = Number(val).toFixed(2)
    },
    refresher () {
      this.gettabDate()
    }
  },
  filters: {
    fomrzjfs (val) {
      return val === 0 ? '平均年限法' : val === 1 ? '工作量法' : val === 2 ? '双倍余额递减法' : '年数总和法'
    }
  },
  created () {
    this.$bus.$on('openForm', (data) => {
      this.openForm = data
    })
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
