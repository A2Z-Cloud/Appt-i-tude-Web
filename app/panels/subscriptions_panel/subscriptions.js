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
            // get each uniq group id that shows up in subscriptions
            // then filter groups by those with subs and sort
            if (this.groups.length === 0 || this.subscriptions.length === 0) return []
            const sub_group_ids = _(this.subscriptions)
                                   .map('group_id')
                                   .uniq()
                                   .value()

            return _(this.groups)
                    .keyBy('id')
                    .at(sub_group_ids)
                    .sortBy(['name'])
                    .map( group => {
                        const sub = this.subscriptions.filter(s => s.group_id === group.id)
                        sub.date  = sub.from_date + " - " + sub.to_date
                        return sub
                    })
                    .value()
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
