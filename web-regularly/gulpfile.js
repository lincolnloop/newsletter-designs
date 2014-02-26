'use strict';

var fs = require('fs');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var wintersmith = require('gulp-wintersmith');


gulp.task('default', ['build'], function() {
  /*
   * Watch for changes in the contents or templates, and livereload
   */
  var server = livereload();
  gulp.watch(['contents/**', 'templates/**'], ['build'])
    .on('change', function(file) {
      server.changed(file.path);
    });
});

gulp.task('wintersmith', function() {
  /*
   * Use wintersmith to build initial pages
   */
  gulp.src('config.json').pipe(wintersmith('build'));
});

gulp.task('sass', function() {
  /*
   * Generate css by compiling the sass
   */
  gulp.src('sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['wintersmith', 'sass'], function() {
  /*
   * Build the project after wintersmith and sass are done
   */
  fs.readFile('build/screen.css', function (err, data) {
    // Once the CSS file is finished reading, add it inline within the html
    gulp.src('build/**/*.html')
      .pipe(replace('/* REPLACE WITH CSS */', data.toString()))
      .pipe(gulp.dest('dist'));
  });
});
