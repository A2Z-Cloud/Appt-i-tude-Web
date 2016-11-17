// Panel Imports
import './top_up.css!'
import template from './top_up.html!text'

import moment from 'moment'

// JS Imports
// –– Vue
import Vue from 'vue'

import { insert_transaction } from 'app/vuex/actions'


export default Vue.extend({
    template,
    props: ['subscription_id', 'close'],
    data: () => ({
        executed: null,
        amount: 0,
        error: null,
    }),
    vuex: {
        getters: {
            subscriptions: state => state.subscriptions,
        },
        actions: {
            insert_transaction,
        },
    },
    computed: {
        subscription() {
            const selected = s => s.id === this.subscription_id
            const index    = this.subscriptions.findIndex(selected)

            if (index !== -1) {
                return this.subscriptions[index]
            }

            this.error = "Failed to load the current subscription. Please try refreshing the page."
            return null
        },
        transaction() {
            return {
                subscription_id: this.subscription_id,
                executed: this.executed,
                amount: this.amount,
            }
        },
        valid_transaction() {
            if(!this.subscription) return false

            // check transactionis within subscription dates
            const constrained = this.executed > this.subscription.from_date
                             && this.executed < this.subscription.to_date

            // show error to user if date not constrained
            this.error = !constrained ? "The transaction date must not be outside the subscription dates." : null

            return this.subscription_id
                && this.amount
                && constrained
        },
    },
    ready() {
        this.executed = moment()
    },
    methods: {
        clicked_add() {
            this.insert_transaction(this.transaction)
                .then(this.close)
                .catch(e => (this.error = e.message))
        },
    },
})
