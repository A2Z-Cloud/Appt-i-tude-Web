// JS Imports
// –– Vue
import Vue from 'vue'
import VueRouter from 'vue-router'

// –– Constants
import {debug} from './consts'

// -- Route Panels
import DashboardPanel from "./components/dashboard_panel/dashboard"


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
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
