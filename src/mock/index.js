import Mock from 'mockjs'
const Random = Mock.Random

const listData = function () {
  let data = []
  let count = Random.integer(5, 20)
  for (let i = 0; i < count; i++) {
    let r = Random.integer(1, 10)
    let settype = 0
    if (r > 5) {
      settype = 0
    } else if (r > 7) {
      settype = 0
    }
    data.push(
      {
        'allowchild': r >= 5 ? '是' : '否', // 父分类主键是否允许创建下级
        'billcount': Random.integer(30, 120), // 父分类主键票据数量
        'categorycode': '10', // 父分类主键分类编码
        'categorylevel': 1, // 父分类主键分类级次
        'categoryname': Random.ctitle(4, 7) + '(' + Random.integer(30, 120) + ')', // 父分类主键分类名称
        'categorytype': 0, // 父分类主键节点类型0：基础1：自定义2：用户在非自定义目录中新增的自定义类别3：销项数据按税率4：销项数据按客户5：银行票据按账户
        'childlevel': 5, // 父分类主键允许建下级的层次数量
        'dr': 0,
        'isleaf': '否', // 父分类主键是否末级分类
        'itype': 0, // 父分类主键类型 0表示是个分类目录 1表示是票据
        'page': 1,
        'pk_parentcategory': Random.string(18), // 父分类主键
        'period': '2018-12', // 父分类主键期间
        'pk_basecategory': Random.string(18), // 父分类主键集团分类主键
        'id': Random.string(18), // 父分类主键分类或者票据主键，看itype
        'pk_corp': Random.string(6), // 父分类主键公司主键
        'primaryKey': Random.string(18), // 父分类主键分类或者票据主键
        'rows': 10,
        'sealflag': '是', // 父分类主键是否封存(这个应该都是没封存的，忽略此字段)
        'settype': settype, // 父分类主键设置类型0:普通节点1：固定资产2：无形资产或待摊销费用99不能编辑目录
        'showorder': 10, // 父分类主键分类显示顺序 按这个排序
        'status': 0,
        'ts': Random.datetime()
      }
    )
  }
  count = Random.integer(5, 15)
  for (let i = 0; i < count; i++) {
    data.push(
      {
        'allowchild': '否',
        'billcount': 2,
        'categorycode': '110930322710801',
        'categorylevel': 2,
        'categoryname': Random.ctitle(6, 11) + '-0888(' + Random.integer(1, 30) + ')', // '北京农村商业银行-0801(2)',
        'categorytype': 5,
        'childlevel': 1,
        'dr': 0,
        'isleaf': '否',
        'itype': 0,
        'page': 1,
        'parent_id': '',
        'period': '2018-12',
        'id': 'bank_834631',
        'pk_corp': Random.string(6),
        'pk_parentcategory': Random.string(18),
        'primaryKey': Random.string(18),
        'rows': 10,
        'settype': 99,
        'status': 0
      }
    )
  }
  count = Random.integer(5, 15)
  for (let i = 0; i < count; i++) {
    data.push(
      {
        'billtitle': Random.ctitle(4, 8), // 父分类主键票据显示的名称
        'itype': 1, // 父分类主键类型 0表示是个分类目录 1表示是票据
        'page': 1,
        'parent_id': '',
        'id': Random.string(18), // 父分类主键票据主键
        'primaryKey': Random.string(18),
        'rows': 10,
        'status': 0
      }
    )
  }
  return {
    msg: '查询成功',
    status: 200,
    success: true,
    total: Random.integer(30, 120),
    rows: data
  }
}
//
// const successDate = function () {
//   return {
//     msg: '成功！',
//     status: 200,
//     success: true,
//   }
// }

Mock.setup({
  timeout: '500-1000'
})

Mock.mock('/zncs/workbench!queryCategory.action', 'post', listData)

export default Mock
