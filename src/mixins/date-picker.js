export default {
  data () {
    return {
      pickerOptions: {
        disabledDate: (date) => {
          if (this.loginCorpBeginDate === null) {
            return false
          }
          return date.getTime() < this.loginCorpBeginDate.getTime()
        }
      },
      monthPickerOptions: {
        disabledDate: (date) => {
          if (this.loginCorpBeginDateFirstDay === null) {
            return false
          }
          return date.getTime() < this.loginCorpBeginDateFirstDay.getTime()
        }
      },
      yearPickerOptions: {
        disabledDate: (date) => {
          if (this.loginCorpBeginDateFirstDay === null) {
            return false
          }
          return date.getTime() < this.loginCorpYearDateFirstDay.getTime()
        }
      }
    }
  },
  computed: {
    loginCorp () {
      return this.$store.getters.getLoginCorp
    },
    loginCorpBeginDateStr () {
      return this.loginCorp ? this.loginCorp.bdate : null
    },
    loginCorpBeginDate () {
      let date = null
      if (this.loginCorpBeginDateStr) {
        date = new Date(this.loginCorpBeginDateStr)
        date.setHours(0, 0, 0, 0)
      }
      return date
    },
    loginCorpBeginDateFirstDay () {
      let date = null
      if (this.loginCorpBeginDateStr) {
        date = new Date(this.loginCorpBeginDateStr)
        date.setDate(1)
        date.setHours(0, 0, 0, 0)
      }
      return date
    },
    loginCorpYearDateFirstDay () {
      let date = null
      if (this.loginCorpBeginDateStr) {
        date = new Date(this.loginCorpBeginDateStr)
        date.setMonth(1)
        date.setDate(1)
        date.setHours(0, 0, 0, 0)
      }
      return date
    }
  },
  methods: {
    isBeforeCorpBegin (date) {
      let isBefore = false
      if (this.loginCorpBeginDateStr) {
        if (typeof date === 'string') {
          let corpDate = this.loginCorpBeginDateStr.substring(0, date.length)
          isBefore = date < corpDate
        } else if (date instanceof Date) {
          isBefore = date.getTime() < this.loginCorpBeginDate.getTime()
        }
      }
      return isBefore
    }
  }
}
