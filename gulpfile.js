const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');



gulp.task('js', function () {
  return gulp.src('src/**/*.js')
          .pipe(sourcemaps.init())
          .pipe(babel({
              presets: ['es2015']
          }))
          .pipe(concat('all.js'))
          .pipe(uglify())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('dist'));
});



gulp.task('default', ['js'], function () {

    return gulp.watch(['src/**/*.js'],['js']);
});
