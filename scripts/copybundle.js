module.exports = function (context) {
    var fs = require('fs')
    let copy = ['node_modules/node-gp/browser/nodegp-bundle.debug.js']
    let dest_path = 'www/js/'

    for (let i = 0; i < copy.length; i++) {
        let name = copy[i].split('/').pop()
        fs.createReadStream(copy[i]).pipe(fs.createWriteStream(dest_path + '/' + name))
    }
}