import Mock from 'mockjs'

const data = Mock.mock({
  'items|100': [{
    'id|+1': 1,
    username: '@sentence(1, 1)',
    'status|1': ['published', 'draft', 'deleted'],
    password: 'name',
    rent: 'rent',
    edittime: '@datetime',
    pageviews: '@integer(300, 5000)',
    checked: false
  }]
})

export default [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
