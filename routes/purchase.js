var express = require('express');
var router = express.Router();
var purchase = require('../purchaseproc');
var maria = require('../maria');

/* handle http requests */
router.get('/', function (req, res, next) {
    // read all transactions
    purchase.getAll().then(docs => {
        if (req.accepts('text/html'))
            res.render('showAllOrder', {data: docs});
        if (req.accepts('application/json'))
            res.send(docs);
    }).catch((err) => console.log(err));
});

router.post('/', function (req, res, next) {
    // extract json request
    // console.log(req.headers);
    if (req.is('json')) {
        // console.log(req.body);
        poData = req.body;
        poData.requestIP = req.headers['x-forwarded-for'];
        errors = purchase.checkRequired(poData);
        if (errors.length > 0) {
            poData.errors = errors;
            respond(req, res, poData);
        } else {
            var c = maria.find(poData);
            c.on('end', () => {
                // console.log('done: ' + poData.name);
                if (poData.hasOwnProperty('errors')) {
                    respond(req, res, poData);
                } else {
                    purchase.process(poData).then(() => {
                        // console.log("done with DB stuff");
                        respond(req, res, poData);
                    });
                }
            });
        }
    } else {
        res.send('Purchase Order web service requires content-type JSON');
    }
});

function respond(req, res, poData) {
    delete poData._id;
    delete poData.timeStamp;
    if (req.accepts('json'))
        res.send(poData);
    else
        res.render('purchaseorder', {response: poData});
}

module.exports = router;