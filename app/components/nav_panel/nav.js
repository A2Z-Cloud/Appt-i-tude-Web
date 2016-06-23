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
    },
    vuex: {
        getters:  {
            auth_client_url: state => state.auth_client_url,
        },
    },
    ready() {

    },
    methods: {

    },
})
