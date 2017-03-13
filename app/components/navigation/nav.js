// Panel Imports
import './nav.css!'
import template from './nav.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import { create_sign_out_url } from 'app/utils/url_helpers'


export default Vue.extend({
    template,
    data: () => ({}),
    computed: {
        sign_out_url() {
            const router_mode = this.$router.mode
            const auth_client_url = this.auth_client_url
            const redirect_path = this.$route.path
            return create_sign_out_url({router_mode, auth_client_url, redirect_path})
        },
        users_url() {
            const index = this.services.findIndex(s => s.name === "A2Z Users")
            return index !== -1 ? this.services[index].client_url : null
        },
        is_admin() {
            return this.current_user.type === 'admin'
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
        subscription_state() {
            if(!this.selected_subscription) return null
            // check if sub ended
            const ended = this.selected_subscription.to_date < moment()
            return ended ? 'ended' : this.selected_subscription.service_data.contract_state
        },
    },
    vuex: {
        getters:  {
            auth_client_url: state => state.auth_client_url,
            current_user: state => state.user,
            focused_subscription_id: state => state.focused_subscription_id,
            subscriptions: state => state.subscriptions,
            groups: state => state.groups,
            user: state => state.user,
            services: state => state.services,
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
