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
    .pipe(gulp.dest(config.publicDir + '/css/vendor'));
  gulp.src([
      // js files from vendors in bower_components
      config.bowerDir + '/bootstrap/dist/js/bootstrap.js',
      config.bowerDir + '/bootstrap/dist/js/bootstrap.min.js',
      config.bowerDir + '/jquery/dist/jquery.js',
      config.bowerDir + '/jquery/dist/jquery.min.js',
    ])
    .pipe(gulp.dest(config.publicDir + '/js/vendor'));
  gulp.src([
      config.bowerDir + '/fontawesome/fonts/*.*'
    ])
    .pipe(gulp.dest(config.publicDir + '/fonts/'));
  gulp.src([
      config.bowerDir + '/bootstrap/fonts/*.*'
    ])
    .pipe(gulp.dest(config.publicDir + '/fonts/'));
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
      pretty: true,
    }))
    .pipe(gulp.dest(config.publicDir))
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

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.sass', ['sass']);
  gulp.watch(config.jadePath + '/**/*.jade', ['jade']);
  gulp.watch(config.coffeePath + '/**/*.coffee', ['coffee']);
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
gulp.task('default', ['copy', 'jade', 'sass', 'coffee', 'watch', 'webserver']);
