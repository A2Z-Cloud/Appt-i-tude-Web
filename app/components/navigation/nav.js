// Panel Imports
import './nav.css!'
import template from './nav.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'


export default Vue.extend({
    template,
    data: () => ({

    }),
    computed: {
        sign_out_url() {
            // Take the user to the A2Z Auth with a redirect to the
            // auth sign in page after they sign out.
            // Additionally after they sign in again have the next
            // parameter be set back to this url
            const delimiter   = this.$router.mode === 'hash' ? '/#!' : ''
            const current_url = window.location.protocol + '//' + window.location.host + delimiter + this.$route.path
            const sign_in_url = this.auth_client_url
            const sign_in_url_return = sign_in_url + '?next=' + encodeURIComponent(current_url)

            return this.auth_client_url + '/sign-out?next=' + encodeURIComponent(sign_in_url_return)
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
    },
    vuex: {
        getters:  {
            auth_client_url: state => state.auth_client_url,
            focused_subscription_id: state => state.focused_subscription_id,
            subscriptions: state => state.subscriptions,
            groups: state => state.groups,
        },
    },
    ready() {

    },
    methods: {

    },
})
