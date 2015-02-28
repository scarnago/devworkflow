var gulp = require('gulp'),
	gutil = require('gulp-util'),
	jade = require('gulp-jade'),
	sass = require('gulp-ruby-sass'),
	autoprefix = require('gulp-autoprefixer'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	browserify = require('gulp-browserify'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify');

var config = {
    sassPath: './app/sass',
    bowerDir: './bower_components'
};

gulp.task('css', function() {
    return gulp.src(config.sassPath + '/**/*.sass')
        .pipe(sass({
            style: 'compressed',
            loadPath: [
                config.sassPath,
                config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                config.bowerDir + '/fontawesome/scss',
            ]
        })
        .on("error", notify.onError(function (error) {
            return "Error: " + error.message;
        })))
        .pipe(autoprefix('last 2 version'))
        .pipe(gulp.dest('./public/css'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(config.sassPath + '/**/*.sass', ['css']);
});
