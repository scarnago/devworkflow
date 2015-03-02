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
  coffeePath: './app/coffee',
  srcDir: './app/src',
  bowerDir: './bower_components',
  publicDir: 'public'
};

// sass compile task
gulp.task('sass', function() {
  return sass(config.sassPath)
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
      .pipe(autoprefix({
              browsers: ['last 2 versions'],
              cascade: false
          }))
    .pipe(gulp.dest(config.srcDir + '/css'));
});

gulp.task('coffee', function() {
  return gulp.src(config.coffeePath + '/**/*.coffee')
    .pipe(coffee({
      bare: true
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(config.srcDir + '/js'));
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

// Concat files
gulp.task('concatCss', function() {
  return gulp.src(config.srcDir + '/css/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.publicDir + '/css'));
});

// Image optimization
gulp.task('imagemin', ['clean'], function() {
  return gulp.src(config.srcDir + '/images')
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(config.publicDir + 'assets/images'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.sass', ['sass']);
  gulp.watch(config.jadePath + '/**/*.jade', ['jade']);
  gulp.watch(config.coffeePath + '/**/*.coffee', ['coffee']);
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
gulp.task('default', ['watch', 'jade', 'sass', 'coffee', 'concatCss', 'imagemin', 'webserver']);
