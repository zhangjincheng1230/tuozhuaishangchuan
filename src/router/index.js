import Vue from 'vue'
// import Index from '@/view/Index'
import Base from '@/layout/base'
import Group from '@/layout/components/Main/Group'
import Router from 'vue-router'
// import { prefix } from '@/libs/axios'
import login from '@/view/login'
// import Vue from "vue/types/index";

import settingsRouter from './modules/settings'
import financialBook from './modules/financial-book'
import financialReport from './modules/financial-report'
import salaryRouter from './modules/salary-manage'
import inventoryRouter from './modules/general-inventory'
import inventoryManageRouter from './modules/inventory-manage'
import jzclRouter from './modules/jzcl'
import sjwhRouter from './modules/sjwh'
import taxrptRouter from './modules/taxrpt'
import voucherRouter from './modules/voucher'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    name: 'Base',
    redirect: { name: 'home' },
    component: Base,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/view/Home'),
        meta: {
          title: '首页',
          affix: true
        }
      },
      {
        path: '/404',
        component: () => import('@/view/error-page/404'),
        hidden: true
      }
    ]
  },
  {
    path: '/redirect',
    component: Base,
    hidden: true,
    children: [
      {
        path: '/redirect',
        component: Group,
        children: [
          {
            path: '/redirect/:path*',
            component: () => import('@/view/redirect')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/changelog',
    component: Base,
    hidden: true,
    children: [
      {
        path: '/changelog',
        component: Group,
        children: [
          {
            path: '/changelog',
            name: 'changelog',
            component: () => import('@/view/Header/changelog'),
            meta: {
              title: '更新日志'
            }
          }
        ]
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/Processes',
    name: 'Processes',
    component: Base,
    meta: {
      title: '业务处理',
      icon: '',
      menu: true,
      topMenu: true
    },
    children: [
      {
        path: 'instrumentagents',
        name: 'instrumentagents',
        component: Group,
        meta: {
          title: '票据管理',
          icon: ''
        },
        children: [
          {
            path: 'preview',
            name: 'tpyl',
            component: () => import('@/view/Processes/instrumentagents/preview'),
            meta: {
              title: '图片浏览',
              icon: ''
            }
          },
          {
            path: 'OFFlickrUploader',
            name: 'sctp',
            component: () => import('@/view/Processes/instrumentagents/OFFlickrUploader'),
            meta: {
              title: '上传图片',
              icon: ''
            }
          },
          {
            path: 'incomeBill',
            name: 'incomeBill',
            component: () => import('@/view/Processes/instrumentagents/incomeBill'),
            meta: {
              title: '进项发票',
              icon: ''
            }
          },
          {
            path: 'outputBill',
            name: 'outputBill',
            component: () => import('@/view/Processes/instrumentagents/outputBill'),
            meta: {
              title: '销项发票',
              icon: ''
            }
          },
          {
            path: 'americanbanker',
            name: 'yhdzd',
            component: () => import('@/view/Processes/instrumentagents/americanbanker'),
            meta: {
              title: '银行对账单',
              icon: ''
            }
          },
          {
            path: 'incomeBill_old',
            name: 'incomeBill_old',
            component: () => import('@/view/Processes/instrumentagents/incomeBill_old'),
            meta: {
              title: '进项发票(旧)',
              icon: ''
            }
          },

          {
            path: 'outputBill_old',
            name: 'outputBill_old',
            component: () => import('@/view/Processes/instrumentagents/outputBill_old'),
            meta: {
              title: '销项发票(旧)',
              icon: ''
            }
          },
          {
            path: 'americanbankerold',
            name: 'yhdzdj',
            component: () => import('@/view/Processes/instrumentagents/americanbankerold'),
            meta: {
              title: '银行对账单(旧)',
              icon: ''
            }
          },
          {
            path: 'makeDispose',
            name: 'makeDispose',
            component: () => import('@/view/Processes/instrumentagents/makeDispose'),
            meta: {
              title: '开票处理',
              icon: ''
            }
          },
          {
            path: 'billWorkbench',
            name: 'billWorkbench',
            component: () => import('@/view/Processes/instrumentagents/billWorkbench'),
            meta: {
              title: '票据工作台',
              icon: ''
            }
          },
          {
            path: 'infoQuery',
            name: 'infoQuery',
            component: () => import('@/view/Header/infoQuery'),
            meta: {
              title: '信息查询'
            }
          },
          {
            path: 'enterpriseInfo',
            name: 'enterpriseInfo',
            component: () => import('@/view/Header/enterprise-info'),
            meta: {
              title: '企业信息'
            }
          }
        ]
      },
      salaryRouter,
      {
        path: 'loadAssetOther',
        name: 'loadAssetOther',
        component: Group,
        meta: {
          title: '资产管理',
          icon: ''
        },
        children: [
          {
            path: 'serialize_asset',
            name: 'zclb',
            component: () => import('@/view/Processes/loadAssetOther/zclb/serialize_asset'),
            meta: {
              title: '资产类别',
              icon: ''
            }
          },
          {
            path: 'VerifyAccount',
            name: 'zckmdz',
            component: () => import('@/view/Processes/loadAssetOther/zckmdz/VerifyAccount'),
            meta: {
              title: '资产科目对照',
              icon: ''
            }
          },
          {
            path: 'dmd_shotCard',
            name: 'zckp',
            props: true,
            component: () => import('@/view/Processes/loadAssetOther/zckp/dmd_shotCard'),
            meta: {
              title: '资产卡片',
              icon: ''
            }
          },
          {
            path: 'original',
            name: 'yzbg',
            component: () => import('@/view/Processes/loadAssetOther/yzbg/original'),
            meta: {
              title: '原值变更',
              icon: ''
            }
          },
          {
            path: 'toLowerCase',
            name: 'zcql',
            component: () => import('@/view/Processes/loadAssetOther/zcql/toLowerCase'),
            meta: {
              title: '资产清理',
              icon: ''
            }
          },
          {
            path: 'assign_workload',
            name: 'zzl',
            component: () => import('@/view/Processes/loadAssetOther/gzl/assign_workload'),
            meta: {
              title: '工作量',
              icon: ''
            }
          },
          {
            path: 'account_asset',
            name: 'zczz',
            component: () => import('@/view/Processes/loadAssetOther/zczzRpt/account_asset'),
            meta: {
              title: '资产总账',
              icon: ''
            }
          },
          {
            path: 'subsidiary',
            name: 'zcmxz',
            component: () => import('@/view/Processes/loadAssetOther/zcmxRpt/subsidiary'),
            meta: {
              title: '资产明细账',
              icon: ''
            }
          },
          {
            path: 'sub-ledgers',
            name: 'zzdz',
            component: () => import('@/view/Processes/loadAssetOther/zzdzRpt/sub-ledgers'),
            meta: {
              title: '总账对账',
              icon: ''
            },
            props: true
          },
          {
            path: 'in_depreciation',
            name: 'zjhzb',
            component: () => import('@/view/Processes/loadAssetOther/zjhzRpt/in_depreciation'),
            meta: {
              title: '折旧汇总表',
              icon: ''
            }
          },
          {
            path: 'tableofcontents',
            name: 'zjmxz',
            props: true,
            component: () => import('@/view/Processes/loadAssetOther/zjmxRpt/tableofcontents'),
            meta: {
              title: '折旧明细账',
              icon: ''
            }
          }
        ]
      },
      inventoryRouter,
      inventoryManageRouter
    ]
  },
  {
    path: '/cwcl',
    name: 'cwcl',
    component: Base,
    meta: {
      title: '账务处理',
      id: '02',
      icon: '',
      menu: true,
      topMenu: true
    },
    children: [
      voucherRouter,
      jzclRouter,
      settingsRouter,
      sjwhRouter
    ]
  },
  {
    path: '/zbgl',
    name: 'zbgl',
    component: Base,
    meta: {
      title: '账簿报表',
      id: '03',
      icon: '',
      menu: true,
      topMenu: true
    },
    children: [
      financialBook,
      financialReport
    ]
  },
  {
    path: '/nssb',
    name: 'nssb',
    component: Base,
    meta: {
      title: '纳税申报',
      id: '04',
      icon: '',
      menu: true,
      topMenu: true
    },
    children: [
      taxrptRouter
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const router = createRouter()

export default router
