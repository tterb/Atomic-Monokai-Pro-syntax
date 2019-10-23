const gulp = require('gulp'),
      run = require('gulp-run'),
      gutil = require('gulp-util'),
      cssnano = require('cssnano'),
      cp = require('child_process'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      sass = require('gulp-ruby-sass'),
      plumber = require('gulp-plumber'),
      postcss = require('gulp-postcss'),
      imagemin = require('gulp-imagemin'),
      browserSync = require('browser-sync').create(),
      autoprefixer = require('autoprefixer');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', function (done) {
  return gulp.src('')
    .pipe(run('bundle exec jekyll build --config _config.yml'))
    .on('error', gutil.log);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
  browserSync.init({
    server: '_site/',
    ghostMode: false,   // Toggle to mirror clicks, reloads etc (performance)
    logFileChanges: true,
    logLevel: 'debug',
    open: true         // Toggle to auto-open page when starting
  });
});

/*
* Compile and minify sass
*/
gulp.task('sass', function() {
  return sass('src/styles/main.scss', {
    style: 'compressed',
    trace: true,
    loadPath: ['src/styles/']
  }).pipe(postcss([autoprefixer({ browsers: ['last 2 versions']}), cssnano()]))
    .pipe(gulp.dest('assets/css/'))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

/*
* Compile fonts
*/
gulp.task('fonts', function() {
  gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
  .pipe(plumber())
  .pipe(gulp.dest('assets/fonts/'));
})

/*
 * Minify images
 */
gulp.task('imagemin', function() {
  return gulp.src('src/img/**/*.{jpg,png,gif}')
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('assets/img/'));
});

/**
 * Compile and minify js
 */
gulp.task('js', function(){
  return gulp.src('src/js/**/*.js')
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'))
});

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss', ['sass', 'jekyll-rebuild']);
  // gulp.watch('_sass/**/*.scss', ['sass', 'jekyll-rebuild']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/fonts/**/*.{tff,woff,woff2}', ['fonts']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
  gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], ['jekyll-rebuild']);
});

gulp.task('default', ['js', 'sass', 'fonts', 'imagemin', 'browser-sync', 'watch']);
gulp.task('build', ['js', 'sass', 'fonts', 'imagemin', 'jekyll-build']);
