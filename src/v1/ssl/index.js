const fs = require('fs')
const path = require('path')

try {
    const key = fs.readFileSync(`${path.resolve(__dirname, 'key.pem')}`)
    const cert = fs.readFileSync(`${path.resolve(__dirname, 'crt.pem')}`)

    module.exports = { key, cert };
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(`\x1b[31m[ERROR] NODE_ENV is set to production but PEM files not found.
        Cannot start HTTPS server\x1b[0m`
        )
    }
}
