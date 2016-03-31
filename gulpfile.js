var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('./gulp');

// build demo web site, starts a BrowerSync instance and watch for changes
gulp.task('serve', ['demo:serve']);

gulp.task('default', ['serve']);
