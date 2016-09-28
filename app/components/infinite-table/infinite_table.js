import './infinite_table.css!'
import tmpl from './infinite_table.html!text'
import Vue from 'vue'


export default Vue.extend({
    template: tmpl,
    props: [
        'title',
        'columns',
        'items',
        'fetch_next',
        'fetch_next_search',
        'display_table_cell_type',
        'display_table_cell',
        'item_clicked',
    ],
    data: () => ({
        busy: false,
        busy_searching: false,
        search_term: '',
        search_items: [],
        items_exhausted: false,
        search_exhausted: false,
    }),
    computed: {
        searching() {
            return (this.search_term.length > 0)
        },
        display_items() {
            if (this.searching) return this.search_items
            return this.items
        },
        table_height() {
            var window_height = this.window_height,
                client_height = document.getElementById('Content').clientHeight,
                header_height = 75,
                padding_diff  = 64,
                tables_height = client_height - header_height - padding_diff

            return (tables_height < window_height ? tables_height : window_height) + 'px'
        },
        disabled() {
            return (!this.searching && this.items_exhausted)
                || (this.searching && this.search_exhausted)
        },
        row_style() {
            return {
                'cursor': (this.item_clicked) ? 'pointer' : 'auto',
            }
        },
    },
    ready() {
    },
    vuex: {
        getters: {
            window_height: state => state.window_size.height,
        },
    },
    methods: {
        display_item_is_template(item, {column}) {
            if (this.display_table_cell_is_template) return this.display_table_cell_is_template(item, {column})
            return false
        },
        display_item(item, {column}) {
            if (this.display_table_cell) return this.display_table_cell(item, {column})
            return item[column]
        },
        search() {
            this.busy_searching = true
            this.search_items   = []
            this.fetch_next_search(this.search_term, 0)
                .then(items => {
                    this.search_items     = items
                    this.search_exhausted = false
                    this.busy_searching   = false
                })
                .catch(() => {
                    this.search_exhausted = true
                    this.busy_searching   = false
                })
        },
        nearing_bottom() {
            this.searching ? this.fetch_next_search_items() : this.fetch_next_items()
        },
        fetch_next_items() {
            this.busy = true
            this.fetch_next(this.items.length)
                .then(() => (this.busy = false))
                .catch(() => {
                    this.items_exhausted = true
                    this.busy = false
                })
        },
        fetch_next_search_items() {
            this.busy_searching = true
            this.fetch_next_search(this.search_term, this.search_items.length)
                .then(items => {
                    this.search_items.push(...items)
                    this.busy_searching = false
                })
                .catch(() => {
                    this.search_exhausted = true
                    this.busy_searching   = false
                })
        },
        _item_clicked(item) {
            if (this.item_clicked) this.item_clicked(item)
        },
    },
})
