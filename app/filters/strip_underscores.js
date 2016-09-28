import Vue from 'vue'


Vue.filter('strip_underscores', function(value) {
    return value.replace("_", " ")
})
