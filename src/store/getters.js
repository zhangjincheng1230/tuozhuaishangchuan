import {CORP_VERSION_NAME} from '@/constants'
const getters = {
  name: state => state.user.name,
  permissionRoutes: state => state.permission.routes,
  menuRoutes: state => state.permission.menuRoutes,
  menuList: state => state.permission.menuList,
  system: state => state.user.system,
  topRouteName: state => state.tagsView.topRouteName,
  skin: state => state.platform.skin,
  maxDialogBodyHeight: state => state.platform.maxDialogBodyHeight,
  tagslist: state => state.tagsView.tagslist,
  activeItem: state => state.tagsView.activeItem,
  currentCorp: state => state.system.corpInfo,
  corps: state => state.system.ownedCorps,
  getCorp: (state) => (pkCorp) => {
    return state.system.ownedCorps.find(corp => corp.pk_gs === pkCorp)
  },
  getLoginCorp: state => state.system.corpInfo,
  getLoginCorpId: state => state.system.corpInfo ? state.system.corpInfo.pk_gs : null,
  // 库存模式
  inventoryMode: (state, getters) => getters.getLoginCorp ? getters.getLoginCorp.buildic : null,
  // 是否启用库存模块
  inventoryModuleEnabled: (state, getters) => getters.inventoryMode === '1',
  // 登录日期
  getLoginDate: state => state.system.loginDate,
  // 科目编码规则
  getSubjectCodeRule: state => state.system.corpInfo.accountcoderule
    ? state.system.corpInfo.accountcoderule : '4/2/2/2/2',
  // 用户id
  getUserId: state => state.system.userInfo.userid,
  getToken: state => state.system.userInfo.token,
  getLoginUserName: state => state.system.info.UserName,
  ischannel: state => state.system.info.ischannel,
  getUserInfo: state => state.system.userInfo,
  /**
   * 一级现金科目编码
   * 还需要根据科目的unxjkm属性判断科目是否为现金科目
   * @param state
   * @param getters
   * @returns {Set<any>}
   */
  cashSubjectSet: (state, getters) => {
    let subjectSet = new Set()
    subjectSet.add('1001')
    subjectSet.add('1002')
    let corpType = getters.getLoginCorp.ctype
    if (corpType === '00000100AA10000000000BMQ' ||
      corpType === '00000100000000Ig4yfE0005') {
      subjectSet.add('1009')
    } else if (corpType === '00000100AA10000000000BMF') {
      subjectSet.add('1012')
      subjectSet.add('1101')
    } else if (corpType === '00000100AA10000000000BMD') {
      subjectSet.add('1012')
    }
    return subjectSet
  },
  menus: state => state.system.menus,
  corpVersionName: state => {
    let name = ''
    let versionNum = state.system.corpServiceInfo.iversion
    if (versionNum !== null && versionNum !== undefined) {
      name = CORP_VERSION_NAME[versionNum]
    }
    return name
  }
}
export default getters
