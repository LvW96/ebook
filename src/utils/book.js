import {realPx} from './utils'

export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

export function themeList(vue) {
  return [
    {
      alias: vue.$t(`book.themeDefault`),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    },
    {
      alias: vue.$t(`book.themeGold`),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    },
    {
      alias: vue.$t(`book.themeEye`),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    },
    {
      alias: vue.$t(`book.themeNight`),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        }
      }
    }
  ]
}

// 动态添加link标签
export function addCss(href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

// 删除css样式
export function removeCss(href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}

export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}
// 将目录的树状结构转换为一维数组形式
export function flatten(array) {
  // 先通过扩展运算符对数组进行拆分，然后通过concat方法对拆分的数组进行合并
  // 因目录中存在三级、四级等目录，因此使用递归调用
  return [].concat(...array.map(item => [].concat(item,...flatten(item.subitems))))
  // return array.map(item => [].concat(item,...flatten(item.subitems)))
}