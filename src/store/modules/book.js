const book = {
  state: {
    fileName: '',
    menuVisible:false,
    settingVisible:-1,  // -1:不显示，0：显示字号，1：显示主题，2：显示进度条，3：显示目录
    defaultFontSize: 16,
    currentBook:null,
    defaultFontFamily: 'Default', // 默认的字体
    fontFamilyVisible:false,
    defaultTheme:'default',
    progress:0,
    bookAvailable:false,
    section:0, // 章节信息
    cover:null,// 封面
    metadata: null,// 作者，标题
    navigation:null,// 目录
    offsetY:0,// y轴的偏移量
    isBookmark:null, // 当前页是否为书签页
    pageList: null,// 页数
    paginate: '',// 显示分页信息
  },
  mutations: {
    'SET_FILE_NAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENU_VISIBLE': (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    'SET_SETTING_VISIBLE': (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    'SET_DEFAULT_FONT_SIZE': (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    },
    'SET_CURRENT_BOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    'SET_DEFAULT_FONT_FAMILY': (state, defaultFontFamily) => {
      state.defaultFontFamily = defaultFontFamily
    },
    'SET_FONT_FAMILY_VISIBLE': (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    'SET_DEFAULT_THEME': (state, defaultTheme) => {
      state.defaultTheme = defaultTheme
    },
    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    'SET_SECTION': (state, section) => {
      state.section = section
    },
    'SET_COVER': (state, cover) => {
      state.cover = cover
    },
    'SET_METADATA': (state, metadata) => {
      state.metadata = metadata
    },
    'SET_NAVIGATION': (state, navigation) => {
      state.navigation = navigation
    },
    'SET_OFFSETY': (state, offsetY) => {
      state.offsetY = offsetY
    },
    'SET_IS_BOOKMARK': (state, isBookmark) => {
      state.isBookmark = isBookmark
    },
    'SET_PAGE_LIST': (state, pageList) => {
      state.pageList = pageList
    },
    'SET_PAGINATE': (state, paginate) => {
    state.paginate = paginate
    },
  }
}
// 将book对象作为模块输出
export default book