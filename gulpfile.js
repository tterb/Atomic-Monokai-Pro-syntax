var gulp = require('gulp'),
    csso = require('gulp-csso'),
    uncss = require('gulp-uncss'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    cp = require('child_process'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', function (done) {
  return cp.spawn(jekyllCommand, ['build'], {stdio: 'inherit'})
    .on('close', done);
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
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

/*
* Compile and minify sass
*/
gulp.task('sass', function() {
  gulp.src('src/styles/**/*.scss')
  // gulp.src('_sass/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    // .pipe(uncss({
    //   html: ['_site/**/*.html'],
    //   ignore: []
    // }))
    .pipe(csso())
    .pipe(gulp.dest('assets/css/'));
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

gulp.task('default', ['js', 'sass', 'fonts', 'browser-sync', 'watch']);
