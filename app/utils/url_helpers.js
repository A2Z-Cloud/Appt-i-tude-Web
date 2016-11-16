export const create_sign_out_url = function({auth_client_url, router_mode, redirect_path}) {
    // Take the user to the A2Z Auth with a redirect to the
    // auth sign in page after they sign out.
    // Additionally after they sign in again have the next
    // parameter be set back to this url
    const delimiter   = router_mode === 'hash' ? '/#!' : ''
    const current_url = window.location.protocol + '//' + window.location.host + delimiter + redirect_path
    const sign_in_url_return = auth_client_url + '?next=' + encodeURIComponent(current_url)

    return auth_client_url + '/sign-out?next=' + encodeURIComponent(sign_in_url_return)
}
