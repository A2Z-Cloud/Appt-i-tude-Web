// Panel Imports
import './subscription_creator.css!'
import template from './subscription_creator.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import {
    get_group,
    get_opportunity,
    filter_ratecards,
    filter_groups,
    insert_subscription } from 'app/vuex/actions'


export default Vue.extend({
    template,
    data: () => ({
        group_warning: '',
        opportunity_warning: '',
        creating_sub: false,
        finished: false,
        subscription: {
            group_id: null,
            opportunity_id: null,
            from_date: null,
            to_date: null,
            a2z_signee_email: null,
            group_signee_name: null,
            group_signee_email: null,
            monthly_cost: 99,
            bonus_annual_months: 2,
            discount_id: null,
        },
    }),
    route: {
        waitForData: true,
        data() {
            const promises = [
                this.filter_groups(),
                this.get_group({zcrm_id: this.$route.query['group-zcrm-id']}).catch(() => {
                    this.group_warning = "Couldn't find group. Make sure they are a group in A2Z Users and have their CRM id set."
                    return null}),
                this.get_opportunity({zcrm_id: this.$route.query['opportunity-zcrm-id']}).catch(() => {
                    this.opportunity_warning = "Couldn't find opportunity."
                    return null}),
                this.filter_ratecards()]
            return Promise.all(promises)
                          .then(([groups, query_group, query_opportunity]) => {
                              const group_id = (query_group) ? query_group.id : null
                              this.subscription.group_id = group_id
                              const opportunity_id = (query_opportunity) ? query_opportunity.id : null
                              this.subscription.opportunity_id = opportunity_id})
        },
    },
    vuex: {
        getters: {
            groups: state => state.groups,
            opportunities: state => state.opportunities,
            ratecards: state => state.ratecards,
            user: state => state.user,
        },
        actions: {
            get_group,
            get_opportunity,
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
        selected_opportunity() {
            const opportunity_id = this.subscription.opportunity_id
            const index          = this.opportunities.findIndex(o => o.id === opportunity_id)
            return index !== -1 ? this.opportunities[index] : null
        },
        selected_dicount() {
            const discount_id = this.subscription.discount_id
            const index       = this.ratecards.findIndex(r => r.id === discount_id)
            return (index !== -1) ? this.ratecards[index] : null
        },
        payload() {
            // Append on the selected groups name to the subscription detail
            // Also apply discount rate
            return Object.assign({}, this.subscription, {
                group_name: this.selected_group.name,
                opportunity_id: this.selected_opportunity.id})
        },
        form_filled() {
            return ((this.subscription.group_id != null           && this.subscription.group_id !== "") &&
                    (this.subscription.from_date != null          && this.subscription.from_date !== "") &&
                    (this.subscription.to_date != null            && this.subscription.to_date !== "") &&
                    (this.subscription.a2z_signee_email != null   && this.subscription.a2z_signee_email !== "") &&
                    (this.subscription.group_signee_name != null  && this.subscription.group_signee_name !== "") &&
                    (this.subscription.group_signee_email != null && this.subscription.group_signee_email !== "") &&
                    (this.subscription.monthly_cost != null       && this.subscription.monthly_cost !== ""))
        },
    },
    ready() {
        window.panel = this

        const today     = new Date()
        const next_year = new Date().setYear(today.getFullYear() + 1)
        this.subscription.from_date = this.selected_opportunity.apptitude_from_date ? this.selected_opportunity.apptitude_from_date : today
        this.subscription.to_date   = this.selected_opportunity.apptitude_to_date ? this.selected_opportunity.apptitude_to_date : next_year
        this.subscription.group_signee_name  = this.selected_opportunity.contact_name
        this.subscription.group_signee_email = this.selected_opportunity.contact_email
        this.subscription.monthly_cost       = this.selected_opportunity.apptitude_monthly_cost
    },
    methods: {
        send() {
            this.creating_sub = true
            this.insert_subscription(this.payload)
                .then(() => {
                    this.finished = true
                })
                .catch((error) => {
                    this.creating_sub = false
                    console.log(error)
                })
        },
    },
})
