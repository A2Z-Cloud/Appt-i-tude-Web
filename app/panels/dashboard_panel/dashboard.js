// Panel Imports
import './dashboard.css!'
import template from './dashboard.html!text'

// Components
import RateCard from 'app/components/rate-card/rate_card'
import TopUp from 'app/components/top-up/top_up'
import UpdateState from 'app/components/update-state/update_state'
import Notice from 'app/components/notice/notice'

// JS Imports
// –– Vue
import Vue from 'vue'

import moment from 'moment'
import _ from 'lodash'

import {
    chronological,
    reverse_chronological } from 'app/utils/date_sorts'


import { filter_groups,
         filter_subscriptions,
         filter_transactions,
         focus_subscription } from 'app/vuex/actions'


export default Vue.extend({
    template,
    components: {
        'rate-card': RateCard,
        'top-up': TopUp,
        'update-state': UpdateState,
        'notice': Notice,
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
        is_showing_actions: false,
        current_action: null,
        override_notice: false,
        zoho_reports_url: "http://reports.zoho.eu/",
    }),
    computed: {
        is_admin() {
            const admin = this.current_user.type === 'admin'
            // re-evaluate the override, admins should always see the summary
            this.override_notice = admin ? true : false
            return admin
        },
        selected_subscription() {
            const selected = s => s.id === this.focused_subscription_id
            const index    = this.subscriptions.findIndex(selected)
            return (index !== -1) ? this.subscriptions[index] : null
        },
        subscription_started() {
            return this.selected_subscription &&
                   this.selected_subscription.from_date < moment()
        },
        subscription_ended() {
            return this.selected_subscription &&
                   this.selected_subscription.to_date < moment()
        },
        subscription_suspended() {
            return this.selected_subscription &&
                   this.selected_subscription.service_data.contract_state == 'suspended'
        },
        showing_dashboard() {
            const hide_notice = this.subscription_started  &&
                                !this.subscription_ended   &&
                                !this.subscription_suspended
            // cannot show dashboard if no subscription is selected
            return this.selected_subscription && (this.override_notice || hide_notice)
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
            const ordered_dates = past_dates.slice().sort(reverse_chronological)
            return ordered_dates
        },
        month_summaries() {
            const chronological_month_order = this.ordered_months.slice().sort(chronological)
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
            return summaries.slice().reverse()
        },
        current_month_summary() {
            return this.month_summaries.slice(0)[0]
        },
        historic_month_summaries() {
            return this.month_summaries.slice(1)
        },
        showing_current_month() {
            return this.subscription_ended ? true : this.current_month_summary.period.isSame(moment(),'month')
        },
        upcoming_month() {
            return moment(this.current_month_summary.period).date(this.month_start).add(1,'Month')
        },
        toggled_state() {
            return this.selected_subscription.service_data.contract_state != 'active' ? 'active' : 'suspended'
        },
    },
    ready() {
        if(!this.focused_subscription_id) {
            const id = (this.subscriptions.length) ? this.subscriptions[0].id : null
            this.focus_subscription(id)
        }
    },
    methods: {
        toggle_actions() {
            if(this.is_showing_actions || this.current_action)
                this.set_action(null)
            else
                this.is_showing_actions = true
        },
        set_action(action) {
            this.is_showing_actions = false
            this.current_action = action
        },
        close_action() {
            this.set_action(null)
        },
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
