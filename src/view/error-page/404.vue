<template>
  <div class="div">
    <dl>
      <dt><img src="@/assets/error-images/404.png" width="621" height="254" alt=""/></dt>
      <dd class="add">链接页面错误，请重试</dd>
      <dd class="fo">工程师正火速赶来，稍等一会</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>

<style scoped>
  * {
    padding: 0px;
    margin: 0px;
  }

  .div {
    width: 1366px;
    height: 768px;
    background: #e3f7ff;
    margin: 0 auto;
  }

  .div dl dt img {
    margin-top: 200px;
    margin-left: 373px;
  }

  .div dl dd {
    text-align: center;
    font-size: 36px;
  }

  .add {
    padding-top: 84px;
  }

  .fo {
    padding-top: 50px;
    color: #18aee5
  }
</style>
