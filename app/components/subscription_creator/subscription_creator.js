// Panel Imports
import './subscription_creator.css!'
import template from './subscription_creator.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import { filter_ratecards, filter_groups } from 'app/vuex/actions'


export default Vue.extend({
    template,
    data: () => ({
        selected_group_id: null,
        selected_ratecard_id: null,
    }),
    route: {
        data() {
            const promises = [
                this.filter_groups(),
                this.filter_ratecards(),
            ]
            return Promise.all(promises)
                          .then(([groups, ratecards]) => {
                              this.selected_group_id = groups[0].id
                              this.selected_ratecard_id = ratecards[0].id})
        },
    },
    vuex: {
        getters: {
            groups: state => state.groups,
            ratecards: state => state.ratecards,
        },
        actions: {
            filter_ratecards,
            filter_groups,
        },
    },
    computed: {

    },
    ready() {

    },
    methods: {

    },
})
