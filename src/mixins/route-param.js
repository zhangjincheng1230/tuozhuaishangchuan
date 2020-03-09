/**
 * 路由参数转换为data属性
 * 需在路由中设置props: true
 * 路由传递参数名为routeParam,data中属性名为paramData
 */
export default {
  props: {
    routeParam: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      paramData: {}
    }
  },
  watch: {
    routeParam () {
      this.createLocalParamData()
    }
  },
  created () {
    this.createLocalParamData()
  },
  methods: {
    createLocalParamData () {
      if (this.routeParam !== null) {
        this.paramData = {...this.routeParam}
      } else {
        this.paramData = {}
      }
    },
    hasRouteParam () {
      return !this.$_.isEmpty(this.paramData)
    },
    clearRouteParam () {
      this.paramData = {}
    }
  }
}
