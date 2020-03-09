<template>
  <div style="position: relative;width: 100%;height: 57px">
    <el-form
      :inline="true"
      @submit.native.prevent
      class="form-inline"
      label-width="100px"
      style="height:45px;padding-top: 12px;"
    >
      <el-form-item
        v-if="IsShowDate"
        label="期间:"
        size="small"
        label-width="50px"
        style="float: left; margin-left:14px; "
      >
        <el-input style="width: 192px" placeholder="请选择日期" v-popover:popover suffix-icon="el-icon-arrow-down" v-model="dateTime"></el-input>

        <el-popover ref="popover" placement="bottom-start" width="450" v-model="visiblePopover">
          <slot name="SelectCondition"></slot>
        </el-popover>
      </el-form-item>
      <el-form-item size="small" label-width="50" style="width: 200px">
        <slot name="HeaderLeft"></slot>
      </el-form-item>
      <el-form-item
        id="comp"
        v-if="IsShowCompany"
        label="公司:"
        size="small"
        label-width="50px"
        style="float: left">
       {{myCompany}}
      </el-form-item>
      <slot name="lb"></slot>
      <el-form-item style="float:right" size="small">
        <slot name="HeadRight"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getMonthEnd, formatDate, getMonthBegin} from '@/utils'
export default {
  props: ['value', 'compe', 'isShow'],
  data () {
    return {
      dateTime: formatDate(new Date()),
      myCompany: this.$store.getters.currentCorp.uname,
      open: false,
      visiblePopover: false,
      IsShowCompany: true,
      IsShowDate: true,
      copmename: ''
    }
  },
  methods: {
  },
  created () {
    if (this.isShow !== undefined && this.isShow.isShowCompany !== undefined) {
      this.IsShowCompany = this.isShow.isShowCompany
    }
    if (this.isShow !== undefined && this.isShow.isShowDate !== undefined) {
      this.IsShowDate = this.isShow.isShowDate === false ? this.isShow.isShowDate : true
    }
  },
  mounted () {
    // this.$bus.off('date')
    this.$bus.$on('date', (data) => {
      this.visiblePopover = data.visiblePopover
      if (data.times !== undefined) {
        this.dateTime = data.times
      }
    })
  }
}
</script>

<style scoped>
  /deep/ #comp .el-form-item__content {
    width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
