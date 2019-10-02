var express = require('express');
var router = express.Router();
var credit = require('../creditproc');

/* handle http requests */
router.get('/', function (req, res, next) {
    // read all transactions
    credit.getAll().then(docs => {
        if (req.accepts('text/html'))
            res.render('showAllCredit', {data: docs});
        if (req.accepts('application/json'))
            res.send(docs);
    }).catch((err) => console.log(err));
});

router.post('/', function (req, res, next) {
    // extract json request
    // console.log(req.headers);
    if (req.is('json')) {
        // console.log(req.body);
        ccData = req.body;
        ccData.requestIP = req.headers['x-forwarded-for'];
        errors = credit.checkRequired(ccData);
        if (errors.length === 0) {         
            errors.push(...credit.checkNumber(ccData.cc));
            if (errors.length === 0)
                ccData.brand = credit.ccBrand(ccData.cc);
            errors.push(...credit.checkExp(ccData.exp));
        }
        if (errors.length > 0) {
            ccData.errors = errors;
            respond(req, res, ccData);
        } else {
            credit.process(ccData).then(obj => {
                console.log("done with DB stuff");
                respond(req, res, ccData);
            });
        }
    } else {
        res.send('Credit Card web service requires content-type JSON');
    }
});

function respond(req, res, ccData) {
    delete ccData._id;
    delete ccData.timeStamp;
    if (req.accepts('json'))
        res.send(ccData);
    else
        res.render('creditcard', {response: ccData});
}
module.exports = router;
