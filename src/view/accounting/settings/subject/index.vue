<template>
  <div class="app-main">
    <div class="kj-container">
      <div class="kj-head">
        <div style="float: left">
          <el-autocomplete
            v-model="queryString"
            ref="queryInput"
            select-when-unmatched
            highlight-first-item
            :fetch-suggestions="querySearch"
            value-key="codefullname"
            @select="navToSearchSubject"
            placeholder="请输入编码或名称,按Enter键定位"
            class="search-input">
            <template #suffix>
              <i class="el-input__icon el-icon-close" style="cursor: pointer" @click="clearSearchSubject"></i>
            </template>
            <template #append>
              <el-button icon="el-icon-search" @click="navToSearchSubject"></el-button>
            </template>
          </el-autocomplete>
        </div>
        <div class="kj-button-group">
          <el-button @click="addSubject">新增</el-button>
          <el-button @click="editSubject">修改</el-button>
          <el-button @click="deleteSubject">删除</el-button>
          <el-button @click="sealSubject" v-if="showSealButton">封存</el-button>
          <el-button @click="unsealSubject" v-else>取消封存</el-button>
          <el-button @click="refreshData">刷新</el-button>
          <el-button @click="openChildrenToAuxiliaryDialog">科目下级转辅助</el-button>
          <el-button @click="routerTo('km-qc')">科目期初</el-button>
          <el-button @click="routerTo('exchangerate')">外币汇率</el-button>
        </div>
      </div>
      <div class="kj-main"
           v-loading="loading"
           element-loading-text="数据加载中，请稍候..."
           element-loading-spinner="el-icon-loading">
        <div style="position: absolute; top: 10px; right: 20px; z-index: 1">
          <el-checkbox v-model="showSealedData">显示封存科目</el-checkbox>
        </div>
        <el-tabs v-model="activeName" style="height: 100%">
          <el-tab-pane
            v-for="category in categories"
            :label="category.label"
            :name="category.label"
            :key="category.value"
            lazy
            style="height: 100%">
            <SubjectTable
              ref="tableRef"
              :category-name="category.label"
              :tableData="subjectCategoryData[category.value]"
              @select="updateSealButton"></SubjectTable>
          </el-tab-pane>
          <el-tab-pane label="全部" name="全部" lazy style="height: 100%">
            <SubjectTable
              :tableData="subjectFullData"
              ref="allSubjectTable"
              category-name="全部"
              @select="updateSealButton"></SubjectTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <SubjectEditDialog
      :visible.sync="editFormVisible"
      :subject="formData"
      :isEdit="isEdit"
      @save="onSaved"></SubjectEditDialog>
    <el-dialog title="科目下级转辅助"
               :visible.sync="auxiliaryVisible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               @closed="onAuxiliaryDialogClosed"
               width="380px">
      <el-form
        :model="childrenToAuxiliaryParam"
        :rules="rules"
        ref="auxiliaryForm"
        label-width="auto">
        <el-form-item label="待选科目" prop="subjectId">
          <el-select
            filterable
            v-model="childrenToAuxiliaryParam.subjectId"
            @change="onSubjectChange" style="width: 100%">
            <el-option
              v-for="item in subjectNotLeaf"
              :key="item.id"
              :label="item.codefullname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="辅助项目" prop="auxiliaryType">
          <el-select
            v-model="childrenToAuxiliaryParam.auxiliaryType"
            style="width: 100%">
            <el-option
              v-for="item in auxiliaryTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="auxiliaryVisible = false">取 消</el-button>
          <el-button type="primary" @click="childrenToAuxiliary">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <BankAccountDialog
      :visible.sync="bankAccountVisible"
      :account="bankAccount"
      :subject="bankSubject"
      @save="onSaveBankAccount">
    </BankAccountDialog>
  </div>
</template>

<script>
import SubjectTable from './components/SubjectTable'
import SubjectEditDialog from './components/SubjectEditDialog'
import BankAccountDialog from '../bank-account/components/BankAccountDialog'
import {CATEGORY} from '@/constants/subject'
import {AUXILIARY_TYPE} from '@/constants/auxiliary-accounting'

