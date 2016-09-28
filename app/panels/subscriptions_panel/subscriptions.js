// Panel Imports
import './subscriptions.css!'
import template from './subscriptions.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import _ from 'lodash'

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
    data: () => ({}),
    computed: {
        display_subs() {
            return this.$loadingRouteData ? [] : this.subscriptions
        },
    },
    ready() {
    },
    methods: {
        fetch_next(offset=0) {
            return new Promise((resolve, reject) => {reject('all present')})
        },
        fetch_next_search(term, offset=0) {
            return new Promise((resolve, reject) => {reject('all present')})
        },
        display_table_cell(subscription, {column}) {
            if (column === 'group_id')
                return this.groups.filter(g => g.id === subscription[column] )[0].name
            if (column === 'from_date')
                return subscription['from_date'].format('MMMM YYYY') + ' - ' + subscription['to_date'].format('MMMM YYYY')

            return subscription[column]
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
