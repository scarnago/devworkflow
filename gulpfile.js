var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  sass = require('gulp-ruby-sass'),
  autoprefix = require('gulp-autoprefixer'),
  coffee = require('gulp-coffee'),
  webserver = require('gulp-webserver'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify');

var config = {
  sassPath: './app/sass',
  jadePath: './app/jade',
  coffeePath: 'app/coffee',
  bowerDir: './bower_components',
  publicDir: 'public'
};

// sass compile task
gulp.task('sass', function() {
  return gulp.src(config.sassPath + '/**/*.sass')
    .pipe(sass({
        style: 'compressed',
        loadPath: [
          config.sassPath,
          config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
          config.bowerDir + '/fontawesome/scss',
        ]
      })
      .on("error", notify.onError(function(error) {
        return "Error: " + error.message;
      })))
    .pipe(autoprefix('last 2 version'))
    .pipe(gulp.dest('./public/css'));
});

// jade compile task
gulp.task('jade', function() {
  gulp.src(config.jadePath + '/**/*.jade')
    .pipe(jade({
      pretty: '\t',
    }))
    //.on('error', console.log('Error'))
    .pipe(gulp.dest(config.publicDir));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.sass', ['sass']);
  gulp.watch(config.jadePath + '/**/*.jade', ['jade']);
  gulp.watch(config.jadePath + '/**/*.coffee', ['coffee']);
});

// Execute webserver with livereload
gulp.task('webserver', function() {
  gulp.src(config.publicDir)
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: 'index.html'
    }));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'jade', 'sass', 'coffee', 'webserver']);
