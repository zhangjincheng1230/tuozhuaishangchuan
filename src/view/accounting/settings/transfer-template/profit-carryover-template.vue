<!--利润结转模板-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div class="kj-button-group">
          <el-button @click="saveTemp">保存</el-button>
          <el-button @click="delTemp">删除</el-button>
          <el-button @click="fetchData">刷新</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          style="height: 100%">
          <el-table
            :data="tableData"
            v-loading="loading"
            element-loading-text="数据加载中，请稍候..."
            element-loading-spinner="el-icon-loading"
            stripe
            border
            height="100%"
            class="edit-table"
            style="width: 100%">
            <el-table-column
              align="center"
              width="150">
              <template #default="{ $index }">
                <template v-if="$index === 0">
                  转出科目
                </template>
                <template v-else>
                  转入科目
                </template>
              </template>
            </el-table-column>
            <el-table-column
              property="accname"
              label="科目"
              header-align="center"
              width="200">
              <template #default="{ $index }">
                <template v-if="$index === 0">
                  <TableFormItem prop="zckm_id">
                    <el-select
                      v-model="formData.zckm_id"
                      filterable
                      style="width: 100%">
                      <el-option
                        v-for="item in subjectRef"
                        :key="item.id"
                        :label="item.codename"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </TableFormItem>
                </template>
                <template v-else>
                  <TableFormItem prop="zrkm_id">
                    <el-select
                      v-model="formData.zrkm_id"
                      filterable
                      style="width: 100%">
                      <el-option
                        v-for="item in subjectRef"
                        :key="item.id"
                        :label="item.codename"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </TableFormItem>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              property="outaccname"
              label="方向"
              header-align="center"
              width="200">
              <template #default="{ $index }">
                <template v-if="$index === 0">
                  <el-select
                    v-model="formData.outdirect"
                    style="width: 100%">
                    <el-option
                      v-for="item in directionRef"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select
                    v-model="formData.indirect"
                    style="width: 100%">
                    <el-option
                      v-for="item in directionRef"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              property="mark"
              label="摘要"
              header-align="center"
              width="200">
              <template #default="{ $index }">
                <template v-if="$index === 0">
                  <TableFormItem prop="zyc" :rules="rules.zy">
                    <el-input v-model="formData.zyc"></el-input>
                  </TableFormItem>
                </template>
                <template v-else>
                  <TableFormItem prop="zy" :rules="rules.zy">
                    <el-input v-model="formData.zy"></el-input>
                  </TableFormItem>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              property="mark"
              label="备注"
              header-align="center"
              width="200">
              <template #default="{ $index }">
                <template v-if="$index === 0">
                  <el-input v-model="formData.bzc"></el-input>
                </template>
                <template v-else>
                  <el-input v-model="formData.bz"></el-input>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { DIRECTIONS } from '@/constants'
import TableFormItem from '@/components/TableFormItem'

export default {
  name: 'profit-carryover-template',
  components: {
    TableFormItem
  },
  data () {
    return {
      loading: true,
      tableData: [{}, {}],
      formData: {},
      directionRef: DIRECTIONS,
      rules: {
        zckm_id: [
          { required: true, message: '请选择转出科目', trigger: 'change' }
        ],
        zrkm_id: [
          { required: true, message: '请选择转入科目', trigger: 'change' }
        ],
        zy: [
          { required: true, message: '请输入摘要', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    subjectRef () {
      return this.$store.getters.subSubjectRef
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$api.BasicSettingApi.TransferTemplate.getProfitTemplate().then(result => {
        this.loading = false
        if (result.rows) {
          if (result.rows[0].outdirect === undefined) {
            result.rows[0].outdirect = 0
          }
          this.formData = result.rows[0]
        }
      }).catch(e => {
        this.loading = false
      })
    },
    delTemp () {
      if (this.formData.pk_corp !== '000001') {
        this.$confirm('确定删除?', '提示', {
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.BasicSettingApi.TransferTemplate.deleteProfitTemplate({
            mainid: this.formData.mainid,
            pk_corp: this.formData.pk_corp
          }).then(result => {
            if (result.success) {
              this.$message.success(result.msg)
              this.formData = {
                outdirect: 0,
                indirect: 1
              }
            } else {
              this.$message.error(result.msg)
            }
          })
        })
      } else {
        this.$message({
          showClose: true,
          message: '预置数据不可删除！',
          type: 'warning'
        })
      }
    },
    saveTemp () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.TransferTemplate.saveProfitTemplate(this.formData).then(result => {
            if (result.success) {
              this.$message.success(result.msg)
              this.formData = result.rows
            } else {
              this.$message.error(result.msg)
            }
          })
        }
      })
    },
    onDialogClosed () {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
