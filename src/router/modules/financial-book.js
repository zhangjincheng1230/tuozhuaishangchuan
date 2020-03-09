/** 财务账簿 **/

import Group from '@/layout/components/Main/Group'

const router = {
  path: 'financial-book',
  component: Group,
  redirect: 'noRedirect',
  name: 'financial-book',
  meta: {
    title: '财务账簿'
  },
  children: [
    {
      path: 'fsyeb-report',
      component: () => import('@/view/accounting/financial-book/fsyeb-report'),
      name: 'fsyeb-report',
      meta: {
        title: '发生额及余额表'
      },
      props: true
    },
    {
      path: 'kmzz-report',
      component: () => import('@/view/accounting/financial-book/kmzz-report'),
      name: 'kmzz-report',
      meta: {
        title: '科目总账'
      },
      props: true
    },
    {
      path: 'kmmx-report',
      component: () => import('@/view/accounting/financial-book/kmmx-report'),
      name: 'kmmx-report',
      meta: {
        title: '科目明细账'
      },
      props: true
    },
    {
      path: 'auxiliary-balance-report',
      component: () => import('@/view/accounting/financial-book/auxiliary-balance-report'),
      name: 'auxiliary-balance-report',
      meta: {
        title: '辅助余额表'
      },
      props: true
    },
    {
      path: 'fzmx-report',
      component: () => import('@/view/accounting/financial-book/fzmx/fzmx-report'),
      name: 'fzmx-report',
      props: true,
      meta: {
        title: '辅助明细账'
      }
    },
    {
      path: 'xjyhrjz-report',
      component: () => import('@/view/accounting/financial-book/xjyhrjz-report'),
      name: 'xjyhrjz-report',
      meta: {
        title: '现金/银行日记账'
      }
    },
    {
      path: 'sljezz-report',
      component: () => import('@/view/accounting/financial-book/sljezz-report'),
      name: 'sljezz-report',
      meta: {
        title: '数量金额总账'
      },
      props: true
    },
    {
      path: 'sljemxz-report',
      component: () => import('@/view/accounting/financial-book/sljemxz-report/sljemxz-report'),
      name: 'sljemxz-report',
      meta: {
        title: '数量金额明细账'
      },
      props: true
    },
    {
      path: 'xsz-report',
      component: () => import('@/view/accounting/financial-book/xsz-report'),
      name: 'xsz-report',
      meta: {
        title: '序时账'
      }
    },
    {
      path: 'dlz-report',
      component: () => import('@/view/accounting/financial-book/dlz-report'),
      name: 'dlz-report',
      meta: {
        title: '多栏账'
      }
    },
    {
      path: 'wlzlye-report',
      component: () => import('@/view/accounting/financial-book/wlzlye-report'),
      name: 'wlzlye-report',
      meta: {
        title: '往来账龄余额表'
      },
      props: true
    },
    {
      path: 'wlzlmx-report',
      component: () => import('@/view/accounting/financial-book/wlzlmx-report'),
      name: 'wlzlmx-report',
      meta: {
        title: '往来账龄明细表'
      }
    },
    {
      path: 'fktj-report',
      component: () => import('@/view/accounting/financial-book/fktj-report'),
      name: 'fktj-report',
      meta: {
        title: '风控体检'
      }
    },
    {
      path: 'zzsmx-report',
      component: () => import('@/view/accounting/financial-book/zzsmx-report'),
      name: 'zzsmx-report',
      meta: {
        title: '增值税明细表',
        hidden: true
      }
    }
  ]
}

export default router
