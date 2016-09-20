// Panel Imports
import './top_up.css!'
import template from './top_up.html!text'

import { insert_transaction } from 'app/vuex/actions'

// JS Imports
// –– Vue
import Vue from 'vue'


export default Vue.extend({
    template,
    props: ['subscription_id', 'close'],
    data: () => ({
        executed: null,
        amount: 0,
        error: null,
    }),
    route: {

    },
    vuex: {
        actions: {
            insert_transaction,
        },
    },
    computed: {
        transaction() {
            return {
                subscription_id: this.subscription_id,
                executed: this.executed,
                amount: this.amount,
            }
        },
        valid_transaction() {
            return this.subscription_id
                && this.executed
                && this.amount
        },
    },
    ready() {
        const today   = new Date()
        this.executed = today / 1000
    },
    methods: {
        clicked_add() {
            this.insert_transaction(this.transaction)
                .then(this.close)
                .catch(e => (this.error = e.message))
        },
    },
})
