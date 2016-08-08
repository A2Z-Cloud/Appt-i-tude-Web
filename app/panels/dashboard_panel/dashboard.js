// Panel Imports
import './dashboard.css!'
import template from './dashboard.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'
import {
    filter_subscriptions,
    filter_groups } from 'app/vuex/actions'


export default Vue.extend({
    template,
    route: {
        waitForData: true,
        data() {
            return Promise.all([
                this.filter_subscriptions(),
                this.filter_groups(),
            ])
        },
    },
    data: () => ({
        selected_subscription_id: null,
    }),
    computed: {
        selected_subscription() {
            const selected = s => s.id === this.selected_subscription_id
            const index    = this.subscriptions.findIndex(selected)
            return (index !== -1) ? this.subscriptions[index] : null
        },
        selected_group() {
            if (this.selected_subscription === null) return null
            const selected = g => g.id === this.selected_subscription.group_id
            const index    = this.groups.findIndex(selected)
            return (index !== -1) ? this.groups[index] : null
        },
    },
    ready() {
        this.selected_subscription_id = (this.subscriptions.length) ? this.subscriptions[0].id : null
    },
    methods: {

    },
    vuex: {
        getters: {
            subscriptions: state => state.subscriptions,
            groups: state => state.groups,
        },
        actions: {
            filter_subscriptions,
            filter_groups,
        },
    },
})
