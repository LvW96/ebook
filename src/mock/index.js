import Mock from 'mockjs'
import home from './bookHome'// 首页数据
import shelf from './bookShelf'// 书架数据
import list from './bookList'// 所有图书列表
import flatList from './bookFlatList'// 查询使用

// 使用Mock中的mock方法来做接口，第一个参数是一个正则表达式来匹配所请求的url，第二个参数是请求参数，第三个参数是模块名
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', list)
Mock.mock(/\/book\/flat-list/, 'get', flatList)
