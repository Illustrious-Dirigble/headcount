// require gulp and any plugins
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

/**
 *  Default gulp task: gulp.src points to location
 *  of file(s), .pipe allows you to send the specified
 *  file(s) through a series of plugins, and gulp.dest
 *  specifies the destination of the output.
 *
 *  This specific example doesn't really do anything
 *  other than illustrate an example of some files getting
 *  concatenated, renamed to an appropriate file name, and
 *  then uglified, then outputted into a make-believe
 *  directory.
 *
 *  I like Gulp.
 */

gulp.task('default', function() {
  return gulp.src(['file1.js', 'file2.js', 'file3.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./jsdir/'))
    .pipe(rename('uglify.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./jsdir/'));
});
