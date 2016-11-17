// Panel Imports
import './update_state.css!'
import template from './update_state.html!text'

import moment from 'moment'

// JS Imports
// –– Vue
import Vue from 'vue'

import { update_subscription } from 'app/vuex/actions'


export default Vue.extend({
    template,
    props: ['subscription_id', 'close'],
    data: () => ({
        error: null,
    }),
    vuex: {
        getters: {
            subscriptions: state => state.subscriptions,
        },
        actions: {
            update_subscription,
        },
    },
    computed: {
        selected_subscription() {
            const selected = s => s.id === this.subscription_id
            const index    = this.subscriptions.findIndex(selected)

            if (index !== -1) {
                return this.subscriptions[index]
            }

            this.error = "Failed to load the current subscription state. Please try refreshing the page."
            return null
        },
        new_state() {
            if(this.selected_subscription)
                return this.selected_subscription.service_data.contract_state != 'active' ? 'active' : 'suspended'
            else
                return null
        },
        state_colour() {
            switch (this.new_state) {
                case 'active':
                    return '#2CB12C'
                case 'suspended':
                    return '#D83F60'
                default:
                    return null
            }
        },
    },
    ready() {
        // check if the state can be changed
        this.validate_subscription()
    },
    methods: {
        validate_subscription() {
            const started = this.selected_subscription.from_date < moment()
            const ended   = this.selected_subscription.to_date < moment()
            const valid   = started && !ended
            if(!valid)
                this.error = "This subscription's state cannot be changed as it has " + (ended ? "ended." : "not started.")
        },
        accept() {
            this.update_subscription(this.subscription_id, this.new_state)
                .then(this.close)
                .catch(e => (this.error = e.message))
        },
    },
})
