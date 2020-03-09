<template>
  <div style="width: 100%; height: 100%">
    <iframe :src="iframeSrc">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      iframeSrc: 'http://www.baidu.com'
    }
  }
}
</script>

<style scoped>
  iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
</style>
