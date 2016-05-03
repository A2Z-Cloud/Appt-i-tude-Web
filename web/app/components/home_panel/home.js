import './home.css!'
import template from './home.html!text'
import Vue from 'vue'


export default Vue.extend({
    template,
    data: () => ({
        history: {
            date: "01-01-2016",
            start: 50,
            added: 10,
            used: 55,
        }
    }),
    computed: {

    },
    ready() {

    },
    methods: {
        change() {
            this.temp = "Foo"
        },
    },
})
