"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // run a local web server
var open = require('gulp-open'); //open URL in a new browser
var browserify = require('browserify'); //bundle js
var source = require('vinyl-source-stream'); //use conventional text stream with gulp
var concat = require('gulp-concat'); //Concatenates files
var lint = require('gulp-eslint'); //Lint JS files, including JSX


var config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths: {
    html: './src/*.html',
    js: './src/**/*.js',
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        'node_modules/toastr/build/toastr.css'
    ],
    dist: './dist',
    mainJs: './src/main.js'

  }
}

// './src/*.html' ---> go into the src folder and find any html file

//start a local dev server
gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  })
});

// open a given file --> when you run open first run connect
gulp.task('open', ['connect'], function() {
  gulp.src('dist/index.html')
      .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
})

// get any html file, put it in the dest file defined above then reload.
gulp.task('html', function() {
  gulp.src(config.paths.html)
      .pipe(gulp.dest(config.paths.dist))
      .pipe(connect.reload());
});

gulp.task('js', function() {
  browserify(config.paths.mainJs)
    .transform("babelify", {presets: ["react"]})
    .bundle() //bundle in the same file
    .on('error', console.error.bind(console)) //spit error on console
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function() {
	return gulp.src(config.paths.js)
		.pipe(lint({config: '.eslintrc'})) //new syntax
		.pipe(lint.format());
});

// reload the browser everytime a change is made
gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js', 'lint']);
});

// default task
gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
