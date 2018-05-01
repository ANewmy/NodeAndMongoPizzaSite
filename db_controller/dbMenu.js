var server = require('../server.js');

function updateMenu(res, query, update) {
    var db = server.getDb();

    db.collection('menu').update(query, update, function(err, results) {
        if (err) throw err;
        console.log('dbMenu.updateMenu.err', err);
    });
    res.writeHead(200);
    res.end(JSON.stringify('Update is done!'));
}

module.exports.updateMenu = updateMenu;
