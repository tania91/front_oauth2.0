var gulp = require('gulp'),
concat = require('gulp-concat'),
pug = require('gulp-pug'),
watch = require('gulp-watch'),
rename = require('gulp-rename'),
browserSync = require('browser-sync').create(),
notify = require("gulp-notify"),
express = require('express');



var scripts = require('./scripts');
var styles = require('./styles');

var devModule = false;


/*
*Configuracion de la tarea 'css'
*/
gulp.task('css', function() {
    gulp.src(styles)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./dest/css'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

/*
*Configuracion de la tarea 'scripts'
*/
gulp.task('scripts', function() {
    gulp.src(scripts)
    .pipe(concat('app.js' ))    
    .pipe(gulp.dest('./dest/scripts'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

gulp.task('html', function() {
    gulp.src('./source/pug/**/*.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('./dest/html'))
    .pipe(browserSync.reload({
    	stream: true
    }));
});

gulp.task('build', function(){
	gulp.start(['css', 'scripts', 'html']);
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
    	open: false,
    	server: {
    		baseDir: 'dest'
    	}

    });
});

gulp.task('start', function() {
    devMode = true;
    gulp.start(['build', 'browser-sync']);
    gulp.watch(['/source/css/**/*.css'],['css']);
    gulp.watch(['./source/pug/**/*.pug'],['html']);
    gulp.watch(['./source/scripts/**/*.js'],['scripts']);
});