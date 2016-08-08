import Vue from 'vue'
import Vuex from 'vuex'

import { merge } from 'app/utils/merge'
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
    groups: [],
    ratecards: [],
    subscriptions: [],
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
    RATECARD_UPDATE({ratecards}, ratecard) {
        const index        = ratecards.findIndex(rc => rc.id === ratecard.id)
        const new_ratecard = merge(ratecards[index], ratecard)
        if (index !== -1) ratecards.$set(index, new_ratecard)
        else ratecards.push(ratecard)
    },
    GROUP_UPDATE({groups}, group) {
        const index     = groups.findIndex(g => g.id === group.id)
        const new_group = merge(groups[index], group)
        if (index !== -1) groups.$set(index, new_group)
        else groups.push(group)
    },
    SUBSCRIPTION_UPDATE({subscriptions}, subscription) {
        const index   = subscriptions.findIndex(s => s.id === subscription.id)
        const new_sub = merge(subscriptions[index], subscription)
        if (index !== -1) subscriptions.$set(index, new_sub)
        else subscriptions.push(subscription)
    },
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
