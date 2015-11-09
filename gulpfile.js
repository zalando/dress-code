'use strict';

// modules
var path = require('path');
var assemble = require('fabricator-assemble');
var browserSync = require('browser-sync');
var csso = require('gulp-csso');
var del = require('del');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var reload = browserSync.reload;
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var gulpFilter = require('gulp-filter');
var gulpDebug = require('gulp-debug');
var pkg = require('./package.json');

// configuration
var config = {
	pkg: pkg,
	dev: gutil.env.dev,
	path: {
		styles: {
			toolkit: './src/assets/toolkit/styles/'
		}
	},
	src: {
		scripts: {
			fabricator: './src/assets/fabricator/scripts/fabricator.js',
			toolkit: './src/assets/toolkit/scripts/toolkit.js'
		},
		styles: {
			fabricator: './src/assets/fabricator/styles/fabricator.scss',
			toolkit: './src/assets/toolkit/styles/toolkit.scss'
		},
		images: './src/assets/toolkit/img/**/*',
		views: './src/toolkit/views/*.html'
	},
	demo: 'demo',
	dist: 'dist',
	distBower: '.dist-bower'
};


/**
 *
 *
 *
 *  DEMO TASKS
 *
 *
 *
 */

// webpack
var demoWebpackConfig   = require('./webpack.demo.config')(config);
var demoWebpackCompiler = webpack(demoWebpackConfig);

gulp.task('demo', function(cb) {
	runSequence('demo:clean',['demo:styles', 'demo:scripts', 'demo:images', 'demo:assemble'], cb)
});

// clean
gulp.task('demo:clean', function (cb) {
	del([config.demo], cb);
});

// styles
gulp.task('demo:styles:fabricator', function () {
	gulp.src(config.src.styles.fabricator)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!config.dev, csso()))
		.pipe(rename('f.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.join(config.demo , '/assets/fabricator/styles')))
		.pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('demo:styles:toolkit', function () {
	gulp.src(config.src.styles.toolkit)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix('last 1 version'))
		.pipe(gulpif(!config.dev, csso()))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.join(config.demo , '/assets/toolkit/styles')))
		.pipe(gulpif(config.dev, reload({stream:true})));
});

gulp.task('demo:styles', ['demo:styles:fabricator', 'demo:styles:toolkit']);


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
		.pipe(gulp.dest(path.join(config.demo , '/assets/toolkit/img')));
});

gulp.task('demo:favicon', function () {
	return gulp.src('./src/favicon.ico')
		.pipe(gulp.dest(config.demo));
});


// assemble
gulp.task('demo:assemble', function (done) {
	assemble({
		logErrors: true,
		dest: 'demo'
	});
	done();
});


// server
gulp.task('demo:serve', function () {

	browserSync({
		server: {
			baseDir: config.demo
		},
		notify: false,
		logPrefix: 'FABRICATOR'
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
	gulp.watch('src/**/*.{html,md,json,yml}', ['demo:assemble:watch']);

	gulp.task('demo:styles:fabricator:watch', ['demo:styles:fabricator']);
	gulp.watch('src/assets/fabricator/styles/**/*.scss', ['demo:styles:fabricator:watch']);

	gulp.task('demo:styles:toolkit:watch', ['demo:styles:toolkit']);
	gulp.watch('src/assets/toolkit/styles/**/*.scss', ['demo:styles:toolkit:watch']);

	gulp.task('demo:scripts:watch', ['demo:scripts'], reload);
	gulp.watch('src/assets/{fabricator,toolkit}/scripts/**/*.js', ['demo:scripts:watch']).on('change', webpackCache);

	gulp.task('demo:images:watch', ['demo:images'], reload);
	gulp.watch(config.src.images, ['demo:images:watch']);

});

gulp.task('demo:deploy', ['demo'],  function() {
  return gulp.src(path.join(config.demo , '/**/*'))
    .pipe(ghPages({remoteUrl: 'https://github.com/zalando/brand-solutions-dress-code.git'}));
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

gulp.task('dist', function (cb) {
	runSequence('dist:clean',['dist:styles', 'dist:styles:src', 'dist:images'], cb);
});

gulp.task('dist:clean', function (cb) {
	del([config.dist], cb);
});

gulp.task('dist:styles', function () {
	return gulp.src(config.src.styles.toolkit)
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.init())
		.pipe(prefix('last 1 version'))
		.pipe(sourcemaps.write())
		.pipe(rename(pkg.name + '.css'))
		.pipe(gulp.dest(path.join(config.dist, 'css')))
		 // minified
		.pipe(rename(pkg.name + '.min.css'))
		.pipe(csso())
		.pipe(gulp.dest(path.join(config.dist, 'css')));
});

gulp.task('dist:styles:src', function () {
	return gulp.src(path.join(config.path.styles.toolkit, '/**/*'))
		.pipe(gulp.dest(path.join(config.dist, 'sass')))
		.pipe(gulpFilter(['_base.scss','_import.scss']))
		// this replace relative imports inside _base.scss
		.pipe(replace(/@import "..\/..\/..\/..\/(.*)"/g, function (match, p1) {
			return '@import "../../' + p1 + '"';
		}))
		.pipe(gulp.dest(path.join(config.dist, 'sass')));
});


gulp.task('dist:images', function () {
	return gulp.src(config.src.images)
		.pipe(imagemin())
		.pipe(gulp.dest(path.join(config.dist, '/img')));
});

gulp.task('dist:bower:clean', function (cb) {
	del([config.distBower], cb);
});


gulp.task('dist:bower', ['dist:bower:clean','dist'], function () {
	return gulp.src([
		path.join(config.dist, '/**/*'),
		'bower.json',
		'LICENSE',
		'README.md',
		'.editorconfig',
		'.jshintrc'
	])
	.pipe(gulp.dest(config.distBower))
	.pipe(gulpFilter(['**/sass/_import.scss','**/sass/_base.scss']))
	.pipe(replace(/@import "..\/..\/node_modules\/(.*)"/g, function (match, p1) {
		if(p1.indexOf('breakpoint-sass') > -1) {
			return '@import "../../compass-breakpoint/stylesheets/breakpoint"';
		}else{
			return '@import "../../' + p1 + '"';
		}
	}))
	.pipe(gulp.dest(config.distBower));
});

gulp.task('dist:bower:deploy', ['dist:bower'], function () {
	return gulp.src(path.join(config.distBower , '/**/*'))
		.pipe(ghPages({
			cacheDir: '.publish-bower',
			branch: 'master',
			remoteUrl: 'git@github.com:zalando/brand-solutions-dress-code-bower'
		}));
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
