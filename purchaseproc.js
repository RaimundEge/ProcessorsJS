var mongo = require('./mongo');

module.exports = {

    checkRequired: function (poData) {
        errors = [];
        if (!('custid' in poData))
            errors.push("customer id missing");
        if (!('order' in poData))
            errors.push("order number missing");
        if (!('associate' in poData))
            errors.push("associate id missing");
        if (!('amount' in poData))
            errors.push("purchase amount missing");
        return errors;
    },

    process: function (poData) {
        // console.log("processing po");
        // processDay is some random days from now
        oldDate = new Date();
        wait = Math.floor(25 + Math.random()*40);
        newDate = new Date(oldDate.getFullYear(),oldDate.getMonth(),oldDate.getDate()+wait);
        poData.processDay = newDate.getFullYear() + '/' + (newDate.getMonth()+1) + '/' + newDate.getDate() ;
        // compute commission
        poData.commission = Math.floor(Math.random() * 24.0 + 3) + "%";
        var pro = mongo.insertMaybe('order', {custid: poData.custid, order: poData.order}, poData);
        // console.log(pro);
        return pro;
    },
    
    getAll: function() {
        return mongo.getAll('order');
    }    
};