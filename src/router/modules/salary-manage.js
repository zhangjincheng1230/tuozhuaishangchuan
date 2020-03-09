/** 财务账簿 **/

import Group from '@/layout/components/Main/Group'

const salaryRouter = {
  path: 'salary-manage',
  component: Group,
  redirect: 'noRedirect',
  name: 'salary-manage',
  meta: {
    title: '工资管理'
  },
  children: [
    {
      path: 'account-setting',
      component: () => import('@/view/accounting/salary-manage/account-setting'),
      name: 'account-setting',
      meta: {
        title: '入账设置'
      }
    },
    {
      path: 'salary-report',
      component: () => import('@/view/accounting/salary-manage/salary-report'),
      name: 'salary-report',
      meta: {
        title: '工资表'
      }
    },
    {
      path: 'social-insur',
      component: () => import('@/view/accounting/salary-manage/social-insur'),
      name: 'social-insur',
      meta: {
        title: '社保公积金'
      }
    },
    {
      path: 'staff-info',
      component: () => import('@/view/accounting/salary-manage/staff-info'),
      name: 'staff-info',
      meta: {
        title: '职员信息'
      }
    }
  ]
}

export default salaryRouter
