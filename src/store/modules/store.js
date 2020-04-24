const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false,// 控制卡片翻转动画的显示
    isEditMode: false,// 是否进入编辑模式
    shelfList: [],// 书架图书列表
    shelfSelected: [],// 书架图书选中列表
    shelfTitleVisible: true,// 书架标题的显示状态
    shelfCategory: [], // 书架分类列表数据
    currentType: 1 // 书架列表为1，书架分类列表为2
  },
  mutations: {
    'SET_HOT_SEARCH_OFFSETY':(state, hotSearchOffsetY) => {
      state.hotSearchOffsetY = hotSearchOffsetY
    },
    'SET_FLAP_CARD_VISIBLE':(state, flapCardVisible) => {
      state.flapCardVisible = flapCardVisible
    },
    'SET_IS_EDIT_MODE':(state, isEditMode) => {
      state.isEditMode = isEditMode
    },
    'SET_SHELF_LIST':(state, shelfList) => {
      state.shelfList = shelfList
    },
    'SET_SHELF_SELECTED':(state, selected) => {
      state.shelfSelected = selected
    },
    'SET_SHELF_TITLE_VISIBLE':(state, visible) => {
      state.shelfTitleVisible = visible
    },
    'SET_SHELF_CATEGORY':(state, shelfCategory) => {
      state.shelfCategory = shelfCategory
    },
    'SET_CURRENT_TYPE':(state, currentType) => {
      state.currentType = currentType
    }
  }
}

export default store
