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
