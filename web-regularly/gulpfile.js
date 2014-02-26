'use strict';

var fs = require('fs');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var serve = require('gulp-serve');
var wintersmith = require('gulp-wintersmith');


gulp.task('default', ['build', 'serve'], function() {
  /*
   * Build, serve, watch for changes, and livereload
   */
  var server = livereload();

  gulp.watch(['contents/**', 'templates/**', 'sass/**'], ['build'])
    .on('change', function(file) {
      server.changed(file.path);
    });
});

gulp.task('wintersmith', function() {
  /*
   * Use wintersmith to build initial pages
   */
  return gulp.src('config.json').pipe(wintersmith('build'));
});

gulp.task('sass', function() {
  /*
   * Generate css by compiling the sass
   */
  return gulp.src('sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['wintersmith', 'sass'], function() {
  /*
   * Build the project after wintersmith and sass are done
   */
  gulp.src('build/**/*.html')
    .pipe(replace('/* REPLACE WITH CSS */', fs.readFileSync('build/screen.css', 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', serve('dist'));
