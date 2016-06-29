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
        selected_dicount: null,
        cost: 0,
    }),
    route: {
        data() {
            const promises = [
                this.filter_groups(),
                this.filter_ratecards(),
            ]
            return Promise.all(promises)
                          .then(([groups]) => {
                              this.selected_group_id = groups[0].id})
        },
    },
    vuex: {
        getters: {
            groups: state => state.groups,
            ratecards: state => state.ratecards,
            user: state => state.user,
        },
        actions: {
            filter_ratecards,
            filter_groups,
        },
    },
    computed: {
        selected_group() {
            const index = this.groups.findIndex(g => g.id === this.selected_group_id)
            return (index !== -1) ? this.groups[index] : null
        },
    },
    ready() {

    },
    methods: {

    },
})
