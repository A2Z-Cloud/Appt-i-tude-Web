import Vue from 'vue'


Vue.filter('date-unix', {
    read(value) {
        const date = new Date(value)
        let year   = '0000' + date.getFullYear()
        year       = year.substring(year.length - 4)
        let month  = '00' + (date.getMonth() + 1)
        month      = month.substring(month.length - 2)
        let day    = '00' + date.getDate()
        day        = day.substring(day.length - 2)
        return year + '-' + month + '-' + day
    },
    write(value) {
        return Date.parse(value)
    },
})
