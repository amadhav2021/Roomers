const moment = require('moment')

function formatMessage(name, text){
    return {
        name,
        text,
        time: moment('h:mm a')
    }
}

module.exports = formatMessage