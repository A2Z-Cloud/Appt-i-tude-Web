// JS Imports
// –– Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// –– Constants
import {debug} from './consts'

// -- Route Panels
import DashboardPanel from "./components/dashboard_panel/dashboard"
import CalculatorPanel from "./components/calculator_panel/calculator"
import PaymentsPanel from "./components/payments_panel/payments"


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: false,
})

router.map({
    '/': {
        name: 'DashboardPanel',
        component: DashboardPanel,
    },
    '/calculator': {
        name: 'CalculatorPanel',
        component: CalculatorPanel,
    },
    '/payments': {
        name: 'PaymentsPanel',
        component: PaymentsPanel,
    },
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
