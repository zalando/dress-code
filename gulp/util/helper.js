var _ = require('lodash');
var sass = require('gulp-sass');

module.exports = {
    sass: function (options) {
        var opt = _.extend({
            outputStyle: 'expanded'
        }, options);
        return sass(opt).on('error', sass.logError);
    }
};
