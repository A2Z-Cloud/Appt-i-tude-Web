// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'

// –– Constants
import {control_url} from './consts'

// -- Panels
import NavPanel from 'app/components/nav_panel/nav'

// Vue global settings
Vue.config.debug = true


// Init App
System.import(control_url).then(({Control}) => {  // eslint-disable-line no-undef
    router.start({
        components: {
            'nav-panel': NavPanel,
        },
        data: () => ({
            status: null,
            error: null,
        }),
        ready() {
            
        },
    }, '#App')
})
