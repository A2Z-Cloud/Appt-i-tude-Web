// Panel Imports
import './subscription_creator.css!'
import template from './subscription_creator.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import {
    get_group,
    filter_ratecards,
    filter_groups,
    insert_subscription } from 'app/vuex/actions'


export default Vue.extend({
    template,
    data: () => ({
        group_warning: '',
        subscription: {
            group_id: null,
            from_date: null,
            to_date: null,
            a2z_signee_email: null,
            group_signee_name: null,
            group_signee_email: null,
            monthly_cost: 99,
            discount_id: null,
        },
    }),
    route: {
        waitForData: true,
        data() {
            const promises = [
                this.filter_groups(),
                this.get_group({zcrm_id: this.$route.query['group-zcrm-id']}).catch(this.no_group),
                this.filter_ratecards(),
            ]
            return Promise.all(promises)
                          .then(([groups, query_group]) => {
                              const id = (query_group) ? query_group.id : groups[0].id
                              this.subscription.group_id = id})
        },
    },
    vuex: {
        getters: {
            groups: state => state.groups,
            ratecards: state => state.ratecards,
            user: state => state.user,
        },
        actions: {
            get_group,
            filter_ratecards,
            filter_groups,
            insert_subscription,
        },
    },
    computed: {
        selected_group() {
            const group_id = this.subscription.group_id
            const index    = this.groups.findIndex(g => g.id === group_id)
            return (index !== -1) ? this.groups[index] : null
        },
        selected_dicount() {
            const discount_id = this.subscription.discount_id
            const index    = this.ratecards.findIndex(r => r.id === discount_id)
            return (index !== -1) ? this.ratecards[index] : null
        },
        monthly_discount_cost() {
            const current = this.subscription.monthly_cost
            const factor  = (this.selected_dicount) ? this.selected_dicount.percentage / 100 : 1
            const delta   = current * factor
            return (this.selected_dicount.is_increase) ? current + delta : current - delta
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
        const today     = new Date()
        const next_year = new Date().setYear(today.getFullYear() + 1)
        this.subscription.from_date = today / 1000
        this.subscription.to_date   = next_year / 1000
    },
    methods: {
        no_group() {
            this.group_warning = (this.$route.query['group-zcrm-id']) ?
                "Couldn't find group. Make sure they are a group in " +
                "A2Z Users and have their CRM id set." : ''
        },
        send() {
            this.insert_subscription(this.payload)
                .then(console.log)
                .catch(console.log)
        },
    },
})
