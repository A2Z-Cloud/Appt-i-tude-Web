import Vue from 'vue'


Vue.filter('currency', {
    // model -> view
    // formats the value when updating the input element.
    read(val) {
        const prefix = (val >= 0) ? '£' : '-£'
        val = (val >= 0) ? val : -1*val
        return prefix+val.toFixed(2)
    },
    // view -> model
    // formats the value when writing to the data.
    write(val) {
        const number = +(""+val).replace(/[^\d.]/g, '')
        return isNaN(number) ? 0 : parseFloat(number.toFixed(2))
    },
})
