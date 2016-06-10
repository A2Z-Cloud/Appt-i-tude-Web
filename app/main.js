// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'
import store from 'app/vuex/store'

// –– Constants
import {control_url} from './consts'

// -- Panels
import NavPanel from 'app/components/nav_panel/nav'

// Vue global settings
Vue.config.debug = true


// Init App
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    router.start({
        store,
        components: {
            'nav-panel': NavPanel,
        },
        ready() {
            store.control = new Control()
            store.control
                 .init((signal, message) => store.dispatch(signal, message))
                 .then(status => store.dispatch('WS_STATUS_SET', status))
                 .catch(() => store.dispatch('ERROR_SET', {
                     message: "Cannot connect to server.",
                 }))
        },
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
                user: state => state.user,
                ws_ready: state => state.auth_client_url && state.ws_status === 'open',
                auth_client_url: state => state.auth_client_url,
            },
        },
    }, '#App')
})