export default {
  name: 'subject',
  components: {
    SubjectTable,
    SubjectEditDialog,
    BankAccountDialog
  },
  data () {
    return {
      loading: false,
      activeName: CATEGORY[0].label,
      queryString: '',
      subjectData: {},
      categories: CATEGORY,
      editFormVisible: false,
      showSealedData: false,
      showSealButton: true,
      isEdit: false,
      formData: null,
      // 科目下级转辅助参数
      childrenToAuxiliaryParam: {
        subjectId: '',
        auxiliaryType: ''
      },
      // 科目下级转辅助对话框显示
      auxiliaryVisible: false,
      bankAccountVisible: false,
      bankSubject: null,
      bankAccount: {},
      rules: {
        subjectId: [
          {required: true, message: '请选择科目', trigger: 'blur'}
        ],
        auxiliaryType: [
          {required: true, message: '请选择辅助项目', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    // 不包含封存科目
    subjectDataExcludeSealed () {
      let subjectData = JSON.parse(JSON.stringify(this.subjectData))
      const excludeSealedData = {}
      Object.entries(subjectData).forEach(([key, value]) => {
        excludeSealedData[key] = this.removeSealedData(value)
      })
      return excludeSealedData
    },
    subjectCategoryData () {
      return this.showSealedData ? this.subjectData : this.subjectDataExcludeSealed
    },
    subjectCategoryDataExpand () {
      let subjectCategoryData
      if (this.activeName === '全部') {
        subjectCategoryData = this.subjectFullData
      } else {
        let categoryType = this.categories.find(ct => ct.label === this.activeName).value
        subjectCategoryData = this.subjectCategoryData[categoryType]
      }
      let expandData = []
      this.expandSubject(subjectCategoryData, expandData)
      return expandData
    },
    subjectFullData () {
      let fullData = []
      this.categories.forEach(item => {
        if (this.subjectCategoryData[item.value]) {
          fullData = fullData.concat(this.subjectCategoryData[item.value])
        }
      })
      return fullData
    },
    auxiliaryTypes () {
      return this.$store.state.accounting.auxiliaryTypes
    },
    subjectNotLeaf () {
      return this.$store.getters.subjectRef.filter(item => item.yz === '否')
    }
  },
  created () {
    this.fetchData()
    this.$store.dispatch('fetchSubjectRefData')
  },
  methods: {
    refreshData () {
      this.fetchData().then(() => {
        this.$message.success('刷新成功')
      })
      this.$store.dispatch('fetchSubjectRefData')
    },
    fetchData () {
      return new Promise((resolve) => {
        this.loading = true
        this.$api.BasicSettingApi.Subject.getSubject().then((rs) => {
          if (rs.success) {
            this.subjectData = rs.rows
            this.$nextTick(() => {
              this.updateSealButton()
            })
            resolve()
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      })
    },
    querySearch (queryString, cb) {
      let suggestions = this.subjectCategoryDataExpand.filter(subject =>
        !queryString || subject.codefullname.indexOf(queryString) > -1)
      cb(suggestions)
    },
    clearSearchSubject () {
      this.queryString = ''
    },
    navToSearchSubject () {
      this.$refs.queryInput.activated = false
      if (this.queryString) {
        let currentSubject = this.getSelectedSubject()
        let currentName = currentSubject ? currentSubject.codefullname : null
        let index
        if (!currentName || currentName.indexOf(this.queryString) === -1) {
          index = this.subjectCategoryDataExpand.findIndex(subject =>
            subject.codefullname.indexOf(this.queryString) > -1)
        } else {
          if (this.queryString === currentName) {
            return
          }
          let currentIndex = this.subjectCategoryDataExpand.findIndex(subject =>
            subject.codefullname === currentName)
          let firstIndex = -1
          index = this.subjectCategoryDataExpand.findIndex((subject, idx) => {
            if (firstIndex === -1 && subject.codefullname.indexOf(this.queryString) > -1) {
              firstIndex = idx
            }
            return idx > currentIndex && subject.codefullname.indexOf(this.queryString) > -1
          })
          if (index === -1) {
            index = firstIndex
          }
        }
        if (index > -1) {
          let activeTable = this.getActiveTable()
          let tableWrapper = activeTable.$refs.table.$refs.bodyWrapper
          let target = tableWrapper.querySelector('table > tbody > tr:nth-child(' + (index + 1) + ')')
          activeTable.$refs.table.setCurrentRow(this.subjectCategoryDataExpand[index])
          tableWrapper.scrollTop = target.offsetTop
        }
      }
    },
    addSubject () {
      const subject = this.getSelectedSubject()
      if (subject) {
        if (subject.kmcc === 5) {
          this.$message.warning('科目只能增加5级')
          return
        }
        if (subject.fc === '是') {
          this.$message.warning('该科目已封存，不允许添加下级')
          return
        }

        this.$api.BasicSettingApi.Subject.isAllowAdd({
          id: subject.id,
          kmbm: subject.kmbm
        }).then(res => {
          if (res.success) {
            this.editFormVisible = true
            this.isEdit = false
            this.formData = subject
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('请选择一行数据')
      }
    },
    editSubject () {
      const subject = this.getSelectedSubject()
      if (subject) {
        if (subject.fc === '是') {
          this.$message.warning('封存科目不允许修改')
          return
        }
        this.editFormVisible = true
        this.isEdit = true
        this.formData = subject
      } else {
        this.$message.warning('请选择要修改的科目')
      }
    },
    removeSealedData (data) {
      const newArray = []
      data.forEach(item => {
        if (item.fc !== '是') {
          let newItem = item
          if (item.children) {
            const newChildren = this.removeSealedData(item.children)
            if (newChildren.length === 0) {
              newItem.children = undefined
            } else {
              newItem.children = newChildren
            }
          }
          newArray.push(newItem)
        }
      })
      return newArray
    },
    expandSubject (subjectArray, expandArray) {
      subjectArray.forEach(subject => {
        expandArray.push(subject)
        if (subject.children) {
          this.expandSubject(subject.children, expandArray)
        }
      })
    },
    getActiveTable () {
      let activeTable
      if (this.activeName === '全部') {
        activeTable = this.$refs.allSubjectTable
      } else {
        activeTable = this.$refs.tableRef.find(item => item.categoryName === this.activeName)
      }
      return activeTable
    },
    getSelectedSubject () {
      let activeTable = this.getActiveTable()
      return activeTable.getSelectedRow()
    },
    onSaved (subject) {
      this.$message.success('保存成功')
      this.fetchData()
      if (!this.isEdit && this.formData.kmbm === '1002' && this.formData.fullname === '银行存款') {
        this.bankAccount = {
          bkname: subject.kmmc,
          accname_id: subject.id
        }
        this.bankSubject = subject
        this.bankAccountVisible = true
      }
    },
    onSaveBankAccount () {
      this.$message.success('保存成功')
    },
    deleteSubject () {
      const subject = this.getSelectedSubject()
      if (subject) {
        if (subject.kmcc === 1) {
          this.$message.error('一级科目不允许删除')
          return
        } else if (subject.fc === '是') {
          this.$message.error('封存科目不允许删除')
          return
        } else if (subject.yz !== '是') {
          this.$message.error('非末级科目不允许删除')
          return
        }
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'el-icon-warning-outline',
          center: true,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          this.$api.BasicSettingApi.Subject.deleteSubject(subject).then((rs) => {
            if (rs.success) {
              this.$message.success(rs.msg)
              this.fetchData()
            } else {
              this.$message.error(rs.msg)
            }
          })
        })
      } else {
        this.$message.warning('请选择要删除的科目')
      }
    },
    openChildrenToAuxiliaryDialog () {
      this.auxiliaryVisible = true
      const subject = this.getSelectedSubject()
      if (subject && subject.yz === '否') {
        this.childrenToAuxiliaryParam.subjectId = subject.id
        this.onSubjectChange(subject.id)
      } else {
        this.childrenToAuxiliaryParam.subjectId = ''
      }
    },
    onAuxiliaryDialogClosed () {
      this.$refs.auxiliaryForm.resetFields()
    },
    onSubjectChange (val) {
      let auxiliaryType = null
      const subj = this.subjectNotLeaf.find(subj => subj.id === val)
      val = subj.kmbm
      if (val.startsWith('2203') || val.startsWith('1221') || val.startsWith('1122')) {
        auxiliaryType = AUXILIARY_TYPE.CUSTOMER
      } else if (val.startsWith('2241') || val.startsWith('2202') || val.startsWith('1123')) {
        auxiliaryType = AUXILIARY_TYPE.SUPPLIER
      } else if (val.startsWith('1405') || val.startsWith('1403') ||
        val.startsWith('600101') || val.startsWith('605101') || val.startsWith('6001001') || val.startsWith('6051001') ||
        val.startsWith('500101') || val.startsWith('505101') || val.startsWith('5001001') || val.startsWith('5051001')) {
        auxiliaryType = AUXILIARY_TYPE.INVENTORY
      }
      this.childrenToAuxiliaryParam.auxiliaryType = auxiliaryType
    },
    childrenToAuxiliary () {
      this.$refs.auxiliaryForm.validate((valid) => {
        if (valid) {
          this.$api.BasicSettingApi.Subject.childrenToAuxiliary(this.childrenToAuxiliaryParam).then(res => {
            if (res.success) {
              this.$message.success('科目下级转辅助成功')
              this.auxiliaryVisible = false
              this.fetchData()
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    updateSealButton () {
      const subject = this.getSelectedSubject()
      this.showSealButton = !subject || subject.fc !== '是'
    },
    sealSubject () {
      const subject = this.getSelectedSubject()
      if (subject) {
        this.$api.BasicSettingApi.Subject.sealSubject(subject).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('请选择科目')
      }
    },
    unsealSubject () {
      const subject = this.getSelectedSubject()
      if (subject) {
        this.$api.BasicSettingApi.Subject.unsealSubject(subject).then(res => {
          if (res.success) {
            this.$message.success(res.msg)
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message.warning('请选择科目')
      }
    },
    routerTo (name) {
      this.$router.push({
        name
      })
    }
  }
}
</script>

<style scoped>
  >>> .el-tabs__header {
    height: 40px;
    margin-bottom: 10px;
  }

  >>> .el-tabs__content {
    height: calc(100% - 50px);
  }

  .search-input {
    width: 250px;
  }

  .search-input .el-icon-close {
    visibility: hidden;
  }

  .search-input:hover .el-icon-close {
    visibility: visible;
  }

  .search-input >>> .el-input-group__append {
    padding: 0 15px;
  }
</style>
