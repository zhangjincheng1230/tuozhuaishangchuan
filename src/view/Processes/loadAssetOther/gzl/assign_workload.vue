<!--工作量-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="query-info">
          <div  style = "margin-right: 10px">期间：
            <el-popover
              placement="bottom-start"
              title="工作量"
              width="450"
              popper-class="query-popover"
              v-model="visiblePopover">
              <el-form ref="form" :model="queryForm" label-width="auto">
                <el-form-item label="期间：">
                  <el-date-picker
                    v-model="queryForm.period"
                    type="month"
                    placeholder="选择月"
                    value-format="yyyy-MM"
                    :picker-options="monthPickerOptions"
                    style="width:72%; margin-right:15px;"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="公司：">
                  <el-select
                    v-model="queryForm.corpId"
                    filterable
                    placeholder="请选择公司"
                    style="width:72%; margin-right:15px;"
                  >
                    <el-option
                      v-for="item in corplist"
                      :key="item.pk_gs"
                      :label="item.uname"
                      :value="item.pk_gs"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="query-footer">
                <div class="kj-button-group">
                  <el-button size="small"  @click="queryCancel" >取消</el-button>
                  <el-button size="small" type="primary" @click="query(1)">确定</el-button>
                </div>
              </div>
              <span class="query-period" slot="reference">
                  {{datevalue}}
              </span>
            </el-popover>
          </div>
          <span class="query-corp">公司: {{corpObj.uname}}</span>
        </div>
        <div class="kj-button-group">
          <el-button v-if="!edit" @click="onEdit">修改</el-button>
          <el-button v-if="!edit" @click="onrefresh(1)">刷新</el-button>
          <el-button v-if="edit" @click="save">保存</el-button>
          <el-button v-if="edit" @click="cancel">取消</el-button>
          <el-button v-if="edit" @click="jichengbtn">继承上月</el-button>
        </div>
      </div>
      <div class="kj-main">
        <vxe-table
          ref="multipleTable"
          @current-change="rowchange"
          border
          resizable
          show-overflow
          height="100%"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'row', showIcon: false, autoClear: false, activeMethod:activeEdit}"
        >
          <vxe-table-column type="selection" width="46"></vxe-table-column>
          <vxe-table-column title="卡片编号" field="ascode" header-align="center" align="left"  width="110"></vxe-table-column>
          <vxe-table-column field="zcbm" header-align="center" align="left"   title="资产编号" width="110"></vxe-table-column>
          <vxe-table-column field="asname" header-align="center" align="left"   title="资产名称" width="110" ></vxe-table-column>
          <vxe-table-column field="gzldw" header-align="center" align="left"   title="工作量单位" width="110" ></vxe-table-column>
          <vxe-table-column field="gzzl"  title="总工作量"  header-align="center" align="right" width="150"
                            :edit-render=" {name: 'input', attrs: {type: 'number'}}"
                            :formatter="repformny">
            <template v-slot:edit="scope">
              <el-input-number size="small" :precision="2" disabled :controls="false" v-model="scope.row.gzzl" placeholder="请输入内容">
              </el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column field="syljgzl" title="上月累计工作量" width="150"  header-align="center" align="right"
                            :edit-render=" {name: 'input', attrs: {type: 'number'}}" :formatter="repformny">
            <template v-slot:edit="scope">
              <el-input-number size="small" :precision="2" disabled :controls="false" v-model="scope.row.syljgzl" placeholder="请输入内容">
              </el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column field="bygzl" title="本月工作量"  header-align="center" align="right"  width="150"
                            :edit-render=" {name: 'input', attrs: {type: 'number'}}" :formatter="repformny">
            <template v-slot:edit="scope" >
              <el-input-number size="small" :precision="2" :controls="false" v-model="scope.row.bygzl" placeholder="请输入内容"
                               @change="handleEdit(arguments[0], arguments[1],scope.$index, scope.row, 'bygzl')" :formatter="repformny">
              </el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column field="ljgzl" title="累计工作量"   header-align="center" align="right" width="150"
                            :edit-render=" {name: 'input', attrs: {type: 'number'}}" :formatter="repformny">
            <template v-slot:edit="scope" >
              <el-input-number size="small" :precision="2" disabled :controls="false" v-model="scope.row.ljgzl" placeholder="请输入内容">
              </el-input-number>
            </template>
          </vxe-table-column>
          <vxe-table-column field="sygzl" title="剩余工作量"  header-align="center" align="right" width="150"
                            :edit-render=" {name: 'input', attrs: {type: 'number'}}" :formatter="repformny">
            <template v-slot:edit="scope" >
              <el-input-number size="small" :precision="2" disabled :controls="false" v-model="scope.row.sygzl" placeholder="请输入内容">
              </el-input-number>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header'
