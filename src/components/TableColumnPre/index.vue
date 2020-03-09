<template>
  <el-table-column
    :label="prelabel"
    :prop="preprop"
    :width="prewidth"
    :header-align="prehalign"
    :align="prealign"
    :pretype="prepretype"
    :formatter="formatter"
  />
</template>
<script>
export default {
  name: 'TableColumnPre',
  props: {
    label: {
      required: true,
      type: String
    },
    prop: {
      required: true,
      type: String
    },
    width: {
      type: String,
      default: '140'
    },
    halign: {
      type: String,
      default: 'center'
    },
    align: {
      type: String,
      default: 'right'
    },
    pretype: {
      type: Number,
      default: 1
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    prelabel: {
      get () {
        return this.label
      },
      set (val) {
        this.$emit('update:label', val)
      }
    },
    preprop: {
      get () {
        return this.prop
      },
      set (val) {
        this.$emit('update:prop', val)
      }
    },
    prewidth: {
      get () {
        return this.width
      },
      set (val) {
        this.$emit('update:width', val)
      }
    },
    prehalign: {
      get () {
        return this.halign
      },
      set (val) {
        this.$emit('update:halign', val)
      }
    },
    prealign: {
      get () {
        return this.align
      },
      set (val) {
        this.$emit('update:align', val)
      }
    },
    prepretype: {
      get () {
        return this.pretype
      },
      set (val) {
        this.$emit('update:pretype', val)
      }
    }
  },
  methods: {
    formatter (row, column, cellValue, index) {
      if (!Number.isFinite(cellValue) || cellValue === 0) {
        return ''
      }
      if (this.prepretype === 2) {
        return this.$options.filters.forThousands(cellValue, this.$store.getters.pricePre, true)
      } else if (this.prepretype === 3) {
        return this.$options.filters.forThousands(cellValue, this.$store.getters.numPre, true)
      } else {
        return this.$options.filters.forThousands(cellValue, 2, true)
      }
    }
  }
}
</script>

<style scoped>
</style>
