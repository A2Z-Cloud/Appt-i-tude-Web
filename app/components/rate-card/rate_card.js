// Panel Imports
import './rate_card.css!'
import template from './rate_card.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

// import { get_tasklists_tasks } from 'app/vuex/actions'


export default Vue.extend({
    template,
    props: ['close'],
    data: () => ({
        error: null,
    }),
    vuex: {
        getters: {
            focused_subscription_id: state => state.focused_subscription_id,
            subscriptions: state => state.subscriptions,
            // zoho_tasklists: state => state.zoho_tasklists,
        },
        actions: {
            // get_tasklists_tasks,
        },
    },
    computed: {
        selected_subscription() {
            const selected = s => s.id === this.focused_subscription_id
            const index    = this.subscriptions.findIndex(selected)
            return (index !== -1) ? this.subscriptions[index] : null
        },
        allowance() {
            return this.selected_subscription ? this.selected_subscription.service_data.monthly_balance : 0
        },
    },
    ready() {

    },
    methods: {

    },
})
