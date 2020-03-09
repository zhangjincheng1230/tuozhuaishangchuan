<template>
  <div style="position: relative;border: 1px solid #ddd;background:rgba(255,255,255,1)">
    <el-container>
      <el-form
        :inline="true"
        @submit.native.prevent
        class="form-inline"
        label-width="100px"
        style="height:45px;padding-top: 12px;width: 100%"
      >
        <el-form-item label="快速过滤:" size="small" label-width="80px" style="float: left; margin:0 14px 13px ">
          <el-input style="width: 220px" placeholder="请输入客户名称，按Enter键查询" v-model="selName"></el-input>
        </el-form-item>
        <el-form-item label="状态:" size="small" label-width="50px" style="float: left; margin-button:13px">
          <el-select v-model="KpStatus" style="width: 75px">
            <el-option label="不限" value="1"></el-option>
            <el-option label="申请" value="2"></el-option>
            <el-option label="开票" value="3"></el-option>
            <el-option label="寄出" value="4"></el-option>
            <el-option label="入账" value="5"></el-option>
            <el-option label="报税" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right;margin-button:13px" size="small">
          <el-button size="mini">查询</el-button>
          <el-button size="mini">开票</el-button>
          <el-button size="mini">寄出</el-button>
          <el-button size="mini">入账</el-button>
          <el-button size="mini">报税</el-button>
        </el-form-item>
      </el-form>
    </el-container>
    <el-container>
      <el-main style="padding: 0">
        <el-table
          :data="tableListOne"
          :header-cell-style="headerCellStyle"
          ref="tableCorpRef"
          stripe
          :height="heightOne"
          style="width: 100%">
          <el-table-column
            type="selection"
            max-width="50">
          </el-table-column>
          <el-table-column
            prop=""
            label="申请时间"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="申请人"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="价税合计"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="处理状态"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="购买方名称"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="税号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="公司地址"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="开票电话"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="开户行"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="开户账号"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="开票时间"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="开票人"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="寄出时间"
            align="center"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="收发员"
            align="center"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="入账时间"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="会计"
            align="center"
            min-width="100">
          </el-table-column>
          <el-table-column
            prop=""
            label="报税时间"
            align="center"
            min-width="120">
          </el-table-column>
          <el-table-column
            prop=""
            label="会计"
            align="center"
            min-width="100">
          </el-table-column>
        </el-table>
        <div class="table-pagination">
          <Pagination :total="total" :page.sync="page" :limit.sync="rows"
                      @pagination="pageData"></Pagination>
        </div>
        <el-table
          :data="tableListTwo"
          :header-cell-style="headerCellStyle"
          ref="tableCorpRef"
          stripe
          :height="heightTwo"
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            max-width="50">
          </el-table-column>
          <el-table-column
            prop=""
            min-width="120"
            label="货物或服务名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="型号"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="单位"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="含税单价"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="含税金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="税率"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="税额"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            max-width="120"
            label="折扣率"
            align="center">
          </el-table-column>
          <el-table-column
            prop=""
            min-width="120"
            label="折扣额"
            align="center">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
export default {
  name: 'makeDispose',
  components: {
    Pagination
  },
  data () {
    return {
      selName: '',
      KpStatus: '1',
      tableListOne: [],
      tableListTwo: [],
      heightOne: 0,
      heightTwo: 0,
      headerCellStyle: {
        background: '#E7EAF4',
        fontSize: '14px',
        borderTop: '1px solid #dadada',
        borderBottom: '1px solid #dadada'
      },
      total: 0,
      page: 1,
      rows: 100
    }
  },
  methods: {
    handleSizeChange: function () {

    },
    handleCurrentChange: function () {

    },
    pageData: function (param) {
      this.page = param.page
      this.rows = param.limit
    }
  },
  created () {
    this.heightOne = (window.innerHeight - 205) / 2
    this.heightTwo = (window.innerHeight - 205) / 2
  }
}
</script>

<style scoped>
  /*.el-main .el-pagination > .el-pagination__jump{*/
  /*  margin-left: 0!important;*/
  /*}*/
</style>
