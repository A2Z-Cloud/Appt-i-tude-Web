// Panel Imports
import './update_value.css!'
import template from './update_value.html!text'

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
        value: 0,
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
    },
    ready() {
        // check if the state can be changed
        this.validate_subscription()

        // set current value
        if(!this.error) {
            this.value = parseFloat(this.selected_subscription.service_data.monthly_balance);
        }
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
            // create new subscription state
            var new_service_data = this.selected_subscription.service_data;
            new_service_data.monthly_balance = this.value;

            // update on server
            this.update_subscription(this.subscription_id, new_service_data)
                .then(this.close)
                .catch(e => (this.error = e.message))
        },
    },
})
