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


export default Vue.extend({
    template,
    route: {
        waitForData: true,
        data() {
            const all_users  = (this.current_user.type === 'admin')
            const all_groups = (this.current_user.type === 'admin')
            return Promise.all([
                this.filter_subscriptions({all_users}),
                this.filter_groups({all_groups}),
            ]).catch(() => false)
        },
    },
    data: () => ({}),
    computed: {
        groups_with_subscriptions() {
            // get each uniq group id that shows up in subscriptions
            // then filter groups by those with subs and sort
            const group_ids_with_subs = _(this.subscriptions)
                                         .map('group_id')
                                         .uniq()
                                         .value()
            return _(this.groups)
                    .keyBy('id')
                    .at(group_ids_with_subs)
                    .sortBy(['name'])
                    .value()
        },
    },
    ready() {
    },
    methods: {
        group_subscriptions(group_id) {
            return this.subscriptions.filter(s => s.group_id === group_id)
        },
        select_subscription(subscription) {
            this.focus_subscription(subscription.id)
            this.$router.go({name: 'dashboard'})
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
