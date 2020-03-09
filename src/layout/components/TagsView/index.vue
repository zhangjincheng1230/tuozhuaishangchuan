<template>
  <div class="tags-view" :class="isTagIcon ? ' tags-view-scrollable' : ''">
    <span v-if="isTagIcon" class="tag-item tag-left" @click="leftClick"> <i class="el-icon-arrow-left"></i> </span>
    <span v-if="isTagIcon" class="tag-item tag-right" @click="rightClick"> <i class="el-icon-arrow-right"></i> </span>
    <div class="tags-nav" id="tagsNav">
      <div class="tags-nav-scroll" id="tagsNavScroll" :style="'transform: translateX(' + translateX + 'px);'">
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active-item':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tag-item"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <i v-if="tag.name === 'home'" class="el-icon-house"></i>
          {{ tag.title }}
          <i v-if="tag.name !== 'home'" class="el-icon-close tag-close" @click.prevent.stop="closeTag(tag)"></i>
        </router-link>
      </div>
    </div>
    <div style="float: right;margin-top: -40px">
      <el-button v-if="isFullScreen" @click="inFullCreeen" type="text"><img src="@/assets/img/smallfull.png" height="16" width="16"/></el-button>
      <el-button v-else @click="outFullCreeen" type="text"><img src="@/assets/img/smallclearfull.png" height="16" width="16"/></el-button>
    </div>
    <!--    </happy-scroll>-->
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭全部</li>
    </ul>
  </div>
</template>

<script>
import path from 'path'
import {getTagRoute} from '@/utils/router'

