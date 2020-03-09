/** 纳税申报 **/

import Group from '@/layout/components/Main/Group'

const taxrptRouter = {
  path: 'taxrpt',
  component: Group,
  redirect: 'noRedirect',
  name: 'taxrpt',
  meta: {
    title: '纳税申报',
    defaultOpenMenu: true
  },
  children: [
    {
      path: 'tax-declaration',
      component: () => import('@/view/accounting/taxrpt/tax-declaration'),
      name: 'tax-declaration',
      meta: {
        title: '纳税填报'
      }
    },
    {
      path: 'tax_declaraquery',
      component: () => import('@/view/accounting/taxrpt/tax_declaraquery'),
      name: 'tax_declaraquery',
      meta: {
        title: '申报查询'
      }
    },
    {
      path: 'tax-workbench',
      component: () => import('@/view/accounting/taxrpt/tax-workbench'),
      name: 'tax-workbench',
      meta: {
        title: '纳税工作台'
      }
    }
  ]
}
export default taxrptRouter
