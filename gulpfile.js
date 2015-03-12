var gulp = require('gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  jade = require('gulp-jade'),
  sass = require('gulp-ruby-sass'),
  stylus = require('gulp-stylus'),
  autoprefix = require('gulp-autoprefixer'),
  coffee = require('gulp-coffee'),
  webserver = require('gulp-webserver'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  optipng = require('imagemin-optipng'),
  jpegtran = require('imagemin-jpegtran'),
  browserify = require('gulp-browserify'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify');

var config = {
  sassPath: './app/sass',
  jadePath: './app/jade',
  coffeePath: './app/coffee',
  stylusPath: './app/stylus',
  srcDir: './app/src',
  bowerDir: './bower_components',
  publicDir: './public'
};

// copy multiple files at once
gulp.task('copy', function() {
  gulp.src([
      // css files from vendors in bower_components
      config.bowerDir + '/bootstrap/dist/css/bootstrap.min.css',
      config.bowerDir + '/bootstrap/dist/css/bootstrap.css',
      config.bowerDir + '/fontawesome/css/font-awesome.css',
      config.bowerDir + '/fontawesome/css/font-awesome.min.css',
    ])
    .pipe(gulp.dest(config.publicDir + '/css'));
  gulp.src([
      // js files from vendors in bower_components
      config.bowerDir + '/bootstrap/dist/js/bootstrap.js',
      config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
      config.bowerDir + '/jquery/dist/jquery.js',
      config.bowerDir + '/jquery/dist/jquery.min.js',
      config.bowerDir + '/html5shiv/dist/html5shiv.min.js',
      config.bowerDir + '/respond/dest/respond.min.js',
    ])
    .pipe(gulp.dest(config.publicDir + '/js'));
  gulp.src([
      config.bowerDir + '/fontawesome/fonts/*.*'
    ])
    .pipe(gulp.dest(config.publicDir + '/fonts'));
  gulp.src([
      config.bowerDir + '/bootstrap/fonts/*.*'
    ])
    .pipe(gulp.dest(config.publicDir + '/fonts'))
    .pipe(notify({
      message: 'All your base files has been copied to public'
    }));
});

// sass compile task
gulp.task('sass', function() {
  return sass(config.sassPath, {
    style: 'expanded'
  })
    .on('error', function(err) {
      console.error('Error!', err.message);
    })
    .pipe(autoprefix({
      browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    }))
    .pipe(gulp.dest(config.srcDir + '/css'))
    .pipe(notify({
      message: 'Your SASS file has been compiled and auto-prefixed.'
    }));
});

// stylus compile task
gulp.task('stylus', function () {
  gulp.src(config.stylusPath + '/*.styl')
    .pipe(stylus())
    .pipe(autoprefix({
      browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    }))
    .pipe(gulp.dest(config.srcDir + '/css'))
    .pipe(notify({
      message: 'Your Stylus files has been compiled and auto-prefixed.'
    }));
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
  gulp.src([config.jadePath + '/*.jade', '!' + config.jadePath + '/_*.jade', '!' + config.jadePath + '/mixins/*.jade'])
    .pipe(jade({
      pretty: true,
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(config.publicDir))
    .pipe(notify({
      message: 'Your Jade file has been molded into HTML.'
    }));
  gulp.src([config.jadePath + '/admin/*.jade', '!' + config.jadePath + '/admin/_*.jade', '!' + config.jadePath + '/mixins/*.jade', '!' + config.jadePath + '/mixins/_*.jade'])
    .pipe(jade({
      pretty: true,
    }))
    .on('error', gutil.log)
    .pipe(gulp.dest(config.publicDir + '/admin'))
    .pipe(notify({
      message: 'Your Jade file has been molded into HTML.'
    }));
});

// Concat CSS files
gulp.task('concatcss', function() {
  return gulp.src(config.srcDir + '/css/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.publicDir + '/css'))
    .pipe(notify({
      message: 'All your CSS files has been concatenated into style.css'
    }));
});

// Concat Javascript files
gulp.task('concatjs', function() {
  return gulp.src(config.srcDir + '/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.publicDir + '/js'))
    .pipe(notify({
      message: 'All your JS files has been concatenated and minify into main.js'
    }));
});

gulp.task('images', function () {
    return gulp.src([config.srcDir + '/images/*.png', config.srcDir + '/images/*.jpg'])
        .pipe(optipng({optimizationLevel: 3})())
        .pipe(jpegtran({progressive: true})())
        .pipe(gulp.dest(config.publicDir + '/assets/images'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.sass', ['sass']);
  gulp.watch(config.stylusPath + '/**/*.styl', ['stylus']);
  gulp.watch(config.jadePath + '/**/*.jade', ['jade']);
  gulp.watch(config.coffeePath + '/**/*.coffee', ['coffee', 'concatjs']);
  gulp.watch(config.srcDir + '/images/*.png', ['images']);
  gulp.watch(config.srcDir + '/images/*.jpg', ['images']);
  gulp.watch(config.srcDir + '/js/**/*.js', ['concatjs']);
  gulp.watch(config.srcDir + '/css/**/*.css', ['concatcss']);
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
gulp.task('default', ['copy', 'jade', 'stylus', 'sass', 'coffee', 'watch', 'images', 'webserver']);
