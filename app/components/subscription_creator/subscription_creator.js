// Panel Imports
import './subscription_creator.css!'
import template from './subscription_creator.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import {
    filter_ratecards,
    filter_groups,
    insert_subscription } from 'app/vuex/actions'


export default Vue.extend({
    template,
    data: () => ({
        selected_dicount: null,
        cost: 0,
        subscription: {
            group_id: null,
            from_date: null,
            to_date: null,
            a2z_signee_email: null,
            group_signee_name: null,
            group_signee_email: null,
            monthly_cost: 0,
            discount_id: null,
        },
    }),
    route: {
        data() {
            const promises = [
                this.filter_groups(),
                this.filter_ratecards(),
            ]
            return Promise.all(promises)
                          .then(([groups]) => {
                              this.subscription.group_id = groups[0].id})
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
            insert_subscription,
        },
    },
    computed: {
        selected_group() {
            const index = this.groups.findIndex(g => g.id === this.subscription.group_id)
            return (index !== -1) ? this.groups[index] : null
        },
        payload() {
            // Append on the selected groups name to the subscription detail
            return Object.assign(this.subscription, {
                group_name: this.selected_group.name,
                opportunity_id: this.$route.query['oppertunity-zcrm-id'],
            })
        },
    },
    ready() {

    },
    methods: {
        send() {
            this.insert_subscription(this.payload)
                .then(console.log)
                .catch(console.log)
        },
    },
})
