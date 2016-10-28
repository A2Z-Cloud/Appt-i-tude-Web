import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

import { merge } from 'app/utils/merge'
import { debug } from 'app/consts/local'

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
    opportunities: [],
    ratecards: [],
    subscriptions: [],
    transactions: [],
    focused_subscription_id: null,
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
        else ratecards.push(new_ratecard)
    },
    GROUP_UPDATE({groups}, group) {
        const index     = groups.findIndex(g => g.id === group.id)
        const new_group = merge(groups[index], group)
        if (index !== -1) groups.$set(index, new_group)
        else groups.push(new_group)
    },
    OPPORTUNITY_UPDATE({opportunities}, opportunity) {
        const index = opportunities.findIndex(o => o.id === opportunity.id)
        const new_opportunity = merge(opportunities[index], opportunity)
        new_opportunity.apptitude_from_date = new_opportunity.apptitude_from_date ? moment.unix(new_opportunity.apptitude_from_date) : null
        new_opportunity.apptitude_to_date   = new_opportunity.apptitude_to_date ? moment.unix(new_opportunity.apptitude_to_date) : null
        if (index !== -1) opportunities.$set(index, new_opportunity)
        else opportunities.push(new_opportunity)
    },
    SUBSCRIPTION_FOCUS(state, id) {
        state.focused_subscription_id = id
    },
    SUBSCRIPTION_UPDATE({subscriptions}, subscription) {
        const index   = subscriptions.findIndex(s => s.id === subscription.id)
        const new_sub = merge(subscriptions[index], subscription)
        new_sub.service_data = JSON.parse(new_sub.service_data)
        new_sub.from_date = moment.unix(new_sub.from_date)
        new_sub.to_date = moment.unix(new_sub.to_date)
        if (index !== -1) subscriptions.$set(index, new_sub)
        else subscriptions.push(new_sub)
    },
    TRANSACTION_INSERT({transactions}, transaction) {
        transaction.executed = moment.unix(transaction.executed)
        transaction.updated = moment.unix(transaction.updated)
        transactions.push(transaction)
    },
    TRANSACTION_UPDATE({transactions}, transaction) {
        const index    = transactions.findIndex(t => t.id === transaction.id)
        const new_tran = merge(transactions[index], transaction)
        new_tran.executed = moment.unix(new_tran.executed)
        new_tran.updated = moment.unix(new_tran.updated)
        if (index !== -1) transactions.$set(index, new_tran)
        else transactions.push(new_tran)
    },
}


export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
})
