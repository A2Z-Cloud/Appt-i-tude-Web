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
            // Transactions keys by concat(year month)
            // unless transaction date is past sub renewal date.
            const delimiter    = this.selected_subscription.from_date.date()
            const month_group  = t => (t.executed.date() < delimiter) ? moment(t.executed).subtract(1, 'months').format('YYYY MM') : t.executed.format('YYYY MM')
            const month_groups = _.groupBy(this.subscriptions_transactions, month_group)
            // Remove any transactions not in subscription month range and merge in any missing
            for (const period of this.subscription_months) {
                if (!month_groups.hasOwnProperty(period)) {
                    month_groups[period] = []
                }
            }
            return _.pick(month_groups, this.subscription_months)
        },
        subscription_months() {
            // returns all year-month periods in a subscription
            const periods   = []
            const from_date = this.selected_subscription.from_date.clone()
            const to_date   = this.selected_subscription.to_date
            for (let m = from_date; from_date.isBefore(to_date); m.add(1, 'months')) {
                periods.push(m.format("YYYY MM"))
            }
            return periods
        },
        ordered_months() {
            // Takes the transactions keyed by month and returned those keys ordered
            // Dont allow any future months just incase they've been logged prematurly
            const today         = moment()
            const all_dates     = _.keys(this.monthly_subscription_transactions)
            const past_dates    = all_dates.filter(d => !(moment(d, "YYYY MM", true).year() > today.year() || moment(d, "YYYY MM", true).year() === today.year() && moment(d, "YYYY MM", true).month() > today.month()))
            const ordered_dates = past_dates.sort((a, b) => moment(a, "YYYY MM", true).isBefore(moment(b, "YYYY MM", true)))
            return ordered_dates
        },
        month_summaries() {
            const chronological_month_order = this.ordered_months.reverse()
            const transactions = this.monthly_subscription_transactions
            const summeries    = []
            const rates = this.selected_subscription.service_data.rates
            const added = this.selected_subscription.service_data.monthly_balance

            const transaction_cost = t => {
                const rate          = rates[t.rate]
                const minutes_spent = t.duration / 60
                return (rate && minutes_spent) ? rate * minutes_spent : 0
            }

            for (const month of chronological_month_order) {
                const period   = moment(month, "YYYY MM", true)
                const previous = summeries.slice(-1)[0]
                const start    = (previous) ? previous.balance : 0
                const costs    = transactions[month].map(transaction_cost)
                const spent    = costs.reduce((a, b) => a + b, 0)
                const balance  = start + added - spent

                summeries.push({period, start, spent, added, balance})
            }
            return summeries.reverse()
        },
        current_month_summary() {
            return this.month_summaries.reverse().slice(-1)[0]
        },
        historic_month_summaries() {
            return this.month_summaries.slice(1)
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
