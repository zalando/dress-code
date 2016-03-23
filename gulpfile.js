'use strict';

var pkg = require('./package.json');
var path = require('path');
var spawn = require('child_process').spawn;
var _ = require('lodash');
var del = require('del');
var assemble = require('fabricator-assemble');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var webpack = require('webpack');

// gulp & gulp plugins
var gulp = require('gulp');
var runSequence = require('run-sequence');
var csso = require('gulp-csso');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ghPages = require('gulp-gh-pages');
var debug = require('gulp-debug');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var conventionalChangelog = require('gulp-conventional-changelog');

// configuration
var config = {
    pkg: pkg,
    path: {
        styles: {
            toolkit: './src/styles/'
        }
    },
    src: {
        scripts: {
            fabricator: './docs/demo/assets/fabricator/scripts/fabricator.js'
        },
        styles: {
            fabricator: './docs/demo/assets/fabricator/styles/fabricator.scss',
            toolkit: './src/styles/index.scss'
        },
        images: 'src/img/**/*',
        icons: 'src/icons/*.svg'

    },
    dist: 'dist',
    tmp: {
        tmp: '.tmp',
        dist: '.tmp/.dist',
        demo: '.tmp/.demo',
        deployDemo: '.tmp/.deploy-demo',
        distBower: '.tmp/.dist-bower',
        deployBower: '.tmp/.deploy-bower',
        iconfont: '.tmp/.iconfont'
    }
};

var helper = {
    sass: function (options) {
        var opt = _.extend({
            //importer: sassImportOnce,
            outputStyle: 'expanded'
        }, options);
        return sass(opt).on('error', sass.logError);
    }
};


/**
 *
 *
 * CODE QUALITY TASKS
 *
 *
 */
gulp.task('scss-lint', function(done) {
    var scssLint = spawn('scss-lint', [], { stdio: [0, 1, 2] });

    scssLint.on('exit', function (code) {
        // Instantiate a PluginError seems to be the only way to fail the task
        // without printing out the ugly stacktrace
        code === 0 ? done() : done(new gutil.PluginError('scss-lint','scss-lint task fails'));
    });
});


/**
 *
 *
 *
 *  DEMO/DEVELOPMENT TASKS
 *
 *
 *
 */

// webpack
var demoWebpackConfig = require('./webpack.demo.config')(config);
var demoWebpackCompiler = webpack(demoWebpackConfig);

gulp.task('demo', function(cb) {
	runSequence('demo:clean',['demo:styles', 'demo:scripts', 'demo:images', 'demo:icons', 'demo:assemble'], cb)
});

// clean
gulp.task('demo:clean', function (cb) {
    del([config.tmp.demo], cb);
});

