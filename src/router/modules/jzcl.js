/** 财务账簿 **/

import Group from '@/layout/components/Main/Group'

const jzclRouter = {
  path: 'jzcl',
  component: Group,
  redirect: 'noRedirect',
  name: 'jzcl',
  meta: {
    title: '结账办理'
  },
  children: [
    {
      path: 'tax-calculator',
      component: () => import('@/view/accounting/jzcl/tax-calculator'),
      name: 'tax-calculator',
      meta: {
        title: '税费计算'
      }
    },
    {
      path: 'yjjz',
      component: () => import('@/view/accounting/jzcl/yjjz'),
      name: 'yjjz',
      meta: {
        title: '一键结转'
      },
      props: true
    },
    {
      path: 'qmcl',
      component: () => import('@/view/accounting/jzcl/qmcl'),
      name: 'qmcl',
      meta: {
        title: '期末结转'
      },
      props: true
    },
    {
      path: 'qmgz',
      component: () => import('@/view/accounting/jzcl/qmgz'),
      name: 'qmgz',
      meta: {
        title: '关账检查'
      }
    },
    {
      path: 'nmjz',
      component: () => import('@/view/accounting/jzcl/nmjz'),
      name: 'nmjz',
      meta: {
        title: '年末结账'
      }
    },
    {
      path: 'nmjz-search',
      component: () => import('@/view/accounting/jzcl/nmjz-search'),
      name: 'nmjz-search',
      meta: {
        title: '年末结账查询'
      }
    },
    {
      path: 'kjjz-search',
      component: () => import('@/view/accounting/jzcl/kjjz-search'),
      name: 'kjjz-search',
      meta: {
        title: '会计记账查询'
      }
    },
    {
      path: 'industrycbjz',
      component: () => import('@/view/accounting/jzcl/qmcl/industrycbjz'),
      name: 'industrycbjz',
      meta: {
        title: '工业成本结转'
      }
    },
    {
      path: 'qmgzbg',
      component: () => import('@/view/accounting/jzcl/qmgzbg'),
      name: 'qmgzbg',
      meta: {
        title: '总账关账报告',
        hidden: true
      },
      props: true
    }
  ]
}
export default jzclRouter
