import Storage from 'web-storage-cache'

const localStorage = new Storage()
export function setLocalStotage(key,value) {
  return localStorage.set(key,value)
}

export function getLocalStorage(key,value) {
  return localStorage.get(key,value)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

export function setBookObject(fileName,key,value) {
  let book = getLocalStorage(`${fileName}-info`)
  if(!book){
    book = {}
  }
  book[key] = value
  setLocalStotage(`${fileName}-info`,book)
}

export function getBookObject(fileName,key) {
  let book = getLocalStorage(`${fileName}-info`)
  if(book){
    return book[key]
  }else {
    return null
  }
}

// 获取字体
export function getFontFamily(fileName) {
  return getBookObject(fileName,'fontFamily')
}
// 保存字体
export function saveFontFamily(fileName,font) {
  return setBookObject(fileName,'fontFamily',font)
}

// 获取字号
export function getFontSize(fileName) {
  return getBookObject(fileName,'fontSize')
}
// 保存字号
export function saveFontSize(fileName,fontSize) {
  return setBookObject(fileName,'fontSize',fontSize)
}
// 获取默认语言
export function getLocale() {
  return getLocalStorage('locale')
}
// 保存默认语言
export function saveLocale(locale) {
  return setLocalStotage('locale',locale)
}
// 获取主题
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}
// 保存主题
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}
// 保存阅读进度
export function saveLocation(fileName,location) {
  setBookObject(fileName,'location',location)
}
// 获取阅读进度
export function getLocation(fileName) {
  return getBookObject(fileName,'location')
}
// 保存阅读时间
export function saveReadTime(fileName,time) {
  setBookObject(fileName,'time',time)
}
// 获取阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName,'time')
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}

// 获取书签
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}
// 保存书签
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}
// 保存书架信息
export function saveBookShelf(shelf) {
  return setLocalStotage('shelf', shelf)
}
// 获取书架信息
export function getBookShelf() {
  return getLocalStorage('shelf')
}

export function getHome() {
  return getLocalStorage('home')
}

export function saveHome(home) {
  return setLocalStotage('home', home, 1800)
}
