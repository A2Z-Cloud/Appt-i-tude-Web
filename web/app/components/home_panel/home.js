import './home.css!'
import template from './home.html!text'
import Vue from 'vue'


export default Vue.extend({
    template,
    data: () => ({
        
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
