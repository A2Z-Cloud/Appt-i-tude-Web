// Panel Imports
import './dashboard.css!'
import template from './dashboard.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'
import TopUpPanel from 'app/components/top_up/top_up'

import moment from 'moment'
import _ from 'lodash'



import { filter_groups,
         filter_subscriptions,
         filter_transactions,
         focus_subscription } from 'app/vuex/actions'


export default Vue.extend({
    template,
    components: {
        'top-up': TopUpPanel,
    },
    route: {
        waitForData: true,
        data() {
            return Promise.all([
                this.filter_subscriptions({all_users:this.is_admin}),
                this.filter_groups({all_groups:this.is_admin}),
                this.filter_transactions(this.focused_subscription_id),
            ]).catch(() => false)
        },
    },
    data: () => ({
        show_topup_view: false,
    }),
    computed: {
        is_admin() {
            return this.current_user.type === 'admin'
        },
        selected_subscription() {
            const selected = s => s.id === this.focused_subscription_id
            const index    = this.subscriptions.findIndex(selected)
            return (index !== -1) ? this.subscriptions[index] : null
        },
        subscription_started() {
            return this.selected_subscription.from_date < moment()
        },
        month_start() {
            return this.selected_subscription.from_date.format('DD');
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
            // Takes the transactions keyed by month and returns those keys in order
            // Dont allow any future months just incase they've been logged prematurely
            const today         = moment()
            const all_dates     = _.keys(this.monthly_subscription_transactions)
            const past_dates    = all_dates.filter(d => moment(d+" "+this.month_start, "YYYY MM DD", true).isBefore(today))
            const ordered_dates = past_dates.sort((a, b) => moment(a, "YYYY MM", true).isBefore(moment(b, "YYYY MM", true)))
            return ordered_dates
        },
        month_summaries() {
            const chronological_month_order = this.ordered_months.reverse()
            const transactions  = this.monthly_subscription_transactions
            const summaries     = []
            const monthly_topup = this.selected_subscription.service_data.monthly_balance

            for (const month of chronological_month_order) {
                const period   = moment(month+" "+this.month_start, "YYYY MM DD", true)
                const previous = summaries.slice(-1)[0]
                const start    = (previous) ? previous.balance : 0
                const amounts  = transactions[month].map(t => t.amount)
                const spent    = amounts.filter(t => t < 0).reduce((a, b) => a + b, 0)
                const credit   = amounts.filter(t => t > 0).reduce((a, b) => a + b, 0)
                const added    = monthly_topup + credit
                const balance  = start + added + spent

                summaries.push({period, start, spent, added, balance})
            }
            return summaries.reverse()
        },
        current_month_summary() {
            return this.month_summaries.reverse().slice(-1)[0]
        },
        historic_month_summaries() {
            return this.month_summaries.slice(1)
        },
        current_visible_month() {
            let visible_date = this.ordered_months.slice(-1)[0]+" "+this.month_start
            return moment(visible_date, "YYYY MM DD", true)
        },
        showing_current_month() {
            return this.current_visible_month.isSame(moment(),'month')
        },
        upcoming_month() {
            return moment(this.current_visible_month).add(1,'Month')
        },
    },
    ready() {
        if(!this.focused_subscription_id) {
            const id = (this.subscriptions.length) ? this.subscriptions[0].id : null
            this.focus_subscription(id)
        }
    },
    methods: {

    },
    vuex: {
        getters: {
            current_user: state => state.user,
            groups: state => state.groups,
            subscriptions: state => state.subscriptions,
            transactions: state => state.transactions,
            focused_subscription_id: state => state.focused_subscription_id,
        },
        actions: {
            filter_groups,
            filter_subscriptions,
            filter_transactions,
            focus_subscription,
        },
    },
    watch: {
        focused_subscription_id(id) {
            if (!id) return
            this.filter_transactions(id)
        },
    },
})
