// Panel Imports
import './nav.css!'
import template from './nav.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import { create_sign_out_url } from 'app/utils/url_helpers'


export default Vue.extend({
    template,
    data: () => ({
    }),
    computed: {
        sign_out_url() {
            const router_mode = this.$router.mode
            const auth_client_url = this.auth_client_url
            const redirect_path = this.$route.path
            return create_sign_out_url({router_mode, auth_client_url, redirect_path})
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
        dropped_down() {
            return this.$route.name === 'subscriptions'
        },
    },
    vuex: {
        getters:  {
            auth_client_url: state => state.auth_client_url,
            focused_subscription_id: state => state.focused_subscription_id,
            subscriptions: state => state.subscriptions,
            groups: state => state.groups,
            user: state => state.user,
        },
    },
    ready() {
    },
    methods: {
        toggle_dropdown() {
            if (this.dropped_down) {
                this.$router.go({name: 'dashboard'})
            } else {
                this.$router.go({name: 'subscriptions'})
            }
        },
    },
})
