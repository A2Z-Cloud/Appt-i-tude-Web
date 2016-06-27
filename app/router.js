// JS Imports
// –– Vue
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'app/vuex/store'

// –– Constants
import {debug, hash_routing} from './consts'

// -- Route Panels
import DashboardPanel from "./panels/dashboard_panel/dashboard"
import CalculatorPanel from "./panels/calculator_panel/calculator"
import PaymentsPanel from "./panels/payments_panel/payments"
import AdminPanel from "./panels/admin_panel/admin"
import SubscriptionCreator from "./components/subscription_creator/subscription_creator"

import { authenticate } from 'app/vuex/actions'


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: !hash_routing,
    hashbang: hash_routing,
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
    '/admin': {
        name: 'AdminPanel',
        component: AdminPanel,
        authenticated: true,
    },
    '/test': {
        name: 'Test',
        component: SubscriptionCreator,
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
