// Panel Imports
import './../dashboard_panel/dashboard.css!'
import template from './../dashboard_panel/dashboard.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import moment from 'moment'
import _ from 'lodash'

import current_user from './resources/current_user.json!json'
import groups from './resources/groups.json!json'
import subscriptions from './resources/subscriptions.json!json'
import transactions from './resources/transactions.json!json'


export default Vue.extend({
    template,
    data: () => ({
        current_user,
        groups,
        focused_subscription_id: 1,
    }),
    computed: {
        subscriptions() {
            const json_subs = subscriptions
            for (const sub of json_subs) {
                sub.from_date = moment(sub.from_date)
                sub.to_date   = moment(sub.to_date)}
            return json_subs
        },
        transactions() {
            const json_trans = transactions
            for (const tran of json_trans) {
                tran.executed = moment(tran.executed)
                tran.updated  = moment(tran.updated)
            }
            return json_trans
        },
        selected_subscription() {
            const selected = s => s.id === this.focused_subscription_id
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
            return this.transactions.filter(t => t.subscription_id === this.selected_subscription.id)
        },
        monthly_subscription_transactions() {
            // Transactions keyed by concat(year month)
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
            const transactions  = this.monthly_subscription_transactions
            const summeries     = []
            const monthly_topup = this.selected_subscription.service_data.monthly_balance

            for (const month of chronological_month_order) {
                const period   = moment(month, "YYYY MM", true)
                const previous = summeries.slice(-1)[0]
                const start    = (previous) ? previous.balance : 0
                const amounts  = transactions[month].map(t => t.amount)
                const spent    = amounts.filter(t => t < 0).reduce((a, b) => a + b, 0)
                const credit   = amounts.filter(t => t > 0).reduce((a, b) => a + b, 0)
                const added    = monthly_topup + credit
                const balance  = start + added + spent

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
})
