// JS Imports
import Vue from 'vue'
import VueRouter from 'vue-router'

import {debug} from './consts'

// -- Route Panels
import HomePanel from "./components/home_panel/home"


Vue.use(VueRouter)
Vue.config.debug = debug

const router = new VueRouter({
    history: false,
})

router.map({
    '/': {
        name: 'HomePanel',
        component: HomePanel,
    },
})

// For debugging against the web console
if (debug) {
    window.app = router
}

export default router
