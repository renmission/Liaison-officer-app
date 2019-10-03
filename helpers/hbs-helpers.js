const moment = require('moment');

module.exports = {

    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }

        req.flash('error_msg', 'Not Authorized');
        res.redirect('/');
    },

    select: (selected, options) => {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
    },

    generateDate: (date, format) => {
        return moment(date).format(format);
    },

    paginate: (options) => {

        let output = '';

        //to show first page
        if (options.hash.current === 1) {
            output += `<li class="page-item disabled"><a href="#" class="page-link"> <i class="fa fa-angle-left"></i></a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=1" class="page-link"><i class="fa fa-angle-left"></i></a></li>`;
        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        //show dots left 
        if (i !== 1) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }

        //display pages number
        for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++) {

            if (i === options.hash.current) {
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
            } else {
                output += `<li class="page-item"><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }

            //show dots right - there's more 
            if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }

        //to show last page
        if (options.hash.current === options.hash.pages) {
            output += `<li class="page-item disabled"><a class="page-link"> <i class="fa fa-angle-right"></i></a></li>`;
        } else {
            output += `<li class="page-item "><a href="?page=${options.hash.pages}" class="page-link"> <i class="fa fa-angle-right"></i></a></li>`;
        }

        return output;




        console.log(options.hash.current)
    }



}