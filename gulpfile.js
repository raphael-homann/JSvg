const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

gulp.task('default', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    var n = 0;
    var gulpify = function() {
        try {
            gulp.src('src/**/*.js')
                .pipe(sourcemaps.init())
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(concat('all.js'))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist'));
        } catch(e) {
            console.log(e);
        }
        console.log("gulpified "+(n++));
    };

    gulpify();
    return watch('src/**/*.js',gulpify) ;
});
