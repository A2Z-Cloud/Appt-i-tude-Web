// Panel Imports
import './notice.css!'
import template from './notice.html!text'

// JS Imports
// –– Vue
import Vue from 'vue'


export default Vue.extend({
    template,
    props: ['title', 'text'],
    data: () => ({}),
    ready() {},
    methods: {},
})
