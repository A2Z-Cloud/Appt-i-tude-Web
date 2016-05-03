// CSS Imports
// –– Root Styles
import './main.css!'

// JS Imports
// –– Vue
import Vue from 'vue'
import router from './router'

import {control_url} from './consts'

// Vue global settings
Vue.config.debug = true


// Init App
router.start({
    data: () => ({
        status: null,
        error: null,
    }),
    ready() {

    },
}, '#App')
