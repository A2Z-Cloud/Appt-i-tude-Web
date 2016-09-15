import Vue from 'vue'


Vue.filter('nullify', {
    read(value, null_out) {
        if (value === null && null_out !== undefined) return null_out
        return value
    },
    write(value) {
        value = (value === '') ? null : value
        return value
    },
})
