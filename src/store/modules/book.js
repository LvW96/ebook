const book = {
    state: {
        text: 1
    },
    mutations: {
        'SET_TEXT':(state,newText) => {
            state.text = newText
        }
    },
    actions: {
        'setText':({commit,state},newText)=> {
            return commit('SET_TEXT',newText)
        }
    }
}
// 将book对象作为模块输出
export default book