// 基础设置
import Group from '@/layout/components/Main/Group'

const sjwhRouter = {
  path: 'data-maintenance',
  redirect: 'noRedirect',
  component: Group,
  name: 'data-maintenance',
  meta: {
    title: '数据维护'
  },
  children: [
    {
      path: 'standard-subject',
      component: () => import('@/view/accounting/settings/standard-subject'),
      name: 'standard-subject',
      meta: {
        title: '标准科目'
      }
    },
    {
      path: 'data-upgrade',
      component: () => import('@/view/accounting/settings/data-upgrade'),
      name: 'data-upgrade',
      meta: {
        title: '数据升级'
      }
    },
    {
      path: 'backup',
      component: () => import('@/view/accounting/settings/backup'),
      name: 'backup',
      meta: {
        title: '备份与恢复'
      }
    },
    {
      path: 'sys_opelog',
      component: () => import('@/view/accounting/settings/sys_opelog'),
      name: 'sys_opelog',
      meta: {
        title: '操作日志'
      }
    }
  ]
}

export default sjwhRouter
