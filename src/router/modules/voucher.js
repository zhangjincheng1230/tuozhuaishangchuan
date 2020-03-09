/** 凭证管理 **/

import Group from '@/layout/components/Main/Group'

const router = {
  path: 'voucher',
  component: Group,
  redirect: 'noRedirect',
  name: 'voucher',
  meta: {
    title: '凭证管理',
    defaultOpenMenu: true
  },
  children: [
    {
      path: 'voucher-card',
      name: 'voucher-edit',
      component: () => import('@/view/accounting/voucher-manage/voucher/voucher-edit'),
      props: true,
      meta: {
        title: '填制凭证'
      }
    },
    {
      path: 'voucher-manage',
      component: () => import('@/view/accounting/voucher-manage/voucher/voucher-manage'),
      props: true,
      name: 'voucher-manage',
      meta: {
        title: '凭证管理'
      }
    },
    {
      path: 'voucher-cnqz',
      name: 'voucher-cnqz',
      component: () => import('@/view/accounting/voucher-manage/voucher/voucher-cnqz'),
      props: true,
      meta: {
        title: '出纳签字'
      }
    },
    {
      path: 'kmhzb-report',
      component: () => import('@/view/accounting/financial-book/kmhzb-report'),
      name: 'kmhzb-report',
      meta: {
        title: '科目汇总表'
      }
    }
  ]
}

export default router