// styles
gulp.task('demo:styles:fabricator', function () {
    gulp.src(config.src.styles.fabricator)
        .pipe(sourcemaps.init())
        .pipe(helper.sass())
        .pipe(prefix('last 1 version'))
        .pipe(rename('f.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(config.tmp.demo, '/assets/fabricator/styles')))
        .pipe(reload({stream: true}));
});

gulp.task('demo:styles', ['demo:styles:fabricator']);


// scripts
gulp.task('demo:scripts', function (done) {
    demoWebpackCompiler.run(function (error, result) {
        if (error) {
            gutil.log(gutil.colors.red(error));
        }
        result = result.toJson();
        if (result.errors.length) {
            result.errors.forEach(function (error) {
                gutil.log(gutil.colors.red(error));
            });
        }
        done();
    });
});


// images
gulp.task('demo:images', ['demo:favicon'], function () {
    return gulp.src(config.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.join(config.tmp.demo, '/assets/fabricator/img')));
});

// Generate the font by using what is found in the src/icons folder
// Generate the scss _generated/icons.scss to use icons as classes
gulp.task('demo:icons', ['demo:icons:clean'], function () {
    var runTimestamp = Math.round(Date.now()/1000);
    var fontName = 'DressCodeIcons';

    return gulp.src(config.src.icons)
        .pipe(gulp.dest(path.join(config.tmp.iconfont, '/svg-icons')))
        .pipe(iconfontCss({
            fontName: fontName,
            path: './src/templates/_icon.scss',
            targetPath: '../../../src/styles/_generated/_icon.scss', // this path to path.join(config.tmp.iconfont, '/fonts') ... weird
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
        .pipe(gulp.dest(path.join(config.tmp.iconfont, '/fonts')))
        .pipe(gulp.dest(path.join(config.tmp.demo, '/assets/fabricator/fonts')))
});

gulp.task('demo:icons:clean', function (cb) {
    del([config.tmp.iconfont], cb);
});

gulp.task('demo:favicon', function () {
    return gulp.src('./docs/demo/favicon.ico')
        .pipe(gulp.dest(config.tmp.demo));
});


// assemble
gulp.task('demo:assemble', function (done) {
    var basePath = gutil.env['demo-base-path'] ? gutil.env['demo-base-path'] : '';

    assemble({
        layouts: 'docs/demo/views/layouts/*',
        layoutIncludes: 'docs/demo/views/layouts/includes/*',
        views: ['docs/demo/views/**/*', '!docs/demo/views/+(layouts)/**'],
        materials: 'docs/demo/materials/**/*',
        data: 'docs/demo/data/**/*.{json,yml}',
        docs: ['docs/**/*.md', '!docs/BOWER-README.md'],
        logErrors: true,
        dest: config.tmp.demo,
        helpers: {
            basePath: function () {
                return basePath;
            }
        }
    });
    done();
});


// server
gulp.task('demo:serve', function () {

    browserSync({
        server: {
            baseDir: config.tmp.demo
        },
        notify: false,
        logPrefix: 'FABRICATOR',
        open: gutil.env.open || false
    });

    /**
     * Because webpackCompiler.watch() isn't being used
     * manually remove the changed file path from the cache
     */
    function webpackCache(e) {
        var keys = Object.keys(demoWebpackConfig.cache);
        var key, matchedKey;
        for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            key = keys[keyIndex];
            if (key.indexOf(e.path) !== -1) {
                matchedKey = key;
                break;
            }
        }
        if (matchedKey) {
            delete demoWebpackConfig.cache[matchedKey];
        }
    }

    gulp.task('demo:assemble:watch', ['demo:assemble'], reload);
    gulp.watch('docs/{demo,guides}/**/*.{html,md,json,yml}', ['demo:assemble:watch']);

    gulp.task('demo:styles:fabricator:watch', ['demo:styles:fabricator']);
    gulp.watch('docs/demo/assets/fabricator/styles/**/*.scss', ['demo:styles:fabricator:watch']);

    gulp.watch('src/styles/**/*.scss', ['demo:styles:fabricator:watch', 'scss-lint']);

    gulp.task('demo:scripts:watch', ['demo:scripts'], reload);
    gulp.watch('docs/demo/assets/fabricator/scripts/**/*.js', ['demo:scripts:watch']).on('change', webpackCache);

    gulp.task('demo:images:watch', ['demo:images'], reload);
    gulp.watch(config.src.images, ['demo:images:watch']);

    gulp.watch(config.src.icons, ['demo:icons']);

});

gulp.task('demo:deploy', ['demo'], function () {
    return gulp.src(path.join(config.tmp.demo, '/**/*'))
        .pipe(ghPages({
            cacheDir: config.tmp.deployDemo,
            remoteUrl: 'https://github.com/zalando/dress-code.git'
        }));
});


/**
 *
 *
 *
 *  DISTRIBUTION TASKS
 *
 *
 *
 */

// build and copy the result in the official versioned distribution folder (dist)
gulp.task('dist', function (cb) {
    return runSequence('scss-lint', 'dist:build', 'dist:clean-dist', 'dist:copy-dist', cb);
});

// build all distribution artifacts in a tmp folder
gulp.task('dist:build', function (cb) {
    return runSequence('dist:clean', ['dist:styles', 'dist:styles:src', 'dist:images', 'dist:icons'], cb);
});

gulp.task('dist:copy-dist', function () {
    return gulp.src(path.join(config.tmp.dist, '/**/*'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('dist:clean-dist', function (cb) {
    return del([config.dist], cb);
});

gulp.task('dist:clean', function (cb) {
    return del([config.tmp.dist], cb);
});

gulp.task('dist:styles', function () {
    return gulp.src(config.src.styles.toolkit)
        .pipe(helper.sass())
        .pipe(prefix('last 1 version'))
        .pipe(rename(pkg.name + '.css'))
        .pipe(gulp.dest(path.join(config.tmp.dist, 'css')))
        // minified
        .pipe(rename(pkg.name + '.min.css'))
        .pipe(csso())
        .pipe(gulp.dest(path.join(config.tmp.dist, 'css')));
});

gulp.task('dist:styles:src', function () {
    return gulp.src(path.join(config.path.styles.toolkit, '/**/*'))
        .pipe(gulp.dest(path.join(config.tmp.dist, 'sass')));
});


gulp.task('dist:images', function () {
    return gulp.src(config.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(path.join(config.tmp.dist, '/img')));
});

gulp.task('dist:icons', ['demo:icons'], function () {
    return gulp.src(path.join(config.tmp.iconfont, '/fonts/**'))
        .pipe(gulp.dest(path.join(config.tmp.dist, '/fonts')));
});

gulp.task('dist:changelog', function() {
    var changelogConfig = { preset: 'angular' };

    return gulp.src('CHANGELOG.md', {
        buffer: true
    })
    .pipe(conventionalChangelog(changelogConfig))
    .pipe(gulp.dest('./'));
});


/**
 *
 *
 *
 * DEFAULT TASK
 *
 *
 *
 */
gulp.task('default', function () {
    // run demo
    runSequence('demo', function () {
        gulp.start('demo:serve');
    });
});
