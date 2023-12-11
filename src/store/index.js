import {createStore} from 'vuex'
export default createStore({
    state:{
        loginUserInfo:null,
        showLogin:false,
        boardList:[],
        articlePboard:0,
        articleBoard:0
    },
    getters:{

    },
    mutations:{
        updateLoginUserInfo(state,value){
            state.loginUserInfo=value
        },
        showLogin(state,value){
            state.showLogin=value
        },
        setBoardList(state,value){
            state.boardList=value
        },
        setArticlePboard(state,value){
            state.articlePboard=value
        },
        setArticleBoard(state,value){
            state.articleBoard=value
        },
    },
    actions:{}
})