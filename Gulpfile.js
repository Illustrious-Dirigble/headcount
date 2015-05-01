'use strict'
var gulp = require('gulp');
var jsdoc = require("gulp-jsdoc");



/**
 *
 * The below example shows how we can create jsdocs for all our js files in the src directory.
 */
gulp.task('jsdoc', function() {
  var infos = {
    name: '',
    description: '',
    version: '',
    licenses: '',
    plugins: ''
  };

  return gulp.src(["./src/*.js", "README.md"])
  .pipe(jsdoc.parser(infos, name))
  .pipe(jsdoc.generator('./destination'))

});

// gulp.task('jsDocs', function() {
//   // place code for your default task here


// });
