

export const authenticate = function(store) {
    return new Promise((resolve, reject) => {
        const handle_error = error => (store.dispatch('ERROR_SET', error))
        store.control
             .get_current_user()
             .then(({user, auth_client_url}) => {
                 store.dispatch('CURRENT_USER_SET', user)
                 store.dispatch('AUTH_CLIENT_URL_SET', auth_client_url)
                 if (user) resolve(user.id)
                 else reject(auth_client_url)
             })
             .catch(handle_error)
    })
}

export const focus_subscription = function(store, id) {
    store.dispatch('SUBSCRIPTION_FOCUS', id)
}

export const filter_ratecards = function(store) {
    return new Promise((resolve, reject) => {
        const handle_success = ratecards => {
            ratecards.forEach(r => store.dispatch('RATECARD_UPDATE', r))
            resolve(ratecards.map(r => r.id))
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .filter_ratecards()
             .then(handle_success)
             .catch(handle_error)
    })
}

export const get_group = function(store, {id, name, zcrm_id}) {
    return new Promise((resolve, reject) => {
        const handle_success = group => {
            store.dispatch('GROUP_UPDATE', group)
            resolve(group.id)
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .get_group(id, name, zcrm_id)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const filter_groups = function(store, {all_groups=false}={}) {
    return new Promise((resolve, reject) => {
        const handle_success = groups => {
            groups.forEach(u => store.dispatch('GROUP_UPDATE', u))
            resolve(groups.map(g => g.id))
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .filter_groups(all_groups)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const get_opportunity = function(store, {zcrm_id}) {
    return new Promise((resolve, reject) => {
        const handle_success = opportunity => {
            store.dispatch('OPPORTUNITY_UPDATE', opportunity)
            resolve(opportunity.zcrm_id)
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .get_opportunity(zcrm_id)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const insert_subscription = function(store, {group_id, opportunity_zcrm_id, from_date, to_date, a2z_signee_email, group_signee_name, group_signee_email, monthly_cost, bonus_annual_months, discount_id=null}) {
    return new Promise((resolve, reject) => {
        const handle_success = subscription_id => {
            resolve(subscription_id)
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .insert_subscription(
                 group_id,
                 opportunity_zcrm_id,
                 from_date.unix(),
                 to_date.unix(),
                 a2z_signee_email,
                 group_signee_name,
                 group_signee_email,
                 monthly_cost,
                 bonus_annual_months,
                 discount_id)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const filter_subscriptions = function(store, {all_users=false, term=null, offset=0, limit=20}={}) {
    return new Promise((resolve, reject) => {
        const handle_success = subscriptions => {
            subscriptions.forEach(s => store.dispatch('SUBSCRIPTION_UPDATE', s))
            resolve(subscriptions.map(t => t.id))
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .filter_subscriptions(all_users, term, offset, limit)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const update_subscription = function(store, subscription_id, state) {
    return new Promise((resolve, reject) => {
        const handle_success = subscription => {
            store.dispatch('SUBSCRIPTION_UPDATE', subscription)
            resolve(subscription.id)
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .update_subscription(subscription_id, state)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const filter_transactions = function(store, subscription_id=null) {
    return new Promise((resolve, reject) => {
        const handle_success = transactions => {
            transactions.forEach(t => store.dispatch('TRANSACTION_UPDATE', t))
            resolve(transactions.map(t => t.id))
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .filter_transactions(subscription_id)
             .then(handle_success)
             .catch(handle_error)
    })
}

export const insert_transaction = function(store, {subscription_id, amount, executed}) {
    return new Promise((resolve, reject) => {
        const handle_success = transaction_id => {
            resolve(transaction_id)}

        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)}

        store.control
             .insert_transaction(
                 subscription_id,
                 amount,
                 executed.unix())
             .then(handle_success)
             .catch(handle_error)
    })
}

export const get_service = function(store, {id=null, name=null}) {
    return new Promise((resolve, reject) => {
        const handle_success = service => {
            store.dispatch('SERVICE_UPDATE', service)
            resolve(service.id)
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .get_service(id, name)
             .then(handle_success)
             .catch(handle_error)
    })
}
