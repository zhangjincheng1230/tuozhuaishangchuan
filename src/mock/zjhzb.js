import Mock from 'mockjs'

Mock.mock('/api/list',{
    "user|12-20": [{
        'name': '@cname', //中文名称
        'age|1-100': 100, //100以内随机整数
        'birthday': '@date("yyyy-MM-dd")', //日期
        'city': '@city(true)' ,//中国城市
        'email': '@email',
        "number|10.2": 100,
      }]

})