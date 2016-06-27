

export const authenticate = function(store) {
    return new Promise((resolve, reject) => {
        const handle_error = error => (store.dispatch('ERROR_SET', error))
        store.control
             .get_current_user()
             .then(({user, auth_client_url}) => {
                 store.dispatch('CURRENT_USER_SET', user)
                 store.dispatch('AUTH_CLIENT_URL_SET', auth_client_url)
                 if (user) resolve(user)
                 else reject(auth_client_url)
             })
             .catch(handle_error)
    })
}

export const filter_ratecards = function(store) {
    return new Promise((resolve, reject) => {
        const handle_success = ratecards => {
            ratecards.forEach(u => store.dispatch('RATECARD_UPDATE', u))
            resolve(ratecards)
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

export const filter_groups = function(store) {
    return new Promise((resolve, reject) => {
        const handle_success = groups => {
            groups.forEach(u => store.dispatch('GROUP_UPDATE', u))
            resolve(groups)
        }
        const handle_error = error => {
            store.dispatch('ERROR_SET', error)
            reject(error)
        }
        store.control
             .filter_groups()
             .then(handle_success)
             .catch(handle_error)
    })
}
