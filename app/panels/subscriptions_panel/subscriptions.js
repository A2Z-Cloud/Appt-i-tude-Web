// Panel Imports
import './subscriptions.css!'
import template from './subscriptions.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import _ from 'lodash'
import moment from 'moment'

import { filter_groups,
         filter_subscriptions,
         focus_subscription } from 'app/vuex/actions'

import infinite_table from 'app/components/infinite-table/infinite_table'


export default Vue.extend({
    template,
    route: {
        data() {
            const all_users  = (this.current_user.type === 'admin')
            const all_groups = (this.current_user.type === 'admin')
            return Promise.all([
                this.filter_subscriptions({all_users}),
                this.filter_groups({all_groups}),
            ]).catch(() => false)
        },
    },
    components: {
        'infinite-table': infinite_table,
    },
    data: () => ({

    }),
    computed: {
        display_subs() {
            if(this.$loadingRouteData) return []

            this.subscriptions.map(item => {
                // Set Balance
                let balance = Math.round( Math.random()*1000 )
                    balance = balance > 500 ? balance*-1 : balance
                item['balance'] = balance

                // Set Status
                let status  = balance < 0 ? 'Suspended' : 'Active'
                item['status'] = item['from_date'] > moment() ? 'Pending' : status

                // zero pending subscriptions
                if(item['status'] == 'Pending') item['balance'] = 0

                return item
            })

            return this.subscriptions
        },
    },
    ready() {
    },
    methods: {
        fetch_next(offset=0) {
            return Promise.all([
                this.filter_subscriptions({'all_users':this.is_admin, offset}),
                this.filter_groups({'all_groups':this.is_admin})
            ])
        },
        fetch_next_search(term, offset=0) {
            return Promise.all([
                this.filter_subscriptions({'all_users':this.all_users, term, offset}),
                this.filter_groups({'all_groups':this.is_admin})
            ])
        },
        display_table_cell(subscription, {column}) {
            let value = subscription[column]

            // get name and format dates into term
            if (column === 'name')
                return this.groups.filter(g => g.id === subscription['group_id'] )[0].name
            if (column === 'term')
                return subscription['from_date'].format('MMMM YYYY') + ' - ' + subscription['to_date'].format('MMMM YYYY')

            // create container for balance and status
            if (column === 'balance') {
                let balance_class = value >= 0 ? 'positive' : 'negative'
                return "<span class='balance "+balance_class+"'>£"+value+"</span>"}
            if (column === 'status') {
                let status_class = value.toLowerCase()
                return "<span class='status "+status_class+"'>"+value+"</span>"}

            return value
        },
        display_table_cell_type(subscription, {column}) {
            if (column === 'balance' || column === 'status') return 'html'
            return 'raw'
        },
        item_clicked(subscription) {
            this.focus_subscription(subscription.id)
            this.$router.go({name: 'dashboard'})
        },
        close_create_component() {
            this.show_create_component = false
        },
    },
    vuex: {
        getters: {
            current_user: state => state.user,
            groups: state => state.groups,
            subscriptions: state => state.subscriptions,
            focused_subscription_id: state => state.focused_subscription_id,
        },
        actions: {
            filter_groups,
            filter_subscriptions,
            focus_subscription,
        },
    },
})
