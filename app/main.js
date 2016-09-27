// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'
import store from 'app/vuex/store'

import 'app/filters/multiply'
import 'app/filters/currency'
import 'app/filters/date_unix'
import 'app/filters/nullify'
import 'app/filters/strip_underscores'

// –– Constants
import {control_url} from './consts'

// -- Panels
import NavPanel from 'app/components/navigation/nav'

// -- Add-ons
import infinateScroll from 'vue-infinite-scroll'


// Init App
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    Vue.use(infinateScroll)

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
        vuex: {
            getters:  {
                user: state => state.user,
                ws_ready: state => state.auth_client_url && state.ws_status === 'open',
                auth_client_url: state => state.auth_client_url,
            },
        },
    }, '#App')
})
