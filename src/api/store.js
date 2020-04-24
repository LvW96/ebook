import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

// 电子书详情接口
export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}
// 电子书的下载
export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,// 电子书的路径
    method: 'get',// 请求的方式
    responseType: 'blob',// 下载类型
    timeout: 180 * 1000,// 超时时间
    onDownloadProgress: progressEvent => {// 监听下载进度
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`)// 调用get方法来下载电子书，拼电子书在nginx上的路径
    .then(res =>{
      const blob = new Blob([res.data])
      setLocalForage(book.fileName,blob,() => {
        if (onSuccess) onSuccess(book)
      },err => {
        if (onError) onError(err)
      })
      }).catch(err => {
      if (onError) onError(err)
    })
}
export function home2() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/home2`
  })
}
