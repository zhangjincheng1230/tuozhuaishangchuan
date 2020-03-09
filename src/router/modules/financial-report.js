/** 财务账簿 **/

import Group from '@/layout/components/Main/Group'

const router = {
  path: 'financial-report',
  component: Group,
  redirect: 'noRedirect',
  name: 'financial-report',
  meta: {
    title: '财务报表'
  },
  children: [
    {
      path: 'zcfz-report',
      component: () => import('@/view/accounting/financial-report/zcfz-report'),
      name: 'zcfz-report',
      meta: {
        title: '资产负债表'
      },
      props: true
    },
    {
      path: 'lrb-report',
      component: () => import('@/view/accounting/financial-report/lrb-report'),
      name: 'lrb-report',
      meta: {
        title: '利润表'
      }
    },
    {
      path: 'lrbjb-report',
      component: () => import('@/view/accounting/financial-report/lrbjb-report'),
      name: 'lrbjb-report',
      meta: {
        title: '利润表季报'
      }
    },
    {
      path: 'lrb-center-report',
      component: () => import('@/view/accounting/financial-report/lrb-center-report'),
      name: 'lrb-center-report',
      meta: {
        title: '分部利润表'
      }
    },
    {
      path: 'xjll-report',
      component: () => import('@/view/accounting/financial-report/xjll/xjll-report'),
      name: 'xjll-report',
      meta: {
        title: '现金流量表'
      }
    },
    {
      path: 'xjlljb-report',
      component: () => import('@/view/accounting/financial-report/xjlljb-report'),
      name: 'xjlljb-report',
      meta: {
        title: '现金流量季报'
      }
    },
    {
      path: 'cwgy-report',
      component: () => import('@/view/accounting/financial-report/cwgy-report'),
      name: 'cwgy-report',
      meta: {
        title: '财务概要信息'
      }
    },
    {
      path: 'ywhd-report',
      component: () => import('@/view/accounting/financial-report/ywhd/ywhd-report'),
      name: 'ywhd-report',
      meta: {
        title: '业务活动表'
      }
    },
    {
      path: 'ywhdjb-report',
      component: () => import('@/view/accounting/financial-report/ywhdjb/ywhdjb-report'),
      name: 'ywhdjb-report',
      meta: {
        title: '业务活动季报'
      }
    },
    {
      path: 'yyfp-report',
      component: () => import('@/view/accounting/financial-report/yyfp-report'),
      name: 'yyfp-report',
      meta: {
        title: '盈余分配表'
      }
    },
    {
      path: 'qybd-report',
      component: () => import('@/view/accounting/financial-report/qybd-report'),
      name: 'qybd-report',
      meta: {
        title: '权益变动表'
      }
    },
    {
      path: 'srzc-report',
      component: () => import('@/view/accounting/financial-report/srzc-report'),
      name: 'srzc-report',
      meta: {
        title: '收入支出表'
      }
    },
  ]
}

export default router
