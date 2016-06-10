import Vue from 'vue'
import Vuex from 'vuex'

import { debug } from 'app/consts'

Vue.use(Vuex)


const state = {
    window_size: {
        width: window.innerWidth,
        height: window.innerHeight,
    },
    ws_status: null,
    error: null,
    auth_client_url: null,
    user: null,
}


const mutations = {
    WINDOWS_SIZE_SET(state, size) {
        state.window_size = size
    },
    WS_STATUS_SET(state, status) {
        state.ws_status = status
    },
    ERROR_SET(state, error) {
        state.error = error
    },
    AUTH_CLIENT_URL_SET(state, url) {
        state.auth_client_url = url
    },
    CURRENT_USER_SET(state, user) {
        state.user = user
    },
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