export default {
  name: 'TagsView',
  data () {
    return {
      isTagIcon: false,
      selectedTag: {},
      visible: false,
      top: 0,
      left: 0,
      translateX: 0,
      affixTags: [],
      isFullScreen: true
    }
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    },
    routes () {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route () {
      this.addTags()
      this.moveToCurrentTag()
      this.$nextTick(() => {
        this.fixNavBarPosition()
      })
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    visitedViews () {
      this.$nextTick(() => {
        if (window.document.getElementById('tagsNavScroll').clientWidth > window.document.getElementById('tagsNav').clientWidth) {
          this.isTagIcon = true
        } else {
          this.isTagIcon = false
        }
        this.fixNavBarPosition()
      })
    }
  },
  created () {
    this.fixNavBarPosition = this.$_.debounce(function () {
      let activeItem = this.$el.querySelector('.active-item')
      if (activeItem === null) {
        this.translateX = 0
        return
      }
      if (activeItem.offsetLeft + activeItem.offsetWidth < window.document.getElementById('tagsNav').clientWidth) {
        this.translateX = 0
      } else {
        this.translateX = window.document.getElementById('tagsNav').clientWidth - activeItem.offsetLeft - activeItem.offsetWidth
      }
    }, 100, {
      maxWait: 1000
    })
  },
  mounted () {
    this.initTags()
    this.addTags()
    const self = this
    const changeFullScreen = () => {
      self.isFullScreen = true
    }
    document.addEventListener('fullscreenchange', function (e) {
      if (!document.fullscreenElement) {
        changeFullScreen()
      }
    })
    document.addEventListener('mozfullscreenchange', function (e) {
      if (!document.fullscreenElement) {
        changeFullScreen()
      }
    })
    document.addEventListener('webkitfullscreenchange', function (e) {
      if (!document.fullscreenElement) {
        changeFullScreen()
      }
    })
    document.addEventListener('msfullscreenchange', function (e) {
      if (!document.fullscreenElement) {
        changeFullScreen()
      }
    })
  },
  methods: {
    isActive (route) {
      let tagRoute = this.$route // getTagRoute(this.$route)
      return route.path === tagRoute.path
    },
    isAffix (tag) {
      return tag.meta && tag.meta.affix
    },
    leftClick () {
      if (Math.abs(this.translateX) < window.document.getElementById('tagsNav').clientWidth) {
        this.translateX = 0
      } else {
        this.translateX = this.translateX + window.document.getElementById('tagsNav').clientWidth
      }
    },
    rightClick () {
      const maxScroll = window.document.getElementById('tagsNavScroll').clientWidth - window.document.getElementById('tagsNav').clientWidth
      if (maxScroll - Math.abs(this.translateX) < window.document.getElementById('tagsNav').clientWidth) {
        this.translateX = -maxScroll
      } else {
        this.translateX = this.translateX - window.document.getElementById('tagsNav').clientWidth
      }
    },
    openMenu (tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = 40
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu () {
      this.visible = false
    },
    refreshSelectedTag (view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const {fullPath} = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeTag (view) {
      this.$store.dispatch('tagsView/delView', view).then(({visitedViews}) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags () {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags (view) {
      let isActive = this.isActive(view)
      this.$store.dispatch('tagsView/delAllViews').then(({visitedViews}) => {
        if (isActive && this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView (visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'home') {
          // to reload home page
          this.$router.replace({path: '/redirect' + view.fullPath})
        } else {
          this.$router.push('/')
        }
      }
    },
    changeTag (item) {
      this.$router.replace({name: item.name})
    },
    initTags () {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    filterAffixTags (routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: {...route.meta}
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    addTags () {
      const {name} = this.$route
      if (name) {
        let route = this.$route // getTagRoute(this.$route)
        this.$store.dispatch('tagsView/addView', route)
      }
      return false
    },
    moveToCurrentTag () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    inFullCreeen () {
      this.n++
      let el = document.documentElement
      let rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
        el.mozRequestFullScreen || el.msRequestFullScreen
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(el)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        let wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      }
      this.isFullScreen = false
    },
    outFullCreeen () {
      let el = document
      let cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
          el.mozCancelFullScreen || el.exitFullScreen
      if (typeof cfs !== 'undefined' && cfs) {
        cfs.call(el)
      } else if (typeof window.ActiveXObject !== 'undefined') {
        let wscript = new ActiveXObject('WScript.Shell')
        if (wscript != null) {
          wscript.SendKeys('{F11}')
        }
      }
      this.isFullScreen = true
    }
  }
}
</script>

<style scoped>
  .tags-nav-scroll {
    padding-left: 0;
    margin: 0;
    float: left;
    list-style: none;
    box-sizing: border-box;
    position: relative;
    transition: transform .5s ease-in-out;
  }

  .tags-view .tag-left {
    position: absolute;
    left: 0;
  }

  .tags-view .tag-right {
    position: absolute;
    right: 0;
  }

  .tags-view .tag-right, .tags-view .tag-left {
    border-radius: 0 !important;
    padding: 5px 3px !important;
    /*padding-bottom: 7px!important;*/
    background: #F6F6F6 !important;
    border: none !important;
  }

  .tags-view .tag-right i, .tags-view .tag-left i {
    font-size: 16px;
  }

  .tags-view .tag-left:hover i {
    font-weight: 900 !important;
    color: #0889F5;
  }

  .tags-view .tag-right:hover i {
    font-weight: 900 !important;
    color: #0889F5;
  }

  .tags-view {
    background: #F6F6F6;
    width: 100%;
    position: relative;
    padding: 0 13px;
  }

  .tags-view-scrollable {
    padding: 0 33px;
  }

  .tags-view .tags-nav {
    list-style: none;
    white-space: nowrap;
    overflow: hidden;
    width: calc(100% - 50px);
    /*padding-left: 10px;*/
    /*padding-right: 10px;*/
  }

  .tags-view .tag-item {
    margin: 10px 5px;
    padding: 4px 9px;
    border: 1px solid #fff;
    background: white;
    border-radius: 3px;
    display: inline-block;
    font-size: 12px;
    cursor: pointer;
    /*box-shadow: .5px .5px 1px #ccc;*/
  }

  .tag-close:hover {
    /*color: #fc3768;*/
    transform: rotate(90deg);
    -moz-transform: rotate(90deg); /* Firefox 4 */
    -webkit-transform: rotate(90deg); /* Safari and Chrome */
    -o-transform: rotate(90deg); /* Opera */
  }

  .tag-close {
    font-weight: 600;
    font-size: 14px;
    transition: width 0.3s, height 0.3s;
    -moz-transition: width 0.3s, height 0.3s, -moz-transform 0.3s; /* Firefox 4 */
    -webkit-transition: width 0.3s, height 0.3s, -webkit-transform 0.3s; /* Safari and Chrome */
    -o-transition: width 0.3s, height 0.3s, -o-transform 0.3s; /* Opera */
  }

  .tag-refresh:hover {
    /*color: springgreen;*/
    transform: rotate(50deg);
    -moz-transform: rotate(50deg); /* Firefox 4 */
    -webkit-transform: rotate(50deg); /* Safari and Chrome */
    -o-transform: rotate(50deg); /* Opera */
  }

  .tag-refresh {
    font-size: 14px;
    margin: 0 3px;
    font-weight: 600;
    transition: width 0.3s, height 0.3s;
    -moz-transition: width 0.3s, height 0.3s, -moz-transform 0.3s; /* Firefox 4 */
    -webkit-transition: width 0.3s, height 0.3s, -webkit-transform 0.3s; /* Safari and Chrome */
    -o-transition: width 0.3s, height 0.3s, -o-transform 0.3s; /* Opera */
  }

  .tags-view .active-item {
    background: #0889F5;
    color: white;
    border: 1px solid #0889F5 !important;
    /*box-shadow: 2px 2px 2px #ccc;*/
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  }

  .contextmenu li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  }

  .contextmenu li:hover {
    background: #eee;
  }
</style>
