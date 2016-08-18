// Panel Imports
import './dashboard.css!'
import template from './dashboard.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'
import moment from 'moment'
import _ from 'lodash'
import {
    filter_subscriptions,
    filter_groups,
    filter_transactions } from 'app/vuex/actions'


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
        subscriptions_transactions() {
            if (this.selected_group === null) return []
            return this.transactions.filter(t => t.group_id === this.selected_group.id)
        },
        monthly_subscription_transactions() {
            const delimiter   = this.selected_subscription.from_date.date()
            const month_group = t => (t.executed.date() < delimiter) ? t.executed.format('YYYY MM') : moment(t.executed).add(1, 'months').date(delimiter).format('YYYY MM')
            return _.groupBy(this.subscriptions_transactions, month_group)
        },
        ordered_months() {
            // Takes the transactions keyed by month and returned those keys orded
            const dates = _.keys(this.monthly_subscription_transactions)
            return dates.sort((a, b) => moment(a, "YYYY MM", true).isBefore(moment(b, "YYYY MM", true)))
        },
    },
    ready() {
        this.selected_subscription_id = (this.subscriptions.length) ? this.subscriptions[0].id : null
    },
    methods: {

    },
    vuex: {
        getters: {
            groups: state => state.groups,
            subscriptions: state => state.subscriptions,
            transactions: state => state.transactions,
        },
        actions: {
            filter_groups,
            filter_subscriptions,
            filter_transactions,
        },
    },
    watch: {
        selected_subscription_id(id) {
            if (!id) return
            this.filter_transactions(id)
        },
    },
})
