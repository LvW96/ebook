const actions = {
  'setFileName': ({commit}, fileName) => {
    return commit('SET_FILE_NAME', fileName)
  },
  'setMenuVisible': ({commit}, menuVisible) => {
    return commit('SET_MENU_VISIBLE', menuVisible)
  },
  'setSettingVisible': ({commit}, settingVisible) => {
    return commit('SET_SETTING_VISIBLE', settingVisible)
  },
  'setDefaultFontSize': ({commit}, defaultFontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
  },
  'setCurrentBook': ({commit}, currentBook) => {
    return commit('SET_CURRENT_BOOK', currentBook)
  },
  'setDefaultFontFamily': ({commit}, defaultFontFamily) => {
    return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
  },
  'setFontFamilyVisible': ({commit}, fontFamilyVisible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
  },
  'setDefaultTheme': ({commit}, defaultTheme) => {
    return commit('SET_DEFAULT_THEME', defaultTheme)
  },
  'setProgress': ({commit}, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  'setBookAvailable': ({commit}, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  'setSection': ({commit}, section) => {
    return commit('SET_SECTION', section)
  },
  'setCover': ({commit}, cover) => {
    return commit('SET_COVER', cover)
  },
  'setMetaData': ({commit}, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  'setNavigation': ({commit}, navigation) => {
    return commit('SET_NAVIGATION', navigation)
  },
  'setOffsetY': ({commit}, offsetY) => {
    return commit('SET_OFFSETY', offsetY)
  },
  'setIsBookmark': ({commit}, isBookmark) => {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  'setPageList': ({commit}, pageList) => {
    return commit('SET_PAGE_LIST', pageList)
  },
  'setPaginate': ({commit}, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  'setHotSearchOffsetY': ({commit}, hotSearchOffsetY) => {
    return commit('SET_HOT_SEARCH_OFFSETY', hotSearchOffsetY)
  },
  'setFlapCardVisible': ({commit}, flapCardVisible) => {
    return commit('SET_FLAP_CARD_VISIBLE', flapCardVisible)
  },
  'setIsEditMode':({ commit }, isEditMode) => {
    return commit('SET_IS_EDIT_MODE', isEditMode)
  },
  'setShelfList':({ commit }, shelfList) => {
    return commit('SET_SHELF_LIST', shelfList)
  },
  'setShelfSelected':({ commit }, selected) => {
    return commit('SET_SHELF_SELECTED', selected)
  },
  'setShelfTitleVisible':({ commit }, visible) => {
    return commit('SET_SHELF_TITLE_VISIBLE', visible)
  },
  'setShelfCategory':({ commit }, shelfCategory) => {
    return commit('SET_SHELF_CATEGORY', shelfCategory)
  },
  'setCurrentType':({ commit }, currentType) => {
    return commit('SET_CURRENT_TYPE', currentType)
  }
}
export default actions