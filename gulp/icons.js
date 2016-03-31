var gulp = require('gulp');
var path = require('path');
var del = require('del');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');

// Generate the font by using what is found in the src/icons folder
// Generate the scss _generated/icons.scss to use icons as classes
gulp.task('icons', ['icons:clean'], function () {
    var runTimestamp = Math.round(Date.now()/1000);
    var fontName = 'DressCodeIcons';

    return gulp.src('src/icons/**/*.svg')
        .pipe(gulp.dest(path.join('.tmp/iconfont/', '/svg-icons')))
        .pipe(iconfontCss({
            fontName: fontName,
            path: './src/templates/_icon.scss',
            // this path is relative to .tmp/.iconfont/fonts  ... weird
            targetPath: '../../../src/styles/_generated/_icon.scss',
            fontPath: '../fonts/',
            cssClass: 'dc-icon'
        }))
        .pipe(iconfont({
            fontName: fontName, // required
            formats: ['ttf', 'eot', 'woff','svg','woof2'],
            timestamp: runTimestamp, // recommended to get consistent builds when watching files,
            normalize: true,
            centerHorizontally: true
        }))
        .pipe(gulp.dest(path.join('.tmp/iconfont/', '/fonts')))
});

gulp.task('icons:clean', function (done) {
    del(['.tmp/iconfont/'], done);
});
