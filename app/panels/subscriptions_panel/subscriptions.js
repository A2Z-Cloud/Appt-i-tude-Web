// Panel Imports
import './subscriptions.css!'
import template from './subscriptions.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'

import _ from 'lodash'
import moment from 'moment'

import { filter_groups,
         filter_subscriptions,
         focus_subscription } from 'app/vuex/actions'

import infinite_table from 'app/components/infinite-table/infinite_table'


export default Vue.extend({
    template,
    route: {
        data() {
            // fetch groups for subscription names
            return this.filter_groups({all_groups:this.is_admin})
        },
    },
    components: {
        'infinite-table': infinite_table,
    },
    data: () => ({}),
    computed: {
        is_admin() {
            return this.current_user.type === 'admin'
        },
    },
    ready() {
    },
    methods: {
        fetch(term=null, offset=0) {
            // fetch action will return ids for the subscriptions
            // this means they need to be pulled from store and resorted for the table to display them
            return this.filter_subscriptions({'all_users':this.is_admin, term, offset})
                       .then(items => items.map(sub_id => {
                           return this.subscriptions.filter(s => s.id == sub_id)[0]
                       }))
        },
        display_table_cell(subscription, {column}) {
            // default
            let value = subscription[column]

            // get name of group for subscription
            if (column === 'name')
                return this.groups.filter(g => g.id === subscription['group_id'] )[0].name

            // format dates into term
            if (column === 'term')
                return subscription['from_date'].format('MMMM YYYY') + ' - ' + subscription['to_date'].format('MMMM YYYY')

            // fetch balance from server
            if (column === 'balance') {
                value = value == null || value == undefined ? 0 : value
                let balance_class = value > 0 ? 'positive' : 'negative'
                return "<span class='balance "+balance_class+"'>&#163;"+value+"</span>"}

            // appl css to colour status
            if (column === 'status') {
                const ended = subscription['to_date'] < moment()
                value = ended ? 'ended' : subscription.service_data.contract_state
                return "<span class='status "+value+"'>"+value+"</span>"}

            return value
        },
        display_table_cell_type(subscription, {column}) {
            if (column === 'balance' || column === 'status') return 'html'
            return 'raw'
        },
        item_clicked(subscription) {
            this.focus_subscription(subscription.id)
            this.$router.go({name: 'dashboard'})
        },
        close_create_component() {
            this.show_create_component = false
        },
    },
    vuex: {
        getters: {
            current_user: state => state.user,
            groups: state => state.groups,
            subscriptions: state => state.subscriptions,
            focused_subscription_id: state => state.focused_subscription_id,
        },
        actions: {
            filter_groups,
            filter_subscriptions,
            focus_subscription,
        },
    },
})
