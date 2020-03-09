// 基础设置
import Group from '@/layout/components/Main/Group'

const settingsRouter = {
  path: 'settings',
  redirect: 'noRedirect',
  component: Group,
  name: 'settings',
  meta: {
    title: '账套管理'
  },
  children: [
    {
      path: 'company-setting',
      component: () => import('@/view/accounting/settings/company-setting'),
      name: 'company-setting',
      meta: {
        title: '账套设置'
      }
    },
    {
      path: 'subject',
      component: () => import('@/view/accounting/settings/subject'),
      name: 'subject',
      meta: {
        title: '会计科目'
      }
    },
    {
      path: 'auxiliary-accounting',
      component: () => import('@/view/accounting/settings/auxiliary-accounting/auxiliary-type/index'),
      name: 'auxiliary-accounting',
      meta: {
        title: '辅助核算'
      }
    },
    {
      path: 'common-settings',
      component: () => import('@/view/accounting/settings/common-settings'),
      redirect: { name: 'param-setting' },
      name: 'common-settings',
      meta: {
        title: '常规设置'
      },
      props: true,
      children: [
        {
          path: 'param-setting',
          component: () => import('@/view/accounting/settings/param-setting'),
          name: 'param-setting',
          meta: {
            title: '参数设置',
            nestedView: true
          }
        },
        {
          path: 'exchangerate',
          component: () => import('@/view/accounting/settings/exchangerate'),
          name: 'exchangerate',
          meta: {
            title: '外币汇率',
            nestedView: true
          }
        },
        {
          path: 'bank-account',
          component: () => import('@/view/accounting/settings/bank-account'),
          name: 'bank-account',
          meta: {
            title: '银行账户',
            nestedView: true
          }
        },
        {
          path: 'common-template',
          component: () => import('@/view/accounting/settings/common-template'),
          name: 'common-template',
          meta: {
            title: '常用凭证模板',
            nestedView: true
          }
        },
        {
          path: 'common-abstract',
          component: () => import('@/view/accounting/settings/common-abstract'),
          name: 'common-abstract',
          meta: {
            title: '常用摘要',
            nestedView: true
          }
        },
        {
          path: 'income-warning',
          component: () => import('@/view/accounting/settings/income-warning'),
          name: 'income-warning',
          meta: {
            title: '预警设置',
            nestedView: true
          }
        },
        {
          path: 'business-type-template',
          component: () => import('@/view/accounting/settings/business-type-template'),
          name: 'business-type-template',
          meta: {
            title: '业务类型模板',
            nestedView: true
          },
          props: true
        }
      ]
    },
    {
      path: 'transfer-template',
      component: () => import('@/view/accounting/settings/transfer-template'),
      name: 'transfer-template',
      meta: {
        title: '期末结转模板'
      }
    },
    {
      path: 'km-qc',
      component: () => import('@/view/accounting/settings/km-qc'),
      name: 'km-qc',
      meta: {
        title: '科目期初'
      }
    },
    {
      path: 'xjll-qc',
      component: () => import('@/view/accounting/settings/xjll-qc'),
      name: 'xjll-qc',
      meta: {
        title: '现金流量期初'
      }
    },
    {
      path: 'cost-transfer-template',
      component: () => import('@/view/accounting/settings/transfer-template/cost-transfer-template'),
      name: 'cost-transfer-template',
      meta: {
        title: '结转成本',
        hidden: true
      }
    },
    {
      path: 'exchange-gains-and-losses-template',
      component: () => import('@/view/accounting/settings/transfer-template/exchange-gains-and-losses-template'),
      name: 'exchange-gains-and-losses-template',
      meta: {
        title: '汇兑损益',
        hidden: true
      }
    },
    {
      path: 'provision-surtax-template',
      component: () => import('@/view/accounting/settings/transfer-template/provision-surtax-template'),
      name: 'provision-surtax-template',
      meta: {
        title: '计提附加税',
        hidden: true
      }
    },
    {
      path: 'profit-carryover-template',
      component: () => import('@/view/accounting/settings/transfer-template/profit-carryover-template'),
      name: 'profit-carryover-template',
      meta: {
        title: '利润结转',
        hidden: true
      }
    },
    {
      path: 'profit-loss-carryover-template',
      component: () => import('@/view/accounting/settings/transfer-template/profit-loss-carryover-template'),
      name: 'profit-loss-carryover-template',
      meta: {
        title: '期间损益结转',
        hidden: true
      }
    },
    {
      path: 'xspz-mb',
      component: () => import('@/view/accounting/settings/xspz-mb'),
      name: 'xspz-mb',
      meta: {
        title: '销售凭证模板'
      }
    },
    {
      path: 'auxiliary-archive',
      component: () => import('@/view/accounting/settings/auxiliary-accounting/auxiliary-archive'),
      name: 'auxiliary-archive',
      props: true,
      meta: {
        title: '辅助核算档案',
        hidden: true,
        activeName: 'auxiliary-accounting'
      }
    }
  ]
}

export default settingsRouter