import {accAdd, accSubtr} from '@/utils'
import datePickerMixin from '@/mixins/date-picker'
export default {
  name: 'zzl',
  mixins: [datePickerMixin],
  data () {
    return {
      datevalue: this.$store.getters.getLoginDate.slice(0, this.$store.getters.getLoginDate.length - 3),
      tableData: [],
      dialogVisible: false,
      selection: {},
      edit: false, // 是否编辑
      loading: false,
      queryForm: {
        corpId: this.$store.getters.currentCorp.pk_gs, // 公司主键
        period: this.$store.getters.getLoginDate.slice(0, this.$store.getters.getLoginDate.length - 3)
      },
      corplist: this.$store.getters.corps,
      visiblePopover: false,
      corpObj: ''
    }
  },
  components: {
    Header
  },
  methods: {
    repformny (obj) {
      let cellValue = obj.cellValue
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      return this.$options.filters.forThousands(cellValue)
    },
    query (val) {
      this.loading = true
      this.edit = false
      this.$api.linkAssets.querying(this.queryForm).then(res => {
        this.loading = false
        this.visiblePopover = false
        this.tableData = res.rows
        if (val === 1) {
          if (res.success) {
            this.$message({type: 'success', message: res.msg})
          } else {
            this.$message({type: 'error', message: res.msg})
          }
        }
      })
      this.datevalue = this.queryForm.period
      this.corpObj = this.corplist.find(item => {
        return item.pk_gs === this.queryForm.corpId
      })
    },
    queryCancel: function () {
      this.visiblePopover = false
    },
    // 行选择
    rowchange (row) {
      if (row) {
        this.selection = row
        this.$refs.multipleTable.setSelection(row, true)
      }
    },
    // 保存
    save () {
      this.$api.linkAssets.coreworkloads({list: JSON.stringify(this.tableData)}).then(res => {
        if (res.success) {
          this.$message({type: 'success', message: res.msg})
          this.edit = false
          this.onrefresh(-1)
        } else {
          this.$message({type: 'error', message: res.msg})
        }
      })
    },
    // 是否允许编辑
    activeEdit () {
      console.log(this.edit)
      return this.edit
    },
    //  编辑
    onEdit () {
      // 是否计提折旧
      if (this.tableData && this.tableData.length > 0) {
        for (const t of this.tableData) {
          if (t.isjtzj === '是') {
            this.$message({type: 'warning', message: '该月已计提折旧，不能编辑'})
            return
          }
        }
      }
      this.edit = true
    },
    // 取消
    cancel () {
      this.edit = false
      this.query(1)
    },
    // 继承上月
    jichengbtn () {
      this.$api.linkAssets.coreworkloadsjc(this.queryForm).then(res => {
        let bdata = false
        if (res.success) {
          if (res.rows) {
            for (const t of this.tableData) {
              for (const t1 of res.rows) {
                if (t.pk_assetcard === t1.pk_assetcard) {
                  bdata = true
                  t.bygzl = t1.bygzl // 更具资产id带出本月工作量
                }
              }
            }
          }
          if (!bdata) {
            this.$message({type: 'error', message: '无上月数据,请手工填写'})
          }
        } else {
          this.$message({type: 'error', message: res.msg})
        }
      })
    },
    // 计算工作量
    handleEdit (newvalue, oldvalue, index, row, columnkey) { // 字段计算
      let bygzl = row.bygzl
      let syljgzl = row.syljgzl
      let sum = accAdd(bygzl, syljgzl)
      let gzzl = row.gzzl
      row.ljgzl = sum
      let ljgzl = row.ljgzl
      let sub = accSubtr(gzzl, sum)
      row.sygzl = sub
    },
    // 刷新
    onrefresh (val) {
      this.query(val)
    }
  },
  created () {
    this.query(1)
  }

}
</script>

<style scoped lang="less">
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
/deep/.contents .el-input__inner {
  border: none;
  background: #ffffff;
}
</style>
