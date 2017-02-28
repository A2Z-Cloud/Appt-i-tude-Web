import moment from 'moment'


export const chronological = function(a, b) {
    return moment(a, "YYYY MM", true).unix() - moment(b, "YYYY MM", true).unix()
}

export const reverse_chronological = function(a, b) {
    return chronological(a, b) * -1
}
