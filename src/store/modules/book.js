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
    }
  }
}
// 将book对象作为模块输出
export default book