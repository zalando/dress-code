var gulp = require('gulp');
var sassLint = require('gulp-sass-lint');

gulp.task('lint', ['sass-lint']);

// lint sass files
gulp.task('sass-lint', function() {
    return gulp
        .src(['src/styles/**/*.scss'])
        .pipe(sassLint({ configFile: '.sass-lint.yml'}))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});
