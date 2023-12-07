import {createStore} from 'vuex'
export default createStore({
    state:{
        loginUserInfo:'',
        showLogin:false
    },
    getters:{},
    mutations:{
        updateLoginUserInfo(state,value){
            state.loginUserInfo=value
        },
        showLogin(state,value){
            state.showLogin=value
        }
    },
    actions:{}
})