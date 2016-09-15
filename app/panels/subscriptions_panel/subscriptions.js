// Panel Imports
import './subscriptions.css!'
import template from './subscriptions.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

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
    },
    ready() {
    },
    methods: {
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
