var mongo = require('./mongo');

module.exports = {

    checkRequired: function (ccData) {
        errors = [];
        if (!('name' in ccData))
            errors.push("card holder name missing");
        if (!('vendor' in ccData))
            errors.push("vendor id missing");
        if (!('trans' in ccData))
            errors.push("transaction number missing");
        if (!('cc' in ccData))
            errors.push(" card number missing");
        if (!('exp' in ccData))
            errors.push("card expiration missing");
        if (!('amount' in ccData))
            errors.push("transaction amount missing");
        return errors;
    },

    checkNumber: function (value) {
        // returns true on valid number 
        // convert value into string
        if (!isNaN(value))
            value = value.toString();
        // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value))
            return false;
        // The Luhn Algorithm. It's so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");
        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                    nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9)
                    nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }
        return ((nCheck % 10) === 0) ? [] : ['credit card number is invalid'];
    },

    checkExp: function (value) {
        d = new Date();
        year = d.getFullYear();
        month = d.getMonth() + 1;
        fields = value.split('/');
        if (fields.length !== 2 || isNaN(fields[0]) || isNaN(fields[1]))
            return(["expiration date invalid"]);
        if (fields[1] < year || fields[1] === year && fields[0] < month) {
            return(["card expired"]);
        }
        return [];
    },

    ccBrand: function (cur_val) {
        var sel_brand;

        // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
        // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also

        //JCB
        jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)
        // American Express
        amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
        // Diners Club
        diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39
        // Visa
        visa_regex = new RegExp('^4[0-9]{0,}$'); //4
        // MasterCard
        mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
        maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
        //Discover
        discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
        ////6011, 622126-622925, 644-649, 65


        // get rid of anything but numbers
        cur_val = cur_val.replace(/\D/g, '');

        // checks per each, as their could be multiple hits
        //fix: ordering matter in detection, otherwise can give false results in rare cases
        if (cur_val.match(jcb_regex)) {
            sel_brand = "jcb";
        } else if (cur_val.match(amex_regex)) {
            sel_brand = "amex";
        } else if (cur_val.match(diners_regex)) {
            sel_brand = "diners_club";
        } else if (cur_val.match(visa_regex)) {
            sel_brand = "visa";
        } else if (cur_val.match(mastercard_regex)) {
            sel_brand = "mastercard";
        } else if (cur_val.match(discover_regex)) {
            sel_brand = "discover";
        } else if (cur_val.match(maestro_regex)) {
            if (cur_val[0] === '5') { //started 5 must be mastercard
                sel_brand = "mastercard";
            } else {
                sel_brand = "maestro"; //maestro is all 60-69 which is not something else, thats why this condition in the end
            }
        } else {
            sel_brand = "unknown";
        }

        return sel_brand;
    },
    
    process: function (ccData) {
        // console.log("processing cc");
        ccData.authorization = Math.floor((Math.random() * 10000) + 10000);

        var pro = mongo.insertMaybe('credit', {vendor: ccData.vendor, trans: ccData.trans}, ccData);
        // console.log(pro);
        return pro;
    },
    
    getAll: function() {
        return mongo.getAll('credit');
    }
};