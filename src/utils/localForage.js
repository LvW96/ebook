import localForage from 'localforage'

//将数据保存到离线仓库
export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    // 成功时的回调
    if (cb) cb(value)
  }).catch(function(err) {
    // 失败时的回调
    if (cb2) cb2(err)
  })
}
//从仓库中获取 key 对应的值并将结果提供给回调函数
export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}
//从离线仓库中删除 key 对应的值
export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
//从数据库中删除所有的 key，重置数据库
export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
// 获取长度
export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      //console.log(numberOfKeys)
    }).catch(function(err) {
    if (err){}
    //console.log(err)
  })
}
// 获取indexedDB数据库中的每一个元素
export function iteratorLocalForage() {
  localForage.iterate(function(value, key, iterationNumber) {
    //console.log([key, value])
  }).then(function() {
    //console.log('Iteration has completed')
  }).catch(function(err) {
    if (err){}
   // console.log(err)
  })
}
// 用来判断当前浏览器是否支持indexedDB数据库
export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
