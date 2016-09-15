import Vue from 'vue'


Vue.filter('multiply', {
    read(value, factor) {
        return value * factor
    },
    write(value, _, factor) {
        return value / factor
    },
})
