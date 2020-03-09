/** 业务处理**/

import Group from '@/layout/components/Main/Group'

const inventoryRouter = {
  path: 'general-inventory',
  component: Group,
  redirect: 'noRedirect',
  name: 'general-inventory',
  meta: {
    title: '存货管理'
  },
  children: [
    {
      path: 'inventory-setting',
      component: () => import('@/view/accounting/general-inventory/inventory-setting'),
      name: 'inventory-setting',
      meta: {
        title: '存货设置'
      }
    },
    {
      path: 'inventory-doc',
      component: () => import('@/view/accounting/general-inventory/inventory-doc'),
      name: 'inventory-doc',
      meta: {
        title: '存货档案'
      }
    },
    {
      path: 'inventory-alias',
      component: () => import('@/view/accounting/general-inventory/inventory-alias'),
      name: 'inventory-alias',
      meta: {
        title: '存货别名',
        hidden: true
      }
    },
    {
      path: 'inventory-init',
      component: () => import('@/view/accounting/general-inventory/inventory-init'),
      name: 'inventory-init',
      meta: {
        title: '存货期初'
      }
    },
    {
      path: 'inventory-cost',
      component: () => import('@/view/accounting/general-inventory/inventory-cost'),
      name: 'inventory-cost',
      meta: {
        title: '库存成本表'
      }
    },
    {
      path: 'inventory-details',
      component: () => import('@/view/accounting/general-inventory/inventory-details'),
      name: 'inventory-details',
      props: true,
      meta: {
        title: '出入库明细表'
      }
    },
    {
      path: 'gross-profit',
      component: () => import('@/view/accounting/general-inventory/gross-profit'),
      name: 'gross-profit',
      meta: {
        title: '毛利率统计表'
      }
    }
  ]
}

export default inventoryRouter
