import {forEach, hasOneOf, objEqual} from '@/libs/tools'

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access, prePath, userMenu) => {
  if (!userMenu) {
    userMenu = getUserMenuList()
  }
  prePath = prePath || ''
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access, prePath + item.path + '/', userMenu)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if ((obj && obj.children && obj.children.length > 0) || showThisMenuEle(item, access) && userMenu && userMenu.indexOf(prePath + item.path) !== -1) {
        res.push(obj)
      }
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {...homeRoute, icon: homeRoute.meta.icon}
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let meta = {...item.meta}
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route)
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{...homeItem, to: homeRoute.path}, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = {...route}
  let meta = {...route.meta}
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') title = meta.title(router)
    else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let title = item.meta.title
  if (vm.$config.useI18n) {
    if (title.includes('{{') && title.includes('}}') && vm.$config.useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {name, path, meta} = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({name, path, meta})
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// 自己的方法
export const setCookie = function (c_name, c_pwd, exdays) {
  var exdate = new Date(); // 获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);//保存的天数
  // 字符串拼接cookie
  window.document.cookie = c_name + '=' + JSON.stringify(c_pwd) + ';path=/;expires=' + exdate.toGMTString();
  // window.document.cookie="userPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
}

export const getCookie = function (username) {
  if (document.cookie.length > 0) {
    var arr = document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
    var me
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split('='); // 再次切割
      // 判断查找相对应的值
      if (arr2[0] == username) {
        // 保存到保存数据的地方
        me = arr2[1]
      }
    }
  }
  return me
}

// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}


/**
 * 通过未级ID查询，返回所有上级ID数组
 * @param {String} id
 * @param {Array} tree
 */

export function getFullIdByTree (id, tree) {

  let index = 0
  let fullId = []
  for (; index < tree.length; index++) {
    if (tree[index].id === id) {
      return [id]
    }
    if (tree[index].children && tree[index].children.length > 0) {
      let rtnId = getChildred(tree[index].children, id)
      if (rtnId) {
        return [tree[index].id, ...rtnId]
      }
    }
  }
  return fullId
}

function getChildred (treeNode, id) {
  let index2 = 0
  for (; index2 < treeNode.length; index2++) {
    if (treeNode[index2].primaryKey === id) {
      return [id]
    } else {
      if (treeNode[index2].children && treeNode[index2].children.length > 0) {
        let rtnId = getChildred(treeNode[index2].children, id)
        if (rtnId) {
          return [treeNode[index2].primaryKey, ...rtnId]
        }
      }
    }
  }
}

/**
 * 通过treeNodeId,返回全部Id的数组，上级ID
 * @param treeNode
 * @param id
 * @param key
 * @returns {*[]}
 */
function getAllTreeIdByChildId (treeNode, val, key) {
  let index2 = 0
  for (; index2 < treeNode.length; index2++) {
    if (treeNode[index2][key] === id) {
      return [id]
    } else {
      if (treeNode[index2].children && treeNode[index2].children.length > 0) {
        let rtnId = getChildred(treeNode[index2].children, id)
        if (rtnId) {
          return [treeNode[index2][key], ...rtnId]
        }
      }
    }
  }
}

/**
 * 后台返回数据转换成iview组件的数据
 * @param sourceArray 需要转换的对象，一般是数组
 * @param PropArray  原属性和目标属性对应关系 [{source: 'name', target: 'title'}, {source: 'label', target: 'title'}, {source: 'value', target: 'id'}]
 */
export function convertDate (sourceArray, propArray) {
  for (let i = 0; i < sourceArray.length; i++) {
    let sourceObj = sourceArray[i]
    if (sourceObj.children && sourceObj.children.length > 0) {
      sourceObj.children = convertDate(sourceObj.children, propArray)
    }
    for (let r = 0; r < propArray.length; r++) {
      let target = propArray[r].target
      let source = propArray[r].source
      if (!sourceArray[target]) {
        sourceObj[target] = sourceObj[source]
      }
    }
    sourceArray[i] = sourceObj
  }
  return sourceArray
}

/**
 * 通过判断数组对象的属性返回相等的第一条数据
 * @param array
 * @param paraKey
 * @param val
 * @returns {*}
 */
export function getArraryRowByParaKey (array, paraKey, val) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][paraKey] === val) {
      return array[i]
    }
  }
  return null
}

/**
 * 通过判断数组对象的属性返回相等的index
 * @param array
 * @param paraKey
 * @param val
 * @returns {*}
 */
export function getArraryIndexByParaKey (array, paraKey, val) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][paraKey] === val) {
      return i
    }
  }
  return -1
}

export function getUserMenuList () {
  let menuList = []
  const ui = window.localStorage.getItem('userInfo')
  if (ui && ui.length > 0) {
    let userInfo = JSON.parse(ui)
    let menus = userInfo.listFunnode || []
    for (let i = 0; i < menus.length; i++) {
      let urlArr = menus[i].url ? menus[i].url.split(',') : []
      urlArr.forEach(function (value, r) {
        if (value && value.indexOf('.action') === -1) {
          menuList.push(value)
        }
      })
    }
  }
  return menuList
}

export function thous (num) {
  if (!num) {
    return
  }
  var num1 = num.toFixed(2)
  // eslint-disable-next-line no-new-wrappers
  var num2 = Number(new String(num1)).toLocaleString()
  if (num2.indexOf('.') === -1) {
    num2 = num2 + '.00'
  }
  return num2
}
