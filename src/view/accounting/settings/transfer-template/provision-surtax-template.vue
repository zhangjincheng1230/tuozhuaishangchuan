<!--计提附加税模板-->
<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div style="float: left; width: 840px; line-height: 25px;">
          计提附加税是根据当期结转增值税为计税依据，乘以对应税种的税率计提出附加税凭证，根据地区不同可调整税率，计税基数不是以增值税为依据请手工填制凭证
        </div>
        <div class="kj-button-group">
          <el-button @click="defaultSet">默认设置</el-button>
          <el-button @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
      <div class="kj-main">
        <el-form :model="formData" ref="formRef">
          <el-table
            :data="tableData"
            class="edit-table"
            style="width: 100%">
            <el-table-column
              prop="index"
              align="center"
              width="50">
              <template #default="{ row, $index }">
                <div class="row-operate">
                  <i class="el-icon-circle-plus-outline" title="增行"  @click="addRow($index)"></i>
                  <i class="el-icon-remove-outline" title="删行" @click="delRow($index)"></i>
                </div>
                {{ ($index + 1) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="tax_name"
              label="计提税种"
              header-align="center"
              width="185">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'rows.' + $index+'.tax_name'" :rules="rules.taxName">
                  <el-autocomplete
                    style="width: 100%;"
                    v-model.trim="row.tax_name"
                    :fetch-suggestions="taxSuggest"
                    placeholder="请输入税种名称"
                    @select="onTaxChange(row)">
                  </el-autocomplete>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              prop="jfkmmc"
              label="借方科目"
              header-align="center"
              width="300">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'rows.' + $index+'.jfkm_id'" :rules="rules.jfkm">
                  <el-select
                    style="width: 100%"
                    v-model="row.jfkm_id"
                    filterable>
                    <el-option
                      v-for="item in subjectRef"
                      :key="item.id"
                      :label="item.codefullname"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              prop="dfkmmc"
              label="贷方科目"
              header-align="center"
              width="300">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'rows.' + $index+'.dfkm_id'" :rules="rules.dfkm">
                  <el-select
                    style="width: 100%"
                    v-model="row.dfkm_id"
                    filterable>
                    <el-option
                      v-for="item in subjectRef"
                      :key="item.id"
                      :label="item.codefullname"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              prop="tax"
              label="税率(%)"
              header-align="center"
              width="120">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'rows.' + $index + '.tax'" :rules="rules.rate">
                  <template v-if="row.tax_name === '城建税'">
                    <el-select
                      v-model="row.tax">
                      <el-option
                        v-for="rate in cbRate"
                        :key="rate"
                        :label="rate"
                        :value="rate">
                      </el-option>
                    </el-select>
                  </template>
                  <template v-else-if="row.tax_name === '地方教育费附加'">
                    <el-autocomplete
                      v-model="row.tax"
                      @blur="inputTaxRate($event, row)"
                      :fetch-suggestions="rateSuggest">
                    </el-autocomplete>
                  </template>
                  <template v-else-if="row.tax_name === '教育费附加'">
                    <el-input v-model="row.tax" :disabled="true"></el-input>
                  </template>
                  <template v-else>
                    <el-input-number
                      :controls="false"
                      :precision="2"
                      :min="0.01" :max="100"
                      v-model="row.tax"></el-input-number>
                  </template>
                </TableFormItem>
              </template>
            </el-table-column>
            <el-table-column
              prop="memo"
              header-align="center"
              label="摘要">
              <template #default="{ row, $index }">
                <TableFormItem :prop="'rows.' + $index+'.memo'" :rules="rules.memo">
                  <el-input v-model.trim="row.memo"></el-input>
                </TableFormItem>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import TableFormItem from '@/components/TableFormItem/index'

const taxItems = [
  {
    code: '001',
    value: '城建税'
  }, {
    code: '002',
    value: '教育费附加'
  }, {
    code: '003',
    value: '地方教育费附加'
  }, {
    code: '004',
    value: '地方水利建设基金'
  }
]
export default {
  name: 'provision-surtax-template',
  components: {
    TableFormItem
  },
  data () {
    return {
      loading: true,
      savedData: '[]',
      tableData: [],
      cbRate: [7, 5, 1],
      localEduAdd: [{
        value: '2'
      }, {
        value: '1.5'
      }, {
        value: '1'
      }],
      taxItems: taxItems,
      rules: {
        taxName: [
          { required: true, message: '请输入税种名称' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符' }
        ],
        jfkm: [
          { required: true, message: '请选择借方科目' }
        ],
        dfkm: [
          { required: true, message: '请选择贷方科目' }
        ],
        rate: [
          { required: true, message: '请输入税率', trigger: 'blur' }
        ],
        memo: [
          { required: true, message: '请输入摘要', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    subjectRef () {
      return this.$store.getters.subSubjectRef
    },
    formData () {
      return {
        rows: this.tableData
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData (preset) {
      this.$api.BasicSettingApi.TransferTemplate.getSurtaxTemplate({
        preset: preset ? 'Y' : 'N'
      }).then(res => {
        this.loading = false
        if (res.success) {
          this.loadTableData(res.rows)
        } else {
          this.tableData = []
          this.$message.error(res.msg)
        }
      }).catch(e => {
        this.loading = false
      })
    },
    loadTableData (rows) {
      // ElAutocomplete 只允许String类型
      rows.forEach(row => {
        if (row.tax_name === '地方教育费附加') {
          row.tax = String(row.tax)
        }
      })
      this.tableData = rows
      this.savedData = JSON.stringify(rows)
    },
    defaultSet () {
      this.fetchData(true)
    },
    save () {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.TransferTemplate.saveSurtaxTemplate(this.tableData).then(res => {
            if (res.success) {
              this.$message.success('保存成功')
              this.loadTableData(res.rows)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    cancel () {
      this.tableData = JSON.parse(this.savedData)
    },
    addRow (index) {
      this.tableData.splice(index + 1, 0, {})
    },
    delRow (index) {
      if (this.tableData.length === 1) {
        return
      }
      this.tableData.splice(index, 1)
    },
    onTaxChange (row) {
      switch (row.tax_name) {
        case '城建税':
          row.tax = this.cbRate[0]
          break
        case '教育费附加':
          row.tax = 3
          break
        case '地方教育费附加':
          row.tax = this.localEduAdd[0].value
          break
        case '地方水利建设基金':
          row.tax = 0.5
          break
        default:
          break
      }
    },
    inputTaxRate: function (e, row) {
      var val = parseFloat(e.target.value)
      if (isNaN(val)) {
        val = '0.01'
      } else {
        if (val < 0.01) {
          val = 0.01
        } else if (val > 100) {
          val = 100
        }
        val = val.toFixed(2).replace(/(\.\d*[1-9]?)0+$/, '$1').replace(/\.0+$/, '')
      }
      e.target.value = val
      row.tax = val
    },
    taxSuggest (queryString, cb) {
      const suggestions = []
      this.taxItems.forEach(item => {
        if (this.tableData.find(row => row.tax_name === item.value) === undefined &&
          (!queryString || item.value.indexOf(queryString) > -1)) {
          suggestions.push(item)
        }
      })
      cb(suggestions)
    },
    rateSuggest (queryString, cb) {
      cb(this.localEduAdd)
    }
  }
}
</script>
