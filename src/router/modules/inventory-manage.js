/** 业务处理**/

import Group from '@/layout/components/Main/Group'

const inventoryManageRouter = {
  path: 'InventoryUnit',
  component: Group,
  redirect: 'noRedirect',
  name: 'InventoryUnit',
  meta: {
    title: '库存管理'
  },
  children: [
    {
      path: 'icset-classify',
      name: 'icset-classify',
      component: () => import('@/view/Processes/InventoryUnit/icset-classify'),
      meta: {
        title: '存货分类',
        icon: ''
      }
    },
    {
      path: 'icset-mesunit',
      name: 'icset-mesunit',
      component: () => import('@/view/Processes/InventoryUnit/icset-mesunit'),
      meta: {
        title: '计量单位',
        icon: ''
      }
    },
    {
      path: 'icset-inventory',
      name: 'icset-inventory',
      component: () => import('@/view/Processes/InventoryUnit/icset-inventory'),
      meta: {
        title: '存货档案',
        icon: ''
      }
    },
    {
      path: 'icset-alias',
      component: () => import('@/view/Processes/InventoryUnit/icset-alias'),
      name: 'icset-alias',
      props: true,
      meta: {
        title: '存货别名',
        hidden: true
      }
    },
    {
      path: 'icset-init',
      name: 'icset-init',
      component: () => import('@/view/Processes/InventoryUnit/icset-init'),
      meta: {
        title: '库存期初',
        icon: ''
      }
    },
    {
      path: 'icset-setting',
      name: 'icset-setting',
      component: () => import('@/view/Processes/InventoryUnit/icset-setting'),
      meta: {
        title: '库存入账设置',
        icon: ''
      }
    },
    {
      path: 'icbill-tradein',
      name: 'icbill-tradein',
      component: () => import('@/view/Processes/InventoryUnit/icbill-tradein'),
      meta: {
        title: '入库单',
        icon: ''
      }
    },
    {
      path: 'icbill-purchin',
      name: 'icbill-purchin',
      component: () => import('@/view/Processes/InventoryUnit/icbill-purchin'),
      props: true,
      meta: {
        title: '入库单',
        icon: ''
      }
    },
    {
      path: 'icbill-tradeout',
      name: 'icbill-tradeout',
      component: () => import('@/view/Processes/InventoryUnit/icbill-tradeout'),
      meta: {
        title: '出库单',
        icon: ''
      }
    },
    {
      path: 'icbill-saleout',
      name: 'icbill-saleout',
      component: () => import('@/view/Processes/InventoryUnit/icbill-saleout'),
      props: true,
      meta: {
        title: '出库单',
        icon: ''
      }
    },
    {
      path: 'icreport-cost',
      name: 'icreport-cost',
      component: () => import('@/view/Processes/InventoryUnit/icreport-cost'),
      meta: {
        title: '库存成本表',
        icon: ''
      }
    },
    {
      path: 'icreport-details',
      name: 'icreport-details',
      component: () => import('@/view/Processes/InventoryUnit/icreport-details'),
      props: true,
      meta: {
        title: '库存明细账',
        icon: ''
      }
    },
    {
      path: 'icreport-total',
      name: 'icreport-total',
      component: () => import('@/view/Processes/InventoryUnit/icreport-total'),
      meta: {
        title: '库存汇总表',
        icon: ''
      }
    }
  ]
}
export default inventoryManageRouter
