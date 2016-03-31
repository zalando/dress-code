var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');

gulp.task('lint', ['scss-lint']);

// lint sass files
gulp.task('scss-lint', function() {
    return gulp
        .src(['src/styles/**/*.scss'])
        .pipe(scssLint({config: '.scss-lint.yml'}))
        .pipe(scssLint.failReporter());
});
