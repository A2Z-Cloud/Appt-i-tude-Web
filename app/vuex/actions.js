

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
