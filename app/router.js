// JS Imports
// –– Vue
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'app/vuex/store'

// –– Constants
import {debug} from './consts'

// -- Route Panels
import DashboardPanel from "./components/dashboard_panel/dashboard"
import CalculatorPanel from "./components/calculator_panel/calculator"
import PaymentsPanel from "./components/payments_panel/payments"

import { authenticate } from 'app/vuex/actions'


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: !debug,
    hashbang: debug,
})

router.map({
    '/': {
        name: 'DashboardPanel',
        component: DashboardPanel,
        authenticated: true,
    },
    '/calculator': {
        name: 'CalculatorPanel',
        component: CalculatorPanel,
        authenticated: true,
    },
    '/payments': {
        name: 'PaymentsPanel',
        component: PaymentsPanel,
        authenticated: true,
    },
})

router.beforeEach(function({to, next}) {
    if (to.authenticated && store.state.user === null) {
        const go_auth = auth_url => (window.location = auth_url)
        authenticate(store).then(next).catch(go_auth)
    } else {
        next()
    }
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
