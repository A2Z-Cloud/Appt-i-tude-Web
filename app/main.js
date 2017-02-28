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
import 'app/filters/date_moment'
import 'app/filters/nullify'
import 'app/filters/strip_underscores'

// –– Constants
import {control_url} from './consts/local'

// –– Panels
import NavPanel from 'app/components/navigation/nav'

// –– Add-ons
import ResizeMixin from 'vue-resize-mixin'
import infinateScroll from 'vue-infinite-scroll'
import VueDependOn from 'vue-dependon'

// –– Actions
import { get_service } from 'app/vuex/actions'


// Init App
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    Vue.use(infinateScroll)
    Vue.use(VueDependOn)

    router.start({
        store,
        mixins: [ResizeMixin],
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

            // load the user service url for navigation
            // This must be done here as the navigation is not inside the router
            // view meaning the control may not have been loaded when the navigation
            // panel initially renders.
            this.get_service({name:"A2Z Users"})
        },
        vuex: {
            getters:  {
                user: state => state.user,
                ws_ready: state => state.auth_client_url && state.ws_status === 'open',
                auth_client_url: state => state.auth_client_url,
            },
            actions: {
                get_service,
            }
        },
        events: {
            resize: size => store.dispatch({
                type: 'WINDOWS_SIZE_SET',
                silent: false,
                payload: size,
            }),
        },
    }, '#App')
})
