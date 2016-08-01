var gulp = require('gulp');
var path = require('path');
var querystring = require('querystring');
var rimraf = require('rimraf');
var iconfont = require('gulp-iconfont');
var _ = require('lodash');
var consolidate = require('gulp-consolidate');
var pkg = require('../package.json');

// Generate the font by using what is found in the src/icons folder
// Generate the scss _generated/icons.scss to use icons as classes
gulp.task('icons', ['icons:clean'], function () {
    var fontName = 'DressCodeIcons';
    var fontPath = '../fonts/';
    var fontCssClass = 'dc-icon';
    var cacheBustingString = '?' + querystring.stringify({ v:pkg.version });

    var onGlyphsGenerateScss = function (glyphs) {
        var glyphsMap = _.map(glyphs, function(glyph) {
            return {
                name: glyph.name,
                codepoint: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
            };
        }).sort(function(a, b) {
            // Sort alphabetically by name
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            if (nameA < nameB) { return -1; }
            if (nameA > nameB) { return 1; }
            return 0;
        });

        gulp.src('src/templates/_icon.scss')
            .pipe(consolidate('lodash', {
                glyphs: glyphsMap,
                fontName: fontName,
                fontPath: fontPath,
                cssClass: fontCssClass,
                cacheBustingString: cacheBustingString
            }))
            .pipe(gulp.dest('./src/styles/_generated'));
    };

    return gulp.src('src/icons/**/*.svg')
        .pipe(gulp.dest(path.join('.tmp/iconfont/', '/svg-icons')))
        .pipe(iconfont({
            fontName: fontName, // required
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff', 'svg'],
            normalize: true,
            centerHorizontally: true
        }).on('glyphs', onGlyphsGenerateScss))
        .pipe(gulp.dest(path.join('.tmp/iconfont/', '/fonts')))
});

gulp.task('icons:clean', function (done) {
    rimraf('.tmp/iconfont/', done);
});
