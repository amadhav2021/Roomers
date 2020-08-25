const moment = require('moment')

function formatMessage(name, text){
    return {
        name,
        text,
        time: moment().tz('America/New_York').format('h:mm a')
    }
}

module.exports = formatMessage