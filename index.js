if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/dative.cjs.min.js')
} else {
    module.exports = require('./dist/dative.cjs.js')   
}