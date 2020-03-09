<template>
  <div class="infoquery" style="position: relative;height: 100%;border: 1px solid #ddd;background:rgba(255,255,255,1)">
      <el-row class="rowStyle">
        <h3>利率、汇率查询</h3>
        <el-divider class="lineSty"></el-divider>
        <p>
          <a href="#">利率查询</a>
          <a href="#">汇率查询</a>
        </p>
      </el-row>
      <el-row class="rowStyle">
        <h3>法规查询</h3>
        <el-divider class="lineSty"></el-divider>
        <p>
          <a href="#">会计法规</a>
          <a href="#">税收法规</a>
          <a href="#">证券法规</a>
          <a href="#">工商法规</a>
        </p>
      </el-row>
      <el-row class="rowStyle">
        <h3>国税发票查验</h3>
        <el-divider class="lineSty"></el-divider>
        <p>
          <el-row>
            <a href="#">北京</a>
            <a href="#">福建</a>
            <a href="#">广西</a>
            <a href="#">甘肃</a>
            <a href="#">河南</a>
            <a href="#">湖南</a>
            <a href="#">海南</a>
            <a href="#">江西</a>
            <a href="#">内蒙古</a>
            <a href="#">江苏</a>
            <a href="#">山东</a>
            <a href="#">陕西</a>
            <a href="#">山西</a>
            <a href="#">浙江</a>
            <a href="#">西藏</a>
            <a href="#">新疆</a>
          </el-row>
          <el-row>
            <a href="#">安徽</a>
            <a href="#">重庆</a>
            <a href="#">广东</a>
            <a href="#">贵州</a>
            <a href="#">河北</a>
            <a href="#">湖北</a>
            <a href="#">黑龙江</a>
            <a href="#">吉林</a>
            <a href="#">辽宁</a>
            <a href="#">青海</a>
            <a href="#">上海</a>
            <a href="#">四川</a>
            <a href="#">宁夏</a>
            <a href="#">天津</a>
            <a href="#">云南</a>
          </el-row>
        </p>
      </el-row>
    <el-row class="rowStyle">
      <h3>地税发票查验</h3>
      <el-divider class="lineSty"></el-divider>
      <p>
        <el-row>
          <a href="#">北京</a>
          <a href="#">福建</a>
          <a href="#">广西</a>
          <a href="#">甘肃</a>
          <a href="#">河南</a>
          <a href="#">湖南</a>
          <a href="#">海南</a>
          <a href="#">江西</a>
          <a href="#">内蒙古</a>
          <a href="#">江苏</a>
          <a href="#">山东</a>
          <a href="#">陕西</a>
          <a href="#">山西</a>
          <a href="#">浙江</a>
          <a href="#">西藏</a>
          <a href="#">新疆</a>
        </el-row>
        <el-row>
          <a href="#">安徽</a>
          <a href="#">重庆</a>
          <a href="#">广东</a>
          <a href="#">贵州</a>
          <a href="#">河北</a>
          <a href="#">湖北</a>
          <a href="#">黑龙江</a>
          <a href="#">吉林</a>
          <a href="#">辽宁</a>
          <a href="#">青海</a>
          <a href="#">上海</a>
          <a href="#">四川</a>
          <a href="#">宁夏</a>
          <a href="#">天津</a>
          <a href="#">云南</a>
        </el-row>
      </p>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'infoQuery'
}
</script>

<style lang="less">
  .infoquery{
    /deep/ .rowStyle{
      width: calc(100% - 20px);
      margin-top:25px
    }
    .lineSty{
      margin: 8px 0 20px 20px;
    }
    h3 {
      margin-left: 30px;
    }
    p{
      margin-left: 22px;
    }
    p .el-row{
      margin-top: 15px;
    }
    p a{
      margin: 0 10px;
      text-decoration: none;
      color: #2c3e50;
    }
  }
</style>
